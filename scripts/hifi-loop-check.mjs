#!/usr/bin/env node
import { existsSync } from 'fs';
import { execSync } from 'child_process';

if (existsSync('.hifi-loop-stop')) {
  console.log('STOP .hifi-loop-stop present');
  process.exit(0);
}

const branch = execSync('git branch --show-current', { encoding: 'utf8' }).trim();
if (branch !== 'concept-c-hifi') {
  console.log(`STOP wrong branch: ${branch}`);
  process.exit(0);
}

const status = execSync('git status --short', { encoding: 'utf8' }).trim();
if (status) {
  console.log(`STOP dirty tree before iteration:\n${status}`);
  process.exit(0);
}

console.log('OK concept-c-hifi clean');
