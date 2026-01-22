let resources = [];

db.collection("links").onSnapshot(snapshot => {
  resources = snapshot.docs.map(d => d.data());
  updateFilters();
  applyFilters();
});

function applyFilters() {
  const q = search.value.toLowerCase();
  const type = typeFilter.value;
  const subject = subjectFilter.value;
  const topic = subtopicFilter.value;

  display(resources.filter(r =>
    (!q || r.title.toLowerCase().includes(q)) &&
    (type === "all" || r.type === type) &&
    (subject === "all" || r.subject === subject) &&
    (topic === "all" || r.subtopic === topic)
  ));
}

function display(data) {
  list.innerHTML = "";
  data.forEach(r => {
    const li = document.createElement("li");
    const icon = { video:"🎥", notes:"📝", quiz:"❓" }[r.type];
    const a = document.createElement("a");
    a.href = r.url;
    a.target = "_blank";
    a.textContent = `${icon} ${r.title} (${r.subject})`;
    li.appendChild(a);
    list.appendChild(li);
  });
}

function updateFilters() {
  subjectFilter.innerHTML = `<option value="all">All Subjects</option>`;
  subtopicFilter.innerHTML = `<option value="all">All Topics</option>`;

  [...new Set(resources.map(r => r.subject))].forEach(s =>
    subjectFilter.innerHTML += `<option>${s}</option>`
  );

  [...new Set(resources.map(r => r.subtopic))].forEach(t =>
    subtopicFilter.innerHTML += `<option>${t}</option>`
  );
}