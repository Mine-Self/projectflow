document.addEventListener("DOMContentLoaded", () => {
  const menuButton = document.getElementById("menuButton");
  const addProjectBtn = document.getElementById("addProjectBtn");

  // מצב תפריט הצד - כרגע פשוט לוגיקה להדפסה, אפשר להחליף בעתיד בפתיחה אמיתית
  let sideMenuOpen = false;

  menuButton.addEventListener("click", () => {
    sideMenuOpen = !sideMenuOpen;
    if (sideMenuOpen) {
      console.log("תפריט צד נפתח");
      // כאן בעתיד תוכל להוסיף את הקוד לפתיחת תפריט הצד
      alert("תפריט צד נפתח (פונקציונליות עתידית)");
    } else {
      console.log("תפריט צד נסגר");
      alert("תפריט צד נסגר (פונקציונליות עתידית)");
    }
  });

  addProjectBtn.addEventListener("click", () => {
    console.log("לחצת על הוסף פרוייקט");
    alert("כאן תוכל להוסיף פרוייקט בעתיד (פונקציונליות עתידית)");
  });
});
