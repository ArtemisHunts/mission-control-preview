# Mission Control Goals

This directory contains the active goal campaign for Mission Control v1.

- `mission-control-v1-codex-campaign.md` — overarching Codex-runtime campaign and sequential sub-goals.
- `mission-control-current-state-audit.md` — current repo/product audit for Goal 0.
- `mission-control-event-ingestion.md` — durable local backend/runtime event ingestion boundary.
- `mission-control-live-event-bridge.md` — local filesystem inbox bridge for live event files.

Runtime policy: Codex GPT-5.5 in this OpenClaw channel is the active execution runtime for now. The external Codex CLI can become a child adapter after auth is configured, but it is not blocking channel execution.

## Goal Contract Standard

Each Mission Control sub-goal should stay bigger than one prompt but smaller than an open-ended backlog. Before implementation, record:

- one objective
- one stopping condition
- files/docs/state that must be read first
- constraints and non-goals
- verification commands or proof artifacts
- checkpoint reporting format: current checkpoint, verified work, remaining work, blocker status
- pause/stop rules for blockers, external actions, or direction changes

If status updates become vague, tighten the next checkpoint and its proof instead of adding unrelated work.
