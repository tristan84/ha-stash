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
  { name: 'Angry', emoji: '😠' },
  { name: 'Scared', emoji: '😨' },
  { name: 'Embarrassed', emoji: '😳' },
  { name: 'Proud', emoji: '🙌' },
  { name: 'Overwhelmed', emoji: '😵‍💫' },
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

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
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
      <div class="entry-top">
        <span class="entry-emoji">${entry.emoji}</span>
        <span class="entry-feeling">${entry.name}</span>
        <span class="entry-time">${formatTime(entry.at)}</span>
      </div>
      ${entry.note ? `<p class="entry-note">"${escapeHtml(entry.note)}"</p>` : ''}
    `;
    listEl.appendChild(row);
  });
}

// --- Optional reflection note, shown right after logging a feeling ---
const notePanel = document.getElementById('note-panel');
const noteFeelingLabel = document.getElementById('note-feeling-label');
const noteInput = document.getElementById('note-input');
const micBtn = document.getElementById('btn-mic');
const micStatus = document.getElementById('mic-status');

let pendingEntryAt = null;

function openNotePanel(feeling, entryAt) {
  pendingEntryAt = entryAt;
  noteFeelingLabel.textContent = feeling.name.toLowerCase();
  noteInput.value = '';
  micStatus.textContent = '';
  notePanel.hidden = false;
  noteInput.focus();
}

function closeNotePanel() {
  notePanel.hidden = true;
  pendingEntryAt = null;
  if (recognizing) stopRecognition();
}

document.getElementById('btn-skip-note').addEventListener('click', closeNotePanel);

document.getElementById('btn-save-note').addEventListener('click', () => {
  const text = noteInput.value.trim();
  if (text && pendingEntryAt) {
    const entries = loadEntries();
    const entry = entries.find((e) => e.at === pendingEntryAt);
    if (entry) {
      entry.note = text;
      saveEntries(entries);
      renderList();
    }
  }
  closeNotePanel();
});

// Voice-to-text is a real convenience for kids who don't type
// comfortably, but it's worth being honest about what it costs: the
// Web Speech API's recognition (SpeechRecognition/webkitSpeechRecognition)
// is not on-device — browsers that support it (Chrome included) stream
// the audio to a cloud speech-to-text service to get a transcript back.
// That's a genuine tension with this app's on-device/privacy-first
// principle (PLAN.md Principle 1), unlike everything else in the diary
// which never leaves localStorage. Flagging it here rather than quietly
// shipping it as if it were private — a real product decision (Open
// Decision territory) should weigh that tradeoff explicitly before this
// goes further than a spike.
const SpeechRecognitionCtor = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognizing = false;
let recognizer = null;

if (SpeechRecognitionCtor) {
  micBtn.hidden = false;
  recognizer = new SpeechRecognitionCtor();
  recognizer.lang = 'en-US';
  recognizer.interimResults = true;
  recognizer.continuous = false;

  recognizer.addEventListener('result', (event) => {
    let transcript = '';
    for (let i = 0; i < event.results.length; i += 1) {
      transcript += event.results[i][0].transcript;
    }
    noteInput.value = transcript;
  });
  recognizer.addEventListener('end', () => {
    recognizing = false;
    micBtn.setAttribute('aria-pressed', 'false');
    micStatus.textContent = '';
  });
  recognizer.addEventListener('error', () => {
    recognizing = false;
    micBtn.setAttribute('aria-pressed', 'false');
    micStatus.textContent = "Couldn't hear that — try typing instead.";
  });

  micBtn.addEventListener('click', () => {
    if (recognizing) {
      stopRecognition();
    } else {
      recognizing = true;
      micBtn.setAttribute('aria-pressed', 'true');
      micStatus.textContent = 'Listening…';
      try { recognizer.start(); } catch { /* already started */ }
    }
  });
}

function stopRecognition() {
  recognizing = false;
  micBtn.setAttribute('aria-pressed', 'false');
  micStatus.textContent = '';
  if (recognizer) { try { recognizer.stop(); } catch { /* not running */ } }
}

FEELINGS.forEach((feeling) => {
  const btn = document.createElement('button');
  btn.className = 'feeling-chip';
  btn.innerHTML = `<span class="chip-emoji">${feeling.emoji}</span><span>${feeling.name}</span>`;
  btn.addEventListener('click', () => {
    const entries = loadEntries();
    const at = new Date().toISOString();
    entries.push({ name: feeling.name, emoji: feeling.emoji, at });
    saveEntries(entries);
    feedbackEl.textContent = `Got it — thanks for noticing ${feeling.name.toLowerCase()}.`;
    window.setTimeout(() => { feedbackEl.textContent = ''; }, 2200);
    renderList();
    openNotePanel(feeling, at);
  });
  pickerEl.appendChild(btn);
});

renderList();
