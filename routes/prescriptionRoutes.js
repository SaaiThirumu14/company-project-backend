const express = require("express");
const router = express.Router();
const prescriptionController = require("../controller/prescriptionController");
const { protect, restrictTo } = require("../middleware/authMiddleware");

router.use(protect);

router.post("/", restrictTo("doctor", "super_admin"), prescriptionController.createPrescription);
router.post("/:prescriptionId/dispense", restrictTo("pharmacy", "super_admin"), prescriptionController.dispensePrescription);
router.get("/", restrictTo("pharmacy", "doctor", "admin", "super_admin"), prescriptionController.getPrescriptions);
router.get("/:id", restrictTo("pharmacy", "doctor", "admin", "super_admin"), prescriptionController.getPrescriptionById);
router.get("/patient/:id", restrictTo("pharmacy", "doctor", "admin", "super_admin"), prescriptionController.getPatientPrescriptions);

module.exports = router;
