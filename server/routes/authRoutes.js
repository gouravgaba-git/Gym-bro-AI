import express from "express";
import {
  register,
  verifyOtp,
  resendOtp,
  login,
  refreshToken,
  logout,
  logoutAll,
  googleAuth,
  getMe,
  emailAuth
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Registration & OTP verification
router.post("/register", register);
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);

// Login & Session management
router.post("/login", login);
router.post("/email", emailAuth); // Backward compatibility
router.post("/refresh", refreshToken);
router.post("/logout", logout);
router.post("/logoutAll", logoutAll);

// Google GIS Auth
router.post("/google", googleAuth);

// Protected user session check
router.get("/me", protect, getMe);
router.get("/getuser", protect, getMe); // Matches gouravgaba-git/authentication route

export default router;
