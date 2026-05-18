import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const statePath = path.join(root, 'mission-control-state.json');
const allowedTaskStatuses = new Set(['queued', 'active', 'running', 'blocked', 'completed', 'cancelled']);
const allowedGoalStatuses = new Set(['queued', 'active', 'running', 'blocked', 'completed', 'cancelled']);
const supportedTypes = new Set([
  'task.recorded',
  'task.assigned',
  'task.status_changed',
  'task.progress_reported',
  'goal.checkpoint',
  'review.recorded',
  'review.status_changed',
  'artifact.recorded'
]);

function usage() {
  return [
    'Usage:',
    '  node scripts/apply-mission-events.mjs path/to/events.json',
    '  node scripts/apply-mission-events.mjs --event JSON',
    '  cat events.json | node scripts/apply-mission-events.mjs',
    '',
    'Options:',
    '  --dry-run     Validate and summarize without writing mission-control-state.json',
    '  --event JSON  Ingest one event object from the command line'
  ].join('\n');
}

function readStdin() {
  if (process.stdin.isTTY) return '';
  return fs.readFileSync(0, 'utf8');
}

function parseArgs(argv) {
  const args = [...argv];
  const dryRun = args.includes('--dry-run');
  const filtered = args.filter((arg) => arg !== '--dry-run');
  const eventIndex = filtered.indexOf('--event');

  if (filtered.includes('--help') || filtered.includes('-h')) {
    console.log(usage());
    process.exit(0);
  }

  if (eventIndex >= 0) {
    const raw = filtered[eventIndex + 1];
    if (!raw) throw new Error('--event requires a JSON string');
    return { dryRun, raw };
  }

  const fileArg = filtered[0];
  if (fileArg) {
    return { dryRun, raw: fs.readFileSync(path.resolve(root, fileArg), 'utf8') };
  }

  const stdin = readStdin();
  if (!stdin.trim()) throw new Error('No event input provided.\n' + usage());
  return { dryRun, raw: stdin };
}

function asArray(value) {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.events)) return value.events;
  return [value];
}

function indexById(items = []) {
  return new Map(items.map((item) => [item.id, item]));
}

function requireRef(map, collection, id, fieldName) {
  if (!id) return;
  if (!map.has(id)) throw new Error(fieldName + ' not found in ' + collection + ': ' + id);
}

function normalizeId(prefix, value) {
  if (value) return String(value);
  return prefix + '-' + new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14);
}

function timestamp() {
  return new Date().toISOString();
}

function ensureArrayField(target, fieldName) {
  if (!Array.isArray(target[fieldName])) target[fieldName] = [];
  return target[fieldName];
}

function addUnique(target, fieldName, value) {
  if (!target || !value) return;
  const list = ensureArrayField(target, fieldName);
  if (!list.includes(value)) list.push(value);
}

function validateBaseEvent(event) {
  if (!event || typeof event !== 'object') throw new Error('event must be an object');
  if (!supportedTypes.has(event.type)) {
    throw new Error('unsupported event type: ' + (event.type || 'missing'));
  }
  if (!event.message && event.type !== 'artifact.recorded' && event.type !== 'task.recorded' && event.type !== 'review.recorded') {
    throw new Error(event.type + ' requires message');
  }
}

function defaultMessage(event) {
  if (event.type === 'artifact.recorded') return 'Artifact recorded: ' + (event.artifact?.name || event.artifact?.id || 'unnamed artifact');
  if (event.type === 'task.recorded') return 'Task recorded: ' + (event.task?.title || event.task?.id || 'unnamed task');
  if (event.type === 'review.recorded') return 'Review gate recorded: ' + (event.review?.title || event.review?.id || 'unnamed review');
  return event.type;
}

function refreshIndexes(state) {
  return {
    agents: indexById(state.agents || []),
    goals: indexById(state.goals || []),
    runs: indexById(state.goalRuns || []),
    tasks: indexById(state.tasks || []),
    reviews: indexById(state.reviews || []),
    artifacts: indexById(state.artifacts || []),
    events: indexById(state.events || [])
  };
}

function buildEventRecord(event, indexes, now) {
  const goalId = event.goalId || event.task?.goalId || event.artifact?.goalId || null;
  const taskId = event.taskId || event.task?.id || null;
  const agentId = event.agentId || event.assigneeId || event.task?.assigneeId || null;
  const reviewId = event.reviewId || event.review?.id || null;
  const runId = event.runId || indexes.goals.get(goalId)?.currentRunId || null;
  const artifactIds = [
    ...(Array.isArray(event.artifactIds) ? event.artifactIds : []),
    event.artifact?.id
  ].filter(Boolean);

  return {
    id: normalizeId('evt-ingested', event.id),
    type: event.type,
    goalId,
    runId,
    agentId,
    taskId,
    reviewId,
    message: event.message || defaultMessage(event),
    artifactIds,
    createdAt: event.createdAt || now,
    source: event.source || 'codex-local-ingestion',
    ingestedAt: now,
    isDemo: Boolean(event.isDemo)
  };
}

function validateReferences(record, indexes) {
  requireRef(indexes.goals, 'goals', record.goalId, 'goalId');
  requireRef(indexes.runs, 'goalRuns', record.runId, 'runId');
  requireRef(indexes.agents, 'agents', record.agentId, 'agentId');
  requireRef(indexes.tasks, 'tasks', record.taskId, 'taskId');
  requireRef(indexes.reviews, 'reviews', record.reviewId, 'reviewId');
  for (const artifactId of record.artifactIds || []) {
    requireRef(indexes.artifacts, 'artifacts', artifactId, 'artifactId');
  }
}

function applyTaskRecorded(state, event, indexes, now) {
  const task = event.task;
  if (!task || typeof task !== 'object') throw new Error('task.recorded requires task object');
  if (!task.id) throw new Error('task.recorded task missing id');
  if (!task.goalId) throw new Error('task.recorded task missing goalId');
  if (!task.title) throw new Error('task.recorded task missing title');
  if (task.status && !allowedTaskStatuses.has(task.status)) throw new Error('invalid task status: ' + task.status);
  requireRef(indexes.goals, 'goals', task.goalId, 'task.goalId');
  requireRef(indexes.agents, 'agents', task.assigneeId, 'task.assigneeId');

  const existing = indexes.tasks.get(task.id);
  const normalizedTask = {
    project: 'Mission Control',
    priority: 2,
    requester: 'Michael',
    autoAssignable: true,
    tags: [],
    createdAt: now,
    updatedAt: now,
    isDemo: false,
    ...task,
    status: task.status || 'queued',
    updatedAt: now
  };

  if (existing) Object.assign(existing, normalizedTask);
  else state.tasks.push(normalizedTask);
}

function applyTaskAssigned(event, indexes, now) {
  const task = indexes.tasks.get(event.taskId);
  const agentId = event.assigneeId || event.agentId;
  const agent = indexes.agents.get(agentId);
  if (!task) throw new Error('task.assigned taskId not found: ' + event.taskId);
  if (!agent) throw new Error('task.assigned agentId/assigneeId not found: ' + agentId);

  task.assigneeId = agent.id;
  if (task.status === 'queued') task.status = 'active';
  task.updatedAt = now;
  agent.currentTaskId = task.id;
  agent.currentGoalId = task.goalId;
  agent.status = 'working';
  agent.load = Math.min(100, Math.max(agent.load || 0, 42));
}

function applyTaskStatusChanged(event, indexes, now) {
  const task = indexes.tasks.get(event.taskId);
  if (!task) throw new Error('task.status_changed taskId not found: ' + event.taskId);
  if (!allowedTaskStatuses.has(event.status)) throw new Error('invalid task status: ' + event.status);
  task.status = event.status;
  task.updatedAt = now;
}

function applyGoalCheckpoint(event, indexes, now) {
  const goal = indexes.goals.get(event.goalId);
  if (!goal) throw new Error('goal.checkpoint goalId not found: ' + event.goalId);
  if (event.status) {
    if (!allowedGoalStatuses.has(event.status)) throw new Error('invalid goal status: ' + event.status);
    goal.status = event.status;
  }
  goal.updatedAt = now;
  const run = indexes.runs.get(event.runId || goal.currentRunId);
  if (run && event.summary) {
    run.summary = event.summary;
    run.status = event.runStatus || run.status;
  }
}

function applyReviewRecorded(state, event, indexes, now) {
  const review = event.review;
  if (!review || typeof review !== 'object') throw new Error('review.recorded requires review object');
  if (!review.id) throw new Error('review.recorded review missing id');
  if (!review.goalId) throw new Error('review.recorded review missing goalId');
  if (!review.title) throw new Error('review.recorded review missing title');
  requireRef(indexes.goals, 'goals', review.goalId, 'review.goalId');
  requireRef(indexes.tasks, 'tasks', review.taskId, 'review.taskId');
  requireRef(indexes.agents, 'agents', review.requestedByAgentId, 'review.requestedByAgentId');

  const existing = indexes.reviews.get(review.id);
  const normalizedReview = {
    status: 'required',
    decision: 'pending',
    riskLevel: 'medium',
    requiredApprovals: ['Michael'],
    evidence: [],
    createdAt: now,
    updatedAt: now,
    isDemo: false,
    ...review,
    updatedAt: now
  };

  if (existing) Object.assign(existing, normalizedReview);
  else state.reviews.push(normalizedReview);
}

function applyReviewStatusChanged(event, indexes, now) {
  const review = indexes.reviews.get(event.reviewId);
  if (!review) throw new Error('review.status_changed reviewId not found: ' + event.reviewId);
  if (!event.status) throw new Error('review.status_changed requires status');
  review.status = event.status;
  if (event.decision) review.decision = event.decision;
  if (event.evidence) review.evidence = event.evidence;
  if (event.note) review.note = event.note;
  review.updatedAt = now;
}

function applyArtifactRecorded(state, event, indexes, now) {
  const artifact = event.artifact;
  if (!artifact || typeof artifact !== 'object') throw new Error('artifact.recorded requires artifact object');
  if (!artifact.id) throw new Error('artifact.recorded artifact missing id');
  if (!artifact.goalId) throw new Error('artifact.recorded artifact missing goalId');
  if (!artifact.kind) throw new Error('artifact.recorded artifact missing kind');
  if (!artifact.name) throw new Error('artifact.recorded artifact missing name');
  if (!artifact.path) throw new Error('artifact.recorded artifact missing path');
  requireRef(indexes.goals, 'goals', artifact.goalId, 'artifact.goalId');

  const normalizedArtifact = {
    createdAt: now,
    isDemo: false,
    ...artifact
  };
  const existing = indexes.artifacts.get(artifact.id);
  if (existing) Object.assign(existing, normalizedArtifact);
  else state.artifacts.push(normalizedArtifact);

  const goal = indexes.goals.get(artifact.goalId);
  addUnique(goal, 'artifactIds', artifact.id);
}

function applyStateMutation(state, event, indexes, now) {
  if (event.type === 'task.recorded') applyTaskRecorded(state, event, indexes, now);
  if (event.type === 'task.assigned') applyTaskAssigned(event, indexes, now);
  if (event.type === 'task.status_changed') applyTaskStatusChanged(event, indexes, now);
  if (event.type === 'goal.checkpoint') applyGoalCheckpoint(event, indexes, now);
  if (event.type === 'review.recorded') applyReviewRecorded(state, event, indexes, now);
  if (event.type === 'review.status_changed') applyReviewStatusChanged(event, indexes, now);
  if (event.type === 'artifact.recorded') applyArtifactRecorded(state, event, indexes, now);
}

function linkEvent(record, indexes) {
  const goal = indexes.goals.get(record.goalId);
  const run = indexes.runs.get(record.runId);
  const task = indexes.tasks.get(record.taskId);

  addUnique(run || goal, 'eventIds', record.id);
  addUnique(task, 'eventIds', record.id);
  for (const artifactId of record.artifactIds || []) {
    addUnique(goal, 'artifactIds', artifactId);
    addUnique(run, 'artifactIds', artifactId);
  }
}

function refreshTelemetry(state, now) {
  if (!state.telemetry) state.telemetry = {};
  const goals = state.goals || [];
  const tasks = state.tasks || [];
  const latestEvent = (state.events || []).reduce((latest, event) => {
    if (!latest) return event;
    return new Date(event.createdAt || 0) >= new Date(latest.createdAt || 0) ? event : latest;
  }, null);
  state.telemetry.summary = {
    activeGoals: goals.filter((goal) => goal.status === 'running' || goal.status === 'active').length,
    activeTasks: tasks.filter((task) => task.status === 'active' || task.status === 'running').length,
    queuedTasks: tasks.filter((task) => task.status === 'queued').length,
    blockedGoals: goals.filter((goal) => goal.status === 'blocked').length,
    latestEventId: latestEvent?.id || null
  };
  state.telemetry.updatedAt = now;
  state.telemetry.isDemo = false;
  state.meta.updatedAt = now;
}

function applyEvents(state, inputEvents) {
  const summaries = [];
  for (const input of inputEvents) {
    validateBaseEvent(input);
    const now = input.ingestedAt || timestamp();
    let indexes = refreshIndexes(state);
    if (input.id && indexes.events.has(input.id)) {
      summaries.push({ id: input.id, type: input.type, action: 'skipped-duplicate' });
      continue;
    }
    applyStateMutation(state, input, indexes, now);
    indexes = refreshIndexes(state);
    const record = buildEventRecord(input, indexes, now);

    if (indexes.events.has(record.id)) {
      summaries.push({ id: record.id, type: record.type, action: 'skipped-duplicate' });
      continue;
    }

    validateReferences(record, indexes);
    state.events.push(record);
    linkEvent(record, refreshIndexes(state));
    refreshTelemetry(state, now);
    summaries.push({ id: record.id, type: record.type, action: 'applied' });
  }
  return summaries;
}

try {
  const { dryRun, raw } = parseArgs(process.argv.slice(2));
  const input = JSON.parse(raw);
  const events = asArray(input);
  const state = JSON.parse(fs.readFileSync(statePath, 'utf8'));
  const summaries = applyEvents(state, events);

  if (!dryRun) {
    const tmpPath = statePath + '.tmp';
    fs.writeFileSync(tmpPath, JSON.stringify(state, null, 2) + '\n');
    fs.renameSync(tmpPath, statePath);
  }

  console.log((dryRun ? 'DRY RUN ' : '') + 'applied ' + summaries.filter((item) => item.action === 'applied').length + ' / ' + summaries.length + ' mission events');
  for (const item of summaries) {
    console.log('- ' + item.action + ': ' + item.type + ' - ' + item.id);
  }
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
