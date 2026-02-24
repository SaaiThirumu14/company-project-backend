const express = require("express");
const router = express.Router();
const { login, register, logout, getMe } = require("../controller/authController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/login", login);
//router.post("/verifyOtp", verifyOtp);
router.post("/register", authMiddleware.protect, authMiddleware.restrictTo("super_admin"), register);
router.post("/logout", logout);
router.get("/me", authMiddleware.protect, getMe);
router.get("/login-logs", authMiddleware.protect, authMiddleware.restrictTo("super_admin", "admin"), require("../controller/authController").getLoginLogs);
module.exports = router;
