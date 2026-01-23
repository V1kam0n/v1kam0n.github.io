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
// FILTERS
// =========================
function updateSubjects() {
  if (!subjectFilter) return;
  subjectFilter.innerHTML = `<option value="all">All Subjects</option>`;
  [...new Set(resources.map(r => r.subject))].sort().forEach(s => {
      subjectFilter.innerHTML += `<option value="${s}">${s}</option>`;
  });
  updateTopics();
}

function updateTopics() {
  if (!topicFilter) return;
  const subject = subjectFilter.value;
  topicFilter.innerHTML = `<option value="all">All Topics</option>`;

  let filtered = resources;
  if (subject !== "all") {
    filtered = resources.filter(r => r.subject === subject);
  }

  [...new Set(filtered.map(r => r.topic))].sort().forEach(t => {
      topicFilter.innerHTML += `<option value="${t}">${t}</option>`;
  });
}

// =========================
// RENDER LIST (Cleaned)
// =========================
function renderList() {
  if (!list) return;
  list.innerHTML = "";

  const search = searchInput ? searchInput.value.toLowerCase() : "";
  const subject = subjectFilter ? subjectFilter.value : "all";
  const topic = topicFilter ? topicFilter.value : "all";
  const type = typeFilter ? typeFilter.value : "all";

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
    
    // --- THIS IS THE FIX ---
    // Only 2 items: Title (left) and Open Button (right)
    li.innerHTML = `
      <span style="font-weight: bold;">${icon} ${r.title}</span>
      <a href="${r.url}" target="_blank">
        <button class="secondary" style="margin:0; padding: 6px 12px;">Open</button>
      </a>
    `;
    
    list.appendChild(li);
  });
}

// =========================
// EVENTS
// =========================
if(subjectFilter) {
  subjectFilter.addEventListener("change", () => {
    if(topicFilter) topicFilter.value = "all";
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