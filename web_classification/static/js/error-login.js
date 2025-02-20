    // Fonction pour afficher un message d'erreur
    function showError(message, formType) {
        const errorDiv = document.getElementById(formType + "-error");
        errorDiv.textContent = message;
        errorDiv.style.display = "block";
      }
  
      // Fonction pour cacher un message d'erreur
      function hideError(formType) {
        const errorDiv = document.getElementById(formType + "-error");
        errorDiv.style.display = "none";
      }