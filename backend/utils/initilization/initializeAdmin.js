const bcrypt = require("bcrypt");
const User = require("../../models/user.model"); // Adjust path to your User model

const saltRounds = 10;

const initializeAdmin = async () => {
  try {
    // Check if an admin already exists
    const existingAdmin = await User.findOne({
      user_Access: "Admin"
    });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash("123", saltRounds);

      const adminData = {
        user_Name: "Hospital Admin",
        user_Email: "admin@hospital.com",
        user_Password: hashedPassword,
        user_CNIC: "00000-0000000-0",
        user_Identifier: "ADMIN-001",
        user_Contact: "0000-0000000",
        user_Address: "Hospital Headquarters",
        user_Access: "Admin",
        isVerified: true
      };

      await User.create(adminData);
    } else {
    }
  } catch (error) {
    console.error("❌ Error initializing Admin:", error.message);
  }
};

module.exports = initializeAdmin;