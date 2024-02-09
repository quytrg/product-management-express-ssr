const mongoose = require("mongoose")

const chatRoomSchema = new mongoose.Schema({
    title: String,
    avatar: String,
    status: {
        type: String,
        default: 'active'
    },
    roomType: String,
    users: [
        {
            user_id: String,
            role: String
        }
    ],
    deleted: {
        type: Boolean,
        default: false
    },
    deletedAt: Date,
}, { timestamps: true });

const ChatRoom = mongoose.model("ChatRoom", chatRoomSchema);

module.exports = ChatRoom;
