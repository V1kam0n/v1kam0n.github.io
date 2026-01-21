// DOM elements
const list = document.getElementById("list");
const subjectFilter = document.getElementById("subjectFilter");
const subtopicFilter = document.getElementById("subtopicFilter");

let resources = [];

// REAL-TIME LISTENER
db.collection("links").orderBy("createdAt", "desc").onSnapshot(snapshot => {
  resources = [];
  snapshot.forEach(doc => resources.push(doc.data()));
  updateFilters();
  display(resources);
});

// DISPLAY LINKS
function display(data) {
  list.innerHTML = "";

  data.forEach(r => {
    const li = document.createElement("li");
    const a = document.createElement("a");

    a.href = r.url;
    a.target = "_blank";
    a.textContent = `${r.title} (${r.subject || "General"} - ${r.subtopic || "Misc"})`;

    li.appendChild(a);
    list.appendChild(li);
  });
}

// FILTER LINKS
function filterLinks() {
  const s = subjectFilter.value;
  const t = subtopicFilter.value;

  display(
    resources.filter(r =>
      (s === "all" || r.subject === s) &&
      (t === "all" || r.subtopic === t)
    )
  );
}

// UPDATE FILTER DROPDOWNS
function updateFilters() {
  subjectFilter.innerHTML = `<option value="all">All Subjects</option>`;
  subtopicFilter.innerHTML = `<option value="all">All Topics</option>`;

  [...new Set(resources.map(r => r.subject).filter(Boolean))]
    .forEach(s => {
      const opt = document.createElement("option");
      opt.value = s;
      opt.textContent = s;
      subjectFilter.appendChild(opt);
    });

  [...new Set(resources.map(r => r.subtopic).filter(Boolean))]
    .forEach(t => {
      const opt = document.createElement("option");
      opt.value = t;
      opt.textContent = t;
      subtopicFilter.appendChild(opt);
    });
}
