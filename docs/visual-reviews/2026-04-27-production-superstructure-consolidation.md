# Visual Review — 2026-04-27 production superstructure consolidation

Commit under review: pending
Screenshot: blocked-browser-policy-no-image-captured
References benchmarked: docs/moodboards/world-architecture.png, docs/moodboards/materials-avatars.png, docs/target-design-spec.md
North-star question: Are we actually closer to the final product with this update or not?
North-star verdict: closer

Container/shell: 4/5 — The calibrated asteroid proscenium remains unchanged as the page border. The new interior superstructure adds engineered masks and pressure walls, so the rock stays contextual instead of becoming the subject.
Station visibility: 4/5 — Build, Review, Deploy, and Observatory remain active and readable. Their small loop-built fragments are now represented by larger deck blocks, dark machine volumes, and broad identity rails.
Lighting/readability: 4/5 — The scene should read cleaner because mini bay fragments, small side module loops, and repeated roof/gantry detail were consolidated into broad cyan/amber production edges and large shadow masses.
Depth/scale: 4/5 — The facility scale now comes from one continuous production superstructure: floor slab, pressure walls, rear bulkhead, overhead service raft, district decks, side machinery, transverse gantries, roof baffles, and foreground balcony.

Asteroid border ratio: target 15–25%; implementation estimate remains ~17–22% because the asteroid proscenium geometry was preserved and additional interior masks do not expand rock coverage.
Interior facility dominance: target 75–85%; implementation estimate remains ~78–83%, but with stronger readability from fewer larger interior architectural forms.
Station visibility: All four stations keep labels, operators, room meshes, and broad identity rails. The pass reduces fragment noise around them instead of hiding them.
Lighting/readability: Fewer repeated small pieces means the large cyan/amber datums and dark machine volumes should separate better at overview distance.
Depth/scale: The superstructure increases the industrial read without adding prop spam: broad bay decks, side pressure machinery, transverse gantries, roof baffles, foreground balcony, and rear machinery slot.
FPS/performance risk: Lower/flat. Loop-built bay, side machinery, gantry, and roof baffle fragments were replaced with explicit broad forms. Mesh constructors remain 10, app size remains under budget, and loop markers remain 0.

Screenshot/capture note:
- Browser navigation to the local preview was blocked by policy again.
- No fresh screenshot was captured. Verdict is based on code-level composition changes benchmarked against the moodboards/spec.

What moved closer:
- Consolidated mini bay/gantry/roof fragments into one production superstructure.
- Preserved asteroid/comet as border only.
- Strengthened large interior floor/wall/deck/machinery reads.
- Kept performance budgets flat while improving hierarchy.

What is still off:
- Needs live screenshot verification before more geometry work.
- Material/lighting balance may need tuning once actual pixels are visible.
- Further blind pruning risks overcorrecting the station readability.

Next visual fix:
- Restore screenshot capture, then verify whether the production superstructure reads as facility dominance without burying station identities.
