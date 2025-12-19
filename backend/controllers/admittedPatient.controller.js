const mongoose = require("mongoose");
const hospitalModel = require("../models/index.model");
const emitGlobalEvent = require("../utils/emitGlobalEvent");
const EVENTS = require("../utils/socketEvents");


const admittedPatient = async (req, res) => {
  try {
    const { patientId, ward_Information, admission_Details, financials } = req.body;

    // Validate required fields
    if (!patientId || !ward_Information || !ward_Information.ward_Id || !ward_Information.bed_No) {
      return res.status(400).json({
        success: false,
        message: "Patient ID, ward ID, and bed number are required"
      });
    }

    // Check if patient exists
    const patient = await hospitalModel.Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found"
      });
    }

    // Check if already admitted
    const existingAdmission = await hospitalModel.AdmittedPatient.findOne({
      patient: patientId,
      status: "Admitted",
      deleted: false
    });

    if (existingAdmission) {
      return res.status(400).json({
        success: false,
        message: "Patient already admitted"
      });
    }

    // Validate ward
    const ward = await hospitalModel.ward.findById(ward_Information.ward_Id);
    if (!ward || ward.isDeleted) {
      return res.status(404).json({
        success: false,
        message: "Ward not found or has been deleted"
      });
    }

    // Validate bed
    const bed = ward.beds.find(b => b.bedNumber.toString() === ward_Information.bed_No.toString());

    if (!bed) {
      return res.status(400).json({
        success: false,
        message: `Bed ${ward_Information.bed_No} not found in ward ${ward.name}`,
        availableBeds: ward.beds.map(b => b.bedNumber)
      });
    }

    if (bed.occupied) {
      return res.status(400).json({
        success: false,
        message: `Bed ${bed.bedNumber} is already occupied`
      });
    }

    // Prepare admission data - handle optional doctor
    const admissionData = {
      patient: patientId,
      admission_Details: {
        admission_Date: new Date(),
        diagnosis: admission_Details.diagnosis,
        discharge_Date: null,
        admission_Type: admission_Details.admission_Type,
      },
      ward_Information: {
        ward_Type: ward.department_Name,
        ward_No: ward.wardNumber.toString(),
        bed_No: ward_Information.bed_No,
        pdCharges: ward_Information.pdCharges || 0,
        ward_Id: ward._id
      },
      financials: {
        admission_Fee: financials.admission_Fee || 0,
        discount: financials.discount || 0,
        payment_Status: financials.payment_Status || "Unpaid",
        total_Charges: (financials.admission_Fee || 0) - (financials.discount || 0),
      },
      status: "Admitted",
      deleted: false
    };

    // Only add admitting_Doctor if provided and valid
    if (admission_Details.admitting_Doctor &&
      mongoose.Types.ObjectId.isValid(admission_Details.admitting_Doctor)) {
      admissionData.admission_Details.admitting_Doctor = admission_Details.admitting_Doctor;
    }

    // Create admission record
    const admission = new hospitalModel.AdmittedPatient(admissionData);

    // Update bed status - FIXED: Add patientMRNo to history
    bed.occupied = true;
    bed.currentPatient = patientId;
    bed.history.push({
      patientId: patientId,
      patientMRNo: patient.patient_MRNo, // ADD THIS LINE
      admissionDate: new Date()
    });

    await Promise.all([ward.save(), admission.save()]);

    // Populate patient data in response
    let populatedAdmission = await hospitalModel.AdmittedPatient
      .findById(admission._id)
      .populate('patient', 'patient_MRNo patient_Name patient_CNIC patient_Gender patient_DateOfBirth patient_Address patient_Guardian');

    // Only populate doctor if it exists
    if (admissionData.admission_Details.admitting_Doctor) {
      populatedAdmission = await populatedAdmission
        .populate('admission_Details.admitting_Doctor', 'name specialty');
    }

    emitGlobalEvent(req, EVENTS.ADMISSION, "create", populatedAdmission);


    return res.status(201).json({
      success: true,
      message: "Patient admitted successfully",
      data: populatedAdmission
    });

  } catch (error) {
    console.error("Admission error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during admission",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const getAllAdmittedPatients = async (req, res) => {
  try {
    const {
      ward_Type,
      search,
      ward_id,
      admission_Type,
      status = "Admitted", // Add status filter with default
      page = 1,
      limit = 20
    } = req.query;

    const skip = (page - 1) * limit;

    let query = {
      deleted: false
    };

    // Status filter - allow multiple statuses
    if (status) {
      if (status === 'all') {
        // Show all non-deleted patients
      } else if (status.includes(',')) {
        // Multiple statuses (e.g., "Admitted,Discharged")
        query.status = { $in: status.split(',').map(s => s.trim()) };
      } else {
        // Single status
        query.status = status;
      }
    } else {
      // Default to admitted only
      query.status = "Admitted";
    }

    if (ward_Type) {
      query["ward_Information.ward_Type"] = ward_Type;
    }

    if (admission_Type) {
      query["admission_Details.admission_Type"] = admission_Type;
    }

    if (ward_id) {
      query["ward_Information.ward_Id"] = ward_id;
    }

    // Search functionality across multiple fields
    if (search) {
      const searchRegex = new RegExp(search, 'i');

      // Get patient IDs that match the search
      const matchingPatients = await hospitalModel.Patient.find({
        $or: [
          { patient_MRNo: searchRegex },
          { patient_Name: searchRegex },
          { patient_CNIC: searchRegex }
        ],
        deleted: false
      }).select('_id').lean();

      const patientIds = matchingPatients.map(p => p._id);

      if (patientIds.length > 0) {
        query.patient = { $in: patientIds };
      } else {
        // If no matching patients found, return empty result
        return res.status(200).json({
          success: true,
          count: 0,
          total: 0,
          page: parseInt(page),
          pages: 0,
          data: []
        });
      }
    }

    // Get total count for pagination
    const total = await hospitalModel.AdmittedPatient.countDocuments(query);

    // Get patients with populated patient data
    let patients = await hospitalModel.AdmittedPatient.find(query)
      .populate('patient', 'patient_MRNo patient_Name patient_CNIC patient_Gender patient_DateOfBirth patient_Address patient_Guardian')
      .sort({
        "admission_Details.admission_Date": -1,
        "admission_Details.discharge_Date": -1
      })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Then manually populate the ward information
    const wardIds = [...new Set(patients.map(p => p.ward_Information?.ward_Id).filter(Boolean))];
    const wards = await hospitalModel.ward.find({
      _id: { $in: wardIds },
      isDeleted: false
    }).lean();

    const wardMap = wards.reduce((map, ward) => {
      map[ward._id.toString()] = ward;
      return map;
    }, {});

    // Calculate days admitted and add ward details
    const patientsWithDetails = patients.map(patient => {
      const admissionDate = patient.admission_Details.admission_Date;
      const dischargeDate = patient.admission_Details.discharge_Date;

      let daysAdmitted = 0;
      if (patient.status === "Admitted") {
        daysAdmitted = Math.ceil((new Date() - admissionDate) / (1000 * 60 * 60 * 24));
      } else if (patient.status === "Discharged" && dischargeDate) {
        daysAdmitted = Math.ceil((dischargeDate - admissionDate) / (1000 * 60 * 60 * 24));
      }

      const wardId = patient.ward_Information?.ward_Id?.toString();
      const wardDetails = wardId ? wardMap[wardId] : null;

      let assignedBed = null;
      if (wardDetails && patient.ward_Information?.bed_No) {
        assignedBed = wardDetails.beds.find(bed =>
          bed.bedNumber.toString() === patient.ward_Information.bed_No.toString()
        );
      }

      return {
        ...patient,
        ward_Information: {
          ...patient.ward_Information,
          wardDetails: wardDetails ? {
            _id: wardDetails._id,
            name: wardDetails.name,
            wardNumber: wardDetails.wardNumber,
            department_Name: wardDetails.department_Name,
            assignedBed: assignedBed ? {
              bedNumber: assignedBed.bedNumber,
              occupied: assignedBed.occupied,
              _id: assignedBed._id
            } : null
          } : null
        },
        daysAdmitted
      };
    });

    return res.status(200).json({
      success: true,
      count: patients.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: patientsWithDetails
    });
  } catch (error) {
    console.error("Fetch error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch patients",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const getByMRNumber = async (req, res) => {
  try {
    const { mrNo } = req.params;
    // console.log("Searching for MR:", mrNo);

    // First find the patient by MR number
    const patient = await hospitalModel.Patient.findOne({
      patient_MRNo: mrNo,
      deleted: false
    }).lean();

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found with this MR number",
        information: { patient: null },
      });
    }

    // Then find the admission record for this patient
    const admission = await hospitalModel.AdmittedPatient.findOne({
      patient: patient._id, // Use the patient's ID
      deleted: false,
      status: "Admitted"
    })
      .populate('patient')
      .lean();

    if (!admission) {
      return res.status(404).json({
        success: false,
        message: "No admission record found for this patient",
        information: { patient: null },
      });
    }

    // console.log("Found admission:", admission._id);
    // console.log("Ward ID:", admission.ward_Information?.ward_Id);

    // Rest of your code for ward details, bed details, etc...
    let wardDetails = null;
    if (admission.ward_Information?.ward_Id) {
      wardDetails = await hospitalModel.ward.findOne({
        _id: admission.ward_Information.ward_Id,
        isDeleted: false
      }).lean();
    }

    const admissionDate = admission.admission_Details.admission_Date;
    const daysAdmitted = Math.ceil((new Date() - admissionDate) / (1000 * 60 * 60 * 24));

    let bedDetails = null;
    if (wardDetails && admission.ward_Information.bed_No) {
      bedDetails = wardDetails.beds.find(bed =>
        bed.bedNumber.toString() === admission.ward_Information.bed_No.toString()
      );
    }

    const patientWithDetails = {
      ...admission,
      ward_Information: {
        ...admission.ward_Information,
        wardDetails: wardDetails ? {
          _id: wardDetails._id,
          name: wardDetails.name,
          wardNumber: wardDetails.wardNumber,
          department_Name: wardDetails.department_Name
        } : null
      },
      bedDetails,
      daysAdmitted
    };

    return res.status(200).json({
      success: true,
      message: "Patient retrieved successfully",
      information: { patient: patientWithDetails },
    });
  } catch (error) {
    console.error("MR search error:", error);
    return res.status(500).json({
      success: false,
      message: "Search failed",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

const updateAdmission = async (req, res) => {
  try {
    const { mrNo } = req.params; // Changed from id to mrNo
    const updateData = req.body;

    console.log('Update request for patient MR:', mrNo);
    console.log('Update data:', updateData);

    // First find the patient by MR number
    const patient = await hospitalModel.Patient.findOne({
      patient_MRNo: mrNo,
      deleted: false
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found with this MR number"
      });
    }

    // Get current admission record using patient ID
    const currentAdmission = await hospitalModel.AdmittedPatient.findOne({
      patient: patient._id,
      status: "Admitted",
      deleted: false
    });

    if (!currentAdmission) {
      return res.status(404).json({
        success: false,
        message: "No active admission found for this patient"
      });
    }

    // ✅ HANDLE DISCHARGE - Free up the bed when discharging
    if (updateData.status === "Discharged" && currentAdmission.status === "Admitted") {
      console.log('Discharging patient and freeing up bed');

      // Free up the current bed
      const currentWard = await hospitalModel.ward.findById(currentAdmission.ward_Information.ward_Id);
      if (currentWard) {
        const currentBed = currentWard.beds.find(b => {
          if (!b || !b.bedNumber || !currentAdmission.ward_Information.bed_No) {
            return false;
          }
          return b.bedNumber.toString() === currentAdmission.ward_Information.bed_No.toString();
        });

        if (currentBed) {
          currentBed.occupied = false;
          currentBed.currentPatient = null;

          // Update discharge date in bed history
          const currentStay = currentBed.history.find(
            h => h.patientId && h.patientId.toString() === currentAdmission.patient.toString() && !h.dischargeDate
          );
          if (currentStay) {
            currentStay.dischargeDate = new Date();
            if (!currentStay.patientMRNo) {
              currentStay.patientMRNo = patient.patient_MRNo;
            }
          }
          await currentWard.save();
          console.log(`Bed ${currentBed.bedNumber} freed up for patient discharge`);
        }
      }

      // Set discharge date if not provided
      if (!updateData.admission_Details?.discharge_Date) {
        updateData.admission_Details = {
          ...currentAdmission.admission_Details,
          ...updateData.admission_Details,
          discharge_Date: new Date()
        };
      }
    }

    if (updateData.ward_Information &&
      (updateData.ward_Information.ward_Id !== currentAdmission.ward_Information.ward_Id.toString() ||
        updateData.ward_Information.bed_No !== currentAdmission.ward_Information.bed_No)) {

      console.log('Bed change detected - updating bed occupancy');

      // Declare variables at the function scope level
      let oldWard = null;
      let newWard = null;

      // Free up the old bed
      oldWard = await hospitalModel.ward.findById(currentAdmission.ward_Information.ward_Id);

      // ✅ MOVE DEBUG LOGS INSIDE THE BLOCK
      console.log('Old ward beds:', oldWard?.beds?.map(b => ({
        bedNumber: b.bedNumber,
        hasBedNumber: !!b.bedNumber
      })));
      console.log('Current admission bed No:', currentAdmission.ward_Information.bed_No);

      if (oldWard && oldWard.beds) {
        const oldBed = oldWard.beds.find(b => {
          if (!b || !b.bedNumber || !currentAdmission.ward_Information.bed_No) {
            return false;
          }
          return b.bedNumber.toString() === currentAdmission.ward_Information.bed_No.toString();
        });

        if (oldBed) {
          oldBed.occupied = false;
          oldBed.currentPatient = null;

          // Update discharge date in old bed history
          const currentStay = oldBed.history.find(
            h => h.patientId && h.patientId.toString() === currentAdmission.patient.toString() && !h.dischargeDate
          );
          if (currentStay) {
            currentStay.dischargeDate = new Date();
          }
          await oldWard.save();
        }
      }

      // Occupy the new bed
      newWard = await hospitalModel.ward.findById(updateData.ward_Information.ward_Id);
      if (!newWard) {
        return res.status(404).json({
          success: false,
          message: "New ward not found"
        });
      }

      if (!newWard.beds) {
        return res.status(400).json({
          success: false,
          message: "No beds found in the new ward"
        });
      }

      const newBed = newWard.beds.find(b => {
        if (!b || !b.bedNumber || !updateData.ward_Information.bed_No) {
          return false;
        }
        return b.bedNumber.toString() === updateData.ward_Information.bed_No.toString();
      });

      if (!newBed) {
        return res.status(400).json({
          success: false,
          message: `Bed ${updateData.ward_Information.bed_No} not found in ward`
        });
      }

      if (newBed.occupied) {
        return res.status(400).json({
          success: false,
          message: `Bed ${newBed.bedNumber} is already occupied`
        });
      }

      newBed.occupied = true;
      newBed.currentPatient = currentAdmission.patient;
      newBed.history.push({
        patientId: currentAdmission.patient,
        patientMRNo: patient.patient_MRNo,
        admissionDate: new Date()
      });

      await newWard.save();
    }

    // Set discharge date
    updateData.admission_Details = {
      ...currentAdmission.admission_Details,
      ...updateData.admission_Details,
      discharge_Date: new Date()
    };


    // Update the admission record
    const updatedAdmission = await hospitalModel.AdmittedPatient.findByIdAndUpdate(
      currentAdmission._id, // Use the admission ID we found
      { $set: updateData },
      { new: true, runValidators: true }
    )
      .populate('patient', 'patient_MRNo patient_Name patient_CNIC patient_Gender patient_DateOfBirth patient_Address patient_Guardian')
      .populate('admission_Details.admitting_Doctor', 'user_Name user_Email user_Contact');

    emitGlobalEvent(req, EVENTS.ADMISSION, "update", updatedAdmission);


    return res.status(200).json({
      success: true,
      message: "Admission updated successfully",
      data: updatedAdmission
    });

  } catch (error) {
    console.error("Update admission error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update admission",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const deleteAdmission = async (req, res) => {
  try {
    const { id } = req.params;

    const admission = await hospitalModel.AdmittedPatient.findById(id);
    if (!admission) {
      return res.status(404).json({
        success: false,
        message: "Admission record not found"
      });
    }

    // Check if admission.patient exists
    if (!admission.patient) {
      return res.status(400).json({
        success: false,
        message: "Invalid admission record: patient reference missing"
      });
    }

    // Free up the bed if patient is admitted
    if (admission.status === "Admitted") {
      const ward = await hospitalModel.ward.findById(admission.ward_Information.ward_Id);

      if (ward) {
        const bed = ward.beds.find(b =>
          b.bedNumber === admission.ward_Information.bed_No
        );

        if (bed) {
          bed.occupied = false;
          bed.currentPatient = null;

          // Update discharge date in bed history
          const currentStay = bed.history.find(
            h => {
              // Add proper null/undefined checks
              const patientId = h.patientId ? h.patientId.toString() : null;
              const admissionPatient = admission.patient ? admission.patient.toString() : null;

              return patientId === admissionPatient && !h.dischargeDate;
            }
          );

          if (currentStay) {
            currentStay.dischargeDate = new Date();
            // Also update patientMRNo if needed
            if (!currentStay.patientMRNo && admission.patient) {
              const patient = await hospitalModel.Patient.findById(admission.patient);
              if (patient) {
                currentStay.patientMRNo = patient.patient_MRNo;
              }
            }
          }

          await ward.save();
        }
      }
    }

    // Soft delete the admission record
    admission.deleted = true;
    admission.deletedAt = new Date();
    await admission.save();


    emitGlobalEvent(req, EVENTS.ADMISSION, "delete", admission._id);


    return res.status(200).json({
      success: true,
      message: "Admission record deleted successfully",
      data: admission
    });
  } catch (error) {
    console.error("Delete error:", error);
    return res.status(500).json({
      success: false,
      message: "Deletion failed",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const dischargePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const { wardId, bedNumber } = req.body;

    let admission;

    // Option 1: Discharge by admission ID
    if (id) {
      admission = await hospitalModel.AdmittedPatient.findById(id);
      if (!admission) {
        return res.status(404).json({
          success: false,
          message: "Admission not found"
        });
      }
    }
    // Option 2: Discharge by ward/bed details
    else if (wardId && bedNumber) {
      admission = await hospitalModel.AdmittedPatient.findOne({
        "ward_Information.ward_Id": wardId,
        "ward_Information.bed_No": bedNumber,
        status: "Admitted",
        deleted: false
      });

      if (!admission) {
        return res.status(404).json({
          success: false,
          message: "No admission found for this ward and bed"
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        message: "Either admission ID or wardId/bedNumber must be provided"
      });
    }

    // Check if admission.patient exists
    if (!admission.patient) {
      return res.status(400).json({
        success: false,
        message: "Invalid admission record: patient reference missing"
      });
    }

    // Free up the bed
    const ward = await hospitalModel.ward.findById(admission.ward_Information.ward_Id);
    if (ward) {
      const bed = ward.beds.find(b =>
        b.bedNumber === admission.ward_Information.bed_No
      );

      if (bed) {
        bed.occupied = false;
        bed.currentPatient = null;

        // Update discharge date in bed history - FIXED THE ERROR HERE
        const currentStay = bed.history.find(
          h => {
            // Add proper null/undefined checks
            const patientId = h.patientId ? h.patientId.toString() : null;
            const admissionPatient = admission.patient ? admission.patient.toString() : null;

            return patientId === admissionPatient && !h.dischargeDate;
          }
        );

        if (currentStay) {
          currentStay.dischargeDate = new Date();
          if (!currentStay.patientMRNo && admission.patient) {
            const patient = await hospitalModel.Patient.findById(admission.patient);
            if (patient) {
              currentStay.patientMRNo = patient.patient_MRNo;
            }
          }
        }

        await ward.save();
      }
    }

    // Update admission record
    admission.status = "Discharged";
    admission.admission_Details.discharge_Date = new Date();
    await admission.save();

    // Populate patient data for response
    const populatedAdmission = await hospitalModel.AdmittedPatient
      .findById(admission._id)
      .populate('patient', 'patient_MRNo patient_Name patient_CNIC patient_Gender patient_DateOfBirth patient_Address patient_Guardian');

    return res.status(200).json({
      success: true,
      message: "Patient discharged successfully",
      data: populatedAdmission
    });
  } catch (error) {
    console.error("Discharge error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during discharge",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  admittedPatient,
  getAllAdmittedPatients,
  getByMRNumber,
  updateAdmission,
  deleteAdmission,
  dischargePatient,
};