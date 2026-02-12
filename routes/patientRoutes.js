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

router.post("/", protect, restrictTo("front_desk", "admin", "super_admin"), createPatient);
router.put("/:id", protect, restrictTo("front_desk", "admin", "super_admin"), updatePatient);
router.get("/:id", protect, getPatient);
router.delete("/:id", protect, restrictTo("front_desk", "admin", "super_admin"), deletePatient);
router.get("/", protect, restrictTo("front_desk", "doctor", "admin", "super_admin", "pharmacy"), getAllPatients);

module.exports = router;
