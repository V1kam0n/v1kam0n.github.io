// Firebase services
const auth = firebase.auth();
const db = firebase.firestore();

// DOM elements
const loginCard = document.getElementById("loginCard");
const adminPanel = document.getElementById("adminPanel");

const email = document.getElementById("email");
const password = document.getElementById("password");

const title = document.getElementById("title");
const url = document.getElementById("url");
const subject = document.getElementById("subject");
const subtopic = document.getElementById("subtopic");

// AUTH STATE LISTENER
auth.onAuthStateChanged(user => {
  if (user) {
    loginCard.style.display = "none";
    adminPanel.style.display = "block";
  } else {
    loginCard.style.display = "block";
    adminPanel.style.display = "none";
  }
});

// LOGIN
function login() {
  auth
    .signInWithEmailAndPassword(email.value, password.value)
    .catch(err => alert(err.message));
}

// LOGOUT
function logout() {
  auth.signOut();
}

// ADD LINK TO FIRESTORE
function addLink() {
  if (!title.value || !url.value) {
    alert("Title and URL are required");
    return;
  }

  db.collection("links").add({
    title: title.value,
    url: url.value,
    subject: subject.value,
    subtopic: subtopic.value,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  });

  title.value = "";
  url.value = "";
  subject.value = "";
  subtopic.value = "";
}
