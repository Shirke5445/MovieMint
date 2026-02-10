const express = require("express");
const router = express.Router();

console.log("=== LOADING USER ROUTES ===");

// Try to load dependencies
let userController, authMiddleware;
try {
  userController = require("../controllers/userController");
  console.log("✅ User controller loaded");
  console.log("  Available methods:", Object.keys(userController));
  console.log("  registerUser type:", typeof userController.registerUser);
  console.log("  loginUser type:", typeof userController.loginUser);
  console.log("  getCurrentUser type:", typeof userController.getCurrentUser);
} catch (err) {
  console.error("❌ Failed to load userController:", err.message);
  console.error("Stack:", err.stack);
}

try {
  authMiddleware = require("../middlewares/authMiddleware");
  console.log("✅ Auth middleware loaded, type:", typeof authMiddleware);
} catch (err) {
  console.error("❌ Failed to load authMiddleware:", err.message);
  console.error("Stack:", err.stack);
}

// Setup routes if dependencies loaded
if (userController && typeof userController.registerUser === 'function') {
  router.post("/register", userController.registerUser);
  console.log("✅ /register route configured");
}

if (userController && typeof userController.loginUser === 'function') {
  router.post("/login", userController.loginUser);
  console.log("✅ /login route configured");
}

if (userController && typeof userController.getCurrentUser === 'function' && authMiddleware) {
  router.get("/get-current-user", authMiddleware, userController.getCurrentUser);
  console.log("✅ /get-current-user route configured");
}

console.log("=== USER ROUTES LOADED ===");

module.exports = router;