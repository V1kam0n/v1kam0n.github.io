const subjectFilter = document.getElementById("subjectFilter");
const subtopicFilter = document.getElementById("subtopicFilter");
const list = document.getElementById("list");
const searchInput = document.getElementById("searchInput");

let resources = [];

/* =========================
   LOAD DATA
   ========================= */
db.collection("links").onSnapshot(snapshot => {
  resources = [];
  snapshot.forEach(doc => resources.push(doc.data()));
  updateFilters();
  applyFilters();
});

/* =========================
   DISPLAY
   ========================= */
function display(data) {
  list.innerHTML = "";

  data.forEach(r => {
    const li = document.createElement("li");

    const icons = {
      video: "🎥",
      notes: "📝",
      quiz: "🧠"
    };

    const a = document.createElement("a");
    a.href = r.url;
    a.target = "_blank";
    a.textContent = `${icons[r.type] || "📘"} ${r.title} (${r.subject} – ${r.subtopic})`;

    li.appendChild(a);
    list.appendChild(li);
  });
}

/* =========================
   FILTER LOGIC
   ========================= */
function applyFilters() {
  const subject = subjectFilter.value;
  const topic = subtopicFilter.value;
  const search = searchInput.value.toLowerCase();

  const filtered = resources.filter(r =>
    (subject === "all" || r.subject === subject) &&
    (topic === "all" || r.subtopic === topic) &&
    (
      r.title.toLowerCase().includes(search) ||
      r.subject.toLowerCase().includes(search) ||
      r.subtopic.toLowerCase().includes(search)
    )
  );

  display(filtered);
}

/* =========================
   DROPDOWNS
   ========================= */
function updateFilters() {
  subjectFilter.innerHTML = `<option value="all">All Subjects</option>`;
  [...new Set(resources.map(r => r.subject))].forEach(s => {
    subjectFilter.innerHTML += `<option value="${s}">${s}</option>`;
  });

  updateSubtopics();
}

function updateSubtopics() {
  const selected = subjectFilter.value;
  subtopicFilter.innerHTML = `<option value="all">All Topics</option>`;

  let filtered = resources;
  if (selected !== "all") {
    filtered = resources.filter(r => r.subject === selected);
  }

  [...new Set(filtered.map(r => r.subtopic))].forEach(t => {
    subtopicFilter.innerHTML += `<option value="${t}">${t}</option>`;
  });
}

/* =========================
   EVENTS
   ========================= */
subjectFilter.addEventListener("change", () => {
  updateSubtopics();
  subtopicFilter.value = "all";
  applyFilters();
});

subtopicFilter.addEventListener("change", applyFilters);
searchInput.addEventListener("input", applyFilters);