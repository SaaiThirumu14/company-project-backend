const mongoose = require("mongoose");

const consultationSchema = new mongoose.Schema(
    {
        patient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Patient",
            required: true,
        },
        doctor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: false,
        },
        date: {
            type: Date,
            default: Date.now,
        },
        vitals: {
            bloodPressure: String,
            temperature: String,
            weight: String,
            pulse: String,
        },
        chiefComplaint: String,
        diagnosis: String,
        notes: String,
        prescription: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Prescription",
        },
        status: {
            type: String,
            enum: ["pending", "completed"],
            default: "pending",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Consultation", consultationSchema);
