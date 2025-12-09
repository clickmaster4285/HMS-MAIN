const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    user_Identifier: { type: String, unique: true, },
    user_Name: { type: String },
    user_Email: {
      type: String,
      unique: true,
      sparse: true,
      // Remove default so field doesn't get created automatically
      set: function (email) {
        // Only return value if email exists
        if (email && typeof email === 'string' && email.trim() !== '') {
          return email.trim().toLowerCase();
        }
        // Return undefined to prevent field creation
        return undefined;
      }
    },
    user_Password: { type: String, required: true },
    user_CNIC: { type: String, unique: true, },
    user_Contact: { type: String },
    user_Address: { type: String },
    // In your User model
    user_Access: {
      type: String,
      enum: ["Admin", "Receptionist", "Lab", "Radiology", "Doctor", "Nurse", "Patient"],
      required: true
    },
    doctorProfile: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
    isVerified: { type: Boolean, default: false, },
    isDeleted: { type: Boolean, default: false },
    verificationCode: { type: String, },
  },
  { timestamps: true, }
);

const User = mongoose.model("User", userSchema);

module.exports = User;