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

const saveData = () => {
  localStorage.setItem('quizData', JSON.stringify(data));
};

const clearFields = () => {
  [newSubject, newChapter, newQuestion, option1, option2, option3, option4, correctAnswer].forEach(input => input.value = '');
};

const refreshSubjects = () => {
  subjectSelect.innerHTML = '<option value="">Select Subject</option>';
  Object.keys(data).forEach(subject => {
    const opt = document.createElement('option');
    opt.value = subject;
    opt.textContent = subject;
    subjectSelect.appendChild(opt);
  });
};

subjectSelect.addEventListener('change', () => {
  const subject = subjectSelect.value;
  chapterSelect.innerHTML = '<option value="">Select Chapter</option>';
  chapterSelect.disabled = !subject;

  deleteSubjectBtn.style.display = subject ? 'inline-block' : 'none';
  deleteChapterBtn.style.display = 'none';

  if (subject) {
    Object.keys(data[subject]).forEach(ch => {
      const opt = document.createElement('option');
      opt.value = ch;
      opt.textContent = ch;
      chapterSelect.appendChild(opt);
    });
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
    loadQuestion();
  }
});

const loadQuestion = () => {
  clearOptions();
  if (currentQuestionIndex < currentQuestions.length) {
    const q = currentQuestions[currentQuestionIndex];
    questionEl.textContent = q.question;
    q.options.forEach(opt => {
      const btn = document.createElement('div');
      btn.classList.add('option');
      btn.textContent = opt;
      btn.onclick = () => selectOption(btn, q.correct);
      optionsEl.appendChild(btn);
    });
    updateScore();
    toggleNavButtons(true);
  } else {
    questionEl.textContent = "Quiz Completed!";
    optionsEl.innerHTML = '';
    toggleNavButtons(false);
    restartBtn.style.display = 'inline-block';
  }
};

const selectOption = (el, correct) => {
  [...optionsEl.children].forEach(opt => {
    opt.style.pointerEvents = "none";
    if (opt.textContent === correct) opt.classList.add('correct');
  });
  if (el.textContent === correct) {
    el.classList.add('correct');
    score++;
  } else {
    el.classList.add('wrong');
  }
  attempts++;
  updateScore();
};

const updateScore = () => {
  scoreboardEl.textContent = `Score: ${score} | Attempts: ${attempts}`;
};

const clearOptions = () => {
  optionsEl.innerHTML = '';
};

addQuestionBtn.addEventListener('click', () => {
  const subject = newSubject.value.trim();
  const chapter = newChapter.value.trim();
  const question = newQuestion.value.trim();
  const options = [option1.value, option2.value, option3.value, option4.value].map(v => v.trim());
  const correct = correctAnswer.value.trim();

  if (subject && chapter && question && options.every(Boolean) && correct) {
    if (!data[subject]) data[subject] = {};
    if (!data[subject][chapter]) data[subject][chapter] = [];
    data[subject][chapter].push({ question, options, correct });
    saveData();
    clearFields();
    refreshSubjects();
    alert("Question added!");
  } else {
    alert("Please fill all fields");
  }
});

restartBtn.addEventListener('click', () => {
  subjectSelect.value = '';
  chapterSelect.innerHTML = '<option value="">Select Chapter</option>';
  chapterSelect.disabled = true;
  quizArea.style.display = 'none';
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

const toggleNavButtons = show => {
  [prevBtn, nextBtn, deleteQuestionBtn, editQuestionBtn].forEach(btn =>
    btn.style.display = show ? 'inline-block' : 'none'
  );
};

deleteQuestionBtn.addEventListener('click', () => {
  const subject = subjectSelect.value;
  const chapter = chapterSelect.value;
  if (confirm("Delete this question?")) {
    currentQuestions.splice(currentQuestionIndex, 1);
    data[subject][chapter] = currentQuestions;
    saveData();
    currentQuestionIndex = Math.max(currentQuestionIndex - 1, 0);
    loadQuestion();
  }
});

editQuestionBtn.addEventListener('click', () => {
  const q = currentQuestions[currentQuestionIndex];
  editForm.style.display = 'block';
  quizArea.style.display = 'none';
  [editQuestionText.value, editOption1.value, editOption2.value, editOption3.value, editOption4.value, editCorrectAnswer.value] =
    [q.question, ...q.options, q.correct];
});

saveEditBtn.addEventListener('click', () => {
  const subject = subjectSelect.value;
  const chapter = chapterSelect.value;
  currentQuestions[currentQuestionIndex] = {
    question: editQuestionText.value,
    options: [editOption1.value, editOption2.value, editOption3.value, editOption4.value],
    correct: editCorrectAnswer.value
  };
  data[subject][chapter] = currentQuestions;
  saveData();
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
  if (confirm(`Delete subject "${subject}"?`)) {
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
  if (confirm(`Delete chapter "${chapter}"?`)) {
    delete data[subject][chapter];
    saveData();
    subjectSelect.dispatchEvent(new Event('change'));
    quizArea.style.display = 'none';
  }
});

// Admin Auth System
loginBtn.addEventListener('click', () => {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  if (username === 'ajit@531049' && password === 'ajitkumarram#531049') {
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
