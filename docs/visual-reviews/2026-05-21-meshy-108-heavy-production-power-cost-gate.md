# Meshy-108 Heavy Production/Power Runtime-Cost Gate

## Goal 6 Gap

Gate the next heavy production/power hero asset before placing another >35 MB prop on the accepted Meshy-108 facility scene.

## Result

- Current heavy hero scene: assets/blender/meshy-108-heavy-hero-command-spine.glb at 48.3 MB.
- Direct-placement increment budget: 35.0 MB.
- Direct-placement scene budget: 96.0 MB.
- Meshy spend: none.

## Candidate Decisions

- assets/meshy/api/03-reactor-power-core.meshy.glb (power): 110.24 MB source, projected direct scene 158.54 MB, decision defer-optimize-first - source GLB alone exceeds direct-placement increment budget; power hero needs decimated proxy or baked low-cost version first.
- assets/meshy/api/04-gantry-crane.meshy.glb (production): 40.54 MB source, projected direct scene 88.84 MB, decision optimize-before-placement - good role fit, but source GLB exceeds direct-placement increment budget.
- assets/meshy/api/05-conveyor-processing-machine.meshy.glb (production): 36.4 MB source, projected direct scene 84.7 MB, decision optimize-before-placement - good role fit, but source GLB exceeds direct-placement increment budget.

## Decision

Do not install another production/power heavy GLB directly in this pass. The gantry crane is the best next visual candidate, but it must go through an optimized low-cost proxy/decimation test before placement. The 110.24 MB reactor remains deferred until a baked or decimated version exists.

## Proof Artifacts

- Gate script: scripts/gate-meshy-108-heavy-production-power-cost.py
- Metrics: docs/visual-reviews/2026-05-21-meshy-108-heavy-production-power-cost-gate.json
- Proof board: docs/visual-reviews/2026-05-21-meshy-108-heavy-production-power-cost-gate-board.png
- Browser viewer: docs/visual-reviews/2026-05-21-meshy-108-heavy-production-power-cost-gate-viewer.html
- Browser smoke screenshot: docs/visual-reviews/2026-05-21-meshy-108-heavy-production-power-cost-gate-browser-smoke.png

## Verification

- GLB header/JSON inspection passed for the current hero scene and all three production/power heavy candidates.
- Visual proof board generated with current budget, projected direct scene sizes, and keep/defer decisions.
- Browser viewer smoke should load the board and candidate table locally.
- State validator should pass after the gate is recorded.
