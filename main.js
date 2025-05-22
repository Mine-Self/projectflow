let projects = JSON.parse(localStorage.getItem("projects") || "[]");
let currentProjectId = null;

// DOM אלמנטים
const projectListEl = document.getElementById("projectList");
const projectFormEl = document.getElementById("projectForm");
const showProjectFormBtn = document.getElementById("showProjectFormBtn");
const newProjectInput = document.getElementById("newProjectInput");
const saveProjectBtn = document.getElementById("saveProjectBtn");
const cancelProjectBtn = document.getElementById("cancelProjectBtn");

const projectAreaEl = document.getElementById("projectArea");
const projectTitleEl = document.getElementById("projectTitle");
const projectDateEl = document.getElementById("projectDate");

const newTaskInput = document.getElementById("newTaskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskListEl = document.getElementById("taskList");

const sidebar = document.getElementById("sidebar");
const menuButton = document.getElementById("menuButton");
const sidebarEmail = document.getElementById("sidebarEmail");
const logoutBtn = document.getElementById("logoutBtn");

const statusFilterSelect = document.getElementById("statusFilterSelect");

// שמירת נתונים ב-localStorage
function save() {
  localStorage.setItem("projects", JSON.stringify(projects));
}

// עיצוב תאריך לקריאה
function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("he-IL", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// הצגת רשימת פרויקטים עם כפתורי עריכה ומחיקה
function renderProjects() {
  projectListEl.innerHTML = "";

  projects.forEach(proj => {
    const li = document.createElement("li");
    li.classList.add("project-item");

    // כפתור בחירת פרויקט
    const btn = document.createElement("button");
    btn.classList.add("project-btn");
    btn.innerHTML = `<strong>${proj.name}</strong><br><small>נוצר: ${formatDate(proj.createdAt)}</small>`;
    btn.onclick = () => selectProject(proj.id);

    li.appendChild(btn);

    // כפתור עריכה לפרויקט
    const editBtn = document.createElement("button");
    editBtn.textContent = "ערוך";
    editBtn.classList.add("project-edit-btn");
    editBtn.onclick = (e) => {
      e.stopPropagation();
      editProject(proj.id);
    };
    li.appendChild(editBtn);

    // כפתור מחיקה לפרויקט
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "מחק";
    deleteBtn.classList.add("project-delete-btn");
    deleteBtn.onclick = (e) => {
      e.stopPropagation();
      deleteProject(proj.id);
    };
    li.appendChild(deleteBtn);

    projectListEl.appendChild(li);
  });
}

// בחירת פרויקט ועדכון המשימות בהתאם
function selectProject(id) {
  if (currentProjectId === id) return;
  currentProjectId = id;

  const project = projects.find(p => p.id === id);
  if (!project) return;

  projectAreaEl.style.display = "block";
  projectTitleEl.textContent = project.name;
  projectDateEl.textContent = `נוצר בתאריך: ${formatDate(project.createdAt)}`;

  renderTasks();
}

// הצגת המשימות עם סינון לפי סטטוס
function renderTasks() {
  taskListEl.innerHTML = "";
  const project = projects.find(p => p.id === currentProjectId);
  if (!project) return;

  let filteredTasks = project.tasks;
  const filter = statusFilterSelect.value;

  if (filter === "todo") filteredTasks = filteredTasks.filter(t => t.status === "todo");
  else if (filter === "inprogress") filteredTasks = filteredTasks.filter(t => t.status === "inprogress");
  else if (filter === "done") filteredTasks = filteredTasks.filter(t => t.status === "done");

  filteredTasks.forEach(task => {
    const li = document.createElement("li");
    li.classList.add("task-item");

    const btn = document.createElement("button");
    btn.classList.add("task-btn");

    btn.innerHTML = `
      <span>${task.text}</span><br>
      <small>נוצר: ${formatDate(task.createdAt)}</small><br>
      <select class="status-select" aria-label="סטטוס משימה">
        <option value="todo" ${task.status === "todo" ? "selected" : ""}>לפני ביצוע</option>
        <option value="inprogress" ${task.status === "inprogress" ? "selected" : ""}>בתהליך</option>
        <option value="done" ${task.status === "done" ? "selected" : ""}>בוצע</option>
      </select>
      <button class="edit-task-btn">ערוך</button>
    `;

    // שינוי סטטוס המשימה
    const selectEl = btn.querySelector(".status-select");
    selectEl.addEventListener("change", (e) => {
      task.status = e.target.value;
      save();
      renderTasks();
    });

    // עריכת טקסט המשימה
    const editBtn = btn.querySelector(".edit-task-btn");
    editBtn.addEventListener("click", () => {
      const span = btn.querySelector("span");
      const oldText = span.textContent;
      const input = document.createElement("input");
      input.type = "text";
      input.value = oldText;
      btn.replaceChild(input, span);
      input.focus();

      input.addEventListener("blur", () => {
        task.text = input.value.trim() || oldText;
        save();
        renderTasks();
      });

      input.addEventListener("keydown", (ev) => {
        if (ev.key === "Enter") {
          input.blur();
        }
      });
    });

    li.appendChild(btn);
    taskListEl.appendChild(li);
  });
}

// הוספת פרויקט חדש
function addProject() {
  const name = newProjectInput.value.trim();
  if (!name) {
    alert("אנא הזן שם פרויקט.");
    return;
  }
  if (projects.some(p => p.name === name)) {
    alert("קיים פרויקט עם שם זה.");
    return;
  }

  projects.push({
    id: Date.now(),
    name,
    createdAt: new Date().toISOString(),
    tasks: []
  });

  save();
  renderProjects();
  hideProjectForm();
  newProjectInput.value = "";
}

// מחיקת פרויקט
function deleteProject(id) {
  if (confirm("בטוח שברצונך למחוק את הפרויקט?")) {
    projects = projects.filter(p => p.id !== id);
    if (currentProjectId === id) {
      currentProjectId = null;
      projectAreaEl.style.display = "none";
    }
    save();
    renderProjects();
  }
}

// עריכת שם פרויקט (שימוש ב-prompt)
function editProject(id) {
  const project = projects.find(p => p.id === id);
  if (!project) return;

  const newName = prompt("ערוך שם פרויקט:", project.name);
  if (newName && newName.trim()) {
    if (projects.some(p => p.name === newName.trim() && p.id !== id)) {
      alert("כבר יש פרויקט עם השם הזה.");
      return;
    }
    project.name = newName.trim();
    save();
    renderProjects();

    if (currentProjectId === id) {
      projectTitleEl.textContent = project.name;
    }
  }
}

// הוספת משימה חדשה לפרויקט הנבחר
function addTask() {
  if (!currentProjectId) {
    alert("אנא בחר פרויקט קודם.");
    return;
  }
  const text = newTaskInput.value.trim();
  if (!text) {
    alert("אנא הזן טקסט למשימה.");
    return;
  }
  const project = projects.find(p => p.id === currentProjectId);
  project.tasks.push({
    id: Date.now(),
    text,
    status: "todo",
    createdAt: new Date().toISOString()
  });
  save();
  renderTasks();
  newTaskInput.value = "";
}

// הפעלת/כיבוי תפריט צד
function toggleSidebar() {
  if (sidebar.style.display === "none" || sidebar.style.display === "") {
    sidebar.style.display = "block";
    sidebar.setAttribute("aria-hidden", "false");
  } else {
    sidebar.style.display = "none";
    sidebar.setAttribute("aria-hidden", "true");
  }
}

// הצגת מייל בתפריט צד
function setSidebarEmail(email) {
  sidebarEmail.textContent = `משתמש: ${email}`;
}

// הסתרת טופס פרויקט
function hideProjectForm() {
  projectFormEl.style.display = "none";
  showProjectFormBtn.style.display = "inline-block";
  newProjectInput.value = "";
}

// אירועים
showProjectFormBtn.addEventListener("click", () => {
  projectFormEl.style.display = "block";
  showProjectFormBtn.style.display = "none";
  newProjectInput.focus();
});

saveProjectBtn.addEventListener("click", addProject);
cancelProjectBtn.addEventListener("click", hideProjectForm);
addTaskBtn.addEventListener("click", addTask);
menuButton.addEventListener("click", toggleSidebar);
logoutBtn.addEventListener("click", () => alert("התנתקת בהצלחה!"));
statusFilterSelect.addEventListener("change", renderTasks);

window.onload = () => {
  renderProjects();
  setSidebarEmail("alexmu14@gmail.com");
};
