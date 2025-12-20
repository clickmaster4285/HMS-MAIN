// utils/generateOPDToken.js
const hospitalModel = require("../models/index.model");

// Generate department-specific token for OPD visits - FIXED VERSION
const generateOPDToken = async (doctorId, visitDate) => {
  try {
    // Get doctor details to find department
    const doctor = await hospitalModel.Doctor.findById(doctorId)
      .populate('doctor_Department', 'name');

    if (!doctor) {
      throw new Error('Doctor not found');
    }

    // Get department name or use 'General' as fallback
    const departmentName = doctor.doctor_Department || 'General';

    // Get first two letters, uppercase, remove spaces/special chars
    const cleanDeptName = departmentName.replace(/[^a-zA-Z]/g, '');
    const prefix = cleanDeptName.substring(0, 2).toUpperCase();
    const finalPrefix = prefix.length >= 2 ? prefix : 'GE';

    const dateObj = visitDate ? new Date(visitDate) : new Date();
    const dateString = dateObj.toISOString().split('T')[0];

    // Find all patients with visits for this doctor today
    const patients = await hospitalModel.Patient.find({
      'visits.visitDate': {
        $gte: new Date(dateString),
        $lt: new Date(new Date(dateString).getTime() + 24 * 60 * 60 * 1000)
      },
      'visits.doctor': doctorId,
      deleted: false
    });

    // Extract all tokens for this doctor today from VISITS only
    let maxTokenNumber = 0;
    patients.forEach(patient => {
      patient.visits.forEach(visit => {
        if (visit.doctor?.toString() === doctorId.toString() &&
          visit.visitDate >= new Date(dateString) &&
          visit.visitDate < new Date(new Date(dateString).getTime() + 24 * 60 * 60 * 1000) &&
          visit.token) {

          let tokenNum = 0;

          // Handle both string tokens (like "GE-1") and number tokens
          if (typeof visit.token === 'string') {
            // Extract number from token (e.g., "DE-1" → 1)
            const tokenMatch = visit.token.match(/-(\d+)$/);
            if (tokenMatch) {
              tokenNum = parseInt(tokenMatch[1]);
            } else {
              // If it's a string but doesn't match pattern, try to parse as number
              tokenNum = parseInt(visit.token) || 0;
            }
          } else if (typeof visit.token === 'number') {
            // Direct number token
            tokenNum = visit.token;
          }

          if (tokenNum > maxTokenNumber) {
            maxTokenNumber = tokenNum;
          }
        }
      });
    });

    const nextTokenNumber = maxTokenNumber + 1;
    const token = `${finalPrefix}-${nextTokenNumber}`;

    return {
      token,
      tokenNumber: nextTokenNumber,
      departmentPrefix: finalPrefix,
      departmentName: departmentName
    };

  } catch (error) {
    console.error('Error generating OPD token:', error);
    // Fallback: return a basic token with timestamp to ensure uniqueness
    const fallbackToken = `GE-${Date.now()}`;

    return {
      token: fallbackToken,
      tokenNumber: 1,
      departmentPrefix: 'GE',
      departmentName: 'General'
    };
  }
};

module.exports = generateOPDToken;