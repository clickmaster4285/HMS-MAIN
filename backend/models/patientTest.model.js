const mongoose = require("mongoose");

/* ---------------- Refund Schema ---------------- */
const refundSchema = new mongoose.Schema(
  {
    testId: { type: mongoose.Schema.Types.ObjectId, ref: "TestManagment" },
    performedByname: String,
    performedByid: String,
    refundAmount: Number,
    refundReason: String,
  },
  { timestamps: true, _id: false }
);

/* ---------------- Patient Test Schema ---------------- */
const patientTestSchema = new mongoose.Schema(
  {
    isExternalPatient: { type: Boolean, default: false },

    tokenNumber: {
      type: Number,
      required: true,
      index: true, // ✅ fast token lookup
    },

    patient_Detail: {
      patient_MRNo: {
        type: String,
        index: true, // ✅ search
      },
      patient_Guardian: String,
      patient_CNIC: {
        type: String,
        index: true, // ✅ search
      },
      patient_Name: {
        type: String,
        index: true, // ✅ search
      },
      patient_ContactNo: String,
      patient_Gender: String,
      patient_Age: String,
      referredBy: String,
    },

    selectedTests: [
      {
        test: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "TestManagment",
          index: true, // ✅ join performance
        },

        testStatus: {
          type: String,
          enum: ["draft", "registered", "completed", "cancelled", "refunded", "pending"],
          default: "registered",
          index: true,
        },

        testDetails: {
          advanceAmount: { type: Number, default: 0 },
          discountAmount: { type: Number, default: 0 },
          remainingAmount: { type: Number, default: 0 },
          testName: String,
          testCode: {
            type: String,
            index: true, // ✅ testCode search
          },
          testPrice: { type: Number, required: true },
          sampleStatus: {
            type: String,
            enum: ["pending", "collected"],
            default: "pending",
          },
          reportStatus: {
            type: String,
            enum: ["not_started", "draft", "completed"],
            default: "not_started",
          },
        },

        testDate: { type: Date, default: Date.now },
        resultDate: { type: Date },

        statusHistory: [
          {
            status: {
              type: String,
              enum: [
                "registered",
                "sample-collected",
                "processing",
                "completed",
                "reported",
                "cancelled",
              ],
            },
            changedAt: { type: Date, default: Date.now },
            changedBy: String,
          },
        ],
      },
    ],

    totalAmount: { type: Number, required: true },
    advanceAmount: { type: Number, default: 0 },
    discountAmount: { type: Number, default: 0 },
    remainingAmount: { type: Number, default: 0 },
    cancelledAmount: { type: Number, default: 0 },
    refundableAmount: { type: Number, default: 0 },

    refunded: [refundSchema],

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "partial", "refunded"],
      default: "pending",
      index: true,
    },

    paidAfterReport: { type: Number, default: 0 },
    totalPaid: { type: Number, default: 0 },

    labNotes: String,

    history: [
      {
        action: String,
        performedBy: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],

    performedBy: String,

    isDeleted: {
      type: Boolean,
      default: false,
      index: true, // ✅ critical
    },
  },
  {
    timestamps: true,
  }
);

/* ---------------- COMPOUND & TEXT INDEXES ---------------- */

// 🔍 Text search (FAST search instead of regex)
patientTestSchema.index({
  "patient_Detail.patient_MRNo": "text",
  "patient_Detail.patient_Name": "text",
  "patient_Detail.patient_CNIC": "text",
});

// 📄 Pagination & sorting
patientTestSchema.index({ createdAt: -1 });

// ⚡ Common filter combinations
patientTestSchema.index({ isDeleted: 1, paymentStatus: 1 });

const PatientTest = mongoose.model("PatientTest", patientTestSchema);

module.exports = PatientTest;
