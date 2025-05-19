// Admin Login Control
function handleLogin() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (username === "ajit@admin" && password === "ajit#531049") {
    localStorage.setItem("isAdmin", "true");
    alert("Login successful!");
    document.getElementById("adminPanel").style.display = "block";
    document.getElementById("deleteChapter").style.display = "inline-block";
    document.getElementById("deleteSubject").style.display = "inline-block";
    document.getElementById("deleteQuestion").style.display = "inline-block";
    document.getElementById("editQuestion").style.display = "inline-block";
    document.getElementById("loginForm").style.display = "none";
  } else {
    alert("Invalid credentials");
  }
}

// Quiz Code from earlier (Paste your full working code below this)
let data = JSON.parse(localStorage.getItem('quizData')) || {};

// All your existing quiz JS logic (add, edit, delete, etc.) goes here.
// Use the full code you already had — no need to rewrite.
