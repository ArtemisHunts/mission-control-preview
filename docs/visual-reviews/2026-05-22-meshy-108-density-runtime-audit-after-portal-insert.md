# Meshy-108 Density/Runtime Audit After Portal Insert

## Goal 6 Gap

Audit the Meshy-108 facility density/runtime balance after optimized portal-adjacent control insert placement before adding another asset.

## Result

- Runtime source scene: assets/blender/meshy-108-portal-adjacent-control-insert-placement-contact-proof.glb at 70.769 MB / 96 MB.
- Audit GLB: assets/blender/meshy-108-density-runtime-audit-after-portal-insert.glb at 71.53 MB.
- Runtime headroom: 25.231 MB remaining; next-increment guard pass: True.
- Portal insert contact remains accepted-contact-range with gap +0.0000 and XY overlap 1.00.
- Command hero, production gantry, support duct, portal-adjacent control insert, and open-mouth clearance remain marked.
- Meshy spend: none.
- Accepted asteroid baseline source: untouched.

## Decision

Passed. Density and runtime remain acceptable with caution; gate the next facility support candidate before placement.

## Proof Artifacts

- Build script: scripts/audit-meshy-108-density-runtime-after-portal-insert.py
- Blender source: assets/blender/meshy-108-density-runtime-audit-after-portal-insert.blend
- Runtime GLB: assets/blender/meshy-108-density-runtime-audit-after-portal-insert.glb
- Metrics: docs/visual-reviews/2026-05-22-meshy-108-density-runtime-audit-after-portal-insert.json
- Proof board: docs/visual-reviews/2026-05-22-meshy-108-density-runtime-audit-after-portal-insert-board.png
- Browser viewer: docs/visual-reviews/2026-05-22-meshy-108-density-runtime-audit-after-portal-insert-viewer.html
- Browser smoke screenshot: docs/visual-reviews/2026-05-22-meshy-108-density-runtime-audit-after-portal-insert-browser-smoke.png
- Render set: docs/visual-reviews/meshy-108-density-runtime-audit-after-portal-insert/

## Verification

- Blender opened the portal-adjacent control insert placement scene, added audit-only markers, rendered proof views, and exported an audit GLB.
- GLB header/JSON inspection passed for runtime source scene and audit GLB.
- Visual proof board QA and browser GLB fetch/parse smoke are required before final report.
