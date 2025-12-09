const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
    // Personal Information
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    profilePicture: { type: String },
    gender: { type: String, enum: ['Male', 'Female', 'Other'] },
    dateOfBirth: { type: Date },
    // Professional Information
    designation: { type: String },
    department: { type: String, required: true },
    qualifications: [{ type: String }],
    joiningDate: { type: Date, default: Date.now },

    // Emergency Contact
    emergencyContact: {
        name: { type: String },
        relation: { type: String },
        phone: { type: String }
    },

    // Shift information
    shift: { type: String, enum: ['Morning', 'Evening', 'Night', 'Rotational'], default: undefined },
    shiftTiming: {
        start: { type: String }, // e.g. '08:00'
        end: { type: String }    // e.g. '16:00'
    },

    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

const Staff = mongoose.model('Staff', staffSchema);
module.exports = Staff;