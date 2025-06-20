import express from 'express';
import passport from '../auth/passportConfig.js';
import Channel from '../models/ChannelModel.js';
import User from '../models/UserModel.js';

const channelRouter = express.Router();

channelRouter.get('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const userId = req.user.id;
        const channels = await Channel.find({
            $or: [{ admin: userId }, { members: userId }]
        }).sort({ updatedAt: -1 });

        return res.status(200).json({ channels });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error.' });
    }

})

channelRouter.post('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const { name, members } = req.body;
        const userId = req.user.id;

        console.log(req.body);

        // Check if the admin (current user) exists
        const admin = await User.findById(userId);
        if (!admin) {
            return res.status(400).json({ message: "Admin Not Found" });
        }

        // Check if all members are valid users
        const validMembers = await User.find({
            _id: { $in: members },
        });

        if (validMembers.length !== members.length) {
            return res.status(400).json({ message: "One or more members are invalid" });
        }

        // Create a new channel with the given data
        const newChannel = new Channel({
            name,
            members,
            admin: userId,
        });
        await newChannel.save();

        // Return the newly created channel
        return res.status(200).json({ channel: newChannel });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error.' });
    }
});

export default channelRouter;
