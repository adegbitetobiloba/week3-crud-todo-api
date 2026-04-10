const User = require("../models/User");
const Otp = require("../models/Otp");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");

// REGISTER
exports.register = async (req, res) => {
  try {

    const {
      firstName,
      lastName,
      otherNames,
      email,
      phone,
      dob,
      country,
      state,
      role,
      password
    } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      otherNames,
      email,
      phone,
      dob,
      country,
      state,
      role,
      password: hashedPassword
    });

    await user.save();

    // GENERATE OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    await Otp.create({
      email,
      otp: otpCode
    });

    await sendEmail(email, otpCode);

    res.json({ message: "OTP sent to email" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// VERIFY OTP
exports.verifyOtp = async (req, res) => {
  try {

    const { email, otp } = req.body;

    const validOtp = await Otp.findOne({ email, otp });

    if (!validOtp) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    await User.findOneAndUpdate(
      { email },
      { isVerified: true }
    );

    await Otp.deleteMany({ email });

    res.json({ message: "Account verified" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    if (!user.isVerified) {
      return res.status(400).json({ error: "Verify your email first" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET
    );

    res.json({ token, user });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
