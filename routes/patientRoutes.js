const express = require("express");
const router = express.Router();
const { protect, restrictTo } = require("../middleware/authMiddleware");
const {
  createPatient,
  updatePatient,
  getPatient,
  getAllPatients,
  deletePatient,
  getMePatient
} = require("../controller/patientController");

router.get("/me", protect, restrictTo("patient"), getMePatient);
router.post("/", protect, restrictTo("front_desk"), createPatient);
router.get("/", protect, restrictTo("front_desk", "doctor", "admin", "super_admin", "pharmacy"), getAllPatients);
router.get("/:id", protect, restrictTo("front_desk", "doctor", "admin", "super_admin", "pharmacy"), getPatient);
router.put("/:id", protect, restrictTo("front_desk"), updatePatient);
router.delete("/:id", protect, restrictTo("front_desk"), deletePatient);

module.exports = router;
