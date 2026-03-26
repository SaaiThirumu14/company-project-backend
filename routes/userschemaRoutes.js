const express = require("express");
const router = express.Router();
const userController = require("../controller/userschemaController");
const { protect, restrictTo } = require("../middleware/authMiddleware");

// Route to get all doctors
router.get("/", protect, restrictTo("front_desk", "doctor", "admin", "super_admin"), userController.getAllUsers);

// Route to search doctors (can use query params for specialization)
router.get("/search", protect, restrictTo("front_desk", "doctor", "admin", "super_admin"), userController.getUsersBySpecialization);

// Route to get a specific doctor by ID
router.get("/:id", protect, restrictTo("front_desk", "doctor", "admin", "super_admin"), userController.getUserById);

router.put("/:id", protect, restrictTo("admin", "super_admin"), userController.updateUser);
router.delete("/:id", protect, restrictTo("admin", "super_admin"), userController.deleteUser);

module.exports = router;
