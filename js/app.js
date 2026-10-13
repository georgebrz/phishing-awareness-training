let currentScenario;
let currentScenarios = [];
let currentIndex = 0;
let score = 0;

async function loadScenario() {
  const params = new URLSearchParams(window.location.search);
  const level = params.get("level");

  const response = await fetch("data/scenarios.json");
  const scenarios = await response.json();

  currentScenarios = scenarios.filter(
    (scenario) => scenario.difficulty === level
  );
  if (currentScenarios.length === 0) {
    window.location.href = "difficulty.html";

    return;
  }
  currentScenario = currentScenarios[currentIndex];

  displayScenario();
}

function displayScenario() {
  const difficultyLabel = document.getElementById("difficultyLabel");

  difficultyLabel.textContent =
    currentScenario.difficulty.charAt(0).toUpperCase() +
    currentScenario.difficulty.slice(1);

  difficultyLabel.className = "";

  if (currentScenario.difficulty === "beginner") {
    difficultyLabel.classList.add("beginner-label");
  } else if (currentScenario.difficulty === "intermediate") {
    difficultyLabel.classList.add("intermediate-label");
  } else if (currentScenario.difficulty === "advanced") {
    difficultyLabel.classList.add("advanced-label");
  }

  document.getElementById("progress").textContent =
    "Scenario " + (currentIndex + 1) + " of " + currentScenarios.length;

  let progressPercentage = ((currentIndex + 1) / currentScenarios.length) * 100;

  document.getElementById("progressFill").style.width =
    progressPercentage + "%";

  document.getElementById("scenarioTitle").textContent = currentScenario.title;

  document.getElementById("sender").textContent = currentScenario.sender;

  document.getElementById("subject").textContent = currentScenario.subject;

  document.getElementById("content").textContent = currentScenario.content;

  document.getElementById("feedback").innerHTML = "";

  document.getElementById("phishingBtn").disabled = false;
  document.getElementById("legitimateBtn").disabled = false;
}

function checkAnswer(answer) {
  const feedback = document.getElementById("feedback");

  document.getElementById("phishingBtn").disabled = true;
  document.getElementById("legitimateBtn").disabled = true;

  let buttonText = "Next Scenario";

  if (currentIndex === currentScenarios.length - 1) {
    buttonText = "View Results";
  }

  if (answer === currentScenario.answer) {
    score++;

    feedback.innerHTML =
      "<div class='feedback correct-feedback'>" +
      "<h3>✓ Correct!</h3>" +
      "<p>" +
      currentScenario.explanation +
      "</p>" +
      "<button class='btn' onclick='nextScenario()'>" +
      buttonText +
      "</button>" +
      "</div>";
  } else {
    feedback.innerHTML =
      "<div class='feedback incorrect-feedback'>" +
      "<h3>✗ Incorrect</h3>" +
      "<p>" +
      currentScenario.explanation +
      "</p>" +
      "<button class='btn' onclick='nextScenario()'>" +
      buttonText +
      "</button>" +
      "</div>";
  }

  document.getElementById("feedback").scrollIntoView({
    behavior: "smooth",
    block: "center",
  });
}

function nextScenario() {
  currentIndex++;

  if (currentIndex < currentScenarios.length) {
    currentScenario = currentScenarios[currentIndex];
    displayScenario();
  } else {
    localStorage.setItem("score", score);
    localStorage.setItem("total", currentScenarios.length);

    window.location.href = "results.html";
  }
}

loadScenario();
