const express = require("express");
const router = express.Router();
const { login, register, logout, getMe, getLoginLogs } = require("../controller/authController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/login", login);
//router.post("/verifyOtp", verifyOtp);
router.post("/register", authMiddleware.protect, authMiddleware.restrictTo("super_admin", "admin"), register);
router.post("/logout", logout);
router.get("/me", authMiddleware.protect, getMe);
router.get("/login-logs", authMiddleware.protect, authMiddleware.restrictTo("super_admin", "admin"), getLoginLogs);
module.exports = router;
