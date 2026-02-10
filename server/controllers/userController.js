// server/controllers/userController.js
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register User
exports.registerUser = async (req, res) => {
  try {
    console.log("=== REGISTER REQUEST ===");
    console.log("Request body:", req.body);
    
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    
    if (existingUser) {
      console.log("User already exists:", email);
      return res.status(400).json({ 
        success: false, 
        message: "User already exists" 
      });
    }

    console.log("Creating new user:", email);
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });
    
    console.log("User created successfully:", user._id);
    res.status(201).json({ 
      success: true, 
      message: "User registered successfully, Please login" 
    });
    
  } catch (error) {
    console.error("=== REGISTER ERROR ===");
    console.error("Error:", error.message);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Login User
exports.loginUser = async (req, res) => {
  try {
    console.log("=== LOGIN REQUEST ===");
    console.log("Request body:", req.body);
    
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log("User not found:", email);
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    console.log("User found:", user.email);
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      console.log("Password mismatch for:", email);
      return res.status(400).json({ 
        success: false, 
        message: "Incorrect password" 
      });
    }

    console.log("Password verified for:", email);
    
    // IMPORTANT: Check both uppercase and lowercase JWT secret
    const jwtSecret = process.env.JWT_SECRET || process.env.jwt_secret || "MoviesMint";
    console.log("Using JWT secret from:", 
      process.env.JWT_SECRET ? "JWT_SECRET" : 
      process.env.jwt_secret ? "jwt_secret" : "default");
    
    if (!jwtSecret) {
      console.error("ERROR: JWT_SECRET is not set!");
      return res.status(500).json({ 
        success: false, 
        message: "Server configuration error" 
      });
    }
    
    console.log("Generating JWT token...");
    const token = jwt.sign({ userId: user._id }, jwtSecret, { expiresIn: "1d" });
    
    console.log("Token generated successfully for:", email);
    res.status(200).json({ 
      success: true, 
      message: "Login successful", 
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin
      }
    });
    
  } catch (error) {
    console.error("=== LOGIN ERROR ===");
    console.error("Error:", error.message);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Get Current User
exports.getCurrentUser = async (req, res) => {
  try {
    console.log("=== GET CURRENT USER ===");
    console.log("User ID from token:", req.userId);
    
    const user = await User.findById(req.userId).select("-password");
    
    if (!user) {
      console.log("User not found with ID:", req.userId);
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }
    
    console.log("Current user found:", user.email);
    res.status(200).json({ 
      success: true, 
      user 
    });
    
  } catch (error) {
    console.error("=== GET CURRENT USER ERROR ===");
    console.error("Error:", error.message);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};