const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  expenseType: {
    type: String,
    enum: ["doctor", "hospital"],
    required: true
  },

  // Doctor related fields
  doctor: {
    type: String,
    trim: true,
    default: null
  },

  doctorWelfare: {
    type: Number,
    min: 0,
    default: 0
  },

  // OT expenses (can be doctor or hospital)
  otExpenses: {
    type: Number,
    min: 0,
    default: 0
  },

  // Other common expenses
  otherExpenses: {
    type: Number,
    min: 0,
    default: 0
  },

  description: {
    type: String,
    trim: true,
    default: ''
  },

  date: {
    type: Date,
    default: Date.now
  },

  total: {
    type: Number,
    required: true
  },

  deleted: {
    type: Boolean,
    default: false
  },
}, {
  timestamps: true
});


// Auto-calculate total
expenseSchema.pre("save", function (next) {
  this.total = this.doctorWelfare + this.otExpenses + this.otherExpenses;
  next();
});


// Doctor-wise summary
expenseSchema.statics.getDoctorSummary = function () {
  return this.aggregate([
    { $match: { expenseType: "doctor" } }, // only doctor expenses
    {
      $group: {
        _id: "$doctor",
        totalWelfare: { $sum: "$doctorWelfare" },
        totalOT: { $sum: "$otExpenses" },
        totalOther: { $sum: "$otherExpenses" },
        totalAmount: { $sum: "$total" },
        entries: { $sum: 1 }
      }
    }
  ]);
};


// Hospital-wise summary
expenseSchema.statics.getHospitalTotals = function () {
  return this.aggregate([
    { $match: { expenseType: "hospital" } }, // only hospital expenses
    {
      $group: {
        _id: null,
        welfare: { $sum: "$doctorWelfare" },
        ot: { $sum: "$otExpenses" },
        other: { $sum: "$otherExpenses" },
        hospitalTotal: { $sum: "$total" },
        entries: { $sum: 1 }
      }
    },
    {
      $project: {
        _id: 0,
        welfare: 1,
        ot: 1,
        other: 1,
        hospitalTotal: 1,
        entries: 1
      }
    }
  ]);
};

module.exports = mongoose.model("Expense", expenseSchema);
