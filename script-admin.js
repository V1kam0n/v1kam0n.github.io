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
const saveBtn = document.getElementById("saveBtn");
const cancelBtn = document.getElementById("cancelBtn");

const adminList = document.getElementById("adminList");

let editId = null;

/* =========================
   AUTH
   ========================= */
auth.onAuthStateChanged(user => {
  if (user) {
    loginCard.style.display = "none";
    adminPanel.style.display = "block";
    loadResources();
  } else {
    loginCard.style.display = "block";
    adminPanel.style.display = "none";
  }
});

loginBtn.addEventListener("click", () => {
  auth.signInWithEmailAndPassword(email.value, password.value)
    .catch(err => alert(err.message));
});

logoutBtn.addEventListener("click", () => auth.signOut());

/* =========================
   LOAD LIST
   ========================= */
function loadResources() {
  db.collection("links").onSnapshot(snapshot => {
    adminList.innerHTML = "";
    snapshot.forEach(doc => {
      const r = doc.data();
      const li = document.createElement("li");

      li.innerHTML = `
        <strong>${r.title}</strong><br>
        ${r.subject} – ${r.subtopic} (${r.type})
        <br>
        <button onclick="editResource('${doc.id}')">Edit</button>
        <button onclick="deleteResource('${doc.id}')">Delete</button>
      `;

      adminList.appendChild(li);
    });
  });
}

/* =========================
   SAVE (ADD / EDIT)
   ========================= */
saveBtn.addEventListener("click", () => {
  const data = {
    title: title.value,
    url: url.value,
    subject: subject.value,
    subtopic: subtopic.value,
    type: type.value
  };

  if (editId) {
    db.collection("links").doc(editId).update(data);
  } else {
    db.collection("links").add(data);
  }

  resetForm();
});

/* =========================
   EDIT
   ========================= */
window.editResource = id => {
  db.collection("links").doc(id).get().then(doc => {
    const r = doc.data();

    title.value = r.title;
    url.value = r.url;
    subject.value = r.subject;
    subtopic.value = r.subtopic;
    type.value = r.type;

    editId = id;
    cancelBtn.style.display = "block";
  });
};

cancelBtn.addEventListener("click", resetForm);

function resetForm() {
  title.value = "";
  url.value = "";
  subject.value = "";
  subtopic.value = "";
  type.value = "video";
  editId = null;
  cancelBtn.style.display = "none";
}

/* =========================
   DELETE
   ========================= */
window.deleteResource = id => {
  if (confirm("Delete this resource?")) {
    db.collection("links").doc(id).delete();
  }
};