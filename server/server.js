const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");
const authMiddleware = require("./middlewares/authMiddleware"); // Added authMiddleware import

// Load env variables
dotenv.config();

console.log("=== SERVER STARTING ===");
console.log("NODE_ENV:", process.env.NODE_ENV || "development");
console.log("PORT:", process.env.PORT || 5000);
console.log("JWT_SECRET:", process.env.JWT_SECRET ? "SET" : "NOT SET");
console.log("MONGODB_URL:", process.env.MONGODB_URL ? "SET" : "NOT SET");

// DB connection
require("./config/dbConfig");

const app = express();

// CORS - allow all for now
app.use(cors({
  origin: true,
  credentials: true
}));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enhanced request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  if (req.method === 'POST' || req.method === 'PUT') {
    console.log("Request body:", req.body);
  }
  if (req.headers.authorization) {
    console.log("Authorization header present");
  }
  next();
});

// ============================================
// TEST ROUTES (add these before your actual routes)
// ============================================

app.get("/api/status", (req, res) => {
  res.json({ 
    status: "Server is running", 
    time: new Date(),
    mongodb: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    environment: process.env.NODE_ENV || "development"
  });
});

app.post("/api/test-login", (req, res) => {
  console.log("Test login called:", req.body);
  res.json({ 
    success: true, 
    message: "Test route works",
    received: req.body 
  });
});

// Test movie route WITH authentication
app.post("/api/test-movie", authMiddleware, (req, res) => {
  console.log("Test movie route called:", req.body);
  console.log("Authenticated user ID:", req.userId);
  res.json({ 
    success: true, 
    message: "Movie test route works",
    user: req.userId,
    data: req.body 
  });
});

// Test movie route WITHOUT authentication
app.post("/api/test-movie-no-auth", (req, res) => {
  console.log("Test movie route (no auth) called:", req.body);
  res.json({ 
    success: true, 
    message: "Movie test route (no auth) works",
    data: req.body 
  });
});

// Debug database route
app.get("/api/debug-db", async (req, res) => {
  try {
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    
    // Check each collection count
    const counts = {};
    for (const collectionName of collectionNames) {
      try {
        const count = await mongoose.connection.db.collection(collectionName).countDocuments();
        counts[collectionName] = count;
      } catch (err) {
        counts[collectionName] = `Error: ${err.message}`;
      }
    }
    
    res.json({
      success: true,
      message: "Database debug information",
      database: mongoose.connection.db.databaseName,
      connection: mongoose.connection.readyState === 1 ? "CONNECTED" : "DISCONNECTED",
      collections: collectionNames,
      counts: counts,
      environment: {
        NODE_ENV: process.env.NODE_ENV || "development",
        JWT_SECRET: process.env.JWT_SECRET ? "SET" : "NOT SET",
        MONGODB_URL: process.env.MONGODB_URL ? "SET" : "NOT SET"
      }
    });
  } catch (error) {
    console.error("Debug DB error:", error);
    res.status(500).json({
      success: false,
      message: "Debug failed",
      error: error.message,
      mongodbState: mongoose.connection.readyState
    });
  }
});

// ============================================
// YOUR ACTUAL ROUTES
// ============================================

const userRoutes = require("./routes/usersRoute");
const moviesRoute = require("./routes/moviesRoute");
const theatresRoute = require("./routes/theatresRoute");
const bookingsRoute = require("./routes/bookingsRoute");

console.log("=== LOADING ROUTES ===");

// Load and verify each route
try {
  console.log("Loading user routes...");
  app.use("/api/users", userRoutes);
  console.log("✅ User routes loaded");
} catch (err) {
  console.error("❌ Failed to load user routes:", err.message);
}

try {
  console.log("Loading movie routes...");
  app.use("/api/movies", moviesRoute);
  console.log("✅ Movie routes loaded");
} catch (err) {
  console.error("❌ Failed to load movie routes:", err.message);
}

try {
  console.log("Loading theatre routes...");
  app.use("/api/theatres", theatresRoute);
  console.log("✅ Theatre routes loaded");
} catch (err) {
  console.error("❌ Failed to load theatre routes:", err.message);
}

try {
  console.log("Loading booking routes...");
  app.use("/api/bookings", bookingsRoute);
  console.log("✅ Booking routes loaded");
} catch (err) {
  console.error("❌ Failed to load booking routes:", err.message);
}

console.log("=== ALL ROUTES LOADED ===");

// ============================================
// HEALTH CHECK (Keep for backward compatibility)
// ============================================

app.get("/api/health", (req, res) => {
  res.json({ 
    status: "OK", 
    message: "MovieMint API is running",
    timestamp: new Date(),
    mongodb: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    routes: ["/api/users", "/api/movies", "/api/theatres", "/api/bookings"]
  });
});

// ============================================
// SERVE REACT BUILD (ONLY in production)
// ============================================

if (process.env.NODE_ENV === "production") {
  console.log("Production mode: Serving React build files");
  app.use(express.static(path.join(__dirname, "../client/build")));

  // Catch-all route for React SPA - MUST BE LAST
  app.get("*", (req, res) => {
    console.log(`Catch-all route: Serving index.html for ${req.url}`);
    res.sendFile(path.join(__dirname, "../client/build/index.html"));
  });
}

// ============================================
// ERROR HANDLING MIDDLEWARE
// ============================================

app.use((err, req, res, next) => {
  console.error('=== SERVER ERROR ===');
  console.error('Error:', err.message);
  console.error('Stack:', err.stack);
  console.error('URL:', req.originalUrl);
  console.error('Method:', req.method);
  
  res.status(500).json({ 
    success: false,
    error: 'Internal server error',
    message: err.message,
    timestamp: new Date()
  });
});

// 404 Handler for API routes
app.use("/api/*", (req, res) => {
  console.log(`❌ 404: API route not found: ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    message: `API route not found: ${req.originalUrl}`,
    availableRoutes: [
      "/api/users/*",
      "/api/movies/*", 
      "/api/theatres/*",
      "/api/bookings/*",
      "/api/status",
      "/api/health",
      "/api/debug-db",
      "/api/test-login",
      "/api/test-movie",
      "/api/test-movie-no-auth"
    ]
  });
});

// ============================================
// START SERVER
// ============================================

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`\n✅ ============================================`);
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`✅ Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`✅ MongoDB readyState: ${mongoose.connection.readyState}`);
  console.log(`✅ API Base URL: http://localhost:${PORT}/api`);
  console.log(`✅ ============================================\n`);
  
  // Log all registered routes
  console.log("📋 Registered Routes:");
  const routes = [];
  app._router.stack.forEach((middleware) => {
    if (middleware.route) {
      // Routes registered directly on app
      routes.push(`${Object.keys(middleware.route.methods).join(',')} ${middleware.route.path}`);
    } else if (middleware.name === 'router') {
      // Router middleware
      if (middleware.handle.stack) {
        middleware.handle.stack.forEach((handler) => {
          if (handler.route) {
            const method = Object.keys(handler.route.methods)[0];
            const path = middleware.regexp.toString()
              .replace('/^', '')
              .replace('\\/?(?=\\/|$)/i', '')
              .replace(/\\\//g, '/');
            routes.push(`${method.toUpperCase()} ${path}${handler.route.path}`);
          }
        });
      }
    }
  });
  
  // Filter and display API routes
  const apiRoutes = routes.filter(route => route.includes('/api/'));
  apiRoutes.forEach(route => console.log(`  ${route}`));
  
}).on('error', (err) => {
  console.error('❌ Server failed to start:', err.message);
  console.error('Error details:', err);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed');
      process.exit(0);
    });
  });
});

module.exports = app; // For testing purposes