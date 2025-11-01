let section = null ;

window.addEventListener("DOMContentLoaded",(e) => {
  const params = new URL(window.location).searchParams;
  const section = params.get("section");
  if (section){
    showSection(section);
  } else {
    showSection('dojo');
  }
})

// View switching
function showSection(key) {
  document.querySelectorAll('.admin-section').forEach(sec => sec.style.display = "none");
  var el = document.getElementById(key);
  if (el) {
    el.style.display = "block";
    section = key;
  } else {
    console.warn(`No element with id '${key}' found in showSection`);
  }
  // document.getElementById(key).style.display = "block";
  // section = key;
}


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
  .then(async response => {
    if(!response.ok) throw new Error("Failed to save dojo info");
    // Handle empty responses  or no JSON content
    const text = await response.text();
    let data = {};
    try{
      if (text) data = JSON.parse(text);
    } catch(e){
      // Silently handle parse errors - backend may return empty body
      console("Parsing error: ", e);
    }

    return data;
    // If the response has content, parse JSON; else, return empty object
    // return response.headers.get("content-length") > 0 
    //   ? response.json() : {};
    // return response.json();
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
  subscribers.forEach(sub =>{

    // Parse as JS Date (interprets as UTC)
    let utcDate = new Date(sub.subscribedAt+"Z");

    // Display browser's local time
    let localString = utcDate.toLocaleString();

    tbody.innerHTML += `<tr>
      <td>${sub.id}</td>
      <td>${sub.email}</td>
      <td>${localString}</td>
      <td class="actions"><button class="delete" onclick="deleteSubscriber(${sub.id})">Delete</button></td>
    </tr>`
  });
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
    alert("Subscriber deleted.");
    console.log("Deleting subscriber, then keeping on subscribers tab");
    showSection('subscribers');
    console.log("Deleting subscriber, then keeping on subscribers tab");
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
  let pricing = document.getElementById('programPricing').value.trim();
  if(editingProgram){
    let p = programs.find(pr => pr.id === editingProgram);
    Object.assign(p, { name, description, image_url, image,pricing });
    editingProgram = null;
  } else {
    programs.push({ id: Date.now(), name, description, image_url, image,pricing });
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
  document.getElementById('programPricing').value = p.pricing;
  editingProgram = id;
  document.getElementById('programCancelBtn').style.display = "inline-block";
}
document.getElementById('programCancelBtn').onclick = function(){
  document.getElementById('programForm').reset(); editingProgram = null; this.style.display = "none";
};
function deleteProgram(id) {
  // programs = programs.filter(p => p.id !== id); renderPrograms();
  if (!confirm('Really delete this program?')) return;

  fetch(`https://localhost:7286/api/Programs/Delete/${id}`, {
    method: 'DELETE'
  })
  .then(response => {
    if (!response.ok) throw new Error("Failed to delete program");
    // Remove from local list and update table
    programs = programs.filter(p => p.id !== id);
    renderPrograms();
    alert("Program deleted.");
  })
  .catch(error => {
    alert(error.message);
  });
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
      <td>${p.pricing}</td>
      <td class="actions">
        <button onclick="editProgram(${p.id})">Edit</button>
        <button class="delete" onclick="deleteProgram(${p.id})">Delete</button>
        <button onclick="viewProgram(${p.id})">View</button>
      </td>
      
    </tr>`;
  });
}
// renderPrograms();
loadPrograms();



// Instructors CRUD (API-based like programs)
let editingInstructor = null;

function editInstructor(id) {
  let i = instructors.find(x => x.id === id);
  document.getElementById('instructorId').value = i.id;
  document.getElementById('instructorName').value = i.name;
  document.getElementById('instructorRole').value = i.role;
  document.getElementById('instructorPhone').value = i.phone;
  document.getElementById('instructorEmail').value = i.email;
  document.getElementById('instructorPhotoUrl').value = i.photoUrl || i.photo_url || ""; // Handle both field names
  editingInstructor = id;
  document.getElementById('instructorCancelBtn').style.display = "inline-block";
}

document.getElementById('instructorCancelBtn').onclick = function(){
  document.getElementById('instructorForm').reset(); 
  editingInstructor = null; 
  this.style.display = "none";
};

function deleteInstructor(id) {
  // instructors = instructors.filter(i => i.id !== id); renderInstructors();

  if (!confirm('Really delete this program?')) return;
  fetch(`https://localhost:7286/api/Instructor/Delete/${id}`,{
    method:'DELETE'
  })
  .then(response => {
    if(!response.ok){
      throw new Error('Failed to delete instructor');
    }

    // Update the local instructurs array or state after successful deletion
    instructors = instructors.filter(i => i.id != id);
    renderInstructors();
    alert("Instructor deleted.");
  })
  .catch(error => {
    console.error('Error:',error);
    // Optionally display an error message to the user
  })
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
        <button onclick="viewInstructor(${i.id})">View</button>
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
  
  const id = document.getElementById('highlightId').value.trim();
  const title = document.getElementById('highlightTitle').value.trim();
  const content = document.getElementById('highlightContent').value.trim();

  // Prepare the payload
  const payload = {title,content}
  let apiUrl,method;

  // Check for existence in local highlights array
  if(id){
    const exists = highlights.some(h => String(h.id) === id);
    if (exists){
      apiUrl = `https://localhost:7286/api/Highlights/Update/${id}`;
      method = 'PUT';
      payload.id = id; // Add id for backend if required
    } else {
      apiUrl = 'https://localhost:7286/api/Highlights/Create';
      method = 'POST';
    }
  } else {
    apiUrl = 'https://localhost:7286/api/Highlights/Create';
    method = 'POST';
  }

  fetch(apiUrl,{
    method: method,
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify(payload)
  })
    .then(async response => {
      if(!response.ok) throw new Error("Failed to save highlight");
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1){
        return await response.json();
      }
      return null;
    })
    .then(data => {
      loadHighlights(); // Refresh from backend
      document.getElementById('highlightForm').reset();
      document.getElementById('highlightCancelBtn').style.display = "none";
      editingHighlight = null;
      alert("Highlight saved!");
    })
    .catch(error => {
      alert("Error saving highlight info");
      console.error("Error:", error);
    });
}

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
  if (!confirm('Really delete this highlight?')) return;
  fetch(`https://localhost:7286/api/Highlights/Delete/${id}`, {
    method: 'DELETE'
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Failed to delete highlight');
    }
    // Remove the highlight locally if deletion was successful
    highlights = highlights.filter(h => h.id !== id);
    renderHighlights();
    alert("Highlights deleted.");
  })
  .catch(error => {
    console.error('Error:', error);
    // Optionally show an error message to the user here
  });
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

// showSection('dojo');

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

document.getElementById('viewDojoBtn').onclick = function() {
  // Only show if dojo is loaded
  if (!dojoInfo || !dojoInfo.name) {
    alert("No dojo information to display!");
    return;
  }
  // Build the readonly view
  let modalBody = `
    <h3>${dojoInfo.name || ""}</h3>
    ${dojoInfo.heroTitle ? `<b>Hero Title:</b> ${dojoInfo.heroTitle}<br>` : ""}
    ${dojoInfo.heroSubtitle ? `<b>Hero Subtitle:</b> ${dojoInfo.heroSubtitle}<br>` : ""}
    ${dojoInfo.heroImageURL ? `<img src='${dojoInfo.heroImageURL}' style='max-width:140px'><br>` : ""}
    ${dojoInfo.establishedDate ? `<b>Established:</b> ${dojoInfo.establishedDate}<br>` : ""}
    ${dojoInfo.description ? `<b>Description:</b><br>${dojoInfo.description}` : ""}
  `;
  document.getElementById('dojoModalBody').innerHTML = modalBody;
  document.getElementById('dojoModal').style.display = "flex";
};

// Modal close handler
document.getElementById('dojoModalClose').onclick = function() {
  document.getElementById('dojoModal').style.display = "none";
};
// Optional: close modal on outside click
document.getElementById('dojoModal').onclick = function(e) {
  if (e.target === this) this.style.display = "none";
};


document.getElementById('programForm').onsubmit = function (e) {
  e.preventDefault();

  const id = document.getElementById('programId').value.trim();
  const name = document.getElementById('programName').value.trim();
  const description = document.getElementById('programDescription').value.trim();
  const imageUrl = document.getElementById('programImageUrl').value.trim();
  const imageFile = document.getElementById('programImageBlob').files[0] || null;
  const pricing = document.getElementById('programPricing').value.trim();

   // Use FormData for file + text fields
  const formData = new FormData();
  formData.append("name", name);
  formData.append("description", description);
  formData.append("imageUrl", imageUrl); // if your backend wants this string field
  if (imageFile) formData.append("image", imageFile); // field name should match your API ('image')
  formData.append("pricing", pricing);

  

  let apiUrl, method;

  if (id) {
    // Potential update: check if program with this id exists in the list
    const prog = programs.find(p => p.id == id);
    if (prog) {
      apiUrl = `https://localhost:7286/api/Programs/Update/${id}`;
      method = 'PUT'; // Confirm with your backend if it wants PUT/POST
      formData.append("id", id);
    } else {
      // If somehow an id is filled but doesn't exist in memory, treat as new
      apiUrl = "https://localhost:7286/api/Programs/Create";
      method = 'POST';
    }
  } else {
    // No id present: always add new
    apiUrl = "https://localhost:7286/api/Programs/Create";
    method = 'POST';
  }

  fetch(apiUrl, {
    method: method,
    body:formData
  })
    .then(async response => {
      if (!response.ok) throw new Error("Failed to save program info");
        // Try to parse JSON only if there is content
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const text = await response.text();
        return text ? JSON.parse(text) : null;
        // return await response.json();
      }
      return null; // No JSON to parse (e.g., update returns 204 No Content)
    })
    .then(data => {
      // Update programs from backend (optional: reload or merge)
      loadPrograms(); // Should refresh the list via API
      document.getElementById('programForm').reset();
      document.getElementById('programCancelBtn').style.display = "none";
      editingProgram = null;
      alert("Program saved!");
    })
    .catch(error => {
      alert("Error saving program info");
      console.error("Error:", error);
    });
};

async function viewProgram(id) {
  try {
      const res = await fetch(`https://localhost:7286/api/Programs/Details/${id}`);
      if (!res.ok) throw new Error("Cannot load program details");
      const program = await res.json();

      let imageBlock = "";
      if (program.imageUrl && program.imageUrl !== "undefined") {
          imageBlock += `<img src="${program.imageUrl}" style="max-width:140px"><br>`;
      }
      if (program.image && program.image.length > 0) {
          const mimeType = program.imageMimeType || "image/jpeg";
          imageBlock += `<img src="data:${mimeType};base64,${program.image}" style="max-width:140px"><br>`;
      }

      let html = `<h3>${program.name}</h3>
          <p>${program.description || ""}</p>
          ${imageBlock}
          ${program.pricing ? `<b>Pricing:</b> ${program.pricing}` : ""}`;

      document.getElementById('programModalBody').innerHTML = html;
      document.getElementById('programModal').style.display = "flex";
  } catch(err) {
      alert("Error loading program info");
      console.error(err);
  }
}

async function viewInstructor(id) {
  try {
    const res = await fetch(`https://localhost:7286/api/Instructor/Details/${id}`);
    if (!res.ok) throw new Error("Cannot load instructor details");
    const instructor = await res.json();

    let imageBlock = "";
    if (instructor.photo_url && instructor.photo_url !== "undefined") {
      imageBlock += `<img src="${instructor.photo_url}" style="max-width:140px"><br>`;
    }
    if (instructor.photo && instructor.photo.length > 0) {
      const mimeType = instructor.photoMimeType || "image/jpeg";
      imageBlock += `<img src="data:${mimeType};base64,${instructor.photo}" style="max-width:140px"><br>`;
    }

    let html = `<h3>${instructor.name}</h3>
      <b>Role:</b> ${instructor.role}<br>
      <b>Email:</b> ${instructor.email}<br>
      <b>Phone:</b> ${instructor.phone}<br>
      ${imageBlock}`;

    document.getElementById('instructorModalBody').innerHTML = html;
    document.getElementById('instructorModal').style.display = "flex";
  } catch (err) {
    alert("Error loading instructor info");
    console.error(err);
  }
}
window.viewInstructor = viewInstructor;


document.getElementById('instructorForm').onsubmit = function(e){
  e.preventDefault();

  const id = document.getElementById('instructorId').value.trim();
  const name = document.getElementById('instructorName').value.trim();
  const role = document.getElementById('instructorRole').value.trim();
  const phone = document.getElementById('instructorPhone').value.trim();
  const email = document.getElementById('instructorEmail').value.trim();
  const photoUrl = document.getElementById('instructorPhotoUrl').value.trim();
  const photoFile = document.getElementById('instructorPhotoBlob').files[0] || null;

  // Use FormData for file + text fields
  const formData = new FormData();
  formData.append("name", name);
  formData.append("role", role);
  formData.append("phone", phone);
  formData.append("email", email);
  formData.append("photoUrl", photoUrl);
  if (photoFile) formData.append("photo", photoFile);

  let apiUrl, method;

  if (id) {
    // Check if instructor exists in local array
    const ins = instructors.find(i => i.id == id);
    if (ins) {
      apiUrl = `https://localhost:7286/api/Instructor/Update/${id}`;
      method = 'PUT';
      formData.append("id", id);
    } else {
      apiUrl = "https://localhost:7286/api/Instructor/Create";
      method = 'POST';
    }
  } else {
    apiUrl = "https://localhost:7286/api/Instructor/Create";
    method = 'POST';
  }

  fetch(apiUrl, {
    method: method,
    body: formData
  })
    .then(async response => {
      if (!response.ok) throw new Error("Failed to save instructor info");
      const contentType = response.headers.get("content-type");
      const text  =await response.text();
      if ((contentType && contentType.indexOf("application/json") !== -1)&& text) {
        try{
          return JSON.parse(text);
        } catch(e){
          console.error("JSON parse error:",e);
          return null; 
        }
        // return await response.json();
        // return JSON.parse(text);
      }
      return null;
    })
    .then(data => {
      loadInstructors(); // Refresh list from backend
      document.getElementById('instructorForm').reset();
      document.getElementById('instructorCancelBtn').style.display = "none";
      editingInstructor = null;
      alert("Instructor saved!");
    })
    .catch(error => {
      alert("Error saving instructor info");
      console.error("Error:", error);
    });
};



// Program Modal close handler
document.getElementById('programModalClose').onclick = function() {
  document.getElementById('programModal').style.display = "none";
};

// Optional: close modal when clicking outside the modal content
document.getElementById('programModal').onclick = function(e) {
  if (e.target === this) this.style.display = "none";
};

window.viewProgram = viewProgram;


document.getElementById('instructorModalClose').onclick = function() {
  document.getElementById('instructorModal').style.display = "none";
};
document.getElementById('instructorModal').onclick = function(e) {
  if (e.target === this) this.style.display = "none";
};

function showSection(sectionId) {
  console.log("showSection called with:", sectionId);
  document.querySelectorAll('.admin-section').forEach(sec => {
    sec.style.display = 'none';
  });
  document.getElementById(sectionId).style.display = 'block';
}


let admins = [];

function loadAdmins(){
  fetch("https://localhost:7286/api/admin")
    .then(response => response.json())
    .then(data =>{
      admins = Array.isArray(data) ? data : [];
      renderAdmins();
    })
    .catch(error =>{
      console.error("Error fetching admins:",error);
    });
}

function renderAdmins(){
  let tbody = document.querySelector('#adminsTable tbody');
  tbody.innerHTML = "";
  admins.forEach(a => {
    tbody.innerHTML += `<tr>
    <td>${a.id}</td>
    <td>${a.username}</td>
    <td class="actions">
      <button onclick="viewAdmin(${a.id})">View</button>
      <button onclick="editAdmin(${a.id})">Edit</button>
      <button class="delete" onclick="deleteAdmin(${a.id})">Delete</button>
    </td>
  </tr>`;  
  });
}

window.deleteAdmin = function(id) {
  if (!confirm("Really delete this admin?")) return;
  fetch(`https://localhost:7286/api/admin/delete/${id}`, {
    method: 'DELETE'
  })
  .then(async response => {
    if (!response.ok) {
      // Try to give user feedback.
      let err = await response.json().catch(() => ({}));
      alert("Failed to delete admin: " + (err.message || response.statusText));
      return;
    }
    // Remove from local array and re-render
    admins = admins.filter(a => a.id !== id);
    renderAdmins();
    alert('Admin deleted!');
    // showSection('admin'); why after commenting this code the style error disappears 
    if(admins.length > 0) {
      setAdminFormMode("edit", admins[0]);
    } else {
      setAdminFormMode("create");
    }
  })
  .catch(error => {
    console.error("Delete admin error:", error, error && error.stack);
    alert("Error: " + (error && error.message));
  });
};


window.viewAdmin = function(id) {
  const admin = admins.find(a => a.id === id);
  // You can add other admin details if you have them
  const modalBodyHtml = `
    <h3>Admin Info</h3>
    <b>ID:</b> ${admin.id}<br>
    <b>Username:</b> ${admin.username}
  `;
  document.getElementById('adminViewModalBody').innerHTML = modalBodyHtml;
  document.getElementById('adminViewModal').style.display = "flex";
};

// Modal close functionality
document.getElementById('adminViewModalClose').onclick = function() {
  document.getElementById('adminViewModal').style.display = "none";
};
document.getElementById('adminViewModal').onclick = function(e) {
  if (e.target === this) this.style.display = "none";
};


window.editAdmin = function(id) {
  // Find the admin in the admins array
  const admin = admins.find(a => a.id === id);
  if(!admin){
    console.warn(`Admin not found with id ${id}`);
    setAdminFormMode("create");
    return;
  }
  setAdminFormMode("edit", admin);
};

loadAdmins();





document.getElementById('adminForm').onsubmit = async function (e) {
  e.preventDefault();
  const username = document.getElementById('adminUsername').value.trim();

  if (admins.length === 0) {
    // Register new admin (use the create password field)
    const password = document.getElementById('adminCreatePassword').value.trim();
    let res = await fetch("https://localhost:7286/api/admin/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    if (res.ok) {
      await loadAdmins();
      setAdminFormMode("edit", admins[0]);
      showSection('admins'); // <-- keep on admin section
      alert("Admin registered!");
    } else {
      let err = await res.json().catch(() => ({}));
      alert("Error registering admin: " + (err.message || res.statusText));
    }
  } else {
    // Update admin
    const currentPassword = document.getElementById('adminCurrentPassword').value.trim();
    const newPassword = document.getElementById('adminNewPassword').value.trim();
    const token = localStorage.getItem("jwtToken");
    const current = admins[0];

    const body = {
      currentUsername: current.username,
      currentPassword: currentPassword,
      newUsername: username,
      newPassword: newPassword
    };

    let res = await fetch("https://localhost:7286/api/admin/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
      body: JSON.stringify(body)
    });

    if (res.ok) {
      await loadAdmins();
      setAdminFormMode("edit", admins[0]);
      showSection('admin'); // <-- keep on admin section
      alert("Admin updated!");
    } else {
      let err = await res.json().catch(() => ({}));
      alert("Error updating admin: " + (err.message || res.statusText));
    }
  }
};



function setAdminFormMode(mode, admin = null) {
  console.log({
    adminCreatePassword: document.getElementById('adminCreatePassword'),
    adminCurrentPassword: document.getElementById('adminCurrentPassword'),
    adminNewPassword: document.getElementById('adminNewPassword'),
    adminCancelBtn: document.getElementById('adminCancelBtn'),
    adminUsername: document.getElementById('adminUsername'),
  });

  console.log("setAdminFormMode called with mode:", mode, "admin:", admin);
  function safeSetDisplay(id,display){
   const el = document.getElementById(id);
   if (el) el.style.display = display; 
  }
  if (mode === "edit") {
    if(!admin){
      console.warn("No admin provided for edit mode");
      setAdminFormMode("create");
      return;
    }
    safeSetDisplay('adminCreatePassword','none');
    safeSetDisplay('adminCurrentPassword','block');
    safeSetDisplay('adminNewPassword','block');
    safeSetDisplay('adminCancelBtn','inline');

    const usernameEl = document.getElementById('adminUsername');
    if (usernameEl) usernameEl.value = admin.username || "";
    const currentPassEl = document.getElementById('adminCurrentPassword');
    if (currentPassEl) currentPassEl.value = "";
    const newPassEl = document.getElementById('adminNewPassword');
    if (newPassEl) newPassEl.value = "";
  
  } else if (mode === "create") {
    safeSetDisplay('adminCreatePassword', 'block');
    safeSetDisplay('adminCurrentPassword', 'none');
    safeSetDisplay('adminNewPassword', 'none');
    safeSetDisplay('adminCancelBtn', 'none');

    const usernameEl = document.getElementById('adminUsername');
    if (usernameEl) usernameEl.value = "";
    const createPassEl = document.getElementById('adminCreatePassword');
    if (createPassEl) createPassEl.value = "";


  }





  //   document.getElementById('adminCreatePassword').style.display = "none";
  //   document.getElementById('adminCurrentPassword').style.display = "block";
  //   document.getElementById('adminNewPassword').style.display = "block";
  //   document.getElementById('adminCancelBtn').style.display = "inline";
  //   document.getElementById('adminUsername').value = admin ? admin.username : "";
  //   document.getElementById('adminCurrentPassword').value = "";
  //   document.getElementById('adminNewPassword').value = "";
  // }
  // if (mode === "create") {
  //   document.getElementById('adminCreatePassword').style.display = "block";
  //   document.getElementById('adminCurrentPassword').style.display = "none";
  //   document.getElementById('adminNewPassword').style.display = "none";
  //   document.getElementById('adminCancelBtn').style.display = "none";
  //   document.getElementById('adminUsername').value = "";
  //   document.getElementById('adminCreatePassword').value = "";
  // }
}

function afterLoadAdmins() {
  if (admins.length > 0) {
    setAdminFormMode("edit", admins[0]);
  } else {
    setAdminFormMode("create");
  }
}

async function loadAdmins() {
  const response = await fetch("https://localhost:7286/api/admin");
  const data = await response.json(); // parse once!
  admins = Array.isArray(data) ? data : [];
  renderAdmins();
  afterLoadAdmins();
}

document.getElementById('adminCancelBtn').onclick = function() {
  afterLoadAdmins();
};
