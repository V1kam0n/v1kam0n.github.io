const loginCard = document.getElementById("loginCard");
const adminPanel = document.getElementById("adminPanel");
const resourceList = document.getElementById("resourceList");
const adminList = document.getElementById("adminList");

const email = document.getElementById("email");
const password = document.getElementById("password");

const titleInput = document.getElementById("title");
const urlInput = document.getElementById("url");
const subjectInput = document.getElementById("subject");
const topicInput = document.getElementById("topic");
const typeInput = document.getElementById("type");
const editIdInput = document.getElementById("editId");

/* AUTH */
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

window.login = () =>
  auth.signInWithEmailAndPassword(email.value, password.value)
    .catch(err => alert(err.message));

window.logout = () => auth.signOut();
window.goHome = () => window.location.replace("index.html");

/* LOAD RESOURCES */
function loadResources() {
  db.collection("links").onSnapshot(snapshot => {
    adminList.innerHTML = "";
    snapshot.forEach(doc => {
      const r = doc.data();
      adminList.innerHTML += `
        <li>
          <strong>${r.title}</strong><br>
          ${r.subject} → ${r.topic} (${r.type})<br>
          <button onclick="editLink('${doc.id}')">Edit</button>
          <button onclick="deleteLink('${doc.id}')">Delete</button>
        </li>
      `;
    });
  });
}

/* SAVE */
window.saveLink = function () {
  const data = {
    title: titleInput.value.trim(),
    url: urlInput.value.trim(),
    subject: subjectInput.value.trim(),
    topic: topicInput.value.trim(),
    type: typeInput.value
  };

  if (!data.title || !data.url || !data.subject || !data.topic) {
    alert("Fill all fields");
    return;
  }

  const id = editIdInput.value;
  id ? db.collection("links").doc(id).update(data)
     : db.collection("links").add(data);

  clearForm();
};

window.editLink = id =>
  db.collection("links").doc(id).get().then(doc => {
    const r = doc.data();
    titleInput.value = r.title;
    urlInput.value = r.url;
    subjectInput.value = r.subject;
    topicInput.value = r.topic;
    typeInput.value = r.type;
    editIdInput.value = id;
  });

window.deleteLink = id =>
  confirm("Delete?") && db.collection("links").doc(id).delete();

window.clearForm = () => {
  titleInput.value = "";
  urlInput.value = "";
  subjectInput.value = "";
  topicInput.value = "";
  typeInput.value = "video";
  editIdInput.value = "";
};

/* PLATFORM ADMIN — SAFE */
const platformAdminList = document.getElementById("platformAdminList");
if (platformAdminList) {
  db.collection("platforms").onSnapshot(snapshot => {
    platformAdminList.innerHTML = "";
    snapshot.forEach(doc => {
      const p = doc.data();
      platformAdminList.innerHTML += `
        <li>
          <strong>${p.name}</strong>
          <button onclick="editPlatform('${doc.id}')">Edit</button>
          <button onclick="deletePlatform('${doc.id}')">Delete</button>
        </li>
      `;
    });
  });
}
