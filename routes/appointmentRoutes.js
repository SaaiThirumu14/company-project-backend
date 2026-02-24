const express = require("express");
const router = express.Router();
const appointmentController = require("../controller/appointmentController");

const { protect, restrictTo } = require("../middleware/authMiddleware");

router.post("/", protect, restrictTo("front_desk", "super_admin"), appointmentController.createAppointment);
router.get("/", protect, restrictTo("front_desk", "doctor", "admin", "super_admin"), appointmentController.getAllAppointments);
router.get("/:id", protect, restrictTo("front_desk", "doctor", "admin", "super_admin"), appointmentController.getAppointment);
router.put("/:id/status", protect, restrictTo("front_desk", "super_admin"), appointmentController.updateAppointmentStatus);
router.delete("/:id", protect, restrictTo("front_desk", "super_admin"), appointmentController.deleteAppointment);

module.exports = router;
