// controllers/refundController.js
const hospitalModel = require('../models/index.model');
const emitGlobalEvent = require("../utils/emitGlobalEvent");
const EVENTS = require("../utils/socketEvents");
// Create a new refund with enhanced tracking
exports.createRefund = async (req, res) => {
   try {
      const {
         patientMRNo,
         visitId,
         refundAmount,
         refundReason,
         refundDescription,
         originalPaymentMethod,
         refundMethod,
         notes
      } = req.body;

      // Check if user is authenticated
      if (!req.user || !req.user._id) {
         return res.status(401).json({
            success: false,
            message: 'Authentication required. Please log in again.'
         });
      }

      // Find patient by MR number
      const patient = await hospitalModel.Patient.findOne({ patient_MRNo: patientMRNo });
      if (!patient) {
         return res.status(404).json({
            success: false,
            message: 'Patient not found'
         });
      }

      // Find the specific visit
      const visit = patient.visits.id(visitId);
      if (!visit) {
         return res.status(404).json({
            success: false,
            message: 'Visit not found'
         });
      }

      // Get existing refunds for this visit
      const existingRefunds = await hospitalModel.Refund.find({ visit: visitId });
      const totalAlreadyRefunded = existingRefunds.reduce((sum, refund) => sum + refund.refundAmount, 0);

      const maxRefundable = visit.amountPaid - totalAlreadyRefunded;

      if (refundAmount > maxRefundable) {
         return res.status(400).json({
            success: false,
            message: `Refund amount exceeds maximum refundable amount of ${maxRefundable}. Already refunded: ${totalAlreadyRefunded}`
         });
      }

      if (refundAmount <= 0) {
         return res.status(400).json({
            success: false,
            message: 'Refund amount must be greater than zero'
         });
      }

      // Create refund with original amount tracking
      const refund = new hospitalModel.Refund({
         patient: patient._id,
         visit: visitId,
         originalAmount: visit.amountPaid, // Store the original amount paid
         refundAmount,
         refundReason,
         refundDescription,
         originalPaymentMethod: visit.paymentMethod || originalPaymentMethod,
         refundMethod,
         processedBy: req.user._id,
         notes
      });

      await refund.save();

      // Update visit with refund information
      visit.totalRefunded = (visit.totalRefunded || 0) + refundAmount;
      visit.remainingAmount = visit.amountPaid - visit.totalRefunded;
      visit.refundStatus = visit.remainingAmount === 0 ? 'fully_refunded' :
         visit.totalRefunded > 0 ? 'partially_refunded' : 'not_refunded';

      await patient.save();

      // Populate data for response
      await refund.populate('patient', 'patient_MRNo patient_Name');
      await refund.populate('processedBy', 'user_Name user_Email');

        emitGlobalEvent(req, EVENTS.REFUND, "create", refund);

      res.status(201).json({
         success: true,
         message: 'Refund processed successfully',
         data: {
            refund,
            visitSummary: {
               originalAmount: visit.amountPaid,
               totalRefunded: visit.totalRefunded,
               remainingAmount: visit.remainingAmount,
               refundStatus: visit.refundStatus
            }
         }
      });

   } catch (error) {
      console.error('Error creating refund:', error);

      if (error.name === 'ValidationError') {
         return res.status(400).json({
            success: false,
            message: Object.values(error.errors).map(err => err.message).join(', ')
         });
      }

      res.status(500).json({
         success: false,
         message: 'Server error while creating refund'
      });
   }
};

// Get refunds by patient MR number
exports.getRefundsByMRNumber = async (req, res) => {
   try {
      const { mrNumber } = req.params;

      // Find patient first to get their ID
      const patient = await hospitalModel.Patient.findOne({ patient_MRNo: mrNumber });
      if (!patient) {
         return res.status(404).json({
            success: false,
            message: 'Patient not found'
         });
      }

      // Now find refunds for this patient
      const refunds = await hospitalModel.Refund.find({ patient: patient._id })
         .populate('patient', 'patient_MRNo patient_Name patient_ContactNo patient_CNIC')
         .populate('processedBy', 'user_Name user_Email')
         .sort({ refundDate: -1 });

      // Enhance refunds with visit details
      const refundsWithVisitDetails = await Promise.all(
         refunds.map(async (refund) => {
            const refundObj = refund.toObject();

            if (refund.visit) {
               const visit = patient.visits.id(refund.visit);
               if (visit) {
                  refundObj.visitDetails = {
                     _id: visit._id,
                     visitDate: visit.visitDate,
                     purpose: visit.purpose,
                     amountPaid: visit.amountPaid,
                     totalFee: visit.totalFee,
                     discount: visit.discount,
                     paymentMethod: visit.paymentMethod,
                     token: visit.token,
                     doctor: visit.doctor
                  };
               }
            }

            return refundObj;
         })
      );

      res.json({
         success: true,
         data: refundsWithVisitDetails
      });

   } catch (error) {
      console.error('Error fetching refunds:', error);
      res.status(500).json({
         success: false,
         message: 'Server error while fetching refunds'
      });
   }
};

exports.getRefunds = async (req, res) => {
   try {
      // Get query parameters for filtering
      const { status, startDate, endDate, patientMRNo } = req.query;

      // Build filter object
      const filter = {};

      if (status) {
         filter.status = status;
      }

      if (startDate || endDate) {
         filter.refundDate = {};
         if (startDate) {
            filter.refundDate.$gte = new Date(startDate);
         }
         if (endDate) {
            filter.refundDate.$lte = new Date(endDate);
            // Set end of day for end date
            filter.refundDate.$lte.setHours(23, 59, 59, 999);
         }
      }

      // Find refunds with population of patient data
      let refunds = await hospitalModel.Refund.find(filter)
         .populate({
            path: 'patient',
            select: 'patient_MRNo patient_Name patient_ContactNo patient_CNIC patient_Gender patient_Age patient_Address',
            model: hospitalModel.Patient
         })
         .populate({
            path: 'processedBy',
            select: 'user_Name user_Email'
         })
         .sort({ refundDate: -1 });

      // If patientMRNo filter is provided, filter results
      if (patientMRNo) {
         refunds = refunds.filter(refund =>
            refund.patient && refund.patient.patient_MRNo === patientMRNo
         );
      }

      // For each refund, we need to manually get the visit details from the patient
      const refundsWithVisitDetails = await Promise.all(
         refunds.map(async (refund) => {
            const refundObj = refund.toObject();

            if (refund.patient && refund.visit) {
               // Find the specific visit in the patient's visits array
               const patient = await hospitalModel.Patient.findById(refund.patient._id);
               if (patient) {
                  const visit = patient.visits.id(refund.visit);
                  if (visit) {
                     refundObj.visitDetails = {
                        _id: visit._id,
                        visitDate: visit.visitDate,
                        purpose: visit.purpose,
                        amountPaid: visit.amountPaid,
                        totalFee: visit.totalFee,
                        discount: visit.discount,
                        paymentMethod: visit.paymentMethod,
                        token: visit.token,
                        doctor: visit.doctor // This is just the ID, you might want to populate doctor details separately
                     };

                     // If you need doctor details, you can populate them here
                     if (visit.doctor) {
                        const doctor = await hospitalModel.Doctor.findById(visit.doctor)
                           .populate('user', 'user_Name');
                        if (doctor) {
                           refundObj.visitDetails.doctorDetails = {
                              name: doctor.user?.user_Name || 'N/A',
                              department: doctor.doctor_Department || 'N/A'
                           };
                        }
                     }
                  }
               }
            }

            return refundObj;
         })
      );

      res.json({
         success: true,
         data: refundsWithVisitDetails,
         count: refundsWithVisitDetails.length
      });

   } catch (error) {
      console.error('Error fetching refunds:', error);
      res.status(500).json({
         success: false,
         message: 'Server error while fetching refunds',
         error: error.message
      });
   }
};

// Get patient visits for refund selection
exports.getPatientVisitsForRefund = async (req, res) => {
   try {
      const { mrNumber } = req.params;

      const patient = await hospitalModel.Patient.findOne({ patient_MRNo: mrNumber })
         .select('visits patient_Name patient_MRNo totalAmountPaid');

      if (!patient) {
         return res.status(404).json({
            success: false,
            message: 'Patient not found'
         });
      }

      // Calculate refundable amount per visit
      const visitsWithRefundInfo = await Promise.all(
         patient.visits.map(async (visit) => {
            const visitRefunds = await hospitalModel.Refund.find({
               visit: visit._id,
               status: { $in: ['approved', 'processed'] }
            });

            const totalRefunded = visitRefunds.reduce((sum, refund) => sum + refund.refundAmount, 0);
            const refundable = visit.amountPaid - totalRefunded;

            return {
               _id: visit._id,
               visitDate: visit.visitDate,
               doctor: visit.doctor,
               purpose: visit.purpose,
               amountPaid: visit.amountPaid,
               totalRefunded,
               refundable,
               canRefund: refundable > 0
            };
         })
      );

      res.json({
         success: true,
         data: {
            patient: {
               _id: patient._id,
               patient_MRNo: patient.patient_MRNo,
               patient_Name: patient.patient_Name,
               totalAmountPaid: patient.totalAmountPaid
            },
            visits: visitsWithRefundInfo
         }
      });

   } catch (error) {
      console.error('Error fetching patient visits:', error);
      res.status(500).json({
         success: false,
         message: 'Server error while fetching patient visits'
      });
   }
};

exports.getRefundById = async (req, res) => {
   try {
      const { id } = req.params;

      const refund = await hospitalModel.Refund.findById(id)
         .populate('patient', 'patient_MRNo patient_Name patient_ContactNo patient_CNIC patient_Gender patient_Age patient_Address')
         .populate('processedBy', 'user_Name user_Email');

      if (!refund) {
         return res.status(404).json({
            success: false,
            message: 'Refund not found'
         });
      }

      // Add visit details
      const refundObj = refund.toObject();

      if (refund.patient && refund.visit) {
         const patient = await hospitalModel.Patient.findById(refund.patient._id);
         if (patient) {
            const visit = patient.visits.id(refund.visit);
            if (visit) {
               refundObj.visitDetails = {
                  _id: visit._id,
                  visitDate: visit.visitDate,
                  purpose: visit.purpose,
                  amountPaid: visit.amountPaid,
                  totalFee: visit.totalFee,
                  discount: visit.discount,
                  paymentMethod: visit.paymentMethod,
                  token: visit.token,
                  doctor: visit.doctor
               };

               // Add doctor details if available
               if (visit.doctor) {
                  const doctor = await hospitalModel.Doctor.findById(visit.doctor)
                     .populate('user', 'user_Name');
                  if (doctor) {
                     refundObj.visitDetails.doctorDetails = {
                        name: doctor.user?.user_Name || 'N/A',
                        department: doctor.doctor_Department || 'N/A'
                     };
                  }
               }
            }
         }
      }

      res.json({
         success: true,
         data: refundObj
      });

   } catch (error) {
      console.error('Error fetching refund:', error);
      res.status(500).json({
         success: false,
         message: 'Server error while fetching refund',
         error: error.message
      });
   }
};

// Update refund status
exports.updateRefundStatus = async (req, res) => {
   try {
      const { id } = req.params;
      const { status, notes, authorizedBy } = req.body;

      const refund = await hospitalModel.Refund.findById(id);
      if (!refund) {
         return res.status(404).json({
            success: false,
            message: 'Refund not found'
         });
      }

      refund.status = status;
      if (notes) refund.notes = notes;
      if (authorizedBy) refund.authorizedBy = authorizedBy;

      await refund.save();
      await refund.populate('patient', 'patient_MRNo patient_Name');

      emitGlobalEvent(req, EVENTS.REFUND, "update", refund);

      res.json({
         success: true,
         message: 'Refund status updated successfully',
         data: refund
      });

   } catch (error) {
      console.error('Error updating refund status:', error);
      res.status(500).json({
         success: false,
         message: 'Server error while updating refund status'
      });
   }
};

exports.getRefundStatistics = async (req, res) => {
   try {
      const { startDate, endDate } = req.query;

      const filter = {};

      if (startDate || endDate) {
         filter.refundDate = {};
         if (startDate) {
            filter.refundDate.$gte = new Date(startDate);
         }
         if (endDate) {
            filter.refundDate.$lte = new Date(endDate);
            filter.refundDate.$lte.setHours(23, 59, 59, 999);
         }
      }

      const refunds = await hospitalModel.Refund.find(filter);

      const statistics = {
         totalRefunds: refunds.length,
         totalRefundAmount: refunds.reduce((sum, refund) => sum + (refund.refundAmount || 0), 0),
         byStatus: {},
         byPaymentMethod: {},
         dailyBreakdown: {}
      };

      // Calculate statistics by status
      refunds.forEach(refund => {
         statistics.byStatus[refund.status] = (statistics.byStatus[refund.status] || 0) + 1;
      });

      // Calculate statistics by payment method
      refunds.forEach(refund => {
         statistics.byPaymentMethod[refund.refundMethod] = (statistics.byPaymentMethod[refund.refundMethod] || 0) + 1;
      });

      // Calculate daily breakdown
      refunds.forEach(refund => {
         const date = refund.refundDate.toISOString().split('T')[0];
         statistics.dailyBreakdown[date] = (statistics.dailyBreakdown[date] || 0) + (refund.refundAmount || 0);
      });

      res.json({
         success: true,
         data: statistics
      });

   } catch (error) {
      console.error('Error fetching refund statistics:', error);
      res.status(500).json({
         success: false,
         message: 'Server error while fetching refund statistics',
         error: error.message
      });
   }
};

// exports.getSummary = async (req, res) => {
//    try {
//       const doctor = await hospitalModel.Doctor.find().populate('user', 'user_Name user_Email');
//       const patients = await hospitalModel.Patient.find();
//       const refunds = await hospitalModel.Refund.find();
//       return res.status(200).json({
//          success: true,
//          data: {
//             totalDoctors: doctor,
//             totalPatients: patients,
//             totalRefunds: refunds
//          }
//       });
//    } catch (error) {
//       console.error('Error fetching dashboard summary:', error);
//       res.status(500).j = son({
//          success: false,
//          message: 'Server error while fetching dashboard summary',
//          error: error.message
//       });
//    }
// };