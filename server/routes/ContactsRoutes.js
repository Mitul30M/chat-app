import express, { request } from 'express';
import passport, { generateTokens, verifyRefreshToken } from '../auth/passportConfig.js';
import User from '../models/UserModel.js';
import mongoose from 'mongoose';
import Message from '../models/MessageModel.js';
const contactsRouter = express.Router();

contactsRouter.post('/search', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const { searchTerm } = req.body;
        if (!searchTerm) {
            return res.status(400).send('Search Term is required.');
        }

        const sanitizeSearchTerm = searchTerm.replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&"
        );
        const regex = new RegExp(sanitizeSearchTerm, "i");

        const contacts = await User.find({
            $and: [{ _id: { $ne: req.user._id } }, {
                $or: [{ firstName: regex }, { lastName: regex },]
            }]
        });

        return res.status(200).json({ contacts });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error.' });
    }
});

contactsRouter.get('/dm-contacts', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        let { id: userId } = req.user;
        userId = new mongoose.Types.ObjectId(userId);

        const contacts = await Message.aggregate([
            {
                $match: {
                    $or: [{ sender: userId }, { recipient: userId }]
                }
            },
            {
                $sort: { createdAt: -1 }  // Sort messages by creation time
            },
            {
                $group: {
                    _id: {
                        $cond: {
                            if: { $eq: ["$sender", userId] },
                            then: "$recipient",   // If the sender is the current user, group by the recipient
                            else: "$sender"       // If the recipient is the current user, group by the sender
                        }
                    },
                    lastMsgTime: { $first: "$createdAt" },  // Get the latest message's creation time
                    lastMessage: { $first: "$content" },    // Get the latest message content (text or null for files)
                    messageType: { $first: "$messageType" }, // Get the type of the latest message
                    originalFileName: {
                        $first: {
                            $cond: { if: { $eq: ["$messageType", "file"] }, then: "$originalFileName", else: null }
                        }
                    }  // Get the original file name if the messageType is 'file'
                }
            },
            {
                $lookup: {
                    from: "users",  // The users collection
                    localField: "_id",  // Match the recipient/sender ID
                    foreignField: "_id",  // Match with the user ID in the users collection
                    as: "contactInfo"    // Store the matched user information
                }
            },
            {
                $unwind: "$contactInfo"  // Unwind the array of contact info (as we expect only one result)
            },
            {
                $project: {
                    _id: 1,  // The contact's ID
                    lastMsgTime: 1,
                    lastMessage: 1,
                    messageType: 1,
                    originalFileName: 1,  // Include original file name for file messages
                    contactInfo: {
                        id: "$contactInfo._id",
                        firstName: "$contactInfo.firstName",
                        lastName: "$contactInfo.lastName",
                        name: { $concat: ["$contactInfo.firstName", " ", "$contactInfo.lastName"] },
                        email: "$contactInfo.email",
                        profileImg: "$contactInfo.profileImg",
                        profileSetup: "$contactInfo.profileSetup",
                        createdAt: "$contactInfo.createdAt",
                        updatedAt: "$contactInfo.updatedAt"
                    }
                }
            }
        ]);

        return res.status(200).json({ contacts });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error.' });
    }
});

contactsRouter.get('/all-contacts', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const users = await User.find({
            _id: { $ne: req.user.id }
        });

        const contacts = users.map((user) => ({
            label: `${user.name}`,   // Corrected mapping here
            value: user._id          // Added user ID as a value for selection
        }));

        return res.status(200).json({ contacts });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error.' });
    }
});


export default contactsRouter;
