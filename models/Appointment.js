const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
    {
        patient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Patient",
        },
        patientName: {
            type: String,
            required: true,
        },
        patientContact: {
            type: String,
            required: true,
        },
        doctor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        date: {
            type: Date,
            required: true,
        },
        time: {
            type: String,
            required: true, // Format: HH:MM
        },
        status: {
            type: String,
            enum: ["Pending", "Confirmed", "Completed", "Cancelled"],
            default: "Pending",
        },
        type: {
            type: String,
            enum: ["Checkup", "Emergency", "Follow-up", "Routine"],
            default: "Checkup",
        },
        notes: {
            type: String,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Appointment", appointmentSchema);
