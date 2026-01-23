const loginCard = document.getElementById("loginCard");
const adminPanel = document.getElementById("adminPanel");

const email = document.getElementById("email");
const password = document.getElementById("password");

const title = document.getElementById("title");
const url = document.getElementById("url");
const subject = document.getElementById("subject");
const subtopic = document.getElementById("subtopic");
const type = document.getElementById("type");

const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const addBtn = document.getElementById("addBtn");

/* =========================
   AUTH STATE
   ========================= */
auth.onAuthStateChanged(user => {
  if (user) {
    loginCard.style.display = "none";
    adminPanel.style.display = "block";
  } else {
    loginCard.style.display = "block";
    adminPanel.style.display = "none";
  }
});

/* =========================
   LOGIN / LOGOUT
   ========================= */
loginBtn.addEventListener("click", () => {
  auth.signInWithEmailAndPassword(email.value, password.value)
    .catch(err => alert(err.message));
});

logoutBtn.addEventListener("click", () => {
  auth.signOut();
});

/* =========================
   ADD RESOURCE
   ========================= */
addBtn.addEventListener("click", () => {
  if (!title.value || !url.value) {
    alert("Title and URL required");
    return;
  }

  db.collection("links").add({
    title: title.value,
    url: url.value,
    subject: subject.value,
    subtopic: subtopic.value,
    type: type.value,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  });

  title.value = "";
  url.value = "";
  subject.value = "";
  subtopic.value = "";
});