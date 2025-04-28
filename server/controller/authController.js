import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import sendEmail from "../utils/sendEmail.js";
import generateEmailTemplate from "../utils/emailTemplet.js";

// Generate OTP
const generateOtp = () => crypto.randomInt(100000, 999999).toString();

export const register = async (req, res) => {
  try {
    const { userName, email, password } = req.body;
    if (!email.includes("@") || password.length < 6 || !userName) {
      return res.status(401).json({
        error: '"Invalid email, password too short, or missing username"',
      });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword, userName });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });
    const otp = generateOtp();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes
    await user.save();
    const subject = "Your Login OTP Code";
    const html = generateEmailTemplate(
      `Hello ${user.userName}`, // Include userName in the email
      "Use the following OTP to complete your login:",
      otp
    );
    await sendEmail(user.email, subject, html);

    res.json({ message: "OTP sent to your email" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Verify OTP
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user || user.otp !== otp || user.otpExpires < new Date()) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.json({ token, userName: user.userName });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Resend OTP Controller
export const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Email not registered" });
    }

    // Generate a new OTP
    const otp = generateOtp();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes
    await user.save();

    // Email subject and body template
    const subject = "Your Login OTP Code";
    const html = generateEmailTemplate(
      `Hello ${user.userName}`,
      "Use the following OTP to complete your login:",
      otp
    );

    // Send OTP to email
    await sendEmail(user.email, subject, html);

    res.json({ message: "OTP resent successfully to your email" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Send Forgot Password OTP Controller
export const sendForgetOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Email not registered" });

    const otp = generateOtp();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes
    await user.save();

    const subject = "Your Password Reset OTP Code";
    const html = generateEmailTemplate(
      `Hello ${user.userName}`, // Include userName in password reset email
      "Use the following OTP to reset your password:",
      otp
    );

    await sendEmail(user.email, subject, html);

    res.json({ message: "OTP sent to your email for password reset" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Reset Password Controller
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    console.log("Reset Password Request:", { email, otp, newPassword });
    const user = await User.findOne({ email });
    if (!user || user.otp !== otp || user.otpExpires < new Date()) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
