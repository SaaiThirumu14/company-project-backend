const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
    },
    contact: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },

    residentialAddress: {
      type: String,
    },

    insuranceProvider: {
      type: String,
    },

    insuranceNumber: {
      type: String,
    },

    dateOfBirth: {
      type: Date,
    },

    medicalDetails: {
      type: String,
    },

    typeofpatient: {
      type: String,
    },

    organDonorStatus: { type: Boolean, default: false },

    bloodGroup: { type: String },

    socialHistory: {
      smoking: Boolean,
      alcohol: Boolean,
      lifestyle: String,
    },
    biometricTemplate: { type: String },
    patientId: {
      type: String,
      unique: true,
    },
    registeredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Patient", patientSchema);
