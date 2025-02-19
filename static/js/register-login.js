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
      console.log("Inscription réussie");
      window.location.href = "/static/index.html"; // Redirection vers /static/index.html
    } else {
      const data = await response.json();
      console.log(data)
      showError(data.detail.split(':',2), "register");
    }
  });