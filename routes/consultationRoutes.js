const express = require("express");
const router = express.Router();
const consultationController = require("../controller/consultationController");
const { protect, restrictTo } = require("../middleware/authMiddleware");

router.use(protect);

router.post("/", restrictTo("doctor", "front_desk", "super_admin"), consultationController.recordConsultation);
router.get("/pending", restrictTo("doctor", "admin", "super_admin"), consultationController.getPendingConsultations);
router.put("/:id", restrictTo("doctor", "super_admin"), consultationController.updateConsultation);
router.get("/patient/:patientId", restrictTo("doctor", "pharmacy", "front_desk", "admin", "super_admin"), consultationController.getPatientHistory);

module.exports = router;
