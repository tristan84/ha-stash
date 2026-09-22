// Feeling diary: tap a feeling to log it (localStorage only — see the
// comment in diary.html). Reward language is process-based throughout
// (Principle 2): the tally counts entries, never which feelings were
// logged, and the confirmation line never implies any feeling is
// better than another to have noticed.

const FEELINGS = [
  { name: 'Worried', emoji: '😟' },
  { name: 'Frustrated', emoji: '😤' },
  { name: 'Excited', emoji: '🤩' },
  { name: 'Happy', emoji: '😊' },
  { name: 'Calm', emoji: '😌' },
  { name: 'Sad', emoji: '😢' },
];

const STORAGE_KEY = 'sprocket-diary';

function loadEntries() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveEntries(entries) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

function formatTime(iso) {
  const d = new Date(iso);
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  const time = d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  if (sameDay) return `today, ${time}`;
  return `${d.toLocaleDateString([], { month: 'short', day: 'numeric' })}, ${time}`;
}

const pickerEl = document.getElementById('feeling-picker');
const listEl = document.getElementById('entry-list');
const emptyNote = document.getElementById('empty-note');
const tallyEl = document.getElementById('diary-tally');
const feedbackEl = document.getElementById('add-feedback');

function renderTally(entries) {
  if (entries.length === 0) {
    tallyEl.textContent = "You haven't logged a feeling yet — try tapping one below.";
  } else {
    tallyEl.textContent = `You've noticed ${entries.length} feeling${entries.length === 1 ? '' : 's'} so far. Nice noticing!`;
  }
}

function renderList() {
  const entries = loadEntries();
  renderTally(entries);
  listEl.innerHTML = '';
  emptyNote.hidden = entries.length > 0;
  entries.slice().reverse().forEach((entry) => {
    const row = document.createElement('div');
    row.className = 'entry-row';
    row.innerHTML = `
      <span class="entry-emoji">${entry.emoji}</span>
      <span class="entry-feeling">${entry.name}</span>
      <span class="entry-time">${formatTime(entry.at)}</span>
    `;
    listEl.appendChild(row);
  });
}

FEELINGS.forEach((feeling) => {
  const btn = document.createElement('button');
  btn.className = 'feeling-chip';
  btn.innerHTML = `<span class="chip-emoji">${feeling.emoji}</span><span>${feeling.name}</span>`;
  btn.addEventListener('click', () => {
    const entries = loadEntries();
    entries.push({ name: feeling.name, emoji: feeling.emoji, at: new Date().toISOString() });
    saveEntries(entries);
    feedbackEl.textContent = `Got it — thanks for noticing ${feeling.name.toLowerCase()}.`;
    window.setTimeout(() => { feedbackEl.textContent = ''; }, 2200);
    renderList();
  });
  pickerEl.appendChild(btn);
});

renderList();
