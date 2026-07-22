import mongoose from "mongoose";

const workoutLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    workoutName: {
      type: String,
      required: true,
      trim: true
    },
    durationMinutes: {
      type: Number,
      required: true,
      min: 1
    },
    exercisesCount: {
      type: Number,
      required: true,
      default: 1,
      min: 1
    },
    setsCount: {
      type: Number,
      required: true,
      default: 1,
      min: 1
    },
    caloriesBurned: {
      type: Number,
      required: true,
      min: 0
    },
    completedAt: {
      type: Date,
      default: Date.now,
      index: true
    }
  },
  {
    timestamps: true
  }
);

const WorkoutLog = mongoose.model("WorkoutLog", workoutLogSchema);
export default WorkoutLog;
