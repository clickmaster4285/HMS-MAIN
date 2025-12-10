const hospitalModel = require("../models/index.model");
const utils = require("../utils/utilsIndex")
const bcrypt = require("bcrypt");

const createStaff = async (req, res) => {
  try {
    const {
      user_Name,
      user_Email,
      user_Contact,
      user_Address,
      user_CNIC,
      user_Password,
      user_Access,
      designation,
      department,
      qualifications,
      gender,
      dateOfBirth,
      emergencyContact,
      shift,
      shiftTiming
    } = req.body;

    console.log(`Received staff creation request`, req.body);

    const cleanData = { ...req.body };

    // Remove empty strings - convert to undefined
    Object.keys(cleanData).forEach(key => {
      if (cleanData[key] === '') {
        cleanData[key] = undefined;
      }
    });

    // Handle nested objects
    if (cleanData.emergencyContact &&
      Object.values(cleanData.emergencyContact).every(val => !val || val === '')) {
      cleanData.emergencyContact = undefined;
    }

    // Basic required field check
    if (!user_Name || !user_Contact || !user_CNIC || !user_Password || !department || !user_Access) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }

    // CNIC validation
    const cnicRegex = /^[0-9]{5}-[0-9]{7}-[0-9]$/;
    if (!cnicRegex.test(user_CNIC)) {
      return res.status(400).json({
        success: false,
        message: "Invalid CNIC format"
      });
    }

    if (shift && shift.trim() !== '') {
      const validShifts = ['Morning', 'Evening', 'Night', 'Rotational'];
      if (!validShifts.includes(shift)) {
        return res.status(400).json({
          success: false,
          message: `Invalid shift. Must be: ${validShifts.join(', ')}`
        });
      }
    }

    // Check for existing user
    const existingUser = await hospitalModel.User.findOne({
      $or: [
        { user_CNIC },
        { user_Contact },
        ...(user_Email && user_Email.trim() !== '' ? [{ user_Email }] : [])
      ],
      isDeleted: false
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User with these details already exists"
      });
    }

    // Generate ID
    const user_Identifier = await utils.generateUniqueStaffId(user_Access, user_Name.trim());

    // Create user
    const userData = {
      user_Identifier,
      user_Name,
      user_CNIC,
      user_Password: await bcrypt.hash(user_Password, 10),
      user_Access,
      user_Address,
      user_Contact,
      isVerified: true,
      isDeleted: false
    };

    if (user_Email && user_Email.trim() !== '') {
      userData.user_Email = user_Email.trim();
    }

    const newUser = await hospitalModel.User.create([userData]);

    const staffData = {
      user: newUser[0]._id,
      designation: designation || undefined,
      department,
      qualifications: Array.isArray(qualifications) ? qualifications.filter(q => q && q.trim() !== '') : [],
      gender: gender || undefined,
      dateOfBirth: dateOfBirth || undefined,
      emergencyContact: (emergencyContact &&
        (emergencyContact.name || emergencyContact.relation || emergencyContact.phone))
        ? emergencyContact
        : undefined,
      // shift: (shift && shift.trim() !== '') ? shift : undefined, // FIX: Don't send empty string
      ...(shift && ['Morning', 'Evening', 'Night', 'Rotational'].includes(shift) && { shift }),
      shiftTiming: shiftTiming || undefined,
      isVerified: true,
      isDeleted: false
    };
   
    const newStaff = await hospitalModel.Staff.create([staffData]);

    return res.status(201).json({
      success: true,
      message: "Staff successfully created",
      data: {
        staff: newStaff[0],
        user: newUser[0]
      }
    });

  } catch (error) {
    console.error('Staff creation error:', error);

    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => ({
        field: err.path,
        message: err.message
      }));
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors
      });
    }

    return res.status(500).json({
      success: false,
      message: "Error creating staff",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const getAllStaff = async (req, res) => {
  try {
    const staffList = await hospitalModel.Staff.find({ isDeleted: false })
      .populate('user', 'user_Name user_Email user_Contact user_Address user_CNIC user_Access user_Identifier');

    res.status(200).json({
      success: true,
      data: staffList
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching staff",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get staff by ID
const getStaffById = async (req, res) => {
  const { id } = req.params;

  try {
    const staff = await hospitalModel.Staff.findOne({
      _id: id,
      isDeleted: false
    }).populate('user');

    if (!staff) {
      return res.status(404).json({
        success: false,
        message: 'Staff not found'
      });
    }

    res.status(200).json({
      success: true,
      data: staff
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Update staff by ID
const updateStaffById = async (req, res) => {
  const { id } = req.params;
  const {
    user_Name,
    user_Email,
    user_Contact,
    user_Address,
    user_CNIC,
    user_Password, // Add this
    user_Access,
    designation,
    department,
    qualifications,
    gender,
    dateOfBirth,
    emergencyContact,
    shift,
    shiftTiming,
    labSpecialization,
    radiologyCertification
  } = req.body;

  try {
    // Find the staff and populate the user data
    const staff = await hospitalModel.Staff.findOne({
      _id: id,
      isDeleted: false
    }).populate('user');

    if (!staff) {
      return res.status(404).json({
        success: false,
        message: 'Staff not found'
      });
    }

    // Validation for CNIC format if provided
    if (user_CNIC) {
      const cnicRegex = /^[0-9]{5}-[0-9]{7}-[0-9]$/;
      if (!cnicRegex.test(user_CNIC)) {
        return res.status(400).json({
          success: false,
          message: "Invalid CNIC format. Expected format: 12345-1234567-1"
        });
      }
    }

    // Validation for email format if provided
    if (user_Email && !/^\S+@\S+\.\S+$/.test(user_Email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format"
      });
    }

    // Check for duplicate user data (excluding the current user)
    if (user_CNIC || user_Contact || user_Email) {
      const duplicateConditions = {
        _id: { $ne: staff.user._id },
        $or: []
      };

      if (user_CNIC) duplicateConditions.$or.push({ user_CNIC });
      if (user_Contact) duplicateConditions.$or.push({ user_Contact });
      if (user_Email) duplicateConditions.$or.push({ user_Email });

      if (duplicateConditions.$or.length > 0) {
        const existingUser = await hospitalModel.User.findOne(duplicateConditions);

        if (existingUser) {
          let conflictField = '';
          if (existingUser.user_CNIC === user_CNIC) conflictField = 'CNIC';
          else if (existingUser.user_Contact === user_Contact) conflictField = 'phone number';
          else if (existingUser.user_Email === user_Email) conflictField = 'email';

          return res.status(409).json({
            success: false,
            message: `User with this ${conflictField} already exists`,
            conflictField
          });
        }
      }
    }

    // Update user fields if provided
    const userUpdates = {};
    if (user_Name) userUpdates.user_Name = user_Name;
    if (user_Email) userUpdates.user_Email = user_Email;
    if (user_Contact) userUpdates.user_Contact = user_Contact;
    if (user_Address) userUpdates.user_Address = user_Address;
    if (user_CNIC) userUpdates.user_CNIC = user_CNIC;

    // ADD PASSWORD UPDATE LOGIC HERE
    if (user_Password && user_Password.trim() !== '') {
      // Only update password if a new one is provided and it's not empty
      if (user_Password.length < 2) {
        return res.status(400).json({
          success: false,
          message: "Password must be at least 2 characters long"
        });
      }
      userUpdates.user_Password = await bcrypt.hash(user_Password, 10);
    }

    if (user_Access) {
      // Validate user access type
      const allowedStaffTypes = ["Receptionist", "Lab", "Radiology", "Nurse"];
      if (!allowedStaffTypes.includes(user_Access)) {
        return res.status(400).json({
          success: false,
          message: `Invalid staff type. Must be one of: ${allowedStaffTypes.join(", ")}`
        });
      }
      userUpdates.user_Access = user_Access;
    }

    // If user access changed, generate a new identifier
    if (user_Access && user_Access !== staff.user.user_Access) {
      try {
        userUpdates.user_Identifier = await utils.generateUniqueStaffId(user_Access, user_Name || staff.user.user_Name);
      } catch (err) {
        return res.status(500).json({
          success: false,
          message: "Failed to generate unique staff ID",
          error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
      }
    }

    // Update user document
    if (Object.keys(userUpdates).length > 0) {
      await hospitalModel.User.findByIdAndUpdate(
        staff.user._id,
        { $set: userUpdates },
        { new: true, runValidators: true }
      );
    }

    // Update staff fields
    if (designation) staff.designation = designation;
    if (department) staff.department = department;
    if (qualifications) staff.qualifications = Array.isArray(qualifications)
      ? qualifications
      : [qualifications].filter(Boolean);
    if (gender) staff.gender = gender;
    if (dateOfBirth) staff.dateOfBirth = dateOfBirth;
    if (emergencyContact) staff.emergencyContact = emergencyContact;
    if (shift) staff.shift = shift;
    if (shiftTiming) staff.shiftTiming = shiftTiming;

    // Handle specialization fields based on user access
    if (user_Access === "Lab" && labSpecialization) {
      staff.labSpecialization = labSpecialization;
    } else if (user_Access === "Radiology" && radiologyCertification) {
      staff.radiologyCertification = radiologyCertification;
    }

    // Handle file upload if needed
    if (req.files?.profilePicture?.[0]) {
      staff.profilePicture = {
        filePath: `/uploads/staff/profile/${req.files.profilePicture[0].filename}`
      };
    }

    await staff.save();

    // Get the updated staff with populated user data
    const updatedStaff = await hospitalModel.Staff.findById(id).populate('user');

    res.status(200).json({
      success: true,
      message: 'Staff updated successfully',
      data: updatedStaff
    });
  } catch (error) {
    console.error('Staff update error:', error);

    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      const value = error.keyValue[field];

      return res.status(409).json({
        success: false,
        message: `Duplicate entry: ${field} (${value}) already exists.`,
        errorType: 'DUPLICATE_KEY',
        field,
        value
      });
    }

    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors
      });
    }

    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: `Invalid value for field '${error.path}': ${error.value}`
      });
    }

    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred while updating staff",
      error: process.env.NODE_ENV === 'development' ? {
        message: error.message,
        stack: error.stack
      } : undefined
    });
  }
};

// Soft delete staff
const softDeleteStaff = async (req, res) => {
  try {
    const { id } = req.params;

    const staff = await hospitalModel.Staff.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    ).populate('user');

    if (!staff) {
      return res.status(404).json({
        success: false,
        message: "Staff not found"
      });
    }

    // Also mark the user as deleted
    await hospitalModel.User.findByIdAndUpdate(
      staff.user._id,
      { isDeleted: true }
    );

    res.status(200).json({
      success: true,
      message: "Staff deleted successfully",
      data: staff
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting staff",
      error: error.message
    });
  }
};

// Restore soft-deleted staff
const restoreStaff = async (req, res) => {
  try {
    const { id } = req.params;

    const staff = await hospitalModel.Staff.findByIdAndUpdate(
      id,
      { isDeleted: false },
      { new: true }
    ).populate('user');

    if (!staff) {
      return res.status(404).json({
        success: false,
        message: "Staff not found"
      });
    }

    // Also restore the user
    await hospitalModel.User.findByIdAndUpdate(
      staff.user._id,
      { isDeleted: false }
    );

    res.status(200).json({
      success: true,
      message: "Staff restored successfully",
      data: staff
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error restoring staff",
      error: error.message
    });
  }
};

// Get all deleted staff (for admin)
const getDeletedStaff = async (req, res) => {
  try {
    const deletedStaff = await hospitalModel.Staff.find({ isDeleted: true })
      .populate('user', 'user_Identifier user_Name user_Email user_CNIC user_Contact user_Address user_Access');

    res.status(200).json({
      success: true,
      data: deletedStaff
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching deleted staff",
      error: error.message
    });
  }
};

module.exports = {
  createStaff,
  getAllStaff,
  getStaffById,
  updateStaffById,
  softDeleteStaff,
  restoreStaff,
  getDeletedStaff
};
