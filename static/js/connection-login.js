document.getElementById("login-btn").addEventListener("click", async () => {
    const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;

    hideError("login"); // Cacher les erreurs avant la requête

    const response = await fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      window.location.href = "/static/index.html"; // Redirection vers /static/index.html
    } else {
      const data = await response.json();
      showError(data.detail, "login");
    }
  });