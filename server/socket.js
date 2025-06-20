import { Server } from 'socket.io';
import Message from './models/MessageModel.js';

const setupSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: process.env.ORIGIN,
            methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
            credentials: true
        }
    });

    const userSocketMap = new Map();

    const sendMessage = async (message) => {
        console.log(message)
        const senderSocketId = userSocketMap.get(message.sender);
        const recipientSocketId = userSocketMap.get(message.recipient);

        const createdMessage = await Message.create(message);

        const messageData = await Message.findById(createdMessage._id)
            .populate("sender", "id email name firstName lastName profileImg")
            .populate("recipient", "id email name firstName lastName profileImg");

        if (recipientSocketId) {
            io.to(recipientSocketId)
                .emit('receive-message', messageData);
        }
        if (senderSocketId) {
            io.to(senderSocketId)
                .emit('receive-message', messageData);
        }
    }


    io.on('connection', (socket) => {
        const userId = socket.handshake.query.userId;

        if (userId) {
            userSocketMap.set(userId, socket.id);
            console.log(`User connected: ${userId} with socket ID: ${socket.id}`);
        } else {
            console.log('UserID not provided during connection');
        }

        socket.on('send-message', sendMessage)

        socket.on('disconnect', () => {
            console.log(`Client Disconnected: SocketID: ${socket.id}`);
            userSocketMap.forEach((value, key) => {
                if (value === socket.id) {
                    userSocketMap.delete(key);
                }
            });
        });
    });
};

export default setupSocket;
