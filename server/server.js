const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

// Load env variables
dotenv.config();

// DB connection
require("./config/dbConfig");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
const userRoutes = require("./routes/usersRoute");
const moviesRoute = require("./routes/moviesRoute");
const theatresRoute = require("./routes/theatresRoute");
const bookingsRoute = require("./routes/bookingsRoute");

app.use("/api/users", userRoutes);
app.use("/api/movies", moviesRoute);
app.use("/api/theatres", theatresRoute);
app.use("/api/bookings", bookingsRoute);

// Test route
app.get("/api/health", (req, res) => {
  res.send("MovieMint API running");
});

//  Serve React build (ONLY in production)
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));

  app.get("*", (req, res) => {
    res.sendFile(
      path.join(__dirname, "../client/build/index.html")
    );
  });
}

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
