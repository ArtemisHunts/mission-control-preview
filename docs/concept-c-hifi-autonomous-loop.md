# Concept C Hi-Fi Autonomous Loop

Status: configured 2026-04-28
Branch: `concept-c-hifi`
Stable live fallback: `main` at `4182445`

## Purpose
Run autonomous high-fidelity Concept C passes until the scene reaches gold-standard visual gate quality.

This loop replaces the old blockout mindset. It is not allowed to claim progress by adding more primitive boxes. Each pass must move toward final-form geometry, material richness, carved integration, lighting/depth, or asset-pipeline readiness.

## Runner
Start command:

```bash
./scripts/start-concept-c-hifi-loop.sh
```

The script launches the Ralph loop runner with:

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
The loop stops before an iteration if:

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
