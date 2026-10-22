const colours = [
  { name: 'rojo', value: '#ef4444' },
  { name: 'azul', value: '#3b82f6' },
  { name: 'verde', value: '#22c55e' },
  { name: 'amarillo', value: '#facc15' },
  { name: 'naranja', value: '#f97316' },
  { name: 'morado', value: '#a855f7' },
  { name: 'rosa', value: '#ec4899' },
  { name: 'negro', value: '#111827' },
  { name: 'blanco', value: '#f8fafc' },
  { name: 'gris', value: '#64748b' },
];

const promptEl = document.getElementById('question');
const swatchEl = document.getElementById('swatch');
const choicesEl = document.getElementById('choices');
const feedbackEl = document.getElementById('feedback');
const scoreEl = document.getElementById('score');
const streakEl = document.getElementById('streak');
const levelEl = document.getElementById('level');
const nextBtn = document.getElementById('nextBtn');

let score = 0;
let streak = 0;
let level = 1;
let current = null;
let locked = false;

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function roundConfig() {
  const choiceCount = Math.min(3 + Math.floor((level - 1) / 2), 6);
  const pool = shuffle(colours);
  const answer = pool[0];
  const options = shuffle([answer, ...pool.slice(1, choiceCount + 2)]).slice(0, choiceCount);
  return { answer, options };
}

function renderRound() {
  locked = false;
  nextBtn.disabled = true;
  feedbackEl.textContent = 'Choose the Spanish word that matches the colour.';
  feedbackEl.className = 'feedback';

  current = roundConfig();
  promptEl.textContent = `¿Qué color es? Nivel ${level}`;
  swatchEl.style.background = current.answer.value;
  swatchEl.setAttribute('aria-label', `Colour swatch for ${current.answer.name}`);

  choicesEl.innerHTML = '';
  current.options.forEach(option => {
    const button = document.createElement('button');
    button.className = 'choice';
    button.type = 'button';
    button.textContent = option.name;
    button.addEventListener('click', () => choose(option, button));
    choicesEl.appendChild(button);
  });
}

function updateStats() {
  scoreEl.textContent = score;
  streakEl.textContent = streak;
  levelEl.textContent = level;
}

function choose(option, button) {
  if (locked) return;
  locked = true;

  const buttons = [...choicesEl.querySelectorAll('button')];
  buttons.forEach(btn => btn.disabled = true);

  if (option.name === current.answer.name) {
    score += 10 + level * 2;
    streak += 1;
    if (streak % 3 === 0) level += 1;
    feedbackEl.textContent = `¡Correcto! ${option.name} means ${current.answer.name}.`;
    feedbackEl.className = 'feedback good';
    button.classList.add('correct');
  } else {
    streak = 0;
    score = Math.max(0, score - 4);
    feedbackEl.textContent = `Nope — the answer was ${current.answer.name}.`;
    feedbackEl.className = 'feedback bad';
    button.classList.add('wrong');
    buttons.find(btn => btn.textContent === current.answer.name)?.classList.add('correct');
  }

  updateStats();
  nextBtn.disabled = false;
}

nextBtn.addEventListener('click', renderRound);
updateStats();
renderRound();
