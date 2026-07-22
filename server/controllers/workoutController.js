import WorkoutLog from "../models/WorkoutLog.js";
import User from "../models/User.js";

/**
 * Log a completed workout session and update user statistics.
 * POST /api/workouts/log
 */
export async function logWorkout(req, res) {
  try {
    const userId = req.user._id;
    const { workoutName, durationMinutes, exercisesCount = 1, setsCount = 1, customCalories } = req.body;

    // Validation
    if (!workoutName || typeof workoutName !== "string" || workoutName.trim() === "") {
      return res.status(400).json({ error: "Workout name is required" });
    }

    const parsedDuration = Number(durationMinutes);
    if (isNaN(parsedDuration) || parsedDuration <= 0 || parsedDuration > 600) {
      return res.status(400).json({ error: "Duration must be between 1 and 600 minutes" });
    }

    const parsedExercises = Math.max(1, Number(exercisesCount) || 1);
    const parsedSets = Math.max(1, Number(setsCount) || 1);

    // Calculate Calories Burned
    const userWeight = req.user.weight && req.user.weight > 0 ? req.user.weight : 70;
    // Standard weight training MET approx 6.0
    let calculatedCalories = Math.round(parsedDuration * userWeight * 0.075 * Math.max(1, parsedSets / 3));
    if (customCalories && Number(customCalories) > 0) {
      calculatedCalories = Number(customCalories);
    }
    calculatedCalories = Math.max(10, calculatedCalories);

    // Save WorkoutLog Entry
    const workoutLog = await WorkoutLog.create({
      user: userId,
      workoutName: workoutName.trim(),
      durationMinutes: parsedDuration,
      exercisesCount: parsedExercises,
      setsCount: parsedSets,
      caloriesBurned: calculatedCalories,
      completedAt: new Date()
    });

    // Compute Streak Logic (Calendar-Day comparison)
    const user = req.user;
    const now = new Date();
    const todayStr = now.toISOString().split("T")[0];

    let newStreak = user.currentStreak || 0;

    if (!user.lastWorkoutDate) {
      // First workout ever
      newStreak = 1;
    } else {
      const lastStr = new Date(user.lastWorkoutDate).toISOString().split("T")[0];
      const diffMs = new Date(todayStr).getTime() - new Date(lastStr).getTime();
      const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

      if (diffDays === 0) {
        // Same calendar day -> keep streak unchanged
        newStreak = user.currentStreak || 1;
      } else if (diffDays === 1) {
        // Consecutive calendar day -> increment streak
        newStreak = (user.currentStreak || 0) + 1;
      } else if (diffDays > 1) {
        // Missed one or more days -> reset streak to 1
        newStreak = 1;
      }
    }

    const newLongestStreak = Math.max(user.longestStreak || 0, newStreak);

    // Atomic update on User statistics
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $inc: {
          workoutsCompleted: 1,
          totalWorkoutMinutes: parsedDuration,
          caloriesBurned: calculatedCalories,
          exercisesCompleted: parsedExercises
        },
        $set: {
          currentStreak: newStreak,
          longestStreak: newLongestStreak,
          lastWorkoutDate: now
        }
      },
      { new: true }
    ).select("-__v");

    return res.status(201).json({
      message: "Workout session logged successfully! 🎉",
      workoutLog,
      user: updatedUser
    });
  } catch (error) {
    console.error("Log workout controller error:", error);
    return res.status(500).json({ error: "Failed to log workout session" });
  }
}

/**
 * Fetch workout logs history for current user.
 * GET /api/workouts/history
 */
export async function getWorkoutHistory(req, res) {
  try {
    const logs = await WorkoutLog.find({ user: req.user._id })
      .sort({ completedAt: -1 })
      .limit(50);

    return res.json({ logs });
  } catch (error) {
    console.error("Get workout history error:", error);
    return res.status(500).json({ error: "Failed to fetch workout history" });
  }
}
