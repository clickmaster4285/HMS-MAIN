const generateUniqueUserId = require("./generateUniqueUserId.utils");
const generateUniqueDoctorId = require("./generateUniqueDoctorId");
const generateUniqueMrNo = require("./generateUniqueMrNo");  
const generateUniqueAdmissionNo = require("./generaetUniqueAdmissionNo");
const generateOPDToken = require("./generateOPDToken");
const generateUniqueId = require("./generateUniqueId");
const generateUniqueStaffId = require("./generateUniqueStaffId")

const utils = {
  generateUniqueUserId,
  generateUniqueDoctorId,
  generateUniqueMrNo,
  generateUniqueAdmissionNo,
  generateOPDToken,
  generateUniqueId,
  generateUniqueStaffId,
  
};

module.exports = utils;
