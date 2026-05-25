# Meshy-106 Source-Guided Candidate Inspection

Date: 2026-05-20
Lane: Goal 6 - high-fidelity asteroid baseline
Task: `019e46c1-ee99-7611-9171-8f83fa18395c`
Spend: 20 Meshy credits; balance moved from 1137 to 1117.
Decision: Failed visual acceptance. Not an accepted asteroid baseline.

## Gap Picked

The previous Goal 6 pass produced a clean source-guided input pack for Meshy-106. This pass used the recorded approved Meshy lane to submit exactly that pack, then inspected the resulting GLB in Blender before deciding whether it could become the asteroid baseline.

## Outputs

- Meshy task JSON / create response / GLB / thumbnail: `assets/meshy/api/106-source-guided-broken-cshell-asteroid-v1.*`
- Blender inspection source: `assets/blender/meshy-106-source-guided-cshell-candidate-v1.blend`
- Normalized inspection GLB: `assets/blender/meshy-106-source-guided-cshell-candidate-v1.glb`
- Inspection script: `scripts/inspect-meshy-106-source-guided-candidate-v1.py`
- Metrics: `docs/visual-reviews/2026-05-20-meshy-106-source-guided-candidate-v1.json`
- Board: `docs/visual-reviews/2026-05-20-meshy-106-source-guided-candidate-board.png`
- Runtime smoke: `docs/visual-reviews/2026-05-20-meshy-106-source-guided-candidate-runtime-smoke.png`
- Blender renders: `docs/visual-reviews/meshy-106-source-guided-cshell-candidate-v1/`

## Inspection Facts

- GLB header valid: glTF 2.0.
- Raw imported mesh: 1 mesh, 19,739 vertices, 28,668 polygons.
- Blender normalized/exported GLB completed.
- Browser HTTP check returned 200 for the normalized candidate GLB.

## Visual Acceptance

Failed.

The source-guided top view encoded the desired broken C-shell, but the generated mesh collapsed back into a mostly closed circular bowl/tube. It lacks the unmistakable missing quadrant/open mouth, reads as a thick vessel-like rim, and the interior reads more like a deep cylindrical tunnel than a natural no-floor broken cavity.

What did pass: the asset stays asteroid/rock-only and does not introduce buildings or machinery.

## Decision

Reject Meshy-106 as the high-fidelity asteroid baseline. Do not populate facility assets yet. The next Goal 6 pass should either run a stronger source-guided retry that makes the top-view missing quadrant unavoidable, or convert the Meshy-105 Blender topology reference into a hand-authored asteroid shell instead of asking Meshy to infer the aperture.
