import jwt from "jsonwebtoken";
import { User } from "../model/Users.model.js";

export const authenticate = async (req) => {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return { isAuthenticated: false, user: null };
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return { isAuthenticated: false, user: null };
    }

    return { isAuthenticated: true, user };
  } catch (error) {
    return { isAuthenticated: false, user: null };
  }
};

export const requireAuth = (context) => {
  if (!context.isAuthenticated) {
    throw new Error("Authentication required");
  }
};

export const requireRole = (context, allowedRoles) => {
  requireAuth(context);

  if (!allowedRoles.includes(context.user.role)) {
    throw new Error(
      `Access denied. Required roles: ${allowedRoles.join(", ")}`
    );
  }
};

export const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};
