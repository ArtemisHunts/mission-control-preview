# Meshy-103 No-Floor Preview Proof - 2026-05-20

## Scope

Goal 6 only. This pass resolved the existing Meshy-103 pending task; it did not start a new paid Meshy task. The purpose was to test whether a targeted no-floor prompt could fix Meshy-102's smooth interior slab/floor failure.

## Meshy Task

- Task id: `019e4481-7623-77e2-844d-ce0c79190abd`
- Status: `SUCCEEDED`
- Consumed credits: `20`
- Source GLB: `assets/meshy/api/103-no-floor-thin-wall-hollow-asteroid-v1.meshy.glb`
- Thumbnail: `assets/meshy/api/103-no-floor-thin-wall-hollow-asteroid-v1.thumbnail.png`
- Task JSON: `assets/meshy/api/103-no-floor-thin-wall-hollow-asteroid-v1.task.json`

## Blender/glTF Inspection

- Inspection script: `scripts/render-meshy-102-thinwall-preview-proof.py`
- Inspection blend: `assets/blender/meshy-103-no-floor-preview-inspection.blend`
- Render proof: `docs/visual-reviews/2026-05-20-meshy-103-no-floor-preview-proof.png`
- Metrics JSON: `docs/visual-reviews/2026-05-20-meshy-103-no-floor-preview-proof.json`
- Source size: `26,499,740` bytes
- Imported mesh: `1` mesh object, `736,081` vertices, `1,472,166` triangles
- Imported bounds: `1.8984 x 1.8326 x 1.8566`

## Visual Verdict

Decision: **failed visual acceptance**.

Reasons:

- The open-front hollow read is present, and the prior pale smooth floor/slab problem is reduced.
- The form now reads too much like a regular circular tube/ring instead of a natural fractured asteroid shell.
- Wall thickness is still too bulky and blocky for the thin-wall acceptance bar.
- Interior depth is present but feels partially occluded by chunky slabbed geometry rather than a clean irregular empty cavity.
- Geological breakup is visible, but it reads panel-like/tiled rather than naturally stratified rock.

## Next Gate

Do not move Meshy-103 into normalization/export as the accepted baseline and do not populate facility assets from it. The next form pass should avoid tube/ring symmetry, explicitly request an asymmetrical broken C-shaped shell, and keep the no-floor constraint.

## Runtime Smoke

The protected clean Meshy-101 runtime baseline still loads while Meshy-103 remains rejected:

- URL: `http://127.0.0.1:4177/?camera=detail`
- Runtime GLB: `assets/blender/meshy-101-open-front-clean-runtime-v1.glb?v=meshy101-clean-v1-rollback-20260519`
- GLB HTTP result: `200 OK`, `model/gltf-binary`, `6562104` bytes
- Screenshot: `docs/visual-reviews/2026-05-20-meshy-103-resolved-runtime-smoke-detail.png`
- Pixel sanity: `1600x1000`, `33909` unique colors, `238452` bright pixels, `17377` cyan pixels
