// main.js

// משתנים גלובליים
let projects = [];
let selectedProjectId = null;

// אלמנטים
const projectListEl = document.getElementById("projectList");
const projectFormEl = document.getElementById("projectForm");
const showProjectFormBtn = document.getElementById("showProjectFormBtn");
const newProjectInput = document.getElementById("newProjectInput");

const projectAreaEl = document.getElementById("projectArea");
const projectTitleEl = document.getElementById("projectTitle");
const projectDateEl = document.getElementById("projectDate");

const newTaskInput = document.getElementById("newTaskInput");
const taskListEl = document.getElementById("taskList");

// תפריט צד
const sidebar = document.getElementById("sidebar");
const menuButton = document.getElementById("menuButton");

// פתיחה וסגירה של תפריט צד
menuButton.addEventListener("click", () => {
  sidebar.classList.toggle("open");
  sidebar.setAttribute("aria-hidden", !sidebar.classList.contains("open"));
});

// פונקציות טופס פרויקט
showProjectFormBtn.addEventListener("click", () => {
  projectFormEl.style.display = "block";
  showProjectFormBtn.style.display = "none";
  newProjectInput.value = "";
  newProjectInput.focus();
});
function hideProjectForm() {
  projectFormEl.style.display = "none";
  showProjectFormBtn.style.display = "inline-block";
  newProjectInput.value = "";
}

// פונקציה להוספת פרויקט חדש
function addProject() {
  const name = newProjectInput.value.trim();
  if (!name) {
    alert("אנא הזן שם לפרויקט");
    return;
  }
  // בדיקה אם קיים פרויקט עם שם זהה
  if (projects.some(p => p.name === name)) {
    alert("פרויקט עם שם זה כבר קיים");
    return;
  }
  const newProject = {
    id: Date.now(),
    name,
    createdAt: new Date(),
    tasks: []
  };
  projects.push(newProject);
  hideProjectForm();
  renderProjects();
  selectProject(newProject.id);
}

// הצגת רשימת פרויקטים
function renderProjects() {
  projectListEl.innerHTML = "";
  projects.forEach(project => {
    const li = document.createElement("li");

    // כפתור לשם הפרויקט (עם תאריך)
    const btnName = document.createElement("button");
    btnName.textContent = project.name + " (" + project.createdAt.toLocaleDateString() + ")";
    btnName.className = "project-name-btn";
    btnName.style.flexGrow = "1";
    btnName.onclick = () => selectProject(project.id);

    // כפתור עריכה של שם הפרויקט
    const btnEdit = document.createElement("button");
    btnEdit.textContent = "✏️";
    btnEdit.className = "edit-project-name";
    btnEdit.onclick = (e) => {
      e.stopPropagation();
      editProjectName(project.id);
    };

    li.appendChild(btnName);
    li.appendChild(btnEdit);

    projectListEl.appendChild(li);
  });
}

// בחירת פרויקט להצגה ועריכה
function selectProject(id) {
  selectedProjectId = id;
  const project = projects.find(p => p.id === id);
  if (!project) {
    projectAreaEl.style.display = "none";
    return;
  }
  projectTitleEl.textContent = project.name;
  projectDateEl.textContent = "נוצר ב-" + project.createdAt.toLocaleDateString();
  projectAreaEl.style.display = "block";
  newTaskInput.value = "";
  renderTasks(project.tasks);
}

// עריכת שם פרויקט (פופאפ פשוט)
function editProjectName(id) {
  const project = projects.find(p => p.id === id);
  if (!project) return;

  const newName = prompt("ערוך שם פרויקט", project.name);
  if (newName) {
    const trimmed = newName.trim();
    if (!trimmed) {
      alert("שם הפרויקט לא יכול להיות ריק");
      return;
    }
    if (projects.some(p => p.name === trimmed && p.id !== id)) {
      alert("כבר קיים פרויקט עם שם זה");
      return;
    }
    project.name = trimmed;
    renderProjects();

    // אם זה הפרויקט הנבחר, נעדכן גם את הכותרת והפרטים
    if (selectedProjectId === id) {
      projectTitleEl.textContent = project.name;
    }
  }
}

// הוספת משימה לפרויקט הנבחר
function addTask() {
  const text = newTaskInput.value.trim();
  if (!text) {
    alert("אנא הזן שם משימה");
    return;
  }
  const project = projects.find(p => p.id === selectedProjectId);
  if (!project) return;

  project.tasks.push({
    id: Date.now(),
    text,
    status: "לא התחיל"
  });

  newTaskInput.value = "";
  renderTasks(project.tasks);
}

// הצגת רשימת משימות בפרויקט
function renderTasks(tasks) {
  taskListEl.innerHTML = "";

  tasks.forEach(task => {
    const li = document.createElement("li");

    // כפתור לעריכת שם המשימה
    const btnEdit = document.createElement("button");
    btnEdit.textContent = task.text;
    btnEdit.className = "edit-task";
    btnEdit.onclick = () => editTask(task.id);

    // תפריט נפתח לסטטוס המשימה
    const selectStatus = document.createElement("select");
    selectStatus.id = "taskStatusSelect";
    ["לא התחיל", "בתהליך", "בוצע"].forEach(status => {
      const option = document.createElement("option");
      option.value = status;
      option.textContent = status;
      if (task.status === status) option.selected = true;
      selectStatus.appendChild(option);
    });
    selectStatus.onchange = () => {
      task.status = selectStatus.value;
      // אפשר פה לעדכן UI או לשמור אם צריך
    };

    li.appendChild(btnEdit);
    li.appendChild(selectStatus);

    taskListEl.appendChild(li);
  });
}

// עריכת שם משימה
function editTask(taskId) {
  const project = projects.find(p => p.id === selectedProjectId);
  if (!project) return;

  const task = project.tasks.find(t => t.id === taskId);
  if (!task) return;

  const newText = prompt("ערוך שם משימה", task.text);
  if (newText) {
    const trimmed = newText.trim();
    if (!trimmed) {
      alert("שם המשימה לא יכול להיות ריק");
      return;
    }
    task.text = trimmed;
    renderTasks(project.tasks);
  }
}

// פונקציית התנתקות (רק הדגמה, צריך לממש לפי auth.js שלך)
function logout() {
  alert("התנתקת");
  // כאן אפשר להוסיף קריאה לפונקציית התנתקות אמיתית
  // או הפניה לעמוד התחברות
}

// התחלה - טעינת רשימת פרויקטים ריקה
renderProjects();
