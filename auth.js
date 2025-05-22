const firebaseConfig = {
  apiKey: "AIzaSyD7X1VpObdCG1XzU",
  authDomain: "projectflow-12345.firebaseapp.com",
  projectId: "projectflow-12345",
  appId: "1:1049774217510:web:example",
};

// אתחול Firebase
firebase.initializeApp(firebaseConfig);

const allowedEmail = "alexmu14@gmail.com";

document.getElementById("login-button").addEventListener("click", () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider)
    .then((result) => {
      const user = result.user;
      if (user.email === allowedEmail) {
        document.getElementById("login-section").style.display = "none";
        document.getElementById("main-app").style.display = "block";
      } else {
        alert("רק אלכס יכול להיכנס. אתה לא מורשה.");
        firebase.auth().signOut();
      }
    })
    .catch((error) => {
      console.error("Login error:", error);
      alert("שגיאה בהתחברות");
    });
});

function logout() {
  firebase.auth().signOut().then(() => {
    location.reload();
  });
}
