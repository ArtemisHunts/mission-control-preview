import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const statePath = path.join(root, 'mission-control-state.json');
const state = JSON.parse(fs.readFileSync(statePath, 'utf8'));

const requiredTopLevel = [
  'meta',
  'agents',
  'goals',
  'goalRuns',
  'tasks',
  'events',
  'reviews',
  'artifacts',
  'facilityAssets',
  'visualReviews',
  'telemetry'
];

const errors = [];
for (const key of requiredTopLevel) {
  if (!(key in state)) errors.push('missing top-level key: ' + key);
}

for (const key of ['agents', 'goals', 'goalRuns', 'tasks', 'events', 'reviews', 'artifacts', 'facilityAssets', 'visualReviews']) {
  if (!Array.isArray(state[key])) errors.push(key + ' must be an array');
}

const ids = new Map();
function requireId(collectionName, item) {
  if (!item || typeof item !== 'object') {
    errors.push(collectionName + ' entry must be an object');
    return;
  }
  if (!item.id) {
    errors.push(collectionName + ' entry missing id');
    return;
  }
  const scopedId = collectionName + ':' + item.id;
  if (ids.has(scopedId)) errors.push('duplicate id in ' + collectionName + ': ' + item.id);
  ids.set(scopedId, true);
}

for (const key of ['agents', 'goals', 'goalRuns', 'tasks', 'events', 'reviews', 'artifacts', 'facilityAssets', 'visualReviews']) {
  for (const item of state[key] ?? []) requireId(key, item);
}

const agentIds = new Set((state.agents ?? []).map((agent) => agent.id));
const goalIds = new Set((state.goals ?? []).map((goal) => goal.id));
const runIds = new Set((state.goalRuns ?? []).map((run) => run.id));
const taskIds = new Set((state.tasks ?? []).map((task) => task.id));
const reviewIds = new Set((state.reviews ?? []).map((review) => review.id));
const artifactIds = new Set((state.artifacts ?? []).map((artifact) => artifact.id));

for (const goal of state.goals ?? []) {
  if (!goal.status) errors.push('goal ' + goal.id + ' missing status');
  if (!agentIds.has(goal.ownerAgentId)) errors.push('goal ' + goal.id + ' ownerAgentId not found: ' + goal.ownerAgentId);
  if (goal.currentRunId && !runIds.has(goal.currentRunId)) errors.push('goal ' + goal.id + ' currentRunId not found: ' + goal.currentRunId);
  for (const artifactId of goal.artifactIds ?? []) {
    if (!artifactIds.has(artifactId)) errors.push('goal ' + goal.id + ' artifactId not found: ' + artifactId);
  }
}

for (const run of state.goalRuns ?? []) {
  if (!goalIds.has(run.goalId)) errors.push('goalRun ' + run.id + ' goalId not found: ' + run.goalId);
}

for (const task of state.tasks ?? []) {
  if (task.goalId && !goalIds.has(task.goalId)) errors.push('task ' + task.id + ' goalId not found: ' + task.goalId);
  if (task.assigneeId && !agentIds.has(task.assigneeId)) errors.push('task ' + task.id + ' assigneeId not found: ' + task.assigneeId);
}

for (const review of state.reviews ?? []) {
  if (review.goalId && !goalIds.has(review.goalId)) errors.push('review ' + review.id + ' goalId not found: ' + review.goalId);
  if (review.taskId && !taskIds.has(review.taskId)) errors.push('review ' + review.id + ' taskId not found: ' + review.taskId);
  if (review.requestedByAgentId && !agentIds.has(review.requestedByAgentId)) errors.push('review ' + review.id + ' requestedByAgentId not found: ' + review.requestedByAgentId);
  for (const agentId of review.approverAgentIds ?? []) {
    if (!agentIds.has(agentId)) errors.push('review ' + review.id + ' approverAgentId not found: ' + agentId);
  }
}

for (const event of state.events ?? []) {
  if (event.goalId && !goalIds.has(event.goalId)) errors.push('event ' + event.id + ' goalId not found: ' + event.goalId);
  if (event.runId && !runIds.has(event.runId)) errors.push('event ' + event.id + ' runId not found: ' + event.runId);
  if (event.agentId && !agentIds.has(event.agentId)) errors.push('event ' + event.id + ' agentId not found: ' + event.agentId);
  if (event.taskId && !taskIds.has(event.taskId)) errors.push('event ' + event.id + ' taskId not found: ' + event.taskId);
  if (event.reviewId && !reviewIds.has(event.reviewId)) errors.push('event ' + event.id + ' reviewId not found: ' + event.reviewId);
  for (const artifactId of event.artifactIds ?? []) {
    if (!artifactIds.has(artifactId)) errors.push('event ' + event.id + ' artifactId not found: ' + artifactId);
  }
}

if (state.meta?.isDemo !== false) {
  errors.push('meta.isDemo must be false for canonical state; mark demo rows individually');
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('PASS mission-control-state.json schema v' + state.meta.schemaVersion + ' · ' + state.goals.length + ' goals · ' + state.events.length + ' events');
