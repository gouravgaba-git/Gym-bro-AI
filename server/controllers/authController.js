import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { verifyGoogleIdToken } from "../services/googleAuthService.js";

/**
 * Handle Google GIS OAuth authentication.
 * POST /api/auth/google
 */
export async function googleAuth(req, res) {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ error: "Google OAuth credential token is required" });
    }

    let googlePayload;
    try {
      googlePayload = await verifyGoogleIdToken(credential);
    } catch (err) {
      if (err.message === "GOOGLE_CLIENT_ID_NOT_CONFIGURED") {
        return res.status(400).json({
          error: "GOOGLE_CLIENT_ID_NOT_CONFIGURED",
          message: "Google OAuth Client ID is not configured on the backend. Please set GOOGLE_CLIENT_ID in server/.env."
        });
      }
      return res.status(401).json({ error: `Google token verification failed: ${err.message}` });
    }

    const { googleId, email, name, profilePhoto } = googlePayload;

    // Find existing user by googleId or email
    let user = await User.findOne({
      $or: [{ googleId }, { email }]
    });

    if (!user) {
      // Create new user account automatically
      user = await User.create({
        googleId,
        email,
        name,
        profilePhoto,
        joinedAt: new Date(),
        isProfileComplete: false
      });
    } else {
      // Keep Google Profile Info up to date
      let updated = false;
      if (user.googleId !== googleId) {
        user.googleId = googleId;
        updated = true;
      }
      if (profilePhoto && user.profilePhoto !== profilePhoto) {
        user.profilePhoto = profilePhoto;
        updated = true;
      }
      if (name && user.name !== name) {
        user.name = name;
        updated = true;
      }
      if (updated) {
        await user.save();
      }
    }

    // Sign JWT session token
    const secret = process.env.JWT_SECRET || "gym_bro_default_jwt_secret_key_2026";
    const token = jwt.sign(
      { id: user._id, email: user.email, googleId: user.googleId },
      secret,
      { expiresIn: "30d" }
    );

    return res.json({
      message: "Authentication successful",
      token,
      user
    });
  } catch (error) {
    console.error("Google auth controller error:", error);
    return res.status(500).json({ error: "Server error during authentication" });
  }
}

/**
 * Fetch current authenticated user.
 * GET /api/auth/me
 */
export async function getMe(req, res) {
  try {
    return res.json({ user: req.user });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch user session" });
  }
}
