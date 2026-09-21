// Book reader: page navigation (with the flip animation from
// story.css) and the read-aloud toggle. Not final content/IA — see
// SPIKE_NOTES.md for what this prototype is and isn't validating.

// Registers the same service worker app.js does. In the real Capacitor
// app this is redundant (webDir root is always index.html, so it
// registers there first) but registering here too means story.html
// works offline even if it's opened directly (e.g. spot-testing a
// deep link), and re-registering an identical worker is a no-op.
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').catch((err) => console.error('sw register failed', err));
}

const pages = Array.from(document.querySelectorAll('.page'));
const dotsEl = document.getElementById('dots');
const prevBtn = document.getElementById('btn-prev');
const nextBtn = document.getElementById('btn-next');
const readToggle = document.getElementById('read-toggle');
const readLabel = document.getElementById('read-label');

let current = 0;
let readAloudOn = false;

pages[0].classList.add('active');

pages.forEach((_, i) => {
  const dot = document.createElement('button');
  dot.className = 'dot' + (i === 0 ? ' dot-active' : '');
  dot.setAttribute('aria-label', `Go to page ${i + 1}`);
  dot.addEventListener('click', () => goTo(i));
  dotsEl.appendChild(dot);
});
const dotEls = Array.from(dotsEl.children);

function updateChrome() {
  dotEls.forEach((d, i) => d.classList.toggle('dot-active', i === current));
  prevBtn.disabled = current === 0;
  nextBtn.disabled = current === pages.length - 1;
}

function getSpokenText(pageEl) {
  const cover = pageEl.querySelector('.cover-text');
  if (cover) {
    const h1 = cover.querySelector('h1');
    const sub = cover.querySelector('.cover-sub');
    return `${h1 ? h1.textContent : ''}. ${sub ? sub.textContent : ''}`;
  }
  const text = pageEl.querySelector('.page-text:not(.page-text--cover)');
  return text ? text.textContent : '';
}

function speakCurrentPage() {
  const text = getSpokenText(pages[current]);
  if (!text) return;
  sprocketTTS.speak(text, {
    onStatus: () => {},
  });
}

function goTo(index) {
  if (index === current || index < 0 || index >= pages.length) return;
  sprocketTTS.stop();
  const direction = index > current ? 'next' : 'prev';
  const oldPage = pages[current];
  const newPage = pages[index];

  oldPage.classList.remove('active');
  if (direction === 'next') {
    oldPage.classList.add('leaving-to-left');
    newPage.classList.add('entering-from-right');
  } else {
    oldPage.classList.add('leaving-to-right');
    newPage.classList.add('entering-from-left');
  }
  newPage.classList.add('active');

  window.setTimeout(() => {
    oldPage.classList.remove('leaving-to-left', 'leaving-to-right');
    newPage.classList.remove('entering-from-right', 'entering-from-left');
  }, 440);

  current = index;
  updateChrome();
  if (readAloudOn) speakCurrentPage();
}

prevBtn.addEventListener('click', () => goTo(current - 1));
nextBtn.addEventListener('click', () => goTo(current + 1));

window.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') goTo(current + 1);
  if (e.key === 'ArrowLeft') goTo(current - 1);
});

readToggle.addEventListener('click', () => {
  readAloudOn = !readAloudOn;
  readToggle.setAttribute('aria-pressed', String(readAloudOn));
  readLabel.textContent = readAloudOn ? 'Reading…' : 'Read to me';
  if (readAloudOn) {
    speakCurrentPage();
  } else {
    sprocketTTS.stop();
  }
});

// Stop any speech if the reader is left mid-page (back button).
window.addEventListener('pagehide', () => sprocketTTS.stop());

updateChrome();
