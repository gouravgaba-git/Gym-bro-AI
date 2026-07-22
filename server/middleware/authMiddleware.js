import jwt from "jsonwebtoken";
import User from "../models/User.js";

/**
 * Middleware to authenticate requests via JWT Bearer Token.
 */
export async function protect(req, res, next) {
  try {
    let token;
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ error: "Not authorized, token missing" });
    }

    const secret = process.env.JWT_SECRET || "gym_bro_default_jwt_secret_key_2026";
    const decoded = jwt.verify(token, secret);

    const user = await User.findById(decoded.id).select("-__v");
    if (!user) {
      return res.status(401).json({ error: "User session expired or user not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error.message);
    return res.status(401).json({ error: "Not authorized, invalid token" });
  }
}
