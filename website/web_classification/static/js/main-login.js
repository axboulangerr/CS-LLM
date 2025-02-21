document.getElementById("switch-to-register").addEventListener("click", () => {
    document.getElementById("login-form").style.display = "none";
    document.getElementById("register-form").style.display = "block";
  });

  // Basculer vers le formulaire de connexion
  document.getElementById("switch-to-login").addEventListener("click", () => {
    document.getElementById("register-form").style.display = "none";
    document.getElementById("login-form").style.display = "block";
  });