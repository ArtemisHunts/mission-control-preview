import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const inboxDir = path.join(root, 'mission-events', 'inbox');
const processedDir = path.join(root, 'mission-events', 'processed');
const failedDir = path.join(root, 'mission-events', 'failed');
const applyScript = path.join(root, 'scripts', 'apply-mission-events.mjs');
const pollMs = 1500;
const once = process.argv.includes('--once');

function ensureDirs() {
  for (const dir of [inboxDir, processedDir, failedDir]) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function archiveName(filePath) {
  const stamp = new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14);
  return stamp + '-' + path.basename(filePath);
}

function moveFile(filePath, targetDir) {
  fs.renameSync(filePath, path.join(targetDir, archiveName(filePath)));
}

function inboxFiles() {
  return fs.readdirSync(inboxDir)
    .filter((name) => name.endsWith('.json'))
    .map((name) => path.join(inboxDir, name))
    .sort((a, b) => fs.statSync(a).mtimeMs - fs.statSync(b).mtimeMs);
}

function processFile(filePath) {
  const result = spawnSync(process.execPath, [applyScript, filePath], {
    cwd: root,
    encoding: 'utf8'
  });

  if (result.status === 0) {
    moveFile(filePath, processedDir);
    process.stdout.write(result.stdout);
    console.log('processed inbox event: ' + path.basename(filePath));
    return true;
  }

  const errorPath = filePath + '.error.log';
  fs.writeFileSync(errorPath, [result.stdout, result.stderr].filter(Boolean).join('\n'));
  moveFile(filePath, failedDir);
  moveFile(errorPath, failedDir);
  process.stderr.write(result.stderr || result.stdout);
  console.error('failed inbox event: ' + path.basename(filePath));
  return false;
}

function processInbox() {
  let processed = 0;
  let failed = 0;
  for (const filePath of inboxFiles()) {
    if (processFile(filePath)) processed += 1;
    else failed += 1;
  }
  return { processed, failed };
}

ensureDirs();

if (once) {
  const summary = processInbox();
  console.log('mission event bridge once: ' + summary.processed + ' processed, ' + summary.failed + ' failed');
  process.exit(summary.failed ? 1 : 0);
}

console.log('mission event bridge watching ' + inboxDir);
processInbox();
setInterval(processInbox, pollMs);
