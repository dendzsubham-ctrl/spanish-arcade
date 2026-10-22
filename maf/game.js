const bank = [
  { prompt: 'Choose the Spanish word for “bread”.', answer: 'pan', choices: ['pan', 'agua', 'queso', 'jugo'], level: 1 },
  { prompt: 'Choose the Spanish word for “water”.', answer: 'agua', choices: ['té', 'agua', 'café', 'leche'], level: 1 },
  { prompt: 'Choose the Spanish word for “coffee”.', answer: 'café', choices: ['café', 'arroz', 'pan', 'sal'], level: 1 },
  { prompt: 'Choose the Spanish word for “cheese”.', answer: 'queso', choices: ['queso', 'pescado', 'carne', 'uva'], level: 2 },
  { prompt: 'Choose the Spanish word for “apple”.', answer: 'manzana', choices: ['manzana', 'naranja', 'limón', 'pera'], level: 2 },
  { prompt: 'Choose the Spanish word for “juice”.', answer: 'jugo', choices: ['jugo', 'vino', 'sopa', 'té'], level: 2 },
  { prompt: 'In a café, how would you ask for “more water”?', answer: 'más agua', choices: ['más agua', 'menos pan', 'una mesa', 'el queso'], level: 3 },
  { prompt: 'Choose the polite phrase: “Good evening.”', answer: 'buenas noches', choices: ['buenas noches', 'hasta luego', 'por favor', 'de nada'], level: 3 }
];

let score = 0;
let streak = 0;
let round = 0;
let level = 1;
let available = [];
let locked = false;

const scoreEl = document.getElementById('score');
const streakEl = document.getElementById('streak');
const levelEl = document.getElementById('level');
const roundEl = document.getElementById('round');
const promptEl = document.getElementById('prompt');
const choicesEl = document.getElementById('choices');
const feedbackEl = document.getElementById('feedback');
const nextBtn = document.getElementById('nextBtn');
const meterFill = document.getElementById('meter-fill');
const objectiveEl = document.getElementById('objective');

function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5); }
function updateHUD() {
  scoreEl.textContent = score;
  streakEl.textContent = streak;
  levelEl.textContent = level;
  roundEl.textContent = round || 1;
  meterFill.style.width = `${Math.min(100, (score % 5) * 20)}%`;
}

function buildDeck() {
  available = shuffle(bank.filter(item => item.level <= level));
  if (!available.length) available = shuffle(bank);
}

function nextQuestion() {
  locked = false;
  nextBtn.disabled = true;
  feedbackEl.textContent = 'Pick an answer to begin.';
  choicesEl.innerHTML = '';
  if (!available.length) buildDeck();
  const item = available.shift();
  current = item;
  promptEl.textContent = item.prompt;
  objectiveEl.textContent = level < 3 ? 'Build up your café vocabulary.' : 'Now the game adds polite phrases.';
  updateHUD();
  shuffle(item.choices).forEach(choice => {
    const button = document.createElement('button');
    button.className = 'choice';
    button.textContent = choice;
    button.addEventListener('click', () => pick(choice, button));
    choicesEl.appendChild(button);
  });
}

let current = null;
function pick(choice, button) {
  if (locked) return;
  locked = true;
  round += 1;
  const buttons = [...choicesEl.querySelectorAll('button')];
  buttons.forEach(btn => btn.disabled = true);
  const correct = choice === current.answer;
  if (correct) {
    score += 10 + streak * 2;
    streak += 1;
    feedbackEl.textContent = `Correct! “${current.answer}” is right.`;
    button.classList.add('correct');
  } else {
    streak = 0;
    score = Math.max(0, score - 3);
    feedbackEl.textContent = `Not quite. The correct answer is “${current.answer}”.`;
    button.classList.add('wrong');
    buttons.find(btn => btn.textContent === current.answer)?.classList.add('correct');
  }
  if (score >= 30) level = 3; else if (score >= 12) level = 2;
  nextBtn.disabled = false;
  updateHUD();
}

nextBtn.addEventListener('click', nextQuestion);
buildDeck();
nextQuestion();
