"""Quick Blender-side preview render, just to sanity-check the model's
geometry/materials before handing off to Godot for the real lighting/
shading pass. Run via: blender --background sprocket.blend --python render_preview.py
"""
import bpy
import math
import mathutils

C = bpy.context
D = bpy.data

# Target the character's rough vertical center, not the world origin —
# the model's feet sit at z=-1.02 and its antenna tip at z=2.85.
target_point = mathutils.Vector((0, 0, 0.9))

bpy.ops.object.empty_add(location=target_point)
target = C.active_object
target.name = 'CamTarget'

cam_distance = 6.5
cam_height = 1.6
bpy.ops.object.camera_add(location=(cam_distance * 0.55, -cam_distance * 0.85, cam_height))
cam = C.active_object
C.scene.camera = cam
cam.data.lens = 42
con = cam.constraints.new('TRACK_TO')
con.target = target
con.track_axis = 'TRACK_NEGATIVE_Z'
con.up_axis = 'UP_Y'

# Three-point rig using Sun lamps (Strength = W/m^2, distance-independent
# — far easier to reason about exposure with than Area-light Watts,
# which blew the whole render out white on the first pass). Kept modest
# since the Standard view transform has no highlight rolloff — unlike
# Filmic/AgX, anything over 1.0 just clips flat white.
bpy.ops.object.light_add(type='SUN', location=(4, -4, 6))
key = C.active_object
key.data.energy = 1.15
key.data.angle = math.radians(4)
key.rotation_euler = (math.radians(48), 0, math.radians(40))

bpy.ops.object.light_add(type='SUN', location=(-4, -2, 3))
fill = C.active_object
fill.data.energy = 0.35
fill.data.angle = math.radians(6)
fill.rotation_euler = (math.radians(62), 0, math.radians(-48))

bpy.ops.object.light_add(type='SUN', location=(0, 4, 3))
rim = C.active_object
rim.data.energy = 0.7
rim.data.angle = math.radians(4)
rim.rotation_euler = (math.radians(115), 0, 0)

C.scene.world.use_nodes = True
bg = C.scene.world.node_tree.nodes['Background']
bg_srgb = (0.996, 0.851, 0.71)
bg.inputs[0].default_value = (*[v / 12.92 if v <= 0.04045 else ((v + 0.055) / 1.055) ** 2.4 for v in bg_srgb], 1.0)
bg.inputs[1].default_value = 0.15

C.scene.view_settings.view_transform = 'Standard'
C.scene.render.engine = 'BLENDER_EEVEE'
C.scene.eevee.use_bloom = True
C.scene.eevee.bloom_intensity = 0.04
C.scene.render.resolution_x = 900
C.scene.render.resolution_y = 1100
C.scene.render.film_transparent = False
C.scene.render.filepath = '/home/user/ha-stash/feeling-app/spike-3d/blender/preview.png'
bpy.ops.render.render(write_still=True)
print('Rendered preview.png')
