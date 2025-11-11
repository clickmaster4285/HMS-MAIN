const express = require('express');
const {
  createCriticalResult,
  getAllCriticalResults,
  getCriticalResultById,
  updateCriticalResult,
  deleteCriticalResult,
  getSummaryByDate,
} = require('../controllers/criticalResult.controller');

const router = express.Router();

// CRUD routes
router.post('/create-Critical-result', createCriticalResult);
router.get('/getAll-Critical-result', getAllCriticalResults);
router.get('/get-Critical-result/:id', getCriticalResultById); // added `/:id`
router.put('/update-Critical-result/:id', updateCriticalResult);
router.delete('/delete-Critical-result/:id', deleteCriticalResult);
router.get('/get-critical-summery-by-date', getSummaryByDate);

module.exports = router;
