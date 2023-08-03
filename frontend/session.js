function goToSignup() {
  window.location.href = "signup.html";
}

function goToLogin() {
  window.location.href = "login.html";
}
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
    const response = await fetch(
      "http://127.0.0.1:3000/api/login",
      requestOptions
    );
    const data = await response.json();

    localStorage.setItem("token", data.token);

    window.location.href = "/frontend/index.html";
  } catch (error) {
    console.error("Error:", error);
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
    const response = await fetch(
      "http://127.0.0.1:3000/api/signup",
      requestOptions
    );
    console.log(response);
    const data = await response.json();
    console.log(data);

    window.location.href = "/frontend/login.html";
  } catch (error) {
    console.error("Error:", error);
  }
}
