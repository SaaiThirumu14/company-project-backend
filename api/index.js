const express = require("express");
const router = express.Router();

const authRoutes = require("../routes/authRoutes");
const patientRoutes = require("../routes/patientRoutes");
const userSchemaRoutes = require("../routes/userschemaRoutes");
const medicineRoutes = require("../routes/medicineRoutes");
const prescriptionRoutes = require("../routes/prescriptionRoutes");
const consultationRoutes = require("../routes/consultationRoutes");
const labRoutes = require("../routes/LabRoutes");
const appointmentRoutes = require("../routes/appointmentRoutes");
const doctorRoutes = require("../routes/doctorRoutes");

// Register all routes
router.use("/auth", authRoutes);
router.use("/patients", patientRoutes);
router.use("/userschema", userSchemaRoutes);
router.use("/medicines", medicineRoutes);
router.use("/prescriptions", prescriptionRoutes);
router.use("/consultations", consultationRoutes);
router.use("/labs", labRoutes);
router.use("/appointments", appointmentRoutes);
router.use("/doctors", doctorRoutes);


module.exports = router;
