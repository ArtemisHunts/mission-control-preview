# Meshy-102 Thin-Wall Preview Proof - 2026-05-20

## Scope

Goal 6 only. This pass used the approved Meshy spend lane to generate one next-form asteroid candidate from the guarded thin-wall hollow prompt. It does not accept the final asteroid baseline and does not unblock facility population.

## Meshy Task

- Submit script: `scripts/submit-meshy-101-thinwall-hollow-v3.py --submit`
- Task id: `019e442e-be27-7c3a-acce-874c957f8727`
- Status: `SUCCEEDED`
- Consumed credits: `20`
- Source GLB: `assets/meshy/api/102-thinwall-open-front-hollow-asteroid-v3.meshy.glb`
- Thumbnail: `assets/meshy/api/102-thinwall-open-front-hollow-asteroid-v3.thumbnail.png`
- Task JSON: `assets/meshy/api/102-thinwall-open-front-hollow-asteroid-v3.task.json`

## Blender/glTF Inspection

- Inspection script: `scripts/render-meshy-102-thinwall-preview-proof.py`
- Inspection blend: `assets/blender/meshy-102-thinwall-preview-inspection.blend`
- Render proof: `docs/visual-reviews/2026-05-20-meshy-102-thinwall-preview-proof.png`
- Metrics JSON: `docs/visual-reviews/2026-05-20-meshy-102-thinwall-preview-proof.json`
- Source size: `16,582,568` bytes
- Imported mesh: `1` mesh object, `460,604` vertices, `921,212` triangles
- Imported bounds: `1.8088 x 1.8976 x 1.1658`

## Visual Verdict

Decision: **failed visual acceptance**.

Reasons:

- The macro asteroid silhouette is usable, and the open-front/cutaway idea is partially present.
- The shell walls still read too thick and bulky in several places.
- The interior cavity has depth, but a dominant smooth pale surface reads like a floor/slab rather than fractured geology.
- Fractured geological layering is weaker than the acceptance bar requires.
- The candidate still carries too much slab/boolean-floor artifacting to justify Blender normalization/export as the final baseline.

## Next Gate

Do not populate facility assets from this candidate. Either prompt/refine another Meshy thin-wall hollow pass or run a targeted Meshy retry that specifically suppresses smooth interior floor slabs and emphasizes broken layered rock walls.
