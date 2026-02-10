const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const {
  registerUser,
  loginUser,
  getCurrentUser,
} = require("../controllers/userController");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/get-current-user", authMiddleware, getCurrentUser);

module.exports = router;
