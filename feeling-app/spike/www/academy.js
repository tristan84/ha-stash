// Feelings Academy map: one node per level, unlocked in order as the
// previous level is completed. Stars and Sparks are read from shared
// localStorage state (academy-data.js) written by academy-level.js.

academyInjectIcons();

const pathEl = document.getElementById('level-path');
const sparksTotalEl = document.getElementById('sparks-total');
const heroSlotEl = document.getElementById('hero-sprocket-slot');
const heroLineEl = document.getElementById('hero-line');

function renderHero() {
  const sparks = academyGetSparks();
  sparksTotalEl.textContent = String(sparks);

  const equipped = localStorage.getItem(ACADEMY_EQUIPPED_KEY);
  const unlocked = academyUnlockedRewards(sparks);
  const equippedValid = equipped && unlocked.some((r) => r.id === equipped) ? equipped : null;
  heroSlotEl.innerHTML = academySprocketSvg(equippedValid);

  const next = academyNextReward(sparks);
  if (next) {
    heroLineEl.textContent = `${next.threshold - sparks} more Sparks unlocks the ${next.name}`;
  } else {
    heroLineEl.textContent = "You've unlocked everything in Sprocket's Closet!";
  }
}

function renderPath() {
  const progress = academyLoadProgress();
  pathEl.innerHTML = '';

  ACADEMY_LEVELS.forEach((level, i) => {
    const prevId = i > 0 ? ACADEMY_LEVELS[i - 1].id : null;
    const unlocked = i === 0 || (prevId && progress[prevId] && progress[prevId].completed);
    const stars = (progress[level.id] && progress[level.id].stars) || 0;

    if (i > 0) {
      const connector = document.createElement('div');
      connector.className = 'path-connector';
      pathEl.appendChild(connector);
    }

    const row = document.createElement('div');
    row.className = `level-node-row ${i % 2 === 0 ? 'align-left' : 'align-right'}`;

    const node = document.createElement(unlocked ? 'a' : 'div');
    node.className = `level-node ${unlocked ? '' : 'locked'}`;
    if (unlocked) node.setAttribute('href', `academy-level.html?level=${level.id}`);

    const starsHtml = unlocked
      ? [1, 2, 3].map((n) => `<span class="${n <= stars ? 'star-on' : 'star-off'}">⭐</span>`).join('')
      : '';

    node.innerHTML = `
      <div class="node-circle" style="${unlocked ? `background:${level.accentSoft};` : ''}">
        ${unlocked ? academyIcon(level.faceIcon) : '<span class="node-lock-icon">🔒</span>'}
      </div>
      <span class="node-label">${level.name}</span>
      <span class="node-stars">${starsHtml}</span>
    `;

    row.appendChild(node);
    pathEl.appendChild(row);
  });

  const allDone = ACADEMY_LEVELS.every((l) => progress[l.id] && progress[l.id].completed);
  if (allDone) {
    const note = document.createElement('div');
    note.className = 'academy-complete-note';
    note.textContent = "You've completed every level! Replay any of them any time — practice always counts.";
    pathEl.appendChild(note);
  }
}

renderHero();
renderPath();
