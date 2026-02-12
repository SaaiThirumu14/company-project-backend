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
  const patient = await Patient.findById(req.params.id);
  res.json(patient);
};

// DELETE
exports.deletePatient = async (req, res) => {
  await Patient.findByIdAndDelete(req.params.id);
  res.json({ message: "Patient deleted successfully" });
};

// FETCH ALL
exports.getAllPatients = async (req, res) => {
  const patients = await Patient.find();
  res.json(patients);
};
