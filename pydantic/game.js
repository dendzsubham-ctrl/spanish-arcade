const numberWords = {
  1: 'uno', 2: 'dos', 3: 'tres', 4: 'cuatro', 5: 'cinco',
  6: 'seis', 7: 'siete', 8: 'ocho', 9: 'nueve', 10: 'diez',
  11: 'once', 12: 'doce', 13: 'trece', 14: 'catorce', 15: 'quince',
  16: 'dieciséis', 17: 'diecisiete', 18: 'dieciocho', 19: 'diecinueve', 20: 'veinte'
};

const levels = [
  { label: 'Warm-up', choices: 3, reverseChance: 0 },
  { label: 'Counting up', choices: 4, reverseChance: 0.15 },
  { label: 'Quick switch', choices: 4, reverseChance: 0.3 },
  { label: 'Sprint round', choices: 5, reverseChance: 0.45 }
];

const scoreEl = document.getElementById('score');
const levelEl = document.getElementById('level');
const streakEl = document.getElementById('streak');
const promptEl = document.getElementById('prompt');
const modeLabelEl = document.getElementById('modeLabel');
const helperEl = document.getElementById('helper');
const choicesEl = document.getElementById('choices');
const feedbackEl = document.getElementById('feedback');
const nextBtn = document.getElementById('nextBtn');

let score = 0;
let streak = 0;
let roundLocked = false;
let currentAnswer = '';
let currentMode = 'word';
let roundCount = 0;

function levelIndex() {
  return Math.min(levels.length - 1, Math.floor(score / 5));
}

function updateHud() {
  scoreEl.textContent = score;
  levelEl.textContent = levelIndex() + 1;
  streakEl.textContent = streak;
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffled(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function makeChoices(correct, count) {
  const options = new Set([correct]);
  while (options.size < count) {
    const value = pickRandom(Object.values(numberWords));
    options.add(value);
  }
  return shuffled([...options]);
}

function renderChoices(options) {
  choicesEl.innerHTML = '';
  options.forEach(option => {
    const btn = document.createElement('button');
    btn.className = 'choice';
    btn.type = 'button';
    btn.textContent = option;
    btn.addEventListener('click', () => checkAnswer(option, btn));
    choicesEl.appendChild(btn);
  });
}

function buildRound() {
  roundLocked = false;
  feedbackEl.className = 'feedback';
  feedbackEl.textContent = 'Choose the correct answer.';
  const level = levels[levelIndex()];
  currentMode = Math.random() < level.reverseChance ? 'number' : 'word';

  const n = 1 + Math.floor(Math.random() * 20);
  const word = numberWords[n];
  if (currentMode === 'word') {
    promptEl.textContent = String(n);
    modeLabelEl.textContent = 'Spanish word for this number';
    helperEl.textContent = `Pick the correct Spanish spelling for ${n}.`;
    currentAnswer = word;
  } else {
    promptEl.textContent = word;
    modeLabelEl.textContent = 'Number for this Spanish word';
    helperEl.textContent = `Pick the Arabic numeral that matches “${word}”.`;
    currentAnswer = String(n);
  }

  const choices = makeChoices(currentAnswer, level.choices);
  renderChoices(choices);
  nextBtn.textContent = roundCount === 0 ? 'Start sprint' : 'Next round';
  updateHud();
}

function lockChoices() {
  [...choicesEl.querySelectorAll('button')].forEach(btn => btn.disabled = true);
}

function checkAnswer(choice, btn) {
  if (roundLocked) return;
  roundLocked = true;
  roundCount += 1;
  lockChoices();

  const correct = choice === currentAnswer;
  if (correct) {
    score += 2 + streak;
    streak += 1;
    feedbackEl.textContent = `Correct! “${currentAnswer}” is right.`;
    feedbackEl.classList.add('good');
    btn.classList.add('correct');
  } else {
    streak = 0;
    feedbackEl.textContent = `Not quite — the correct answer was ${currentAnswer}.`;
    feedbackEl.classList.add('bad');
    btn.classList.add('wrong');
    [...choicesEl.querySelectorAll('button')].forEach(button => {
      if (button.textContent === currentAnswer) button.classList.add('correct');
    });
  }
  updateHud();
}

nextBtn.addEventListener('click', buildRound);
buildRound();
