# Meshy-108 Facility Support Candidate Gate After Portal Audit

Goal 6 gap picked: gate the next facility support candidate after the portal-insert density/runtime audit.

## Result

- Current runtime scene: assets/blender/meshy-108-portal-adjacent-control-insert-placement-contact-proof.glb at 70.769 MB / 96 MB.
- Remaining headroom before another asset: 25.231 MB.
- Selected candidate: assets/meshy/api/65-embedded-ops-window-wall-bunker.meshy.glb.
- Candidate source: 0.267 MB, 1 mesh, 0 material, 0 texture.
- Direct projection: 71.036 MB / 96 MB, leaving 24.964 MB.
- Decision: selected-next-placement-proof - best remaining facility support detail that preserves the next-increment guard.
- Meshy spend: none.
- Accepted asteroid baseline source: untouched.

## Candidate Gate

- Hangar loading bay frame: defer-optimize-first (63.072 MB source, projected 133.841 MB) - direct placement exceeds the 96 MB scene guard
- Operator console chair cluster: defer-optimize-first (35.87 MB source, projected 106.639 MB) - direct placement exceeds the 96 MB scene guard
- Embedded ops window wall bunker: selected-next-placement-proof (0.267 MB source, projected 71.036 MB) - best remaining facility support detail that preserves the next-increment guard
- Embedded control bay room insert: eligible-backup (0.216 MB source, projected 70.985 MB) - direct placement is viable, but role value is lower than the selected ops wall bunker

## Verification

- Current Meshy-108 runtime scene GLB header/JSON inspected as valid glTF 2.0.
- Candidate GLB headers/JSON inspected as valid glTF 2.0.
- Visual proof board QA passed for candidate selection, heavy-candidate deferral, runtime projection, and next-step claims.
- Browser selected-GLB fetch/parse smoke passed: the viewer fetched the selected ops wall bunker as 280,296 bytes.

Next Goal 6 3D step: place the embedded ops window wall bunker and prove contact/runtime.
