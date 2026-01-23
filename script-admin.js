console.log("Script Admin loaded! v2.0 (With Edit Buttons)");

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

// Resource Inputs
const resourceSaveBtn = document.getElementById("resourceSaveBtn");
const resourceCancelBtn = document.getElementById("resourceCancelBtn");
const adminList = document.getElementById("adminList");
const titleInput = document.getElementById("title");
const urlInput = document.getElementById("url");
const subjectInput = document.getElementById("subject");
const topicInput = document.getElementById("topic");
const typeInput = document.getElementById("type");

// Platform Inputs
const platformSaveBtn = document.getElementById("platformSaveBtn");
const platformCancelBtn = document.getElementById("platformCancelBtn");
const adminPlatformList = document.getElementById("adminPlatformList");
const platNameInput = document.getElementById("platName");
const platUrlInput = document.getElementById("platUrl");
const platImgInput = document.getElementById("platImg");

// State Variables
let editingResourceId = null;
let editingPlatformId = null;

// =========================
// 1. AUTHENTICATION & TOGGLES
// =========================
if (auth) {
  auth.onAuthStateChanged(user => {
    if (user) {
      // Hide Login, Show Admin
      loginSection.classList.add("d-none");
      adminContent.classList.remove("d-none");
      loadResources();
      loadPlatforms();
    } else {
      // Show Login, Hide Admin
      loginSection.classList.remove("d-none");
      adminContent.classList.add("d-none");
    }
  });
}

if(loginBtn) loginBtn.addEventListener("click", () => {
  auth.signInWithEmailAndPassword(emailInput.value, passwordInput.value)
    .catch(e => alert("Login Failed: " + e.message));
});

if(logoutBtn) logoutBtn.addEventListener("click", () => auth.signOut());

// Toggle Sections
function toggleSection(header, body) {
  header.addEventListener("click", () => {
    body.classList.toggle("hidden");
    header.classList.toggle("collapsed");
  });
}
if(resourceHeader) toggleSection(resourceHeader, resourceBody);
if(platformHeader) toggleSection(platformHeader, platformBody);


// =========================
// 2. RESOURCE MANAGER
// =========================
function loadResources() {
  db.collection("links").onSnapshot(snapshot => {
    adminList.innerHTML = "";
    snapshot.forEach(doc => {
      const r = doc.data();
      const li = document.createElement("li");
      
      // THIS IS THE PART THAT ADDS THE BUTTONS
      li.innerHTML = `
          <strong>${r.title}</strong> (${r.subject})
          <div style="float:right;">
             <button class="edit-btn" style="padding: 4px 8px; margin:0;">Edit</button>
             <button class="secondary delete-btn" style="padding: 4px 8px; margin:0;">Delete</button>
          </div>
      `;
      
      // Attach Events
      li.querySelector(".delete-btn").addEventListener("click", () => deleteDoc('links', doc.id));
      li.querySelector(".edit-btn").addEventListener("click", () => startEditResource(doc));
      
      adminList.appendChild(li);
    });
  });
}

function startEditResource(doc) {
  const data = doc.data();
  titleInput.value = data.title;
  urlInput.value = data.url;
  subjectInput.value = data.subject;
  topicInput.value = data.topic;
  typeInput.value = data.type;

  editingResourceId = doc.id;
  resourceSaveBtn.innerText = "Update Resource";
  resourceCancelBtn.classList.remove("d-none");
  resourceBody.classList.remove("hidden"); // Ensure it's open
  resourceBody.scrollIntoView({ behavior: 'smooth' });
}

if(resourceCancelBtn) resourceCancelBtn.addEventListener("click", resetResourceForm);

if(resourceSaveBtn) resourceSaveBtn.addEventListener("click", () => {
  if (!titleInput.value || !urlInput.value) return alert("Fill all fields");

  const data = {
    title: titleInput.value,
    url: urlInput.value,
    subject: subjectInput.value,
    topic: topicInput.value,
    type: typeInput.value
  };

  if (editingResourceId) {
    db.collection("links").doc(editingResourceId).update(data).then(resetResourceForm);
  } else {
    db.collection("links").add(data).then(resetResourceForm);
  }
});

function resetResourceForm() {
  titleInput.value = ""; urlInput.value = ""; 
  subjectInput.value = ""; topicInput.value = "";
  editingResourceId = null;
  resourceSaveBtn.innerText = "Save Resource";
  resourceCancelBtn.classList.add("d-none");
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
      
      // THIS ADDS THE BUTTONS FOR PLATFORMS
      li.innerHTML = `
          <strong>${p.name}</strong>
          <div style="float:right;">
             <button class="edit-btn" style="padding: 4px 8px; margin:0;">Edit</button>
             <button class="secondary delete-btn" style="padding: 4px 8px; margin:0;">Delete</button>
          </div>
      `;
      
      li.querySelector(".delete-btn").addEventListener("click", () => deleteDoc('platforms', doc.id));
      li.querySelector(".edit-btn").addEventListener("click", () => startEditPlatform(doc));
      
      adminPlatformList.appendChild(li);
    });
  });
}

function startEditPlatform(doc) {
  const data = doc.data();
  platNameInput.value = data.name;
  platUrlInput.value = data.url;
  platImgInput.value = data.image || "";

  editingPlatformId = doc.id;
  platformSaveBtn.innerText = "Update Platform";
  platformCancelBtn.classList.remove("d-none");
  platformBody.classList.remove("hidden"); // Ensure it's open
  platformBody.scrollIntoView({ behavior: 'smooth' });
}

if(platformCancelBtn) platformCancelBtn.addEventListener("click", resetPlatformForm);

if(platformSaveBtn) platformSaveBtn.addEventListener("click", () => {
  if (!platNameInput.value || !platUrlInput.value) return alert("Fill Name and URL");

  const data = {
    name: platNameInput.value,
    url: platUrlInput.value,
    image: platImgInput.value || "https://placehold.co/600x400?text=No+Image"
  };

  if (editingPlatformId) {
    db.collection("platforms").doc(editingPlatformId).update(data).then(resetPlatformForm);
  } else {
    db.collection("platforms").add(data).then(resetPlatformForm);
  }
});

function resetPlatformForm() {
  platNameInput.value = ""; platUrlInput.value = ""; platImgInput.value = "";
  editingPlatformId = null;
  platformSaveBtn.innerText = "Save Platform";
  platformCancelBtn.classList.add("d-none");
}

// =========================
// UTILS
// =========================
function deleteDoc(collection, id) {
  if (confirm("Delete this item?")) {
    db.collection(collection).doc(id).delete();
  }
}