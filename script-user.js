const list = document.getElementById("list");
const searchInput = document.getElementById("searchInput");
const subjectFilter = document.getElementById("subjectFilter");
const topicFilter = document.getElementById("topicFilter");
const typeFilter = document.getElementById("typeFilter");
const refreshBtn = document.getElementById("refreshBtn");

let resources = [];

db.collection("links").onSnapshot(snapshot => {
  resources = [];
  snapshot.forEach(doc => resources.push(doc.data()));
  updateSubjects();
  render();
});

function updateSubjects() {
  subjectFilter.innerHTML = `<option value="all">All Subjects</option>`;
  [...new Set(resources.map(r => r.subject))].forEach(s => {
    subjectFilter.innerHTML += `<option value="${s}">${s}</option>`;
  });
  updateTopics();
}

function updateTopics() {
  topicFilter.innerHTML = `<option value="all">All Topics</option>`;
  resources
    .filter(r => subjectFilter.value === "all" || r.subject === subjectFilter.value)
    .map(r => r.topic)
    .filter((v, i, a) => a.indexOf(v) === i)
    .forEach(t => {
      topicFilter.innerHTML += `<option value="${t}">${t}</option>`;
    });
}

function render() {
  list.innerHTML = "";
  resources.filter(r =>
    (subjectFilter.value === "all" || r.subject === subjectFilter.value) &&
    (topicFilter.value === "all" || r.topic === topicFilter.value) &&
    (typeFilter.value === "all" || r.type === typeFilter.value) &&
    r.title.toLowerCase().includes(searchInput.value.toLowerCase())
  ).forEach(r => {
    const icon = r.type === "video" ? "📺" : r.type === "quiz" ? "📝" : "📄";
    list.innerHTML += `
      <li>
        <strong>${icon} ${r.title}</strong><br>
        ${r.subject} → ${r.topic}<br>
        <a href="${r.url}" target="_blank">Open</a>
      </li>
    `;
  });
}

subjectFilter.onchange = () => { updateTopics(); render(); };
topicFilter.onchange = render;
typeFilter.onchange = render;
searchInput.oninput = render;

refreshBtn.onclick = () => {
  searchInput.value = "";
  subjectFilter.value = "all";
  topicFilter.value = "all";
  typeFilter.value = "all";
  updateTopics();
  render();
};
