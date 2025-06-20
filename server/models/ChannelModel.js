import mongoose from "mongoose";

const channelSchema = new mongoose.Schema({
    name: {
        type: String, // Corrected to 'type'
        required: true
    },
    members: [{
        type: mongoose.Schema.ObjectId, // Corrected to 'type'
        ref: "Users",
        required: true,
    }],
    admin: {
        type: mongoose.Schema.ObjectId, // Admin should be a single ObjectId
        ref: "Users",
        required: true,
    },
    messages: [{
        type: mongoose.Schema.ObjectId, // Corrected to 'type'
        ref: "Messages",
    }]
}, { timestamps: true, toJSON: { virtuals: true } });

const Channel = mongoose.model('Channels', channelSchema);
export default Channel;
