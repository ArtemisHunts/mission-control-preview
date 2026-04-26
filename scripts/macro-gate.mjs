#!/usr/bin/env node
import { execSync } from 'node:child_process';

const args = new Map(process.argv.slice(2).map((arg) => {
  const [key, value = 'true'] = arg.replace(/^--/, '').split('=');
  return [key, value];
}));

const minSourceLines = Number(args.get('min-source-lines') ?? 220);
const minSourceFiles = Number(args.get('min-source-files') ?? 1);
const sourcePattern = /^(app\.js|style\.css|index\.html|styleframe\.css|styleframe\.html)$/;

function sh(cmd) {
  return execSync(cmd, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
}

const diff = sh('git diff --numstat HEAD -- .');
const rows = diff ? diff.split('\n').map((line) => line.split(/\s+/)) : [];
const sourceRows = rows.filter(([, , file]) => sourcePattern.test(file));
const sourceLines = sourceRows.reduce((sum, [added, removed]) => {
  const a = added === '-' ? 0 : Number(added || 0);
  const r = removed === '-' ? 0 : Number(removed || 0);
  return sum + a + r;
}, 0);
const sourceFiles = new Set(sourceRows.map(([, , file]) => file));
const allFiles = rows.map(([, , file]) => file);

const failures = [];
if (sourceLines < minSourceLines) failures.push(`source line delta ${sourceLines} < required ${minSourceLines}`);
if (sourceFiles.size < minSourceFiles) failures.push(`source files changed ${sourceFiles.size} < required ${minSourceFiles}`);
if (!allFiles.includes('docs/loop-metrics.json')) failures.push('docs/loop-metrics.json was not updated');

console.log(JSON.stringify({
  ok: failures.length === 0,
  sourceLines,
  minSourceLines,
  sourceFiles: [...sourceFiles],
  changedFiles: allFiles,
  failures
}, null, 2));

if (failures.length) process.exit(1);
