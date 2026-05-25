# Goal 5 Reference Visual Motif Rail Pass

Date: 2026-05-20 10:21 UTC
Lane: Goal 5 holo-table / overlay / command-table UI

## Gap

The reference matrix marked `Reference visual motifs` as `needs-iteration`. The overlay had stronger contrast and depth from prior passes, but the concept-art motif language was not explicitly represented as fine-line instrumentation, layered depth, and command-room contrast.

## Change

Added a visual motif calibration rail to `?overlay=1&console=overview`.

- `Fine-line grid` for instrumentation.
- `Depth rings` for layered holo depth.
- `Contrast rails` for command-room contrast.
- The rail is attached to the central command table region and remains secondary to operational data.
- Updated `referenceMatch.goal5.zones[reference visual motifs]` to `partial-match-improved`.

## Honesty Check

This improves one reference zone. It does not claim full reference-dashboard match; the visual-motif zone still needs side-by-side reference proof and stronger authored lighting hierarchy.

## Proof

- Desktop screenshot: `docs/visual-reviews/2026-05-20-goal-5-reference-visual-motif-rail-desktop.png` (1440 x 1180)
- Mobile screenshot: `docs/visual-reviews/2026-05-20-goal-5-reference-visual-motif-rail-mobile.png` (390 x 980)
- DOM dump: `tmp/goal-5-reference-visual-motif-rail-dom.html`
- DOM assertions passed for the visual motif rail label, all three chips, supporting detail text, `Reference visual motifs`, and `partial match improved`.

## Verification

- `node scripts/validate-mission-state.mjs`
- `node --check app.js`
- `git diff --check`
- Headless Chrome desktop/mobile screenshots
- Headless Chrome DOM smoke

## Decision

Pass as a visual-motif-zone improvement. Next Goal 5 work should tighten operational-density hierarchy so the dense state reads authored rather than accumulated.
