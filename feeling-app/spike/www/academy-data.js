// Shared level data for Sprocket's Feelings Academy — one source of
// truth used by both the map (academy.html) and the level engine
// (academy-level.html). Content is condensed from the ten story books
// (PLAN.md §4.5), so the Academy and the books teach the same body
// signal / mind signal / tool per feeling rather than a competing
// second taxonomy.
//
// Reward design note (Principle 2): every level has the identical
// reward shape regardless of which feeling it teaches — same Spark
// amount, same star thresholds, same unlock cadence. Stars measure
// *skill* (did you need a retry on the recognition round, did you beat
// the quick-round timer) never *valence* (which feeling it was, or
// whether it's a "good" one to have practiced). Nothing here should
// ever imply one feeling was better to get than another.

const ACADEMY_LEVELS = [
  {
    id: 'worried', order: 1, name: 'Worried', faceIcon: 'face-worried',
    accent: '#f0873a', accentSoft: '#ffe3c9',
    body: 'a fluttery tummy and a fast heartbeat',
    mind: '"what if" thoughts that race and repeat',
    tool: { icon: 'tool-breathe', label: 'Three Slow Breaths', short: 'Breathe', desc: 'Breathe in slow, and out even slower.' },
  },
  {
    id: 'frustrated', order: 2, name: 'Frustrated', faceIcon: 'face-frustrated',
    accent: '#e05a3c', accentSoft: '#ffd9cf',
    body: 'hot cheeks and tight, squeezed fists',
    mind: '"I can’t do this!" thoughts, loud and stuck',
    tool: { icon: 'tool-shake', label: 'Shake & Count to Five', short: 'Shake', desc: 'Shake out your hands, then count: one, two, three, four, five.' },
  },
  {
    id: 'excited', order: 3, name: 'Excited', faceIcon: 'face-excited',
    accent: '#f0a800', accentSoft: '#ffedb0',
    body: 'a fast heart and legs that can’t sit still',
    mind: 'big, bright thoughts that are hard to slow down',
    tool: { icon: 'tool-wiggle', label: 'Wiggle Dance', short: 'Wiggle', desc: 'Let the energy out with a big wiggle dance.' },
  },
  {
    id: 'sad', order: 4, name: 'Sad', faceIcon: 'face-sad',
    accent: '#a3628f', accentSoft: '#ecd8e6',
    body: 'a heavy chest and drooping shoulders',
    mind: 'quiet, slow thoughts, not wanting to do much',
    tool: { icon: 'tool-hug', label: 'Cozy Self-Hug', short: 'Hug', desc: 'Wrap your arms around yourself and name one warm thing you love.' },
  },
  {
    id: 'angry', order: 5, name: 'Angry', faceIcon: 'face-angry',
    accent: '#e0431f', accentSoft: '#ffd9c2',
    body: 'a hot face and fists that squeeze fast and big',
    mind: '"that’s not fair!" thoughts, loud all at once',
    tool: { icon: 'tool-stomp', label: 'Stomp It Out', short: 'Stomp', desc: 'Stomp like a big dinosaur, then tell a grown-up what happened.' },
  },
  {
    id: 'scared', order: 6, name: 'Scared', faceIcon: 'face-scared',
    accent: '#8a5c8a', accentSoft: '#e6d9e6',
    body: 'a racing heart and legs that freeze up',
    mind: '"what was that?!" thoughts that dart around',
    tool: { icon: 'tool-anchor', label: 'Brave Breath & Anchor', short: 'Anchor', desc: 'Take a slow brave breath, then find someone or something safe nearby.' },
  },
  {
    id: 'embarrassed', order: 7, name: 'Embarrassed', faceIcon: 'face-embarrassed',
    accent: '#e0568f', accentSoft: '#ffd9e6',
    body: 'hot cheeks and wanting to hide or shrink',
    mind: '"everyone’s looking at me" thoughts on replay',
    tool: { icon: 'tool-shrug', label: 'Shake It Off', short: 'Shrug', desc: 'A little shake, and remember: everyone messes up sometimes.' },
  },
  {
    id: 'proud', order: 8, name: 'Proud', faceIcon: 'face-proud',
    accent: '#e8a300', accentSoft: '#ffedb0',
    body: 'a warm chest and standing up nice and tall',
    mind: '"I did it!" thoughts, bright and loud',
    tool: { icon: 'tool-pose', label: 'Proud Pose', short: 'Pose', desc: 'Arms up high, then share the moment with someone.' },
  },
  {
    id: 'overwhelmed', order: 9, name: 'Overwhelmed', faceIcon: 'face-overwhelmed',
    accent: '#967f5c', accentSoft: '#e6ddc9',
    body: 'a tight, heavy body and a loud, foggy head',
    mind: '"too much, too much!" scattered thoughts',
    tool: { icon: 'tool-quiet', label: 'Quiet & One Thing', short: 'Quiet', desc: 'Step to somewhere quiet, then pick just one small thing to do.' },
  },
  {
    id: 'happy', order: 10, name: 'Happy', faceIcon: 'face-happy',
    accent: '#f0b347', accentSoft: '#ffe8b0',
    body: 'light, bouncy steps and an easy smile',
    mind: '"today feels good" thoughts, warm and simple',
    tool: { icon: 'tool-savor', label: 'Pause & Savor', short: 'Savor', desc: 'Pause for a moment and really notice one good thing happening right now.' },
  },
];

function academyGetLevel(id) {
  return ACADEMY_LEVELS.find((l) => l.id === id) || null;
}

function academyOtherLevels(id, count) {
  const others = ACADEMY_LEVELS.filter((l) => l.id !== id).sort(() => Math.random() - 0.5);
  return others.slice(0, count);
}

// --- Shared progress/reward state (localStorage) -----------------
const ACADEMY_PROGRESS_KEY = 'sprocket-academy-progress';
const ACADEMY_SPARKS_KEY = 'sprocket-academy-sparks';
const ACADEMY_EQUIPPED_KEY = 'sprocket-academy-equipped';

const ACADEMY_REWARDS = [
  { id: 'bow', threshold: 15, icon: '🎀', name: 'Bow' },
  { id: 'scarf', threshold: 40, icon: '🧣', name: 'Scarf' },
  { id: 'crown', threshold: 80, icon: '👑', name: 'Crown' },
  { id: 'cape', threshold: 130, icon: '🦸', name: 'Cape' },
  { id: 'star-badge', threshold: 200, icon: '⭐', name: 'Star Badge' },
];

function academyLoadProgress() {
  try {
    return JSON.parse(localStorage.getItem(ACADEMY_PROGRESS_KEY) || '{}');
  } catch {
    return {};
  }
}

function academySaveProgress(progress) {
  localStorage.setItem(ACADEMY_PROGRESS_KEY, JSON.stringify(progress));
}

function academyGetSparks() {
  return Number(localStorage.getItem(ACADEMY_SPARKS_KEY) || 0);
}

function academyAddSparks(n) {
  const total = academyGetSparks() + n;
  localStorage.setItem(ACADEMY_SPARKS_KEY, String(total));
  return total;
}

function academyUnlockedRewards(sparkTotal) {
  return ACADEMY_REWARDS.filter((r) => sparkTotal >= r.threshold);
}

function academyNextReward(sparkTotal) {
  return ACADEMY_REWARDS.find((r) => sparkTotal < r.threshold) || null;
}
