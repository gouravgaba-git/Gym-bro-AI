import mongoose from "mongoose";

const exerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  target: {
    type: String,
    required: true,
    trim: true
  },
  goal: {
    type: String,
    required: true,
    enum: ["muscle_gain", "fat_loss", "strength"]
  },
  setsReps: {
    type: String,
    required: true
  },
  videoUrl: {
    type: String,
    default: "#"
  },
  steps: {
    type: [String],
    default: []
  },
  tips: {
    type: [String],
    default: []
  },
  mediaUrl: {
    type: String,
    default: "/exercise_placeholder.png"
  },
  mediaType: {
    type: String,
    default: "image",
    enum: ["image", "video"]
  }
}, {
  timestamps: true
});

// Create index on name, target, and goal for fast lookups
exerciseSchema.index({ name: 1 }, { unique: true });
exerciseSchema.index({ target: 1, goal: 1 });

const Exercise = mongoose.model("Exercise", exerciseSchema);

export default Exercise;
