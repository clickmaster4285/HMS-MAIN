const express = require("express");
const router = express.Router();
const controller = require("../controllers/index.controller");
const { passportAuth, checkRole, doctorOnly } = require('../middleware/index.middleware');

// Patient Admission Routes
router.post(
  "/create-admitted-patient",
  passportAuth.authenticate("jwt", { session: false }),
  checkRole(['Doctor', 'Admin', 'Receptionist', 'Nurse']),
  controller.admittedPatient.admittedPatient
);

router.get(
  "/get-admitted-patients",
  passportAuth.authenticate("jwt", { session: false }),
  checkRole(['Doctor', 'Admin', 'Receptionist', 'Nurse']),
  controller.admittedPatient.getAllAdmittedPatients
);

router.get(
  "/get-admitted-patient-by-mrno/:mrNo",
  passportAuth.authenticate("jwt", { session: false }),
  checkRole(['Doctor', 'Admin', 'Receptionist', 'Nurse']),
  controller.admittedPatient.getByMRNumber
);

router.put(
  "/update-admission/:mrNo",
  passportAuth.authenticate("jwt", { session: false }),
  checkRole(['Doctor', 'Admin', 'Receptionist', 'Nurse']),
  controller.admittedPatient.updateAdmission
);

router.delete(
  "/delete-admission/:id",
  passportAuth.authenticate("jwt", { session: false }),
  checkRole(['Doctor', 'Admin', 'Receptionist', 'Nurse']),
  controller.admittedPatient.deleteAdmission
);


router.post('/discharge-patient/:id', controller.admittedPatient.dischargePatient);


module.exports = router;