# Goal 6 Meshy Next-Form Browser Smoke - 2026-05-20

## Scope

Goal 6 only. This pass did not launch paid Meshy generation and did not change the active runtime GLB. It verifies that the existing protected Meshy-101 runtime proof path still loads while the next thin-wall hollow form submission path remains dry-run guarded.

## Proof

- Preview URL: `http://127.0.0.1:4177/?camera=detail`
- Runtime GLB request: `assets/blender/meshy-101-open-front-clean-runtime-v1.glb?v=meshy101-clean-v1-rollback-20260519`
- GLB HTTP result: `200 OK`, `model/gltf-binary`, `6562104` bytes
- Screenshot: `docs/visual-reviews/2026-05-20-goal-6-meshy-next-form-browser-smoke-detail.png`
- Screenshot size: `1600x1000`
- Pixel sanity: `36538` unique colors, `233084` bright pixels, `16135` cyan pixels
- Visual check: nonblank 3D asteroid/facility scene; no obvious blocking render failure visible.

## Guardrail

The next candidate remains unsubmitted. The local dry run for `scripts/submit-meshy-101-thinwall-hollow-v3.py` wrote only the create spec and produced no Meshy task response, task JSON, or paid GLB output.

## Decision

Pass as a runtime-health/proof-path check. This does not accept the final asteroid baseline and does not unblock facility population. The next 3D step is the explicit Meshy `--submit` pass under the approved lane, followed by visual acceptance before Blender normalization/export.
