# Mission Control Visual Reviews

Every phase-gated macro pass must include a visual review here.

Required fields for `scripts/macro-gate.mjs`:

```md
# Visual Review — YYYY-MM-DD short-title

Commit under review: pending
Screenshot: docs/visual-reviews/YYYY-MM-DD-short-title.png
References benchmarked: docs/moodboards/world-architecture.png, docs/moodboards/materials-avatars.png
North-star question: Are we actually closer to the final product with this update or not?
North-star verdict: closer

Container/shell: 0/5 — ...
Station visibility: 0/5 — ...
Lighting/readability: 0/5 — ...
Depth/scale: 0/5 — ...

What moved closer:
- ...

What is still off:
- ...

Next visual fix:
- ...
```

The verdict must be honest. If the answer is not `closer`, the loop should keep working instead of committing.
