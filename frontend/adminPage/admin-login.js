document.getElementById("loginForm").onsubmit = async function(e) {
    e.preventDefault();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;
    const errorDiv = document.getElementById("loginError");
  
    // Replace this with API request in production!
    // Example: POST /api/login {username, password}
    if (username === "admin" && password === "admin123") {
      window.location.href = "admin.html"; // redirect to admin panel
    } else {
      errorDiv.textContent = "Invalid username or password.";
    }
  };
  