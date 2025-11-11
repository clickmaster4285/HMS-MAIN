const express = require('express');
const router = express.Router();
const controller = require('../controllers/radiologyReportController');
const passport = require('../middleware/passportAuth.middleware');

router.get(
  '/get-all-templates',
  passport.authenticate('jwt', { session: false }),
  controller.getAvailableTemplates
);

router.post(
  '/create-report',
  passport.authenticate('jwt', { session: false }),
  controller.createReport
);

router.get(
  '/get-reports',
  passport.authenticate('jwt', { session: false }),
  controller.getReport
);
router.put(
  '/update-reports/:id',
  passport.authenticate('jwt', { session: false }),
  controller.updateReport
);

router.patch(
  '/update-final-content/:id',
  passport.authenticate('jwt', { session: false }),
  controller.updateFinalContent
);
router.get(
  '/get-reports-byid/:id',
  passport.authenticate('jwt', { session: false }),
  controller.getReportById
);

router.get(
  '/get-radiology-reports-summery-byid',
  passport.authenticate('jwt', { session: false }),
  controller.getRadiologyReportSummary
);

// routes
router.get(
  '/reports-by-mrno/:mrno',
  passport.authenticate('jwt', { session: false }),
  controller.getReportByMrno
);
router.delete(
  '/delete-template/:studyId',
  passport.authenticate('jwt', { session: false }),
  controller.softDeleteStudyById
);

module.exports = router;
