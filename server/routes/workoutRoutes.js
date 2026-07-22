import express from "express";
import { logWorkout, getWorkoutHistory } from "../controllers/workoutController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Protected workout logging routes
router.post("/log", protect, logWorkout);
router.get("/history", protect, getWorkoutHistory);

export default router;
