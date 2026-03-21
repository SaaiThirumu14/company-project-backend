const OnlineRequest = require("../models/OnlineRequest");

// CREATE ONLINE REQUEST
exports.createOnlineRequest = async (req, res) => {
    try {
        const { patientName, patientContact, date, time } = req.body;
        
        // Generate a simple unique short ID
        const requestId = "REQ-" + Math.floor(100000 + Math.random() * 900000);

        const newRequest = new OnlineRequest({
            patientName,
            patientContact,
            date,
            time,
            requestId
        });

        await newRequest.save();
        res.status(201).json(newRequest);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET PENDING REQUESTS
exports.getPendingRequests = async (req, res) => {
    try {
        const requests = await OnlineRequest.find({ status: "Pending" })
            .sort({ date: 1, time: 1 });
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET FINISHED REQUESTS (Approved or Rejected)
exports.getFinishedRequests = async (req, res) => {
    try {
        const requests = await OnlineRequest.find({ status: { $in: ["Approved", "Rejected"] } })
            .sort({ updatedAt: -1 });
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET SINGLE REQUEST BY ID
exports.getRequestById = async (req, res) => {
    try {
        const request = await OnlineRequest.findById(req.params.id);
        if (!request) {
            return res.status(404).json({ message: "Request not found" });
        }
        res.json(request);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// CONFIRM REQUEST FOR EXISTING PATIENT
exports.confirmExistingPatientRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const { doctor, date, time, type, notes } = req.body;

        const request = await OnlineRequest.findByIdAndUpdate(id, { status: "Approved" }, { new: true });
        if (!request) return res.status(404).json({ message: "Request not found" });

        // Fetch patient details from model if needed
        const Patient = require("../models/Patient");
        const Appointment = require("../models/Appointment");

        const patient = await Patient.findById(request.patient);
        if (!patient) return res.status(404).json({ message: "Patient not found" });

        // Create appointment
        const appointment = await Appointment.create({
            patient: patient._id,
            patientName: patient.name,
            patientContact: patient.contact,
            doctor,
            date,
            time,
            type,
            notes,
            status: "Confirmed"
        });

        res.json({ message: "Appointment confirmed successfully", appointment });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// CONFIRM REQUEST FOR NEW PATIENT
exports.confirmNewPatientRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, contact, gender, dateOfBirth, bloodGroup, typeofpatient, residentialAddress, doctor, date, time, type, notes } = req.body;

        const request = await OnlineRequest.findByIdAndUpdate(id, { status: "Approved" }, { new: true });
        if (!request) return res.status(404).json({ message: "Request not found" });

        const Patient = require("../models/Patient");
        const Appointment = require("../models/Appointment");

        // 1. Create Patient
        const count = await Patient.countDocuments();
        const patientId = `PAT-${1000 + count + 1}`;

        const patient = await Patient.create({
            name,
            contact,
            gender,
            dateOfBirth,
            bloodGroup,
            typeofpatient,
            residentialAddress,
            patientId
        });

        // 2. Create Appointment
        const appointment = await Appointment.create({
            patient: patient._id,
            patientName: patient.name,
            patientContact: patient.contact,
            doctor,
            date,
            time,
            type,
            notes,
            status: "Confirmed"
        });

        res.json({ message: "New patient registered and appointment confirmed successfully", appointment });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


