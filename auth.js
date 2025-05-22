// הגדרות Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCxRh-EUe3IImNzeVmOTuUvGsZ3fRNa7F0",
  authDomain: "projectflow-xxxxx.firebaseapp.com", // תוכל לעדכן את הכתובת אם שונה אצלך
  projectId: "projectflow-xxxxx",
  appId: "1:1049774217510:web:some-app-id"
};

// אתחול Firebase
firebase.initializeApp(firebaseConfig);

// הגדרת ספק ההתחברות של Google
const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({
  hd: "gmail.com" // מוודא שרק משתמשי Gmail יוכלו להתחבר (לא חובה)
});

// התחברות בלחיצה
function signInWithGoogle() {
  firebase.auth().signInWithPopup(provider)
    .then((result) => {
      const user = result.user;
      if (user.email === "alexmu14@gmail.com") {
        document.getElementById("login").style.display = "none";
        document.getElementById("app").style.display = "block";
        document.getElementById("userEmail").innerText = user.email;
      } else {
        alert("אין לך הרשאה לגשת למערכת הזו.");
        firebase.auth().signOut();
      }
    })
    .catch((error) => {
      console.error("שגיאה בהתחברות:", error);
      alert("שגיאה בהתחברות");
    });
}

// התחברות אוטומטית אם כבר מחובר
firebase.auth().onAuthStateChanged((user) => {
  if (user && user.email === "alexmu14@gmail.com") {
    document.getElementById("login").style.display = "none";
    document.getElementById("app").style.display = "block";
    document.getElementById("userEmail").innerText = user.email;
  } else {
    document.getElementById("login").style.display = "block";
    document.getElementById("app").style.display = "none";
  }
});
