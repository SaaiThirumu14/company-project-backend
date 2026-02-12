const Laboratory = require("../models/Laboratory");
const Patient = require("../models/Patient");
const sendMail = require("../services/lab/mail");

// Request Lab Test (by Doctor)
exports.requestLabTest = async (req, res) => {
    try {
        const { patientId, testName, category, notes } = req.body;

        const labRequest = await Laboratory.create({
            patient: patientId,
            doctor: req.user.id,
            testName,
            category,
            notes,
            status: 'pending'
        });

        const patient = await Patient.findById(patientId);
        if (patient) {
            await sendMail(patient.name);
        }

        res.status(201).json(labRequest);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get Pending Lab Tests (for Lab Queue)
exports.getPendingTests = async (req, res) => {
    try {
        const tests = await Laboratory.find({ status: "pending" })
            .populate('patient')
            .populate('doctor', 'username')
            .sort({ createdAt: 1 });
        res.json(tests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Completed Lab Tests (Recent)
exports.getCompletedTests = async (req, res) => {
    try {
        const tests = await Laboratory.find({ status: "completed" })
            .populate('patient')
            .populate('doctor', 'username')
            .populate('labTechnician', 'username')
            .sort({ updatedAt: -1 })
            .limit(10); // Limit to 10 most recent
        res.json(tests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Single Lab Test by ID
exports.getLabTestById = async (req, res) => {
    try {
        const { id } = req.params;
        const test = await Laboratory.findById(id)
            .populate('patient')
            .populate('doctor', 'username')
            .populate('labTechnician', 'username');

        if (!test) {
            return res.status(404).json({ message: 'Lab test not found' });
        }
        res.json(test);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Get Lab History for a Patient
exports.getPatientLabHistory = async (req, res) => {
    try {
        const { patientId } = req.params;
        const history = await Laboratory.find({ patient: patientId })
            .populate('doctor', 'username')
            .populate('labTechnician', 'username')
            .sort({ createdAt: -1 });

        res.json(history);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Submit Lab Result (by Lab Technician)
exports.submitLabResult = async (req, res) => {
    try {
        const { id } = req.params;
        const { results, notes } = req.body;

        const labTest = await Laboratory.findByIdAndUpdate(id, {
            labTechnician: req.user.id,
            results,
            notes,
            status: 'completed'
        }, { new: true });

        res.json(labTest);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
