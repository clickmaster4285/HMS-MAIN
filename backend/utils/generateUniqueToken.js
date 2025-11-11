// utils/generateUniqueToken.js
const Counter = require("../models/counter.model"); // Import the counter model

const generateUniqueToken = async (date) => {
   try {
      const dateObj = date ? new Date(date) : new Date();
      dateObj.setHours(0, 0, 0, 0); // Start of the day
      const dateString = dateObj.toISOString().split('T')[0]; // Format as YYYY-MM-DD

      // Atomically find and update the counter (if any)
      const counter = await Counter.findOneAndUpdate(
         { date: dateString }, // Find the document for today
         { $inc: { tokenCount: 1 } }, // Increment token count by 1
         { new: true, upsert: true } // `new: true` returns the updated document; `upsert: true` creates a new document if it doesn't exist
      );

      // Return the updated token count
      return counter.tokenCount;
   } catch (error) {
      console.error("Error generating unique token:", error);
      return 1; // Fallback value in case of error
   }
};

module.exports = generateUniqueToken;