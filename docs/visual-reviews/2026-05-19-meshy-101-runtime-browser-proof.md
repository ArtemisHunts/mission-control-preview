# Meshy 101 Runtime Browser Proof - 2026-05-19

## Scope

3D/runtime proof lane only. No paid Meshy generation, no deploy, no public push, and no edits to overlay-owned runtime files.

## Runtime Path Inspected

- Historical runtime loader reference at capture time: `app.js` pointed at `assets/blender/meshy-101-open-front-hollow-runtime-v2.optimized.glb?v=meshy101-hollow-v2-20260519`.
- Current local/live direction after hollow v2 rejection: keep the clean Meshy-101 rollback runtime as the protected preview baseline until the next Meshy-first thin-wall form candidate is visually viable.
- Candidate source: `assets/meshy/api/101-open-front-hollow-asteroid-baseline-v2.meshy.glb`.
- Clean runtime artifact: `assets/blender/meshy-101-open-front-hollow-runtime-v2.optimized.glb`.

## Browser Verification

Local server:

```bash
python3 -m http.server 4177 --bind 127.0.0.1
```

Headless Chrome needed software WebGL flags in this environment:

```bash
google-chrome --headless=new --no-sandbox --remote-debugging-port=9224 --user-data-dir=/tmp/mission-control-chrome-proof-9224 --window-size=1600,1000 --enable-unsafe-swiftshader --use-gl=angle --use-angle=swiftshader about:blank
```

Observed proof:

- Canvas created: `1600 x 913`.
- WebGL context: true.
- Active camera proof: `DETAIL · 40m`.
- Runtime reruns can now force the same framing directly with `?camera=detail` instead of relying on manual camera changes.
- Runtime GLB request: HTTP 200, `model/gltf-binary`.
- Runtime console errors: none in the successful SwiftShader pass.
- Screenshot: `docs/visual-reviews/2026-05-19-meshy-101-runtime-browser-detail-swiftshader-proof.png`.
- Capture JSON: `docs/visual-reviews/2026-05-19-meshy-101-runtime-browser-detail-swiftshader-proof.json`.

Pixel sanity from the successful screenshot:

- Image: `1600 x 913`.
- Full-frame unique colors: 36,043.
- Bright pixels: 131,611.
- Cyan pixels: 24,574.
- Rock-like pixels: 71,112.

## Decision

Meshy-101 hollow v2 is **runtime-proven** in the Mission Control browser scene and is acceptable as the active local runtime candidate.

It should **not** be accepted as the final asteroid baseline yet. The browser proof shows obvious remaining cleanup issues: the shell reads at scene scale, but the inner cut/floor surfaces include blocky flat geometry and black/gray boolean artifacts that will make facility dressing harder and lower the production-quality read.

## Recommended Next Gate

Superseded after visual rejection of hollow v2. Keep the clean Meshy-101 rollback preview protected, generate/refine the next thin-wall hollow form through Meshy first, then use Blender only for normalization/export/proof after a viable form exists. The deterministic proof URL remains:

- `http://127.0.0.1:4177/?camera=detail`

When a viable form exists, the browser proof should still check:

- reducing the flat interior wall/floor slabs,
- darkening and normalizing the rock material response,
- preserving the open-front shell silhouette,
- re-exporting the optimized GLB,
- repeating this exact browser proof.
