const fs = require('fs');
const path = require('path');
const {
  runDailyBackup,
  runFullBackup,
  listBackups,
  getBackupChain,
} = require('../services/backup.service');

const BACKUP_ROOT = process.env.BACKUP_ROOT;
const STRATEGY = process.env.BACKUP_STRATEGY || 'full';
const DAILY_KEEP = Number(process.env.DAILY_KEEP || 7);
const MONTHLY_KEEP = Number(process.env.MONTHLY_KEEP || 12);
const INCREMENTAL_BASE_DAYS = Number(process.env.INCREMENTAL_BASE_DAYS || 7);

const asMB = (bytes) => +(bytes / (1024 * 1024)).toFixed(2);

function ensureBackupRoot() {
  if (!BACKUP_ROOT) {
    const err = new Error('BACKUP_ROOT is not configured');
    err.status = 500;
    throw err;
  }
  // Ensure backup directory exists
  const dailyDir = path.join(BACKUP_ROOT, 'daily');
  const fullDir = path.join(BACKUP_ROOT, 'full');
  if (!fs.existsSync(dailyDir)) fs.mkdirSync(dailyDir, { recursive: true });
  if (!fs.existsSync(fullDir)) fs.mkdirSync(fullDir, { recursive: true });
}

/** POST /api/backup/daily */
async function createDailyBackup(req, res) {
  try {
    ensureBackupRoot();
    const result = await runDailyBackup();
    return res.json({
      success: true,
      file: result.file,
      type: result.type,
      isBase: !!result.isBase,
      message: `Daily ${result.type} backup completed successfully`,
      timestamp: new Date().toISOString(),
      downloadUrl: `/api/backup/download/daily/${path.basename(result.file)}`,
    });
  } catch (error) {
    console.error('Daily backup error:', error);
    return res.status(error.status || 500).json({
      success: false,
      error: error.message,
      message: 'Daily backup failed',
    });
  }
}

/** POST /api/backup/full (monthly full) */
async function createFullBackup(req, res) {
  try {
    ensureBackupRoot();
    const result = await runFullBackup();
    return res.json({
      success: true,
      file: result.file,
      type: result.type,
      isBase: true,
      message: 'Full backup completed successfully',
      timestamp: new Date().toISOString(),
      downloadUrl: `/api/backup/download/full/${path.basename(result.file)}`,
    });
  } catch (error) {
    console.error('Full backup error:', error);
    return res.status(error.status || 500).json({
      success: false,
      error: error.message,
      message: 'Full backup failed',
    });
  }
}

/** GET /api/backup/:kind (daily|full) */
async function listBackupsByKind(req, res) {
  try {
    ensureBackupRoot();
    const { kind } = req.params;
    const files = await listBackups(kind);
    return res.json({
      success: true,
      kind,
      strategy: STRATEGY,
      backups: files.map((f) => ({
        name: f.name,
        path: f.full,
        mtime: f.mtime,
        size: f.size,
        sizeMB: f.sizeMB,
        type: f.type || (kind === 'full' ? 'full' : 'incremental'),
        downloadUrl: `/api/backup/download/${kind}/${f.name}`,
      })),
      count: files.length,
      message: `${files.length} ${kind} backups found`,
    });
  } catch (error) {
    console.error('List backups error:', error);
    return res.status(error.status || 500).json({
      success: false,
      error: error.message,
      message: 'Failed to list backups',
    });
  }
}

/** GET /api/backup/stats/overview */
async function getBackupStats(req, res) {
  try {
    ensureBackupRoot();
    const dailyBackups = await listBackups('daily');
    const fullBackups = await listBackups('full');
    const dailyChain = await getBackupChain('daily');

    const dailyBytes = dailyBackups.reduce((s, f) => s + f.size, 0);
    const fullBytes = fullBackups.reduce((s, f) => s + f.size, 0);

    return res.json({
      success: true,
      stats: {
        strategy: STRATEGY,
        daily: {
          count: dailyBackups.length,
          totalSize: dailyBytes,
          totalSizeMB: `${asMB(dailyBytes)} MB`,
          retention: DAILY_KEEP,
          latest: dailyBackups[0] || null,
          chain: dailyChain,
        },
        full: {
          count: fullBackups.length,
          totalSize: fullBytes,
          totalSizeMB: `${asMB(fullBytes)} MB`,
          retention: MONTHLY_KEEP,
          latest: fullBackups[0] || null,
        },
        storage: {
          backupRoot: BACKUP_ROOT,
          dailyKeep: DAILY_KEEP,
          monthlyKeep: MONTHLY_KEEP,
          incrementalBaseDays: INCREMENTAL_BASE_DAYS,
        },
      },
      message: 'Backup statistics retrieved successfully',
    });
  } catch (error) {
    console.error('Backup stats error:', error);
    return res.status(error.status || 500).json({
      success: false,
      error: error.message,
      message: 'Failed to get backup statistics',
    });
  }
}

/** GET /api/backup/status */
async function getBackupStatus(req, res) {
  try {
    ensureBackupRoot();
    const dailyBackups = await listBackups('daily');
    const fullBackups = await listBackups('full');

    const latest = (arr) =>
      arr[0]
        ? {
            name: arr[0].name,
            size: arr[0].sizeMB,
            type: arr[0].type,
            timestamp: arr[0].mtime,
          }
        : null;

    return res.json({
      success: true,
      status: {
        strategy: STRATEGY,
        daily: { count: dailyBackups.length, latest: latest(dailyBackups) },
        full: { count: fullBackups.length, latest: latest(fullBackups) },
        system: {
          backupRoot: BACKUP_ROOT,
          status: 'active',
          timestamp: new Date().toISOString(),
        },
      },
      message: 'Backup system status retrieved',
    });
  } catch (error) {
    console.error('Backup status error:', error);
    return res.status(error.status || 500).json({
      success: false,
      error: error.message,
      message: 'Failed to get backup status',
    });
  }
}

/** GET /api/backup/download/:kind/:filename */
async function downloadBackupFile(req, res) {
  try {
    ensureBackupRoot();
    const { kind, filename } = req.params;
    const filePath = path.join(BACKUP_ROOT, kind, filename);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, error: 'Backup file not found' });
    }
    
    // Security check - prevent directory traversal
    const resolvedPath = path.resolve(filePath);
    if (!resolvedPath.startsWith(path.resolve(BACKUP_ROOT))) {
      return res.status(400).json({ success: false, error: 'Invalid file path' });
    }
    
    return res.download(filePath, filename);
  } catch (error) {
    console.error('Download error:', error);
    return res.status(error.status || 500).json({
      success: false,
      error: error.message,
      message: 'Download failed',
    });
  }
}

/** GET /api/backup/download/latest/:kind */
async function downloadLatestBackup(req, res) {
  try {
    ensureBackupRoot();
    const { kind } = req.params;
    const backups = await listBackups(kind);
    if (backups.length === 0) {
      return res.status(404).json({ success: false, error: `No ${kind} backups found` });
    }
    const latest = backups[0];
    return res.download(latest.full, latest.name);
  } catch (error) {
    console.error('Download latest error:', error);
    return res.status(error.status || 500).json({
      success: false,
      error: error.message,
      message: 'Download failed',
    });
  }
}

module.exports = {
  createDailyBackup,
  createFullBackup,
  listBackupsByKind,
  getBackupStats,
  getBackupStatus,
  downloadBackupFile,
  downloadLatestBackup,
};