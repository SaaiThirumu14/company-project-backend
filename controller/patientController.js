const Patient = require("../models/Patient");

// CREATE
exports.createPatient = async (req, res) => {
  try {
    const count = await Patient.countDocuments();
    const patientId = `PAT-${1000+ count + 1}`;
    const patientData = { ...req.body, patientId };
        const patient = await Patient.create(patientData);
    res.status(201).json(patient);
  } catch (error) {
        res.status(400).json({ message: error.message });
  }
};

// GET ME (Patient self data)
exports.getMePatient = async (req, res) => {
  try {
    const patient = await Patient.findOne({ userId: req.user.id });
    if (!patient) return res.status(404).json({ message: "Patient profile not found" });
    res.json(patient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE
exports.updatePatient = async (req, res) => {
  const patient = await Patient.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(patient);
};

// FETCH ONE
exports.getPatient = async (req, res) => {
  try {
    const patientId = req.params.id;
    const { role } = req.user;

    const patient = await Patient.findById(patientId);
    if (!patient) return res.status(404).json({ message: "Patient not found" });

    // Role filtering for data visibility - maintain existing admin/pharmacy limited view
    if (role === "super_admin" || role === "admin" || role === "pharmacy") {
      return res.json({
        _id: patient._id,
        name: patient.name,
        patientId: patient.patientId
      });
    }

    // Doctors and Front Desk get full access
    res.json(patient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE
exports.deletePatient = async (req, res) => {
  try {
    await Patient.findByIdAndDelete(req.params.id);
    res.json({ message: "Patient deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// FETCH ALL
exports.getAllPatients = async (req, res) => {
  try {
    const { role } = req.user;
    let patients;

    if (role === "super_admin" || role === "admin" || role === "pharmacy") {
      patients = await Patient.find().select("name patientId");
    } else {
      // Doctors and Front Desk see all patients (standard clinical access)
      patients = await Patient.find();
    }

    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
