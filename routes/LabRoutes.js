const express = require("express");
const router = express.Router();
const labController = require("../controller/labController");
const { protect, restrictTo } = require("../middleware/authMiddleware");

// All routes are protected
router.use(protect);

router.post("/", restrictTo("doctor", "super_admin"), labController.requestLabTest);
router.get("/pending", restrictTo("laboratory", "doctor", "admin", "super_admin", "front_desk"), labController.getPendingTests);
router.get("/completed", restrictTo("laboratory", "doctor", "admin", "super_admin"), labController.getCompletedTests);
router.get("/patient/:patientId", restrictTo("laboratory", "doctor", "admin", "super_admin"), labController.getPatientLabHistory);
router.get("/:id", restrictTo("laboratory", "doctor", "admin", "super_admin"), labController.getLabTestById);
router.put("/:id", restrictTo("laboratory", "super_admin"), labController.submitLabResult);

module.exports = router;
