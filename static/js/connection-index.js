
function checkConnection() {
    fetch("http://0.0.0.0:7000/check_connection", { method: 'GET' })
        .then(response => response.json())
        .then(data => {
            if (data.username) {
                username = data.username;
                document.getElementById("menu-title").textContent = data.username;
                document.getElementById("menu-links").innerHTML = `
                    <div class="menu" id="menu-links">
                      <a href="http://0.0.0.0:7000/static/index.html">Mon Espace</a>
                      <a href="http://0.0.0.0:7000/static/stats.html">Statistiques Général</a>
                      <a href="http://0.0.0.0:7000/static/stats.html">Classement</a>
                    </div>
                `;
                document.getElementById("login-link").textContent = 'Déconnexion';
                document.getElementById("login-link").href = '#';
                document.getElementById("login-link").onclick = () => showLogoutPopup();
            }
        })
        .catch(err => console.error('Erreur lors de la vérification de la connexion:', err));
}

function showLogoutPopup() {
    $('#logout-modal').modal('show');
}

function logoutUser() {
    fetch("http://0.0.0.0:7000/logout", { method: 'POST' })
        .then(response => response.json())
        .then(data => {
            document.getElementById("menu-title").textContent = '';
            document.getElementById("menu-links").innerHTML = `
                <a href="http://0.0.0.0:7000/static/index.html">Accueil</a>
                <a href="http://0.0.0.0:7000/static/stats.html">Statistiques</a>
            `;
            document.getElementById("login-link").textContent = 'Connexion';
            document.getElementById("login-link").href = 'http://0.0.0.0:7000/static/login.html';
            $('#logout-modal').modal('hide');
            window.location.href = "http://0.0.0.0:7000/static/login.html";
        })
        .catch(err => console.error('Erreur lors de la déconnexion:', err));
}
