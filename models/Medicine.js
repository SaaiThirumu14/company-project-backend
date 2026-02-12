const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
        batchNumber: {
            type: String,
            required: true,
        },
        stockQuantity: {
            type: Number,
            required: true,
            default: 0,
        },
        lowStockThreshold: {
            type: Number,
            default: 10,
        },
        supplyDate: {
            type: Date,
        },
        expiryDate: {
            type: Date,
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Medicine", medicineSchema);
