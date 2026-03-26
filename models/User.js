const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: [
      "super_admin",
      "admin",
      "front_desk",
      "doctor",
      "hrmanager",
      "pharmacy",
      "laboratory",
      "patient"
    ],
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
