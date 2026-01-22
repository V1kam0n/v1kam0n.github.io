const loginCard = document.getElementById("loginCard");
const adminPanel = document.getElementById("adminPanel");

document.getElementById("loginBtn").addEventListener("click", () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  firebase.auth().signInWithEmailAndPassword(email, password)
    .catch(err => alert(err.message));
});

document.getElementById("logoutBtn").addEventListener("click", () => {
  firebase.auth().signOut();
});

document.getElementById("addBtn").addEventListener("click", () => {
  db.collection("links").add({
    title: title.value,
    url: url.value,
    subject: subject.value,
    subtopic: subtopic.value
  });
});

firebase.auth().onAuthStateChanged(user => {
  if (user) {
    loginCard.style.display = "none";
    adminPanel.style.display = "block";
  } else {
    loginCard.style.display = "block";
    adminPanel.style.display = "none";
  }
});
