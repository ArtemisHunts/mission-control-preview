# Meshy-105 Topology-First C-Shell Reference - 2026-05-20

## Scope

Goal 6 only. This is a no-spend topology/source-reference pass after Meshy-102, Meshy-103, and Meshy-104 showed repeated prompt-family failure modes.

This is **not** final asteroid art and does **not** accept the baseline. It is a controlled source/reference artifact for a future Meshy pass or re-scope decision.

## What Shipped

- Blender source: `assets/blender/meshy-105-broken-cshell-topology-reference-v1.blend`
- Runtime/reference GLB: `assets/blender/meshy-105-broken-cshell-topology-reference-v1.glb`
- Metrics JSON: `docs/visual-reviews/2026-05-20-meshy-105-topology-reference-v1.json`
- Proof board: `docs/visual-reviews/2026-05-20-meshy-105-topology-reference-board.png`
- Runtime guard screenshot: `docs/visual-reviews/2026-05-20-meshy-105-topology-reference-runtime-smoke.png`
- View renders:
  - `docs/visual-reviews/meshy-105-topology-reference-v1/2026-05-20-meshy-105-topology-reference-front.png`
  - `docs/visual-reviews/meshy-105-topology-reference-v1/2026-05-20-meshy-105-topology-reference-top.png`
  - `docs/visual-reviews/meshy-105-topology-reference-v1/2026-05-20-meshy-105-topology-reference-side.png`

## Topology Target

The reference encodes the missing structure Meshy kept failing to infer from prompt text:

- unmistakable broken C-shell negative space
- large missing quadrant/open mouth
- thin visible wall rim
- deep empty cavity without a smooth floor slab
- small facility fit proxies inside the cavity to prove usable volume

## Metrics

- Main shell mesh: `2,538` vertices, `2,536` polygons, `5,072` triangles
- Cavity marker: `722` vertices, `768` polygons, `1,440` triangles
- Facility fit proxies: three simple cube markers, `12` triangles each

## Decision

Pass as a topology-first reference artifact.

Do not treat this as the accepted asteroid baseline. The next paid Meshy pass may use this as source/reference guidance, or the lane can explicitly re-scope if prompt/source-guided generation still trends toward thick smooth shells.

Facility population remains blocked until a visually accepted asteroid baseline passes Blender normalization/export and browser runtime proof.

## QA Notes

Vision QA confirmed the board communicates the broken C-shell, missing quadrant, thin rim, deep cavity, and facility fit volume. Front view is darker than ideal, but the top and side views carry the topology clearly enough for this reference-source purpose.

## Runtime Guard

The protected clean Meshy-101 runtime baseline still loads while Meshy-105 remains a reference-only artifact:

- URL: `http://127.0.0.1:4194/?camera=detail`
- Runtime GLB: `assets/blender/meshy-101-open-front-clean-runtime-v1.glb?v=meshy101-clean-v1-rollback-20260519`
- GLB HTTP result: `200 OK`, `model/gltf-binary`, `6562104` bytes
- Screenshot: `docs/visual-reviews/2026-05-20-meshy-105-topology-reference-runtime-smoke.png`
- Pixel sanity: `1600x1000`, `5359` unique colors, `453` bright pixels, `2452` cyan pixels

## Verification

- `blender --background --factory-startup --python scripts/create-meshy-105-topology-reference-v1.py`
- `npx --yes @gltf-transform/cli inspect assets/blender/meshy-105-broken-cshell-topology-reference-v1.glb`
- proof board vision QA
- local Chrome runtime guard screenshot at `?camera=detail`
- `node scripts/validate-mission-state.mjs`
- `node --check app.js`
- `git diff --check`
