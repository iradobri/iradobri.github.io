const questions = [
  { title: 'Твоя любимая вкусяншка?', options: [['🍕', 'Пицца'], ['🍔', 'Бургер'], ['🍣', 'Суши']], answer: 2, message: 'Суши конечно. Жду когда мы будем есть их вместе ♡' },
  { title: 'Твои любимые цветочки?', options: [['🌹', 'Розы'], ['🌸', 'Пионы'], ['🌷', 'Тюльпаны']], answer: 1, message: 'Пионы. Самые нежные — для самой нежной' },
  { title: 'Твой любимый цвет?', options: [['🤍', 'Белый'], ['💜', 'Фиолетовый'], ['💙', 'Синий']], answer: 0, message: 'Белый. Теперь ещё на шаг ближе' },
  { title: 'Твой любимый напиток?', options: [['☕', 'Кофе'], ['🧃', 'Сок'], ['🍵', 'Чай']], answer: 2, message: 'Чай. Особенно если пить его вместе)' },
  { title: 'Твоё любимое животное?', options: [['🐱', 'Кошка'], ['🐸', 'Лягушка'], ['🐰', 'Кролик']], answer: 1, message: 'Ква! Всё совпало. Это точно ты ♡' }
];

const notes = [
  'Если бы ты была чаем, ты была бы тем самым — который согревает изнутри 🍵',
  'Обещаю делиться с тобой последним роллом. А это, между прочим, серьёзно 🍣',
  'Ты заслуживаешь целое море пионов. И столько же счастливых дней 🌸',
  'Даже маленькая лягушка знает: ты — моё самое большое везение 🐸',
  'Мне нравится быть рядом с тобой. Даже когда мы просто молчим 🤍',
  'На всякий случай ещё раз: я тебя очень-очень люблю ♡'
];

let currentQuestion = 0;
let answered = false;
let noteIndex = 0;
const byId = (id) => document.getElementById(id);
const nextButton = byId('next-question');

function showScreen(id) {
  for (const screen of document.querySelectorAll('.screen')) screen.hidden = screen.id !== id;
  window.scrollTo({ top: 0, behavior: 'instant' });
  const heading = byId(id).querySelector('h1');
  if (heading.hasAttribute('tabindex')) heading.focus({ preventScroll: true });
}

function renderQuestion() {
  answered = false;
  const question = questions[currentQuestion];
  byId('question-number').textContent = `ВОПРОС ${String(currentQuestion + 1).padStart(2, '0')} / 05`;
  byId('question-title').textContent = question.title;
  byId('feedback').textContent = '';
  byId('progress').replaceChildren(...questions.map((_, index) => {
    const segment = document.createElement('span');
    segment.className = index < currentQuestion ? 'complete' : index === currentQuestion ? 'current' : '';
    return segment;
  }));
  byId('progress').setAttribute('aria-label', `Вопрос ${currentQuestion + 1} из ${questions.length}`);
  byId('answers').replaceChildren(...question.options.map(([emoji, label], index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'answer';
    button.setAttribute('aria-label', label);
    button.innerHTML = `<span class="answer-emoji" aria-hidden="true">${emoji}</span><span class="answer-label">${label}</span>`;
    button.addEventListener('click', () => chooseAnswer(index, button));
    return button;
  }));
  nextButton.disabled = true;
  nextButton.innerHTML = currentQuestion === questions.length - 1 ? 'Открыть послание <span aria-hidden="true">♡</span>' : 'Дальше <span aria-hidden="true">→</span>';
}

function chooseAnswer(index, button) {
  if (answered) return;
  const question = questions[currentQuestion];
  if (index !== question.answer) {
    button.classList.remove('wrong');
    void button.offsetWidth;
    button.classList.add('wrong');
    byId('feedback').textContent = 'Эйй, хитришь? ♡';
    return;
  }
  answered = true;
  button.classList.remove('wrong');
  button.classList.add('correct');
  button.setAttribute('aria-label', `${question.options[index][1]} — правильно`);
  for (const answer of byId('answers').children) answer.disabled = true;
  byId('feedback').textContent = question.message;
  byId('progress').children[currentQuestion].className = 'complete';
  nextButton.disabled = false;
  nextButton.focus({ preventScroll: true });
}

function releaseHearts(count = 18) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  for (let i = 0; i < count; i++) {
    const heart = document.createElement('span');
    heart.className = 'particle';
    heart.textContent = i % 3 === 0 ? '♡' : '♥';
    heart.style.setProperty('--x', `${Math.random() * 100}%`);
    heart.style.setProperty('--c', ['#e885a3', '#cf4d79', '#eebaca'][i % 3]);
    heart.style.setProperty('--size', `${12 + Math.random() * 22}px`);
    heart.style.setProperty('--duration', `${3 + Math.random() * 3}s`);
    heart.style.setProperty('--drift', `${Math.random() * 160 - 80}px`);
    heart.style.setProperty('--rotation', `${Math.random() * 100 - 50}deg`);
    heart.addEventListener('animationend', () => heart.remove(), { once: true });
    byId('particles').append(heart);
  }
}

byId('heart-button').addEventListener('click', () => {
  currentQuestion = 0;
  renderQuestion();
  showScreen('quiz');
});

nextButton.addEventListener('click', () => {
  if (!answered) return;
  if (currentQuestion < questions.length - 1) {
    currentQuestion++;
    renderQuestion();
    byId('answers').querySelector('button').focus({ preventScroll: true });
  } else {
    showScreen('letter');
    releaseHearts(28);
  }
});

byId('surprise-button').addEventListener('click', () => {
  const note = byId('love-note');
  note.textContent = notes[noteIndex % notes.length];
  noteIndex++;
  note.classList.remove('reveal');
  void note.offsetWidth;
  note.classList.add('reveal');
  byId('surprise-button').innerHTML = 'Ещё капельку любви <span aria-hidden="true">♡</span>';
  releaseHearts(9);
});

byId('restart-button').addEventListener('click', () => {
  noteIndex = 0;
  byId('particles').replaceChildren();
  byId('love-note').textContent = 'У меня для тебя есть ещё несколько тёплых слов.';
  byId('surprise-button').innerHTML = 'И ещё кое-что… <span aria-hidden="true">♡</span>';
  showScreen('welcome');
  byId('heart-button').focus({ preventScroll: true });
});
