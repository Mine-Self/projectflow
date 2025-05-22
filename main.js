// הצגה והסתרה של אזור הוספת פרויקט
const showAddProjectBtn = document.getElementById("showAddProjectBtn");
const addProjectArea = document.getElementById("addProjectArea");
const saveProjectBtn = document.getElementById("saveProjectBtn");
const cancelProjectBtn = document.getElementById("cancelProjectBtn");
const newProjectInput = document.getElementById("newProjectInput");

showAddProjectBtn.addEventListener("click", () => {
  addProjectArea.style.display = "block";
  showAddProjectBtn.style.display = "none";
  newProjectInput.focus();
});

cancelProjectBtn.addEventListener("click", () => {
  addProjectArea.style.display = "none";
  showAddProjectBtn.style.display = "inline-block";
  newProjectInput.value = "";
});

saveProjectBtn.addEventListener("click", () => {
  addProject();
});

// שאר הפונקציות שלך (renderProjects, addProject וכו') צריכים להיות פה כמו שהיו

let projects = JSON.parse(localStorage.getItem("projects") || "[]");
let currentProjectIndex = null;

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

function addProject() {
  const projectName = newProjectInput.value.trim();
  if (!projectName) return alert("אנא הזן שם פרויקט");
  // בדיקת כפילות שם פרויקט
  if (projects.some((p) => p.name === projectName)) {
    alert("פרויקט עם השם הזה כבר קיים");
    return;
  }
  projects.push({ name: projectName, tasks: [] });
  newProjectInput.value = "";
  save();
  renderProjects();
  addProjectArea.style.display = "none";
  showAddProjectBtn.style.display = "inline-block";
}

function openProject(index) {
  currentProjectIndex = index;
  const project = projects[index];
  document.getElementById("projectArea").style.display = "block";
  document.getElementById("projectTitle").textContent = "פרויקט: " + project.name;
  renderTasks();
}

function renderTasks() {
  // ... כפי שהיה אצלך
}

function addTask() {
  // ... כפי שהיה אצלך
}

function save() {
  localStorage.setItem("projects", JSON.stringify(projects));
}

window.onload = () => {
  // אם המשתמש מחובר, טען פרויקטים וכו'
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      document.getElementById("login").style.display = "none";
      document.getElementById("app").style.display = "block";
      document.getElementById("userEmail").innerText = user.email;
      projects = JSON.parse(localStorage.getItem("projects") || "[]");
      renderProjects();
    } else {
      document.getElementById("login").style.display = "block";
      document.getElementById("app").style.display = "none";
    }
  });
};
