import express from 'express';
import passport, { generateTokens, verifyRefreshToken } from '../auth/passportConfig.js';
import Message from '../models/MessageModel.js';
const msgRouter = express.Router();
import multer from 'multer';
import cloudinary, { storage } from '../cloudinary/config.js';

const upload = multer({
    storage,
    limits: { fileSize: 1000000 },
});


msgRouter.post('/dm', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const user1 = req.user.id;
        const user2 = req.body.id;

        if (!user1 || !user2) {
            return res.status(400).send('Incomplete Info provided. Error fetching messages.');
        }

        const messages = await Message.find({
            $or: [
                { sender: user1, recipient: user2 },
                { sender: user2, recipient: user1 },
            ]
        }).sort({ createdAt: 1 });

        return res.status(200).json({ messages });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error.' });
    }
});

msgRouter.post('/upload-file', passport.authenticate('jwt', { session: false }), upload.single("uploaded-file"), async (req, res) => {
    try {
        console.log(req.file)
        if (!req.file) {
            return res.status(400).json({ message: 'No file attached to upload. Please select a file to upload' });
        }
        return res.status(200).json({ file: req.file });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error.' });
    }
})


export default msgRouter;