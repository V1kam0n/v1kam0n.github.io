firebase.auth().onAuthStateChanged(user => {
  loginCard.style.display = user ? "none" : "block";
  adminPanel.style.display = user ? "block" : "none";
  if (user) loadAdminList();
});

function login() {
  firebase.auth().signInWithEmailAndPassword(email.value, password.value)
    .catch(e => alert(e.message));
}

function logout() {
  firebase.auth().signOut();
}

function addLink() {
  if (!title.value || !url.value || !type.value) {
    alert("Title, URL & type required");
    return;
  }

  db.collection("links").add({
    title: title.value,
    url: url.value,
    subject: subject.value || "General",
    subtopic: subtopic.value || "General",
    type: type.value
  });

  title.value = url.value = subject.value = subtopic.value = type.value = "";
}

function loadAdminList() {
  db.collection("links").onSnapshot(snap => {
    adminList.innerHTML = "";
    snap.forEach(doc => {
      const li = document.createElement("li");
      li.textContent = doc.data().title;

      const del = document.createElement("button");
      del.textContent = "❌";
      del.onclick = () => confirm("Delete?") && doc.ref.delete();

      li.appendChild(del);
      adminList.appendChild(li);
    });
  });
}