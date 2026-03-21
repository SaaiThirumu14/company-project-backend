const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    name: {
      type: String,
      required: true,
      trim: true
    },

    dateOfBirth: {
      type: Date
    },

    contact: {
      type: String,
      required: true
    },

    qualifications: {
      type: String
    },
    email:{
      type:String,
      required:true
    },
    // Multiple specializations (checkbox)
    specializations: {
      type: [String],
      required: true
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("userSchema", userSchema);
