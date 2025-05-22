let projects = [];
let currentProjectIndex = null;

const projectListEl = document.getElementById("projectList");
const projectAreaEl = document.getElementById("projectArea");
const projectTitleEl = document.getElementById("projectTitle");
const taskListEl = document.getElementById("taskList");
const newTaskInput = document.getElementById("newTaskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskFilter = document.getElementById("taskFilter");

const showAddProjectBtn = document.getElementById("showAddProjectBtn");
const addProjectArea = document.getElementById("addProjectArea");
const newProjectInput = document.getElementById("newProjectInput");
const saveProjectBtn = document.getElementById("saveProjectBtn");
const cancelProjectBtn = document.getElementById("cancelProjectBtn");

const menuBtn = document.getElementById("menuBtn");
const sideMenu = document.getElementById("sideMenu");
const signOutBtn = document.getElementById("signOutBtn");

function saveProjectsToStorage() {
  localStorage.setItem("projects", JSON.stringify(projects));
}

function renderProjects() {
  projectListEl.innerHTML = "";

  projects.forEach((project, index) => {
    const li = document.createElement("li");

    const btn = document.createElement("button");
    btn.textContent = `${project.name} (${new Date(project.createdAt).toLocaleDateString("he-IL")})`;
    btn.className = "project-btn";
    btn.addEventListener("click", () => {
      currentProjectIndex = index;
      renderTasks();
      projectAreaEl.style.display = "block";
      projectTitleEl.textContent = project.name;
    });

    // כפתורי עריכה ומחיקה לפרויקט
    const actionsDiv = document.createElement("div");
    actionsDiv.className = "actions";

    const editBtn = document.createElement("button");
    editBtn.textContent = "ערוך";
    editBtn.addEventListener("click", () => {
      const newName = prompt("ערוך שם פרויקט", project.name);
      if (newName && newName.trim() !== "") {
        projects[index].name = newName.trim();
        saveProjectsToStorage();
        renderProjects();
        if (currentProjectIndex === index) {
          projectTitleEl.textContent = newName.trim();
        }
      }
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "מחק";
    deleteBtn.addEventListener("click", () => {
      if (confirm(`למחוק את הפרויקט "${project.name}"?`)) {
        projects.splice(index, 1);
        if (currentProjectIndex === index) {
          currentProjectIndex = null;
          projectAreaEl.style.display = "none";
        }
        saveProjectsToStorage();
        renderProjects();
      }
    });

    actionsDiv.appendChild(editBtn);
    actionsDiv.appendChild(deleteBtn);

    li.appendChild(btn);
    li.appendChild(actionsDiv);

    projectListEl.appendChild(li);
  });
}

function renderTasks() {
  taskListEl.innerHTML = "";
  if (currentProjectIndex === null) return;

  const project = projects[currentProjectIndex];
  let filteredTasks = project.tasks || [];

  const filterValue = taskFilter.value;
  if (filterValue !== "all") {
    filteredTasks = filteredTasks.filter((t) => t.status === filterValue);
  }

  filteredTasks.forEach((task, taskIndex) => {
    const li = document.createElement("li");

    const taskBtn = document.createElement("button");
    taskBtn.className = "task-btn";
    taskBtn.textContent = task.name;

    // קליק על המשימה - פותח רשימה נפתחת לשינוי סטטוס ועריכה
    taskBtn.addEventListener("click", () => {
      const select = document.createElement("select");
      select.className = "status-select";
      ["todo", "inprogress", "done"].forEach((status) => {
        const option = document.createElement("option");
        option.value = status;
        option.textContent = status === "todo" ? "לעשות" : status === "inprogress" ? "בתהליך" : "בוצע";
        if (task.status === status) option.selected = true;
        select.appendChild(option);
      });

      select.addEventListener("change", () => {
        project.tasks[taskIndex].status = select.value;
        saveProjectsToStorage();
        renderTasks();
      });

      // אפשרות עריכה של שם המשימה
      const editInput = document.createElement("input");
      editInput.type = "text";
      editInput.value = task.name;
      editInput.className = "edit-input";
      editInput.addEventListener("change", () => {
        project.tasks[taskIndex].name = editInput.value.trim() || task.name;
        saveProjectsToStorage();
        renderTasks();
      });

      li.innerHTML = "";
      li.appendChild(editInput);
      li.appendChild(select);
    });

    li.appendChild(taskBtn);
    taskListEl.appendChild(li);
  });
}

addTaskBtn.addEventListener("click", () => {
  if (!newTaskInput.value.trim() || currentProjectIndex === null) return;

  const newTask = {
    name: newTaskInput.value.trim(),
    status: "todo",
  };

  projects[currentProjectIndex].tasks = projects[currentProjectIndex].tasks || [];
  projects[currentProjectIndex].tasks.push(newTask);

  newTaskInput.value = "";
  saveProjectsToStorage();
  renderTasks();
});

taskFilter.addEventListener("change", renderTasks);

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
  const projectName = newProjectInput.value.trim();
  if (!projectName) {
    alert("אנא הזן שם פרויקט תקין");
    return;
  }
  const newProject = {
    name: projectName,
    createdAt: new Date().toISOString(),
    tasks: []
  };
  projects.push(newProject);
  saveProjectsToStorage();
  renderProjects();

  addProjectArea.style.display = "none";
  showAddProjectBtn.style.display = "inline-block";
  newProjectInput.value = "";

  // פתח את הפרויקט החדש
  currentProjectIndex = projects.length - 1;
  projectTitleEl.textContent = newProject.name;
  projectAreaEl.style.display = "block";
  renderTasks();
});

// תפריט צד
menuBtn.addEventListener("click", () => {
  sideMenu.classList.toggle("open");
});

signOutBtn.addEventListener("click", () => {
  firebase.auth().signOut();
  sideMenu.classList.remove("open");
  currentProjectIndex = null;
  projectAreaEl.style.display = "none";
  projectListEl.innerHTML = "";
});

window.onload = () => {
  // אם משתמש מחובר כבר, טען פרויקטים
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      document.getElementById("userEmail").innerText = user.email;
      projects = JSON.parse(localStorage.getItem("projects") || "[]");
      renderProjects();
    }
  });
};
