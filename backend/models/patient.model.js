const mongoose = require("mongoose");

const visitSchema = new mongoose.Schema({
  visitDate: { type: Date, default: Date.now },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
  purpose: { type: String, },
  disease: { type: String },
  doctorFee: { type: Number, },
  discount: { type: Number, default: 0 },
  totalFee: { type: Number, },

  // Payment tracking fields
  amountPaid: { type: Number, default: 0 },
  amountDue: { type: Number, required: true },
  amountStatus: {
    type: String,
    enum: ['paid', 'pending', 'partial'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'bank_transfer', 'online', 'other'],
    default: 'cash'
  },
  paymentDate: { type: Date },
  paymentNotes: { type: String },

  // VCO field
  verbalConsentObtained: { type: Boolean, default: false },
  // Refund tracking fields
  totalRefunded: {
    type: Number,
    default: 0
  },

  remainingAmount: {
    type: Number,
    default: function () {
      return this.amountPaid - this.totalRefunded;
    }
  },

  refundStatus: {
    type: String,
    enum: ['not_refunded', 'partially_refunded', 'fully_refunded'],
    default: 'not_refunded'
  },

  token: { type: String, },
  referredBy: { type: String },
}, { timestamps: true });

const patientSchema = new mongoose.Schema(
  {
    patient_MRNo: { type: String, unique: true, },
    patient_Name: { type: String, },
    patient_ContactNo: { type: String, },
    patient_Guardian: {
      guardian_Relation: { type: String },
      guardian_Name: { type: String },
      guardian_Contact: { type: String },
    },
    patient_CNIC: { type: String, unique: true, sparse: true },
    patient_Gender: { type: String, enum: ['male', 'female', 'other'], },
    patient_Age: { type: Number },
    patient_DateOfBirth: { type: Date },
    patient_Address: { type: String },
    patient_BloodType: { type: String, enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] },
    patient_MaritalStatus: { type: String, enum: ['single', 'married', 'divorced', 'widowed'] },

    visits: [visitSchema],
    lastVisit: { type: Date },
    totalVisits: { type: Number, default: 0 },

    // Patient financial summary
    totalAmountPaid: { type: Number, default: 0 },
    totalAmountDue: { type: Number, default: 0 },

    deleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster search
// patientSchema.index({ patient_MRNo: 1 });
// patientSchema.index({ patient_CNIC: 1 });
patientSchema.index({ patient_ContactNo: 1 });
patientSchema.index({ patient_Name: 1 });
patientSchema.index({ "patient_Guardian.guardian_Contact": 1 });

const Patient = mongoose.model("Patient", patientSchema);
module.exports = Patient;