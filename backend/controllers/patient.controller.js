const hospitalModel = require("../models/index.model");
const utils = require("../utils/utilsIndex");

// Search patient by multiple fields
const searchPatient = async (req, res) => {
  try {
    const { searchTerm, page = 1, limit = 10 } = req.query;

    if (!searchTerm) {
      return res.status(400).json({
        success: false,
        message: "Search term is required",
      });
    }

    const patients = await hospitalModel.Patient.find({
      deleted: false,
      $or: [
        { patient_MRNo: { $regex: searchTerm, $options: 'i' } },
        { patient_CNIC: { $regex: searchTerm, $options: 'i' } },
        { patient_ContactNo: { $regex: searchTerm, $options: 'i' } },
        { patient_Name: { $regex: searchTerm, $options: 'i' } },
        { "patient_Guardian.guardian_Contact": { $regex: searchTerm, $options: 'i' } }
      ]
    })
      .populate({
        path: 'visits.doctor',
        select: 'doctor_Department doctor_Specialization doctor_Fee user doctor_Qualifications doctor_Gender doctor_Type doctor_LicenseNumber',
        populate: {
          path: 'user',
          select: 'user_Name user_Email user_Contact'
        }
      });

    return res.status(200).json({
      success: true,
      message: "Patients found successfully",
      information: {
        patients,
        totalCount: patients.length
      },
    });
  } catch (error) {
    console.error("Error searching patients:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Helper function to populate patient data
const populatePatient = async (patientId) => {
  return await hospitalModel.Patient.findById(patientId)
    .populate({
      path: 'visits.doctor',
      select: 'doctor_Department doctor_Specialization doctor_Fee user doctor_Qualifications doctor_Gender doctor_Type doctor_LicenseNumber',
      populate: {
        path: 'user',
        select: 'user_Name user_Email user_Contact'
      }
    });
};

// Create patient with improved logic
const createPatient = async (req, res) => {
  try {
    const {
      patient_MRNo, // Optional: if provided, means existing patient
      patient_Name,
      patient_ContactNo,
      patient_Guardian,
      patient_CNIC,
      patient_Gender,
      patient_Age,
      patient_DateOfBirth,
      patient_Address,
      patient_BloodType,
      patient_MaritalStatus,
      visitData
    } = req.body;

    let doctor = null;
    let doctorFee = 0;

    // Only check doctor if provided and valid
    if (visitData?.doctor && visitData.doctor.trim() !== '') {
      doctor = await hospitalModel.Doctor.findById(visitData.doctor);
      if (!doctor) {
        return res.status(404).json({
          success: false,
          message: "Doctor not found",
        });
      }
      doctorFee = doctor.doctor_Fee || 0;
    }

    const currentDate = new Date();
    const tokenData = await utils.generateOPDToken(visitData.doctor, currentDate);

    // Calculate visit details
    const discount = visitData?.discount || 0;
    const totalFee = Math.max(0, doctorFee - discount);
    const amountPaid = parseFloat(visitData?.amountPaid) || 0;

    // Create visit object
    const newVisit = {
      visitDate: currentDate,
      doctor: visitData.doctor || null,
      purpose: visitData.purpose || "Consultation",
      disease: visitData.disease || "",
      doctorFee: doctorFee,
      discount: discount,
      totalFee: totalFee,

      // Payment fields
      amountPaid: amountPaid,
      amountDue: Math.max(0, totalFee - amountPaid),
      amountStatus: amountPaid >= totalFee ? 'paid' :
        (amountPaid > 0 ? 'partial' : 'pending'),
      paymentMethod: visitData?.paymentMethod || 'cash',
      paymentDate: amountPaid > 0 ? currentDate : null,
      paymentNotes: visitData?.paymentNotes || "",

      // VCO field
      verbalConsentObtained: visitData?.verbalConsentObtained || false,

      token: tokenData.token,
      referredBy: visitData?.referredBy || "",
      notes: visitData?.notes || ""
    };

    let patient;

    // ONLY search by MR Number for existing patients (friend's better approach)
    if (patient_MRNo) {
      patient = await hospitalModel.Patient.findOne({
        patient_MRNo,
        deleted: false
      });

      if (patient) {
        // Check for conflicting information if patient is found by MR number
        let updateConflicts = [];

        // Only check MR number conflict (other fields can be updated)
        if (patient_MRNo && patient.patient_MRNo !== patient_MRNo) {
          updateConflicts.push(`MR Number: existing (${patient.patient_MRNo}) vs new (${patient_MRNo})`);
        }

        // If there are conflicts, return error
        if (updateConflicts.length > 0) {
          return res.status(409).json({
            success: false,
            message: "Patient MR Number conflict detected",
            conflicts: updateConflicts,
            existingPatient: {
              patient_MRNo: patient.patient_MRNo,
              patient_ContactNo: patient.patient_ContactNo,
              patient_CNIC: patient.patient_CNIC,
              patient_Name: patient.patient_Name
            }
          });
        }

        // Existing patient found by MR number - add new visit
        patient.visits.push(newVisit);
        patient.lastVisit = currentDate;
        patient.totalVisits += 1;

        // Update patient information if provided
        if (patient_Name) patient.patient_Name = patient_Name;
        if (patient_ContactNo) patient.patient_ContactNo = patient_ContactNo;
        if (patient_Guardian) {
          patient.patient_Guardian = {
            ...patient.patient_Guardian,
            ...patient_Guardian
          };
        }
        if (patient_CNIC) patient.patient_CNIC = patient_CNIC;
        if (patient_Gender) patient.patient_Gender = patient_Gender;
        if (patient_Age) patient.patient_Age = parseInt(patient_Age);
        if (patient_DateOfBirth) patient.patient_DateOfBirth = new Date(patient_DateOfBirth);
        if (patient_Address) patient.patient_Address = patient_Address;
        if (patient_BloodType) patient.patient_BloodType = patient_BloodType;
        if (patient_MaritalStatus) patient.patient_MaritalStatus = patient_MaritalStatus;

        // Update financial summary
        patient.totalAmountPaid = patient.visits.reduce((sum, v) => sum + (v.amountPaid || 0), 0);
        patient.totalAmountDue = patient.visits.reduce((sum, v) => sum + (v.amountDue || 0), 0);

        await patient.save();

        return res.status(200).json({
          success: true,
          message: "Visit added to existing patient successfully",
          information: { patient: await populatePatient(patient._id) },
        });
      }
    }

    // If no existing patient found by MR number, create new patient
    // Validate required fields for new patient
    if (!patient_Name || !patient_ContactNo) {
      return res.status(400).json({
        success: false,
        message: "Patient name and contact number are required for new patient registration",
      });
    }

    // Generate new MR Number for new patient
    const newPatientMRNo = await utils.generateUniqueMrNo(currentDate.toISOString().split('T')[0]);

    // Create new patient with first visit
    patient = await hospitalModel.Patient.create({
      patient_MRNo: newPatientMRNo,
      patient_Name,
      patient_ContactNo,
      patient_Guardian: patient_Guardian || {},
      patient_CNIC: patient_CNIC || undefined,
      patient_Gender: patient_Gender || undefined,
      patient_Age: parseInt(patient_Age) || 0,
      patient_DateOfBirth: patient_DateOfBirth ? new Date(patient_DateOfBirth) : null,
      patient_Address: patient_Address || undefined,
      patient_BloodType: patient_BloodType || undefined,
      patient_MaritalStatus: patient_MaritalStatus || undefined,
      visits: [newVisit],
      lastVisit: currentDate,
      totalVisits: 1,
      totalAmountPaid: newVisit.amountPaid,
      totalAmountDue: newVisit.amountDue
    });

    // Populate the complete data for response
    const populatedPatient = await populatePatient(patient._id);

    return res.status(201).json({
      success: true,
      message: "New patient created successfully with first visit",
      information: { patient: populatedPatient },
    });

  } catch (error) {
    console.error("Error in createPatient:", error);

    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(409).json({
        success: false,
        message: `Patient with this ${field.replace('patient_', '').replace('_', ' ')} already exists`,
        duplicateField: field
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getPatientById = async (req, res) => {
  try {
    const { patientId } = req.params;

    const patient = await hospitalModel.Patient.findOne({
      _id: patientId,
      deleted: false,
    })
      .populate({
        path: 'visits.doctor',
        select: 'doctor_Department doctor_Specialization doctor_Fee user doctor_Qualifications doctor_Gender doctor_Type doctor_LicenseNumber',
        populate: {
          path: 'user',
          select: 'user_Name user_Email user_Contact'
        }
      });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Patient retrieved successfully with history",
      information: { patient },
    });
  } catch (error) {
    console.error("Error fetching patient history:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updatePatient = async (req, res) => {
  try {
    const { patient_MRNo } = req.params;
    const {
      patient_Name,
      patient_ContactNo,
      patient_Guardian,
      patient_CNIC,
      patient_Gender,
      patient_Age,
      patient_DateOfBirth,
      patient_Address,
      patient_BloodType,
      patient_MaritalStatus,
      visitData
    } = req.body;

    // Find by patient_MRNo
    const patient = await hospitalModel.Patient.findOne({
      patient_MRNo,
      deleted: false
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    // Update patient basic information (only if provided)
    const updateFields = {
      patient_Name, patient_ContactNo, patient_CNIC, patient_Gender,
      patient_Age, patient_DateOfBirth, patient_Address, patient_BloodType, patient_MaritalStatus
    };

    Object.keys(updateFields).forEach(key => {
      if (updateFields[key] !== undefined && updateFields[key] !== null && updateFields[key] !== '') {
        patient[key] = key === 'patient_Age' ? parseInt(updateFields[key]) :
          key === 'patient_DateOfBirth' ? new Date(updateFields[key]) : updateFields[key];
      }
    });

    // Update guardian information if provided
    if (patient_Guardian) {
      patient.patient_Guardian = {
        ...patient.patient_Guardian,
        ...patient_Guardian
      };
    }

    // Handle visit data updates
    if (visitData) {
      const { visitId, ...visitUpdateData } = visitData;

      if (visitId) {
        // UPDATE EXISTING VISIT
        const visit = patient.visits.id(visitId);
        if (!visit) {
          return res.status(404).json({
            success: false,
            message: "Visit not found",
          });
        }

        // Update visit fields if provided
        if (visitUpdateData.purpose !== undefined) visit.purpose = visitUpdateData.purpose;
        if (visitUpdateData.disease !== undefined) visit.disease = visitUpdateData.disease;
        if (visitUpdateData.referredBy !== undefined) visit.referredBy = visitUpdateData.referredBy;
        if (visitUpdateData.notes !== undefined) visit.notes = visitUpdateData.notes;
        if (visitUpdateData.verbalConsentObtained !== undefined) {
          visit.verbalConsentObtained = visitUpdateData.verbalConsentObtained;
        }

        // Handle doctor change
        if (visitUpdateData.doctor && visitUpdateData.doctor !== visit.doctor?.toString()) {
          const newDoctor = await hospitalModel.Doctor.findById(visitUpdateData.doctor);
          if (!newDoctor) {
            return res.status(404).json({
              success: false,
              message: "Doctor not found",
            });
          }

          visit.doctor = visitUpdateData.doctor;
          visit.doctorFee = newDoctor.doctor_Fee || 0;

          // Recalculate fees with existing discount
          const discount = visit.discount || 0;
          visit.totalFee = Math.max(0, visit.doctorFee - discount);
          visit.amountDue = Math.max(0, visit.totalFee - (visit.amountPaid || 0));
        }

        // Handle discount changes
        if (visitUpdateData.discount !== undefined) {
          visit.discount = parseFloat(visitUpdateData.discount) || 0;
          visit.totalFee = Math.max(0, visit.doctorFee - visit.discount);
          visit.amountDue = Math.max(0, visit.totalFee - (visit.amountPaid || 0));
        }

        // Handle payment updates
        if (visitUpdateData.amountPaid !== undefined) {
          const newAmountPaid = parseFloat(visitUpdateData.amountPaid) || 0;
          visit.amountPaid = newAmountPaid;
          visit.amountDue = Math.max(0, visit.totalFee - newAmountPaid);

          // Update payment status
          visit.amountStatus = newAmountPaid >= visit.totalFee ? 'paid' :
            (newAmountPaid > 0 ? 'partial' : 'pending');

          // Set payment date if payment is made now
          if (newAmountPaid > 0 && !visit.paymentDate) {
            visit.paymentDate = new Date();
          }
        }

        if (visitUpdateData.paymentMethod !== undefined) {
          visit.paymentMethod = visitUpdateData.paymentMethod;
        }

        if (visitUpdateData.paymentDate !== undefined) {
          visit.paymentDate = visitUpdateData.paymentDate ? new Date(visitUpdateData.paymentDate) : null;
        }

      } else {
        // ADD NEW VISIT
        if (!visitUpdateData.doctor) {
          return res.status(400).json({
            success: false,
            message: "Doctor is required for new visit",
          });
        }

        const doctor = await hospitalModel.Doctor.findById(visitUpdateData.doctor);
        if (!doctor) {
          return res.status(404).json({
            success: false,
            message: "Doctor not found",
          });
        }

        const currentDate = new Date();
        const tokenData = await utils.generateOPDToken(visitUpdateData.doctor, currentDate);

        const doctorFee = doctor.doctor_Fee || 0;
        const discount = parseFloat(visitUpdateData?.discount) || 0;
        const totalFee = Math.max(0, doctorFee - discount);
        const amountPaid = parseFloat(visitUpdateData?.amountPaid) || 0;

        const newVisit = {
          visitDate: currentDate,
          doctor: visitUpdateData.doctor,
          purpose: visitUpdateData.purpose || "Consultation",
          disease: visitUpdateData.disease || "",
          doctorFee: doctorFee,
          discount: discount,
          totalFee: totalFee,
          amountPaid: amountPaid,
          amountDue: Math.max(0, totalFee - amountPaid),
          amountStatus: amountPaid >= totalFee ? 'paid' :
            (amountPaid > 0 ? 'partial' : 'pending'),
          paymentMethod: visitUpdateData.paymentMethod || 'cash',
          paymentDate: amountPaid > 0 ? currentDate : null,
          paymentNotes: visitUpdateData.paymentNotes || "",
          verbalConsentObtained: visitUpdateData.verbalConsentObtained || false,
          token: tokenData.token,
          referredBy: visitUpdateData.referredBy || "",
          notes: visitUpdateData.notes || ""
        };

        patient.visits.push(newVisit);
        patient.lastVisit = currentDate;
        patient.totalVisits += 1;
      }
    }

    // Update patient's financial summary
    patient.totalAmountPaid = patient.visits.reduce((sum, v) => sum + (v.amountPaid || 0), 0);
    patient.totalAmountDue = patient.visits.reduce((sum, v) => sum + (v.amountDue || 0), 0);

    await patient.save();

    // Populate the updated patient data for response
    const populatedPatient = await populatePatient(patient._id);

    return res.status(200).json({
      success: true,
      message: "Patient updated successfully",
      information: { patient: populatedPatient },
    });

  } catch (error) {
    console.error("Error updating patient:", error);

    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(409).json({
        success: false,
        message: `Patient with this ${field.replace('patient_', '').replace('_', ' ')} already exists`,
        duplicateField: field
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllPatients = async (req, res) => {
  try {
    // Pagination with safe defaults
    const page = Math.max(1, parseInt(req.query.page || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit || '10', 10)));
    const skip = (page - 1) * limit;

    // Search / filters
    const search = req.query.search || '';
    const gender = req.query.gender;
    const bloodType = req.query.bloodType;
    const maritalStatus = req.query.maritalStatus;
    const fromDate = req.query.fromDate;
    const toDate = req.query.toDate;

    // Sorting
    const sortBy = req.query.sortBy || 'lastVisit';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

    // Build query
    const query = { deleted: false };

    if (search) {
      query.$or = [
        { patient_MRNo: { $regex: search, $options: 'i' } },
        { patient_Name: { $regex: search, $options: 'i' } },
        { patient_ContactNo: { $regex: search, $options: 'i' } },
        { patient_CNIC: { $regex: search, $options: 'i' } },
        { "patient_Guardian.guardian_Name": { $regex: search, $options: 'i' } },
        { "patient_Guardian.guardian_Contact": { $regex: search, $options: 'i' } }
      ];
    }

    if (gender) query.patient_Gender = gender;
    if (bloodType) query.patient_BloodType = bloodType;
    if (maritalStatus) query.patient_MaritalStatus = maritalStatus;

    // Filter by last visit date (your approach)
    if (fromDate || toDate) {
      query.lastVisit = {};
      if (fromDate) query.lastVisit.$gte = new Date(fromDate);
      if (toDate) query.lastVisit.$lte = new Date(`${toDate}T23:59:59.999Z`);
    }

    const sortOptions = { [sortBy]: sortOrder };

    // Return only last visit for OPD list (your approach)
    const patients = await hospitalModel.Patient.find(query)
      .select(
        'patient_MRNo patient_Name patient_ContactNo patient_CNIC patient_Gender patient_Age ' +
        'patient_Address patient_BloodType patient_Guardian patient_MaritalStatus totalVisits lastVisit visits'
      )
      .slice('visits', -1) // only last visit
      .populate({
        path: 'visits.doctor',
        select: 'doctor_Department doctor_Specialization doctor_Fee user doctor_Qualifications doctor_Gender doctor_Type doctor_LicenseNumber',
        populate: {
          path: 'user',
          select: 'user_Name user_Email user_Contact'
        }
      })
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    const totalPatients = await hospitalModel.Patient.countDocuments(query);
    const totalPages = Math.ceil(totalPatients / limit);

    return res.status(200).json({
      success: true,
      message: "Patients retrieved successfully",
      information: {
        count: patients.length,
        patients,
        pagination: {
          currentPage: page,
          totalPages,
          totalPatients,
          hasNext: page < totalPages,
          hasPrev: page > 1,
          limit
        },
        filters: { search, gender, bloodType, maritalStatus, fromDate, toDate }
      },
    });
  } catch (error) {
    console.error("Error fetching patients:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Keep other functions the same (getPatientByMRNo, deletePatient, getPatientWithRefundHistory)
const getPatientByMRNo = async (req, res) => {
  try {
    const { patient_MRNo } = req.params;

    const patient = await hospitalModel.Patient.findOne({
      patient_MRNo,
      deleted: false,
    })
      .populate({
        path: 'visits.doctor',
        select: 'doctor_Department doctor_Specialization doctor_Fee user doctor_Qualifications doctor_Gender doctor_Type doctor_LicenseNumber',
        populate: {
          path: 'user',
          select: 'user_Name user_Email user_Contact'
        }
      });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Patient retrieved successfully",
      information: { patient },
    });
  } catch (error) {
    console.error("Error fetching patient:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deletePatient = async (req, res) => {
  try {
    const { patientId } = req.params;

    if (!patientId) {
      return res.status(400).json({
        success: false,
        message: "Please provide the patient ID.",
      });
    }

    const patient = await hospitalModel.Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found.",
      });
    }

    patient.deleted = true;
    await patient.save();

    return res.status(200).json({
      success: true,
      message: "Patient deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting patient:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getPatientWithRefundHistory = async (req, res) => {
  try {
    const { patientMRNo } = req.params;

    // Find patient with all visits populated
    const patient = await hospitalModel.Patient.findOne({
      patient_MRNo: patientMRNo,
      deleted: false,
    })
      .populate({
        path: 'visits.doctor',
        select: 'doctor_Department doctor_Specialization doctor_Fee user doctor_Qualifications doctor_Gender doctor_Type doctor_LicenseNumber',
        populate: {
          path: 'user',
          select: 'user_Name user_Email user_Contact'
        }
      });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    // Get all refunds for this patient
    const refunds = await hospitalModel.Refund.find({ patient: patient._id })
      .populate('processedBy', 'user_Name user_Email')
      .populate('authorizedBy', 'user_Name user_Email')
      .sort({ refundDate: -1 });

    // Calculate refund summaries for each visit
    const visitsWithRefundInfo = await Promise.all(
      patient.visits.map(async (visit) => {
        const visitRefunds = refunds.filter(refund =>
          refund.visit.toString() === visit._id.toString()
        );

        const totalRefunded = visitRefunds.reduce((sum, refund) => sum + refund.refundAmount, 0);
        const refundable = visit.amountPaid - totalRefunded;

        return {
          _id: visit._id,
          visitDate: visit.visitDate,
          doctor: visit.doctor,
          purpose: visit.purpose,
          disease: visit.disease,
          amountPaid: visit.amountPaid,
          paymentMethod: visit.paymentMethod,
          paymentStatus: visit.amountStatus,
          totalRefunded,
          refundable,
          isFullyRefunded: refundable === 0,
          refunds: visitRefunds,
          canRefund: refundable > 0
        };
      })
    );

    // Calculate overall patient refund summary
    const totalAmountPaid = patient.visits.reduce((sum, visit) => sum + (visit.amountPaid || 0), 0);
    const totalRefunded = refunds.reduce((sum, refund) => sum + refund.refundAmount, 0);
    const totalRefundable = totalAmountPaid - totalRefunded;

    const refundSummary = {
      totalAmountPaid,
      totalRefunded,
      totalRefundable,
      refundPercentage: totalAmountPaid > 0 ? (totalRefunded / totalAmountPaid) * 100 : 0,
      totalRefunds: refunds.length,
      refundsByStatus: {
        pending: refunds.filter(r => r.refundStatus === 'pending').length,
        partial: refunds.filter(r => r.refundStatus === 'partial').length,
        full: refunds.filter(r => r.refundStatus === 'full').length,
        cancelled: refunds.filter(r => r.refundStatus === 'cancelled').length,
        rejected: refunds.filter(r => r.refundStatus === 'rejected').length
      }
    };

    return res.status(200).json({
      success: true,
      message: "Patient data with refund history retrieved successfully",
      data: {
        patient: {
          _id: patient._id,
          patient_MRNo: patient.patient_MRNo,
          patient_Name: patient.patient_Name,
          patient_ContactNo: patient.patient_ContactNo,
          patient_CNIC: patient.patient_CNIC,
          patient_Gender: patient.patient_Gender,
          patient_Age: patient.patient_Age,
          totalVisits: patient.totalVisits,
          lastVisit: patient.lastVisit
        },
        visits: visitsWithRefundInfo,
        refunds: refunds,
        refundSummary: refundSummary
      }
    });

  } catch (error) {
    console.error("Error fetching patient with refund history:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const patient = {
  searchPatient,
  createPatient,
  updatePatient,
  getAllPatients,
  getPatientByMRNo,
  deletePatient,
  getPatientById,
  getPatientWithRefundHistory,
};

module.exports = patient;