const mongoose = require("mongoose");

const LoginLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    username: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    ipAddress: {
        type: String,
        required: true
    },
    userAgent: {
        type: String
    },
    loginTime: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ["success", "failed"],
        default: "success"
    }
}, { timestamps: true });

module.exports = mongoose.model("LoginLog", LoginLogSchema);
