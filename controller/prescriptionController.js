const mongoose = require("mongoose");
const Prescription = require("../models/Prescription");
const Medicine = require("../models/Medicine");
const Patient = require("../models/Patient");

// Create Prescription (Doctor)
exports.createPrescription = async (req, res) => {
    try {
        const { patientId, medicines, diagnosis, notes } = req.body;

        // Validate stock for each medicine
        for (const item of medicines) {
            const medicine = await Medicine.findById(item.medicine);
            if (!medicine || medicine.stockQuantity < item.totalQuantity) {
                return res.status(400).json({
                    message: `Low stock for ${medicine?.name || 'Unknown medicine'}. Available: ${medicine?.stockQuantity || 0}`,
                    medicineId: item.medicine
                });
            }
        }

        const prescription = await Prescription.create({
            patient: patientId,
            doctor: req.user.id,
            medicines,
            diagnosis,
            notes,
            status: 'pending'
        });

        res.status(201).json(prescription);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Dispense Prescription (Pharmacy)
exports.dispensePrescription = async (req, res) => {
    try {
        const { prescriptionId } = req.params;
        const prescription = await Prescription.findById(prescriptionId).populate('medicines.medicine');

        if (!prescription) return res.status(404).json({ message: "Prescription not found" });
        if (prescription.status === 'dispensed') return res.status(400).json({ message: "Already dispensed" });

        const io = req.app.get('socketio');

        // Deduct stock
        for (const item of prescription.medicines) {
            const medicine = await Medicine.findById(item.medicine._id);
            if (medicine.stockQuantity < item.totalQuantity) {
                return res.status(400).json({ message: `Insufficient stock for ${medicine.name}` });
            }
            medicine.stockQuantity -= item.totalQuantity;
            await medicine.save();

            // Check low stock for alerts
            if (io) {
                if (medicine.stockQuantity <= 0) {
                    io.emit('out_of_stock_warning', medicine);
                } else if (medicine.stockQuantity <= medicine.lowStockThreshold) {
                    io.emit('low_stock_alert', medicine);
                }
            }
        }

        prescription.status = 'dispensed';
        prescription.dispensedAt = new Date();
        prescription.dispensedBy = req.user.id;
        await prescription.save();

        res.json({ message: "Medicines dispensed successfully", prescription });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get All Prescriptions (Pharmacy)
exports.getPrescriptions = async (req, res) => {
    try {
        const { status } = req.query;
        const query = status ? { status } : {};

        const prescriptions = await Prescription.find(query)
            .populate('doctor', 'username')
            .populate('patient')
            .populate('medicines.medicine')
            .populate('dispensedBy', 'username')
            .sort({ createdAt: -1 });

        res.json(prescriptions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Prescription by Patient ID (Search for Pharmacy)
exports.getPatientPrescriptions = async (req, res) => {
    try {
        const { id } = req.params;

        // Search by MongoDB _id or human-readable patientId
        const patient = await Patient.findOne({
            $or: [
                { _id: mongoose.isValidObjectId(id) ? id : new mongoose.Types.ObjectId() },
                { patientId: id }
            ]
        });

        if (!patient) return res.status(404).json({ message: "Patient not found" });

        const prescriptions = await Prescription.find({ patient: patient._id })
            .populate('doctor', 'username')
            .populate('patient', 'name')
            .populate('medicines.medicine')
            .sort({ createdAt: -1 });

        res.json(prescriptions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Single Prescription
exports.getPrescriptionById = async (req, res) => {
    try {
        const prescription = await Prescription.findById(req.params.id)
            .populate('doctor', 'username')
            .populate('patient')
            .populate('medicines.medicine')
            .populate('dispensedBy', 'username');

        if (!prescription) {
            return res.status(404).json({ message: "Prescription not found" });
        }
        res.json(prescription);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
