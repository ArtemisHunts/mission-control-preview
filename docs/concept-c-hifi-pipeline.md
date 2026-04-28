# Concept C Hi-Fi Pipeline

Status: active branch `concept-c-hifi`
Live fallback: `main` at `4182445` remains the stable shipped menu baseline.

## New rule
No more blockout pretending to be final. From this branch onward, new visible work should move toward final-form geometry/material/lighting, not more primitive prop accumulation.

## Target
High-fidelity Concept C asteroid cutaway:
- massive asymmetric asteroid body first
- facility carved into the rock, not framed by it
- deep command shaft with vertical drop
- production bay integrated into excavated mass
- open star corners preserved
- material richness: faceted rock planes, chipped rims, worn metal, emissive tech, grime/contact occlusion

## Technical direction
Blender is not currently available in the workspace, so first hi-fi milestone uses browser-native procedural geometry:
- custom `BufferGeometry` asteroid mantle meshes
- vertex-colored faceted rock planes
- actual depth/thickness geometry instead of flat primitive blocks
- procedural fracture/cut-face plates
- progressively replace blockout modules with procedural/GLB-grade assets

If Blender becomes available later, switch high-value assets to Blender/Python-generated GLB exports:
- asteroid shell chunks
- tunnel mouths
- command shaft walls/rings
- production gantries
- ship-frame pieces

## Milestone ladder

### HIFI-01 — asteroid shell + command shaft mesh
Acceptance:
- old blockout shell is not the primary read
- asteroid body uses custom geometry / vertex-colored faceted surfaces
- command shaft reads as actual depth geometry
- screenshot gate must score higher on massing/material/depth than shipped baseline

### HIFI-02 — material/post pass
Acceptance:
- rock planes have clear value variation and rim/cut distinction
- bloom/fog/depth stack is introduced only if stable
- no blank-page or heavy perf regressions

### HIFI-03 — production bay asset replacement
Acceptance:
- hero production bay uses real assembled geometry instead of box props
- machinery silhouette reads at first glance
- architecture visibly penetrates / is swallowed by rock

### HIFI-04 — final integration pass
Acceptance:
- high-fidelity branch beats live shipped baseline in visual gate
- no cache/stale asset confusion
- only then consider merging to `main`

## Current implementation note
`buildHifiAsteroidShell()` and `buildHifiCommandShaft()` are the first pivot away from blockout shell work. Existing facility modules remain as temporary scaffolding until replaced by hi-fi assets.
