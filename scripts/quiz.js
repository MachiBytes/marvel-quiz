let questions = {};
let currentQuestionIndex = 1;
let totalQuestions = 0;
let shuffledAnswerMap = [];

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch("../data/questions.json");
    questions = await res.json();
    totalQuestions = Object.keys(questions).length;
    loadQuestion();
  } catch (err) {
    console.error("Failed to load questions.json", err);
  }

  document.getElementById("next").onclick = () => {
    if (currentQuestionIndex < totalQuestions) {
      currentQuestionIndex++;
      loadQuestion();
    }
  };

  document.getElementById("back").onclick = () => {
    if (currentQuestionIndex > 1) {
      currentQuestionIndex--;
      loadQuestion();
    }
  };

  document.getElementById("submit").onclick = () => {
    let total = 0;
    for (const q of Object.values(questions)) {
      total += q.answer;
    }

    const now = new Date().toISOString();
    localStorage.setItem(`${now}-score`, total);
  
    window.location.href = "hero.html";
  };
});

function loadQuestion() {
  const question = questions[currentQuestionIndex];
  document.title = `Quizzes - ${currentQuestionIndex}`;
  document.querySelector("h2").innerText = `Question ${currentQuestionIndex}`;
  document.getElementById("question").innerText = question.question;

  const answerEntries = Object.entries(question.answers);
  shuffledAnswerMap = shuffleArray(answerEntries);
  const buttons = document.querySelectorAll(".parallelogram");

  buttons.forEach((btn, index) => {
    const [id, text] = shuffledAnswerMap[index] || ["", ""];
    btn.id = id;
    btn.style.display = text ? "inline-block" : "none";
    btn.onclick = () => toggleStyle(id);
    btn.querySelector(".unskew").innerText = text;

    btn.classList.remove("changed");
    if (parseInt(id) === question.answer) {
      btn.classList.add("changed");
    }
  });

  updateNavButtons();
}

function toggleStyle(id) {
  document.querySelectorAll(".parallelogram").forEach((btn) => {
    btn.classList.remove("changed");
  });

  const selected = document.getElementById(id);
  selected.classList.add("changed");

  questions[currentQuestionIndex].answer = parseInt(id);
  updateNavButtons();
}

function shuffleArray(array) {
  return array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

function updateNavButtons() {
  const back = document.getElementById("back");
  const next = document.getElementById("next");
  const submit = document.getElementById("submit");

  if (currentQuestionIndex === 1) {
    back.style.display = "none";
    next.style.display = "inline-block";
    submit.style.display = "none";
  } else if (currentQuestionIndex === totalQuestions) {
    back.style.display = "inline-block";
    next.style.display = "none";
    submit.style.display = "inline-block";
  } else {
    back.style.display = "inline-block";
    next.style.display = "inline-block";
    submit.style.display = "none";
  }

  if (questions[currentQuestionIndex].answer == 0) {
    next.style.visibility = "hidden";
    submit.style.visibility = "hidden";
  } else {
    next.style.visibility = "visible";
    submit.style.visibility = "visible";
  }
}
