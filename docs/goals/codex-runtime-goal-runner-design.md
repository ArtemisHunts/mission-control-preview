# Mission Control — Codex Runtime Goal Runner Design

_Last updated: 2026-05-16_
_Status: Goal 1 design foundation_

## Runtime policy

For the current `#dashboard` Mission Control build loop, **Codex GPT-5.5 in this OpenClaw channel is the exclusive execution runtime**.

This means:

- Artemis uses this Codex channel to decompose, execute, verify, and report work.
- External worker processes are optional adapters, not the source of truth.
- The external `@openai/codex` CLI can later become a child execution adapter once authenticated, but it is not required for current progress.
- Other autonomous runtimes are not used for implementation goals unless Michael changes the policy.

## Core principle

Mission Control owns state. Codex owns execution.

A goal run should never rely only on chat memory. Every meaningful step must leave an inspectable artifact:

- goal document
- state/event record
- changed source file
- visual review
- test output
- artifact reference
- final summary

## Goal lifecycle

```text
Draft
  -> Planned
  -> Running
  -> Verifying
  -> Review
  -> Done
```

Holding/error states:

```text
Paused
Blocked
Failed
Needs Human Decision
Canceled
```

## Goal object

```ts
type MissionGoal = {
  id: string;
  title: string;
  objective: string;
  project: string;
  status: GoalStatus;
  priority: 1 | 2 | 3 | 4 | 5;
  requester: 'Michael' | 'Artemis' | string;
  ownerAgentId: string;
  assignedAgentIds: string[];
  runtime: 'codex-channel' | 'codex-cli-adapter';
  context: string[];
  constraints: string[];
  successCriteria: string[];
  verification: string[];
  stopRules: string[];
  artifacts: string[];
  currentRunId?: string;
  createdAt: string;
  updatedAt: string;
};
```

## Goal run object

```ts
type GoalRun = {
  id: string;
  goalId: string;
  runtime: 'codex-channel' | 'codex-cli-adapter';
  status: 'queued' | 'running' | 'verifying' | 'review' | 'done' | 'blocked' | 'failed';
  startedAt?: string;
  endedAt?: string;
  summary?: string;
  verificationSummary?: string;
  blocker?: string;
  eventIds: string[];
  artifactIds: string[];
};
```

## Event contract

Everything important becomes an event.

```ts
type MissionEvent = {
  id: string;
  type:
    | 'goal.created'
    | 'goal.planned'
    | 'goal.started'
    | 'goal.progress'
    | 'goal.blocked'
    | 'goal.verification.started'
    | 'goal.verification.passed'
    | 'goal.verification.failed'
    | 'goal.review.requested'
    | 'goal.completed'
    | 'goal.failed'
    | 'agent.assigned'
    | 'artifact.created'
    | 'facility.asset.reviewed'
    | 'facility.visual_review.created';
  goalId?: string;
  runId?: string;
  agentId?: string;
  taskId?: string;
  message: string;
  artifactIds?: string[];
  createdAt: string;
};
```

## Runtime adapter boundary

The first implementation can be local/in-process. The interface still matters because it lets us later attach Codex CLI or another Codex-backed worker without rewriting Mission Control.

```ts
type GoalRuntimeAdapter = {
  id: 'codex-channel' | 'codex-cli-adapter';
  start(goal: MissionGoal): Promise<GoalRun>;
  pause(runId: string): Promise<void>;
  resume(runId: string): Promise<void>;
  cancel(runId: string): Promise<void>;
  getStatus(runId: string): Promise<GoalRun>;
  appendEvent(event: MissionEvent): Promise<void>;
};
```

### `codex-channel`

Current runtime. Work is performed by this Codex GPT-5.5 channel through OpenClaw tools.

Strengths:
- already available
- can edit files, run checks, inspect images/docs/assets
- can report directly to Michael in-channel

Limits:
- not a separate independent worker process
- progress must be explicitly persisted to repo/state/docs

### `codex-cli-adapter`

Future child runtime. Only enabled after separate auth is configured.

Strengths:
- can run isolated non-interactive goal prompts
- good for bounded sub-goals

Limits:
- needs auth
- must not become canonical state owner
- must emit artifacts/events back into Mission Control

## Review gates

A goal must enter Review before completion if it touches:

- deploys
- paid external generation
- public-facing copy/posts
- credentials/config/secrets
- destructive file operations
- broad architecture rewrites
- production data

## Facility-specific events

The AAA asteroid facility buildout uses the same goal/event system, plus facility-specific artifact tracking.

Key event types:

- `facility.concept.generated`
- `facility.meshy.asset.generated`
- `facility.asset.cleaned`
- `facility.asset.integrated`
- `facility.visual_review.created`
- `facility.visual_review.failed`
- `facility.visual_review.passed`

These should power the future command-console **Facility Buildout / Asset Pipeline** panel.

## Next implementation target

Create a minimal canonical state file or SQLite schema containing:

- goals
- goalRuns
- events
- agents
- tasks
- artifacts
- facilityAssets
- visualReviews

For the preview repo, start with JSON because it is easy to inspect, version, and bind into the static UI. Promote to SQLite/server only once the UI proves the loop.
