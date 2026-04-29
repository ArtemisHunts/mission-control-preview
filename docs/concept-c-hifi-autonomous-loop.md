# Concept C Hi-Fi Autonomous Loop

Status: configured 2026-04-28; prompt migrated to outcome-first style on 2026-04-29.
Branch: `concept-c-hifi`
Stable live fallback: `main`

## Purpose
Run high-fidelity Concept C passes until the scene reaches gold-standard reference-match quality.

The loop is now outcome-driven, not step-script-driven. It should choose the smallest coherent pass that visibly improves the corrected reference match, capture proof, score it honestly, and stop.

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

Reinstall command:

```bash
./scripts/install-concept-c-hifi-cron.sh
```

## Canonical prompt
The active prompt lives at:

```bash
docs/loops/concept-c-hifi-loop-prompt.md
```

That file is the source of truth for current target, success criteria, failure modes, evidence budget, and commit rules.

## Current target outcome
Use the corrected reference:

```bash
docs/reference/concept-c-asteroid-cavern-target.png
```

Thumbnail read must be:

> A full asteroid body floating in space, carved open into a large operations cavern where the viewer can see deep into the facility all the way toward the rear hangar/tunnel.

Not acceptable:
- oval portal/window
- sliced tube/capsule
- black slab hiding the interior
- noisy/fuzzy procedural texture artifact
- cramped operations space
- thin cardboard shell
- random primitive/detail clutter without macro improvement

## Current post-HIFI-18 problem statement
HIFI-18 created more operations volume, but overcorrected into thin/planar slices. The next useful passes should preserve the large opening while restoring believable asteroid mass and material quality:

- large open cavern volume for operations
- heavy lumpy irregular asteroid exterior around the cutaway
- thin-but-believable eroded walls/rim
- deep rear hangar/tunnel visibility
- tiered operations floors, bridges, cranes, pit, and practical lights
- sharper grey fractured asteroid rock, not fuzzy/pink procedural noise

## Efficient high-resolution asset doctrine
Michael wants the highest efficient quality possible: high-poly where it matters, not polygon soup.

Spend geometry on:
- outer silhouette
- cut rim/wall thickness
- broad rock plates/fractures/craters
- central pit rings
- rear hangar/tunnel frame
- large deck/bridge/crane silhouettes

Keep cheap/simple:
- repeated tiny lights
- distant details
- invisible backsides
- flat filler panels

Prefer dense, named, editable `BufferGeometry` modules over hundreds of random primitive shards.

## Evidence / stopping rules
Each pass should:
1. Choose one coherent thesis.
2. Implement only enough to test that thesis.
3. Run `node --check --input-type=module < app.js` and `git diff --check`.
4. Capture screenshot proof when possible.
5. Write/update a visual review with scores and a blunt next fix.
6. Commit and push to `origin/concept-c-hifi` only with evidence or a real blocker note.

Stop when the pass can be judged. Do not keep adding details to make the diff feel larger.

## Safety rules
- Required branch: `concept-c-hifi`.
- Do not touch `main` or deploy live unless Michael explicitly asks in a fresh message.
- Do not edit bootstrap files: `MEMORY.md`, `DREAMS.md`, `SOUL.md`, `TOOLS.md`, `AGENTS.md`.
- Do not report placeholder progress.
- If a pass worsens the scene, revert or document honestly.

## Gold-standard completion
Only write `HIFI_GOLD_STANDARD` if:
- average visual gate >= 4.5/5
- no category below 4.0/5
- screenshot reads as the corrected reference at thumbnail scale
- scene is browser-stable and tweakable

## Local Ralph runner fallback
`./scripts/start-concept-c-hifi-loop.sh` exists as a local Ralph/Claude-CLI runner, but it is not the active loop right now. Claude CLI previously returned: `Your organization does not have access to Claude.` Use the OpenClaw cron job as the active autonomous loop.

Runtime files:
- pid: `logs/concept-c-hifi-loop.pid`
- logs: `logs/concept-c-hifi-loop-*.log`

`logs/` is ignored by git.
