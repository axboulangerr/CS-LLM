
function checkConnection() {
    fetch("/check_connection", { method: 'GET' })
        .then(response => response.json())
        .then(data => {
            if (data.username) {
                username = data.username;
                document.getElementById("menu-title").textContent = data.username;
                document.getElementById("menu-links").innerHTML = `
                    <div class="menu" id="menu-links">
                      <a href="/static/index.html">Mon Espace</a>
                      <a href="/static/stats.html">Statistiques Général</a>
                      <a href="/static/stats.html">Classement</a>
                    </div>
                `;
                document.getElementById("login-link").textContent = 'Déconnexion';
                document.getElementById("login-link").href = '#';
                document.getElementById("login-link").onclick = () => showLogoutPopup();
            }
            else {
                window.location.href = "/static/login.html";
            }
        })
        .catch(err => console.error('Erreur lors de la vérification de la connexion:', err));
}

function showLogoutPopup() {
    $('#logout-modal').modal('show');
}

function logoutUser() {
    fetch("/logout", { method: 'POST' })
        .then(response => response.json())
        .then(data => {
            window.location.href = "/static/login.html";
            document.getElementById("menu-title").textContent = '';
            document.getElementById("menu-links").innerHTML = `
                <a href="/static/index.html">Accueil</a>
                <a href="/static/stats.html">Statistiques</a>
                <a href="/static/stats.html">Statistiques</a>

            `;
            document.getElementById("login-link").textContent = 'Connexion';
            document.getElementById("login-link").href = '/static/login.html';
            $('#logout-modal').modal('hide');
            window.location.href = "/static/login.html";
        })
        .catch(err => console.error('Erreur lors de la déconnexion:', err));
}
