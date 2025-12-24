// src/services/backup.service.js
const { exec } = require('child_process');
const fs = require('fs');
const fsp = require('fs').promises;
const path = require('path');
const { MongoClient } = require('mongodb');

const MONGO_URI_BACKUP = process.env.MONGO_URI_BACKUP;
const BACKUP_ROOT = process.env.BACKUP_ROOT || path.join(__dirname, '..', 'backups');
const DAILY_KEEP = parseInt(process.env.DAILY_KEEP || '7', 10);
const INCREMENTAL_BASE_DAYS = parseInt(process.env.INCREMENTAL_BASE_DAYS || '7', 10);
const BACKUP_STRATEGY = process.env.BACKUP_STRATEGY || 'incremental';
const MONGODUMP_PATH_RAW = process.env.MONGODUMP_PATH || 'mongodump';
const MONGODUMP_BIN = `"${MONGODUMP_PATH_RAW.replace(/^"(.*)"$/, '$1')}"`;

if (!MONGO_URI_BACKUP) {
  console.error('❌ MONGO_URI_BACKUP environment variable is required');
  process.exit(1);
}

function tsSlug(date = new Date()) {
  return date.toISOString().replace(/[:]/g, '-').replace(/\..+/, '');
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return dir;
}

function run(cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, { maxBuffer: 1024 * 1024 * 20 }, (err, stdout, stderr) => {
      if (err) reject(new Error(stderr || err.message));
      if (stderr && !/WARNING/i.test(stderr)) console.log(`⚠️ Stderr: ${stderr}`);
      resolve(stdout);
    });
  });
}

async function compressFolder(sourceDir, outFile) {
  return new Promise((resolve, reject) => {
    const zipCmd = `powershell -NoProfile -Command "Compress-Archive -LiteralPath '${sourceDir}\\' -DestinationPath '${outFile}' -Force"`;
    exec(zipCmd, (err) => {
      if (err) reject(new Error(`Compression failed: ${err.message}`));
      resolve(outFile);
    });
  });
}

async function listSorted(dir) {
  try {
    ensureDir(dir);
    const entries = await fsp.readdir(dir, { withFileTypes: true });
    const files = await Promise.all(
      entries
        .filter(e => e.isFile() && e.name.endsWith('.zip'))
        .map(async (e) => {
          const filePath = path.join(dir, e.name);
          const stats = await fsp.stat(filePath);
          
          let type = 'full';
          if (e.name.includes('_base')) type = 'base';
          else if (e.name.includes('_incremental')) type = 'incremental';
          
          return {
            name: e.name,
            full: filePath,
            mtime: stats.mtime,
            size: stats.size,
            type,
            date: e.name.split('_')[0]
          };
        })
    );
    return files.sort((a, b) => new Date(b.mtime) - new Date(a.mtime));
  } catch {
    return [];
  }
}

const MARKER_DIR = path.join(BACKUP_ROOT, '.markers');
ensureDir(MARKER_DIR);

function timestampToEJSON(ts) {
  if (!ts) return null;
  
  if (ts.$timestamp) return ts;
  
  if (ts.t !== undefined && ts.i !== undefined) {
    return { $timestamp: { t: ts.t, i: ts.i } };
  }
  
  if (ts instanceof Date) {
    return { $timestamp: { t: Math.floor(ts.getTime() / 1000), i: 1 } };
  }
  
  if (typeof ts === 'number') {
    return { $timestamp: { t: Math.floor(ts / 1000), i: 1 } };
  }
  
  return null;
}

async function saveOplogMarker(kind, ts) {
  if (!ts) return;
  const ejson = timestampToEJSON(ts);
  if (ejson) {
    await fsp.writeFile(
      path.join(MARKER_DIR, `${kind}.oplog.ts.json`), 
      JSON.stringify(ejson, null, 2)
    );
  }
}

async function loadOplogMarker(kind) {
  try {
    const raw = await fsp.readFile(path.join(MARKER_DIR, `${kind}.oplog.ts.json`), 'utf-8');
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

async function getLatestOplogTs() {
  const client = new MongoClient(MONGO_URI_BACKUP);
  await client.connect();
  try {
    const doc = await client.db('local').collection('oplog.rs')
      .find({}).sort({ $natural: -1 }).limit(1).next();
    
    if (!doc?.ts) return null;
    
    return timestampToEJSON(doc.ts);
  } finally {
    await client.close();
  }
}

function buildOplogQuery(fromTs, toTs) {
  const query = {};
  const tsCondition = {};
  
  if (fromTs) {
    tsCondition.$gt = fromTs;
  }
  
  if (toTs) {
    tsCondition.$lt = toTs;  // FIX: Changed from $lte to $lt
  }
  
  if (Object.keys(tsCondition).length > 0) {
    query.ts = tsCondition;
  }
  
  return query;
}

async function getLatestBaseBackup(kind = 'daily') {
  const backups = await listSorted(path.join(BACKUP_ROOT, kind));
  return backups.find(b => b.type === 'base') || null;
}

async function needsNewBaseBackup(kind = 'daily') {
  if (BACKUP_STRATEGY !== 'incremental') return true;
  const latestBase = await getLatestBaseBackup(kind);
  if (!latestBase) return true;
  const days = Math.floor((Date.now() - new Date(latestBase.mtime).getTime()) / 86400000);
  console.log(`📅 Days since last ${kind} base: ${days}/${INCREMENTAL_BASE_DAYS}`);
  return days >= INCREMENTAL_BASE_DAYS;
}

async function makeBaseDump(kind = 'daily') {
  const dateSlug = tsSlug();
  const baseDir = ensureDir(path.join(BACKUP_ROOT, kind));
  const tmpDumpDir = path.join(baseDir, `${dateSlug}_dump`);
  const outFile = path.join(baseDir, `${dateSlug}_${kind}_base.zip`);

  ensureDir(tmpDumpDir);

  const cmd = `${MONGODUMP_BIN} --uri="${MONGO_URI_BACKUP}" --out="${tmpDumpDir}" --gzip --oplog`;
  await run(cmd);

  const latestTs = await getLatestOplogTs();
  if (!latestTs) {
    throw new Error('Replica set oplog not available.');
  }
  
  // Save marker for next incremental (AFTER base backup is complete)
  await saveOplogMarker(kind, latestTs);

  await compressFolder(tmpDumpDir, outFile);
  await fsp.rm(tmpDumpDir, { recursive: true, force: true });

  const stats = await fsp.stat(outFile);
  console.log(`✅ Base backup created: ${outFile} (${(stats.size / (1024 * 1024)).toFixed(2)} MB)`);
  return { file: outFile, type: 'base', size: stats.size, isBase: true };
}

async function makeOplogIncremental(kind = 'daily') {
  const dateSlug = tsSlug();
  const baseDir = ensureDir(path.join(BACKUP_ROOT, kind));
  const tmpDumpDir = path.join(baseDir, `${dateSlug}_dump`);
  const outFile = path.join(baseDir, `${dateSlug}_${kind}_incremental.zip`);
  ensureDir(tmpDumpDir);

  const fromTs = await loadOplogMarker(kind);
  const toTs = await getLatestOplogTs();
  
  // DEBUG: Show timestamps
  console.log(`🔍 Oplog timestamp range:`);
  console.log(`   From: ${JSON.stringify(fromTs)}`);
  console.log(`   To: ${JSON.stringify(toTs)}`);
  
  if (!toTs) throw new Error('Replica set oplog not available.');

  if (!fromTs) {
    console.log('⚠️ No previous oplog marker found. Creating base backup instead.');
    return await makeBaseDump(kind);
  }

  // Check if timestamps are the same (no new changes)
  if (JSON.stringify(fromTs) === JSON.stringify(toTs)) {
    console.log('📝 No oplog changes detected in this period');
    await fsp.rm(tmpDumpDir, { recursive: true, force: true });
    return { file: null, type: 'incremental', size: 0, isBase: false, message: 'No changes' };
  }

  const q = buildOplogQuery(fromTs, toTs);
  const qFile = path.join(tmpDumpDir, 'oplogQuery.json');
  await fsp.writeFile(qFile, JSON.stringify(q, null, 2));
  
  console.log(`🔍 Oplog query: ${JSON.stringify(q, null, 2)}`);

  const cmd = `${MONGODUMP_BIN} --uri="${MONGO_URI_BACKUP}" `
    + `--db=local --collection=oplog.rs --queryFile="${qFile}" --out="${tmpDumpDir}" --gzip`;
  await run(cmd);

  const oplogFile = path.join(tmpDumpDir, 'local', 'oplog.rs.bson.gz');
  try {
    const stats = await fsp.stat(oplogFile);
    console.log(`📝 Oplog changes: ${stats.size} bytes`);
    
    if (stats.size === 0) {
      console.log('📝 No oplog changes detected in this period');
      await fsp.rm(tmpDumpDir, { recursive: true, force: true });
      return { file: null, type: 'incremental', size: 0, isBase: false, message: 'No changes' };
    }
  } catch {
    console.log('📝 No oplog changes detected in this period');
    await fsp.rm(tmpDumpDir, { recursive: true, force: true });
    return { file: null, type: 'incremental', size: 0, isBase: false, message: 'No changes' };
  }

  const dumpDir = path.join(tmpDumpDir, 'dump');
  ensureDir(dumpDir);
  await fsp.rename(oplogFile, path.join(dumpDir, 'oplog.bson.gz'));

  // Save new marker AFTER successful backup
  await saveOplogMarker(kind, toTs);

  await compressFolder(tmpDumpDir, outFile);
  await fsp.rm(tmpDumpDir, { recursive: true, force: true });

  const stats = await fsp.stat(outFile);
  console.log(`✅ Incremental backup created: ${outFile} (${(stats.size / (1024 * 1024)).toFixed(2)} MB)`);
  
  return { 
    file: outFile, 
    type: 'incremental', 
    size: stats.size, 
    isBase: false
  };
}

async function enforceIncrementalRetention(dir, keepDays = 7) {
  try {
    const files = await listSorted(dir);
    if (files.length === 0) return;

    const bases = files.filter(f => f.type === 'base');
    const incs = files.filter(f => f.type === 'incremental');

    console.log(`📊 Retention in ${dir}: ${bases.length} base(s), ${incs.length} incremental(s)`);

    if (bases.length > 1) {
      const latestBase = bases[0];
      for (const oldBase of bases.slice(1)) {
        await fsp.unlink(oldBase.full).catch(() => {});
      }
      const latestBaseTime = new Date(latestBase.mtime).getTime();
      for (const inc of incs) {
        if (new Date(inc.mtime).getTime() < latestBaseTime) {
          await fsp.unlink(inc.full).catch(() => {});
        }
      }
    }

    const cutoff = Date.now() - keepDays * 86400000;
    for (const inc of incs) {
      if (new Date(inc.mtime).getTime() < cutoff) {
        await fsp.unlink(inc.full).catch(() => {});
      }
    }
  } catch (e) {
    console.error('❌ Error enforcing incremental retention:', e);
  }
}

async function runDailyBackup() {
  try {
    console.log('🔄 Starting daily backup...');

    if (BACKUP_STRATEGY !== 'incremental') {
      const result = await makeBaseDump('daily');
      return result;
    }

    const needBase = await needsNewBaseBackup('daily');
    const result = needBase ? await makeBaseDump('daily') : await makeOplogIncremental('daily');

    await enforceIncrementalRetention(path.join(BACKUP_ROOT, 'daily'), DAILY_KEEP);
    return result;
  } catch (error) {
    console.error('❌ Daily backup process failed:', error);
    throw error;
  }
}

async function listBackups(kind = 'daily') {
  try {
    return await listSorted(path.join(BACKUP_ROOT, kind));
  } catch (error) {
    console.error(`❌ Error listing ${kind} backups:`, error);
    throw error;
  }
}

async function getBackupChain(kind = 'daily') {
  const backups = await listBackups(kind);
  const base = backups.find(b => b.type === 'base') || null;
  const incrementals = backups
    .filter(b => b.type === 'incremental')
    .sort((a, b) => new Date(a.mtime) - new Date(b.mtime));
  const totalSize = backups.reduce((s, f) => s + f.size, 0);

  return {
    base,
    incrementals,
    chainLength: (base ? 1 : 0) + incrementals.length,
    totalSize,
    totalSizeMB: (totalSize / (1024 * 1024)).toFixed(2) + ' MB',
  };
}

module.exports = {
  runDailyBackup,
  listBackups,
  getBackupChain,
  BACKUP_STRATEGY,
};