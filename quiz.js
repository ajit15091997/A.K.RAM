let data = JSON.parse(localStorage.getItem('quizData')) || {};

const subjectSelect = document.getElementById('subjectSelect');
const chapterSelect = document.getElementById('chapterSelect');
const quizArea = document.getElementById('quizArea');
const questionEl = document.getElementById('question');
const optionsEl = document.getElementById('options');
const scoreboardEl = document.getElementById('scoreboard');

const newSubject = document.getElementById('newSubject');
const newChapter = document.getElementById('newChapter');
const newQuestion = document.getElementById('newQuestion');
const option1 = document.getElementById('option1');
const option2 = document.getElementById('option2');
const option3 = document.getElementById('option3');
const option4 = document.getElementById('option4');
const correctAnswer = document.getElementById('correctAnswer');
const addQuestionBtn = document.getElementById('addQuestion');

const editForm = document.getElementById('editForm');
const editQuestionText = document.getElementById('editQuestionText');
const editOption1 = document.getElementById('editOption1');
const editOption2 = document.getElementById('editOption2');
const editOption3 = document.getElementById('editOption3');
const editOption4 = document.getElementById('editOption4');
const editCorrectAnswer = document.getElementById('editCorrectAnswer');
const saveEditBtn = document.getElementById('saveEdit');
const cancelEditBtn = document.getElementById('cancelEdit');

const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const restartBtn = document.getElementById('restart');
const deleteQuestionBtn = document.getElementById('deleteQuestion');
const editQuestionBtn = document.getElementById('editQuestion');

const deleteSubjectBtn = document.getElementById('deleteSubject');
const deleteChapterBtn = document.getElementById('deleteChapter');

const loginForm = document.getElementById('loginForm');
const adminPanel = document.getElementById('adminPanel');
const logoutSection = document.getElementById('logoutSection');
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const loginError = document.getElementById('loginError');

let currentQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let attempts = 0;

function saveData() {
  localStorage.setItem('quizData', JSON.stringify(data));
}

function clearAdminFields() {
  [newSubject, newChapter, newQuestion, option1, option2, option3, option4, correctAnswer].forEach(el => el.value = '');
}

function refreshSubjects() {
  subjectSelect.innerHTML = '<option value="">Select Subject</option>';
  for (let subject in data) {
    const option = document.createElement('option');
    option.value = subject;
    option.innerText = subject;
    subjectSelect.appendChild(option);
  }
}

subjectSelect.addEventListener('change', () => {
  const subject = subjectSelect.value;
  chapterSelect.innerHTML = '<option value="">Select Chapter</option>';
  chapterSelect.disabled = !subject;

  deleteSubjectBtn.style.display = subject ? 'inline-block' : 'none';
  deleteChapterBtn.style.display = 'none';

  if (subject) {
    for (let chapter in data[subject]) {
      const option = document.createElement('option');
      option.value = chapter;
      option.innerText = chapter;
      chapterSelect.appendChild(option);
    }
  }
});

chapterSelect.addEventListener('change', () => {
  const subject = subjectSelect.value;
  const chapter = chapterSelect.value;
  deleteChapterBtn.style.display = chapter ? 'inline-block' : 'none';

  if (chapter) {
    currentQuestions = data[subject][chapter];
    currentQuestionIndex = 0;
    score = 0;
    attempts = 0;
    quizArea.style.display = 'block';
    restartBtn.style.display = 'none';
    loadQuestion();
  }
});

function loadQuestion() {
  optionsEl.innerHTML = '';

  if (currentQuestionIndex >= 0 && currentQuestionIndex < currentQuestions.length) {
    const q = currentQuestions[currentQuestionIndex];
    questionEl.innerHTML = q.question;

    q.options.forEach(opt => {
      const optionDiv = document.createElement('div');
      optionDiv.classList.add('option');
      optionDiv.innerText = opt;
      optionDiv.addEventListener('click', () => selectOption(optionDiv, q.correct));
      optionsEl.appendChild(optionDiv);
    });

    deleteQuestionBtn.style.display = 'inline-block';
    editQuestionBtn.style.display = 'inline-block';
    prevBtn.style.display = 'inline-block';
    nextBtn.style.display = 'inline-block';

    scoreboardEl.innerText = `Score: ${score} | Attempts: ${attempts}`;
  } else {
    questionEl.innerText = "Quiz Completed!";
    optionsEl.innerHTML = '';
    [prevBtn, nextBtn, deleteQuestionBtn, editQuestionBtn].forEach(b => b.style.display = 'none');
    restartBtn.style.display = 'inline-block';
  }
}

function selectOption(optionEl, correct) {
  const allOptions = document.querySelectorAll('.option');
  allOptions.forEach(o => {
    o.style.pointerEvents = 'none';
    if (o.innerText === correct) o.classList.add('correct');
  });

  if (optionEl.innerText === correct) {
    optionEl.classList.add('correct');
    score++;
  } else {
    optionEl.classList.add('wrong');
  }

  attempts++;
  scoreboardEl.innerText = `Score: ${score} | Attempts: ${attempts}`;
}

addQuestionBtn.addEventListener('click', () => {
  const subject = newSubject.value.trim();
  const chapter = newChapter.value.trim();
  const question = newQuestion.value.trim();
  const options = [option1.value, option2.value, option3.value, option4.value].map(o => o.trim());
  const correct = correctAnswer.value.trim();

  if (subject && chapter && question && options.every(Boolean) && correct) {
    if (!data[subject]) data[subject] = {};
    if (!data[subject][chapter]) data[subject][chapter] = [];
    data[subject][chapter].push({ question, options, correct });
    saveData();
    alert("Question Added!");
    clearAdminFields();
    refreshSubjects();
  } else {
    alert("Please fill all fields");
  }
});

prevBtn.addEventListener('click', () => {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    loadQuestion();
  }
});

nextBtn.addEventListener('click', () => {
  if (currentQuestionIndex < currentQuestions.length - 1) {
    currentQuestionIndex++;
    loadQuestion();
  }
});

restartBtn.addEventListener('click', () => {
  subjectSelect.value = '';
  chapterSelect.innerHTML = '<option value="">Select Chapter</option>';
  chapterSelect.disabled = true;
  quizArea.style.display = 'none';
  scoreboardEl.innerText = '';
});

deleteQuestionBtn.addEventListener('click', () => {
  const subject = subjectSelect.value;
  const chapter = chapterSelect.value;

  if (confirm("Delete this Question?")) {
    currentQuestions.splice(currentQuestionIndex, 1);
    data[subject][chapter] = currentQuestions;
    saveData();
    if (currentQuestionIndex > 0) currentQuestionIndex--;
    loadQuestion();
  }
});

editQuestionBtn.addEventListener('click', () => {
  const q = currentQuestions[currentQuestionIndex];
  editQuestionText.value = q.question;
  editOption1.value = q.options[0];
  editOption2.value = q.options[1];
  editOption3.value = q.options[2];
  editOption4.value = q.options[3];
  editCorrectAnswer.value = q.correct;

  quizArea.style.display = 'none';
  editForm.style.display = 'block';
});

saveEditBtn.addEventListener('click', () => {
  const subject = subjectSelect.value;
  const chapter = chapterSelect.value;

  currentQuestions[currentQuestionIndex] = {
    question: editQuestionText.value,
    options: [
      editOption1.value,
      editOption2.value,
      editOption3.value,
      editOption4.value
    ],
    correct: editCorrectAnswer.value
  };

  data[subject][chapter] = currentQuestions;
  saveData();
  alert("Question Updated!");
  editForm.style.display = 'none';
  quizArea.style.display = 'block';
  loadQuestion();
});

cancelEditBtn.addEventListener('click', () => {
  editForm.style.display = 'none';
  quizArea.style.display = 'block';
});

deleteSubjectBtn.addEventListener('click', () => {
  const subject = subjectSelect.value;
  if (confirm(`Delete Subject "${subject}"?`)) {
    delete data[subject];
    saveData();
    refreshSubjects();
    chapterSelect.innerHTML = '<option value="">Select Chapter</option>';
    chapterSelect.disabled = true;
    quizArea.style.display = 'none';
  }
});

deleteChapterBtn.addEventListener('click', () => {
  const subject = subjectSelect.value;
  const chapter = chapterSelect.value;
  if (confirm(`Delete Chapter "${chapter}"?`)) {
    delete data[subject][chapter];
    saveData();
    subjectSelect.dispatchEvent(new Event('change'));
    quizArea.style.display = 'none';
  }
});

// 🔐 Admin Login System (GitHub-safe)
const ADMIN_CREDENTIALS = JSON.parse(localStorage.getItem('adminCreds')) || {
  username: "admin",
  password: "password123"
};

loginBtn.addEventListener('click', () => {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
    adminPanel.style.display = 'block';
    loginForm.style.display = 'none';
    logoutSection.style.display = 'block';
    loginError.textContent = '';
  } else {
    loginError.textContent = "Invalid credentials!";
  }
});

logoutBtn.addEventListener('click', () => {
  adminPanel.style.display = 'none';
  loginForm.style.display = 'block';
  logoutSection.style.display = 'none';
});

refreshSubjects();
