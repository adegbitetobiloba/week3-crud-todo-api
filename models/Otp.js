const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({

  email: String,

  otp: String,

  expiresAt: {
    type: Date,
    default: Date.now,
    index: { expires: 300 } // auto delete after 5 mins
  }

});

module.exports = mongoose.model("Otp", otpSchema);
