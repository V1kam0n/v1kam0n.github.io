const loginCard = document.getElementById("loginCard");
const adminPanel = document.getElementById("adminPanel");

const email = document.getElementById("email");
const password = document.getElementById("password");

const title = document.getElementById("title");
const url = document.getElementById("url");
const subject = document.getElementById("subject");
const subtopic = document.getElementById("subtopic");

document.getElementById("loginBtn").addEventListener("click", login);
document.getElementById("addBtn").addEventListener("click", addLink);
document.getElementById("logoutBtn").addEventListener("click", logout);

firebase.auth().onAuthStateChanged(user => {
  if (user) {
    loginCard.style.display = "none";
    adminPanel.style.display = "block";
  } else {
    loginCard.style.display = "block";
    adminPanel.style.display = "none";
  }
});

function login() {
  firebase.auth()
    .signInWithEmailAndPassword(email.value, password.value)
    .catch(err => alert(err.message));
}

function logout() {
  firebase.auth().signOut();
}

function addLink() {
  db.collection("links").add({
    title: title.value,
    url: url.value,
    subject: subject.value,
    subtopic: subtopic.value
  });

  title.value = "";
  url.value = "";
  subject.value = "";
  subtopic.value = "";
}
