const Consultation = require("../models/Consultation");
const Patient = require("../models/Patient");

// Record Consultation (Vitals + Chief Complaint)
exports.recordConsultation = async (req, res) => {
    try {
        const { patientId, doctor, vitals, chiefComplaint, diagnosis, notes, prescriptionId, status } = req.body;

        const consultation = await Consultation.create({
            patient: patientId,
            doctor: doctor || (req.user.role === 'doctor' ? req.user.id : null),
            vitals,
            chiefComplaint,
            diagnosis,
            notes,
            prescription: prescriptionId,
            status: status || 'pending'
        });

        res.status(201).json(consultation);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get Pending Consultations (for Doctor Queue)
exports.getPendingConsultations = async (req, res) => {
    try {
        const consultations = await Consultation.find({ status: "pending" })
            .populate('patient')
            .sort({ createdAt: 1 });
        res.json(consultations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get History for a Patient
exports.getPatientHistory = async (req, res) => {
    try {
        const { patientId } = req.params;
        const history = await Consultation.find({ patient: patientId })
            .populate('doctor', 'username')
            .populate('prescription')
            .sort({ createdAt: -1 });

        res.json(history);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update Consultation (when Doctor adds diagnosis/prescription)
exports.updateConsultation = async (req, res) => {
    try {
        const { id } = req.params;
        const { diagnosis, notes, prescriptionId } = req.body;

        const consultation = await Consultation.findByIdAndUpdate(id, {
            doctor: req.user.id,
            diagnosis,
            notes,
            prescription: prescriptionId,
            status: 'completed'
        }, { new: true });

        res.json(consultation);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
