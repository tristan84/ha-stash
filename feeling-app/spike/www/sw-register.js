// Registers the offline service worker. Included on every page (not
// just index.html) so any page works offline even if opened directly
// — see SPIKE_NOTES.md for why story.html needed this fix, and it
// applies equally to every screen added since.
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').catch((err) => console.error('sw register failed', err));
}
