const express = require("express");
const router = express.Router();
const upload = require("../config/multer");
const controller = require("../controllers/index.controller");
const { passportAuth, checkRole, doctorOnly } = require('../middleware/index.middleware');

router.post(
  "/create-doctor",
  upload.fields([
    { name: "doctor_Image", maxCount: 1 },
    { name: "doctor_Agreement", maxCount: 1 },
  ]),
  controller.doctor.createDoctor
);

router.get(
  "/get-doctors",
  passportAuth.authenticate("jwt", { session: false }),
  checkRole(['Doctor', 'Admin', 'Receptionist', 'Lab']),
  // doctorOnly,
  controller.doctor.getAllDoctors
);

router.get(
  "/get-doctor-by-id/:doctorId",

  controller.doctor.getDoctorById
);

router.delete(
  "/delete/:doctorId",


  controller.doctor.deleteDoctor
);

router.put(
  "/update-doctor/:doctorId",


  upload.fields([
    { name: "doctor_Image", maxCount: 1 },
    { name: "doctor_Agreement", maxCount: 1 },
  ]),
  controller.doctor.updateDoctor
);
router.get(

  "/get-doctors-by-department/:departmentName",
  // passport.authenticate("jwt", { session: false }),
  //
  controller.doctor.getAllDoctorsByDepartmentName
);
module.exports = router;