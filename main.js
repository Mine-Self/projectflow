document.addEventListener("DOMContentLoaded", () => {
  const sideMenu = document.getElementById("sideMenu");
  const menuButton = document.getElementById("menuButton");
  const addProjectBtn = document.getElementById("addProjectBtn");
  const projectControls = document.getElementById("projectControls");
  const saveProjectBtn = document.getElementById("saveProjectBtn");
  const cancelProjectBtn = document.getElementById("cancelProjectBtn");

  menuButton.addEventListener("click", () => {
    sideMenu.classList.toggle("show");
  });

  addProjectBtn.addEventListener("click", () => {
    projectControls.classList.remove("hidden");
    addProjectBtn.style.display = "none";
  });

  cancelProjectBtn.addEventListener("click", () => {
    document.getElementById("newProjectInput").value = "";
    projectControls.classList.add("hidden");
    addProjectBtn.style.display = "inline";
  });

  saveProjectBtn.addEventListener("click", () => {
    const input = document.getElementById("newProjectInput");
    const name = input.value.trim();
    if (!name) return;

    // תוודא שאין שם כפול
    if (projects.some(p => p.name === name)) {
      alert("כבר קיים פרוייקט עם שם זהה.");
      return;
    }

    const project = {
      name,
      tasks: [],
      createdAt: new Date().toISOString()
    };

    projects.push(project);
    input.value = "";
    saveProjects();
    renderProjects();

    projectControls.classList.add("hidden");
    addProjectBtn.style.display = "inline";
  });

  function saveProjects() {
    localStorage.setItem("projects", JSON.stringify(projects));
  }

  function renderProjects() {
    const list = document.getElementById("projectList");
    list.innerHTML = "";
    projects.forEach((proj, index) => {
      const li = document.createElement("li");
      li.textContent = proj.name;
      li.addEventListener("click", () => openProject(index));
      list.appendChild(li);
    });
  }

  function openProject(index) {
    currentProjectIndex = index;
    document.getElementById("projectTitle").textContent = projects[index].name;
    document.getElementById("projectArea").style.display = "block";
    renderTasks();
  }

  function renderTasks() {
    const list = document.getElementById("taskList");
    list.innerHTML = "";
    const project = projects[currentProjectIndex];
    project.tasks.forEach(task => {
      const li = document.createElement("li");
      li.textContent = task.text;
      list.appendChild(li);
    });
  }

  // משתנים כלליים
  window.projects = JSON.parse(localStorage.getItem("projects") || "[]");
  window.currentProjectIndex = null;

  renderProjects();
});
