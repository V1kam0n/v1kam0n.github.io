console.log("Script Admin loaded!");

// =========================
// ELEMENTS
// =========================
const loginSection = document.getElementById("loginSection");
const adminContent = document.getElementById("adminContent");
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const emailInput = document.getElementById("adminEmail");
const passwordInput = document.getElementById("adminPassword");

// Toggles
const resourceHeader = document.getElementById("resourceHeader");
const resourceBody = document.getElementById("resourceBody");
const platformHeader = document.getElementById("platformHeader");
const platformBody = document.getElementById("platformBody");

// Inputs
const resourceSaveBtn = document.getElementById("resourceSaveBtn");
const adminList = document.getElementById("adminList");
const titleInput = document.getElementById("title");
const urlInput = document.getElementById("url");
const subjectInput = document.getElementById("subject");
const topicInput = document.getElementById("topic");
const typeInput = document.getElementById("type");

const platformSaveBtn = document.getElementById("platformSaveBtn");
const adminPlatformList = document.getElementById("adminPlatformList");
const platNameInput = document.getElementById("platName");
const platUrlInput = document.getElementById("platUrl");
const platImgInput = document.getElementById("platImg");

// =========================
// 1. AUTH LOGIC (The Fix)
// =========================
if (auth) {
  auth.onAuthStateChanged(user => {
    if (user) {
      console.log("Logged in:", user.email);
      // HIDE Login, SHOW Admin
      loginSection.classList.add("d-none");
      adminContent.classList.remove("d-none");
      
      loadResources();
      loadPlatforms();
    } else {
      console.log("Logged out");
      // SHOW Login, HIDE Admin
      loginSection.classList.remove("d-none");
      adminContent.classList.add("d-none");
    }
  });
}

if (loginBtn) {
  loginBtn.addEventListener("click", () => {
    auth.signInWithEmailAndPassword(emailInput.value, passwordInput.value)
      .catch(e => alert("Login Failed: " + e.message));
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener("click", () => auth.signOut());
}

// =========================
// 2. TOGGLES
// =========================
function toggleSection(header, body) {
  header.addEventListener("click", () => {
    body.classList.toggle("hidden"); // Toggles visibility
    header.classList.toggle("collapsed"); // Rotates arrow
  });
}

if(resourceHeader && resourceBody) toggleSection(resourceHeader, resourceBody);
if(platformHeader && platformBody) toggleSection(platformHeader, platformBody);


// =========================
// 3. DATA FUNCTIONS
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
      li.querySelector(".delete-btn").addEventListener("click", () => deleteDoc('links', doc.id));
      adminList.appendChild(li);
    });
  });
}

if (resourceSaveBtn) {
  resourceSaveBtn.addEventListener("click", () => {
    if (!titleInput.value || !urlInput.value) return alert("Fill all fields");
    db.collection("links").add({
      title: titleInput.value,
      url: urlInput.value,
      subject: subjectInput.value,
      topic: topicInput.value,
      type: typeInput.value
    }).then(() => {
       titleInput.value = ""; urlInput.value = ""; 
       subjectInput.value = ""; topicInput.value = "";
    });
  });
}

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

if (platformSaveBtn) {
  platformSaveBtn.addEventListener("click", () => {
    if (!platNameInput.value || !platUrlInput.value) return alert("Fill Name and URL");
    db.collection("platforms").add({
      name: platNameInput.value,
      url: platUrlInput.value,
      image: platImgInput.value || "https://placehold.co/600x400?text=No+Image"
    }).then(() => {
      platNameInput.value = ""; platUrlInput.value = ""; platImgInput.value = "";
    });
  });
}

function deleteDoc(collection, id) {
  if (confirm("Delete this?")) {
    db.collection(collection).doc(id).delete();
  }
}