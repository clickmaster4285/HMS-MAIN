const express = require('express');
const router = express.Router();
const controller = require('../controllers/ward.controller');

// Ward management routes
router.post('/add-ward', controller.createWard);
router.get('/get-all-ward', controller.getAllWards);
router.get('/get-all-wards-by-dept/:departmentId', controller.getWardsByDepartment);
router.get('/get-by-id/:wardId', controller.getWardsById);
router.get('/get-by-bed-id/:bedId', controller.getPatientbyBedId);
router.put('/update-ward/:id', controller.updateWardById);
router.delete('/delete-ward/:id', controller.deleteWard);

router.get('/suggest-ward-number/:departmentId', controller.getSuggestedWardNumber);
// Bed management routes
router.get('/bed-history/:wardId/:bedNumber', controller.getBedHistory);

module.exports = router;