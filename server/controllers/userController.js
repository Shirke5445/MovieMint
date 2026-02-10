// Login User
exports.loginUser = async (req, res) => {
  try {
    console.log("=== LOGIN REQUEST ===");
    console.log("Request body:", req.body);
    
    // Check BOTH uppercase and lowercase JWT secret
    console.log("Checking JWT_SECRET:", process.env.JWT_SECRET ? "SET" : "NOT SET");
    console.log("Checking jwt_secret:", process.env.jwt_secret ? "SET" : "NOT SET");
    
    const { email, password } = req.body;
    
    if (!email || !password) {
      console.log("Validation failed - email or password missing");
      return res.status(400).json({ 
        success: false, 
        message: "Email and password are required" 
      });
    }
    
    console.log("Finding user:", email);
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log("User not found:", email);
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    console.log("User found:", user.email);
    
    console.log("Comparing password...");
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      console.log("Password mismatch for:", email);
      return res.status(400).json({ 
        success: false, 
        message: "Incorrect password" 
      });
    }

    console.log("Password verified for:", email);
    
    // Check if JWT_SECRET is set (try both uppercase and lowercase)
    const jwtSecret = process.env.JWT_SECRET || process.env.jwt_secret;
    
    if (!jwtSecret) {
      console.error("❌ ERROR: JWT_SECRET is not set!");
      console.error("Checked both JWT_SECRET and jwt_secret");
      console.error("Please set JWT_SECRET in Render environment variables");
      return res.status(500).json({ 
        success: false, 
        message: "Server configuration error: JWT secret is not configured",
        help: "Add JWT_SECRET to Render environment variables"
      });
    }
    
    console.log("✅ JWT Secret found, length:", jwtSecret.length);
    console.log("Generating JWT token...");
    
    const token = jwt.sign(
      { userId: user._id }, 
      jwtSecret, 
      { expiresIn: "1d" }
    );
    
    console.log("✅ Token generated successfully for:", email);
    
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
    console.error("Stack:", error.stack);
    
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};