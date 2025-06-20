import dotenv from "dotenv";
import express from "express";
import http from "http";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import authRouter from "./routes/AuthRoutes.js";
import contactsRouter from "./routes/ContactsRoutes.js";
import setupSocket from "./socket.js";
import msgRouter from "./routes/MessageRoutes.js";
import channelRouter from "./routes/ChannelRoutes.js";

dotenv.config();
const PORT = process.env.PORT || 5000;

const app = express();
const server = http.createServer(app); // Create an HTTP server

const DATABASE_URL = process.env.DATABASE_URL;
mongoose.connect(DATABASE_URL)
    .then(() => console.log("Database connection successful"))
    .catch(err => console.log("Database connection error:", err));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({
    origin: [process.env.ORIGIN],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true
}));
app.use(cookieParser());
app.use('/api/auth', authRouter);
app.use('/api/contacts', contactsRouter);
app.use('/api/messages', msgRouter);
app.use('/api/channels', channelRouter);

// Initialize Socket.IO with the HTTP server
setupSocket(server);

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
