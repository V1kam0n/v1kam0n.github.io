console.log("Script Admin loaded!");

// =========================
// ELEMENTS
// =========================
// Auth
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

// Resource Inputs
const resourceSaveBtn = document.getElementById("resourceSaveBtn");
const adminList = document.getElementById("adminList");
const titleInput = document.getElementById("title");
const urlInput = document.getElementById("url");
const subjectInput = document.getElementById("subject");
const topicInput = document.getElementById("topic");
const typeInput = document.getElementById("type");

// Platform Inputs
const platformSaveBtn = document.getElementById("platformSaveBtn");
const adminPlatformList = document.getElementById("adminPlatformList");
const platNameInput = document.getElementById("platName");
const platUrlInput = document.getElementById("platUrl");
const platImgInput = document.getElementById("platImg");

// =========================
// 1. TOGGLE LOGIC
// =========================
function toggleSection(header, body) {
  header.addEventListener("click", () => {
    // Toggle hidden class on the body
    body.classList.toggle("hidden");
    // Toggle visual arrow style on header
    header.classList.toggle("collapsed");
  });
}

// Activate toggles
if(resourceHeader && resourceBody) toggleSection(resourceHeader, resourceBody);
if(platformHeader && platformBody) toggleSection(platformHeader, platformBody);


// =========================
// 2. AUTHENTICATION
// =========================
if (auth) {
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
// 3. RESOURCES MANAGER
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
      // Attach delete event
      li.querySelector(".delete-btn").addEventListener("click", () => deleteDoc('links', doc.id));
      adminList.appendChild(li);
    });
  });
}

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
       titleInput.value = ""; urlInput.value = ""; 
       subjectInput.value = ""; topicInput.value = "";
    }).catch(err => alert("Error: " + err.message));
  });
}

// =========================
// 4. PLATFORMS MANAGER (With Image)
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

if (platformSaveBtn) {
  platformSaveBtn.addEventListener("click", () => {
    if (!platNameInput.value || !platUrlInput.value) {
      alert("Please fill Name and URL");
      return;
    }
    
    // Save with Image URL (or default if empty)
    db.collection("platforms").add({
      name: platNameInput.value,
      url: platUrlInput.value,
      image: platImgInput.value || "https://placehold.co/600x400?text=No+Image"
    }).then(() => {
      platNameInput.value = "";
      platUrlInput.value = "";
      platImgInput.value = "";
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