const list = document.getElementById("list");
const searchInput = document.getElementById("searchInput");
const subjectFilter = document.getElementById("subjectFilter");
const subtopicFilter = document.getElementById("subtopicFilter");

let resources = [];

/* =========================
   LOAD DATA
========================= */
db.collection("links").onSnapshot(snapshot => {
  resources = [];
  snapshot.forEach(doc => {
    resources.push(doc.data());
  });

  populateFilters();
  renderList();
});

/* =========================
   FILTER DROPDOWNS
========================= */
function populateFilters() {
  const subjects = new Set();
  const subtopics = new Set();

  resources.forEach(r => {
    subjects.add(r.subject);
    subtopics.add(r.subtopic);
  });

  subjectFilter.innerHTML = `<option value="all">All Subjects</option>`;
  subtopicFilter.innerHTML = `<option value="all">All Topics</option>`;

  subjects.forEach(s =>
    subjectFilter.innerHTML += `<option value="${s}">${s}</option>`
  );

  subtopics.forEach(t =>
    subtopicFilter.innerHTML += `<option value="${t}">${t}</option>`
  );
}

/* =========================
   RENDER LIST
========================= */
function renderList() {
  list.innerHTML = "";

  const search = searchInput.value.toLowerCase();
  const subject = subjectFilter.value;
  const subtopic = subtopicFilter.value;

  resources
    .filter(r =>
      (subject === "all" || r.subject === subject) &&
      (subtopic === "all" || r.subtopic === subtopic) &&
      r.title.toLowerCase().includes(search)
    )
    .forEach(r => {
      const li = document.createElement("li");
      li.innerHTML = `
        <strong>${r.title}</strong><br>
        ${r.subject} – ${r.subtopic}<br>
        <a href="${r.url}" target="_blank">Open</a>
      `;
      list.appendChild(li);
    });
}

/* =========================
   EVENTS
========================= */
searchInput.addEventListener("input", renderList);
subjectFilter.addEventListener("change", renderList);
subtopicFilter.addEventListener("change", renderList);
