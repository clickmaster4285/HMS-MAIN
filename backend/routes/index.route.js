const express = require("express");
const router = express.Router();
const user = require("./user.route");
const doctor = require("./doctor.route");
const patient = require("./patient.route");
const appointment = require("./appointment.route");
const admittedPatient = require("./admittedpatient.route");
const staff=require("./staff.route");
const Department = require("./departments.route");
const rooms = require("./rooms.routes");
const inventory = require("./inventory.route");
const ot =require("./ot.route");
const ward=require('./ward.route');
const medicine = require("./medicine.route");
const testManagment = require('./testmanagement.route');
const patientTest = require("./patientTest.route");
const testResult = require("./testResult.route");
const labBills = require("./labBills.route");
const google_Drive = require("./google_Drive.router");
const radiology = require("./radiologyRoutes");
const criticalResult = require("./criticalResult.route");
const Refund = require("./refundOpd.route");  
const expenses = require("./expenses.route");
const summary = require("./summary.route")
const backup = require("./backup.routes");



router.use("/user", user);
router.use("/doctor", doctor);
router.use("/patient", patient);
router.use("/appointment", appointment);
router.use("/admittedPatient", admittedPatient);
router.use("/staff", staff);
router.use("/departments",Department);
router.use("/rooms",rooms);
router.use("/inventory",inventory);
router.use("/ot",ot)
router.use("/ward",ward)
router.use("/medicine",medicine)
router.use("/testManagement",testManagment)
router.use("/patientTest",patientTest)
router.use("/testResult",testResult)
router.use("/labBills",labBills)
router.use("/api/drive",google_Drive)
router.use("/radiology",radiology);
router.use("/criticalResult",criticalResult);
router.use("/refund",Refund);
router.use("/expense", expenses);
router.use("/summary", summary);
router.use("/backup", backup);

module.exports = router;