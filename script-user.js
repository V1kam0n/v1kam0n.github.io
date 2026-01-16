let resources = [];

db.collection("links").onSnapshot(snapshot => {
  resources = [];
  snapshot.forEach(doc => resources.push(doc.data()));
  updateFilters();
  display(resources);
});

function display(data) {
  list.innerHTML = "";
  data.forEach(r => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = r.url;
    a.target = "_blank";
    a.textContent = `${r.title} (${r.subject} - ${r.subtopic})`;
    li.appendChild(a);
    list.appendChild(li);
  });
}

function filterLinks() {
  const s = subjectFilter.value;
  const t = subtopicFilter.value;

  display(resources.filter(r =>
    (s === "all" || r.subject === s) &&
    (t === "all" || r.subtopic === t)
  ));
}

function updateFilters() {
  subjectFilter.innerHTML = `<option value="all">All Subjects</option>`;
  subtopicFilter.innerHTML = `<option value="all">All Topics</option>`;

  [...new Set(resources.map(r => r.subject))]
    .forEach(s => subjectFilter.innerHTML += `<option>${s}</option>`);

  [...new Set(resources.map(r => r.subtopic))]
    .forEach(t => subtopicFilter.innerHTML += `<option>${t}</option>`);
}
