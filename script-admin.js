// =========================
// ELEMENTS
// =========================
const list = document.getElementById("list");
const searchInput = document.getElementById("searchInput");
const subjectFilter = document.getElementById("subjectFilter");
const topicFilter = document.getElementById("topicFilter");
const typeFilter = document.getElementById("typeFilter");
const refreshBtn = document.getElementById("refreshBtn");

let resources = [];
let unsubscribe = null;

// =========================
// LOAD RESOURCES
// =========================
loadResources();

function loadResources() {
  if (unsubscribe) unsubscribe();

  unsubscribe = db.collection("links").onSnapshot(snapshot => {
    resources = [];
    snapshot.forEach(doc => resources.push(doc.data()));

    updateSubjects();
    renderList();
  });
}

// =========================
// FILTERS (SUBJECT / TOPIC)
// =========================
function updateSubjects() {
  subjectFilter.innerHTML = `<option value="all">All Subjects</option>`;

  [...new Set(resources.map(r => r.subject))]
    .sort()
    .forEach(s => {
      subjectFilter.innerHTML += `<option value="${s}">${s}</option>`;
    });

  updateTopics();
}

function updateTopics() {
  const subject = subjectFilter.value;
  topicFilter.innerHTML = `<option value="all">All Topics</option>`;

  let filtered = resources;
  if (subject !== "all") {
    filtered = resources.filter(r => r.subject === subject);
  }

  [...new Set(filtered.map(r => r.topic))]
    .sort()
    .forEach(t => {
      topicFilter.innerHTML += `<option value="${t}">${t}</option>`;
    });
}

// =========================
// RENDER LIST (Updated)
// =========================
function renderList() {
  list.innerHTML = "";

  const search = searchInput.value.toLowerCase();
  const subject = subjectFilter.value;
  const topic = topicFilter.value;
  const type = typeFilter.value;

  const results = resources.filter(r =>
    (subject === "all" || r.subject === subject) &&
    (topic === "all" || r.topic === topic) &&
    (type === "all" || r.type === type) &&
    r.title.toLowerCase().includes(search)
  );

  if (results.length === 0) {
    list.innerHTML = `<li>No resources found.</li>`;
    return;
  }

  results.forEach(r => {
    const icon =
      r.type === "video" ? "📺" :
      r.type === "quiz" ? "📝" :
      "📄";

    const li = document.createElement("li");
    
    // --- CHANGE IS HERE ---
    // I removed the line that showed "Subject -> Topic"
    // Now it just shows Title (Left) and Open (Right)
    li.innerHTML = `
      <strong>${icon} ${r.title}</strong>
      <a href="${r.url}" target="_blank">Open</a>
    `;
    
    list.appendChild(li);
  });
}

// =========================
// EVENTS
// =========================
if(subjectFilter) {
  subjectFilter.addEventListener("change", () => {
    topicFilter.value = "all";
    updateTopics();
    renderList();
  });
}

if(topicFilter) topicFilter.addEventListener("change", renderList);
if(typeFilter) typeFilter.addEventListener("change", renderList);
if(searchInput) searchInput.addEventListener("input", renderList);

if(refreshBtn) {
  refreshBtn.addEventListener("click", () => {
    searchInput.value = "";
    subjectFilter.value = "all";
    topicFilter.value = "all";
    typeFilter.value = "all";
    updateTopics();
    renderList();
  });
}