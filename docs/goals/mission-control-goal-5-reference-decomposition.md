# Goal 5 Reference-Match Decomposition

Date: 2026-05-20 05:51 UTC
Lane: Goal 5 holo-table / overlay / command-table UI

## Why This Exists

Michael's correction is the source of truth: the current overlay is a functional/state-backed scaffold, not reference-dashboard product quality. Future Goal 5 passes need explicit reference zones and acceptance checks before claiming meaningful reference-match progress.

## Current Verdict

Functional scaffold; reference match needs zone-by-zone iteration.

## Reference Zones

1. Central command table
   - Target: the table is the first-read product object, with surrounding data radiating from it.
   - Current read: present as a central holo-table with rings, proof corridor, and drill-downs.
   - Gap: needs stronger table silhouette and less rectangular dashboard-card reading.
   - Status: partial-match.

2. Peripheral ops bands
   - Target: execution, review, telemetry, and evidence orbit the table in dense instrument bands.
   - Current read: left/right/bottom bands exist and are state-backed.
   - Gap: band hierarchy still reads flatter than the reference dashboard.
   - Status: partial-match.

3. Reference visual motifs
   - Target: layered holographic depth, fine-line instrumentation, and command-room contrast without hiding data.
   - Current read: improved contrast and depth are present.
   - Gap: needs more precise motif extraction and side-by-side visual proof.
   - Status: needs-iteration.

4. Operational density
   - Target: one overview should expose goals, tasks, agents, reviews, telemetry, artifacts, and events.
   - Current read: density target is mostly present and state-backed.
   - Gap: needs tighter hierarchy so density feels authored, not accumulated.
   - Status: partial-match.

5. Responsive product proof
   - Target: desktop and mobile overlay proofs must be readable, non-overlapping, and comparable to criteria.
   - Current read: browser screenshots and DOM smoke exist for recent passes.
   - Gap: needs side-by-side proof against this matrix after each visual pass.
   - Status: partial-match.

## Acceptance Checks

- Every future Goal 5 visual claim maps to at least one reference zone.
- Screenshots must show the central command table before secondary panels.
- Proof notes must call out partial/failed zones instead of marking the overlay complete by default.

## Implementation Note

This matrix is now canonical state under `referenceMatch.goal5` and is rendered in the overlay-only command table at `?overlay=1&console=overview`.
