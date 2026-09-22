// Explicit tap-to-hear for Sprocket's greeting, rather than
// autoplaying speech on page load (unreliable across browsers right
// after a navigation, and the child may not expect audio to start
// on its own in a moment that's already overwhelming).
document.getElementById('hear-btn').addEventListener('click', () => {
  sprocketTTS.speak(document.getElementById('greeting-text').textContent);
});
