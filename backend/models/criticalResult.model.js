const mongoose = require('mongoose');

const criticalTestSchema = new mongoose.Schema({
  testName: { type: String, required: true },
  criticalValue: { type: String, required: true },
});

const criticalResultSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true },
    patientName: { type: String, required: true },
    gender: { type: String },
    age: { type: String },
    mrNo: { type: String, required: true, index: true },
    contactNo: { type: String, required: true },
    sampleCollectionTime: { type: String },
    reportDeliveryTime: { type: String },
    informedTo: { type: String },
    tests: [criticalTestSchema],
    labTechSignature: { type: String },
    doctorSignature: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('CriticalResult', criticalResultSchema);
