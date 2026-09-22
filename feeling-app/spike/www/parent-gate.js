const a = 3 + Math.floor(Math.random() * 6); // 3-8
const b = 3 + Math.floor(Math.random() * 6); // 3-8
document.getElementById('gate-sum').textContent = `${a} + ${b} = ?`;

const input = document.getElementById('gate-input');
const feedback = document.getElementById('gate-feedback');

function check() {
  const val = Number(input.value);
  if (val === a + b) {
    window.location.href = 'parent-home.html';
  } else {
    feedback.textContent = "That's not quite it — try again.";
    input.value = '';
    input.focus();
  }
}

document.getElementById('gate-submit').addEventListener('click', check);
input.addEventListener('keydown', (e) => { if (e.key === 'Enter') check(); });
input.focus();
