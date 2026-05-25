# Meshy-107 Hand-Authored C-Shell Baseline Candidate

Date: 2026-05-20
Lane: Goal 6 - high-fidelity asteroid baseline
Spend: none
Decision: Passed local topology/runtime candidate gate; not high-fidelity final art.

## Gap Picked

Meshy-106 proved that source-guided generation still collapses the missing quadrant into a bowl/tube. This pass took the no-spend unblock path from state: hand-author the Meshy-105 topology into an actual Blender/GLB candidate where the C-shell aperture cannot close.

## Outputs

- Script: `scripts/create-meshy-107-hand-authored-cshell-baseline-v1.py`
- Blender source: `assets/blender/meshy-107-hand-authored-cshell-baseline-v1.blend`
- Runtime GLB: `assets/blender/meshy-107-hand-authored-cshell-baseline-v1.glb`
- Metrics: `docs/visual-reviews/2026-05-20-meshy-107-hand-authored-cshell-baseline-v1.json`
- Board: `docs/visual-reviews/2026-05-20-meshy-107-hand-authored-cshell-baseline-board.png`
- Renders: `docs/visual-reviews/meshy-107-hand-authored-cshell-baseline-v1/`
- Runtime smoke: `docs/visual-reviews/2026-05-20-meshy-107-hand-authored-cshell-runtime-smoke.png`
- Proof viewer: `docs/visual-reviews/2026-05-20-meshy-107-hand-authored-cshell-runtime-proof.html`

## Inspection

- GLB is valid glTF 2.0.
- Exported from Blender as one material, 47 mesh nodes, 6,980 vertices, and 7,380 polygons.
- The Mission Control runtime now supports `?asteroid=107` as an optional candidate variant without replacing the protected Meshy-101 baseline.
- Local HTTP check returned 200 for `assets/blender/meshy-107-hand-authored-cshell-baseline-v1.glb`.

## Visual Gate

Passed as topology/runtime candidate.

The board shows the source failure pattern and the new candidate side by side. Meshy-107 keeps the top-view broken C-shell negative space open, preserves the missing quadrant, avoids a closed bowl/floor slab read, and contains no facility/building/machinery detail.

Caveat: this is not high-fidelity final art yet. It needs a dedicated fracture/detail/material pass and stronger in-scene framing before facility population starts.

## Decision

Use Meshy-107 as the current no-spend hand-authored baseline candidate for the next Goal 6 pass. Facility population remains blocked until this candidate receives a high-fidelity detail pass and final visual acceptance.
