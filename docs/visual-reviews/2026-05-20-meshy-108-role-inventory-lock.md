# Meshy-108 Facility Role Inventory Lock

Goal 6 gap picked: lock the local Meshy facility role inventory after the accepted Meshy-108 facility contact audit.

## Result

- Local Meshy GLBs inspected: 108.
- Locked accepted pass-1 roles: 8.
- Promoted next density-pass assets: 20.
- Demoted duplicate command overflow: 47.
- Excluded nonfacility/source assets: 13.

## Locked Pass 1 Roles

- catwalk: assets/meshy/api/10-modular-catwalk-recovery-long-bridge.meshy.glb
- production: assets/meshy/api/14-fabrication-robotic-arm-background-workcell-v3.glb
- logistics: assets/meshy/api/15-docking-clamp-airlock-collar.meshy.glb
- control: assets/meshy/api/23-control-console-bank.meshy.glb
- signal: assets/meshy/api/24-communications-dish-mast.meshy.glb
- hangar: assets/meshy/api/25-hangar-airlock-portal-frame-v2.meshy.glb
- command: assets/meshy/api/54-tight-panoramic-command-bunker-face.meshy.glb
- power: assets/meshy/api/58-server-control-cabinet-cluster.meshy.glb

## Promote For Density Pass 2

- hangar: assets/meshy/api/01-hangar-loading-bay-frame.meshy.glb (heavy, 64586 KB)
- command: assets/meshy/api/02-command-control-spine.meshy.glb (heavy, 28280 KB)
- power: assets/meshy/api/03-reactor-power-core.meshy.glb (heavy, 112881 KB)
- production: assets/meshy/api/04-gantry-crane.meshy.glb (heavy, 41510 KB)
- production: assets/meshy/api/05-conveyor-processing-machine.meshy.glb (heavy, 37273 KB)
- control: assets/meshy/api/08-operator-console-chair-cluster.meshy.glb (heavy, 36731 KB)
- catwalk: assets/meshy/api/09-modular-catwalk-deck-segment.meshy.glb (medium, 2811 KB)
- catwalk: assets/meshy/api/11-cable-pipe-duct-wall-insert.meshy.glb (heavy, 18304 KB)
- support: assets/meshy/api/12-maintenance-drone.meshy.glb (heavy, 22173 KB)
- logistics: assets/meshy/api/13-cargo-tool-pod.meshy.glb (heavy, 58309 KB)
- production: assets/meshy/api/16-light-hazard-gantry.meshy.glb (light, 435 KB)
- hangar: assets/meshy/api/22-hangar-airlock-portal-frame.meshy.glb (light, 419 KB)
- logistics: assets/meshy/api/26-circular-observation-control-pod.meshy.glb (light, 142 KB)
- signal: assets/meshy/api/27-radar-satellite-tower-v2.meshy.glb (light, 440 KB)
- command: assets/meshy/api/29-long-control-room-bunker-module.meshy.glb (light, 223 KB)
- command: assets/meshy/api/37-clean-recessed-command-bunker-face.meshy.glb (light, 267 KB)
- signal: assets/meshy/api/52-embedded-signal-control-booth.meshy.glb (light, 139 KB)
- command: assets/meshy/api/61-top-center-glazed-command-band-bunker.meshy.glb (light, 253 KB)
- command: assets/meshy/api/78-long-dual-command-gallery-module.meshy.glb (light, 133 KB)
- command: assets/meshy/api/99-embedded-control-bay-room-insert.meshy.glb (light, 221 KB)

## Decision

The accepted eight-role pass-1 mount set stays locked. The next density pass should draw from the promoted local assets only, keeping command variants capped so the scene gains facility function instead of repeating facade noise.

## Verification

- GLB header/JSON inspection passed for 108 local Meshy GLBs.
- Visual proof board QA passed.
- Browser inventory smoke passed: viewer returned 200, JSON returned 200, and the screenshot showed 108 inspected GLBs, 8 locked roles, 20 promoted assets, and 47 duplicate command demotions.

Next Goal 6 step: create Meshy-108 facility density pass 2 from the promoted inventory without modifying the accepted asteroid baseline source.
