# Mission Control — Target 3D Environment Design Spec

_Last updated: 2026-04-25_

## 1. One-line vision

Mission Control should feel like a **high-end sci-fi asteroid-base operations floor**: a cinematic, navigable 3D environment where autonomous agents visibly work inside specialized rooms around a central holographic command table.

It should not feel like a website with a 3D decoration behind it.

---

## 2. North-star references

The target is a synthesis, not a clone:

- **Star Atlas** — premium sci-fi polish, space-economy grandeur, cinematic ship/showroom lighting.
- **Star Citizen** — believable spatial scale, high-density interiors, hangars, cities, ship/deck material realism.
- **NASA/JPL Mission Control** — operational clarity, real telemetry walls, stations that look like people actually work there.
- **The Expanse / Alien: Isolation** — grounded industrial sci-fi, machinery, conduits, believable surfaces.
- **Destiny HELM / Tower** — readable social/work hub layout where navigation and visual hierarchy are clear.

Reference boards live here:

- `docs/moodboards/world-architecture.png`
- `docs/moodboards/holographic-ui.png`
- `docs/moodboards/materials-avatars.png`
- `docs/moodboards/mission-control-design-boards-combined.jpg`

---

## 3. What the user should see first

On load, the user sees a **full-screen 3D asteroid-base command floor**.

The environment owns the frame. UI is minimal.

Immediate impression:

> “I’m looking into a real operations room carved into an asteroid, with a glowing holo-table at the center and specialized agent workspaces around it.”

Scale correction from Michael: the facility should feel **large — borderline massive**. Individual stations should read as small parts of a much larger asteroid base, not as evenly spaced kiosks in a compact diorama. Separation, negative space, catwalk distance, background structures, and exterior hangar depth should do more of the work than extra HUD.

Current container priority from Michael: the scene should read as if the viewer is looking into a **vertical slice of a production base carved through an asteroid**. Build the outside container first: heavy irregular asteroid borders, exposed cut planes, foreground sill/crown, rear cavern darkness, and lighting that reveals silhouettes instead of flattening everything. The default camera should be pulled far enough back to see the whole cutaway container and all four station districts before interior detail; the user should never feel trapped inside the room. Pause further interior element work until the container, wide framing, and lighting are convincing.

Composition:

1. **Center foreground/midground** — large circular holo-table / tactical pit.
2. **Surrounding ring** — walkways, railings, operators, workstations.
3. **Room clusters** — Build Floor, Review Chamber, Deploy Dock, Observatory, spaced far enough apart that navigation feels like moving through a facility.
4. **Rear wall** — panoramic window into space / asteroid hangar.
5. **Background exterior** — distant ship silhouettes, planet/glow, asteroid field.
6. **Ceiling** — heavy ribs, cables, practical amber strip lights.

---

## 4. Environment layout

### Facility scale principle

The world should sell a large carved-out asteroid facility first, and individual workstations second.

Use:

- longer catwalk spans between stations
- larger empty floor/air volume around the central pit
- distant maintenance decks, hangar ribs, and service platforms
- background silhouettes that imply the base continues beyond the playable/viewable area
- smaller station props relative to the shell
- camera compositions that show depth before detail

Avoid:

- evenly spaced mini-rooms that feel like a board-game layout
- agents/workstations scaled too large relative to architecture
- filling every gap with glowing UI just to make the frame busy

### Central Command / Holo-table

The central table is the hero object.

It should have:

- large circular table base with metallic tiers
- glowing cyan glass top
- amber trim ring
- floating holographic asteroid / mission globe
- orbiting data rings
- scan column / volumetric cylinder
- mission nodes/lanes projected above table
- railings or sunken pit around it
- 2–4 nearby operator stations/chairs

Purpose:

This is where Artemis/Navigator route work. It visually explains “mission orchestration.”

### Build Floor

Visual language:

- amber/gold accent
- fabrication benches
- modular crates
- tool racks
- half-built UI/component holograms
- monitors/screens facing inward
- Forge agent visibly stationed here

Mood:

A compact sci-fi workshop inside the base.

### Review Chamber

Visual language:

- coral/red accent
- glass containment ring
- diagnostic panels
- warning strips
- review/QA “inspection” objects suspended in the chamber
- Sentinel agent stationed here

Mood:

Controlled, precise, slightly dangerous. A place where risky work is contained and inspected.

### Deploy Dock

Visual language:

- green/cyan accent
- launch rails
- dock door / airlock silhouette
- cargo containers
- release pipeline indicators
- Quartermaster agent stationed here

Mood:

A small internal launch bay for shipping work out of the base.

### Observatory / Signal Room

Visual language:

- violet/cyan accent
- sensor dish / telescope console
- window or deep-space view
- signal orbs
- research screens
- Prospector agent stationed here

Mood:

Quiet, analytical, mysterious. This room mines signals/references/memory.

---

## 5. Art direction

### Overall style

High-fidelity stylized realism.

Not photoreal. Not cartoon. Not neon arcade.

Target: **premium cinematic sci-fi with readable shapes and efficient web geometry**.

### Materials

Primary materials:

- graphite metal
- black glass
- brushed steel
- dark asteroid rock
- frosted holographic glass
- off-white suit panels
- amber practical lights
- cyan hologram emitters

Avoid:

- flat colored platforms
- oversaturated rainbow neon
- plastic toy surfaces
- generic cyberpunk noise

### Palette

Base:

- near-black space: `#03050d`
- deep navy: `#07101f`
- graphite: `#151b28`
- brushed steel: `#667085`
- asteroid rock: `#1b1720`

Lights:

- cyan hologram: `#59f1ff`
- amber practical: `#e6a93a` / `#ff9f2f`
- coral review: `#ff6f61`
- muted green deploy: `#74d99a`
- violet signal/research: `#9d7cff`

Rule: emissive color should mostly mean “system state,” not decoration.

---

## 6. Lighting direction

The scene should be dark, cinematic, and readable.

Lighting stack:

1. Low ambient fill only.
2. Cyan light from the holo-table.
3. Amber practical strips in ceiling ribs/floor seams.
4. Rim light from rear windows.
5. Soft colored accents from rooms.
6. Volumetric-looking light planes near window/hologram areas.

Required feel:

- dark corners
- bright readable focal areas
- strong silhouettes
- visible depth layers

Renderer settings:

- ACES tone mapping
- restrained exposure
- shadows enabled
- bloom eventually, but only after emissive values are controlled

---

## 7. Agent/avatar design

Agents should read as **suited operators**, not bobbleheads.

Base silhouette:

- small astronaut/operator figure
- helmet
- dark visor
- compact backpack
- arms/legs or simplified suit segments
- role-colored status light

Role accents:

- Artemis: cyan — orchestration
- Navigator: off-white/cyan — strategy
- Forge: amber — build
- Sentinel: coral — QA/review
- Quartermaster: green — deploy/logistics
- Prospector: violet — research/signal

Animation:

- subtle idle movement
- small workstation interactions
- glance/turn toward table or room object
- drones/objects should imply activity around them

Avoid:

- giant floating name tags
- bright full-body role colors
- cartoon proportions unless deliberately stylized

---

## 8. Interaction model

The environment should be navigable.

Michael correction: the default experience should feel closer to a **front-facing fixed facility view** than an orbiting product showcase. The camera should look into the asteroid base like a cinematic cross-section / command-floor window, with dark asteroid borders framing the scene. Navigation should happen **inside the facility** via WASD / arrow-key panning and point-and-click traversal, closer to Diablo-style movement than orbit controls.

Primary interactions:

- WASD / arrow keys pan the fixed view through the base
- click floor/catwalk positions to move the view target there
- click room/workspace to focus that bay without changing into a spinny orbit camera
- minimal nav strip as fallback
- eventually click an agent to see task context
- eventually click the holo-table to open mission graph

Camera behavior:

- default view should be fixed/front-facing and cinematic
- avoid free orbit as the primary page navigation
- room transitions should feel like moving/panning through a massive facility
- target should settle on actual room work, not empty platform center

---

## 9. UI posture

UI should be minimal until the environment works.

Current rule:

- no big marketing hero
- no large right rail
- no dashboard panels covering the scene
- tiny room readout is acceptable
- tiny nav dock is acceptable

Future UI should be nested into:

- in-world monitors
- holo-table overlays
- room-specific consoles
- small contextual panels after selection

The site should feel like **using a 3D operating room**, not reading a landing page.

---

## 10. Fidelity bar

The current implementation is still low fidelity. The target requires these visible upgrades before we call it “close”:

### Required before “good enough”

- [ ] room platforms replaced by believable physical rooms/workstations
- [ ] central holo-table looks like the hero object from the boards
- [ ] rear window/exterior view creates convincing scale
- [ ] ceiling/ribs/cables make the room feel enclosed
- [ ] floor panels/glass/light lanes look material-rich
- [ ] agents look like operators, not colored markers
- [ ] props create believable scale: chairs, crates, consoles, racks, drones, railings
- [ ] lighting has cinematic contrast, not even toy lighting
- [ ] camera views are composed intentionally for each room
- [ ] UI is minimal and environment-first

### Nice-to-have after core fidelity

- [ ] GLB asset pipeline
- [ ] procedural texture/noise maps
- [ ] bloom/post-processing
- [ ] animated screens
- [ ] mission graph data from real state
- [ ] agent task cards embedded into room consoles
- [ ] ambient sound/music
- [ ] mouse-hover room labels
- [ ] performance budget and device scaling

---

## 11. Implementation roadmap

### Pass 1 — Composition + UI removal

Goal: make environment own the screen.

- remove big hero/card UI
- reduce nav/readout
- set camera composition around central table
- improve room navigation

Status: mostly done.

### Pass 2 — Architectural shell

Goal: stop looking like a box/plane scene.

- octagonal/arched command room
- heavier wall/ceiling ribs
- rock-carved perimeter
- rear panoramic window
- exterior vista
- catwalks and railings

Status: partially done, still needs refinement.

### Pass 3 — Central holo-table hero pass

Goal: make table match the boards.

- larger table
- multi-tier base
- holographic asteroid/globe
- orbital rings
- scanning cylinder
- projected mission lanes
- stronger cyan/amber lighting

Status: partially done, needs more polish.

### Pass 4 — Room physicalization

Goal: each room becomes a real workspace.

- Build Floor: benches/crates/tools/screens
- Review: containment chamber/diagnostics
- Deploy: rails/door/cargo
- Observatory: sensor dish/window/screens

Status: early primitive pass only.

### Pass 5 — Operators + props

Goal: agents and props establish scale/life.

- better suited operators
- animations per role
- drones
- chairs
- cargo
- conduits
- wall racks
- maintenance details

Status: early primitive pass only.

### Pass 6 — Material/lighting polish

Goal: premium look.

- controlled emissive use
- ACES + possible bloom
- texture/noise materials
- glass/metal/rock contrast
- better shadows
- less saturated toy colors

Status: partially done.

### Pass 7 — Asset pipeline

Goal: move beyond primitives.

- introduce Blender/GLB modules
- modular wall panels
- consoles
- chairs
- operators
- holo-table kit
- props

Status: not started.

---

## 12. What “matching the boards” means

We are not trying to exactly reproduce generated moodboard pixels.

We are trying to match:

- cinematic sci-fi environment quality
- full-screen spatial immersion
- believable materials
- strong central command-table spectacle
- specialized workspaces around the table
- visible operators and props
- asteroid-base / hangar / space scale
- minimal UI, mostly embedded into the world

If a screenshot of the app can sit next to the first and third moodboards without feeling like a wireframe toy, we are close.

---

## 13. Current honest assessment

Current state: **promising structure, low fidelity execution**.

What works:

- basic 3D environment exists
- room navigation exists
- central holo-table exists
- UI is now mostly out of the way
- early props/lighting are in place

What does not work yet:

- geometry is too primitive
- materials are too flat
- rooms are not yet believable spaces
- agents still need much better silhouettes
- lighting is not cinematic enough
- scene density is too low
- no real GLB asset quality yet

The next loops should prioritize **physical believability and material richness**, not more UI.
