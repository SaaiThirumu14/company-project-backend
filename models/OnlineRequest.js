const mongoose = require("mongoose");

const onlineRequestSchema = new mongoose.Schema(
    {
        patientName: {
            type: String,
            required: true,
        },
        patientContact: {
            type: String,
            required: true,
        },
        date: {
            type: Date,
            required: true,
        },
        time: {
            type: String,
            required: true,
        },
        requestId: {
            type: String,
            unique: true,
        },
        status: {
            type: String,
            enum: ["Pending", "Approved"],
            default: "Pending",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("OnlineRequest", onlineRequestSchema);
