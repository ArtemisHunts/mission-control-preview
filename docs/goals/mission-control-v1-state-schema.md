# Mission Control v1 — Minimal State Schema

_Last updated: 2026-05-16_
_Status: Goal 1 schema draft_

## Recommendation

Start with a single canonical JSON state file for the preview:

```text
mission-control-state.json
```

The existing `state.json` can either be migrated or wrapped. The important change is semantic: the state must represent real Mission Control entities, not just demo scene labels.

## Top-level shape

```json
{
  "meta": {},
  "agents": [],
  "goals": [],
  "goalRuns": [],
  "tasks": [],
  "events": [],
  "reviews": [],
  "artifacts": [],
  "facilityAssets": [],
  "visualReviews": [],
  "telemetry": {}
}
```

## Required entity fields

### Agent

```json
{
  "id": "artemis",
  "name": "Artemis",
  "role": "Orchestrator",
  "skills": ["orchestration", "planning", "review"],
  "trustLevel": 4,
  "status": "working",
  "currentGoalId": "goal-mc-v1-campaign",
  "currentTaskId": null,
  "load": 82,
  "runtime": "codex-channel",
  "location": "command-hub"
}
```

### Goal

```json
{
  "id": "goal-mc-v1-campaign",
  "title": "Deliver Mission Control v1",
  "status": "running",
  "priority": 1,
  "ownerAgentId": "artemis",
  "runtime": "codex-channel",
  "successCriteria": [],
  "verification": [],
  "stopRules": [],
  "artifactIds": [],
  "createdAt": "2026-05-16T19:00:00Z",
  "updatedAt": "2026-05-16T19:00:00Z"
}
```

### Event

```json
{
  "id": "evt-20260516-goal1-started",
  "type": "goal.started",
  "goalId": "goal-1-codex-runtime-design",
  "agentId": "artemis",
  "message": "Started Codex runtime goal-runner design.",
  "createdAt": "2026-05-16T19:52:00Z"
}
```

### Facility asset

```json
{
  "id": "asset-command-hub-holo-table-v1",
  "name": "Command Hub Holographic Table",
  "category": "hero-module",
  "source": "existing-blender | gpt-image-2 | meshy-ai | manual-threejs",
  "status": "candidate | approved | integrated | rejected",
  "paths": [],
  "qualityNotes": [],
  "visualReviewIds": []
}
```

## State discipline

- Demo data must use `isDemo: true`.
- Real goal work must create events/artifacts.
- Facility assets must have a source and verdict.
- Visual reviews must say `closer`, `neutral`, or `worse`.
- No asset is considered integrated until it appears in runtime and passes a visual/performance review.

## UI binding plan

The holographic console should read from this state and render:

- Mission Overview from `goals` + `goalRuns`.
- Agent Status from `agents`.
- Task Lanes from `tasks`.
- Review Chamber from `reviews`.
- Telemetry Wall from `telemetry` + latest `events`.
- Facility Buildout from `facilityAssets` + `visualReviews`.
