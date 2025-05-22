let projects = JSON.parse(localStorage.getItem("projects") || "[]");
let currentProjectIndex = null;

// תצוגת תפריט צד
document.getElementById("menuButton").addEventListener("click", () => {
  const sideMenu = document.getElementById("sideMenu");
  sideMenu.classList.toggle("open");
});

// כפתור הוספת פרויקט
document.getElementById("addProjectBtn").addEventListener("click", () => {
  document.getElementById("projectInputContainer").classList.remove("hidden");
});

// כפתור ביטול
document.getElementById("cancelProjectBtn").addEventListener("click", () => {
  document.getElementById("projectInputContainer").classList.add("hidden");
  document.getElementById("newProjectInput").value = "";
});

// כפתור שמירה
document.getElementById("saveProjectBtn").addEventListener("click", () => {
  const input = document.getElementById("newProjectInput");
  const name = input.value.trim();
  if (!name) return;
  if (projects.find(p => p.name === name)) {
    alert("כבר קיים פרויקט עם שם זהה.");
    return;
  }
  projects.push({ name, tasks: [], createdAt: new Date().toISOString() });
  input.value = "";
  saveProjects();
  renderProjects();
  document.getElementById("projectInputContainer").classList.add("hidden");
});

// רינדור פרויקטים
function renderProjects() {
  const ul = document.getElementById("projectList");
  ul.innerHTML = "";
  projects.forEach((proj, index) => {
    const li = document.createElement("li");
    li.textContent = proj.name;
    li.style.cursor = "pointer";
    li.onclick = () => openProject(index);
    ul.appendChild(li);
  });
}

// פתיחת פרויקט
function openProject(index) {
  currentProjectIndex = index;
  const project = projects[index];
  document.getElementById("projectArea").style.display = "block";
  document.getElementById("projectTitle").textContent = "פרויקט: " + project.name;
  renderTasks();
}

// שמירה
function saveProjects() {
  localStorage.setItem("projects", JSON.stringify(projects));
}

// משימות
function renderTasks() {
  const ul = document.getElementById("taskList");
  ul.innerHTML = "";
  const filter = document.getElementById("taskFilter").value;
  const tasks = projects[currentProjectIndex].tasks.filter(task =>
    filter === "all" || task.status === filter
  );
  tasks.forEach((task, idx) => {
    const li = document.createElement("li");
    li.textContent = task.text + " (" + task.status + ")";
    ul.appendChild(li);
  });
}

document.getElementById("addTaskBtn").addEventListener("click", () => {
  const input = document.getElementById("newTaskInput");
  const text = input.value.trim();
  if (!text) return;
  projects[currentProjectIndex].tasks.push({
    text,
    status: "todo",
    createdAt: new Date().toISOString()
  });
  input.value = "";
  saveProjects();
  renderTasks();
});

document.getElementById("taskFilter").addEventListener("change", renderTasks);
