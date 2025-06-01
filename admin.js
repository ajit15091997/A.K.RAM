let token = '';

async function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const res = await fetch("https://your-backend-url/api/admin/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();
  if (data.token) {
    token = data.token;
    document.getElementById("adminSection").style.display = "block";
    alert("Login successful");
  } else {
    alert("Login failed");
  }
}

async function addQuestion() {
  const subject = document.getElementById("subject").value;
  const chapter = document.getElementById("chapter").value;
  const question = document.getElementById("question").value;
  const options = [
    document.getElementById("opt1").value,
    document.getElementById("opt2").value,
    document.getElementById("opt3").value,
    document.getElementById("opt4").value
  ];
  const correct = document.getElementById("correct").value;

  const res = await fetch("https://your-backend-url/api/questions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ subject, chapter, question, options, correct })
  });

  const data = await res.json();
  if (res.ok) alert("Question added!");
  else alert("Error: " + data.message);
}
