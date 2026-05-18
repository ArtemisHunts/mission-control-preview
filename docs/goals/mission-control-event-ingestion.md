# Mission Control Event Ingestion Boundary

Mission Control now has two event paths:

- Canonical state: mission-control-state.json, committed with the app and loaded by the browser.
- Preview state: browser localStorage, used only for interactive assignment previews before a backend source exists.

The durable ingestion boundary is scripts/apply-mission-events.mjs. It accepts a JSON event or event batch from a file, stdin, or --event, validates references against canonical state, applies supported state mutations, appends normalized events, refreshes telemetry, and writes mission-control-state.json atomically.

Supported event types:

- task.recorded
- task.assigned
- task.status_changed
- task.progress_reported
- goal.checkpoint
- review.recorded
- review.status_changed
- artifact.recorded

Example:

    node scripts/apply-mission-events.mjs docs/goals/sample-mission-events.json
    node scripts/apply-mission-events.mjs --dry-run docs/goals/sample-mission-events.json

This is not a public webhook and not live OpenClaw streaming yet. It is the backend/runtime write boundary that a future OpenClaw adapter can call after it receives task, progress, artifact, or checkpoint events.

Guardrails:

- Event IDs are idempotency keys; duplicate IDs are skipped.
- Goal, run, task, agent, and artifact references must exist after each event mutation.
- Public deploy/push remains separate from ingestion.
- Browser localStorage preview remains available when no backend event source is connected.
