// Sprocket's Closet: spend earned Sparks on cosmetics. Purely visual —
// never gates a level or changes how one plays.

const sparksTotalEl = document.getElementById('sparks-total');
const heroCosmeticEl = document.getElementById('hs-cosmetic');
const gridEl = document.getElementById('closet-grid');

function renderHero() {
  const sparks = academyGetSparks();
  sparksTotalEl.textContent = String(sparks);
  const equipped = localStorage.getItem(ACADEMY_EQUIPPED_KEY);
  const unlocked = academyUnlockedRewards(sparks);
  heroCosmeticEl.className = 'hs-cosmetic';
  if (equipped && unlocked.some((r) => r.id === equipped)) {
    const reward = unlocked.find((r) => r.id === equipped);
    heroCosmeticEl.textContent = reward.icon;
    heroCosmeticEl.classList.add('show', `cosmetic-${reward.id}`);
  }
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
      ? `<span class="closet-icon">${reward.icon}</span><span class="closet-name">${reward.name}</span>${isEquipped ? '<span class="closet-equipped-tag">Wearing</span>' : ''}`
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
