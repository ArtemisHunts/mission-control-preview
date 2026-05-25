# Meshy 102-104 Failure Stack Decision - 2026-05-20

## Scope

Goal 6 only. This is a no-spend diagnostic proof pass after three sequential Meshy asteroid form attempts failed visual acceptance.

## Inputs

- Meshy-102: `102-thinwall-open-front-hollow-asteroid-v3`
- Meshy-103: `103-no-floor-thin-wall-hollow-asteroid-v1`
- Meshy-104: `104-asymmetric-broken-c-shell-asteroid-v1`

## Proof Artifacts

- Board: `docs/visual-reviews/2026-05-20-meshy-102-104-failure-stack-board.png`
- Summary JSON: `docs/visual-reviews/2026-05-20-meshy-102-104-failure-stack.json`
- Runtime guard screenshot: `docs/visual-reviews/2026-05-20-meshy-102-104-failure-stack-runtime-smoke.png`

## Pattern

The three candidates show a convergence problem:

- Meshy-102 preserved some asteroid silhouette, but kept thick wall mass and a smooth floor/slab read.
- Meshy-103 reduced the floor/slab problem, but collapsed into tube/ring symmetry with blocky walls.
- Meshy-104 reduced pure ring symmetry, but still lacked an unmistakable broken C-shell, kept occluded cavity volume, and retained a slab/floor read.

## Decision

Do **not** submit another blind prompt from the same prompt family.

The next paid Meshy pass should only happen after one of these unblocks exists:

- a topology-first reference/source image that explicitly shows the desired broken C-shell negative space, or
- an explicit re-scope away from chasing the asteroid shell through prompt-only generation.

Facility population remains blocked until a visually accepted asteroid baseline exists and then passes Blender normalization/export plus browser runtime proof.

## Runtime Guard

The protected clean Meshy-101 runtime baseline still loads while the 102-104 failure stack remains rejected:

- URL: `http://127.0.0.1:4193/?camera=detail`
- Runtime GLB: `assets/blender/meshy-101-open-front-clean-runtime-v1.glb?v=meshy101-clean-v1-rollback-20260519`
- GLB HTTP result: `200 OK`, `model/gltf-binary`, `6562104` bytes
- Screenshot: `docs/visual-reviews/2026-05-20-meshy-102-104-failure-stack-runtime-smoke.png`
- Pixel sanity: `1600x1000`, `5344` unique colors, `453` bright pixels, `2451` cyan pixels

## Verification

- Generated proof board from local Meshy thumbnails and Blender inspection renders.
- Vision QA confirmed board legibility and that the decision/failure reasons are readable.
- No paid Meshy task was launched in this pass.
- glTF inspect on Meshy-102, Meshy-103, and Meshy-104 source GLBs.
- Local Chrome runtime guard screenshot at `?camera=detail`.
- `node scripts/validate-mission-state.mjs`
- `node --check app.js`
- `git diff --check`
