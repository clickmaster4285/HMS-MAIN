const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    user_Identifier: { type: String, unique: true, },
    user_Name: { type: String },
    user_Email: { type: String, unique: true,  sparse: true,
      default: null, // Add default null
      set: function (email) {
        // Convert empty strings to null
        return email && email.trim() !== '' ? email.trim() : null;
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