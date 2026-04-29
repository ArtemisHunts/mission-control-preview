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



## Efficient high-resolution asset doctrine — added 2026-04-29
Michael wants the highest efficient quality we can produce: high-resolution/high-poly where it matters, but not wasteful polygon soup.

Rules for future passes:
- Spend polygons on silhouette, carved cut rims, asteroid crags, central pit rings, hangar/tunnel frames, and deck edges that affect the thumbnail read.
- Do not spend polygons on invisible backsides, flat filler panels, tiny lights, or distant props that can stay simple/instanced.
- Prefer a few dense, named, editable `BufferGeometry` asset systems over hundreds of random primitive shards.
- Keep macro/mid/micro systems separable so quality can be dialed later: asteroid body, cut rim, interior decks, pit, hangar, scatter lights.
- Every high-poly asset needs a reason: silhouette fidelity, material relief, scale readability, or future tweakability.
- Track quality as efficient visual density, not raw vertex count.
- Use procedural high-res meshes as browser-native GLB stand-ins until we have an external DCC/asset pipeline available.

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


## Zoom and ceiling correction
Michael said the screenshots were too full-scale compared with his closer view, asked what resolution they were, and requested zoom in/out plus the tallest/highest-resolution asteroid Artemis can build.

Current screenshot proof uses 1600x900 for older 04A/04B captures and 3840x2160 for HIFI-05 full-frame proof. Future asteroid passes may touch camera/view controls even while other UI/HUD work remains paused.

The active asteroid target now includes:
- Full/Wide/Detail/Ceiling camera presets
- mouse/keyboard zoom behavior
- taller asteroid ceiling volume
- max practical geometry/detail density while keeping the browser stable


## Reference lock correction — actual target image clarified 2026-04-29
Michael clarified that the active reference is the replied Discord image `1498762634772615373`, now saved as `docs/reference/concept-c-asteroid-cavern-target.png`. The previous oval/portal-style target is archived at `docs/reference/archive/concept-c-asteroid-cavern-target-previous-wrong.png`.

This supersedes the recent oval-portal optimization. Future Concept C hi-fi work must optimize for the actual reference:

1. full asteroid body floating in starfield, not a foreground portal/window
2. large irregular front cutaway exposing the base interior
3. thick grey rocky shell with authored crags, bright top/right rim planes, and dark underside mass
4. layered industrial decks carved into the asteroid
5. central lower circular pit/shaft with ring levels and small blue/cyan lights
6. rear/upper hangar or tunnel opening slightly right of center with cold exterior light
7. cranes, gantries, ramps, platforms, containers, warm work lights, and tiny scale lights
8. thumbnail read: complete asteroid cutaway base first, facility detail second

A pass fails if it preserves a clean perfect oval aperture/ring as the dominant composition. Stop decorating the oval. Rebuild the asteroid body/cutaway silhouette.
