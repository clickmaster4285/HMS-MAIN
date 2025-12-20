require ("dotenv").config();
const mongoose = require("mongoose");
const MONGO_URI = process.env.MONGO_URI;
const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.info("Connected to the database");
  } catch (err) {
    console.error("Database connection error:", err);
    process.exit(1); 
  }
};

module.exports = connectDB;
