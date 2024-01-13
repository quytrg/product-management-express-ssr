const mongoose = require("mongoose")

const forgotPasswordSchema = new mongoose.Schema({
    email: String,
    otp: String,
    expireAt: {
        type: Date,
        expires: 180
    }
}, { timestamps: true });

const Cart = mongoose.model("ForgotPassword", forgotPasswordSchema);

module.exports = Cart;
