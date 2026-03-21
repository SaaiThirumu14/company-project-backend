const express = require("express");
const router = express.Router();
const n8nController = require("../controller/n8nController");

// Post appointment request from n8n or external system
router.post("/receiver", n8nController.receiveAppointmentRequest);
router.delete("/delete/:id", n8nController.deleteByPhone);
router.get("/view/:id", n8nController.viewbyId);
router.put("/update/:id", n8nController.updatebyId);

module.exports = router;
