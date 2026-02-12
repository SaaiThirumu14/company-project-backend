const express = require("express");
const router = express.Router();
const appointmentController = require("../controller/appointmentController");

router.post("/", appointmentController.createAppointment);
router.get("/", appointmentController.getAllAppointments);
router.get("/:id", appointmentController.getAppointment);
router.put("/:id/status", appointmentController.updateAppointmentStatus);
router.delete("/:id", appointmentController.deleteAppointment);

module.exports = router;
