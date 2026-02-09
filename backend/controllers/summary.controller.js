const hospitalModel = require('../models/index.model');
const emitGlobalEvent = require("../utils/emitGlobalEvent");
const EVENTS = require("../utils/socketEvents");
exports.getSummary = async (req, res) => {
   try {
      const doctor = await hospitalModel.Doctor.find().populate('user', 'user_Name user_Email');
      const patients = await hospitalModel.Patient.find();
      const refunds = await hospitalModel.Refund.find();
      return res.status(200).json({
         success: true,
         data: {
            totalDoctors: doctor,
            totalPatients: patients,
            totalRefunds: refunds
         }
      });
   } catch (error) {
      console.error('Error fetching dashboard summary:', error);
      res.status(500).j = son({
         success: false,
         message: 'Server error while fetching dashboard summary',
         error: error.message
      });
   }
};