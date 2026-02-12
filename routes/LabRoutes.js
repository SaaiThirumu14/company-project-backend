const express = require("express");
const router = express.Router();
const labController = require("../controller/labController");
const { protect, restrictTo } = require("../middleware/authMiddleware");

// All routes are protected
router.use(protect);

router.post("/", restrictTo("doctor", "admin", "super_admin"), labController.requestLabTest);
router.get("/pending", restrictTo("laboratory", "admin", "super_admin", "front_desk"), labController.getPendingTests);
router.get("/completed", restrictTo("laboratory", "admin", "super_admin"), labController.getCompletedTests);
router.get("/:id", restrictTo("laboratory", "admin", "super_admin"), labController.getLabTestById);
router.get("/patient/:patientId", labController.getPatientLabHistory);
router.put("/:id", restrictTo("laboratory", "admin", "super_admin"), labController.submitLabResult);

module.exports = router;
