const mongoose = require("mongoose");

const laboratorySchema = new mongoose.Schema(
    {
        patient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Patient",
            required: true,
        },
        doctor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        labTechnician: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: false,
        },
        testName: {
            type: String,
            required: true,
        },
        category: String,
        results: String,
        notes: String,
        status: {
            type: String,
            enum: ["pending", "completed"],
            default: "pending",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Laboratory", laboratorySchema);
