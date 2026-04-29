# Concept C Hi-Fi Autonomous Loop

Status: configured 2026-04-28
Branch: `concept-c-hifi`
Stable live fallback: `main` at `4182445`

## Purpose
Run autonomous high-fidelity Concept C passes until the scene reaches gold-standard visual gate quality.

This loop replaces the old blockout mindset. It is not allowed to claim progress by adding more primitive boxes. Each pass must move toward final-form geometry, material richness, carved integration, lighting/depth, or asset-pipeline readiness.

## Active runner
OpenClaw cron job installed:

- job id: `9bebbbea-c9cf-4120-8278-cfa223080468`
- name: `concept-c-hifi-gold-loop`
- cadence: every 30 minutes
- session: isolated
- model: `openai-codex/gpt-5.4`
- thinking: high
- timeout: 1800s
- Discord announce target: `channel:1477048876669075578`

Manual controls:

```bash
openclaw cron show 9bebbbea-c9cf-4120-8278-cfa223080468 --json
openclaw cron run 9bebbbea-c9cf-4120-8278-cfa223080468
openclaw cron disable 9bebbbea-c9cf-4120-8278-cfa223080468
```

Reinstall command lives at:

```bash
./scripts/install-concept-c-hifi-cron.sh
```

## Local Ralph runner fallback
`./scripts/start-concept-c-hifi-loop.sh` exists as a local Ralph/Claude-CLI runner, but it is not the active loop right now. Claude CLI returned: `Your organization does not have access to Claude.` Use the OpenClaw cron job above as the active autonomous loop.

The local fallback is configured with:

- prompt: `docs/loops/concept-c-hifi-loop-prompt.md`
- done signal: `HIFI_GOLD_STANDARD`
- max iterations: `24`
- per-iteration timeout: `900s`
- delay: `20s`
- state: `/tmp/concept-c-hifi-loop-state.json`
- safety check: `node scripts/hifi-loop-check.mjs`

Runtime files:

- pid: `logs/concept-c-hifi-loop.pid`
- logs: `logs/concept-c-hifi-loop-*.log`

`logs/` is ignored by git.

## Safety rules
For the active OpenClaw cron loop, the prompt itself enforces branch/deploy rules. For the local Ralph fallback, the loop stops before an iteration if:

- `.hifi-loop-stop` exists
- current branch is not `concept-c-hifi`
- working tree is dirty before the iteration starts

The loop must not:

- touch `main`
- deploy live
- edit bootstrap workspace files
- commit without screenshot/gate evidence or a real blocker note
- post placeholder updates

## Gold-standard completion
The loop should only write the done signal when a visual gate reaches:

- average >= 4.5/5
- no category below 4.0/5
- categories include concept match, asteroid shell fidelity, material richness, carved integration, command shaft depth, production/facility fidelity, lighting/depth, and readiness/performance

## Current priority ladder
1. HIFI-02 secondary asteroid breakup
2. HIFI-03 carved integration kit
3. HIFI-04 command shaft depth
4. HIFI-05 production bay replacement
5. HIFI-06 material/post pass

Main/live remains stable until Michael explicitly asks to ship the hi-fi branch.


## Poly-density correction
Michael called out after HIFI-03 that the work still looks very low-poly. This is now a loop-level correction, not a minor note.

The next autonomous pass should prioritize actual geometry density before more composition/detail labels:

1. create subdivided/displaced asteroid surface generation
2. increase vertex/face count enough to kill the folded-paper low-poly read
3. add multi-scale cracks/chips/rubble as real geometry or dense procedural detail
4. upgrade command-shaft rings/cables/bridges with real segment counts
5. stop accepting broad 8–16 point prisms as hi-fi assets

Do not re-enable the loop after maintenance unless this correction remains in the active prompt.


## Asteroid-only correction
Michael explicitly redirected the loop: do not focus on interior elements yet. The current job is to create an ultra high-fidelity asteroid foundation that future interior work can sit inside.

Until the asteroid shell itself passes gate, the autonomous loop should ignore command shaft, production bay, collars, conduits, room props, and UI. The next work must be asteroid-only:

1. high-density asteroid mesh generation
2. surface hierarchy: macro mass, medium fractures, micro chips/craters/rubble
3. carved cut-face bevels/rims/strata
4. rock material/value richness and asteroid-specific lighting
5. asteroid-focused screenshot gate

Interior work resumes only after the asteroid-focused gate reaches avg >= 4.5/5 with no asteroid category below 4.0.
