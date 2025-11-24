const mongoose = require("mongoose");

const testManagementSchema = new mongoose.Schema(
  {
    testName: { type: String, required: true },
    testDept: { type: String },
    testCode: { type: String, required: true, unique: true },
    description: { type: String },
    instructions: { type: String },
    testPrice: { type: Number, required: true },
    requiresFasting: { type: Boolean, default: false },
    reportDeliveryTime: { type: String },
    fields: [
      {
        name: { type: String, required: true },
        unit: { type: String },
        inputType: { 
          type: String, 
          enum: ['text', 'dropdown', 'number'], 
          default: 'text' 
        },
        options: [{ type: String }], // Array of options for dropdown
        normalRange: {
          type: Map,
          of: {
            min: { type: mongoose.Schema.Types.Mixed },
            max: { type: mongoose.Schema.Types.Mixed },
            unit: { type: String },
            description: { type: String }
          }
        },
        commonUnits: [{ type: String }],
        commonLabels: [{ type: String }]
      }
    ],
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Add indexes for better performance
testManagementSchema.index({ testCode: 1 });

const TestManagement = mongoose.model("TestManagement", testManagementSchema, "testmanagements");

module.exports = TestManagement;