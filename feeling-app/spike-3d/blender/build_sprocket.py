"""Headless Blender build script for Sprocket's stylized-3D model.

Run via: blender --background --python build_sprocket.py

Keeps the same silhouette as the 2D character (academy-icons.js /
style.css): a big rounded head with a dark lit visor, two ear pods, a
top antenna with a glowing tip, a rounded body with a glowing core, and
stubby arms/legs. Built from simple primitives deliberately — low
polygon counts and clean shapes are what a real-time toon/cel shader
needs to read well, and it's what a mobile GPU on a lower-end Android
tablet (the actual target hardware per research/05) can afford at 60fps
with several of these on screen at once.

Geometry is modeled in Blender units == the app's existing CSS pixel
scale / 100 (so 1 Blender unit == roughly the character's own head
radius), and exported to glTF for Godot to import directly — glTF
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
    Python (unlike the color-managed sRGB the UI picker shows), so the
    app's existing hex palette has to be converted or every material
    renders washed out / too pale — this was the actual cause of the
    first two preview renders looking bleached rather than vivid."""
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


# --- Palette v2: redesigned after the first 3D pass read as a flat
# monochrome-orange blob rather than a "kiddie/colourful" cartoon
# robot. Reference pulled from Baymax (soft huggable roundness — kept,
# see geometry below), WALL-E (giant expressive eyes carry all the
# character's emotion — the single biggest fix here, eyes roughly 45%
# bigger and the visor built around them rather than the other way
# round) and the general "2-3 contrasting bright colors, not one hue"
# color-blocking every actual kids' robot toy/character uses (Rescue
# Bots, Rosie the Robot, BMO): body stays warm orange for brand
# continuity with the 2D app, but the visor is now a bright glowing
# teal "screen" instead of a near-black camera lens, the core/antenna
# match that teal as a genuine second hue rather than a same-family
# gold, and hands/feet/cheeks get their own distinct pops instead of
# every part being a shade of the same orange. -----------------------
BODY_COLOR = (1.0, 0.46, 0.16)       # #ff752a — punchier, more saturated orange
VISOR_COLOR = (0.11, 0.87, 0.80)     # #1ddece — bright teal "lit screen", not a dark lens
EYE_COLOR = (1.0, 1.0, 1.0)          # pure white, max contrast against the teal visor
PUPIL_COLOR = (0.09, 0.1, 0.13)      # near-black pupil dot for life/focus
CHEEK_COLOR = (1.0, 0.29, 0.55)      # #ff4a8c — vivid hot pink, not muted salmon
CORE_COLOR = (0.15, 0.92, 0.85)      # teal, matches the visor — a real second hue, not gold-on-orange
ANTENNA_TIP = (1.0, 0.82, 0.15)      # #ffd126 — bright yellow pop, third accent color
FOOT_COLOR = (1.0, 0.82, 0.15)       # matches antenna tip — yellow hands/feet color-block

mat_body = None
mat_visor = None
mat_eye = None
mat_pupil = None
mat_cheek = None
mat_core = None
mat_core_ring = None
mat_antenna_tip = None
mat_foot = None


def build_materials():
    global mat_body, mat_visor, mat_eye, mat_pupil, mat_cheek, mat_core, mat_core_ring, mat_antenna_tip, mat_foot
    mat_body = make_material('SprocketBody', BODY_COLOR, roughness=0.4)
    mat_visor = make_material('SprocketVisor', VISOR_COLOR, emission_color=VISOR_COLOR, emission_strength=0.35, roughness=0.2)
    mat_eye = make_material('SprocketEye', EYE_COLOR, emission_color=EYE_COLOR, emission_strength=0.5, roughness=0.15)
    mat_pupil = make_material('SprocketPupil', PUPIL_COLOR, roughness=0.3)
    mat_cheek = make_material('SprocketCheek', CHEEK_COLOR, roughness=0.6)
    mat_core = make_material('SprocketCore', (1.0, 0.97, 0.89), emission_color=(1.0, 0.97, 0.89), emission_strength=1.6, roughness=0.15)
    # Outer ring teal, inner disc bright cream — same white-hot-center-
    # fading-to-accent-color arrangement as the 2D app's acadCoreGrad,
    # just with the accent swapped from gold to the new teal hue.
    mat_core_ring = make_material('SprocketCoreRing', CORE_COLOR, emission_color=CORE_COLOR, emission_strength=0.9, roughness=0.3)
    mat_antenna_tip = make_material('SprocketAntennaTip', ANTENNA_TIP, emission_color=ANTENNA_TIP, emission_strength=2.2, roughness=0.2)
    mat_foot = make_material('SprocketFoot', FOOT_COLOR, roughness=0.5)


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


def add_cube(name, size, loc, mat, rot=(0, 0, 0)):
    bpy.ops.mesh.primitive_cube_add(size=size, location=loc)
    obj = C.active_object
    obj.name = name
    obj.rotation_euler = rot
    obj.data.materials.append(mat)
    bpy.ops.object.shade_smooth()
    for poly in obj.data.polygons:
        poly.use_smooth = False
    return obj


def add_rounded_box(name, size, loc, mat, bevel=0.15, segments=3, rot=(0, 0, 0)):
    """Cube with a bevel modifier applied (destructively) for the soft
    rounded-rect look the 2D character's body/collar/feet already use."""
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


def build_sprocket():
    build_materials()

    root = D.objects.new('Sprocket', None)
    C.collection.objects.link(root)

    # Head — big rounded sphere, flattened very slightly front-to-back
    # to leave room for the visor to read as inset rather than painted on.
    head = add_uv_sphere('Head', 1.0, (0, 0, 1.55), mat_body, scale=(1.0, 0.94, 1.0))
    head.parent = root

    # Visor — bright glowing teal "screen" (not a dark camera lens),
    # sized around the bigger eyes below rather than the other way
    # round: WALL-E's giant expressive eyes are the single biggest
    # "reads as friendly" lever of any reference pulled for this pass,
    # so the eyes drive the layout here.
    visor = add_rounded_box('Visor', (0.88, 0.3, 0.56), (0, -0.86, 1.56), mat_visor, bevel=0.2, segments=4)
    visor.parent = root

    eye_l = add_uv_sphere('EyeLeft', 0.185, (-0.29, -1.02, 1.62), mat_eye, segments=16, rings=12)
    eye_l.parent = root
    eye_r = add_uv_sphere('EyeRight', 0.185, (0.29, -1.02, 1.62), mat_eye, segments=16, rings=12)
    eye_r.parent = root

    # Small dark pupils, offset slightly down-and-forward on each eye —
    # gives the big white eyes a focal point/gaze instead of reading as
    # blank glowing balls (also matches Baymax's simple two-dot face).
    pupil_l = add_uv_sphere('PupilLeft', 0.075, (-0.285, -1.14, 1.6), mat_pupil, segments=12, rings=8)
    pupil_l.parent = root
    pupil_r = add_uv_sphere('PupilRight', 0.075, (0.285, -1.14, 1.6), mat_pupil, segments=12, rings=8)
    pupil_r.parent = root

    # Smile — a beveled Bezier arc (same idea as the 2D app's
    # `stroke-linecap="round"` smile path), not a full torus ring: a
    # full ring reads as a shocked "O", not a smile.
    curve = D.curves.new('MouthCurve', type='CURVE')
    curve.dimensions = '3D'
    curve.bevel_depth = 0.032
    curve.bevel_resolution = 4
    spline = curve.splines.new('BEZIER')
    spline.bezier_points.add(2)
    pts = [(-0.2, -0.96, 1.3), (0, -1.02, 1.22), (0.2, -0.96, 1.3)]
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
    mouth.data.materials.append(mat_eye)
    mouth.parent = root

    cheek_l = add_uv_sphere('CheekLeft', 0.14, (-0.66, -0.74, 1.2), mat_cheek, segments=12, rings=8, scale=(1, 0.6, 0.7))
    cheek_l.parent = root
    cheek_r = add_uv_sphere('CheekRight', 0.14, (0.66, -0.74, 1.2), mat_cheek, segments=12, rings=8, scale=(1, 0.6, 0.7))
    cheek_r.parent = root

    ear_l = add_uv_sphere('EarLeft', 0.24, (-1.05, 0, 1.5), mat_body, segments=16, rings=12, scale=(0.7, 1, 1.3))
    ear_l.parent = root
    ear_r = add_uv_sphere('EarRight', 0.24, (1.05, 0, 1.5), mat_body, segments=16, rings=12, scale=(0.7, 1, 1.3))
    ear_r.parent = root

    antenna = add_cylinder('Antenna', 0.035, 0.5, (0, 0, 2.55), mat_body, vertices=10)
    antenna.parent = root
    antenna_tip = add_uv_sphere('AntennaTip', 0.11, (0, 0, 2.85), mat_antenna_tip, segments=14, rings=10)
    antenna_tip.parent = root

    collar = add_rounded_box('Collar', (0.55, 0.32, 0.16), (0, 0, 0.72), mat_foot, bevel=0.06, segments=3)
    collar.parent = root

    body = add_rounded_box('Body', (1.35, 0.95, 0.85), (0, 0, 0.02), mat_body, bevel=0.35, segments=4)
    body.parent = root

    core_ring = add_uv_sphere('CoreRing', 0.42, (0, -0.62, 0.06), mat_core_ring, segments=20, rings=14, scale=(1, 0.35, 1))
    core_ring.parent = root
    core = add_uv_sphere('Core', 0.3, (0, -0.7, 0.06), mat_core, segments=20, rings=14, scale=(1, 0.35, 1))
    core.parent = root

    # Hands share the yellow accent with the feet/collar/antenna tip —
    # matching the classic toy-robot color-blocking (2-3 contrasting
    # colors, hands and feet usually the same accent) rather than
    # every limb being the same shade as the body.
    arm_l = add_uv_sphere('ArmLeft', 0.26, (-1.45, 0, 0.15), mat_foot, segments=14, rings=10, scale=(0.8, 0.9, 1.6))
    arm_l.parent = root
    arm_r = add_uv_sphere('ArmRight', 0.26, (1.45, 0, 0.15), mat_foot, segments=14, rings=10, scale=(0.8, 0.9, 1.6))
    arm_r.parent = root

    leg_l = add_rounded_box('LegLeft', (0.34, 0.34, 0.55), (-0.42, 0, -0.7), mat_body, bevel=0.12, segments=3)
    leg_l.parent = root
    leg_r = add_rounded_box('LegRight', (0.34, 0.34, 0.55), (0.42, 0, -0.7), mat_body, bevel=0.12, segments=3)
    leg_r.parent = root

    foot_l = add_rounded_box('FootLeft', (0.4, 0.55, 0.16), (-0.42, -0.08, -1.02), mat_foot, bevel=0.06, segments=3)
    foot_l.parent = root
    foot_r = add_rounded_box('FootRight', (0.4, 0.55, 0.16), (0.42, -0.08, -1.02), mat_foot, bevel=0.06, segments=3)
    foot_r.parent = root

    return root


if __name__ == '__main__':
    clear_scene()
    build_sprocket()

    # Ground plane for a preview render's shadow catcher.
    bpy.ops.mesh.primitive_plane_add(size=20, location=(0, 0, -1.02))
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
