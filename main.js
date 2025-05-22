document.addEventListener("DOMContentLoaded", () => {
  const menuButton = document.getElementById("menuButton");
  const addProjectBtn = document.getElementById("addProjectBtn");
  const sideMenu = document.getElementById("sideMenu");
  const addProjectForm = document.getElementById("addProjectForm");
  const saveProjectBtn = document.getElementById("saveProjectBtn");
  const cancelProjectBtn = document.getElementById("cancelProjectBtn");
  const newProjectInput = document.getElementById("newProjectInput");
  const signOutBtn = document.getElementById("signOutBtn");

  let sideMenuOpen = false;

  menuButton.addEventListener("click", () => {
    sideMenuOpen = !sideMenuOpen;
    if (sideMenuOpen) {
      sideMenu.classList.remove("side-menu-closed");
    } else {
      sideMenu.classList.add("side-menu-closed");
    }
  });

  addProjectBtn.addEventListener("click", () => {
    addProjectForm.classList.remove("hidden");
    addProjectBtn.style.display = "none";
    newProjectInput.focus();
  });

  cancelProjectBtn.addEventListener("click", () => {
    addProjectForm.classList.add("hidden");
    addProjectBtn.style.display = "inline-block";
    newProjectInput.value = "";
  });

  saveProjectBtn.addEventListener("click", () => {
    const projectName = newProjectInput.value.trim();
    if (!projectName) {
      alert("אנא הכנס שם פרויקט");
      return;
    }
    // כאן בעתיד אפשר להוסיף לוגיקת שמירת הפרויקט
    alert(`פרויקט '${projectName}' נשמר (פונקציונליות להוספה עתידית)`);
    addProjectForm.classList.add("hidden");
    addProjectBtn.style.display = "inline-block";
    newProjectInput.value = "";
  });

  signOutBtn.addEventListener("click", () => {
    // כאן תשים את הקוד להתנתקות firebase או אחר
    alert("התנתקות (פונקציונליות עתידית)");
  });
});
