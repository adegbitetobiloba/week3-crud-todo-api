const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

  firstName: {
    type: String,
    required: true,
    trim: true
  },

  lastName: {
    type: String,
    required: true
  },

  otherNames: {
    type: String
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  phone: {
    type: String,
    required: true
  },

  dob: {
    type: Date
  },

  country: {
    type: String,
    required: true
  },

  state: {
    type: String,
    required: true
  },

  role: {
    type: String,
    enum: ["student", "teacher", "alumni", "parent", "visitor"],
    default: "student"
  },

  password: {
    type: String,
    required: true
  },

  isVerified: {
    type: Boolean,
    default: false
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("User", userSchema);
