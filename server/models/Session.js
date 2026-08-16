import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },
  refreshToken: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 7 * 24 * 60 * 60 // Automatically removed from MongoDB after 7 days
  },
  revoked: {
    type: Boolean,
    default: false
  }
});

const Session = mongoose.model("Session", sessionSchema);
export default Session;
