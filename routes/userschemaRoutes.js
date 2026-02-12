const express = require("express");
const router = express.Router();
const userController = require("../controller/userschemaController");
const { protect } = require("../middleware/authMiddleware");

// Route to get all doctors
router.get("/", protect, userController.getAllUsers);

// Route to search doctors (can use query params for specialization)
router.get("/search", protect, userController.getUsersBySpecialization);

// Route to get a specific doctor by ID
router.get("/:id", protect, userController.getUserById);

module.exports = router;
