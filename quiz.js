let data = JSON.parse(localStorage.getItem('quizData')) || {};

const subjectSelect = document.getElementById('subjectSelect');
const chapterSelect = document.getElementById('chapterSelect');
const quizArea = document.getElementById('quizArea');
const questionEl = document.getElementById('question');
const optionsEl = document.getElementById('options');
const restartBtn = document.getElementById('restart');
const deleteSubjectBtn = document.getElementById('deleteSubject');
const deleteChapterBtn = document.getElementById('deleteChapter');
const deleteQuestionBtn = document.getElementById('deleteQuestion');
const editQuestionBtn = document.getElementById('editQuestion');
const scoreboardEl = document.getElementById('scoreboard');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

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

let currentQuestions = [];
let currentQuestionIndex = 0;
let attempts = 0;
let score = 0;

// Save to LocalStorage
function saveData() {
  localStorage.setItem('quizData', JSON.stringify(data));
}

// Admin Panel - Add New Question
addQuestionBtn.addEventListener('click', () => {
  const subject = newSubject.value.trim();
  const chapter = newChapter.value.trim();
  const question = newQuestion.value.trim();
  const options = [option1.value.trim(), option2.value.trim(), option3.value.trim(), option4.value.trim()];
  const correct = correctAnswer.value.trim();

  if (subject && chapter && question && options.every(opt => opt) && correct) {
    if (!data[subject]) {
      data[subject] = {};
    }
    if (!data[subject][chapter]) {
      data[subject][chapter] = [];
    }

    data[subject][chapter].push({ question, options, correct });

    saveData();
    alert('Question Added Successfully!');
    clearAdminFields();
    refreshSubjects();
  } else {
    alert('Please fill all fields!');
  }
});

// Clear Admin Fields after adding
function clearAdminFields() {
  newSubject.value = '';
  newChapter.value = '';
  newQuestion.value = '';
  option1.value = '';
  option2.value = '';
  option3.value = '';
  option4.value = '';
  correctAnswer.value = '';
}

// Load Subjects into dropdown
function refreshSubjects() {
  subjectSelect.innerHTML = '<option value="">Select Subject</option>';
  for (let subject in data) {
    const option = document.createElement('option');
    option.value = subject;
    option.innerText = subject;
    subjectSelect.appendChild(option);
  }
}

// Subject Change -> Load Chapters
subjectSelect.addEventListener('change', () => {
  const subject = subjectSelect.value;
  chapterSelect.innerHTML = '<option value="">Select Chapter</option>';
  chapterSelect.disabled = false;
  
  deleteSubjectBtn.style.display = subject ? 'inline-block' : 'none';
  deleteChapterBtn.style.display = 'none';
  deleteQuestionBtn.style.display = 'none';
  editQuestionBtn.style.display = 'none';
  scoreboardEl.innerText = '';

  if (subject) {
    for (let chapter in data[subject]) {
      const option = document.createElement('option');
      option.value = chapter;
      option.innerText = chapter;
      chapterSelect.appendChild(option);
    }
  }
});

// Chapter Change -> Load Questions
chapterSelect.addEventListener('change', () => {
  const subject = subjectSelect.value;
  const chapter = chapterSelect.value;
  
  deleteChapterBtn.style.display = chapter ? 'inline-block' : 'none';
  deleteQuestionBtn.style.display = 'none';
  editQuestionBtn.style.display = 'none';

  if (chapter) {
    currentQuestions = data[subject][chapter];
    currentQuestionIndex = 0;
    attempts = 0;
    score = 0;
    quizArea.style.display = 'block';
    restartBtn.style.display = 'none';
    loadQuestion();
  }
});

function loadQuestion() {
  clearOptions();
  
  if (currentQuestionIndex >= 0 && currentQuestionIndex < currentQuestions.length) {
    const currentQ = currentQuestions[currentQuestionIndex];
    questionEl.innerText = currentQ.question;

    currentQ.options.forEach(optText => {
      const option = document.createElement('div');
      option.classList.add('option');
      option.innerText = optText;
      option.addEventListener('click', () => selectOption(option, currentQ.correct));
      optionsEl.appendChild(option);
    });

    deleteQuestionBtn.style.display = 'inline-block';
    editQuestionBtn.style.display = 'inline-block';
    prevBtn.style.display = 'inline-block';
    nextBtn.style.display = 'inline-block';

    scoreboardEl.innerText = `Score: ${score} | Attempts: ${attempts}`;

    checkNavigationButtons();
  } else {
    questionEl.innerText = `Quiz Completed!`;
    optionsEl.innerHTML = '';
    prevBtn.style.display = 'none';
    nextBtn.style.display = 'none';
    deleteQuestionBtn.style.display = 'none';
    editQuestionBtn.style.display = 'none';
    restartBtn.style.display = 'inline-block';
  }
}

function selectOption(option, correctAnswer) {
  const options = document.querySelectorAll('.option');
  options.forEach(opt => {
    opt.style.pointerEvents = "none";
    if (opt.innerText === correctAnswer) {
      opt.classList.add('correct');
    }
  });

  if (option.innerText === correctAnswer) {
    option.classList.add('correct');
    score++;
  } else {
    option.classList.add('wrong');
  }

  attempts++;

  scoreboardEl.innerText = `Score: ${score} | Attempts: ${attempts}`;
}

function clearOptions() {
  optionsEl.innerHTML = '';
}

// Delete Subject
deleteSubjectBtn.addEventListener('click', () => {
  const subject = subjectSelect.value;
  if (confirm(`Delete Subject "${subject}" and all its Chapters?`)) {
    delete data[subject];
    saveData();
    refreshSubjects();
    chapterSelect.innerHTML = '<option value="">Select Chapter</option>';
    chapterSelect.disabled = true;
    quizArea.style.display = 'none';
    alert('Subject Deleted!');
  }
});

// Delete Chapter
deleteChapterBtn.addEventListener('click', () => {
  const subject = subjectSelect.value;
  const chapter = chapterSelect.value;
  if (confirm(`Delete Chapter "${chapter}" and all its Questions?`)) {
    delete data[subject][chapter];
    saveData();
    subjectSelect.dispatchEvent(new Event('change'));
    quizArea.style.display = 'none';
    alert('Chapter Deleted!');
  }
});

// Delete Question
deleteQuestionBtn.addEventListener('click', () => {
  const subject = subjectSelect.value;
  const chapter = chapterSelect.value;

  if (confirm('Delete this Question?')) {
    currentQuestions.splice(currentQuestionIndex, 1);
    data[subject][chapter] = currentQuestions;
    saveData();
    if (currentQuestionIndex > 0) {
      currentQuestionIndex--;
    }
    loadQuestion();
  }
});

// Edit Question
editQuestionBtn.addEventListener('click', () => {
  const currentQ = currentQuestions[currentQuestionIndex];
  editQuestionText.value = currentQ.question;
  editOption1.value = currentQ.options[0];
  editOption2.value = currentQ.options[1];
  editOption3.value = currentQ.options[2];
  editOption4.value = currentQ.options[3];
  editCorrectAnswer.value = currentQ.correct;

  quizArea.style.display = 'none';
  editForm.style.display = 'block';
});

// Save Edited Question
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
  alert('Question Updated Successfully!');
  editForm.style.display = 'none';
  quizArea.style.display = 'block';
  loadQuestion();
});

// Cancel Edit
cancelEditBtn.addEventListener('click', () => {
  editForm.style.display = 'none';
  quizArea.style.display = 'block';
});

// Navigation Buttons
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

function checkNavigationButtons() {
  prevBtn.disabled = currentQuestionIndex <= 0;
  nextBtn.disabled = currentQuestionIndex >= currentQuestions.length - 1;
}

// Restart
restartBtn.addEventListener('click', () => {
  subjectSelect.value = "";
  chapterSelect.innerHTML = '<option value="">Select Chapter</option>';
  chapterSelect.disabled = true;
  quizArea.style.display = 'none';
  scoreboardEl.innerText = '';
});

refreshSubjects();

// ADMIN LOGIN SYSTEM
const loginForm = document.getElementById('loginForm');
const loginBtn = document.getElementById('loginBtn');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loginError = document.getElementById('loginError');

// Real admin credentials
const ADMIN_USERNAME = "ajit@531049";
const ADMIN_PASSWORD = "ajitkumarram#531049";

let isAdmin = false;

loginBtn.addEventListener('click', () => {
  const user = usernameInput.value.trim();
  const pass = passwordInput.value.trim();

  if (user === ADMIN_USERNAME && pass === ADMIN_PASSWORD) {
    isAdmin = true;
    loginForm.style.display = 'none';
    document.getElementById('adminPanel').style.display = 'block';
    document.getElementById('deleteSubject').style.display = 'inline-block';
    document.getElementById('deleteChapter').style.display = 'inline-block';
    document.getElementById('deleteQuestion').style.display = 'inline-block';
    document.getElementById('editQuestion').style.display = 'inline-block';
    loginError.innerText = '';
  } else {
    loginError.innerText = "Invalid username or password.";
  }
});
// =================== ADMIN LOGIN + LOGOUT SYSTEM ===================

const loginForm = document.getElementById('loginForm');
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const logoutSection = document.getElementById('logoutSection');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loginError = document.getElementById('loginError');

const ADMIN_USERNAME = "ajit@531049";
const ADMIN_PASSWORD = "ajitkumarram#531049";

let isAdmin = localStorage.getItem("isAdmin") === "true";
if (isAdmin) {
  enableAdminView();
  loginForm.style.display = 'none';
}

loginBtn.addEventListener('click', () => {
  const user = usernameInput.value.trim();
  const pass = passwordInput.value.trim();

  if (user === ADMIN_USERNAME && pass === ADMIN_PASSWORD) {
    isAdmin = true;
    localStorage.setItem("isAdmin", "true");

    loginForm.style.display = 'none';
    enableAdminView();
    loginError.innerText = '';
  } else {
    loginError.innerText = "Invalid username or password.";
  }
});

logoutBtn.addEventListener('click', () => {
  isAdmin = false;
  localStorage.removeItem("isAdmin");
  disableAdminView();
  loginForm.style.display = 'block';
});

function enableAdminView() {
  document.getElementById('adminPanel').style.display = 'block';
  document.getElementById('deleteSubject').style.display = 'inline-block';
  document.getElementById('deleteChapter').style.display = 'inline-block';
  document.getElementById('deleteQuestion').style.display = 'inline-block';
  document.getElementById('editQuestion').style.display = 'inline-block';
  logoutSection.style.display = 'block';
}

function disableAdminView() {
  document.getElementById('adminPanel').style.display = 'none';
  document.getElementById('deleteSubject').style.display = 'none';
  document.getElementById('deleteChapter').style.display = 'none';
  document.getElementById('deleteQuestion').style.display = 'none';
  document.getElementById('editQuestion').style.display = 'none';
  logoutSection.style.display = 'none';
}
