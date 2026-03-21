const express = require("express");
const router = express.Router();
const onlineController = require("../controller/onlineController");
const { protect, restrictTo } = require("../middleware/authMiddleware");

// CREATE ONLINE REQUEST (public, no protect)
router.post("/", onlineController.createOnlineRequest);

// PROTECTED Admin Verification
router.get("/pending", protect, restrictTo("front_desk", "super_admin"), onlineController.getPendingRequests);
router.get("/finished", protect, restrictTo("front_desk", "super_admin"), onlineController.getFinishedRequests);

// GET SINGLE REQUEST BY ID
// GET SINGLE REQUEST BY ID
router.get("/status/:id", protect, restrictTo("front_desk", "super_admin"), onlineController.getRequestById);
router.put("/:id/confirm", protect, restrictTo("front_desk", "super_admin"), onlineController.confirmExistingPatientRequest);
router.put("/:id/confirm-new", protect, restrictTo("front_desk", "super_admin"), onlineController.confirmNewPatientRequest);


module.exports = router;
