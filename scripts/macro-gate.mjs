#!/usr/bin/env node
import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const args = new Map(process.argv.slice(2).map((arg) => {
  const [key, value = 'true'] = arg.replace(/^--/, '').split('=');
  return [key, value];
}));

const minSourceLines = Number(args.get('min-source-lines') ?? 450);
const minSourceFiles = Number(args.get('min-source-files') ?? 1);
const requireVisual = args.get('require-visual') !== 'false';
const sourcePattern = /^(app\.js|style\.css|index\.html|styleframe\.css|styleframe\.html)$/;
const visualPattern = /^docs\/visual-reviews\/.*\.md$/;

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
const visualFiles = allFiles.filter((file) => visualPattern.test(file));

const failures = [];
if (sourceLines < minSourceLines) failures.push(`source line delta ${sourceLines} < required ${minSourceLines}`);
if (sourceFiles.size < minSourceFiles) failures.push(`source files changed ${sourceFiles.size} < required ${minSourceFiles}`);
if (!allFiles.includes('docs/loop-metrics.json')) failures.push('docs/loop-metrics.json was not updated');

const visualReviews = [];
if (requireVisual) {
  if (visualFiles.length === 0) {
    failures.push('no docs/visual-reviews/*.md visual review was updated');
  }
  for (const file of visualFiles) {
    const text = readFileSync(file, 'utf8');
    const checks = {
      screenshot: /^Screenshot:\s*\S+/mi.test(text),
      refs: /^References benchmarked:/mi.test(text),
      verdictCloser: /^North-star verdict:\s*closer\b/mi.test(text),
      containerScore: /^Container\/shell:\s*[0-5]\//mi.test(text),
      stationScore: /^Station visibility:\s*[0-5]\//mi.test(text),
      lightingScore: /^Lighting\/readability:\s*[0-5]\//mi.test(text),
      depthScore: /^Depth\/scale:\s*[0-5]\//mi.test(text),
      action: /^Next visual fix:/mi.test(text),
    };
    const missing = Object.entries(checks).filter(([, ok]) => !ok).map(([key]) => key);
    visualReviews.push({ file, checks, missing });
    if (missing.length) failures.push(`${file} missing visual proof fields: ${missing.join(', ')}`);
  }
}

console.log(JSON.stringify({
  ok: failures.length === 0,
  sourceLines,
  minSourceLines,
  sourceFiles: [...sourceFiles],
  visualFiles,
  changedFiles: allFiles,
  visualReviews,
  failures
}, null, 2));

if (failures.length) process.exit(1);
