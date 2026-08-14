import express from "express";
import { googleAuth, emailAuth, getMe } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public Google GIS Auth endpoint
router.post("/google", googleAuth);

// Public Email/Password Auth endpoint
router.post("/email", emailAuth);

// Protected session check
router.get("/me", protect, getMe);

export default router;
