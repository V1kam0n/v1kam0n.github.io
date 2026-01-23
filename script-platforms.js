const list = document.getElementById("platformList");

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
      // Use saved image OR placeholder
      const img = p.image || "https://placehold.co/600x400?text=No+Image";
      
      list.innerHTML += `
        <li class="platform-card">
          <img src="${img}" class="platform-img" alt="${p.name}">
          <strong>${p.name}</strong>
          <a href="${p.url}" target="_blank" style="margin-top:8px;">
            <button class="secondary">Visit Site</button>
          </a>
        </li>
      `;
    });
  });
}