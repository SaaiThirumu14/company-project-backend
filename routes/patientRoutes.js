const express = require("express");
const router = express.Router();
const { protect, restrictTo } = require("../middleware/authMiddleware");
const {
  createPatient,
  updatePatient,
  getPatient,
  getAllPatients,
  deletePatient
} = require("../controller/patientController");

router.post("/", protect, restrictTo("front_desk", "super_admin"), createPatient);
router.get("/", protect, restrictTo("front_desk", "doctor", "admin", "super_admin", "pharmacy"), getAllPatients);
router.get("/:id", protect, restrictTo("front_desk", "doctor", "admin", "super_admin", "pharmacy"), getPatient);
router.put("/:id", protect, restrictTo("front_desk", "super_admin"), updatePatient);
router.delete("/:id", protect, restrictTo("front_desk", "super_admin"), deletePatient);

module.exports = router;
