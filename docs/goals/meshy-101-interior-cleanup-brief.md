# Meshy-101 Interior Cleanup Brief

_Prepared: 2026-05-19_

## Why this pass exists

The current Meshy-101 hollow v2 candidate is already browser-runtime proven, but it still fails final baseline acceptance because the interior cut surfaces read too flat, too blocky, and too boolean-heavy once the asteroid is seen at Mission Control scene scale.

This pass is the next gate before baseline lock.

## Input artifacts

- Source GLB: `assets/meshy/api/101-open-front-hollow-asteroid-baseline-v2.meshy.glb`
- Current runtime candidate: `assets/blender/meshy-101-open-front-hollow-runtime-v2.optimized.glb`
- Cleanup/export proof: `docs/visual-reviews/2026-05-19-meshy-101-open-front-cleanup-proof-v1.md`
- Browser runtime proof: `docs/visual-reviews/2026-05-19-meshy-101-runtime-browser-proof.md`

## Exact cleanup target

Focus only on the interior cavity and cut surfaces:

1. Reduce obvious flat floor/wall slabs.
2. Remove or soften black/gray boolean-looking artifact zones.
3. Keep the open-front silhouette and cavity scale that already read correctly in browser.
4. Darken / normalize rock response so the cavity reads as rock mass, not cut plastic.
5. Re-export one optimized runtime GLB for the same scene path.

## Do not do

- No paid Meshy generation.
- No fresh concept pivot.
- No facility dressing yet.
- No overlay/UI edits.
- No broad exterior-shell rewrite unless required to support the cavity cleanup.

## Definition of done for this pass

- Blender source is saved as a new cleanup iteration.
- A new runtime GLB is exported and optimized.
- A proof render shows the cavity with simple scale references.
- Browser runtime proof is repeated against the same Mission Control scene path.
- Final note states either:
  - **accept baseline**, or
  - **one remaining blocker** with exact evidence.

## Suggested output names

- Blend: `assets/blender/meshy-101-interior-cleanup-v2.blend`
- Runtime GLB: `assets/blender/meshy-101-interior-clean-runtime-v2.glb`
- Proof note: `docs/visual-reviews/2026-05-19-meshy-101-interior-cleanup-proof-v2.md`
- Proof render: `docs/visual-reviews/2026-05-19-meshy-101-interior-cleanup-proof-v2.png`

## Verification floor

```bash
cd ~/clawd/mission-control-preview
node scripts/validate-mission-state.mjs
node --check app.js
```

If a new runtime GLB is exported, also rerun the same browser-scene proof path used in:

- `docs/visual-reviews/2026-05-19-meshy-101-runtime-browser-proof.md`

## Decision rule

If the cavity reads materially better in Blender proof + browser proof without damaging silhouette or runtime viability, baseline acceptance can move forward.
If not, stop and record the exact remaining artifact instead of hand-waving it.
