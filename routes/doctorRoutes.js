const express = require("express");
const router = express.Router();
const doctorController = require("../controller/doctorController");
const { protect } = require("../middleware/authMiddleware");

// Route to get all doctors
router.get("/", protect, doctorController.getAllDoctors);

module.exports = router;