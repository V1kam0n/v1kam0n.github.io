let resources = [];

/* =========================
   LOAD DATA FROM FIRESTORE
   ========================= */
db.collection("links").onSnapshot(snapshot => {
  resources = [];
  snapshot.forEach(doc => {
    resources.push(doc.data());
  });

  updateFilters();
  filterLinks(); // important: apply filters + search together
});

/* =========================
   DISPLAY LIST
   ========================= */
function display(data) {
  list.innerHTML = "";

  if (data.length === 0) {
    list.innerHTML = "<li>No results found</li>";
    return;
  }

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

/* =========================
   FILTER + SEARCH (MAIN LOGIC)
   ========================= */
function filterLinks() {
  const subject = subjectFilter.value;
  const topic = subtopicFilter.value;
  const query = searchInput.value.toLowerCase().trim();

  const filtered = resources.filter(r => {
    const matchesSubject =
      subject === "all" || r.subject === subject;

    const matchesTopic =
      topic === "all" || r.subtopic === topic;

    const matchesSearch =
      r.title.toLowerCase().includes(query) ||
      r.subject.toLowerCase().includes(query) ||
      r.subtopic.toLowerCase().includes(query);

    return matchesSubject && matchesTopic && matchesSearch;
  });

  display(filtered);
}

/* =========================
   UPDATE DROPDOWNS
   ========================= */
function updateFilters() {
  subjectFilter.innerHTML = `<option value="all">All Subjects</option>`;
  subtopicFilter.innerHTML = `<option value="all">All Topics</option>`;

  const subjects = new Set();
  const topics = new Set();

  resources.forEach(r => {
    if (r.subject) subjects.add(r.subject);
    if (r.subtopic) topics.add(r.subtopic);
  });

  subjects.forEach(s => {
    subjectFilter.innerHTML += `<option value="${s}">${s}</option>`;
  });

  topics.forEach(t => {
    subtopicFilter.innerHTML += `<option value="${t}">${t}</option>`;
  });
}

function goHome() {
  window.location.href = "index.html";
}
