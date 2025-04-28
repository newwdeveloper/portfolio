// middleware/auth.js
import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  // Check if there's a token in the Authorization header
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    // Verify the token using the JWT secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the decoded userId to req.auth
    req.auth = { userId: decoded.userId };
    next(); // Continue to the next middleware or route handler
  } catch (error) {
    // Handle invalid or expired token
    return res.status(401).json({ error: "Invalid or expired token." });
  }
};

export default authMiddleware;
