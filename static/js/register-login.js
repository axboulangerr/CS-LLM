document.getElementById("register-btn").addEventListener("click", async () => {
    const username = document.getElementById("register-username").value;
    const password = document.getElementById("register-password").value;

    hideError("register"); // Cacher les erreurs avant la requête


    const response = await fetch('/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
<<<<<<< HEAD
      window.location.href = "http://0.0.0.0:7000/static/index.html"; // Redirection vers http://0.0.0.0:7000/static/index.html
=======
      console.log("Inscription réussie");
      window.location.href = "/static/index.html"; // Redirection vers /static/index.html
>>>>>>> f36a9eb8e6cf1e4445db1bbaa17cda749b6b6317
    } else {
      const data = await response.json();
      showError(data.detail.split(':',2), "register");
    }
  });