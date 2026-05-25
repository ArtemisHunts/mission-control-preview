# Meshy-106 Source-Guided Broken C-Shell Pack

Date: 2026-05-20
Lane: Goal 6 - high-fidelity asteroid baseline
Status: Source-guided input pack ready; no paid Meshy submission in this pass.

## Gap Picked

Meshy-102, Meshy-103, and Meshy-104 established that prompt-only asteroid passes keep drifting into thick rings, slab floors, or occluded interiors. Meshy-105 supplied a topology-first C-shell reference, but the next paid pass still needed clean image inputs and a guarded submit path.

## Artifact

This pass generated clean source images from the Meshy-105 Blender reference with labels, facility markers, cavity markers, and proxy geometry hidden before render:

- Front: `docs/reference/meshy-106-source-guided-cshell-v1/meshy-106-source-guided-cshell-front.png`
- Top: `docs/reference/meshy-106-source-guided-cshell-v1/meshy-106-source-guided-cshell-top.png`
- Side: `docs/reference/meshy-106-source-guided-cshell-v1/meshy-106-source-guided-cshell-side.png`
- Manifest: `docs/visual-reviews/2026-05-20-meshy-106-source-guided-pack-v1.json`
- Proof board: `docs/visual-reviews/2026-05-20-meshy-106-source-guided-pack-board.png`
- Guarded dry-run spec: `assets/meshy/api/106-source-guided-broken-cshell-asteroid-v1.create-spec.json`
- Runtime smoke: `docs/visual-reviews/2026-05-20-meshy-106-source-guided-pack-runtime-smoke.png`

## Submission Guard

`scripts/submit-meshy-106-source-guided-cshell-v1.py` defaults to dry-run. It writes a redacted `multi-image-to-3d` create spec and only submits if explicitly run with `--submit`. It also supports `--task-id` for polling/downloading an already-created task without duplicate spend.

The prompt constraints are intentionally narrow: preserve the broken C-shaped negative space, large missing quadrant, thin torn rim, and empty no-floor cavity; natural fractured asteroid rock only; no buildings or machinery; symmetry off.

## Verification

- Blender source pack generation completed from `assets/blender/meshy-105-broken-cshell-topology-reference-v1.blend`.
- Dry-run submitter wrote the redacted create spec without contacting Meshy.
- Python compile passed for both Meshy-106 scripts.
- Visual QA passed: top view clearly carries the broken C-shell read; front/side support rocky mass and remain free of facility/building/machinery detail.
- Browser runtime smoke loaded the protected Meshy-101 clean GLB at `?camera=detail`; screenshot was nonblank at 1600x1000.

## Decision

Meshy-106 is ready as the next source-guided Meshy input pack, but it is not an accepted asteroid baseline. Facility asset population remains blocked until a submitted source-guided candidate passes visual acceptance and then Blender normalization/export plus runtime proof.
