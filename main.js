let projects = JSON.parse(localStorage.getItem("projects") || "[]");
let currentProjectIndex = null;

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("addProjectBtn").addEventListener("click", () => {
    document.getElementById("projectInputArea").classList.remove("hidden");
    document.getElementById("addProjectBtn").style.display = "none";
  });

  document.getElementById("sideMenuToggle").addEventListener("click", () => {
    document.getElementById("sideMenu").classList.toggle("hidden");
  });
});

function renderProjects() {
  const ul = document.getElementById("projectList");
  ul.innerHTML = "";
  projects.forEach((proj, index) => {
    const li = document.createElement("li");
    const info = document.createElement("span");
    info.textContent = `${proj.name} (נוצר ב־${proj.created})`;
    info.onclick = () => openProject(index);

    const editBtn = document.createElement("button");
    editBtn.textContent = "✏️";
    editBtn.onclick = (e) => {
      e.stopPropagation();
      const newName = prompt("שנה את שם הפרויקט:", proj.name);
      if (newName && !projects.some(p => p.name === newName)) {
        proj.name = newName;
        save();
        renderProjects();
      } else if (projects.some(p => p.name === newName)) {
        alert("כבר קיים פרויקט בשם הזה.");
      }
    };

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "🗑️";
    deleteBtn.onclick = (e) => {
      e.stopPropagation();
      if (confirm("האם אתה בטוח שברצונך למחוק את הפרויקט?")) {
        projects.splice(index, 1);
        save();
        renderProjects();
        document.getElementById("projectArea").style.display = "none";
      }
    };

    li.appendChild(info);
    li.appendChild(editBtn);
    li.appendChild(deleteBtn);
    ul.appendChild(li);
  });
}

function saveNewProject() {
  const input = document.getElementById("newProjectInput");
  const name = input.value.trim();
  if (!name) return;
  if (projects.some(p => p.name === name)) {
    alert("כבר קיים פרויקט בשם הזה.");
    return;
  }
  projects.push({
    name,
    tasks: [],
    created: new Date().toLocaleDateString()
  });
  input.value = "";
  save();
  renderProjects();
  cancelNewProject();
}

function cancelNewProject() {
  document.getElementById("projectInputArea").classList.add("hidden");
  document.getElementById("addProjectBtn").style.display = "inline-block";
}

function openProject(index) {
  currentProjectIndex = index;
  const project = projects[index];
  document.getElementById("projectArea").style.display = "block";
  document.getElementById("projectTitle").textContent = `פרויקט: ${project.name}`;
  renderTasks();
}

function renderTasks() {
  const filter = document.getElementById("taskFilter").value;
  const ul = document.getElementById("taskList");
  ul.innerHTML = "";

  const tasks = projects[currentProjectIndex].tasks.filter(task => {
    return filter === "all" || task.status === filter;
  });

  tasks.forEach((task, idx) => {
    const li = document.createElement("li");
    const input = document.createElement("input");
    input.type = "text";
    input.value = task.text;
    input.onchange = () => {
      task.text = input.value;
      save();
    };

    const select = document.createElement("select");
    ["todo", "inprogress", "done"].forEach(status => {
      const option = document.createElement("option");
      option.value = status;
      option.textContent = {
        todo: "לעשות",
        inprogress: "בתהליך",
        done: "בוצע"
      }[status];
      if (task.status === status) option.selected = true;
      select.appendChild(option);
    });

    select.onchange = () => {
      task.status = select.value;
      save();
    };

    li.appendChild(input);
    li.appendChild(select);
    ul.appendChild(li);
  });
}

function addTask() {
  const input = document.getElementById("newTaskInput");
  if (!input.value.trim()) return;
  projects[currentProjectIndex].tasks.push({
    text: input.value.trim(),
    status: "todo",
    created: new Date().toLocaleDateString()
  });
  input.value = "";
  save();
  renderTasks();
}

function save() {
  localStorage.setItem("projects", JSON.stringify(projects));
}
