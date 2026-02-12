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
                    type: String, // ex: "1-0-1"
                    required: true,
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
