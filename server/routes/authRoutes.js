import express from "express";
import { googleAuth, getMe } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public Google GIS Auth endpoint
router.post("/google", googleAuth);

// Protected session check
router.get("/me", protect, getMe);

export default router;
