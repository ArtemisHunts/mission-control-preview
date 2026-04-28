# HIFI-01 Visual Gate — Concept C asteroid shell + command shaft

Branch: `concept-c-hifi`
Screenshot: docs/visual-reviews/2026-04-28-concept-c-hifi-01-shell-shaft.png
Status: Direction approved / fidelity not approved

## What changed
- Created the `concept-c-hifi` branch from shipped `main`.
- Added `docs/concept-c-hifi-pipeline.md`.
- Added browser-native procedural geometry helpers:
  - `hifiNoise()`
  - `hifiColor()`
  - `hifiPrism()` using custom `BufferGeometry` + vertex colors.
- Added `buildHifiAsteroidShell()`:
  - custom faceted left/right asteroid mantle meshes
  - sagging lower asteroid shelves with real thickness
  - procedural fracture/cut-face plates
  - dark bored tunnel bevel
  - selective chipped mineral rims
- Added `buildHifiCommandShaft()`:
  - descending faceted shaft walls
  - bottom cyan glow
- Updated `buildScene()` on the hifi branch to use the new hifi shell/shaft instead of the shipped blockout asteroid shell/detail layers.

## Gate scores
- Improvement over shipped baseline: 3.5/5
- Geometry complexity: 2.75/5
- Asteroid shell fidelity: 2.5/5
- Material/value richness: 2.25/5
- Carved integration: 3.0/5
- Command shaft depth: 2.75/5
- Production bay/facility fidelity: 2.5/5
- Readiness to continue pipeline: 4.0/5
- Overall: 2.9/5

## Verdict
Yes, this is the right direction. Save WIP and continue.

It is no longer just primitive shell blockout, but it is not high-fidelity concept art yet. It reads as a promising procedural low-poly/faceted asteroid base. The missing pieces are mid/small detail, material separation, stronger contact integration, and deeper command-shaft storytelling.

## Regressions / risks
- The asteroid can read as decorative low-poly purple slabs if not pushed further.
- Facility modules remain temporary scaffolding and are not hifi yet.
- Command shaft still reads too shallow.
- Material/value range is too compressed.

## Next pass
HIFI-02 should add:
1. secondary asteroid surface breakup: smaller chips, seams, craters, rubble clusters
2. carved aperture details: bolted collars, cut bevels, retaining ribs
3. command shaft vertical layering: stacked rings, bridge spans, lower silhouettes
4. material separation: stronger dark AO, rim highlights, emissive hierarchy
5. no more big primitive blockout additions
