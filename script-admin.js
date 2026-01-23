const loginCard = document.getElementById("loginCard");
const adminPanel = document.getElementById("adminPanel");
const resourceList = document.getElementById("resourceList");
const adminList = document.getElementById("adminList");

const email = document.getElementById("email");
const password = document.getElementById("password");

const titleInput = document.getElementById("title");
const urlInput = document.getElementById("url");
const subjectInput = document.getElementById("subject");
const subtopicInput = document.getElementById("subtopic");
const typeInput = document.getElementById("type");
const editIdInput = document.getElementById("editId");

/* =========================
   AUTH STATE
========================= */
auth.onAuthStateChanged(user => {
  if (user) {
    loginCard.style.display = "none";
    adminPanel.style.display = "block";
    resourceList.style.display = "block";
    loadResources();
  } else {
    loginCard.style.display = "block";
    adminPanel.style.display = "none";
    resourceList.style.display = "none";
  }
});

/* =========================
   LOGIN / LOGOUT
========================= */
window.login = function () {
  auth.signInWithEmailAndPassword(email.value, password.value)
    .catch(err => alert(err.message));
};

window.logout = function () {
  auth.signOut();
};

/* =========================
   LOAD RESOURCES
========================= */
function loadResources() {
  db.collection("links").onSnapshot(snapshot => {
    adminList.innerHTML = "";

    snapshot.forEach(doc => {
      const r = doc.data();
      const li = document.createElement("li");

      li.innerHTML = `
        <strong>${r.title}</strong><br>
        ${r.subject} – ${r.subtopic} (${r.type})<br>
        <a href="${r.url}" target="_blank">Open</a><br>
        <button onclick="editLink('${doc.id}')">Edit</button>
        <button onclick="deleteLink('${doc.id}')">Delete</button>
      `;

      adminList.appendChild(li);
    });
  });
}

/* =========================
   SAVE / EDIT
========================= */
window.saveLink = function () {
  const data = {
    title: titleInput.value,
    url: urlInput.value,
    subject: subjectInput.value,
    subtopic: subtopicInput.value,
    type: typeInput.value
  };

  const id = editIdInput.value;

  if (id) {
    db.collection("links").doc(id).update(data);
  } else {
    db.collection("links").add(data);
  }

  clearForm();
};

window.editLink = function (id) {
  db.collection("links").doc(id).get().then(doc => {
    const r = doc.data();
    titleInput.value = r.title;
    urlInput.value = r.url;
    subjectInput.value = r.subject;
    subtopicInput.value = r.subtopic;
    typeInput.value = r.type || "video";
    editIdInput.value = id;
  });
};

/* =========================
   DELETE
========================= */
window.deleteLink = function (id) {
  if (confirm("Delete this resource?")) {
    db.collection("links").doc(id).delete();
  }
};

/* =========================
   CLEAR
========================= */
window.clearForm = function () {
  titleInput.value = "";
  urlInput.value = "";
  subjectInput.value = "";
  subtopicInput.value = "";
  typeInput.value = "video";
  editIdInput.value = "";
};
