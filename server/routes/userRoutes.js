import express from "express";
import { updateProfile, deleteAccount } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// All user routes are protected
router.put("/profile", protect, updateProfile);
router.delete("/account", protect, deleteAccount);

export default router;
