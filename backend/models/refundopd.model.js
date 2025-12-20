// models/Refund.js
const mongoose = require("mongoose");

const refundSchema = new mongoose.Schema({
   patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
   visit: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient.visits' },

   // Financial tracking
   originalAmount: { type: Number, required: true, min: 0 },
   refundAmount: {
      type: Number, required: true, min: 0, validate: {
         validator: function (value) { return value <= this.originalAmount; },
         message: 'Refund amount cannot exceed original amount'
      }
   },
   remainingAmount: {
      type: Number, default: function () { return this.originalAmount - this.refundAmount; }
   },
   refundPercentage: {
      type: Number, default: function () {
         return (this.refundAmount / this.originalAmount) * 100;
      }
   },
   // Status tracking
   refundStatus: { type: String, enum: ['pending', 'partial', 'full', 'cancelled', 'rejected'], default: 'pending' },
   refundDate: { type: Date, default: Date.now },
   refundReason: { type: String, required: true, trim: true },
   refundDescription: { type: String, trim: true },
   originalPaymentMethod: { type: String, enum: ['cash', 'card', 'bank_transfer', 'online', 'other'], required: true },
   refundMethod: { type: String, enum: ['cash', 'bank_transfer', 'credit_note', 'adjustment', 'other'], required: true },
   // Person processing the refund
   processedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
   authorizedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
   status: {
      type: String, enum: ['pending', 'approved', 'processed', 'rejected', 'cancelled'],
      default: 'pending'
   },
}, {
   timestamps: true
});

// Pre-save middleware to update remaining amount and status
refundSchema.pre('save', function () {
   const original = this.originalAmount || 0;
   const refunded = this.refundAmount || 0;

   // Remaining amount
   this.remainingAmount = original - refunded;

   // Refund percentage (safe divide)
   this.refundPercentage = original > 0
     ? (refunded / original) * 100
     : 0;

   // Refund status
   if (refunded === 0) {
      this.refundStatus = 'pending';
   } else if (refunded === original) {
      this.refundStatus = 'full';
   } else if (refunded > 0) {
      this.refundStatus = 'partial';
   }

   this.updatedAt = Date.now();
});

// Indexes for faster queries
refundSchema.index({ patient: 1, visit: 1 });
refundSchema.index({ refundStatus: 1 });
refundSchema.index({ refundDate: -1 });

// Static method to get refund summary for a visit
refundSchema.statics.getVisitRefundSummary = async function(visitId) {
  const refunds = await this.find({ visit: visitId });
  
  const totalOriginalAmount = refunds.reduce((sum, refund) => sum + refund.originalAmount, 0);
  const totalRefunded = refunds.reduce((sum, refund) => sum + refund.refundAmount, 0);
  const totalRemaining = totalOriginalAmount - totalRefunded;
  
  return {
    totalOriginalAmount,
    totalRefunded,
    totalRemaining,
    refundPercentage: totalOriginalAmount > 0 ? (totalRefunded / totalOriginalAmount) * 100 : 0,
    refundCount: refunds.length,
    refunds
  };
};

// Static method to get patient refund summary
refundSchema.statics.getPatientRefundSummary = async function(patientId) {
  const refunds = await this.find({ patient: patientId });
  
  const summary = {
    totalOriginalAmount: 0,
    totalRefunded: 0,
    totalRemaining: 0,
    refundsByStatus: {
      pending: 0,
      partial: 0,
      full: 0,
      cancelled: 0,
      rejected: 0
    },
    visits: {}
  };
  
  refunds.forEach(refund => {
    summary.totalOriginalAmount += refund.originalAmount;
    summary.totalRefunded += refund.refundAmount;
    summary.totalRemaining += refund.remainingAmount;
    
    // Count by status
    summary.refundsByStatus[refund.refundStatus]++;
    
    // Group by visit
    if (!summary.visits[refund.visit]) {
      summary.visits[refund.visit] = {
        originalAmount: 0,
        refundedAmount: 0,
        remainingAmount: 0,
        refundCount: 0
      };
    }
    
    summary.visits[refund.visit].originalAmount += refund.originalAmount;
    summary.visits[refund.visit].refundedAmount += refund.refundAmount;
    summary.visits[refund.visit].remainingAmount += refund.remainingAmount;
    summary.visits[refund.visit].refundCount++;
  });
  
  return summary;
};



const Refund = mongoose.model("Refund", refundSchema);
module.exports = Refund;