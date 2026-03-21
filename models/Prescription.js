const mongoose = require("mongoose");

const prescriptionSchema = new mongoose.Schema(
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
        medicines: [
            {
                medicine: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Medicine",
                    required: true,
                },
                dosagePattern: {
                    type: String, // Keep for backward compatibility/quick display
                    required: true,
                },
                morning: {
                    type: Number,
                    default: 0
                },
                afternoon: {
                    type: Number,
                    default: 0
                },
                evening: {
                    type: Number,
                    default: 0
                },
                timing: {
                    type: String,
                    enum: ["before", "after"],
                    default: "after"
                },
                days: {
                    type: Number,
                    required: true,
                },
                totalQuantity: {
                    type: Number,
                    required: true,
                },
            },
        ],
        diagnosis: {
            type: String,
        },
        notes: {
            type: String,
        },
        status: {
            type: String,
            enum: ["pending", "dispensed"],
            default: "pending",
        },
        dispensedAt: {
            type: Date,
        },
        dispensedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Prescription", prescriptionSchema);
