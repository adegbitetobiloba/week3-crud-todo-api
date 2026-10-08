const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  course: { type: String, required: true },
  active: { type: Boolean, default: true },
});

module.exports = mongoose.model("Student", studentSchema);
