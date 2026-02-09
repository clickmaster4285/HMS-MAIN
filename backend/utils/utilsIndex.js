const generateUniqueUserId = require("./generateUniqueUserId.utils");
const generateUniqueDoctorId = require("./generateUniqueDoctorId");
const generateUniqueMrNo = require("./generateUniqueMrNo");  
const generateOPDToken = require("./generateOPDToken");
const generateUniqueStaffId = require("./generateUniqueStaffId")
const generateUniqueToken = require("./generateUniqueToken")

const utils = {
  generateUniqueUserId,
  generateUniqueDoctorId,
  generateUniqueMrNo,
  generateOPDToken,
  generateUniqueStaffId,
  generateUniqueToken,
  
};

module.exports = utils;
