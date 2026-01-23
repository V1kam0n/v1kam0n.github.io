document.addEventListener("DOMContentLoaded", () => {

  const list = document.getElementById("list");
  const searchInput = document.getElementById("searchInput");
  const subjectFilter = document.getElementById("subjectFilter");
  const subtopicFilter = document.getElementById("subtopicFilter");
  const typeFilter = document.getElementById("typeFilter");
  const refreshBtn = document.getElementById("refreshBtn");

  let resources = [];

  /* =========================
     LOAD DATA FROM FIREBASE
  ========================= */
  db.collection("links").onSnapshot(snapshot => {
    resources = [];
    snapshot.forEach(doc => {
      resources.push(doc.data());
    });

    updateFilters();
    renderList();
  });

  /* =========================
     UPDATE SUBJECT + TOPIC
  ========================= */
  function updateFilters() {
    // SUBJECTS
    subjectFilter.innerHTML = `<option value="all">All Subjects</option>`;
    [...new Set(resources.map(r => r.subject))].forEach(s => {
      subjectFilter.innerHTML += `<option value="${s}">${s}</option>`;
    });

    // TOPICS depend on subject
    updateSubtopics();
  }

  function updateSubtopics() {
    const selectedSubject = subjectFilter.value;

    subtopicFilter.innerHTML = `<option value="all">All Topics</option>`;

    let filteredResources = resources;

    if (selectedSubject !== "all") {
      filteredResources = resources.filter(
        r => r.subject === selectedSubject
      );
    }

    [...new Set(filteredResources.map(r => r.subtopic))].forEach(t => {
      subtopicFilter.innerHTML += `<option value="${t}">${t}</option>`;
    });
  }

  /* =========================
     RENDER LIST
  ========================= */
  function renderList() {
    list.innerHTML = "";

    const search = searchInput.value.toLowerCase();
    const subject = subjectFilter.value;
    const subtopic = subtopicFilter.value;
    const type = typeFilter.value;

    resources
      .filter(r =>
        (subject === "all" || r.subject === subject) &&
        (subtopic === "all" || r.subtopic === subtopic) &&
        (type === "all" || r.type === type) &&
        r.title.toLowerCase().includes(search)
      )
      .forEach(r => {
        const icon =
          r.type === "video" ? "📺" :
          r.type === "quiz" ? "📝" :
          "📄";

        const li = document.createElement("li");
        li.innerHTML = `
          <strong>${icon} ${r.title}</strong><br>
          ${r.subject} – ${r.subtopic}<br>
          <a href="${r.url}" target="_blank">Open</a>
        `;
        list.appendChild(li);
      });
  }

  /* =========================
     EVENTS
  ========================= */

  // 🔁 Subject change → update topics
  subjectFilter.addEventListener("change", () => {
    updateSubtopics();
    subtopicFilter.value = "all"; // reset topic
    renderList();
  });

  subtopicFilter.addEventListener("change", renderList);
  typeFilter.addEventListener("change", renderList);
  searchInput.addEventListener("input", renderList);

  // 🔄 Refresh button
  refreshBtn.addEventListener("click", () => {
    searchInput.value = "";
    subjectFilter.value = "all";
    typeFilter.value = "all";
    updateSubtopics();
    subtopicFilter.value = "all";
    renderList();
  });

});
