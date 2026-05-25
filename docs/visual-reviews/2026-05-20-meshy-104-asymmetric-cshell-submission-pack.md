# Meshy-104 Asymmetric C-Shell Submission Pack - 2026-05-20

## Scope

Goal 6 only. No paid Meshy generation was launched in this pass.

This pack converts the Meshy-102 and Meshy-103 visual failures into a stricter next Meshy prompt/spec. It is a ready-to-submit no-spend prep artifact, not a new candidate and not baseline acceptance.

## Failure Inputs

- Meshy-102 failed because the hollow shell still had thick walls and a dominant smooth interior floor/slab.
- Meshy-103 reduced the floor/slab read, but failed because the asset became a regular tube/ring with thick blocky walls and panel-like geology.

## What Shipped

- Guarded submit script: scripts/submit-meshy-104-asymmetric-cshell-v1.py
- Dry-run create spec: assets/meshy/api/104-asymmetric-broken-c-shell-asteroid-v1.create-spec.json
- Runtime guard screenshot: docs/visual-reviews/2026-05-20-meshy-104-runtime-guard-smoke.png

## Prompt Delta

The new prompt explicitly targets the last failure mode:

- Request an asymmetrical broken C-shaped asteroid mass with a large missing front-left quadrant.
- Preserve no-floor/no-slab constraints from Meshy-103.
- Ban circular tube, ring, tunnel, donut, and symmetrical bowl reads.
- Push thin torn basalt walls, off-axis cavern, uneven fractured rim, and jagged layered geology.
- The submit script prompt is kept under Meshy's 800-character API limit.

## Guardrail

The script is dry-run by default. It writes the spec and exits without API submission or credit spend.

Actual submission requires:

    cd ~/clawd/mission-control-preview
    source ~/.config/meshy/api.env
    python3 scripts/submit-meshy-104-asymmetric-cshell-v1.py --submit

## Decision

Pass as no-spend execution prep. Facility population remains blocked until a visually viable Meshy candidate exists, then Blender normalization/export and browser proof can run.

The protected clean Meshy-101 runtime baseline was smoke-tested after the pack landed:

- URL: http://127.0.0.1:4191/?camera=detail
- Runtime GLB: assets/blender/meshy-101-open-front-clean-runtime-v1.glb?v=meshy101-clean-v1-rollback-20260519
- GLB HTTP result: 200 OK, model/gltf-binary, 6562104 bytes
- Screenshot: docs/visual-reviews/2026-05-20-meshy-104-runtime-guard-smoke.png
- Pixel sanity: 1600x1000, 5339 unique colors, 453 bright pixels, 2452 cyan pixels

## Verification

- python3 scripts/submit-meshy-104-asymmetric-cshell-v1.py
- python3 -m py_compile scripts/submit-meshy-104-asymmetric-cshell-v1.py
- local Chrome runtime guard screenshot at ?camera=detail
- node scripts/validate-mission-state.mjs
- node --check app.js
- git diff --check
