# Meshy-108 Heavy Hero Command Spine

## Goal 6 Gap

Place exactly one heavy hero-scale promoted local Meshy facility asset on the accepted Meshy-108 facility scene, without spending Meshy credits or editing the accepted asteroid baseline source.

## Result

- Selected asset: `assets/meshy/api/02-command-control-spine.meshy.glb`
- Role: command
- Source size: 28,959,068 bytes
- Output scene: `assets/blender/meshy-108-heavy-hero-command-spine.blend`
- Runtime GLB: `assets/blender/meshy-108-heavy-hero-command-spine.glb`
- Runtime GLB inspection: valid glTF 2.0, 50,651,016 bytes, 285 meshes, 20 materials, 2 textures
- Contact audit: accepted, vertical gap `+0.0000`, XY overlap ratio `1.0`
- Meshy spend: none

## Proof Artifacts

- Build script: `scripts/create-meshy-108-heavy-hero-command-spine.py`
- Metrics: `docs/visual-reviews/2026-05-21-meshy-108-heavy-hero-command-spine.json`
- Proof board: `docs/visual-reviews/2026-05-21-meshy-108-heavy-hero-command-spine-board.png`
- Browser viewer: `docs/visual-reviews/2026-05-21-meshy-108-heavy-hero-command-spine-viewer.html`
- Browser smoke screenshot: `docs/visual-reviews/2026-05-21-meshy-108-heavy-hero-command-spine-browser-smoke.png`
- Render set: `docs/visual-reviews/meshy-108-heavy-hero-command-spine/`

## Verification

- Blender imported the promoted heavy command asset, authored contact pad/labels, rendered four proof views, and exported the hero GLB.
- GLB header/JSON inspection passed for the exported 50.7 MB runtime artifact.
- Visual proof board QA passed: exactly one heavy promoted command asset, open C-shell mouth clear, accepted contact, and no Meshy spend.
- Browser smoke passed: local viewer and GLB both returned HTTP 200, the GLB parsed in-browser, and the screenshot rendered nonblank with the correct proof labels.

## Decision

Passed. The command spine is accepted as the first heavy hero-scale facility placement on Meshy-108. Next Goal 6 step: gate any heavier production/power hero asset by runtime cost and visual value before placing another >35 MB prop.
