// document.getElementById("loginForm").onsubmit = async function(e) {
//     e.preventDefault();
//     const username = document.getElementById("username").value.trim();
//     const password = document.getElementById("password").value;
//     const errorDiv = document.getElementById("loginError");
  
//     // Replace this with API request in production!
//     // Example: POST /api/login {username, password}
//     if (username === "admin" && password === "admin123") {
//       window.location.href = "admin.html"; // redirect to admin panel
//     } else {
//       errorDiv.textContent = "Invalid username or password.";
//     }
//   };

document.getElementById("loginForm").onsubmit = async function(e) {
  e.preventDefault();
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;
  const errorDiv = document.getElementById("loginError");
  errorDiv.textContent = "";

  // API request to login endpoint
  fetch("https://localhost:7286/api/admin/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  })
    .then(res => res.json())
    .then(data => {
      if(data.token) {
        // Store token for future authenticated requests
        localStorage.setItem("jwtToken", data.token);
        // Optionally, store admin username if needed:
        localStorage.setItem("adminUsername", username);
        window.location.href = "admin.html"; // redirect to admin panel/dashboard
      } else {
        errorDiv.textContent = data.message || "Invalid username or password.";
      }
    })
    .catch(error => {
      errorDiv.textContent = "Server error. Please try again later.";
      console.error("Login error:", error);
    });
};
