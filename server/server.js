const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

// Load env variables
dotenv.config();

// DB connection
require("./config/dbConfig");

const app = express();

// Configure CORS properly
app.use(cors({
  origin: [
    'https://moviemint-e1ia.onrender.com',
    'http://localhost:3000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
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

// Test routes for debugging
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "MovieMint API running",
    timestamp: new Date(),
    env: process.env.NODE_ENV
  });
});

app.get("/api/debug", (req, res) => {
  res.json({
    status: 'Server is running',
    time: new Date(),
    jwtSecret: process.env.JWT_SECRET ? 'SET' : 'NOT SET',
    nodeEnv: process.env.NODE_ENV,
    port: process.env.PORT
  });
});

app.post("/api/test-login", (req, res) => {
  console.log("Test login body:", req.body);
  res.json({
    success: true,
    message: "Test endpoint working",
    received: req.body
  });
});

// Serve React build (ONLY in production)
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));

  app.get("*", (req, res) => {
    res.sendFile(
      path.join(__dirname, "../client/build/index.html")
    );
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err.message);
  console.error('Error Stack:', err.stack);
  res.status(500).json({ 
    success: false,
    error: 'Internal server error',
    message: err.message 
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`JWT_SECRET: ${process.env.JWT_SECRET ? 'SET' : 'NOT SET'}`);
});