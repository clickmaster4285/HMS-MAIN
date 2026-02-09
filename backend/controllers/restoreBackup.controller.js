const {
  restoreFullBackup,
  restoreIncrementalBackup,
  restoreBackupChain,
  restoreToLatest,
  pointInTimeRecovery,
  listAvailableBackups,
  getBackupChain,
  validateBackup,
  getDatabaseStatus,
} = require('../services/restore.service');

const BACKUP_ROOT = process.env.BACKUP_ROOT;

function ensureBackupRoot() {
  if (!BACKUP_ROOT) {
    const err = new Error('BACKUP_ROOT is not configured');
    err.status = 500;
    throw err;
  }
}

/** POST /api/restore/full */
async function restoreFullBackupCtrl(req, res) {
  try {
    ensureBackupRoot();
    const { backupPath, drop = true } = req.body;
    
    if (!backupPath) {
      return res.status(400).json({
        success: false,
        message: 'backupPath is required'
      });
    }

    const dbStatusBefore = await getDatabaseStatus();
    const result = await restoreFullBackup(backupPath, { drop });
    const dbStatusAfter = await getDatabaseStatus();
    
    return res.json({
      success: true,
      message: 'Full backup restored successfully',
      data: {
        ...result,
        databaseStatus: {
          before: dbStatusBefore,
          after: dbStatusAfter
        }
      }
    });
  } catch (error) {
    console.error('❌ Full restore failed:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
      message: 'Full restore failed'
    });
  }
}

/** POST /api/restore/incremental */
async function restoreIncrementalBackupCtrl(req, res) {
  try {
    ensureBackupRoot();
    const { backupPath, dropCollections = false } = req.body;
    
    if (!backupPath) {
      return res.status(400).json({
        success: false,
        message: 'backupPath is required'
      });
    }

    const dbStatusBefore = await getDatabaseStatus();
    const result = await restoreIncrementalBackup(backupPath, { dropCollections });
    const dbStatusAfter = await getDatabaseStatus();
    
    return res.json({
      success: true,
      message: 'Incremental backup restored successfully',
      data: {
        ...result,
        databaseStatus: {
          before: dbStatusBefore,
          after: dbStatusAfter
        }
      }
    });
  } catch (error) {
    console.error('❌ Incremental restore failed:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
      message: 'Incremental restore failed'
    });
  }
}

/** POST /api/restore/chain */
async function restoreBackupChainCtrl(req, res) {
  try {
    ensureBackupRoot();
    const { type = 'daily', drop = true } = req.body;
    
    // Get the backup chain
    const chain = await getBackupChain(type);
    
    if (!chain.base) {
      return res.status(404).json({
        success: false,
        message: 'No base backup found in chain'
      });
    }

    const dbStatusBefore = await getDatabaseStatus();
    const result = await restoreBackupChain(chain, { drop });
    const dbStatusAfter = await getDatabaseStatus();
    
    return res.json({
      success: true,
      message: 'Backup chain restored successfully',
      data: {
        ...result,
        databaseStatus: {
          before: dbStatusBefore,
          after: dbStatusAfter
        }
      }
    });
  } catch (error) {
    console.error('❌ Chain restore failed:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
      message: 'Chain restore failed'
    });
  }
}

/** POST /api/restore/latest */
async function restoreToLatestCtrl(req, res) {
  try {
    ensureBackupRoot();
    const { type = 'daily', drop = true } = req.body;
    
    const chain = await getBackupChain(type);
    
    if (!chain.base) {
      return res.status(404).json({
        success: false,
        message: 'No backups found to restore'
      });
    }

    const dbStatusBefore = await getDatabaseStatus();
    const result = await restoreToLatest(chain, { drop });
    const dbStatusAfter = await getDatabaseStatus();
    
    return res.json({
      success: true,
      message: 'Restored to latest state successfully',
      data: {
        ...result,
        databaseStatus: {
          before: dbStatusBefore,
          after: dbStatusAfter
        }
      }
    });
  } catch (error) {
    console.error('❌ Latest restore failed:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
      message: 'Latest restore failed'
    });
  }
}

/** POST /api/restore/point-in-time */
async function pointInTimeRecoveryCtrl(req, res) {
  try {
    ensureBackupRoot();
    const { targetTime, type = 'daily' } = req.body;
    
    if (!targetTime) {
      return res.status(400).json({
        success: false,
        message: 'targetTime is required (ISO format)'
      });
    }

    const chain = await getBackupChain(type);
    const dbStatusBefore = await getDatabaseStatus();
    const result = await pointInTimeRecovery(new Date(targetTime), chain);
    const dbStatusAfter = await getDatabaseStatus();
    
    return res.json({
      success: true,
      message: 'Point-in-time recovery completed',
      data: {
        ...result,
        databaseStatus: {
          before: dbStatusBefore,
          after: dbStatusAfter
        }
      }
    });
  } catch (error) {
    console.error('❌ Point-in-time restore failed:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
      message: 'Point-in-time restore failed'
    });
  }
}

/** GET /api/restore/available */
async function listAvailableRestoreBackups(req, res) {
  try {
    ensureBackupRoot();
    const { type = 'daily' } = req.query;
    
    const backups = await listAvailableBackups(type);
    const chain = await getBackupChain(type);
    
    return res.json({
      success: true,
      data: {
        type,
        backups,
        chain,
        count: backups.length
      }
    });
  } catch (error) {
    console.error('❌ List available backups failed:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
      message: 'Failed to list available backups'
    });
  }
}

/** POST /api/restore/validate */
async function validateBackupCtrl(req, res) {
  try {
    ensureBackupRoot();
    const { backupPath } = req.body;
    
    if (!backupPath) {
      return res.status(400).json({
        success: false,
        message: 'backupPath is required'
      });
    }

    const validation = await validateBackup(backupPath);
    
    return res.json({
      success: true,
      data: validation
    });
  } catch (error) {
    console.error('❌ Backup validation failed:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
      message: 'Backup validation failed'
    });
  }
}

/** GET /api/restore/status */
async function getRestoreStatus(req, res) {
  try {
    ensureBackupRoot();
    const status = await getDatabaseStatus();
    
    return res.json({
      success: true,
      data: status,
      message: 'Database status retrieved'
    });
  } catch (error) {
    console.error('❌ Get restore status failed:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
      message: 'Failed to get restore status'
    });
  }
}

module.exports = {
  restoreFullBackupCtrl,
  restoreIncrementalBackupCtrl,
  restoreBackupChainCtrl,
  restoreToLatestCtrl,
  pointInTimeRecoveryCtrl,
  listAvailableRestoreBackups,
  validateBackupCtrl,
  getRestoreStatus,
};