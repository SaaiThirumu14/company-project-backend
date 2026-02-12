const User = require("../models/User");
const Userschema = require("../models/Userschema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Otpgenerator = require("../services/auth/Otpgenerator");
const sendMail = require("../services/auth/mail");

// REGISTER USER (Admin creates users)

exports.register = async (req, res) => {
  try {
    const {
      username, // used as name for Userschema if not provided separately
      password,
      role,
      dateOfBirth,
      contact,
      qualifications,
      specializations
    } = req.body;

    // basic validation
    if (!username || !password || !role) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user
    const user = await User.create({
      username,
      password: hashedPassword,
      role
    });

    // create associated profile (Userschema)
    // For roles like doctor or front_desk, we create a profile
    await Userschema.create({
      user_id: user._id,
      name: username, // using username as name
      dateOfBirth,
      contact: contact || "N/A", // contact is required in schema
      qualifications,
      specializations: specializations || []
    });

    res.status(201).json({
      success: true,
      message: "User and profile created successfully",
      user: { id: user._id, username: user.username, role: user.role }
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// exports.login = async (req, res) => {
//   try {
//     const { username, password } = req.body;
//     const user = await User.findOne({ username });
//     if (!user) return res.status(404).json({ msg: "User not found" });
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(401).json({ msg: "Invalid credentials" });
//     const token = jwt.sign(
//       { user },
//       process.env.JWT_SECRET,
//       { expiresIn: "1m" }
//     );

//     req.session.otpAuth = {
//       token,
//       createdAt: Date.now()
//     };

//     const otp = Otpgenerator.sendOTPval(token);
//     if (!otp) return res.status(400).json({ msg: "Failed to send OTP" });

//     sendMail(otp);
//     res.json({ msg: "OTP sent successfully" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// exports.verifyOtp = async (req, res) => {
//   try {
//     const { otp } = req.body;

//     const isMatch = Otpgenerator.verifyOTPval(req.session.otpAuth.token, otp);
//     if (!isMatch) return res.status(401).json({ msg: "Invalid OTP" });

//     const temptoken = req.session.otpAuth.token;
//     const decoded = jwt.verify(temptoken, process.env.JWT_SECRET);
//     const user = decoded.user;

//     const newtoken = jwt.sign(
//       { id: user._id, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: "1d" }
//     );

//     res.cookie("token", newtoken, {
//       httpOnly: true,
//       secure: true,
//       sameSite: "strict",
//       maxAge: 24 * 60 * 60 * 1000
//     });

//     res.json({
//       success: true,
//       message: "Login successful",
//       user: {
//         id: user._id,
//         username: user.username,
//         role: user.role
//       }
//     });
//   }
//   catch (err) {
//     res.status(500).json({ error: err.message })
//   }
// }



exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // 1. Find user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // 2. Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ msg: "Invalid credentials" });
    }

    // 3. Generate final JWT (same as after OTP verify)
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // 4. Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,          // set false if testing on localhost without HTTPS
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000
    });

    // 5. Response
    res.json({
      success: true,
      message: "Login successful (OTP bypassed for testing)",
      user: {
        id: user._id,
        username: user.username,
        role: user.role
      }
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.logout = async (req, res) => {
  res.clearCookie("token");
  res.json({ success: true, message: "Logged out successfully" });
};

exports.getMe = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ msg: "No token, authorization denied" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) return res.status(404).json({ msg: "User not found" });

    res.json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        role: user.role
      }
    });
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};
