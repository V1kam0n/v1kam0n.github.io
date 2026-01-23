// =========================
// ELEMENTS
// =========================
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

let unsubscribe = null;

// =========================
// AUTH STATE
// =========================
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
    if (unsubscribe) unsubscribe();
  }
});

// =========================
// LOGIN / LOGOUT
// =========================
window.login = function () {
  auth
    .signInWithEmailAndPassword(email.value, password.value)
    .catch(err => alert(err.message));
};

window.logout = function () {
  auth.signOut();
};

// =========================
// BACK TO HOME
// =========================
window.goHome = function () {
  window.location.replace("index.html");
};

// =========================
// LOAD RESOURCES
// =========================
function loadResources() {
  if (unsubscribe) unsubscribe();

  unsubscribe = db.collection("links").onSnapshot(snapshot => {
    adminList.innerHTML = "";

    snapshot.forEach(doc => {
      const r = doc.data();
      const li = document.createElement("li");

      li.innerHTML = `
        <strong>${r.title}</strong><br>
        ${r.subject} → ${r.topic} (${r.type})<br>
        <button onclick="editLink('${doc.id}')">Edit</button>
        <button onclick="deleteLink('${doc.id}')">Delete</button>
      `;

      adminList.appendChild(li);
    });
  });
}

// =========================
// SAVE / EDIT
// =========================
window.saveLink = function () {
  const data = {
    title: titleInput.value.trim(),
    url: urlInput.value.trim(),
    subject: subjectInput.value.trim(),
    topic: topicInput.value.trim(),
    type: typeInput.value
  };

  if (!data.title || !data.url || !data.subject || !data.topic) {
    alert("Please fill in all fields.");
    return;
  }

  if (!data.url.startsWith("http")) {
    alert("URL must start with http or https");
    return;
  }

  const id = editIdInput.value;

  if (id) {
    db.collection("links").doc(id).update(data);
  } else {
    db.collection("links").add(data);
  }

  clearForm();
};

// =========================
// EDIT
// =========================
window.editLink = function (id) {
  db.collection("links").doc(id).get().then(doc => {
    const r = doc.data();
    titleInput.value = r.title;
    urlInput.value = r.url;
    subjectInput.value = r.subject;
    topicInput.value = r.topic;
    typeInput.value = r.type;
    editIdInput.value = id;

    adminPanel.scrollIntoView({ behavior: "smooth" });
  });
};

// =========================
// DELETE
// =========================
window.deleteLink = function (id) {
  if (confirm("Delete this resource?")) {
    db.collection("links").doc(id).delete();
  }
};

// =========================
// CLEAR FORM
// =========================
window.clearForm = function () {
  titleInput.value = "";
  urlInput.value = "";
  subjectInput.value = "";
  topicInput.value = "";
  typeInput.value = "video";
  editIdInput.value = "";
};
const platformName = document.getElementById("platformName");
const platformUrl = document.getElementById("platformUrl");
const platformLogo = document.getElementById("platformLogo");
const platformEditId = document.getElementById("platformEditId");
const platformAdminList = document.getElementById("platformAdminList");

db.collection("platforms").onSnapshot(snapshot => {
  platformAdminList.innerHTML = "";

  snapshot.forEach(doc => {
    const p = doc.data();
    const li = document.createElement("li");

    li.innerHTML = `
      <strong>${p.name}</strong><br>
      <button onclick="editPlatform('${doc.id}')">Edit</button>
      <button onclick="deletePlatform('${doc.id}')">Delete</button>
    `;

    platformAdminList.appendChild(li);
  });
});

window.savePlatform = function () {
  const data = {
    name: platformName.value.trim(),
    url: platformUrl.value.trim(),
    logo: platformLogo.value.trim()
  };

  if (!data.name || !data.url || !data.logo) {
    alert("Fill all fields");
    return;
  }

  const id = platformEditId.value;

  if (id) {
    db.collection("platforms").doc(id).update(data);
  } else {
    db.collection("platforms").add(data);
  }

  clearPlatform();
};

window.editPlatform = function (id) {
  db.collection("platforms").doc(id).get().then(doc => {
    const p = doc.data();
    platformName.value = p.name;
    platformUrl.value = p.url;
    platformLogo.value = p.logo;
    platformEditId.value = id;
  });
};

window.deletePlatform = function (id) {
  if (confirm("Delete platform?")) {
    db.collection("platforms").doc(id).delete();
  }
};

window.clearPlatform = function () {
  platformName.value = "";
  platformUrl.value = "";
  platformLogo.value = "";
  platformEditId.value = "";
};
