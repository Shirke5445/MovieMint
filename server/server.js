const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose"); // Add this

// Load env variables
dotenv.config();

// DB connection
require("./config/dbConfig");

const app = express();

// Configure CORS properly
app.use(cors({
  origin: ['https://moviemint-e1ia.onrender.com', 'http://localhost:3000'],
  credentials: true
}));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Routes
const userRoutes = require("./routes/usersRoute");
const moviesRoute = require("./routes/moviesRoute");
const theatresRoute = require("./routes/theatresRoute");
const bookingsRoute = require("./routes/bookingsRoute");

app.use("/api/users", userRoutes);
app.use("/api/movies", moviesRoute);
app.use("/api/theatres", theatresRoute);
app.use("/api/bookings", bookingsRoute);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "OK", 
    message: "MovieMint API is running",
    timestamp: new Date(),
    mongodb: mongoose.connection.readyState === 1 ? "connected" : "disconnected"
  });
});

// Serve React build (ONLY in production)
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/build/index.html"));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

// CRITICAL: Proper port binding for Render
const PORT = process.env.PORT || 5000;

// Start server
const server = app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`✅ Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`✅ MongoDB readyState: ${mongoose.connection.readyState}`);
}).on('error', (err) => {
  console.error('❌ Server failed to start:', err.message);
  process.exit(1);
});

// Handle graceful shutdown
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