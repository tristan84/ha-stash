extends Node3D
## Builds the preview scene entirely in code (lighting rig, environment,
## camera, toon-shaded model) rather than hand-authoring a .tscn, then
## grabs one frame to a PNG and quits — this is the pipeline-proof
## harness for the headless CLI environment; the real app will build
## this scene data-driven per screen instead.

func _ready() -> void:
	_build_environment()
	_build_lights()
	_build_camera()
	var model := _load_model()
	add_child(model)
	_apply_toon_materials(model)

	await get_tree().process_frame
	await get_tree().process_frame
	await get_tree().process_frame
	await get_tree().process_frame
	var img := get_viewport().get_texture().get_image()
	var out_path := "/home/user/ha-stash/feeling-app/spike-3d/godot/preview_godot.png"
	var err := img.save_png(out_path)
	if err != OK:
		printerr("save_png failed: ", err)
	else:
		print("Saved ", out_path)
	get_tree().quit()


func _build_environment() -> void:
	var env := Environment.new()
	env.background_mode = Environment.BG_COLOR
	# Color() literals are linear, not sRGB — passing hex-derived values
	# straight through double-brightens on display (the same bug the
	# Blender script hit), so every color here goes through
	# srgb_to_linear() to land at its intended on-screen value.
	env.background_color = Color(0.996, 0.851, 0.71).srgb_to_linear()
	env.ambient_light_source = Environment.AMBIENT_SOURCE_COLOR
	env.ambient_light_color = Color(0.996, 0.851, 0.71).srgb_to_linear()
	env.ambient_light_energy = 0.12
	# Glow/bloom kept off for now: even heavily constrained (2 mip
	# levels, high threshold) it still washed the whole canvas toward
	# white rather than a tight halo around emissive parts — needs
	# interactive tuning in the actual editor to track down (this
	# sandbox has no live viewport to inspect the glow buffer directly).
	# The emissive materials themselves (eyes/core/antenna tip) already
	# read as glowing from their EMISSION alone; see SPIKE_NOTES.md.
	env.glow_enabled = false
	# ACES's photographic highlight rolloff desaturates bright saturated
	# colors toward pale yellow/white — great for realism, wrong for a
	# flat-colored toon character where the lit side should stay just as
	# vivid as the shadow side. Linear keeps the flat-color read intact.
	env.tonemap_mode = Environment.TONE_MAPPER_LINEAR

	var world_env := WorldEnvironment.new()
	world_env.environment = env
	add_child(world_env)


func _build_lights() -> void:
	var key := DirectionalLight3D.new()
	key.rotation_degrees = Vector3(-48, -40, 0)
	key.light_energy = 0.5
	key.light_color = Color(1.0, 0.97, 0.9).srgb_to_linear()
	key.shadow_enabled = true
	add_child(key)

	# Fill/rim are diffuse-only fills, not extra specular sources — full
	# specular on all three lights was drawing three separate toon
	# highlight streaks across the face instead of one clean one.
	var fill := DirectionalLight3D.new()
	fill.rotation_degrees = Vector3(-62, 132, 0)
	fill.light_energy = 0.18
	fill.light_color = Color(0.85, 0.88, 1.0).srgb_to_linear()
	fill.light_specular = 0.0
	add_child(fill)

	var rim := DirectionalLight3D.new()
	rim.rotation_degrees = Vector3(-115, 180, 0)
	rim.light_energy = 0.32
	rim.light_color = Color(1.0, 0.85, 0.65).srgb_to_linear()
	rim.light_specular = 0.0
	add_child(rim)


func _build_camera() -> void:
	var cam := Camera3D.new()
	cam.position = Vector3(3.6, 1.9, 5.6)
	add_child(cam)
	cam.look_at(Vector3(0, 0.9, 0), Vector3.UP)
	cam.fov = 40
	cam.current = true


func _load_model() -> Node3D:
	var packed: PackedScene = load("res://models/sprocket.glb")
	return packed.instantiate()


func _apply_toon_materials(node: Node) -> void:
	if node is MeshInstance3D:
		var mesh_inst := node as MeshInstance3D
		var mesh := mesh_inst.mesh
		if mesh:
			for i in mesh.get_surface_count():
				var orig := mesh_inst.get_active_material(i)
				var shader_mat := ShaderMaterial.new()
				shader_mat.shader = load("res://shaders/toon.gdshader")
				var albedo := Color(1, 1, 1)
				var emission := Color(0, 0, 0)
				var emission_energy := 0.0
				var rough := 0.4
				if orig is StandardMaterial3D:
					var std := orig as StandardMaterial3D
					albedo = std.albedo_color
					rough = std.roughness
					if std.emission_enabled:
						emission = std.emission
						emission_energy = std.emission_energy_multiplier
				# Blender/EEVEE's emission-strength units don't map 1:1
				# onto Godot's HDR/ACES exposure — passed through as-is
				# these blew out to solid white under bloom, so scale
				# down at the handoff rather than re-tuning per asset.
				shader_mat.set_shader_parameter("albedo_color", albedo)
				shader_mat.set_shader_parameter("emission_color", emission)
				shader_mat.set_shader_parameter("emission_strength", emission_energy * 0.3)
				shader_mat.set_shader_parameter("roughness_value", max(rough, 0.45))

				var outline_mat := ShaderMaterial.new()
				outline_mat.shader = load("res://shaders/outline.gdshader")
				shader_mat.next_pass = outline_mat

				mesh_inst.set_surface_override_material(i, shader_mat)
	for child in node.get_children():
		_apply_toon_materials(child)
