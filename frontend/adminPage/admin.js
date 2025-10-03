let section = 'dojo';

// View switching
function showSection(key) {
  document.querySelectorAll('.admin-section').forEach(sec => sec.style.display = "none");
  document.getElementById(key).style.display = "block";
  section = key;
}

// INIT example data (should fetch from backend API in production)
// let dojoInfo = {
//   name: "Shorinji Karate Dojo",
//   hero_title: "Master The Art",
//   hero_subtitle: "Discipline. Defense. Confidence.",
//   hero_image_url: "",
//   established_date: "2010-06-18",
//   description: "A dojo for aspiring martial artists."
// };
let dojoInfo = {};

function loadDojoInfo() {
  fetch("https://localhost:7286/api/Dojo")
    .then(response => response.json())
    .then(data => {
      // Handle cases: undefined, null, empty array, empty object
      if (!data || (Array.isArray(data) && data.length === 0)) {
        dojoInfo = {}; // Use empty object for blank fields in UI
      } else {
        dojoInfo = Array.isArray(data) ? data[0] || {} : data;
      }
      renderDojoInfo(); // This will always work with a valid object
      // dojoInfo = Array.isArray(data) ? data[0] : data;
      // renderDojoInfo();
    })
    .catch(error => {
      document.getElementById('dojoInfo').innerHTML = "<p>Error loading dojo info.</p>";
      console.error("Error fetching dojo info:", error);
    });
}

// Replace original direct renderDojoInfo() call with API fetch
loadDojoInfo();

// let subscribers = [
//   {id: 2, email: "student1@mail.com", subscribed_at: "2025-09-01 14:02"},
// ];
let subscribers = [];

function loadSubscribers(){
  fetch("https://localhost:7286/api/Subscribers")
    .then(response => response.json())
    .then(data => {
      subscribers = Array.isArray(data) ? data : [];
      renderSubscribers();
    })
    .catch(error => {
      console.error("Error fetching subscribers:", error);
    });
} 

// let programs = [
//   {id: 1, name: "Kids Karate", description: "For ages 6-10", image_url: "", image: null}

let programs = [];

function loadPrograms(){
  fetch("https://localhost:7286/api/Programs")
    .then(response => response.json())
    .then(data =>{
      programs = Array.isArray(data) ? data : [],
      renderPrograms();
    })
    .catch(error => {
      console.error("Error fetching programs :", error);
    });
}

// let instructors = [
//   {id: 1, name: "Sensei Bob", role: "Head Instructor", phone: "12345678", email: "bob@dojo.com", photo_url: "", photo: null}
// ];
let instructors = [];

function loadInstructors(){
  fetch("https://localhost:7286/api/Instructor")
    .then(response => response.json())
    .then(data => {
        instructors = Array.isArray(data) ? data : [],
        renderInstructors();
    })
    .catch(error => {
      console.error("Error fetching instructors: ",error);
    });
}

// let highlights = [
//   {id: 1, title: "Self Defense", content: "Essential self-defense techniques"}
// ];
let highlights = [];

function loadHighlights(){
  fetch("https://localhost:7286/api/Highlights")
    .then(response => response.json())
    .then(data => {
      highlights = Array.isArray(data) ? data: [];
      renderHighlights();
    })
    .catch(error => {
      console.error("Error fetching highlights :",error);
    })
}

// Dojo Info handlers
document.getElementById('dojoForm').onsubmit = function(e){
  e.preventDefault();
  const payload = {
    name: document.getElementById('dojoName').value,
    hero_title: document.getElementById('dojoHeroTitle').value,
    heroTitle: document.getElementById('dojoHeroTitle').value,
    heroSubtitle: document.getElementById('dojoHeroSubtitle').value,
    heroImageURL: document.getElementById('dojoHeroImageUrl').value,
    establishedDate: document.getElementById('dojoEstablishedDate').value,
    description: document.getElementById('dojoDescription').value
  };

  // First: Checks if the dojo already exists
  fetch("https://localhost:7286/api/Dojo")
  .then(response =>{
    if(!response.ok) throw new Error("Failed to fetch dojo data");
    return response.json();
  })
  .then(dojos => {
    if (!dojos || dojos.length === 0) {
      // No dojo exists, create new
      return fetch("https://localhost:7286/api/Dojo/Create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
    } else {
      // Dojo exists, update the first one
      const existingDojo = dojos[0];
      return fetch(`https://localhost:7286/api/Dojo/Update/${existingDojo.id}`, {
        method: "PUT", // or "POST", depends on your API
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...payload,
          id: existingDojo.id // include ID if required by backend
        })
      });
    }
  })
  .then(response => {
    if(!response.ok) throw new Error("Failed to save dojo info");
    return response.json();
  })
  .then(data => {
    dojoInfo = data;
    renderDojoInfo();
    alert("Dojo information saved!");
  })
  .catch(error =>{
    alert("Error saving dojo info");
    console.error("Error : ",error);
  });





  // fetch("https://localhost:7286/api/Dojo/Create", {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json"
  //   },
  //   body: JSON.stringify(payload)
  // })
  // .then(response => {
  //   if (!response.ok) throw new Error("Failed to save dojo info");
  //   return response.json();
  // })
  // .then(data => {
  //   dojoInfo = data;
  //   renderDojoInfo();
  //   alert("Dojo information saved!");
  // })
  // .catch(error => {
  //   alert("Error saving dojo info");
  //   console.error("Error:", error);
  // });
  // dojoInfo = {
  //   name: document.getElementById('dojoName').value,
  //   hero_title: document.getElementById('dojoHeroTitle').value,
  //   hero_subtitle: document.getElementById('dojoHeroSubtitle').value,
  //   hero_image_url: document.getElementById('dojoHeroImageUrl').value,
  //   established_date: document.getElementById('dojoEstablishedDate').value,
  //   description: document.getElementById('dojoDescription').value
  // };
  // renderDojoInfo();
};

function renderDojoInfo(){
  dojoInfo = dojoInfo || {};
  let el = document.getElementById('dojoInfo');
  let heroLine = "";
  if (dojoInfo.heroTitle && dojoInfo.heroSubtitle) {
    heroLine = `<em>${dojoInfo.heroTitle}</em> - ${dojoInfo.heroSubtitle} <br>`;
  } else if (dojoInfo.heroTitle) {
    heroLine = `<em>${dojoInfo.heroTitle}</em><br>`;
  } else if (dojoInfo.heroSubtitle) {
    heroLine = `${dojoInfo.heroSubtitle}<br>`;
  }
  el.innerHTML = `<strong>${dojoInfo.name || ""}</strong><br>
    ${heroLine}
    <img src="${dojoInfo.heroImageURL || ""}" style="max-width:80px;" alt=""><br>
    <b id="dojoEstablished">Established:</b> ${dojoInfo.establishedDate || ""} <br>
    <i>${dojoInfo.description || ""}</i>`;
  // populate fields for editing
  document.getElementById('dojoName').value = dojoInfo.name || "";
  document.getElementById('dojoHeroTitle').value = dojoInfo.heroTitle || "";
  document.getElementById('dojoHeroSubtitle').value = dojoInfo.heroSubtitle || "";
  document.getElementById('dojoHeroImageUrl').value = dojoInfo.heroImageURL || "";
  document.getElementById('dojoEstablishedDate').value = dojoInfo.establishedDate || "";
  document.getElementById('dojoDescription').value = dojoInfo.description || "";

  // Show/hide the established line
  document.getElementById('dojoEstablished').style.display = dojoInfo.establishedDate ? 'inline' : 'none';

   // Show/hide the delete button
  document.getElementById('deleteDojoBtn').style.display = dojoInfo.id ? 'inline-block' : 'none';
}
// renderDojoInfo();

// Subscribers Table (READ/DELETE only)
function renderSubscribers() {
  let tbody = document.querySelector('#subscribersTable tbody');
  tbody.innerHTML = "";
  subscribers.forEach(sub =>
    tbody.innerHTML += `<tr>
      <td>${sub.id}</td>
      <td>${sub.email}</td>
      <td>${sub.subscribedAt}</td>
      <td class="actions"><button class="delete" onclick="deleteSubscriber(${sub.id})">Delete</button></td>
    </tr>`
  );
}
function deleteSubscriber(id) {
  // subscribers = subscribers.filter(s => s.id !== id); renderSubscribers();
  // Confirm before deleting (optional)
  if(!confirm('Really delete this subscriber ?')) return;

  fetch(`https://localhost:7286/api/Subscribers/Delete/${id}`,{
    method: 'DELETE'
  })
  .then(response =>{
    if(!response.ok){
      throw new Error ("Failed to delete subscriber");
    }
    //Remove from local list and update table
    subscribers = subscribers.filter(s => s.id != id);
    renderSubscribers();
  })
  .catch(error =>{
    alert(error.message);
  });
}
window.deleteSubscriber = deleteSubscriber;
// renderSubscribers();
loadSubscribers();

// Programs CRUD
let editingProgram = null;
document.getElementById('programForm').onsubmit = function(e){
  e.preventDefault();
  let name = document.getElementById('programName').value.trim();
  let description = document.getElementById('programDescription').value.trim();
  let image_url = document.getElementById('programImageUrl').value.trim();
  let image = document.getElementById('programImageBlob').files[0] || null;
  if(editingProgram){
    let p = programs.find(pr => pr.id === editingProgram);
    Object.assign(p, { name, description, image_url, image });
    editingProgram = null;
  } else {
    programs.push({ id: Date.now(), name, description, image_url, image });
  }
  this.reset();
  document.getElementById('programCancelBtn').style.display = "none";
  renderPrograms();
};
function editProgram(id) {
  let p = programs.find(x => x.id === id);
  document.getElementById('programId').value = p.id;
  document.getElementById('programName').value = p.name;
  document.getElementById('programDescription').value = p.description;
  document.getElementById('programImageUrl').value = p.image_url;
  editingProgram = id;
  document.getElementById('programCancelBtn').style.display = "inline-block";
}
document.getElementById('programCancelBtn').onclick = function(){
  document.getElementById('programForm').reset(); editingProgram = null; this.style.display = "none";
};
function deleteProgram(id) {
  programs = programs.filter(p => p.id !== id); renderPrograms();
}
window.editProgram = editProgram;
window.deleteProgram = deleteProgram;
function renderPrograms() {
  let tbody = document.querySelector('#programsTable tbody');
  tbody.innerHTML = "";
  programs.forEach(p => {
    tbody.innerHTML += `<tr>
      <td>${p.id}</td>
      <td>${p.name}</td>
      <td>${p.description}</td>
      <td><img src="${p.imageUrl}" style="max-width:40px"></td>
      <td class="actions">
        <button onclick="editProgram(${p.id})">Edit</button>
        <button class="delete" onclick="deleteProgram(${p.id})">Delete</button>
      </td>
    </tr>`;
  });
}
// renderPrograms();
loadPrograms();

// Instructors CRUD (similar pattern)
let editingInstructor = null;
document.getElementById('instructorForm').onsubmit = function(e){
  e.preventDefault();
  let name = document.getElementById('instructorName').value.trim();
  let role = document.getElementById('instructorRole').value.trim();
  let phone = document.getElementById('instructorPhone').value.trim();
  let email = document.getElementById('instructorEmail').value.trim();
  let photo_url = document.getElementById('instructorPhotoUrl').value.trim();
  let photo = document.getElementById('instructorPhotoBlob').files[0] || null;
  if(editingInstructor){
    let ins = instructors.find(i => i.id === editingInstructor);
    Object.assign(ins, { name, role, phone, email, photo_url, photo });
    editingInstructor = null;
  } else {
    instructors.push({ id:Date.now(), name, role, phone, email, photo_url, photo });
  }
  this.reset();
  document.getElementById('instructorCancelBtn').style.display = "none";
  renderInstructors();
};
function editInstructor(id) {
  let i = instructors.find(x => x.id === id);
  document.getElementById('instructorId').value = i.id;
  document.getElementById('instructorName').value = i.name;
  document.getElementById('instructorRole').value = i.role;
  document.getElementById('instructorPhone').value = i.phone;
  document.getElementById('instructorEmail').value = i.email;
  document.getElementById('instructorPhotoUrl').value = i.photo_url;
  editingInstructor = id;
  document.getElementById('instructorCancelBtn').style.display = "inline-block";
}
document.getElementById('instructorCancelBtn').onclick = function(){
  document.getElementById('instructorForm').reset(); editingInstructor = null; this.style.display = "none";
};
function deleteInstructor(id) {
  instructors = instructors.filter(i => i.id !== id); renderInstructors();
}
window.editInstructor = editInstructor;
window.deleteInstructor = deleteInstructor;
function renderInstructors() {
  let tbody = document.querySelector('#instructorsTable tbody');
  tbody.innerHTML = "";
  instructors.forEach(i => {
    tbody.innerHTML += `<tr>
      <td>${i.id}</td>
      <td>${i.name}</td>
      <td>${i.role}</td>
      <td>${i.email}</td>
      <td>${i.phone}</td>
      <td><img src="${i.photo_url}" style="max-width:40px"></td>
      <td class="actions">
        <button onclick="editInstructor(${i.id})">Edit</button>
        <button class="delete" onclick="deleteInstructor(${i.id})">Delete</button>
      </td>
    </tr>`;
  });
}
loadInstructors();
// renderInstructors();

// Highlights CRUD
let editingHighlight = null;
document.getElementById('highlightForm').onsubmit = function(e){
  e.preventDefault();
  let title = document.getElementById('highlightTitle').value.trim();
  let content = document.getElementById('highlightContent').value.trim();
  if(editingHighlight){
    let h = highlights.find(hh => hh.id === editingHighlight);
    Object.assign(h, { title, content });
    editingHighlight = null;
  } else {
    highlights.push({ id:Date.now(), title, content });
  }
  this.reset();
  document.getElementById('highlightCancelBtn').style.display = "none";
  renderHighlights();
};
function editHighlight(id) {
  let h = highlights.find(x => x.id === id);
  document.getElementById('highlightId').value = h.id;
  document.getElementById('highlightTitle').value = h.title;
  document.getElementById('highlightContent').value = h.content;
  editingHighlight = id;
  document.getElementById('highlightCancelBtn').style.display = "inline-block";
}
document.getElementById('highlightCancelBtn').onclick = function(){
  document.getElementById('highlightForm').reset(); editingHighlight = null; this.style.display = "none";
};
function deleteHighlight(id) {
  highlights = highlights.filter(h => h.id !== id); renderHighlights();
}
window.editHighlight = editHighlight;
window.deleteHighlight = deleteHighlight;
function renderHighlights() {
  let tbody = document.querySelector('#highlightsTable tbody');
  tbody.innerHTML = "";
  highlights.forEach(h => {
    tbody.innerHTML += `<tr>
      <td>${h.id}</td>
      <td>${h.title}</td>
      <td>${h.content}</td>
      <td class="actions">
        <button onclick="editHighlight(${h.id})">Edit</button>
        <button class="delete" onclick="deleteHighlight(${h.id})">Delete</button>
      </td>
    </tr>`;
  });
}
// renderHighlights();
loadHighlights();

showSection('dojo');

document.getElementById('deleteDojoBtn').onclick = function() {
  if (!dojoInfo.id) {
    alert("No dojo loaded to delete!");
    return;
  }
  if (!confirm('Really delete this dojo?')) return;

  fetch(`https://localhost:7286/api/Dojo/Delete/${dojoInfo.id}`, {
    method: 'DELETE'
  })
  .then(response => {
    if (!response.ok) throw new Error("Failed to delete dojo.");
    // Clear dojoInfo and update UI
    dojoInfo = {};
    renderDojoInfo();
    alert("Dojo deleted.");
  })
  .catch(error => {
    alert(error.message);
  });
};

