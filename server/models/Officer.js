const mongoose = require("mongoose");
const { Schema } = mongoose;

// Define roles (flexible for RBAC - Role Based Access Control)
const roles = ["Admin", "Manager", "Staff", "User"];

// Officer Schema (Copied from User.js but renamed)
const officerSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 100,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      
    },
    password: {
      type: String,
      required: true,
      minlength: 6, // but we’ll hash before saving
    },
    woreda: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    role: {
      type: String,
      enum: roles,
      default: "User",
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt
  }
);

module.exports = mongoose.model("Officer", officerSchema);
