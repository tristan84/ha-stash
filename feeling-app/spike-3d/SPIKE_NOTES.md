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
