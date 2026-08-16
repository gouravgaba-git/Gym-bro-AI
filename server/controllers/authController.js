import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Otp from "../models/Otp.js";
import Session from "../models/Session.js";
import { generateOtp, sendOtpEmail } from "../services/emailService.js";
import { verifyGoogleIdToken } from "../services/googleAuthService.js";

const JWT_SECRET = process.env.JWT_SECRET || "gym_bro_default_jwt_secret_key_2026";

/**
 * Register a new user with manual credentials and send OTP email.
 * POST /api/auth/register
 */
export async function register(req, res) {
  try {
    const { name, username, email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail.includes("@") || !cleanEmail.includes(".")) {
      return res.status(400).json({ error: "Please provide a valid email address" });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters long" });
    }

    const displayName = (name || username || cleanEmail.split("@")[0]).trim();
    const finalUsername = (username || cleanEmail.split("@")[0]).trim().toLowerCase();

    // Check if user already exists
    let existingUser = await User.findOne({ email: cleanEmail });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let user;
    if (existingUser) {
      if (existingUser.verified) {
        return res.status(400).json({ error: "An account with this email already exists. Please sign in." });
      }
      // If user exists but is unverified, update password and re-issue OTP
      existingUser.password = hashedPassword;
      existingUser.name = displayName || existingUser.name;
      existingUser.username = finalUsername || existingUser.username;
      await existingUser.save();
      user = existingUser;
    } else {
      user = await User.create({
        name: displayName,
        username: finalUsername,
        email: cleanEmail,
        password: hashedPassword,
        verified: false,
        profilePhoto: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(cleanEmail)}`,
        joinedAt: new Date(),
        isProfileComplete: false
      });
    }

    // Generate 6-digit OTP
    const otp = generateOtp();
    const hashedOtp = await bcrypt.hash(otp, salt);

    // Store in Otp collection (replacing any prior OTP for this email)
    await Otp.deleteMany({ email: cleanEmail });
    await Otp.create({
      email: cleanEmail,
      otp: hashedOtp
    });

    console.log(`📧 [OTP Generated] For ${cleanEmail} -> Code: ${otp}`);

    // Send verification email
    await sendOtpEmail(cleanEmail, otp, user.name);

    return res.status(201).json({
      message: "Registration successful. Please verify the 6-digit OTP sent to your email.",
      email: cleanEmail,
      verified: false
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ error: "Registration failed. Please try again." });
  }
}

/**
 * Verify 6-digit OTP code and authenticate user.
 * POST /api/auth/verify-otp
 */
export async function verifyOtp(req, res) {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ error: "Email and OTP code are required" });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanOtp = otp.toString().trim();

    console.log(`🔍 [OTP Verification Attempt] Email: "${cleanEmail}", Code: "${cleanOtp}"`);

    const otpRecord = await Otp.findOne({ email: cleanEmail }).sort({ createdAt: -1 });
    if (!otpRecord) {
      console.log(`❌ [OTP Verification Failed] No active OTP record found for "${cleanEmail}"`);
      return res.status(400).json({ error: "OTP expired or not found. Please request a new code." });
    }

    const isMatch = await bcrypt.compare(cleanOtp, otpRecord.otp);
    if (!isMatch) {
      console.log(`❌ [OTP Verification Failed] Incorrect OTP for "${cleanEmail}". Submitted: "${cleanOtp}"`);
      return res.status(400).json({ error: "Invalid verification code. Please check and try again." });
    }

    console.log(`✅ [OTP Verification Success] "${cleanEmail}" verified successfully!`);

    // Update user to verified
    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      return res.status(404).json({ error: "User account not found." });
    }

    user.verified = true;
    await user.save();

    // Clean up OTP entries
    await Otp.deleteMany({ email: cleanEmail });

    // Generate Tokens and Session
    const refreshToken = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });
    const salt = await bcrypt.genSalt(10);
    const hashedRefreshToken = await bcrypt.hash(refreshToken, salt);

    const session = await Session.create({
      userId: user._id,
      refreshToken: hashedRefreshToken
    });

    const accessToken = jwt.sign(
      { id: user._id, email: user.email, session: session._id },
      JWT_SECRET,
      { expiresIn: "30d" }
    );

    // Set HTTP-Only Cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(200).json({
      message: "Account verified successfully! Welcome to Gym Bro.",
      token: accessToken,
      user
    });
  } catch (error) {
    console.error("Verify OTP error:", error);
    return res.status(500).json({ error: "Verification failed. Please try again." });
  }
}

/**
 * Resend a new OTP verification code to user email.
 * POST /api/auth/resend-otp
 */
export async function resendOtp(req, res) {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      return res.status(404).json({ error: "No account found with this email." });
    }

    // Generate fresh OTP
    const otp = generateOtp();
    const salt = await bcrypt.genSalt(10);
    const hashedOtp = await bcrypt.hash(otp, salt);

    await Otp.deleteMany({ email: cleanEmail });
    await Otp.create({
      email: cleanEmail,
      otp: hashedOtp
    });

    await sendOtpEmail(cleanEmail, otp, user.name);

    return res.status(200).json({
      message: "A new 6-digit verification code has been sent to your email.",
      email: cleanEmail
    });
  } catch (error) {
    console.error("Resend OTP error:", error);
    return res.status(500).json({ error: "Failed to resend code. Please try again." });
  }
}

/**
 * Manual Login with Email and Password.
 * POST /api/auth/login
 */
export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      return res.status(400).json({ error: "No account found with this email" });
    }

    if (!user.password) {
      return res.status(400).json({
        error: "This account was registered using Google. Please click 'Continue with Google'."
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid password. Please check your credentials." });
    }

    // Check if account is verified
    if (!user.verified) {
      // Send fresh OTP so the user can verify immediately
      const otp = generateOtp();
      const salt = await bcrypt.genSalt(10);
      const hashedOtp = await bcrypt.hash(otp, salt);

      await Otp.deleteMany({ email: cleanEmail });
      await Otp.create({
        email: cleanEmail,
        otp: hashedOtp
      });

      await sendOtpEmail(cleanEmail, otp, user.name);

      return res.status(200).json({
        requireOtp: true,
        message: "Your account is not verified yet. A verification code has been sent to your email.",
        email: cleanEmail
      });
    }

    // Generate Session & Tokens
    const refreshToken = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });
    const salt = await bcrypt.genSalt(10);
    const hashedRefreshToken = await bcrypt.hash(refreshToken, salt);

    const session = await Session.create({
      userId: user._id,
      refreshToken: hashedRefreshToken
    });

    const accessToken = jwt.sign(
      { id: user._id, email: user.email, session: session._id },
      JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(200).json({
      message: "Login successful",
      token: accessToken,
      user
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Login failed. Please try again." });
  }
}

/**
 * Refresh Access Token using Refresh Token from cookie or body.
 * POST /api/auth/refresh
 */
export async function refreshToken(req, res) {
  try {
    const rawToken = req.cookies?.refreshToken || req.body?.refreshToken;
    if (!rawToken) {
      return res.status(401).json({ error: "Refresh token not found" });
    }

    let decoded;
    try {
      decoded = jwt.verify(rawToken, JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ error: "Invalid or expired refresh token" });
    }

    // Find active non-revoked sessions for this user
    const sessions = await Session.find({ userId: decoded.id, revoked: false });
    let matchedSession = null;

    for (const s of sessions) {
      const match = await bcrypt.compare(rawToken, s.refreshToken);
      if (match) {
        matchedSession = s;
        break;
      }
    }

    if (!matchedSession) {
      return res.status(401).json({ error: "Session revoked or expired" });
    }

    // Rotate refresh token
    const newRefreshToken = jwt.sign({ id: decoded.id }, JWT_SECRET, { expiresIn: "7d" });
    const salt = await bcrypt.genSalt(10);
    matchedSession.refreshToken = await bcrypt.hash(newRefreshToken, salt);
    await matchedSession.save();

    const accessToken = jwt.sign(
      { id: decoded.id, session: matchedSession._id },
      JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(200).json({ accessToken });
  } catch (error) {
    console.error("Refresh token error:", error);
    return res.status(500).json({ error: "Failed to refresh token" });
  }
}

/**
 * Log out user by revoking current session and clearing cookie.
 * POST /api/auth/logout
 */
export async function logout(req, res) {
  try {
    const rawToken = req.cookies?.refreshToken || req.body?.refreshToken;

    if (rawToken) {
      try {
        const decoded = jwt.verify(rawToken, JWT_SECRET);
        const sessions = await Session.find({ userId: decoded.id, revoked: false });
        for (const s of sessions) {
          const match = await bcrypt.compare(rawToken, s.refreshToken);
          if (match) {
            s.revoked = true;
            await s.save();
            break;
          }
        }
      } catch (e) {}
    }

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/"
    });

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ error: "Logout failed" });
  }
}

/**
 * Log out all active sessions for the user.
 * POST /api/auth/logoutAll
 */
export async function logoutAll(req, res) {
  try {
    const rawToken = req.cookies?.refreshToken || req.body?.refreshToken;
    let userId = req.user?._id;

    if (!userId && rawToken) {
      try {
        const decoded = jwt.verify(rawToken, JWT_SECRET);
        userId = decoded.id;
      } catch (e) {}
    }

    if (userId) {
      await Session.updateMany({ userId, revoked: false }, { revoked: true });
    }

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/"
    });

    return res.status(200).json({ message: "Logged out from all devices successfully" });
  } catch (error) {
    console.error("LogoutAll error:", error);
    return res.status(500).json({ error: "Failed to log out all sessions" });
  }
}

/**
 * Handle Google GIS OAuth authentication.
 * POST /api/auth/google
 */
export async function googleAuth(req, res) {
  try {
    const { credential, profile } = req.body;

    if (!credential && !profile) {
      return res.status(400).json({ error: "Google OAuth credential token or profile is required" });
    }

    let googlePayload;
    if (credential) {
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
    } else if (profile && (profile.sub || profile.id) && profile.email) {
      googlePayload = {
        googleId: profile.sub || profile.id,
        email: profile.email,
        name: profile.name || profile.given_name || profile.email.split("@")[0],
        profilePhoto: profile.picture || profile.photo || ""
      };
    } else {
      return res.status(400).json({ error: "Invalid Google user profile payload" });
    }

    const { googleId, email, name, profilePhoto } = googlePayload;
    const cleanEmail = email.toLowerCase().trim();

    let user = await User.findOne({
      $or: [{ googleId }, { email: cleanEmail }]
    });

    if (!user) {
      user = await User.create({
        googleId,
        email: cleanEmail,
        name,
        profilePhoto,
        verified: true,
        joinedAt: new Date(),
        isProfileComplete: false
      });
    } else {
      let updated = false;
      if (!user.verified) {
        user.verified = true;
        updated = true;
      }
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
    const token = jwt.sign(
      { id: user._id, email: user.email, googleId: user.googleId },
      JWT_SECRET,
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
 * GET /api/auth/me or GET /api/auth/getuser
 */
export async function getMe(req, res) {
  try {
    return res.json({ user: req.user });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch user session" });
  }
}

// Alias emailAuth for backward compatibility
export const emailAuth = login;
