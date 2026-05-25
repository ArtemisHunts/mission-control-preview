# Meshy-108 Facility Density Pass 2

Goal 6 gap picked: build Meshy-108 facility density pass 2 from the locked promoted local inventory.

## Outputs

- Script: `scripts/create-meshy-108-facility-density-pass2.py`
- Source scene: `assets/blender/meshy-108-facility-population-pass1.blend`
- Density source: `assets/blender/meshy-108-facility-density-pass2.blend`
- Runtime GLB: `assets/blender/meshy-108-facility-density-pass2.glb`
- Metrics: `docs/visual-reviews/2026-05-20-meshy-108-facility-density-pass2.json`
- Proof board: `docs/visual-reviews/2026-05-20-meshy-108-facility-density-pass2-board.png`
- Browser smoke: `docs/visual-reviews/2026-05-20-meshy-108-facility-density-pass2-browser-smoke.png`
- Browser viewer: `docs/visual-reviews/2026-05-20-meshy-108-facility-density-pass2-viewer.html`
- Render set: `docs/visual-reviews/meshy-108-facility-density-pass2/`

## Result

- Added 11 promoted local light/medium Meshy assets to the accepted pass-1 facility scene.
- Covered catwalk, command, hangar, logistics, production, and signal roles.
- Used 5,620,152 bytes of promoted source GLBs.
- Exported density pass 2 GLB is valid glTF 2.0 at 21,322,188 bytes.
- No paid Meshy generation was run.
- The accepted asteroid baseline source was not modified.

## Verification

- Blender render/export completed.
- glTF inspection passed on the density pass 2 GLB.
- Visual proof board QA passed: density increase is readable and the open C-shell mouth remains clear.
- Browser smoke passed: viewer returned 200, GLB returned 200, and the browser screenshot showed glTF 2 / 11 promoted assets / no Meshy spend.

Decision: density pass 2 passed visual proof and browser GLB fetch/parse smoke. Next Goal 6 step is a density pass 2 contact/intersection audit before adding heavy hero-scale promoted assets.
