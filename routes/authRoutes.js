const express = require("express");
const router = express.Router();
const { login, register, logout, getMe } = require("../controller/authController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/login", login);
//router.post("/verifyOtp", verifyOtp);
router.post("/register", register);
router.post("/logout", logout);
router.get("/me", getMe);

module.exports = router;
