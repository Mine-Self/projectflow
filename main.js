let projects = JSON.parse(localStorage.getItem("projects") || "[]");
let currentProjectIndex = null;

function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  sidebar.classList.toggle("hidden");
}

function showProjectForm() {
  document.getElementById("projectForm").classList.remove("hidden");
}

function hideProjectForm() {
  document.getElementById("projectForm").classList.add("hidden");
  document.getElementById("newProjectInput").value = "";
}

function addProject() {
  const input = document.getElementById("newProjectInput");
  const name = input.value.trim();

  if (!name) return alert("יש להזין שם פרויקט");
  if (projects.some(p => p.name === name)) return alert("כבר קיים פרויקט בשם הזה");

  const project = {
    name,
    createdAt: new Date().toISOString(),
    tasks: []
  };

  projects.push(project);
  save();
  renderProjects();
  hideProjectForm();
}

function openProject(index) {
  currentProjectIndex = index;
  const project = projects[index];
  document.getElementById("projectArea").style.display = "block";
  document.getElementById("projectTitle").innerHTML = `
    <button onclick="editProjectName(${index})">${project.name}</button>`;
  document.getElementById("projectDate").textContent = "נוצר בתאריך: " + new Date(project.createdAt).toLocaleString();
  renderTasks();
}

function editProjectName(index) {
  const newName = prompt("שם חדש לפרויקט:", projects[index].name);
  if (!newName) return;

  if (projects.some((p, i) => i !== index && p.name === newName)) {
    alert("כבר קיים פרויקט בשם הזה");
    return;
  }

  projects[index].name = newName;
  save();
  renderProjects();
  openProject(index);
}

function renderProjects() {
  const ul = document.getElementById("projectList");
  ul.innerHTML = "";
  projects.forEach((proj, index) => {
    const li = document.createElement("li");
    li.innerHTML = `<button onclick="openProject(${index})">${proj.name}</button>`;
    ul.appendChild(li);
  });
}

function addTask() {
  const input = document.getElementById("newTaskInput");
  const text = input.value.trim();
  if (!text) return;

  const task = {
    text,
    status: "לא התחיל",
    createdAt: new Date().toISOString()
  };

  projects[currentProjectIndex].tasks.push(task);
  input.value = "";
  save();
  renderTasks();
}

function renderTasks() {
  const ul = document.getElementById("taskList");
  ul.innerHTML = "";
  const tasks = projects[currentProjectIndex].tasks;

  tasks.forEach((task, idx) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <div>
        <button onclick="editTaskText(${idx})">${task.text}</button>
        <select onchange="updateTaskStatus(${idx}, this.value)">
          <option ${task.status === "לא התחיל" ? "selected" : ""}>לא התחיל</option>
          <option ${task.status === "בתהליך" ? "selected" : ""}>בתהליך</option>
          <option ${task.status === "בוצע" ? "selected" : ""}>בוצע</option>
        </select>
        <small style="display:block;color:gray">נוצר: ${new Date(task.createdAt).toLocaleString()}</small>
      </div>
    `;
    ul.appendChild(li);
  });
}

function editTaskText(index) {
  const task = projects[currentProjectIndex].tasks[index];
  const newText = prompt("ערוך את שם המשימה:", task.text);
  if (newText) {
    task.text = newText;
    save();
    renderTasks();
  }
}

function updateTaskStatus(index, newStatus) {
  projects[currentProjectIndex].tasks[index].status = newStatus;
  save();
  renderTasks();
}

function save() {
  localStorage.setItem("projects", JSON.stringify(projects));
}
