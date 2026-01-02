const hospitalModel = require("../models/index.model");
const { extractPurposeDetails } = require("./departmentFromPurpose");

// Helper function to get department prefix from doctor
const getDoctorDepartmentPrefix = (doctor, purposeDetails) => {
  if (!doctor?.doctor_Department || purposeDetails.isCustom) {
    return purposeDetails.prefix;
  }

  const cleanDeptName = doctor.doctor_Department.replace(/[^a-zA-Z]/g, '');
  const prefix = cleanDeptName.substring(0, 2).toUpperCase();
  return prefix.length >= 2 ? prefix : 'GE';
};

// Helper function to get day boundaries
const getDayBoundaries = (date) => {
  const dateObj = date ? new Date(date) : new Date();
  const start = new Date(dateObj.toISOString().split('T')[0]);
  const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
  return { start, end };
};

// Helper function to extract token number from string
const extractTokenNumber = (tokenStr, prefix) => {
  const pattern = new RegExp(`^${prefix}-(\\d+)$`);
  const match = tokenStr.match(pattern);
  return match ? parseInt(match[1], 10) : 0;
};

// Helper function to find maximum token number
const findMaxTokenNumber = (patients, prefix, start, end) => {
  let max = 0;

  patients.forEach(patient => {
    patient.visits?.forEach(visit => {
      if (visit.visitDate >= start && visit.visitDate < end && visit.token) {
        const tokenStr = Array.isArray(visit.token) ? visit.token[0] : visit.token.toString();
        const tokenNum = extractTokenNumber(tokenStr, prefix);

        if (tokenNum > max) {
          max = tokenNum;
        }
      }
    });
  });

  return max;
};

// Main function
const generateOPDToken = async (doctorId = null, visitDate = null, purpose = "Consultation") => {
  try {
    const purposeDetails = extractPurposeDetails(purpose);
    const doctor = doctorId ? await hospitalModel.Doctor.findById(doctorId) : null;

    const finalPrefix = getDoctorDepartmentPrefix(doctor, purposeDetails);
    const finalDeptName = doctor?.doctor_Department || purposeDetails.departmentName;

    const { start, end } = getDayBoundaries(visitDate);

    const patients = await hospitalModel.Patient.find({
      'visits.visitDate': { $gte: start, $lt: end },
      deleted: false
    }).lean();

    const maxTokenNumber = findMaxTokenNumber(patients, finalPrefix, start, end);
    const nextTokenNumber = maxTokenNumber + 1;
    const token = `${finalPrefix}-${nextTokenNumber}`;

    return {
      token,
      tokenNumber: nextTokenNumber,
      departmentPrefix: finalPrefix,
      departmentName: finalDeptName,
      purposeCategory: purposeDetails.category,
      specificType: purposeDetails.specificType,
      doctor: doctor ? { id: doctor._id, name: doctor.user?.user_Name } : null,
      purposeBased: purposeDetails.isCustom || !doctor,
      originalPurpose: purpose
    };

  } catch (error) {
    console.error('Token generation error:', error);

    const fallbackDetails = extractPurposeDetails(purpose || "Consultation");

    return {
      token: `${fallbackDetails.prefix}-${Date.now().toString().slice(-4)}`,
      tokenNumber: 1,
      departmentPrefix: fallbackDetails.prefix,
      departmentName: fallbackDetails.departmentName,
      purposeCategory: fallbackDetails.category,
      specificType: fallbackDetails.specificType,
      doctor: null,
      purposeBased: true,
      originalPurpose: purpose,
      isFallback: true
    };
  }
};

module.exports = generateOPDToken;