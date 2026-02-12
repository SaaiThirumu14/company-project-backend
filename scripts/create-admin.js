const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const path = require("path");

// Load .env from server directory
dotenv.config({ path: path.join(__dirname, "../.env") });

const User = require("../models/User");
const Userschema = require("../models/Userschema");

async function createAdmin() {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error("MONGO_URI not found in .env");
    }

    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB");

    const username = "admin";
    const rawPassword = "12345678";
    const role = "super_admin"; // Highest role

    // Check if user exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      console.log(`User '${username}' already exists. Updating password...`);
      const hashedPassword = await bcrypt.hash(rawPassword, 10);
      existingUser.password = hashedPassword;
      await existingUser.save();
      console.log("Password updated successfully.");
    } else {
      const hashedPassword = await bcrypt.hash(rawPassword, 10);
      
      const user = await User.create({
        username,
        password: hashedPassword,
        role
      });

      await Userschema.create({
        user_id: user._id,
        name: "Administrator",
        contact: "0000000000",
        specializations: ["All"],
        isActive: true
      });

      console.log(`User '${username}' created successfully as ${role}.`);
    }

    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  } catch (err) {
    console.error("Error creating admin user:", err);
    process.exit(1);
  }
}

createAdmin();
