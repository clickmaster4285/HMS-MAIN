// models/RadiologyReport.js
const mongoose = require('mongoose');

const RefundedSchema = new mongoose.Schema(
  {
    refundAmount: { type: Number, default: 0 },
    refundReason: { type: String, default: '' },
    performedByname: { type: String, default: '' },
    performedByid: { type: mongoose.Schema.Types.ObjectId, default: null },
    refundedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const HistorySchema = new mongoose.Schema(
  {
    action: { type: String, required: true },
    performedBy: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

// NEW: one record can contain many ultrasound studies
const StudySchema = new mongoose.Schema(
  {
    templateName: String, // e.g. 'ultrasound-pelvis.html'
    finalContent: String, // HTML of that template
    referBy: String, ///

    totalAmount: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    advanceAmount: { type: Number, default: 0 },
    totalPaid: { type: Number, default: 0 },
    remainingAmount: { type: Number, default: 0 },
    refundableAmount: { type: Number, default: 0 },
    paymentStatus: {
      type: String,
      enum: ['pending', 'partial', 'paid', 'refunded'],
      default: 'pending',
    },
    _delete: { type: String, default: false },
    refunded: [RefundedSchema],
    history: [HistorySchema],
  },
  { _id: true, timestamps: true }
);

const RadiologyReportSchema = new mongoose.Schema(
  {
    // Patient/visit header
    patientMRNO: String,
    patientName: String,
    patient_ContactNo: String,
    age: Date,
    sex: String,
    date: { type: Date, default: Date.now }, // visit/report date
    deleted: { type: Boolean, default: false },

    // (OLD single-report fields; keep optional for backward compatibility)
    templateName: String,
    finalContent: String,
    referBy: String,

    // (OLD single-report totals; keep optional)
    totalAmount: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    advanceAmount: { type: Number, default: 0 },
    paidAfterReport: { type: Number, default: 0 },
    totalPaid: { type: Number, default: 0 },
    remainingAmount: { type: Number, default: 0 },
    refundableAmount: { type: Number, default: 0 },
    paymentStatus: {
      type: String,
      enum: ['pending', 'partial', 'paid', 'refunded'],
      default: 'pending',
    },

    refunded: [RefundedSchema],
    history: [HistorySchema],

    performedBy: {
      name: String,
      id: mongoose.Schema.Types.ObjectId,
    },
    createdBy: mongoose.Schema.Types.ObjectId,

    // NEW: multi-study array
    studies: [StudySchema], // ← each ultrasound lives here

    // NEW: aggregated totals across studies
    aggTotalAmount: { type: Number, default: 0 },
    aggTotalDiscount: { type: Number, default: 0 },
    aggTotalPaid: { type: Number, default: 0 },
    aggRemainingAmount: { type: Number, default: 0 },
    aggPaymentStatus: {
      type: String,
      enum: ['pending', 'partial', 'paid', 'refunded'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

RadiologyReportSchema.index({ patientMRNO: 1, date: -1 });

module.exports = mongoose.model('RadiologyReport', RadiologyReportSchema);
