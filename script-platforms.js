const platformList = document.getElementById("platformList");

db.collection("platforms").onSnapshot(snapshot => {
  platformList.innerHTML = "";

  snapshot.forEach(doc => {
    const p = doc.data();

    const card = document.createElement("a");
    card.href = p.url;
    card.target = "_blank";
    card.className = "platform-card";

    card.innerHTML = `
      <img src="${p.logo}" alt="${p.name}">
      <h3>${p.name}</h3>
    `;

    platformList.appendChild(card);
  });
});
