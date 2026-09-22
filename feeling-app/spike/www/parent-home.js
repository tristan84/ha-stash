function safeCount(key, isJsonArray) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return 0;
    return isJsonArray ? JSON.parse(raw).length : Number(raw) || 0;
  } catch {
    return 0;
  }
}

document.getElementById('stat-diary').textContent = safeCount('sprocket-diary', true);
document.getElementById('stat-breaths').textContent = safeCount('sprocket-breaths', false);
document.getElementById('stat-match').textContent = safeCount('sprocket-match-rounds', false);
