// Help Me (PLAN.md §4.3): expanded from always forcing the breathing
// tool into a personalized entry point that surfaces only the
// calm-moment tools the child has actually practiced — Academy levels
// they've completed, plus breathing itself once the garden's been
// played at least once. With 0 or 1 practiced tools it still opens
// straight into the tool (true one-tap, no menu); a picker only
// appears once there's an actual choice among things already known.
academyInjectIcons();

const HELP_BREATHE_TOOL = {
  id: 'breathe',
  icon: 'tool-breathe',
  label: 'Three Slow Breaths',
  desc: 'Breathe in slow, and out even slower.',
  greeting: "It's okay. I'm here. Let's breathe together.",
};

function breathePracticed() {
  return Number(localStorage.getItem('sprocket-garden-flowers') || 0) > 0;
}

function practicedAcademyTools() {
  const progress = academyLoadProgress();
  return ACADEMY_LEVELS
    .filter((l) => progress[l.id] && progress[l.id].completed)
    .map((l) => ({
      id: l.id,
      icon: l.tool.icon,
      label: l.tool.label,
      desc: l.tool.desc,
      greeting: `It's okay. I'm here. Let's try ${l.tool.short.toLowerCase()} together.`,
    }));
}

function practicedTools() {
  const tools = practicedAcademyTools();
  // Breathing counts as practiced once the garden's been played for
  // real; if nothing at all has been practiced yet, still offer it —
  // it's simple enough to use correctly the first time, so Help Me is
  // never an empty screen for a brand-new child.
  if (breathePracticed() || tools.length === 0) tools.unshift(HELP_BREATHE_TOOL);
  return tools;
}

const greetingEl = document.getElementById('greeting-text');
const pickerEl = document.getElementById('tool-picker');
const pickerRow = document.getElementById('tool-picker-row');
const breatheStage = document.getElementById('tool-breathe-stage');
const cardStage = document.getElementById('tool-card-stage');
const cardIcon = document.getElementById('tool-card-icon');
const cardLabel = document.getElementById('tool-card-label');
const cardDesc = document.getElementById('tool-card-desc');

function showBreathe() {
  pickerEl.hidden = true;
  breatheStage.hidden = false;
  cardStage.hidden = true;
  greetingEl.textContent = HELP_BREATHE_TOOL.greeting;
}

function showToolCard(tool) {
  pickerEl.hidden = true;
  breatheStage.hidden = true;
  cardStage.hidden = false;
  greetingEl.textContent = tool.greeting;
  cardIcon.innerHTML = academyIcon(tool.icon);
  cardLabel.textContent = tool.label;
  cardDesc.textContent = tool.desc;
}

function selectTool(tool) {
  if (tool.id === 'breathe') showBreathe();
  else showToolCard(tool);
}

const tools = practicedTools();
if (tools.length <= 1) {
  selectTool(tools[0]);
} else {
  breatheStage.hidden = true;
  cardStage.hidden = true;
  pickerEl.hidden = false;
  greetingEl.textContent = "It's okay. I'm here. Pick what helps.";
  tools.forEach((tool) => {
    const btn = document.createElement('button');
    btn.className = 'tool-picker-btn';
    btn.innerHTML = academyIcon(tool.icon, 'tool-picker-icon');
    btn.setAttribute('aria-label', tool.label);
    btn.addEventListener('click', () => selectTool(tool));
    pickerRow.appendChild(btn);
  });
}

// Explicit tap-to-hear, rather than autoplaying speech on page load
// (unreliable across browsers right after a navigation, and the child
// may not expect audio to start on its own in a moment that's already
// overwhelming).
document.getElementById('hear-btn').addEventListener('click', () => {
  sprocketTTS.speak(greetingEl.textContent);
});
document.getElementById('tool-card-hear').addEventListener('click', () => {
  sprocketTTS.speak(cardDesc.textContent);
});
document.getElementById('tool-card-done').addEventListener('click', () => {
  window.location.href = 'index.html';
});
