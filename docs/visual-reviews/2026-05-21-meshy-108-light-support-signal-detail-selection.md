# Meshy-108 Light/Medium Support or Signal Detail Selection

Goal 6 gap picked: select the next support/signal detail candidate after the Meshy-108 composition/runtime audit.

## Result

- Selected next candidate: assets/meshy/api/11-cable-pipe-duct-wall-insert.meshy.glb.
- Role: support-utility.
- Source GLB: 17.88 MB, 1 mesh, 1 material, 1 texture.
- Projected direct scene: 66.88 MB / 96 MB, leaving 29.12 MB.
- Decision: selected-next-placement-proof.
- Exact unused light/medium signal candidates are exhausted; prior accepted passes already placed the communications mast, radar tower, and signal booth.

## Candidate Gate

- Cable / pipe duct wall insert: selected-next-placement-proof (17.88 MB source, projected 66.88 MB) - lowest-cost unplaced support utility detail; gives infrastructure read while staying inside the 96 MB scene guard
- Maintenance drone: eligible-backup (21.65 MB source, projected 70.65 MB) - within direct placement budget, but lower scene-value-per-MB than the selected duct insert
- Operator console chair cluster: proxy-before-placement (35.87 MB source, projected 84.87 MB) - projected scene stays under 96 MB, but source exceeds the direct-medium increment guard
- Cargo tool pod: defer-optimize-first (56.94 MB source, projected 105.94 MB) - direct placement would break the 96 MB scene guard

## Verification

- Current Meshy-108 scene GLB header/JSON inspected as valid glTF 2.0.
- Candidate GLB headers/JSON inspected as valid glTF 2.0.
- Browser viewer fetch/parse smoke target written for the selected GLB.
- Visual proof board generated.

Next Goal 6 3D step: place the selected support utility detail and prove contact/clearance before adding any more production/power heavy assets.
