// =========================
// ELEMENTS
// =========================
const loginSection = document.getElementById("loginSection");
const adminContent = document.getElementById("adminContent");

// Login Inputs
const emailInput = document.getElementById("adminEmail");
const passwordInput = document.getElementById("adminPassword");

// Resource Inputs
const adminList = document.getElementById("adminList");
const titleInput = document.getElementById("title");
const urlInput = document.getElementById("url");
const subjectInput = document.getElementById("subject");
const topicInput = document.getElementById("topic");
const typeInput = document.getElementById("type");

// Platform Inputs
const adminPlatformList = document.getElementById("adminPlatformList");
const platNameInput = document.getElementById("platName");
const platUrlInput = document.getElementById("platUrl");

// =========================
// 1. AUTHENTICATION
// =========================
auth.onAuthStateChanged(user => {
  if (user) {
    // User is logged in
    loginSection.classList.add("hidden");
    adminContent.classList.remove("hidden");
    loadResources();
    loadPlatforms();
  } else {
    // User is logged out
    loginSection.classList.remove("hidden");
    adminContent.classList.add("hidden");
  }
});

function loginWithEmail() {
  const email = emailInput.value;
  const pass = passwordInput.value;

  auth.signInWithEmailAndPassword(email, pass)
    .catch(error => alert("Login Failed: " + error.message));
}

function logout() {
  auth.signOut();
}

// =========================
// 2. RESOURCE MANAGER
// =========================
function loadResources() {
  db.collection("links").onSnapshot(snapshot => {
    adminList.innerHTML = "";
    snapshot.forEach(doc => {
      const r = doc.data();
      adminList.innerHTML += `
        <li>
          <strong>${r.title}</strong> (${r.subject})
          <button class="secondary" style="float:right; padding: 4px 8px; margin:0;" onclick="deleteDoc('links', '${doc.id}')">Delete</button>
        </li>
      `;
    });
  });
}

function saveLink() {
  if (!titleInput.value || !urlInput.value) {
    alert("Please fill all resource fields");
    return;
  }

  db.collection("links").add({
    title: titleInput.value,
    url: urlInput.value,
    subject: subjectInput.value,
    topic: topicInput.value,
    type: typeInput.value
  }).then(() => {
    titleInput.value = "";
    urlInput.value = "";
    subjectInput.value = "";
    topicInput.value = "";
  }).catch(err => alert("Error: " + err.message));
}

// =========================
// 3. PLATFORM MANAGER
// =========================
function loadPlatforms() {
  db.collection("platforms").onSnapshot(snapshot => {
    adminPlatformList.innerHTML = "";
    snapshot.forEach(doc => {
      const p = doc.data();
      adminPlatformList.innerHTML += `
        <li>
          <strong>${p.name}</strong>
          <button class="secondary" style="float:right; padding: 4px 8px; margin:0;" onclick="deleteDoc('platforms', '${doc.id}')">Delete</button>
        </li>
      `;
    });
  });
}

function savePlatform() {
  if (!platNameInput.value || !platUrlInput.value) {
    alert("Please fill all platform fields");
    return;
  }

  db.collection("platforms").add({
    name: platNameInput.value,
    url: platUrlInput.value
  }).then(() => {
    platNameInput.value = "";
    platUrlInput.value = "";
  }).catch(err => alert("Error: " + err.message));
}

// =========================
// UTILS
// =========================
function deleteDoc(collection, id) {
  if (confirm("Are you sure you want to delete this?")) {
    db.collection(collection).doc(id).delete();
  }
}