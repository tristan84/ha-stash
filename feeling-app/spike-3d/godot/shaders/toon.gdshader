// Stylized toon/cel material for Sprocket's 3D parts. Leans on Godot's
// built-in `diffuse_toon`/`specular_toon` render modes (a banded BRDF)
// rather than a hand-rolled light() override — far less risk of getting
// shadow/attenuation handling subtly wrong for a spike, and it already
// gives the flat-shaded-with-a-crisp-highlight "premium mobile game"
// look the reference research (Baymax-style soft rounded toon
// characters) pointed at. RIM/RIM_TINT add the edge glow that sells
// real-time lighting on a rounded character, on top of whatever flat
// base_color the source Blender material carried over from glTF.
shader_type spatial;
render_mode blend_mix, cull_back, diffuse_toon, specular_toon;

uniform vec4 albedo_color : source_color = vec4(1.0, 1.0, 1.0, 1.0);
uniform vec4 emission_color : source_color = vec4(0.0, 0.0, 0.0, 1.0);
uniform float emission_strength : hint_range(0.0, 6.0) = 0.0;
uniform float roughness_value : hint_range(0.0, 1.0) = 0.4;
uniform float rim_amount : hint_range(0.0, 1.0) = 0.45;
uniform float rim_tint_amount : hint_range(0.0, 1.0) = 0.55;

void fragment() {
	ALBEDO = albedo_color.rgb;
	ROUGHNESS = roughness_value;
	SPECULAR = 0.25;
	RIM = rim_amount;
	RIM_TINT = rim_tint_amount;
	EMISSION = emission_color.rgb * emission_strength;
}
