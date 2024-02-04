const mongoose = require("mongoose");
const generate = require("../helpers/generate");

const userSchema = new mongoose.Schema({
    fullName: String,
    email: String,
    password: String,
    token: {
        type: String,
        default: generate.generateRandomString(30),
    },
    phone: String,
    avatar: String,
    friendList: [
        {
          user_id: String,
          room_chat_id: String,
        }
    ],
    acceptFriends: Array,
    requestFriends: Array,
    status: {
        type: String,
        default: 'active'
    },
    onlineStatus: {
        type: String,
        default: 'online'
    },
    deleted: {
        type: Boolean,
        default: false,
    },
    deletedAt: Date,
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

module.exports = User;
