import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // Google Profile & Identity
    googleId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    profilePhoto: {
      type: String,
      default: ""
    },
    joinedAt: {
      type: Date,
      default: Date.now
    },

    // Physical & Fitness Metrics
    age: {
      type: Number,
      default: null
    },
    gender: {
      type: String,
      default: ""
    },
    height: {
      type: Number,
      default: null
    },
    weight: {
      type: Number,
      default: null
    },
    fitnessGoal: {
      type: String,
      default: ""
    },
    experienceLevel: {
      type: String,
      default: ""
    },
    activityLevel: {
      type: String,
      default: ""
    },
    targetWeight: {
      type: Number,
      default: null
    },
    dailyCalories: {
      type: Number,
      default: null
    },
    proteinGoal: {
      type: Number,
      default: null
    },
    waterGoal: {
      type: Number,
      default: null
    },
    bio: {
      type: String,
      default: ""
    },

    // Application-Calculated Workout Statistics (Updated atomically via workout logging)
    workoutsCompleted: {
      type: Number,
      default: 0,
      min: 0
    },
    currentStreak: {
      type: Number,
      default: 0,
      min: 0
    },
    longestStreak: {
      type: Number,
      default: 0,
      min: 0
    },
    lastWorkoutDate: {
      type: Date,
      default: null
    },
    totalWorkoutMinutes: {
      type: Number,
      default: 0,
      min: 0
    },
    caloriesBurned: {
      type: Number,
      default: 0,
      min: 0
    },
    exercisesCompleted: {
      type: Number,
      default: 0,
      min: 0
    },

    // Profile Completion State
    isProfileComplete: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

const User = mongoose.model("User", userSchema);
export default User;
