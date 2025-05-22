// הגדרות Firebase שלך
const firebaseConfig = {
  apiKey: "AIzaSyD3StLOIJr72GJuPWuAUdVf4d_reZojfLc",
  authDomain: "mine-self-projectflow.firebaseapp.com",
  projectId: "mine-self-projectflow",
  storageBucket: "mine-self-projectflow.firebasestorage.app",
  messagingSenderId: "1049774217510",
  appId: "1:1049774217510:web:0188fdc0393e4c4cc589e7"
};

// אתחול Firebase
firebase.initializeApp(firebaseConfig);

// הגדרת ספק ההתחברות של Google
const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({
  hd: "gmail.com"
});

// התחברות בלחיצה
function signInWithGoogle() {
  firebase.auth().signInWithPopup(provider)
    .then((result) => {
      const user = result.user;
      const allowedEmails = [
        "alexmu14@gmail.com",
        "mualex1970@gmail.com"
      ];

      if (allowedEmails.includes(user.email)) {
        document.getElementById("login").style.display = "none";
        document.getElementById("app").style.display = "block";
        document.getElementById("userEmail").innerText = user.email;

        // טען את הפרויקטים אחרי התחברות
        renderProjects();

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
  const allowedEmails = [
    "alexmu14@gmail.com",
    "mualex1970@gmail.com"
  ];

  if (user && allowedEmails.includes(user.email)) {
    document.getElementById("login").style.display = "none";
    document.getElementById("app").style.display = "block";
    document.getElementById("userEmail").innerText = user.email;

    // טען את הפרויקטים אם המשתמש כבר מחובר
    renderProjects();

  } else {
    document.getElementById("login").style.display = "block";
    document.getElementById("app").style.display = "none";
  }
});
