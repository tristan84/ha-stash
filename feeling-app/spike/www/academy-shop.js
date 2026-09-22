// Sprocket's Closet: spend earned Sparks on cosmetics. Purely visual —
// never gates a level or changes how one plays.

academyInjectIcons();

const sparksTotalEl = document.getElementById('sparks-total');
const heroSlotEl = document.getElementById('hero-sprocket-slot');
const gridEl = document.getElementById('closet-grid');

function renderHero() {
  const sparks = academyGetSparks();
  sparksTotalEl.textContent = String(sparks);
  const equipped = localStorage.getItem(ACADEMY_EQUIPPED_KEY);
  const unlocked = academyUnlockedRewards(sparks);
  const equippedValid = equipped && unlocked.some((r) => r.id === equipped) ? equipped : null;
  heroSlotEl.innerHTML = academySprocketSvg(equippedValid);
}

function renderGrid() {
  const sparks = academyGetSparks();
  const equipped = localStorage.getItem(ACADEMY_EQUIPPED_KEY);
  gridEl.innerHTML = '';

  ACADEMY_REWARDS.forEach((reward) => {
    const unlocked = sparks >= reward.threshold;
    const isEquipped = unlocked && equipped === reward.id;

    const btn = document.createElement('button');
    btn.className = `closet-item ${unlocked ? '' : 'locked'} ${isEquipped ? 'equipped' : ''}`;
    btn.innerHTML = unlocked
      ? `${academyIcon('closet-' + reward.id, 'closet-icon')}<span class="closet-name">${reward.name}</span>${isEquipped ? '<span class="closet-equipped-tag">Wearing</span>' : ''}`
      : `<span class="closet-icon locked-icon">🔒</span><span class="closet-name">${reward.name}</span><span class="closet-threshold">${reward.threshold} ✨</span>`;

    if (unlocked) {
      btn.addEventListener('click', () => {
        if (isEquipped) {
          localStorage.removeItem(ACADEMY_EQUIPPED_KEY);
        } else {
          localStorage.setItem(ACADEMY_EQUIPPED_KEY, reward.id);
        }
        renderHero();
        renderGrid();
      });
    }
    gridEl.appendChild(btn);
  });
}

renderHero();
renderGrid();
