# Meshy-108 Maintenance Drone Optimization Proxy

## Goal 6 Gap

Gate or optimize the next Meshy-108 support/detail candidate before placement, using the remaining runtime headroom after the support duct density audit.

## Result

- Selected next support candidate: assets/meshy/api/12-maintenance-drone.meshy.glb.
- Source size: 21.654 MB; direct scene projection 89.265 MB / 96 MB, leaving 6.735 MB.
- Optimized proxy: assets/blender/meshy-108-maintenance-drone-optimization-proxy.glb at 0.394 MB, leaving 27.994 MB after placement projection.
- Byte reduction: 98.18%.
- Meshy spend: none.
- Accepted asteroid baseline source: untouched.

## Decision

Passed. Do not place the full 22.7 MB source drone directly; place the optimized proxy first and prove contact/clearance.

## Proof Artifacts

- Build script: scripts/create-meshy-108-maintenance-drone-optimization-proxy.py
- Blender source: assets/blender/meshy-108-maintenance-drone-optimization-proxy.blend
- Runtime GLB: assets/blender/meshy-108-maintenance-drone-optimization-proxy.glb
- Metrics: docs/visual-reviews/2026-05-21-meshy-108-maintenance-drone-optimization-proxy.json
- Proof board: docs/visual-reviews/2026-05-21-meshy-108-maintenance-drone-optimization-proxy-board.png
- Browser viewer: docs/visual-reviews/2026-05-21-meshy-108-maintenance-drone-optimization-proxy-viewer.html
- Browser smoke screenshot: docs/visual-reviews/2026-05-21-meshy-108-maintenance-drone-optimization-proxy-browser-smoke.png
- Render set: docs/visual-reviews/meshy-108-maintenance-drone-optimization-proxy/

## Verification

- Blender imported the source maintenance drone for measurement, removed it, authored a low-cost proxy, rendered proof views, and exported a standalone proxy GLB.
- GLB header/JSON inspection passed for source and proxy GLBs.
- Visual proof board QA and browser GLB fetch/parse smoke are required before final report.
