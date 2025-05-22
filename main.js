// --- משתנים גלובליים ---
let projects = JSON.parse(localStorage.getItem("projects") || "[]");
let currentProjectId = null;

// --- אלמנטים מה- DOM ---
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
const taskFilterDiv = document.getElementById("taskFilter");

// --- פונקציות ---

// שמירת הנתונים ב-localStorage
function save() {
  localStorage.setItem("projects", JSON.stringify(projects));
}

// עיצוב תאריך בעברית
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

// הצגת רשימת פרויקטים
function renderProjects() {
  projectListEl.innerHTML = "";
  projects.forEach((proj) => {
    const li = document.createElement("li");
    li.classList.add("project-item");

    // כפתור שמציג שם וניתן לעריכה
    const btn = document.createElement("button");
    btn.classList.add("project-btn");
    btn.innerHTML = `<strong>${proj.name}</strong><br><small>נוצר: ${formatDate(proj.createdAt)}</small>`;
    btn.onclick = () => selectProject(proj.id);

    li.appendChild(btn);
    projectListEl.appendChild(li);
  });
}

// בחר פרויקט לפי id
function selectProject(id) {
  currentProjectId = id;
  const project = projects.find(p => p.id === id);
  if (!project) return;

  projectAreaEl.style.display = "block";
  taskFilterDiv.style.display = "block";

  projectTitleEl.textContent = project.name;
  projectDateEl.textContent = `נוצר בתאריך: ${formatDate(project.createdAt)}`;

  renderTasks();
}

// הצגת רשימת המשימות לפי פילטר
function renderTasks() {
  taskListEl.innerHTML = "";
  const project = projects.find(p => p.id === currentProjectId);
  if (!project) return;

  let filteredTasks = project.tasks;
  const filter = statusFilterSelect.value;

  if (filter === "todo") {
    filteredTasks = filteredTasks.filter(t => !t.done);
  } else if (filter === "done") {
    filteredTasks = filteredTasks.filter(t => t.done);
  }

  filteredTasks.forEach((task) => {
    const li = document.createElement("li");
    li.classList.add("task-item");

    const btn = document.createElement("button");
    btn.classList.add("task-btn");
    btn.innerHTML = `
      <span>${task.text}</span><br>
      <small>נוצר: ${formatDate(task.createdAt)}</small><br>
      <select class="status-select">
        <option value="todo" ${!task.done ? "selected" : ""}>לפני ביצוע</option>
        <option value="done" ${task.done ? "selected" : ""}>בוצע</option>
      </select>
      <button class="edit-task-btn">ערוך</button>
    `;

    // שינוי סטטוס מה-select
    const selectEl = btn.querySelector(".status-select");
    selectEl.addEventListener("change", (e) => {
      task.done = e.target.value === "done";
      save();
      renderTasks();
    });

    // עריכת טקסט המשימה בלחיצה על הכפתור ערוך
    const editBtn = btn.querySelector(".edit-task-btn");
    editBtn.addEventListener("click", () => {
      const span = btn.querySelector("span");
      const oldText = span.textContent;
      const input = document.createElement("input");
      input.type = "text";
      input.value = oldText;
      btn.replaceChild(input, span);
      editBtn.textContent = "שמור";

      editBtn.onclick = () => {
        const newText = input.value.trim();
        if (newText) {
          task.text = newText;
          save();
          renderTasks();
        } else {
          alert("השם לא יכול להיות ריק");
        }
      };
    });

    li.appendChild(btn);
    taskListEl.appendChild(li);
  });
}

// הוספת פרויקט חדש
function addProject() {
  const name = newProjectInput.value.trim();
  if (!name) {
    alert("אנא הזן שם לפרויקט");
    return;
  }
  if (projects.some(p => p.name === name)) {
    alert("פרויקט עם שם זה כבר קיים");
    return;
  }
  const newProject = {
    id: Date.now(),
    name,
    createdAt: new Date().toISOString(),
    tasks: []
  };
  projects.push(newProject);
  save();
  renderProjects();
  selectProject(newProject.id);
  hideProjectForm();
}

// הסתרת טופס הוספת פרויקט
function hideProjectForm() {
  projectFormEl.style.display = "none";
  showProjectFormBtn.style.display = "inline-block";
  newProjectInput.value = "";
}

// הוספת משימה חדשה לפרויקט נבחר
function addTask() {
  const text = newTaskInput.value.trim();
  if (!text) return;

  const project = projects.find(p => p.id === currentProjectId);
  if (!project) return;

  project.tasks.push({
    id: Date.now(),
    text,
    done: false,
    createdAt: new Date().toISOString()
  });
  save();
  newTaskInput.value = "";
  renderTasks();
}

// התנתקות - כאן תוכל להוסיף קריאה ל-firebase.auth().signOut() או כל פעולה אחרת
function logout() {
  alert("התנתקת בהצלחה!");
  // כאן אפשר להוסיף מעבר לדף התחברות
}

// הפעלת/כיבוי תפריט צד
function toggleSidebar() {
  if (sidebar.style.display === "none") {
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

// --- אירועים ---

// כפתור הוספת פרויקט - מציג את הטופס
showProjectFormBtn.addEventListener("click", () => {
  projectFormEl.style.display = "block";
  showProjectFormBtn.style.display = "none";
  newProjectInput.focus();
});

// כפתור שמירת פרויקט חדש
saveProjectBtn.addEventListener("click", addProject);

// ביטול הוספת פרויקט
cancelProjectBtn.addEventListener("click", hideProjectForm);

// כפתור להוספת משימה
addTaskBtn.addEventListener("click", addTask);

// כפתור תפריט צד
menuButton.addEventListener("click", toggleSidebar);

// כפתור התנתקות
logoutBtn.addEventListener("click", logout);

// סינון משימות
statusFilterSelect.addEventListener("change", renderTasks);

// בעת טעינת הדף - הצגת פרויקטים ומייל בדמו
window.onload = () => {
  renderProjects();
  setSidebarEmail("alexmu14@gmail.com");
};
