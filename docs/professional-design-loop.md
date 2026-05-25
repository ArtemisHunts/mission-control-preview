# Professional Design Loop

Use this for every Mission Control UI pass where visual quality matters.

## Rule

Do not treat the first coded draft as the design. The design is the loop:

prompt -> implement -> run -> screenshot -> vision review -> click test -> revise -> compare -> ship

## Required Inputs

- Target screenshot or concept board.
- Exact surface being changed, for example: Command Center popup, not page shell.
- User job for that surface.
- Desktop and mobile viewport targets.
- Non-goals so surrounding UI does not drift.

## Implementation Loop

1. Define the design contract.
   - Surface: what screen, modal, panel, or interaction owns the change.
   - Target vocabulary: typography, framing, color, density, iconography, materials, motion.
   - Acceptance criteria: what must be visibly true in the screenshot.

2. Build only inside the contracted surface.
   - Do not move concept styling into global chrome unless the contract says to.
   - Keep existing interaction paths working.
   - Use real state-backed data unless the artifact is explicitly a mockup.

3. Run the app locally.
   - Capture desktop screenshot.
   - Capture mobile screenshot.
   - Capture the exact interaction state, for example: click Command Center and screenshot the open overlay.

4. Review with vision/product critique.
   - Compare target vs current side by side.
   - Score hierarchy, spacing, contrast, text fit, responsive behavior, interaction clarity, and target vocabulary.
   - List the top 3 visual defects by impact.

5. Revise until the defects are gone or explicitly accepted.
   - A pass is not complete because code compiles.
   - A pass is complete when screenshots show the intended surface and the visible defects are below the agreed bar.

6. Ship with proof.
   - Run syntax/build/state checks.
   - Verify the interaction path in browser.
   - Push only after the public preview reflects the intended state.
   - Report what was verified and what is still not final parity.

## Design Prompt Template

Use this at the start of design-heavy work:

> Use the professional design loop. The target surface is [surface]. The reference is [image/doc]. Keep changes scoped to [scope]. Run locally, capture desktop and mobile screenshots, click through the target interaction, compare against the reference, revise the top visual defects, and do not finish until the screenshots show professional-grade hierarchy, spacing, contrast, text fit, responsiveness, and the reference's actual design vocabulary.

## Mission Control Addendum

For Goal 5, the Command Center popup/overlay is the primary surface. The north-star operations-floor image should inform that overlay first: bronze editorial frames, operations-floor brief, blueprint cues, material palette, numbered scene cards, dense workstation screens, sunken command table, and dark industrial light.
