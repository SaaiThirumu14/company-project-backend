const Appointment = require("../models/Appointment");
const User = require("../models/User"); // Needed for doctor name
const Patient = require("../models/Patient");

// CREATE
exports.createAppointment = async (req, res) => {
    try {
        let {
            patient,
            patientName,
            patientContact,
            gender,
            dateOfBirth,
            bloodGroup,
            insuranceProvider,
            insuranceNumber,
            typeofpatient,
            residentialAddress,
            doctor,
            date,
            time,
            type,
            notes
        } = req.body;

        // If no patient ID is provided, create a new patient
        if (!patient) {
            const count = await Patient.countDocuments();
            const patientId = `PAT-${1000 + count + 1}`;

            const newPatient = await Patient.create({
                name: patientName,
                contact: patientContact,
                gender: gender || 'other',
                dateOfBirth,
                bloodGroup,
                insuranceProvider,
                insuranceNumber,
                typeofpatient,
                residentialAddress,
                patientId,
                registeredBy: req.user.id
            });
            patient = newPatient._id;
        } else {
            // If patient ID is provided, fetch the name and contact if they aren't provided
            const existingPatient = await Patient.findById(patient);
            if (!existingPatient) {
                return res.status(404).json({ message: "Patient not found" });
            }
            if (!patientName) patientName = existingPatient.name;
            if (!patientContact) patientContact = existingPatient.contact;
        }

        const appointment = await Appointment.create({
            patient,
            patientName,
            patientContact,
            doctor,
            date,
            time,
            type,
            notes
        });

        res.status(201).json(appointment);
    } catch (error) {
                res.status(400).json({ message: error.message });
    }
};

// GET ALL
exports.getAllAppointments = async (req, res) => {
    try {
        // Populate doctor details (name, specialization)
        const appointments = await Appointment.find().populate("doctor", "name specialization").sort({ date: 1, time: 1 });
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET ONE
exports.getAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id).populate("doctor", "name specialization");
        if (!appointment) return res.status(404).json({ message: "Appointment not found" });
        res.json(appointment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// UPDATE STATUS
exports.updateAppointmentStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const appointment = await Appointment.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        res.json(appointment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// DELETE
exports.deleteAppointment = async (req, res) => {
    try {
        await Appointment.findByIdAndDelete(req.params.id);
        res.json({ message: "Appointment deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
