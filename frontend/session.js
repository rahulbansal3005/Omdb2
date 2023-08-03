function goToSignup() {
  window.location.href = "signup.html"; // Replace with your signup page URL
}

// Function to handle login
async function handleLogin() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  };

  try {
    const response = await fetch("/api/login", requestOptions);
    const data = await response.json();

    // Save the JWT token to local storage or a cookie
    localStorage.setItem("token", data.token);

    // Redirect to home.html after login
    window.location.href = "home.html";
  } catch (error) {
    console.error("Error:", error);
    // Display error message to the user
  }
}

async function handleSignup() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  };

  try {
    const response = await fetch("/api/signup", requestOptions);
    const data = await response.json();
    console.log(data); // Display response message (optional)

    // Redirect to login page after successful signup (you can redirect to any other page)
    window.location.href = "/login.html"; // Replace 'login.html' with your login page URL
  } catch (error) {
    console.error("Error:", error);
    // Display error message to the user
  }
}

// Add event listener to the signup button
document.getElementById("signupBtn").addEventListener("click", handleSignup);
document.getElementById("loginBtn").addEventListener("click", handleLogin);
