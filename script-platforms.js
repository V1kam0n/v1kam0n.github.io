// =========================
// ELEMENTS
// =========================
const list = document.getElementById("platformList");

// =========================
// LOAD PLATFORMS
// =========================
if (list) {
  loadPlatforms();
}

function loadPlatforms() {
  db.collection("platforms").onSnapshot(snapshot => {
    list.innerHTML = "";

    if (snapshot.empty) {
      list.innerHTML = "<li>No platforms found.</li>";
      return;
    }

    snapshot.forEach(doc => {
      const p = doc.data();
      list.innerHTML += `
        <li>
          <strong>${p.name}</strong><br>
          <a href="${p.url}" target="_blank">Visit</a>
        </li>
      `;
    });
  });
}