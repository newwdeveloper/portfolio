// routes/authRoutes.js
import express from "express";
import {
  register,
  login,
  verifyOtp,
  sendForgetOtp,
  resetPassword,
  resendOtp,
} from "../controller/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Routes for user authentication
router.post("/register", register); // User registration
router.post("/login", authMiddleware, login); // User login and OTP generation
router.post("/verify-otp", authMiddleware, verifyOtp); // Verify OTP for login
router.post("/forgot-password", authMiddleware, sendForgetOtp); // Send OTP for password reset
router.post("/reset-password", authMiddleware, resetPassword); // Reset password using OTP
router.post("/resend-otp", authMiddleware, resendOtp);

export default router;
