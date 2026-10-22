const rounds = [
  {
    prompt: 'A friend arrives and smiles at you.',
    context: 'Pick the most natural greeting.',
    answer: '¡Hola!',
    options: ['¡Hola!', 'Adiós', 'Gracias']
  },
  {
    prompt: 'You are meeting someone for the first time.',
    context: 'Choose the polite introduction.',
    answer: 'Mucho gusto',
    options: ['Mucho gusto', 'Buenos días', 'Lo siento']
  },
  {
    prompt: 'It is morning and you want to greet a teacher.',
    context: 'Pick the best phrase for the time of day.',
    answer: 'Buenos días',
    options: ['Buenas noches', 'Buenos días', 'Hasta luego']
  },
  {
    prompt: 'You are leaving a party.',
    context: 'Choose the goodbye.',
    answer: 'Adiós',
    options: ['De nada', 'Adiós', 'Encantado']
  },
  {
    prompt: 'Someone thanks you for helping.',
    context: 'What do you say back?',
    answer: 'De nada',
    options: ['De nada', 'Perdón', 'Hola']
  },
  {
    prompt: 'A formal meeting begins in the evening.',
    context: 'Pick the evening greeting.',
    answer: 'Buenas noches',
    options: ['Buenas noches', 'Buenos días', 'Hasta mañana']
  },
  {
    prompt: 'You accidentally bump into someone.',
    context: 'Choose the apology.',
    answer: 'Lo siento',
    options: ['Lo siento', 'Encantado', 'Adiós']
  },
  {
    prompt: 'You want to say “see you later”.',
    context: 'Pick the farewell.',
    answer: 'Hasta luego',
    options: ['Hasta luego', 'Mucho gusto', 'Gracias']
  }
];

const scoreEl = document.getElementById('score');
const streakEl = document.getElementById('streak');
const levelEl = document.getElementById('level');
const promptEl = document.getElementById('prompt');
const contextEl = document.getElementById('context');
const choicesEl = document.getElementById('choices');
const feedbackEl = document.getElementById('feedback');
const nextBtn = document.getElementById('nextBtn');
const restartBtn = document.getElementById('restartBtn');

let score = 0;
let streak = 0;
let level = 1;
let current = null;
let locked = false;

function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

function pickRound() {
  const pool = rounds.slice(0, Math.min(rounds.length, 3 + level));
  return pool[Math.floor(Math.random() * pool.length)] || rounds[0];
}

function renderStats() {
  scoreEl.textContent = score;
  streakEl.textContent = streak;
  levelEl.textContent = level;
}

function loadRound() {
  locked = false;
  current = pickRound();
  promptEl.textContent = current.prompt;
  contextEl.textContent = current.context;
  feedbackEl.textContent = '';
  feedbackEl.className = 'feedback';
  choicesEl.innerHTML = '';

  shuffle(current.options).forEach(option => {
    const btn = document.createElement('button');
    btn.className = 'choice';
    btn.type = 'button';
    btn.textContent = option;
    btn.addEventListener('click', () => choose(btn, option));
    choicesEl.appendChild(btn);
  });
}

function choose(btn, option) {
  if (locked) return;
  locked = true;
  const buttons = [...choicesEl.querySelectorAll('button')];
  buttons.forEach(button => button.disabled = true);

  if (option === current.answer) {
    score += 10 + (level * 2);
    streak += 1;
    if (streak % 3 === 0) level = Math.min(8, level + 1);
    feedbackEl.textContent = `Correct! ${current.answer} is right.`;
    feedbackEl.classList.add('good');
    btn.classList.add('correct');
  } else {
    streak = 0;
    level = Math.max(1, level - 1);
    feedbackEl.textContent = `Not quite. The correct answer is ${current.answer}.`;
    feedbackEl.classList.add('bad');
    btn.classList.add('wrong');
    buttons.find(b => b.textContent === current.answer)?.classList.add('correct');
  }
  renderStats();
}

nextBtn.addEventListener('click', loadRound);
restartBtn.addEventListener('click', () => {
  score = 0;
  streak = 0;
  level = 1;
  renderStats();
  loadRound();
});

renderStats();
loadRound();
