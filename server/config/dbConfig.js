const mongoose = require('mongoose');

console.log("=== MONGODB CONFIGURATION ===");
console.log("Checking for MONGODB_URL:", process.env.MONGODB_URL ? "FOUND" : "NOT FOUND");
console.log("Checking for mongo_url:", process.env.mongo_url ? "FOUND" : "NOT FOUND");

// Try both uppercase and lowercase
const mongoURI = process.env.MONGODB_URL || process.env.mongo_url;

if (!mongoURI) {
  console.error("❌ ERROR: MongoDB connection string not found!");
  console.error("Please set MONGODB_URL or mongo_url in Render environment variables");
  // Don't exit - let server start without DB for debugging
  console.warn("⚠️  Starting server without MongoDB connection");
} else {
  console.log("Using MongoDB URI (first 50 chars):", mongoURI.substring(0, 50) + "...");
  
  mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected Successfully"))
  .catch(err => {
    console.error("❌ MongoDB connection Failed:", err.message);
    console.warn("⚠️  Continuing without MongoDB connection");
  });
}

const connection = mongoose.connection;

connection.on('connected', () => {
  console.log('✅ MongoDB connected Successfully'); 
});

connection.on('error', (err) => {
  console.error("❌ MongoDB connection Failed:", err.message);
});