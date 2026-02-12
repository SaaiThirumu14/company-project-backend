const Medicine = require("../models/Medicine");

// Fetch all medicines
exports.getAllMedicines = async (req, res) => {
    try {
        const medicines = await Medicine.find().sort({ name: 1 });
        res.json(medicines);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create or update medicine (Add Stock)
exports.addStock = async (req, res) => {
    try {
        const { name, batchNumber, stockQuantity, expiryDate, lowStockThreshold } = req.body;

        let medicine = await Medicine.findOne({ name });

        if (medicine) {
            medicine.stockQuantity += Number(stockQuantity);
            medicine.batchNumber = batchNumber;
            medicine.expiryDate = expiryDate;
            if (lowStockThreshold) medicine.lowStockThreshold = lowStockThreshold;
            await medicine.save();
        } else {
            medicine = await Medicine.create({
                name,
                batchNumber,
                stockQuantity,
                expiryDate,
                lowStockThreshold: lowStockThreshold || 10
            });
        }

        // Emit socket event
        const io = req.app.get('socketio');
        if (io) io.emit('stock_update', medicine);

        res.status(201).json(medicine);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get medicine by ID
exports.getMedicine = async (req, res) => {
    try {
        const medicine = await Medicine.findById(req.params.id);
        if (!medicine) return res.status(404).json({ message: "Medicine not found" });
        res.json(medicine);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
