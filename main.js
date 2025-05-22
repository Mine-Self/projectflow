document.addEventListener("DOMContentLoaded", () => {
  const menuBtn = document.getElementById("toggleMenu");
  const sideMenu = document.getElementById("sideMenu");
  const showAddProjectBtn = document.getElementById("showAddProjectForm");
  const addProjectForm = document.getElementById("addProjectForm");

  let currentProjectIndex = null;
  let projects = JSON.parse(localStorage.getItem("projects") || "[]");

  menuBtn.addEventListener("click", () => {
    sideMenu.classList.toggle("open");
  });

  showAddProjectBtn.addEventListener("click", () => {
    showAddProjectBtn.style.display = "none";
    addProjectForm.classList.remove("form-hidden");
  });

  window.cancelAddProject = () => {
    document.getElementById("newProjectInput").value = "";
    addProjectForm.classList.add("form-hidden");
    showAddProjectBtn.style.display = "inline-block";
  };

  window.saveNewProject = () => {
    const input = document.getElementById("newProjectInput");
    const name = input.value.trim();
    if (!name || projects.some(p => p.name === name)) {
      alert("שם הפרויקט ריק או כבר קיים.");
      return;
    }
    projects.push({ name, created: new Date().toISOString(), tasks: [] });
    saveProjects();
    renderProjects();
    cancelAddProject();
  };

  window.openProject = (index) => {
    currentProjectIndex = index;
    document.getElementById("projectTitle").textContent =
      `פרויקט: ${projects[index].name} (נוצר בתאריך: ${new Date(projects[index].created).toLocaleDateString()})`;
    document.getElementById("projectArea").style.display = "block";
    renderTasks();
  };

  window.renderProjects = () => {
    const ul = document.getElementById("projectList");
    ul.innerHTML = "";
    projects.forEach((proj, i) => {
      const li = document.createElement("li");

      const btn = document.createElement("button");
      btn.textContent = proj.name;
      btn.onclick = () => openProject(i);
      li.appendChild(btn);

      const editBtn = document.createElement("button");
      editBtn.textContent = "✏️";
      editBtn.onclick = () => {
        const newName = prompt("שם חדש:", proj.name);
        if (newName && !projects.some(p => p.name === newName)) {
          proj.name = newName;
          saveProjects();
          renderProjects();
        }
      };
      li.appendChild(editBtn);

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "🗑️";
      deleteBtn.onclick = () => {
        if (confirm("למחוק את הפרויקט?")) {
          projects.splice(i, 1);
          saveProjects();
          renderProjects();
          document.getElementById("projectArea").style.display = "none";
        }
      };
      li.appendChild(deleteBtn);

      ul.appendChild(li);
    });
  };

  window.renderTasks = () => {
    const filter = document.getElementById("statusFilter").value;
    const taskList = document.getElementById("taskList");
    taskList.innerHTML = "";
    if (currentProjectIndex === null) return;
    const tasks = projects[currentProjectIndex].tasks;

    tasks.forEach((task, idx) => {
      if (filter !== "all" && task.status !== filter) return;

      const li = document.createElement("li");
      li.innerHTML = `
        <span>${task.text} (סטטוס: ${task.status}, נוצר: ${new Date(task.created).toLocaleDateString()})</span>
        <button onclick="editTask(${idx})">✏️</button>
        <button onclick="deleteTask(${idx})">🗑️</button>
      `;
      taskList.appendChild(li);
    });
  };

  window.addTask = () => {
    const text = document.getElementById("newTaskInput").value.trim();
    const status = document.getElementById("newTaskStatus").value;
    if (!text) return;
    projects[currentProjectIndex].tasks.push({
      text,
      status,
      created: new Date().toISOString()
    });
    saveProjects();
    document.getElementById("newTaskInput").value = "";
    renderTasks();
  };

  window.editTask = (idx) => {
    const task = projects[currentProjectIndex].tasks[idx];
    const newText = prompt("ערוך משימה:", task.text);
    if (newText) {
      task.text = newText;
      saveProjects();
      renderTasks();
    }
  };

  window.deleteTask = (idx) => {
    if (confirm("למחוק את המשימה?")) {
      projects[currentProjectIndex].tasks.splice(idx, 1);
      saveProjects();
      renderTasks();
    }
  };

  function saveProjects() {
    localStorage.setItem("projects", JSON.stringify(projects));
  }

  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      document.getElementById("sideMenuEmail").textContent = user.email;
    }
  });

  renderProjects();
});
