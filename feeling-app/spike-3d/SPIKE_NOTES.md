# Phase 0 Spike — Stylized-3D Pipeline (Blender → Godot 4)

**2026-09-22**: after several rounds of upgrading the Capacitor/HTML
spike's rendering (custom SVG icons replacing emoji — see
`feeling-app/spike/SPIKE_NOTES.md` update 15), asked for a much bigger
change: "you need to use blender to make the robot, you need to use a
game egngen to make the games and graphics apis for when it hits
devices. you need to make it 3d or stylized or both, it needs to have
effects and lighting." Confirmed via clarifying questions: **Godot**
(not Unity — this session has no interactive display, and Unity's
Editor-centric workflow doesn't fit a headless CLI environment the way
Godot's scriptable, CLI-exportable one does), a **full pivot** of the
game/visual rendering layer, keeping the story books and TTS voice
system (explicitly called out as already working well), and **stylized
3D** (low-poly/toon-shaded, real-time lighting) as the art target.

This is a fundamentally different technology stack from the Capacitor
spike — a real 3D asset pipeline and game engine, not HTML/CSS/SVG in a
WebView. Given the size of that pivot, treated it the same way the
original Capacitor-vs-native decision was treated (see
`feeling-app/spike/SPIKE_NOTES.md` and `research/05-...`): prove the
technical pipeline end-to-end on one real asset before committing to
rebuilding the whole app on it. **This spike is that proof, not the
full rebuild** — see "What this doesn't answer yet" below.

## What was proven

**1. Toolchain installs and runs headlessly in this sandbox.**
Neither Blender nor Godot 4 were present. Installed Blender 4.0.2 via
apt and Godot 4.3 (editor + export templates) directly from
godotengine.org's GitHub releases, since apt only carries Godot 3.5
(no Godot 4 package on this distro release, and Godot 4's rendering/
shader improvements are the whole reason to use it here). Both run
fully headless via Xvfb + Mesa's `llvmpipe` software rasterizer — no
GPU passthrough needed for this sandbox, though real device testing
obviously needs real hardware (same caveat the Capacitor spike landed
on for Android hardware testing).

**2. Blender Python (bpy) scripting builds and exports a usable asset
with zero manual/GUI steps.** `blender/build_sprocket.py` constructs
Sprocket entirely from primitives (spheres, beveled cubes, a beveled
Bezier curve for the smile) — deliberately low-poly, since clean toon-
shaded shapes are both what a cel shader needs to read well and what a
lower-end Android GPU can afford with several on screen. Exports
straight to glTF (`sprocket.glb`), which Godot imports natively with
no plugin. Kept the same silhouette and palette as the existing 2D
character (round head, dark visor, ear pods, antenna, rounded body
with a glowing core) rather than redesigning from scratch — the ask
was better rendering, not a different character.

**3. Godot 4's built-in toon render modes + a rim light + an
inverted-hull outline pass produce a genuinely "premium mobile game"
stylized look**, not a flat placeholder. `godot/shaders/toon.gdshader`
uses `render_mode diffuse_toon, specular_toon` (Godot's built-in banded
BRDF — deliberately not a hand-rolled `light()` override, which would
have had to reimplement shadow/attenuation handling itself) plus
built-in `RIM`/`RIM_TINT` for the edge glow. `godot/shaders/
outline.gdshader` is the standard inverted-hull technique (render the
mesh again, back-faces-only, pushed outward along normals) that most
toon-shaded mobile games use for a clean outline without an edge-
detection post-process. `godot/scenes/preview.gd` builds the whole
scene (WorldEnvironment, three-point directional light rig, camera,
model, per-surface toon materials) in code from the imported glTF —
proof that this can be driven data-and-script rather than hand-laid-
out per screen in the editor, which matters for a template-driven app
like the Academy's ten near-identical levels.

**4. Android export reaches Godot's own export step correctly**, then
stops at the same wall the Capacitor spike already documented: no
Android SDK in this sandbox (`A valid Android SDK path is required in
Editor Settings`). Deliberately not installing one here for the same
reason the Capacitor spike gave — it's a multi-gigabyte download that
still wouldn't answer the real open question, which is performance on
actual lower-end tablet hardware this sandbox doesn't have.

## Three real bugs hit and fixed along the way

All three were the *same underlying mistake* surfacing in different
places, which is worth calling out for whoever continues this: **when
you set a color from a script/API rather than through an editor color
picker, both Blender's Python API and Godot's `Color()` constructor
take linear values, not the sRGB values a hex code like `#ffb15e`
represents.** Skipping the conversion doesn't error — it just silently
double-brightens/desaturates everything, which is a much harder bug to
notice than a crash.

1. **Blender materials were washed out pale instead of vivid.**
   `bsdf.inputs['Base Color'].default_value = (*base_color, 1.0)` with
   `base_color` derived straight from the app's existing hex palette
   rendered as bleached near-white. Fixed with an `srgb_to_linear()`
   helper applied to every material's base/emission color before
   assignment (`blender/build_sprocket.py`).
2. **Godot's background and light colors had the identical problem** —
   `Color(0.996, 0.851, 0.71)` for the background rendered as
   near-white instead of the intended warm peach. Godot 4 actually
   ships a `Color.srgb_to_linear()` method for exactly this; every
   hand-authored color in `preview.gd` (background, ambient, all three
   light colors) now goes through it. Materials that came from the
   Blender→glTF round trip didn't need this fix — glTF's
   `baseColorFactor` is linear by spec, so a correctly-linear-encoded
   Blender export imports into Godot already correct.
3. **The Academy's own core/ring colors were backwards** (caught while
   fixing #1): the 2D app's `acadCoreGrad` gradient goes bright-cream
   center fading to gold at the rim, but the first 3D pass had a gold
   inner disc inside a larger white ring — the reverse arrangement.
   Swapped so the outer ring is gold and the inner disc is the bright
   cream, matching the established 2D design.

A fourth issue was lighting/glow *tuning*, not a bug: the first two
lighting passes blew the whole render to solid white — first from
Area-light Watts far too high for the scene scale (switched to Sun
lamps, whose `energy` is distance-independent W/m², much easier to
reason about), then from ACES tonemapping's photographic highlight
rolloff desaturating the character's flat saturated orange toward pale
yellow on the lit side (switched to `TONE_MAPPER_LINEAR`, which suits
a flat-colored toon character better than a filmic curve built for
photographic footage). Glow/bloom is currently **disabled** — even
heavily constrained (2 of 7 blur mip levels, threshold 1.4) it kept
washing the entire canvas rather than haloing just the emissive parts,
and diagnosing exactly why needs an interactive editor session with a
live viewport to inspect the glow buffer, which this headless sandbox
doesn't have. The emissive materials (eyes, core, antenna tip) already
read as glowing from `EMISSION` alone without it — see "What's left"
below.

## What's left before this is a real bloom pass, not a placeholder
Getting proper HDR bloom around just the emissive parts (not a full-
canvas wash) needs someone in the actual Godot editor with a live
viewport — tune `glow_hdr_threshold`/mip levels interactively and
watch the buffer, rather than blind file-based iteration.

## Round 2 — character redesign: "not kiddie/friendly looking, colourful"

The first render (proven pipeline, but still just the direct 3D
translation of the existing 2D palette) got direct feedback: not kid-
friendly, not colorful, and to look at actual cartoon robots as
reference rather than guess. Pulled real reference images this time —
not just text search results, which turned out to be nearly useless
for this (search summaries describe character designs in prose; you
need to actually look at the shapes/colors). Downloaded and viewed
official images: **Baymax** (Big Hero 6 Wikipedia infobox) for the
soft/huggable roundness case study, **WALL-E** (Wikipedia infobox) for
how much a single design lever — enormous, simple, expressive eyes —
carries a robot's entire emotional readability. Text search also
surfaced (though couldn't fetch direct images for) BMO, Rescue Bots,
and Rosie the Robot as the reference points for the other missing
piece: real kids'-character robots almost never use one hue for the
whole body — they color-block 2–3 bold, saturated, contrasting colors
across the design (body vs. face/screen vs. hands-and-feet), where the
first pass was orange-on-orange-on-gold throughout.

Changed in `blender/build_sprocket.py`:
- **Eyes ~40% bigger** and given actual black pupils (previously plain
  small white spheres) — the single highest-impact change, directly
  from the WALL-E reference.
- **Visor recolored** from a near-black "camera lens" to a bright glow-
  ing teal "screen" — reads as a friendly lit face, not a sensor.
- **Three-color-block palette**: body stays warm orange (brand
  continuity with the 2D app) but the visor/core are now teal (a real
  second hue, replacing a same-family gold) and the hands/feet/antenna
  tip/collar are a third color, bright yellow — matching how actual
  toy/character robots block color rather than shading one hue.
- **Cheeks** bumped from muted salmon to vivid hot pink.

Re-ran through the full Godot toon-shader/lighting/outline pipeline
unchanged (no shader/lighting code changed this round — the fix was
entirely in the asset, confirming the pipeline built in round 1
transfers a palette/geometry change through cleanly without needing
re-tuning). New result: `godot/sprocket_3d_proof.png` (overwrites the
round-1 image — round 1's version is still in git history if needed
for comparison).

## Round 3 — full redesign from a user-picked reference image

Round 2 still wasn't right: "not good quality... looks like a rough
sketch." Asked to look at cartoon robots on Google Images for
reference — round 1's text-only search results turned out to be close
to useless for a visual question, so this time downloaded and actually
viewed reference images (Baymax, WALL-E via their Wikipedia infoboxes)
before touching the model. That got round 2's color/eye-size fixes but
didn't fix the "rough sketch" complaint, because the real problem
wasn't color or eye size — three floating disconnected arm-blobs with
a visible ~0.57-unit gap to the body, a flat sticker-like visor, and
zero anti-aliasing on the outline pass. Diagnosed each by re-viewing
the rendered image closely rather than guessing.

Then the user supplied their own reference image directly and said
"work from this" — a specific vector-style "kid astronaut" robot
design (peach face visible through an open helmet, twin antennae with
gold tips, red ear pods, a blue-grey body/limb base with orange
shoulder pauldrons and a chest dial, a red hip panel, jointed
limbs with alternating orange bands, red hands, yellow boots). This
replaced round 1/2's approach of keeping Sprocket's existing orange
2D silhouette and iterating on top of it — the feedback was about the
whole design, not a detail, so `blender/build_sprocket.py` was rebuilt
close to 1:1 against that reference rather than patched again:
- **Helmet + face instead of head + visor.** The previous rounds' dark
  or glowing "screen" is gone; there's now an actual peach face plate
  (with a dark trim frame around its edge, matching the reference's
  helmet-opening ring) behind a big blue-grey helmet shell.
- **Layered eyes** (white sclera sphere → blue iris → black pupil →
  small white highlight, each poking slightly further forward than the
  last) instead of a flat white sphere with a black dot painted near
  its surface.
- **Twin antennae**, not one central antenna, each an angled rod with
  a gold ball tip.
- **Jointed limbs.** Arms and legs are now built as explicit chains —
  shoulder pauldron → upper arm → elbow band → forearm → hand; thigh →
  knee band → shin → ankle band → boot — with each segment's extent
  computed to overlap the next by construction (documented inline in
  `add_arm()`/`add_leg()`), rather than single blob shapes.
- **Real four-color-block palette**: blue-grey base, dark navy
  trim/joints, red accent (ears, hands, hip panel, crest), orange
  accent (shoulders, chest dial, knee/ankle bands), yellow (boots,
  antenna tips) — matching the reference exactly rather than
  inventing a new scheme.

**The actual root cause of "rough sketch," found by inspecting the
render pixel-by-pixel instead of re-guessing at color theory:** the
arms were positioned with a large gap to the body (`x=1.45` against a
body half-width of `0.675` — a 0.57-unit floating gap), which reads as
an unassembled paper-doll sketch far more than any color or shading
choice does. Fixed by pulling every limb segment's position in until
it provably overlaps its neighbor (checked by computing each part's
bounding range by hand before touching the render, not just eyeballing
it after). A second, subtler version of the same mistake appeared
after the redesign: the helmet (a sphere) tapers to a literal zero-
width point at its bottom pole, and the original small flat collar
block sat entirely above that taper — geometrically "touching" by the
numbers, but visually a gap, because there was nothing but a
vanishing point bridging helmet and shoulders. Fixed with a wider,
taller neck cylinder reaching well into both the helmet's lower curve
(where it's actually wide) and the body's top.

Also fixed for overall polish: enabled MSAA + screen-space AA in
`project.godot` (the previous renders' jagged, aliased outline edges
were themselves part of what read as "sketch"-y), skipped the outline
pass entirely on tiny detail parts (pupils, eye highlights, nose —
a same-width outline on something that small reads as a scribble, not
an accent), thinned the outline itself, added a ground plane with a
real contact shadow in the Godot scene (the model was rendering in
pure void before), and re-tuned light energy down for the new palette
(the reference's pale blue-grey clips to white much faster under the
same lighting that suited round 1/2's darker, more saturated orange —
also darkened the base blue-grey itself slightly at the source for
the same reason).

Result: `godot/sprocket_3d_proof.png` (overwrites round 2's image;
prior rounds' versions are in git history for comparison).

## Round 3b — "that looks scary, the head is horrible"

The round-3 redesign kept two things from the earlier "screen face"
rounds that turned out to be the wrong call for a peach-skin face: a
face plate sized relatively small against the helmet (leaving a big
bald blue-grey dome above and beside it), and eyes built the same way
as round 2's — layered spheres, each poking progressively further
forward than the last for depth. On a flat "screen" that read as a
lit display; on an actual face, full spheres bulging out of their
sockets read as eyeballs on stalks — closer to an insect or a
deep-sea creature than a kid's face, especially combined with how
little of the helmet the small face plate covered.

Fixed both proportions, not just the color/shading tuned in round 3a:
- **Face plate and its trim frame roughly 50% bigger**, now covering
  most of the helmet's front (matching the reference's proportions,
  where the face opening reads as most of the helmet rather than a
  small window on one side).
- **Eyes rebuilt as flat layered discs** (`add_cylinder` rotated to
  face the camera, not `add_uv_sphere`) instead of full spheres — each
  disc only ~0.03 units proud of the one behind it, so they read as
  big round eyes drawn on a flat face rather than bulging orbs. Nose,
  mouth, and cheeks repositioned/enlarged to match the bigger face.

This is the same underlying lesson as round 3's arm-gap and neck-taper
fixes, from the opposite direction: round 3 was "parts don't visually
connect because they don't overlap enough," this was "parts read as
grotesque because a construction technique that worked for a flat
glowing screen (round 2) doesn't automatically work for an anatomical
face (round 3)" — the fix in both cases came from looking hard at what
the render actually shows instead of reasoning from the code.

## What this doesn't answer yet

This spike proves the *pipeline* — Blender asset authoring, Godot
import, toon shading, lighting, and where Android export stops —
on **one asset, one static preview scene**. It does not yet cover, and
each of these is real remaining work, not a formality:
- **Rigging and animation.** Sprocket is currently a static pose (no
  armature/skeleton). The 2D app's bob/wiggle/cheer animations
  (`heroBob`, `tpCheer`, etc.) need a rig and either hand-keyed
  animation clips or a procedural equivalent in GDScript.
  - **The actual games/Academy content.** None of the Teach/Spot/Tool
  Match/Quick Recall phases, the level map, or Sprocket's Closet exist
  in Godot yet — this spike is Sprocket standing still, not a level.
- **Touch input, UI, and the data-driven level template** that
  `academy-level.js` currently provides for all ten feelings — Godot
  has its own UI (Control nodes) and input system, unrelated to the
  DOM/CSS one.
- **The story books and TTS**, which the pivot is explicitly meant to
  keep — how they fit alongside a Godot-rendered game layer (embedded
  WebView panel within the Godot app? Two separate app surfaces
  launched from a shared shell? Rewritten as Godot scenes, losing the
  working Capacitor/TTS implementation?) is an open architecture
  question, not yet decided or attempted.
- **Android build/device testing**, blocked on the same missing-SDK/
  no-physical-device constraint the Capacitor spike already
  documented, unresolved by this pivot.

Given all of the above, moving the *whole app* onto this stack is a
multi-week project, not an extension of this session. This spike's
job was narrower and is done: confirm the pipeline actually works and
produces something that looks like a real stylized 3D game character,
not a flat placeholder, before committing more time to it.

## Files
- `blender/build_sprocket.py` — headless Blender build script (run:
  `blender --background --python build_sprocket.py`); outputs
  `sprocket.glb` and `sprocket.blend`.
- `blender/render_preview.py` — Blender-side EEVEE sanity-check render
  (not the real lighting pass — that's Godot's job); outputs
  `preview.png`.
- `godot/` — the Godot 4 project. `project.godot` targets the
  `gl_compatibility` (OpenGL ES3) rendering method deliberately, not
  Forward+/Vulkan, since that's the realistic choice for the lower-end
  Android tablets research note 05 is actually targeting.
  - `models/sprocket.glb` — copy of the Blender export.
  - `shaders/toon.gdshader`, `shaders/outline.gdshader` — the toon
    material and its outline pass.
  - `scenes/preview.tscn` + `scenes/preview.gd` — builds the proof
    scene entirely in code and saves one frame to
    `sprocket_3d_proof.png`. Run via (needs a virtual display since
    this is a real rendered frame, not a headless/dummy one):
    `xvfb-run -a godot4 --path . --rendering-driver opengl3 --resolution 900x1100 scenes/preview.tscn`
  - `export_presets.cfg` — minimal Android debug export preset (arm64
    only, no Gradle build); export itself blocked on the missing SDK.
