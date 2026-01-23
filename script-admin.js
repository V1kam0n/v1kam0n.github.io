console.log("Script Admin loaded!"); // This proves the file runs

// =========================
// ELEMENTS
// =========================
const loginSection = document.getElementById("loginSection");
const adminContent = document.getElementById("adminContent");

// Buttons (We select them by ID now)
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const resourceSaveBtn = document.getElementById("resourceSaveBtn");
const platformSaveBtn = document.getElementById("platformSaveBtn");

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
if (auth) {
  auth.onAuthStateChanged(user => {
    if (user) {
      console.log("User logged in:", user.email);
      loginSection.classList.add("hidden");
      adminContent.classList.remove("hidden");
      loadResources();
      loadPlatforms();
    } else {
      console.log("User logged out");
      loginSection.classList.remove("hidden");
      adminContent.classList.add("hidden");
    }
  });
}

// Attach Login Event
if (loginBtn) {
  loginBtn.addEventListener("click", () => {
    const email = emailInput.value;
    const pass = passwordInput.value;
    auth.signInWithEmailAndPassword(email, pass)
      .catch(error => alert("Login Failed: " + error.message));
  });
}

// Attach Logout Event
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    auth.signOut();
  });
}

// =========================
// 2. RESOURCE MANAGER
// =========================
function loadResources() {
  db.collection("links").onSnapshot(snapshot => {
    adminList.innerHTML = "";
    snapshot.forEach(doc => {
      const r = doc.data();
      const li = document.createElement("li");
      li.innerHTML = `
          <strong>${r.title}</strong> (${r.subject})
          <button class="secondary delete-btn" style="float:right; padding: 4px 8px; margin:0;">Delete</button>
      `;
      // Attach delete event directly to the button
      li.querySelector(".delete-btn").addEventListener("click", () => deleteDoc('links', doc.id));
      adminList.appendChild(li);
    });
  });
}

// Attach Save Resource Event
if (resourceSaveBtn) {
  resourceSaveBtn.addEventListener("click", () => {
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
  });
}

// =========================
// 3. PLATFORM MANAGER
// =========================
function loadPlatforms() {
  db.collection("platforms").onSnapshot(snapshot => {
    adminPlatformList.innerHTML = "";
    snapshot.forEach(doc => {
      const p = doc.data();
      const li = document.createElement("li");
      li.innerHTML = `
          <strong>${p.name}</strong>
          <button class="secondary delete-btn" style="float:right; padding: 4px 8px; margin:0;">Delete</button>
      `;
      li.querySelector(".delete-btn").addEventListener("click", () => deleteDoc('platforms', doc.id));
      adminPlatformList.appendChild(li);
    });
  });
}

// Attach Save Platform Event
if (platformSaveBtn) {
  platformSaveBtn.addEventListener("click", () => {
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
  });
}

// =========================
// UTILS
// =========================
function deleteDoc(collection, id) {
  if (confirm("Are you sure you want to delete this?")) {
    db.collection(collection).doc(id).delete();
  }
}