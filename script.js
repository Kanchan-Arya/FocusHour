
const today = document.getElementById("today");
const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");
const progressBar = document.getElementById("progress-bar");
const progressText = document.getElementById("progress-text");
const progressMessage = document.getElementById("progress-message");

today.textContent = new Date().toLocaleDateString("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric"
});

// Load saved tasks, if available.
let tasks = [];

try {
  tasks = JSON.parse(localStorage.getItem("studyBloomTasks")) || [];
  if (!Array.isArray(tasks)) tasks = [];
} catch {
  tasks = [];
}

function saveTasks() {
  localStorage.setItem("studyBloomTasks", JSON.stringify(tasks));
}

function updateProgress() {
  const completed = tasks.filter(task => task.done).length;
  const percentage = tasks.length
    ? Math.round((completed / tasks.length) * 100)
    : 0;

  progressBar.style.width = percentage + "%";
  progressText.textContent = percentage + "%";

  if (tasks.length === 0) {
    progressMessage.textContent = "Add your first task and start blooming! 🌱";
  } else if (percentage === 100) {
    progressMessage.textContent = "You did it! So proud of you! 🎉";
  } else {
    progressMessage.textContent =
      `${completed} of ${tasks.length} tasks completed. Keep growing! 💗`;
  }
}

function renderTasks() {
  taskList.replaceChildren();

  if (tasks.length === 0) {
    const empty = document.createElement("li");
    empty.textContent = "Your study journey starts here 🌷";
    taskList.appendChild(empty);
  }

  tasks.forEach(task => {
    const item = document.createElement("li");
    if (task.done) item.classList.add("done");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.done;
    checkbox.setAttribute("aria-label", "Mark task complete");

    checkbox.addEventListener("change", () => {
      task.done = checkbox.checked;
      saveTasks();
      renderTasks();
    });

    const label = document.createElement("span");
    label.textContent = task.text;

    const removeButton = document.createElement("button");
    removeButton.textContent = "×";
    removeButton.className = "delete-btn";
    removeButton.setAttribute("aria-label", "Delete task");

    removeButton.addEventListener("click", () => {
      tasks = tasks.filter(current => current.id !== task.id);
      saveTasks();
      renderTasks();
    });

    item.append(checkbox, label, removeButton);
    taskList.appendChild(item);
  });

  updateProgress();
}

taskForm.addEventListener("submit", event => {
  event.preventDefault();

  const text = taskInput.value.trim();
  if (!text) return;

  tasks.push({
    id: Date.now() + Math.random(),
    text,
    done: false
  });

  saveTasks();
  renderTasks();
  taskInput.value = "";
  taskInput.focus();
});

renderTasks();

// Focus timer
const timerDisplay = document.getElementById("timer");
const startButton = document.getElementById("start-btn");
const resetButton = document.getElementById("reset-btn");
const timerMessage = document.getElementById("timer-message");

const FOCUS_SECONDS = 59 * 60;
let secondsLeft = FOCUS_SECONDS;
let intervalId = null;

function showTime() {
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  timerDisplay.textContent =
    String(minutes).padStart(2, "0") + ":" +
    String(seconds).padStart(2, "0");
}

startButton.addEventListener("click", () => {
  if (intervalId !== null) {
    clearInterval(intervalId);
    intervalId = null;
    startButton.textContent = "Resume focus";
    timerMessage.textContent = "Paused. Take a breath when you need one.";
    return;
  }

  if (secondsLeft === 0) {
    secondsLeft = FOCUS_SECONDS;
    showTime();
  }

  startButton.textContent = "Pause";
  timerMessage.textContent = "You're doing amazing. Keep going! 🌸";

  intervalId = setInterval(() => {
    secondsLeft--;
    showTime();

    if (secondsLeft <= 0) {
      clearInterval(intervalId);
      intervalId = null;
      startButton.textContent = "Start again";
      timerMessage.textContent = "Focus session complete! Time for a little break 🎉";
    }
  }, 1000);
});

resetButton.addEventListener("click", () => {
  clearInterval(intervalId);
  intervalId = null;
  secondsLeft = FOCUS_SECONDS;
  showTime();
  startButton.textContent = "Start focus";
  timerMessage.textContent = "Fresh start! You've got this. 💗";
});

showTime();
