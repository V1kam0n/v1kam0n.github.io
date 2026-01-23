const list = document.getElementById("platformList");

db.collection("platforms").onSnapshot(snapshot => {
  list.innerHTML = "";
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
