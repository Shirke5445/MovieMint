const mongoose = require('mongoose');

console.log("=== MONGODB CONFIGURATION ===");
console.log("Checking for MONGODB_URL:", process.env.MONGODB_URL ? "FOUND" : "NOT FOUND");
console.log("Checking for mongo_url:", process.env.mongo_url ? "FOUND" : "NOT FOUND");


const mongoURI = process.env.MONGODB_URL || process.env.mongo_url;

if (!mongoURI) {
  console.error("❌ ERROR: MongoDB connection string not found!");
  console.error("Please set MONGODB_URL or mongo_url environment variable in Render");
  console.error("Current environment variables:", Object.keys(process.env).filter(k => k.includes('mongo') || k.includes('MONGO')));
  process.exit(1);
}

console.log("Using MongoDB URI (first 50 chars):", mongoURI.substring(0, 50) + "...");

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;

connection.on('connected', () => {
  console.log('✅ MongoDB connected Successfully'); 
});

connection.on('error', (err) => {
  console.error("❌ MongoDB connection Failed:", err.message);
  console.error("Full error:", err);
});