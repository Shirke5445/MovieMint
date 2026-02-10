const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  try {
    console.log("=== AUTH MIDDLEWARE ===");
    
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("No Bearer token found");
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    const token = authHeader.split(" ")[1];
    console.log("Token found, verifying...");

    // Check both uppercase and lowercase JWT secret
    const jwtSecret = process.env.JWT_SECRET || process.env.jwt_secret || "MovieMint";
    console.log("Using JWT secret from:", process.env.JWT_SECRET ? "JWT_SECRET" : process.env.jwt_secret ? "jwt_secret" : "default");

    // Verify token
    const decoded = jwt.verify(token, jwtSecret);
    console.log("Token verified for user:", decoded.userId);

    // Attach to req
    req.userId = decoded.userId;

    next();
  } catch (error) {
    console.error("Auth middleware error:", error.message);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired. Please login again.",
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token. Please login again.",
      });
    }

    return res.status(401).json({
      success: false,
      message: "Authentication failed",
    });
  }
};