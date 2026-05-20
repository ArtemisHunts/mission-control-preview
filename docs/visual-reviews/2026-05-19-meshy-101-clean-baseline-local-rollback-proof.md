# Meshy-101 Clean Baseline Local Rollback Proof - 2026-05-19

## Gap Selected

The active state and live rollback direction said the rejected Meshy-101 hollow v2 preview should no longer be the runtime baseline, but the local preview still referenced the hollow v2 GLB. This loop fixed that source-of-truth drift.

## Change

- Local app.js now loads `assets/blender/meshy-101-open-front-clean-runtime-v1.glb?v=meshy101-clean-v1-rollback-20260519`.
- Local app.js no longer references `assets/blender/meshy-101-open-front-hollow-runtime-v2.optimized.glb?v=meshy101-hollow-v2-20260519`.
- This is a rollback/proof alignment only. It does not accept the asteroid baseline and does not unblock facility population.

## Proof

- Screenshot: `docs/visual-reviews/2026-05-19-meshy-101-clean-baseline-local-rollback-proof.png`
- Smoke JSON: `docs/visual-reviews/2026-05-19-meshy-101-clean-baseline-local-rollback-proof.json`
- Local server/browser smoke requested the clean runtime GLB and returned HTTP 200 with `Content-type: model/gltf-binary`.

## Decision

Pass. Local runtime state is aligned with the clean Meshy-101 rollback. The next 3D gap is a Meshy-first thin-wall hollow form iteration; Blender should be used after a visually viable form exists for normalization, cleanup, export, and proof.
