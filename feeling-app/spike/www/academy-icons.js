// Custom-illustrated icon set for Feelings Academy — replaces raw
// system emoji (😟🌬️✋…) with hand-drawn SVG in the same gradient/
// shading/gloss-highlight style as Sprocket's own character art,
// instead of relying on the OS's built-in emoji font. Raw emoji is
// the single biggest "this is a prototype" tell regardless of how
// good the underlying game mechanics are — every platform renders it
// differently and none of them match this app's warm, soft-shaded
// visual language.
//
// Injected once per page as an invisible <svg><defs> block (same
// pattern as every book's shared symbol defs), then referenced via
// <svg class="icon"><use href="#face-worried"/></svg> anywhere an
// emoji used to go. Colors are pulled from each level's own
// accent/accentSoft in academy-data.js, so a face's shading always
// matches its node color on the map.

const ACADEMY_ICON_DEFS = `
<defs>
  <radialGradient id="faceGrad-worried" cx="35%" cy="28%" r="80%">
    <stop offset="0%" stop-color="#fff4e2" /><stop offset="55%" stop-color="#ffb15e" /><stop offset="100%" stop-color="#f0873a" />
  </radialGradient>
  <radialGradient id="faceGrad-frustrated" cx="35%" cy="28%" r="80%">
    <stop offset="0%" stop-color="#ffe6dc" /><stop offset="55%" stop-color="#ff8a5e" /><stop offset="100%" stop-color="#e05a3c" />
  </radialGradient>
  <radialGradient id="faceGrad-excited" cx="35%" cy="28%" r="80%">
    <stop offset="0%" stop-color="#fff6d9" /><stop offset="55%" stop-color="#ffcf5e" /><stop offset="100%" stop-color="#f0a800" />
  </radialGradient>
  <radialGradient id="faceGrad-sad" cx="35%" cy="28%" r="80%">
    <stop offset="0%" stop-color="#f2e6ef" /><stop offset="55%" stop-color="#c288b3" /><stop offset="100%" stop-color="#a3628f" />
  </radialGradient>
  <radialGradient id="faceGrad-angry" cx="35%" cy="28%" r="80%">
    <stop offset="0%" stop-color="#ffe0d2" /><stop offset="55%" stop-color="#ff6a45" /><stop offset="100%" stop-color="#e0431f" />
  </radialGradient>
  <radialGradient id="faceGrad-scared" cx="35%" cy="28%" r="80%">
    <stop offset="0%" stop-color="#ede4ed" /><stop offset="55%" stop-color="#a87ea8" /><stop offset="100%" stop-color="#8a5c8a" />
  </radialGradient>
  <radialGradient id="faceGrad-embarrassed" cx="35%" cy="28%" r="80%">
    <stop offset="0%" stop-color="#ffe6f0" /><stop offset="55%" stop-color="#ff85ad" /><stop offset="100%" stop-color="#e0568f" />
  </radialGradient>
  <radialGradient id="faceGrad-proud" cx="35%" cy="28%" r="80%">
    <stop offset="0%" stop-color="#fff2d2" /><stop offset="55%" stop-color="#ffc94d" /><stop offset="100%" stop-color="#e8a300" />
  </radialGradient>
  <radialGradient id="faceGrad-overwhelmed" cx="35%" cy="28%" r="80%">
    <stop offset="0%" stop-color="#f0ebe0" /><stop offset="55%" stop-color="#b6a17c" /><stop offset="100%" stop-color="#967f5c" />
  </radialGradient>
  <radialGradient id="faceGrad-happy" cx="35%" cy="28%" r="80%">
    <stop offset="0%" stop-color="#fff8e2" /><stop offset="55%" stop-color="#ffd670" /><stop offset="100%" stop-color="#f0b347" />
  </radialGradient>
  <radialGradient id="toolGlow" cx="50%" cy="40%" r="70%">
    <stop offset="0%" stop-color="#fff4e2" /><stop offset="100%" stop-color="#ffd9a8" />
  </radialGradient>
  <linearGradient id="acadBodyGrad" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0%" stop-color="#ffb15e" /><stop offset="100%" stop-color="#f0873a" />
  </linearGradient>
  <radialGradient id="acadCoreGrad" cx="35%" cy="30%" r="75%">
    <stop offset="0%" stop-color="#fff8e8" /><stop offset="100%" stop-color="#ffd35e" />
  </radialGradient>

  <!-- ===== Sprocket, full detail (same construction as the story
       books' character) — used everywhere the Academy shows Sprocket
       instead of the earlier flat CSS-shape stand-in. Cosmetics are
       separate symbols sharing this exact 0-120x0-150 coordinate
       space so they can be composited with <use> at any scale and
       still land in the right spot. ===== -->
  <symbol id="academySprocket" viewBox="0 0 120 150">
    <ellipse cx="18" cy="52" rx="10" ry="12" fill="url(#acadBodyGrad)" />
    <ellipse cx="102" cy="52" rx="10" ry="12" fill="url(#acadBodyGrad)" />
    <rect x="4" y="0" width="3" height="18" fill="#f0873a" />
    <circle cx="5.5" cy="0" r="6" fill="#ffd35e" />
    <circle cx="60" cy="46" r="44" fill="url(#acadBodyGrad)" />
    <rect x="30" y="34" width="60" height="30" rx="15" fill="#4a2e1c" />
    <circle cx="45" cy="49" r="7" fill="#ffedc9" />
    <circle cx="75" cy="49" r="7" fill="#ffedc9" />
    <path d="M48,56 Q60,64 72,56" stroke="#ffedc9" stroke-width="3" fill="none" stroke-linecap="round" />
    <ellipse cx="24" cy="66" rx="7" ry="4.5" fill="#ff8a72" opacity="0.8" />
    <ellipse cx="96" cy="66" rx="7" ry="4.5" fill="#ff8a72" opacity="0.8" />
    <rect x="45" y="88" width="30" height="12" rx="6" fill="#f0873a" />
    <rect x="20" y="98" width="80" height="52" rx="26" fill="url(#acadBodyGrad)" />
    <circle cx="60" cy="122" r="18" fill="#fff4e2" />
    <circle cx="60" cy="122" r="13" fill="url(#acadCoreGrad)" />
    <rect x="4" y="108" width="16" height="34" rx="8" fill="url(#acadBodyGrad)" />
    <rect x="100" y="108" width="16" height="34" rx="8" fill="url(#acadBodyGrad)" />
    <rect x="34" y="146" width="20" height="4" rx="2" fill="#e8722c" />
    <rect x="66" y="146" width="20" height="4" rx="2" fill="#e8722c" />
  </symbol>

  <symbol id="cosmetic-bow" viewBox="0 0 120 150" overflow="visible">
    <g transform="translate(60,-6) rotate(-8)">
      <path d="M0,0 L-16,-10 L-16,10 Z" fill="#ff5f8f" stroke="#e0568f" stroke-width="1.5" />
      <path d="M0,0 L16,-10 L16,10 Z" fill="#ff5f8f" stroke="#e0568f" stroke-width="1.5" />
      <circle r="5" fill="#ff85ad" stroke="#e0568f" stroke-width="1.5" />
    </g>
  </symbol>
  <symbol id="cosmetic-scarf" viewBox="0 0 120 150" overflow="visible">
    <path d="M28,86 Q60,100 92,86 L92,98 Q60,112 28,98 Z" fill="#e0431f" stroke="#c2381a" stroke-width="1.5" />
    <path d="M80,96 L88,118 L96,98 Z" fill="#e0431f" stroke="#c2381a" stroke-width="1.5" />
  </symbol>
  <symbol id="cosmetic-crown" viewBox="0 0 120 150" overflow="visible">
    <g transform="translate(60,-14)">
      <path d="M-22,10 L-22,-6 L-11,4 L0,-14 L11,4 L22,-6 L22,10 Z" fill="#ffd35e" stroke="#e8a300" stroke-width="2" stroke-linejoin="round" />
      <circle cx="0" cy="-10" r="3" fill="#ff5f8f" />
    </g>
  </symbol>
  <symbol id="cosmetic-cape" viewBox="0 0 120 150" overflow="visible">
    <path d="M26,96 Q60,88 94,96 L102,150 Q60,138 18,150 Z" fill="#e0431f" opacity="0.92" />
  </symbol>
  <symbol id="cosmetic-star-badge" viewBox="0 0 120 150" overflow="visible">
    <g transform="translate(60,120)">
      <path d="M0,-11 L3,-3 L11,-3 L4.5,2 L7,10 L0,5 L-7,10 L-4.5,2 L-11,-3 L-3,-3 Z" fill="#ffd35e" stroke="#e8a300" stroke-width="1.5" stroke-linejoin="round" />
    </g>
  </symbol>

  <!-- ===== Closet preview icons: same cosmetics, centered in their
       own badge for the shop grid (the cosmetic-* symbols above are
       deliberately off-center, positioned to sit correctly on
       Sprocket rather than to look good on their own). ===== -->
  <symbol id="closet-bow" viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="46" fill="url(#toolGlow)" />
    <g transform="translate(50,50) rotate(-8) scale(1.7)">
      <path d="M0,0 L-16,-10 L-16,10 Z" fill="#ff5f8f" stroke="#e0568f" stroke-width="1.5" />
      <path d="M0,0 L16,-10 L16,10 Z" fill="#ff5f8f" stroke="#e0568f" stroke-width="1.5" />
      <circle r="5" fill="#ff85ad" stroke="#e0568f" stroke-width="1.5" />
    </g>
  </symbol>
  <symbol id="closet-scarf" viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="46" fill="url(#toolGlow)" />
    <g transform="translate(50,58) scale(1.4)">
      <path d="M-24,-4 Q0,8 24,-4 L24,6 Q0,18 -24,6 Z" fill="#e0431f" stroke="#c2381a" stroke-width="1.5" />
      <path d="M12,4 L18,22 L24,6 Z" fill="#e0431f" stroke="#c2381a" stroke-width="1.5" />
    </g>
  </symbol>
  <symbol id="closet-crown" viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="46" fill="url(#toolGlow)" />
    <g transform="translate(50,54) scale(1.7)">
      <path d="M-22,10 L-22,-6 L-11,4 L0,-14 L11,4 L22,-6 L22,10 Z" fill="#ffd35e" stroke="#e8a300" stroke-width="2" stroke-linejoin="round" />
      <circle cx="0" cy="-10" r="3" fill="#ff5f8f" />
    </g>
  </symbol>
  <symbol id="closet-cape" viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="46" fill="url(#toolGlow)" />
    <path d="M28,34 Q50,28 72,34 L78,74 Q50,64 22,74 Z" fill="#e0431f" opacity="0.92" />
  </symbol>
  <symbol id="closet-star-badge" viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="46" fill="url(#toolGlow)" />
    <g transform="translate(50,50) scale(1.8)">
      <path d="M0,-11 L3,-3 L11,-3 L4.5,2 L7,10 L0,5 L-7,10 L-4.5,2 L-11,-3 L-3,-3 Z" fill="#ffd35e" stroke="#e8a300" stroke-width="1.5" stroke-linejoin="round" />
    </g>
  </symbol>

  <!-- ===== Faces ===== -->
  <symbol id="face-worried" viewBox="0 0 100 100">
    <circle cx="50" cy="52" r="44" fill="url(#faceGrad-worried)" />
    <ellipse cx="34" cy="30" rx="15" ry="9" fill="#fff" opacity="0.32" />
    <path d="M27,40 Q35,30 45,37" stroke="#4a2e1c" stroke-width="4" fill="none" stroke-linecap="round" />
    <path d="M55,37 Q65,30 73,40" stroke="#4a2e1c" stroke-width="4" fill="none" stroke-linecap="round" />
    <circle cx="37" cy="50" r="6.5" fill="#4a2e1c" /><circle cx="63" cy="50" r="6.5" fill="#4a2e1c" />
    <ellipse cx="50" cy="72" rx="8" ry="10" fill="none" stroke="#4a2e1c" stroke-width="4" />
    <path d="M78,52 q5,9 0,14 a4.5,4.5 0 1 1 0,-14 Z" fill="#bcdcf0" opacity="0.9" />
  </symbol>

  <symbol id="face-frustrated" viewBox="0 0 100 100">
    <circle cx="50" cy="52" r="44" fill="url(#faceGrad-frustrated)" />
    <ellipse cx="34" cy="30" rx="15" ry="9" fill="#fff" opacity="0.32" />
    <path d="M27,42 L46,38" stroke="#4a2e1c" stroke-width="4" fill="none" stroke-linecap="round" />
    <path d="M54,38 L73,42" stroke="#4a2e1c" stroke-width="4" fill="none" stroke-linecap="round" />
    <circle cx="37" cy="50" r="6" fill="#4a2e1c" /><circle cx="63" cy="50" r="6" fill="#4a2e1c" />
    <path d="M36,74 L44,68 L50,74 L56,68 L64,74" stroke="#4a2e1c" stroke-width="4.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
    <ellipse cx="24" cy="60" rx="6" ry="4" fill="#ff8a72" opacity="0.85" /><ellipse cx="76" cy="60" rx="6" ry="4" fill="#ff8a72" opacity="0.85" />
  </symbol>

  <symbol id="face-excited" viewBox="0 0 100 100">
    <circle cx="50" cy="52" r="44" fill="url(#faceGrad-excited)" />
    <ellipse cx="34" cy="30" rx="15" ry="9" fill="#fff" opacity="0.32" />
    <path d="M37,42 L37,58 M29,50 L45,50 M31,44 L43,56 M31,56 L43,44" stroke="#fff" stroke-width="3" stroke-linecap="round" />
    <path d="M63,42 L63,58 M55,50 L71,50 M57,44 L69,56 M57,56 L69,44" stroke="#fff" stroke-width="3" stroke-linecap="round" />
    <circle cx="37" cy="50" r="9" fill="#4a2e1c" /><circle cx="63" cy="50" r="9" fill="#4a2e1c" />
    <path d="M32,68 Q50,86 68,68" stroke="#4a2e1c" stroke-width="4.5" fill="none" stroke-linecap="round" />
    <path d="M14,30 l4,10 l10,4 l-10,4 l-4,10 l-4,-10 l-10,-4 l10,-4 Z" fill="#fff" opacity="0.7" />
  </symbol>

  <symbol id="face-sad" viewBox="0 0 100 100">
    <circle cx="50" cy="52" r="44" fill="url(#faceGrad-sad)" />
    <ellipse cx="34" cy="30" rx="15" ry="9" fill="#fff" opacity="0.28" />
    <path d="M30,48 Q37,45 44,49" stroke="#3a2438" stroke-width="4" fill="none" stroke-linecap="round" />
    <path d="M56,49 Q63,45 70,48" stroke="#3a2438" stroke-width="4" fill="none" stroke-linecap="round" />
    <path d="M50,68 Q40,64 33,68" stroke="#3a2438" stroke-width="4.5" fill="none" stroke-linecap="round" />
    <path d="M68,58 q5,9 0,14 a4.5,4.5 0 1 1 0,-14 Z" fill="#bcdcf0" opacity="0.95" />
  </symbol>

  <symbol id="face-angry" viewBox="0 0 100 100">
    <circle cx="50" cy="52" r="44" fill="url(#faceGrad-angry)" />
    <ellipse cx="34" cy="30" rx="15" ry="9" fill="#fff" opacity="0.3" />
    <path d="M27,38 L46,46" stroke="#4a2e1c" stroke-width="5" fill="none" stroke-linecap="round" />
    <path d="M54,46 L73,38" stroke="#4a2e1c" stroke-width="5" fill="none" stroke-linecap="round" />
    <ellipse cx="37" cy="52" rx="6" ry="5" fill="#4a2e1c" /><ellipse cx="63" cy="52" rx="6" ry="5" fill="#4a2e1c" />
    <path d="M35,72 L42,66 L48,72 L55,66 L65,72" stroke="#4a2e1c" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M14,44 q-6,-4 -4,-12" stroke="#fff" stroke-width="3.5" fill="none" stroke-linecap="round" opacity="0.85" />
    <path d="M86,44 q6,-4 4,-12" stroke="#fff" stroke-width="3.5" fill="none" stroke-linecap="round" opacity="0.85" />
  </symbol>

  <symbol id="face-scared" viewBox="0 0 100 100">
    <circle cx="50" cy="52" r="44" fill="url(#faceGrad-scared)" />
    <ellipse cx="34" cy="30" rx="15" ry="9" fill="#fff" opacity="0.3" />
    <path d="M26,36 Q35,26 46,34" stroke="#3a2438" stroke-width="4" fill="none" stroke-linecap="round" />
    <path d="M54,34 Q65,26 74,36" stroke="#3a2438" stroke-width="4" fill="none" stroke-linecap="round" />
    <circle cx="37" cy="50" r="10" fill="#fff" /><circle cx="37" cy="50" r="5.5" fill="#3a2438" />
    <circle cx="63" cy="50" r="10" fill="#fff" /><circle cx="63" cy="50" r="5.5" fill="#3a2438" />
    <ellipse cx="50" cy="74" rx="6" ry="7" fill="none" stroke="#3a2438" stroke-width="4" />
  </symbol>

  <symbol id="face-embarrassed" viewBox="0 0 100 100">
    <circle cx="50" cy="52" r="44" fill="url(#faceGrad-embarrassed)" />
    <ellipse cx="34" cy="30" rx="15" ry="9" fill="#fff" opacity="0.3" />
    <path d="M30,46 Q37,42 44,47" stroke="#4a2e1c" stroke-width="4" fill="none" stroke-linecap="round" />
    <path d="M56,47 Q63,42 70,46" stroke="#4a2e1c" stroke-width="4" fill="none" stroke-linecap="round" />
    <path d="M44,72 Q50,76 56,72" stroke="#4a2e1c" stroke-width="4" fill="none" stroke-linecap="round" />
    <ellipse cx="27" cy="60" rx="8" ry="5.5" fill="#ff5f8f" opacity="0.85" /><ellipse cx="73" cy="60" rx="8" ry="5.5" fill="#ff5f8f" opacity="0.85" />
  </symbol>

  <symbol id="face-proud" viewBox="0 0 100 100">
    <circle cx="50" cy="52" r="44" fill="url(#faceGrad-proud)" />
    <ellipse cx="34" cy="30" rx="15" ry="9" fill="#fff" opacity="0.32" />
    <path d="M29,50 Q37,42 45,50" stroke="#4a2e1c" stroke-width="4.5" fill="none" stroke-linecap="round" />
    <path d="M55,50 Q63,42 71,50" stroke="#4a2e1c" stroke-width="4.5" fill="none" stroke-linecap="round" />
    <path d="M32,66 Q50,84 68,66" stroke="#4a2e1c" stroke-width="4.5" fill="none" stroke-linecap="round" />
    <path d="M74,26 l3,7 l7,3 l-7,3 l-3,7 l-3,-7 l-7,-3 l7,-3 Z" fill="#fff" opacity="0.8" />
  </symbol>

  <symbol id="face-overwhelmed" viewBox="0 0 100 100">
    <circle cx="50" cy="52" r="44" fill="url(#faceGrad-overwhelmed)" />
    <ellipse cx="34" cy="30" rx="15" ry="9" fill="#fff" opacity="0.28" />
    <path d="M31,44 a6,6 0 1 1 10,4 a4,4 0 1 0 -6,-2" stroke="#3a2f22" stroke-width="3" fill="none" stroke-linecap="round" />
    <path d="M59,44 a6,6 0 1 1 10,4 a4,4 0 1 0 -6,-2" stroke="#3a2f22" stroke-width="3" fill="none" stroke-linecap="round" />
    <path d="M34,72 Q42,66 50,72 T66,72" stroke="#3a2f22" stroke-width="4" fill="none" stroke-linecap="round" />
    <path d="M18,34 q6,-8 2,-16" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.7" />
    <path d="M82,34 q-6,-8 -2,-16" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.7" />
  </symbol>

  <symbol id="face-happy" viewBox="0 0 100 100">
    <circle cx="50" cy="52" r="44" fill="url(#faceGrad-happy)" />
    <ellipse cx="34" cy="30" rx="15" ry="9" fill="#fff" opacity="0.34" />
    <path d="M29,48 Q37,56 45,48" stroke="#4a2e1c" stroke-width="4.5" fill="none" stroke-linecap="round" />
    <path d="M55,48 Q63,56 71,48" stroke="#4a2e1c" stroke-width="4.5" fill="none" stroke-linecap="round" />
    <path d="M34,66 Q50,80 66,66" stroke="#4a2e1c" stroke-width="4.5" fill="none" stroke-linecap="round" />
  </symbol>

  <!-- ===== Tool badges: circular gradient badge + icon glyph ===== -->
  <symbol id="tool-breathe" viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="46" fill="url(#toolGlow)" />
    <path d="M24,44 Q38,30 52,44 T80,44" stroke="#e8642f" stroke-width="5" fill="none" stroke-linecap="round" />
    <path d="M24,58 Q34,48 44,58 T64,58" stroke="#f0a870" stroke-width="5" fill="none" stroke-linecap="round" />
    <circle cx="50" cy="50" r="9" fill="#ffd35e" opacity="0.9" />
  </symbol>

  <symbol id="tool-shake" viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="46" fill="url(#toolGlow)" />
    <path d="M38,66 L38,38 a6,6 0 0 1 12,0 v10 M50,48 v-14 a6,6 0 0 1 12,0 v14 M62,48 v-8 a6,6 0 0 1 12,0 v22 a16,16 0 0 1 -16,16 h-6 a16,16 0 0 1 -14,-8 l-10,-16 a5,5 0 0 1 8,-6 l6,8"
      fill="#ffe6cf" stroke="#e8642f" stroke-width="3" stroke-linejoin="round" />
    <path d="M18,30 q-6,4 -4,12 M22,24 q-8,2 -8,12" stroke="#e8642f" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.8" />
  </symbol>

  <symbol id="tool-wiggle" viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="46" fill="url(#toolGlow)" />
    <circle cx="50" cy="30" r="9" fill="#e8642f" />
    <path d="M50,39 Q30,50 40,64 Q50,50 50,60 Q50,50 60,64 Q70,50 50,39 Z" fill="#f0a870" />
    <path d="M36,74 Q42,64 50,72 Q58,64 64,74" stroke="#e8642f" stroke-width="4" fill="none" stroke-linecap="round" />
  </symbol>

  <symbol id="tool-hug" viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="46" fill="url(#toolGlow)" />
    <circle cx="50" cy="34" r="10" fill="#e8642f" />
    <path d="M24,60 Q24,38 50,42 Q76,38 76,60 Q76,78 50,78 Q24,78 24,60 Z" fill="#f0a870" />
    <path d="M28,52 Q50,66 72,52" stroke="#e8642f" stroke-width="4" fill="none" stroke-linecap="round" />
  </symbol>

  <symbol id="tool-stomp" viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="46" fill="url(#toolGlow)" />
    <path d="M40,26 Q54,24 56,38 Q58,50 68,56 Q76,60 74,70 Q72,78 60,78 L40,78 Q34,78 34,70 L34,42 Q34,28 40,26 Z" fill="#e8642f" />
    <path d="M28,66 L20,66 M26,74 L16,74" stroke="#e8642f" stroke-width="4" stroke-linecap="round" opacity="0.7" />
  </symbol>

  <symbol id="tool-anchor" viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="46" fill="url(#toolGlow)" />
    <circle cx="50" cy="50" r="26" fill="none" stroke="#e8642f" stroke-width="4" />
    <path d="M50,26 L50,74 M26,50 L74,50" stroke="#e8642f" stroke-width="3" />
    <path d="M50,30 L58,42 L50,50 L42,42 Z" fill="#e8642f" />
  </symbol>

  <symbol id="tool-shrug" viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="46" fill="url(#toolGlow)" />
    <circle cx="50" cy="32" r="10" fill="#e8642f" />
    <path d="M30,72 Q26,50 40,46 Q50,44 50,52 Q50,44 60,46 Q74,50 70,72 Z" fill="#f0a870" />
    <path d="M22,58 Q16,50 22,42 M78,58 Q84,50 78,42" stroke="#e8642f" stroke-width="4" fill="none" stroke-linecap="round" />
  </symbol>

  <symbol id="tool-pose" viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="46" fill="url(#toolGlow)" />
    <circle cx="50" cy="34" r="10" fill="#e8642f" />
    <path d="M50,44 L50,72 M50,50 L28,26 M50,50 L72,26" stroke="#e8642f" stroke-width="6" fill="none" stroke-linecap="round" />
    <path d="M50,72 L38,84 M50,72 L62,84" stroke="#e8642f" stroke-width="6" fill="none" stroke-linecap="round" />
  </symbol>

  <symbol id="tool-quiet" viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="46" fill="url(#toolGlow)" />
    <circle cx="46" cy="42" r="16" fill="#f0a870" />
    <path d="M46,58 L46,74 M40,76 L52,76" stroke="#e8642f" stroke-width="5" stroke-linecap="round" />
    <path d="M62,30 a14,14 0 0 1 0,24" stroke="#e8642f" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.6" />
    <path d="M68,26 a20,20 0 0 1 0,36" stroke="#e8642f" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.4" />
  </symbol>

  <symbol id="tool-savor" viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="46" fill="url(#toolGlow)" />
    <circle cx="50" cy="50" r="16" fill="#ffd35e" />
    <g stroke="#e8642f" stroke-width="4" stroke-linecap="round">
      <line x1="50" y1="18" x2="50" y2="28" /><line x1="50" y1="72" x2="50" y2="82" />
      <line x1="18" y1="50" x2="28" y2="50" /><line x1="72" y1="50" x2="82" y2="50" />
      <line x1="27" y1="27" x2="34" y2="34" /><line x1="66" y1="66" x2="73" y2="73" />
      <line x1="73" y1="27" x2="66" y2="34" /><line x1="34" y1="66" x2="27" y2="73" />
    </g>
  </symbol>

  <!-- Generic body-signal / mind-signal badges for the Teach and Spot
       phases (a neutral heart/thought-bubble, not tied to one
       feeling). -->
  <symbol id="icon-heartbeat" viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="46" fill="url(#toolGlow)" />
    <path d="M50,72 C30,58 20,46 20,34 A14,14 0 0 1 44,24 L50,32 L56,24 A14,14 0 0 1 80,34 C80,46 70,58 50,72 Z" fill="#ff6f8f" stroke="#e0568f" stroke-width="2" />
    <path d="M28,50 L40,50 L45,40 L52,60 L58,46 L64,50 L74,50" stroke="#fff" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity="0.85" />
  </symbol>
  <symbol id="icon-thought" viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="46" fill="url(#toolGlow)" />
    <ellipse cx="52" cy="42" rx="26" ry="19" fill="#fff" stroke="#e8642f" stroke-width="2.5" />
    <circle cx="30" cy="66" r="7" fill="#fff" stroke="#e8642f" stroke-width="2.5" />
    <circle cx="22" cy="78" r="4" fill="#fff" stroke="#e8642f" stroke-width="2.5" />
    <circle cx="44" cy="36" r="3.5" fill="#e8642f" /><circle cx="56" cy="36" r="3.5" fill="#e8642f" /><circle cx="68" cy="36" r="3.5" fill="#e8642f" />
  </symbol>
</defs>
`;

function academyInjectIcons() {
  if (document.getElementById('academy-icon-defs')) return;
  const wrap = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  wrap.setAttribute('id', 'academy-icon-defs');
  wrap.setAttribute('width', '0');
  wrap.setAttribute('height', '0');
  wrap.style.position = 'absolute';
  wrap.innerHTML = ACADEMY_ICON_DEFS;
  document.body.appendChild(wrap);
}

// Returns an <svg class="icon ..."><use href="#id"/></svg> HTML string.
function academyIcon(id, extraClass) {
  return `<svg class="icon${extraClass ? ' ' + extraClass : ''}" viewBox="0 0 100 100"><use href="#${id}"></use></svg>`;
}

// Composites the full-detail Sprocket with an optional equipped
// cosmetic, in the correct paint order (a cape has to go behind the
// body, every other cosmetic goes in front) — used anywhere the
// Academy shows Sprocket so cosmetics always render consistently.
function academySprocketSvg(cosmeticId, extraClass) {
  const showCapeBehind = cosmeticId === 'cape';
  return `<svg class="sprocket-render${extraClass ? ' ' + extraClass : ''}" viewBox="0 0 120 150">` +
    (showCapeBehind ? '<use href="#cosmetic-cape"></use>' : '') +
    '<use href="#academySprocket"></use>' +
    (cosmeticId && !showCapeBehind ? `<use href="#cosmetic-${cosmeticId}"></use>` : '') +
    '</svg>';
}
