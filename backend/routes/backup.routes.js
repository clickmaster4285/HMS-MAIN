const express = require('express');
const router = express.Router();

const {
  createDailyBackup,
  createFullBackup,
  listBackupsByKind,
  getBackupStatus,
  downloadBackupFile,
  downloadLatestBackup,
  // cleanupBackups,
} = require('../controllers/backup.controller');

/* ---------- Backup Routes ---------- */

// Create backups
router.post('/daily', createDailyBackup);
router.post('/full', createFullBackup);

// List backups
router.get('/:kind', listBackupsByKind);

// Status & health
router.get('/status/health', getBackupStatus);

// Downloads
router.get('/download/:kind/:filename', downloadBackupFile);
router.get('/download/latest/:kind', downloadLatestBackup);

// Cleanup
// router.post('/cleanup/all', cleanupBackups);

module.exports = router;
