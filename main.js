// אלמנטים
const showAddProjectBtn = document.getElementById("showAddProjectBtn");
const addProjectArea = document.getElementById("addProjectArea");
const saveProjectBtn = document.getElementById("saveProjectBtn");
const cancelProjectBtn = document.getElementById("cancelProjectBtn");
const newProjectInput = document.getElementById("newProjectInput");
const projectList = document.getElementById("projectList");
const projectArea = document.getElementById("projectArea");
const projectTitle = document.getElementById("projectTitle");
const taskFilter = document.getElementById("taskFilter");
const taskList = document.getElementById("taskList");
const newTaskInput = document.getElementById("newTaskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const userEmailEl = document.getElementById("userEmail");
const sideMenu = document.getElementById("sideMenu");
const menuButton = document.getElementById("menuButton");
const logoutButton = document.getElementById("logoutButton");

let projects = JSON.parse(localStorage.getItem("projects") || "[]");
let currentProjectIndex = null;

// --- תפריט צד ---

menuButton.addEventListener("click", () => {
  if (sideMenu.style.display === "block") {
    sideMenu.style.display = "none";
  } else {
    sideMenu.style.display = "block";
  }
});

logoutButton.addEventListener("click", () => {
  signOut(); // מוכן בauth.js
});

// --- הוספת פרויקט ---

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

function addProject() {
  const projectName = newProjectInput.value.trim();
  if (!projectName) {
    alert("אנא הזן שם פרויקט");
    return;
  }
  if (projects.some(p => p.name === projectName)) {
    alert("פרויקט עם השם הזה כבר קיים");
    return;
  }
  const createdAt = new Date().toISOString();
  projects.push({ name: projectName, createdAt, tasks: [] });
  saveAndRenderProjects();
  addProjectArea.style.display = "none";
  showAddProjectBtn.style.display = "inline-block";
  newProjectInput.value = "";
}

// --- ניהול פרויקטים ---

function saveAndRenderProjects() {
  localStorage.setItem("projects", JSON.stringify(projects));
  renderProjects();
}

function renderProjects() {
  projectList.innerHTML = "";
  projects.forEach((proj, i) => {
    const li = document.createElement("li");

    // כפתור שם פרויקט עם תאריך יצירה
    const btn = document.createElement("button");
    btn.textContent = `${proj.name} (נוצר: ${new Date(proj.createdAt).toLocaleDateString("he-IL")})`;
    btn.className = "project-button";
    btn.onclick = () => openProject(i);
    li.appendChild(btn);

    // כפתור עריכה
    const editBtn = document.createElement("button");
    editBtn.textContent = "ערוך";
    editBtn.className = "small-btn";
    editBtn.onclick = (e) => {
      e.stopPropagation();
      editProject(i);
    };
    li.appendChild(editBtn);

    // כפתור מחיקה
    const delBtn = document.createElement("button");
    delBtn.textContent = "מחק";
    delBtn.className = "small-btn";
    delBtn.onclick = (e) => {
      e.stopPropagation();
      deleteProject(i);
    };
    li.appendChild(delBtn);

    projectList.appendChild(li);
  });
}

function editProject(index) {
  const newName = prompt("ערוך שם פרויקט", projects[index].name);
  if (newName && newName.trim() !== "") {
    if (projects.some((p, i) => i !== index && p.name === newName.trim())) {
      alert("פרויקט עם השם הזה כבר קיים");
      return;
    }
    projects[index].name = newName.trim();
    saveAndRenderProjects();
    if (currentProjectIndex === index) {
      projectTitle.textContent = "פרויקט: " + newName.trim();
    }
  }
}

function deleteProject(index) {
  if (confirm("האם למחוק את הפרויקט?")) {
    projects.splice(index, 1);
    if (currentProjectIndex === index) {
      projectArea.style.display = "none";
      currentProjectIndex = null;
    }
    saveAndRenderProjects();
  }
}

function openProject(index) {
  currentProjectIndex = index;
  projectTitle.textContent = "פרויקט: " + projects[index].name;
  projectArea.style.display = "block";
  renderTasks();
}

// --- ניהול משימות ---

function renderTasks() {
  if (currentProjectIndex === null) return;

  const project = projects[currentProjectIndex];
  const filter = taskFilter.value;
  taskList.innerHTML = "";

  project.tasks
    .filter((task) => {
      if (filter === "all") return true;
      return task.status === filter;
    })
    .forEach((task, i) => {
      const li = document.createElement("li");

      // כפתור שם משימה עם תאריך יצירה
      const btn = document.createElement("button");
      btn.textContent = `${task.name} (נוצר: ${new Date(task.createdAt).toLocaleDateString("he-IL")})`;
      btn.className = "task-button";
      btn.onclick = () => editTaskStatus(i);
      li.appendChild(btn);

      // כפתור מחיקה
      const delBtn = document.createElement("button");
      delBtn.textContent = "מחק";
      delBtn.className = "small-btn";
      delBtn.onclick = (e) => {
        e.stopPropagation();
        deleteTask(i);
      };
      li.appendChild(delBtn);

      taskList.appendChild(li);
    });
}

taskFilter.addEventListener("change", renderTasks);

addTaskBtn.addEventListener("click", () => {
  addTask();
});

function addTask() {
  if (currentProjectIndex === null) {
    alert("בחר פרויקט קודם");
    return;
  }
  const taskName = newTaskInput.value.trim();
  if (!taskName) {
    alert("אנא הזן שם משימה");
    return;
  }
  const task = {
    name: taskName,
    status: "todo", // שלוש אפשרויות: todo, inprogress, done
    createdAt: new Date().toISOString(),
  };
  projects[currentProjectIndex].tasks.push(task);
  newTaskInput.value = "";
  saveAndRenderProjects();
  renderTasks();
}

function editTaskStatus(taskIndex) {
  const statuses = {
    todo: "לתכנון",
    inprogress: "בעבודה",
    done: "בוצע",
  };
  const currentStatus = projects[currentProjectIndex].tasks[taskIndex].status;
  const newStatus = prompt(
    `שנה סטטוס משימה:\nאפשרויות: todo, inprogress, done\nסטטוס נוכחי: ${statuses[currentStatus]}`,
    currentStatus
  );
  if (newStatus && ["todo", "inprogress", "done"].includes(newStatus)) {
    projects[currentProjectIndex].tasks[taskIndex].status = newStatus;
    saveAndRenderProjects();
    renderTasks();
  } else if (newStatus !== null) {
    alert("סטטוס לא חוקי");
  }
}

function deleteTask(taskIndex) {
  if (confirm("האם למחוק את המשימה?")) {
    projects[currentProjectIndex].tasks.splice(taskIndex, 1);
    saveAndRenderProjects();
    renderTasks();
  }
}

// --- התחברות / התנתקות ---

window.onload = () => {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      document.getElementById("login").style.display = "none";
      document.getElementById("app").style.display = "block";
      userEmailEl.textContent = user.email;
      projects = JSON.parse(localStorage.getItem("projects") || "[]");
      renderProjects();
    } else {
      document.getElementById("login").style.display = "block";
      document.getElementById("app").style.display = "none";
      sideMenu.style.display = "none";
    }
  });
};
