const adminList = document.getElementById("adminList");

const titleInput = document.getElementById("title");
const urlInput = document.getElementById("url");
const subjectInput = document.getElementById("subject");
const topicInput = document.getElementById("topic");
const typeInput = document.getElementById("type");

db.collection("links").onSnapshot(snapshot => {
  adminList.innerHTML = "";
  snapshot.forEach(doc => {
    const r = doc.data();
    adminList.innerHTML += `
      <li>
        <strong>${r.title}</strong><br>
        ${r.subject} → ${r.topic} (${r.type})
        <br>
        <button onclick="db.collection('links').doc('${doc.id}').delete()">Delete</button>
      </li>
    `;
  });
});

function saveLink() {
  if (!titleInput.value || !urlInput.value) {
    alert("Fill all fields");
    return;
  }

  db.collection("links").add({
    title: titleInput.value,
    url: urlInput.value,
    subject: subjectInput.value,
    topic: topicInput.value,
    type: typeInput.value
  });

  titleInput.value = "";
  urlInput.value = "";
  subjectInput.value = "";
  topicInput.value = "";
}