// Classic inverted-hull outline: render the same mesh again, flipped to
// show only its back faces, pushed outward along vertex normals. Cheap
// (no edge-detection post-process needed) and reliable across mobile
// GPUs, which is why most toon-shaded mobile games use exactly this
// technique. Attached as a `next_pass` on the toon material so every
// part gets one automatically.
shader_type spatial;
render_mode cull_front, unshaded;

uniform float outline_width : hint_range(0.0, 0.05) = 0.007;
uniform vec4 outline_color : source_color = vec4(0.16, 0.09, 0.05, 1.0);

void vertex() {
	VERTEX += NORMAL * outline_width;
}

void fragment() {
	ALBEDO = outline_color.rgb;
}
