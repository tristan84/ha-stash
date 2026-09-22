"""Headless Blender build script for Sprocket's stylized-3D model.

Run via: blender --background --python build_sprocket.py

Round 3: full redesign matching a specific reference image the user
picked out and said to work from directly — a "kid astronaut" style
robot: a helmet (not a bare robot head) with an actual peach-toned face
visible through the opening, twin antennae with gold tips, red ear
pods, a red crest on the helmet crown, a blue-grey body with orange
shoulder pauldrons and a chest dial, a red hip panel, and jointed limbs
with alternating orange bands at the elbow/knee and a matching
color-blocked hand/boot. Previous rounds kept Sprocket's existing
orange-monochrome 2D silhouette and iterated color/eye-size on top of
it; this round replaces that silhouette with the reference's, since the
user's feedback ("not kiddie/colourful"/"rough sketch") was about the
whole design, not a detail on top of it.

Built from simple primitives deliberately — low polygon counts are what
a real-time toon/cel shader needs to read well, and what a mobile GPU on
a lower-end Android tablet (the actual target hardware per research/05)
can afford at 60fps with several of these on screen. Every limb segment
is deliberately sized to overlap its neighbor (documented inline at each
join) — floating disconnected parts with visible gaps between them was
the single biggest "looks like an unassembled sketch" complaint on the
previous round.

Geometry is modeled in Blender units == the app's existing CSS pixel
scale / 100, and exported to glTF for Godot to import directly — glTF
because it's Godot's best-supported interchange format (PBR material
round-trip, no importer plugin needed).
"""
import bpy
import math

C = bpy.context
D = bpy.data


def clear_scene():
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete(use_global=False)
    for block in (D.meshes, D.materials, D.images):
        for item in list(block):
            if item.users == 0:
                block.remove(item)


def srgb_to_linear(c):
    """Node socket `default_value` colors are linear when set from
    Python (unlike the color-managed sRGB the UI picker shows), so a
    hex-derived palette has to be converted or every material renders
    washed out / too pale."""
    def ch(v):
        return v / 12.92 if v <= 0.04045 else ((v + 0.055) / 1.055) ** 2.4
    return tuple(ch(v) for v in c)


def make_material(name, base_color, emission_color=None, emission_strength=0.0, roughness=0.55, metallic=0.0):
    mat = D.materials.new(name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get('Principled BSDF')
    bsdf.inputs['Base Color'].default_value = (*srgb_to_linear(base_color), 1.0)
    bsdf.inputs['Roughness'].default_value = roughness
    bsdf.inputs['Metallic'].default_value = metallic
    if emission_color:
        bsdf.inputs['Emission Color'].default_value = (*srgb_to_linear(emission_color), 1.0)
        bsdf.inputs['Emission Strength'].default_value = emission_strength
    return mat


def shade_smooth(obj):
    for poly in obj.data.polygons:
        poly.use_smooth = True


# --- Palette v3: matches the reference image directly — a soft
# blue-grey "spacesuit" base, dark navy trim/joint bands, and two warm
# accents (red, orange) plus yellow boots, with an actual peach face
# instead of a screen/visor. -----------------------------------------
BASE_BLUE = (0.54, 0.67, 0.70)        # darker/more saturated than the reference's flat hex — a pale color like #A8C2C7 clips to near-white under any real lighting, so it needs headroom baked in
TRIM_DARK = (0.14, 0.18, 0.23)        # collar, elbow/ankle-adjacent trim
ACCENT_RED = (0.85, 0.33, 0.27)       # #D95445 — ear pods, hands, hip panel, crest
ACCENT_ORANGE = (0.95, 0.62, 0.12)    # #F29E1F — shoulders, chest dial, knee/ankle bands
ACCENT_YELLOW = (0.97, 0.80, 0.12)    # #F7CC1F — boots, antenna tips
FACE_SKIN = (0.95, 0.80, 0.64)        # peach face visible through the helmet
EYE_WHITE = (1.0, 1.0, 1.0)
EYE_BLUE = (0.20, 0.55, 0.82)
PUPIL_COLOR = (0.08, 0.09, 0.11)
CHEEK_COLOR = (0.98, 0.55, 0.52)      # soft coral-pink

mat_base = None
mat_trim = None
mat_red = None
mat_orange = None
mat_yellow = None
mat_skin = None
mat_eye_white = None
mat_eye_blue = None
mat_pupil = None
mat_cheek = None


def build_materials():
    global mat_base, mat_trim, mat_red, mat_orange, mat_yellow, mat_skin
    global mat_eye_white, mat_eye_blue, mat_pupil, mat_cheek
    mat_base = make_material('MatBase', BASE_BLUE, roughness=0.4)
    mat_trim = make_material('MatTrim', TRIM_DARK, roughness=0.35)
    mat_red = make_material('MatRed', ACCENT_RED, roughness=0.4)
    mat_orange = make_material('MatOrange', ACCENT_ORANGE, roughness=0.35)
    mat_yellow = make_material('MatYellow', ACCENT_YELLOW, roughness=0.35)
    mat_skin = make_material('MatSkin', FACE_SKIN, roughness=0.5)
    mat_eye_white = make_material('MatEyeWhite', EYE_WHITE, roughness=0.2)
    mat_eye_blue = make_material('MatEyeBlue', EYE_BLUE, emission_color=EYE_BLUE, emission_strength=0.25, roughness=0.15)
    mat_pupil = make_material('MatPupil', PUPIL_COLOR, roughness=0.3)
    mat_cheek = make_material('MatCheek', CHEEK_COLOR, roughness=0.6)


def add_uv_sphere(name, radius, loc, mat, segments=24, rings=16, scale=(1, 1, 1)):
    bpy.ops.mesh.primitive_uv_sphere_add(radius=radius, location=loc, segments=segments, ring_count=rings)
    obj = C.active_object
    obj.name = name
    obj.scale = scale
    obj.data.materials.append(mat)
    shade_smooth(obj)
    return obj


def add_cylinder(name, radius, depth, loc, mat, rot=(0, 0, 0), vertices=20, scale=(1, 1, 1)):
    bpy.ops.mesh.primitive_cylinder_add(radius=radius, depth=depth, location=loc, vertices=vertices)
    obj = C.active_object
    obj.name = name
    obj.rotation_euler = rot
    obj.scale = scale
    obj.data.materials.append(mat)
    shade_smooth(obj)
    return obj


def add_rounded_box(name, size, loc, mat, bevel=0.15, segments=3, rot=(0, 0, 0)):
    """Cube with a bevel modifier applied (destructively) for a soft
    rounded-rect look."""
    bpy.ops.mesh.primitive_cube_add(size=1, location=loc)
    obj = C.active_object
    obj.name = name
    obj.scale = size
    obj.rotation_euler = rot
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    mod = obj.modifiers.new('Bevel', 'BEVEL')
    mod.width = bevel
    mod.segments = segments
    mod.limit_method = 'ANGLE'
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.modifier_apply(modifier='Bevel')
    obj.data.materials.append(mat)
    shade_smooth(obj)
    return obj


def add_antenna(root, x_sign):
    """Angled rod + gold tip, symmetric left/right — the reference has
    two antennae, not one central one."""
    bx, by, bz = x_sign * 0.5, 0.02, 2.36
    tx, ty, tz = x_sign * 0.74, 0.02, 2.76
    mx, my, mz = (bx + tx) / 2, (by + ty) / 2, (bz + tz) / 2
    dx, dz = tx - bx, tz - bz
    length = math.sqrt(dx * dx + dz * dz)
    angle = math.atan2(dx, dz)
    side = 'L' if x_sign < 0 else 'R'
    rod = add_cylinder(f'AntennaRod{side}', 0.026, length, (mx, my, mz), mat_base, rot=(0, angle, 0), vertices=8)
    rod.parent = root
    tip = add_uv_sphere(f'AntennaTip{side}', 0.09, (tx, ty, tz), mat_yellow, segments=12, rings=8)
    tip.parent = root


def add_arm(root, x_sign):
    """Shoulder pauldron -> upper arm -> elbow band -> forearm -> hand,
    each segment sized to overlap the next (see module docstring) so
    the limb reads as one continuous connected form instead of floating
    separate blobs."""
    side = 'L' if x_sign < 0 else 'R'
    ax = x_sign * 0.78

    pauldron = add_uv_sphere(f'Pauldron{side}', 0.24, (x_sign * 0.75, -0.1, 0.38), mat_orange,
                              segments=14, rings=10, scale=(1, 1, 0.8))
    pauldron.parent = root

    upper = add_uv_sphere(f'UpperArm{side}', 0.24, (ax, 0, 0.28), mat_base,
                           segments=14, rings=10, scale=(0.85, 0.85, 1.3))
    upper.parent = root

    elbow = add_cylinder(f'Elbow{side}', 0.19, 0.12, (ax, 0, -0.06), mat_trim, rot=(math.radians(90), 0, 0), vertices=14)
    elbow.parent = root

    forearm = add_uv_sphere(f'Forearm{side}', 0.20, (ax * 1.02, 0, -0.32), mat_base,
                             segments=14, rings=10, scale=(0.8, 0.8, 1.2))
    forearm.parent = root

    hand = add_uv_sphere(f'Hand{side}', 0.17, (ax * 1.02, -0.02, -0.58), mat_red, segments=14, rings=10)
    hand.parent = root


def add_leg(root, x_sign):
    """Thigh -> knee band -> shin -> ankle band -> boot, same
    overlap-by-construction approach as the arms."""
    side = 'L' if x_sign < 0 else 'R'
    lx = x_sign * 0.4

    thigh = add_rounded_box(f'Thigh{side}', (0.32, 0.32, 0.34), (lx, 0, -0.55), mat_base, bevel=0.12, segments=3)
    thigh.parent = root

    knee = add_rounded_box(f'Knee{side}', (0.34, 0.34, 0.1), (lx, 0, -0.74), mat_orange, bevel=0.04, segments=3)
    knee.parent = root

    shin = add_rounded_box(f'Shin{side}', (0.30, 0.30, 0.30), (lx, 0, -0.93), mat_base, bevel=0.1, segments=3)
    shin.parent = root

    ankle = add_rounded_box(f'Ankle{side}', (0.32, 0.34, 0.08), (lx, 0, -1.07), mat_orange, bevel=0.03, segments=3)
    ankle.parent = root

    boot = add_rounded_box(f'Boot{side}', (0.4, 0.55, 0.18), (lx, -0.08, -1.18), mat_yellow, bevel=0.07, segments=3)
    boot.parent = root


def build_sprocket():
    build_materials()

    root = D.objects.new('Sprocket', None)
    C.collection.objects.link(root)

    # Helmet — same big rounded-sphere silhouette as previous rounds,
    # now read as a literal astronaut-style helmet (base-blue shell)
    # rather than the character's bare head.
    helmet = add_uv_sphere('Helmet', 1.0, (0, 0, 1.55), mat_base, scale=(1.0, 0.92, 1.0))
    helmet.parent = root

    # Dark trim frame around the face opening, sitting just behind the
    # face plate so a thin dark border shows at its edge (matches the
    # reference's helmet-opening ring) — bigger than the face plate and
    # placed slightly further back (less negative Y). Sized much larger
    # than round 3's first pass: that version left most of the helmet a
    # bald dome with a small face tucked to one side, which combined
    # with bulging eyes read as an alien/insect head rather than a kid
    # in a helmet. The face opening now takes up most of the helmet's
    # front, matching the reference's proportions.
    trim_frame = add_rounded_box('FaceTrim', (1.42, 0.26, 1.0), (0, -0.78, 1.58), mat_trim, bevel=0.32, segments=6)
    trim_frame.parent = root

    # Face plate — peach skin, not a screen.
    face = add_rounded_box('Face', (1.3, 0.3, 0.9), (0, -0.84, 1.58), mat_skin, bevel=0.28, segments=6)
    face.parent = root

    # Eyes — flat layered discs (a cylinder rotated to face the camera,
    # not a sphere) so they read as big round eyes drawn on the face
    # instead of eyeballs bulging out on stalks, which is what full
    # spheres protruding progressively further forward looked like.
    # Each disc is only slightly proud of the one behind it.
    for x_sign in (-1, 1):
        side = 'L' if x_sign < 0 else 'R'
        ex = x_sign * 0.34
        disc_rot = (math.radians(90), 0, 0)
        white = add_cylinder(f'EyeWhite{side}', 0.20, 0.05, (ex, -1.0, 1.76), mat_eye_white, rot=disc_rot, vertices=24)
        white.parent = root
        iris = add_cylinder(f'EyeIris{side}', 0.13, 0.045, (ex, -1.035, 1.76), mat_eye_blue, rot=disc_rot, vertices=20)
        iris.parent = root
        pupil = add_cylinder(f'Pupil{side}', 0.065, 0.035, (ex, -1.065, 1.76), mat_pupil, rot=disc_rot, vertices=16)
        pupil.parent = root
        highlight = add_uv_sphere(f'EyeHighlight{side}', 0.022, (ex - 0.045, -1.09, 1.81), mat_eye_white, segments=8, rings=6)
        highlight.parent = root

    # Tiny nose highlight, centered below the eyes.
    nose = add_uv_sphere('Nose', 0.024, (0, -1.0, 1.52), mat_eye_white, segments=8, rings=6)
    nose.parent = root

    # Smile — a beveled Bezier arc (same idea as the 2D app's
    # `stroke-linecap="round"` smile path).
    curve = D.curves.new('MouthCurve', type='CURVE')
    curve.dimensions = '3D'
    curve.bevel_depth = 0.032
    curve.bevel_resolution = 4
    spline = curve.splines.new('BEZIER')
    spline.bezier_points.add(2)
    pts = [(-0.22, -0.97, 1.38), (0, -1.03, 1.29), (0.22, -0.97, 1.38)]
    for i, p in enumerate(pts):
        bp = spline.bezier_points[i]
        bp.co = p
        bp.handle_left_type = 'AUTO'
        bp.handle_right_type = 'AUTO'
    mouth_obj = D.objects.new('Mouth', curve)
    C.collection.objects.link(mouth_obj)
    bpy.ops.object.select_all(action='DESELECT')
    mouth_obj.select_set(True)
    C.view_layer.objects.active = mouth_obj
    bpy.ops.object.convert(target='MESH')
    mouth = C.active_object
    mouth.data.materials.append(mat_trim)
    mouth.parent = root

    cheek_l = add_uv_sphere('CheekLeft', 0.13, (-0.46, -0.98, 1.40), mat_cheek, segments=12, rings=8, scale=(1, 0.5, 0.75))
    cheek_l.parent = root
    cheek_r = add_uv_sphere('CheekRight', 0.13, (0.46, -0.98, 1.40), mat_cheek, segments=12, rings=8, scale=(1, 0.5, 0.75))
    cheek_r.parent = root

    # Ear pods — red rounded "pods" on the helmet sides (matches the
    # reference's larger red ear modules; previous rounds used small
    # body-colored ovals here).
    ear_l = add_rounded_box('EarPodLeft', (0.22, 0.22, 0.36), (-1.02, 0, 1.5), mat_red, bevel=0.09, segments=4)
    ear_l.parent = root
    ear_r = add_rounded_box('EarPodRight', (0.22, 0.22, 0.36), (1.02, 0, 1.5), mat_red, bevel=0.09, segments=4)
    ear_r.parent = root

    # Red crest on the helmet crown.
    crest = add_rounded_box('Crest', (0.16, 0.17, 0.26), (0, 0, 2.56), mat_red, bevel=0.06, segments=3)
    crest.parent = root

    add_antenna(root, -1)
    add_antenna(root, 1)

    # Neck — a sphere's cross-section shrinks to a literal point at its
    # pole, so the helmet (a sphere) tapers to zero width right where
    # it meets the body; the original small flat collar block sat above
    # that taper and didn't reach down far enough, leaving a visible gap
    # between helmet and shoulders. A wider, taller cylinder spanning
    # well into both the helmet's lower curve and the body's top
    # closes it solidly (also reads as the reference's dark collar
    # ring, just doing double duty as the structural connector).
    neck = add_cylinder('Neck', 0.42, 0.42, (0, 0, 0.58), mat_trim, vertices=20)
    neck.parent = root

    body = add_rounded_box('Body', (1.35, 0.95, 0.85), (0, 0, 0.02), mat_base, bevel=0.35, segments=4)
    body.parent = root

    # Chest dial — a small flat control-panel detail instead of the
    # previous rounds' big glowing core, matching the reference's
    # concentric-circle chest button.
    dial_outer = add_uv_sphere('DialOuter', 0.22, (0, -0.60, 0.16), mat_orange, segments=18, rings=12, scale=(1, 0.3, 1))
    dial_outer.parent = root
    dial_inner = add_uv_sphere('DialInner', 0.12, (0, -0.66, 0.16), mat_trim, segments=16, rings=10, scale=(1, 0.3, 1))
    dial_inner.parent = root
    dial_button = add_uv_sphere('DialButton', 0.075, (0, -0.62, -0.14), mat_orange, segments=14, rings=8, scale=(1, 0.3, 1))
    dial_button.parent = root

    # Waist stripe and hip panel — the reference's two-tone lower torso
    # (orange band, then a red panel below it before the legs begin).
    waist = add_rounded_box('WaistStripe', (1.4, 1.0, 0.22), (0, 0, -0.22), mat_orange, bevel=0.1, segments=3)
    waist.parent = root
    hip = add_rounded_box('HipPanel', (1.05, 0.9, 0.28), (0, 0, -0.30), mat_red, bevel=0.14, segments=3)
    hip.parent = root

    add_arm(root, -1)
    add_arm(root, 1)
    add_leg(root, -1)
    add_leg(root, 1)

    return root


if __name__ == '__main__':
    clear_scene()
    build_sprocket()

    # Ground plane for a preview render's shadow catcher.
    bpy.ops.mesh.primitive_plane_add(size=20, location=(0, 0, -1.27))
    ground = C.active_object
    ground.name = 'Ground'
    ground_mat = make_material('Ground', (0.98, 0.88, 0.75), roughness=0.9)
    ground.data.materials.append(ground_mat)

    out_path = '/home/user/ha-stash/feeling-app/spike-3d/blender/sprocket.glb'
    bpy.ops.object.select_all(action='DESELECT')
    for obj in D.objects:
        if obj.name != 'Ground':
            obj.select_set(True)
    bpy.ops.export_scene.gltf(
        filepath=out_path,
        use_selection=True,
        export_format='GLB',
        export_yup=True,
    )
    print(f'Exported {out_path}')

    blend_path = '/home/user/ha-stash/feeling-app/spike-3d/blender/sprocket.blend'
    bpy.ops.wm.save_as_mainfile(filepath=blend_path)
    print(f'Saved {blend_path}')
