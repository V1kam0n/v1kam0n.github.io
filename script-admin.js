const adminList = document.getElementById("adminList");

firebase.auth().onAuthStateChanged(user => {
  if (user) {
    loginCard.style.display = "none";
    adminPanel.style.display = "block";
    resourceList.style.display = "block";
    loadResources();
  } else {
    loginCard.style.display = "block";
    adminPanel.style.display = "none";
    resourceList.style.display = "none";
  }
});

function login() {
  firebase.auth()
    .signInWithEmailAndPassword(email.value, password.value)
    .catch(err => alert(err.message));
}

function logout() {
  firebase.auth().signOut();
}

function saveLink() {
  const data = {
    title: title.value,
    url: url.value,
    subject: subject.value,
    subtopic: subtopic.value
  };

  const id = editId.value;

  if (id) {
    // UPDATE
    db.collection("links").doc(id).update(data)
      .then(() => {
        alert("Updated!");
        clearForm();
      });
  } else {
    // ADD
    db.collection("links").add(data)
      .then(() => alert("Added!"));
  }
}

function loadResources() {
  db.collection("links").onSnapshot(snapshot => {
    adminList.innerHTML = "";
    snapshot.forEach(doc => {
      const r = doc.data();
      const li = document.createElement("li");

      li.innerHTML = `
        <strong>${r.title}</strong><br>
        <small>${r.subject} - ${r.subtopic}</small><br>
        <button onclick="editLink('${doc.id}', '${r.title}', '${r.url}', '${r.subject}', '${r.subtopic}')">Edit</button>
        <button class="secondary" onclick="deleteLink('${doc.id}')">Delete</button>
      `;

      adminList.appendChild(li);
    });
  });
}

function editLink(id, t, u, s, sub) {
  editId.value = id;
  title.value = t;
  url.value = u;
  subject.value = s;
  subtopic.value = sub;
}

function deleteLink(id) {
  if (confirm("Delete this resource?")) {
    db.collection("links").doc(id).delete();
  }
}

function clearForm() {
  editId.value = "";
  title.value = "";
  url.value = "";
  subject.value = "";
  subtopic.value = "";
}
