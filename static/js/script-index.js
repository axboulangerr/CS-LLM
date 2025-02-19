let prompts = [];
let username = null;
let history = [];
let selectedColor = null;
let currentHoveredWord = null;
let first = 1;
let highlightedWords = [];
let randomPrompt = null;
let dataStat = null;

function fetchHighlightedPrompts() {
    fetch("http://145.239.177.192:7000/get_highlighted_prompts")
        .then(response => response.json())
        .then(data => {
            dataStat = data.highlighted_prompts;
            updateCharts();
        })
        .catch(err => console.error('Erreur lors de la récupération des prompts surlignés:', err));
}

// Fonction pour récupérer les prompts depuis l'API
function fetchPrompts() {
    fetch("http://145.239.177.192:7000/getPrompt")
        .then(response => response.json())
        .then(data => {
            prompts = data;  // Sauvegarder les prompts récupérés
            loadRandomPrompt();  // Charger un prompt aléatoire après récupération
        })
        .catch(err => console.error('Erreur lors de la récupération des prompts:', err));
}

// Fonction pour vérifier la connexion de l'utilisateur en fonction de l'IP
function checkConnection() {
    fetch("http://145.239.177.192:7000/check_connection", { method: 'GET' })
        .then(response => response.json())
        .then(data => {
            if (data.username) {
                username = data.username;
                document.getElementById("menu-title").textContent = data.username;
                document.getElementById("menu-links").innerHTML = `
                    <div class="menu" id="menu-links">
                      <a href="http://145.239.177.192:7000/static/index.html">Mon Espace</a>
                      <a href="http://145.239.177.192:7000/static/stats.html">Statistiques Général</a>
                      <a href="http://145.239.177.192:7000/static/stats.html">Classement</a>
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
    fetch("http://145.239.177.192:7000/logout", { method: 'POST' })
        .then(response => response.json())
        .then(data => {
            document.getElementById("menu-title").textContent = '';
            document.getElementById("menu-links").innerHTML = `
                <a href="http://145.239.177.192:7000/static/index.html">Accueil</a>
                <a href="http://145.239.177.192:7000/static/stats.html">Statistiques</a>
            `;
            document.getElementById("login-link").textContent = 'Connexion';
            document.getElementById("login-link").href = 'http://145.239.177.192:7000/static/login.html';
            $('#logout-modal').modal('hide');
            window.location.href = "http://145.239.177.192:7000/static/login.html";
        })
        .catch(err => console.error('Erreur lors de la déconnexion:', err));
}

// Fonction pour séparer le texte en mots
function splitTextIntoWords(text) {
    return text.replace(/([a-zA-Z0-9]+)([.,!?]*)/g, (match, p1, p2) => {
        return `<span class="word">${p1}</span>${p2}`;
    }).split(' ').join(' ');
}

// Fonction pour gérer l'affichage du menu de surlignage
function showHighlightMenu(event) {
    const word = event.target;
    if (currentHoveredWord !== word) {
        currentHoveredWord = word;  // Enregistrer le mot survolé actuellement
        const menu = document.getElementById("highlight-menu");

        // Positionner le menu au-dessus du mot
        const wordRect = word.getBoundingClientRect();
        menu.style.top = `${wordRect.top - 30}px`;
        menu.style.left = `${wordRect.left}px`;
        menu.style.display = 'block';

        // Appliquer le surlignage lorsque l'utilisateur clique sur un cercle
        menu.querySelector('.yellow').onclick = () => highlightWord(word, 'yellow');
        menu.querySelector('.green').onclick = () => highlightWord(word, 'lightgreen');
    }
}

// Fonction pour appliquer le surlignage sur un mot
function highlightWord(word, color) {
    word.style.backgroundColor = color;
    highlightedWords.push({ word: word.innerText, color: color });  // Ajouter à l'état des surlignages
    currentHoveredWord = null;  // Réinitialiser l'état du mot après surlignage
    document.getElementById("highlight-menu").style.display = 'none';  // Cacher le menu après surlignage
    checkButtonState();  // Vérifier si le bouton peut être activé
}

// Fonction pour retirer le surlignage d'un mot
function removeHighlight() {
    if (currentHoveredWord) {
        currentHoveredWord.style.backgroundColor = '';  // Retirer le surlignage
        currentHoveredWord = null;  // Réinitialiser l'état du mot
        document.getElementById("highlight-menu").style.display = 'none';  // Cacher le menu après retrait
        checkButtonState();  // Vérifier si le bouton peut être activé
    }
}

// Fonction pour masquer le menu de surlignage si la souris quitte le mot
function hideHighlightMenu(event) {
    const menu = document.getElementById("highlight-menu");
    if (currentHoveredWord === event.target) {
        return;  // Ne pas masquer si le même mot est encore survolé
    }
    menu.style.display = 'none';
    currentHoveredWord = null;  // Réinitialiser l'état
}

// Fonction pour charger un prompt et l'afficher
function loadRandomPrompt() {
    if (prompts.length === 0) return;
    if (first === 0) {
        addToHistory(randomPrompt);
    }
    const promptContainer = document.getElementById("prompt");

    randomPrompt = prompts[Math.floor(Math.random() * 5010)];

    // Afficher le prompt
    promptContainer.innerHTML = `
        <h3>${randomPrompt.Prompt_Type}</h3>
        <p><strong>Prompt:</strong> ${splitTextIntoWords(randomPrompt.Prompt)}</p>
    `;
    // Ajouter un écouteur pour chaque mot pour afficher le menu de surlignage
    const words = promptContainer.querySelectorAll('.word');
    words.forEach(word => {
        word.addEventListener('mouseover', showHighlightMenu);
        word.addEventListener('mouseout', hideHighlightMenu);
    });
    first = 0;
}

// Ajouter un prompt à l'historique
function addToHistory(prompt) {
    history.unshift({ prompt: prompt, highlights: [...highlightedWords] });  // Ajouter l'état des surlignages à l'historique
    console.log(history);
    if (history.length > 15) {
        history.pop();  // Limiter l'historique à 15 éléments
    }
    renderHistory();
}

// Rendre l'historique des prompts
function renderHistory() {
    const historyList = document.getElementById("history-list");
    historyList.innerHTML = '';  

    history.forEach(item => {
        const historyItem = document.createElement('div');
        historyItem.classList.add('history-item');
        
        // Séparer le texte du prompt en mots
        console.log(item);
        try {
            let highlightedPrompt = splitTextIntoWords(item.prompt);
            // Appliquer les surlignages spécifiques à cet élément d'historique
            item.highlights.forEach(highlight => {
                const wordToHighlight = new RegExp(`\\b${highlight.word}\\b`, 'g');
                highlightedPrompt = highlightedPrompt.replace(wordToHighlight, `<span style="background-color:${highlight.color}">${highlight.word}</span>`);
            });

            // Afficher le prompt avec le surlignage
            historyItem.innerHTML = `<p>${highlightedPrompt}</p>`;
            historyList.appendChild(historyItem);
        } catch {
            let highlightedPrompt = splitTextIntoWords(item.prompt.Prompt);
            // Appliquer les surlignages spécifiques à cet élément d'historique
            item.highlights.forEach(highlight => {
                const wordToHighlight = new RegExp(`\\b${highlight.word}\\b`, 'g');
                highlightedPrompt = highlightedPrompt.replace(wordToHighlight, `<span style="background-color:${highlight.color}">${highlight.word}</span>`);
            });

            // Afficher le prompt avec le surlignage
            historyItem.innerHTML = `<span>${item.prompt.Prompt_Type}</span><br><p>${highlightedPrompt}</p>`;
            historyList.appendChild(historyItem);
        }
    });
}

// Fonction pour vérifier si le bouton peut être activé
function checkButtonState() {
    const button = document.querySelector('.ui.button.blue');
    const hasYellow = highlightedWords.some(word => word.color === 'yellow');
    const hasGreen = highlightedWords.some(word => word.color === 'lightgreen');
    if (hasYellow || hasGreen) {
        button.disabled = false;
    }
}

function saveHighlightedPrompt() {
    const highlightedPrompt = {
        prompt: randomPrompt.Prompt,  // Le texte du prompt
        highlights: highlightedWords,  // Les surlignages
        username: username || 'unknown',  // Le nom d'utilisateur si disponible
        timestamp: new Date().toISOString()
    };

    fetch("http://145.239.177.192:7000/save_highlighted_prompt", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(highlightedPrompt),
    })
    .then(response => response.json())
    .then(data => {
        highlightedWords = []; // Réinitialiser après l'enregistrement
        document.querySelector('.ui.button.blue').disabled = true; // Désactiver le bouton
        fetchHighlightedPrompts(); // Rafraîchir les stats
    })
    .catch(error => console.error("Erreur lors de la sauvegarde du prompt surligné:", error));
}

function fetchAndDisplayHistory() {
    try {
        fetch("http://145.239.177.192:7000/get_highlighted_prompts")
        .then(response => response.json())
        .then(data => {
            dataStat = data.highlighted_prompts;
            // Filtrer les prompts par username
            console.log(username);
            let userPrompts = dataStat.filter(item => item.username === username);

            // Trier par date décroissante (plus récent en premier)
            console.log(userPrompts);
            userPrompts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

            // Garder uniquement les 15 derniers
            let latestPrompts = userPrompts.slice(0, 15);
            console.log(latestPrompts);
            // Affichage des prompts dans l'historique
            let historyContainer = document.getElementById("history-list");

            latestPrompts.forEach(prompt => {
                console.log(prompt);
                addToHistory(prompt.prompt);
            });
        })
        .catch(err => console.error('Erreur lors de la récupération des prompts surlignés:', err));                

    } catch (error) {
        console.error("Erreur lors de la récupération des prompts :", error);
    }
}

function updateCharts() {
    // Nombre de prompts traités par jour
    const dailyCounts = {}; // Pour compter les prompts par jour
    const highlightCounts = { yellow: 0, lightgreen: 0 };
    const wordCounts = {};  // Pour compter les occurrences de chaque mot coloré

    // Analyser les données pour remplir les compteurs
    dataStat.forEach(item => {
        if (item.username === username) {
            const date = new Date(item.timestamp);
            const day = date.toISOString().split('T')[0];
            dailyCounts[day] = (dailyCounts[day] || 0) + 1;

            // Compter les surlignages et les mots colorés
            item.highlights.forEach(highlight => {
                if (highlight.color === 'yellow') {
                    highlightCounts.yellow++;
                } else if (highlight.color === 'lightgreen') {
                    highlightCounts.lightgreen++;
                }

                // Compter les mots colorés
                const word = highlight.word.toLowerCase();
                if (!wordCounts[word]) {
                    wordCounts[word] = { yellow: 0, lightgreen: 0 };
                }
                wordCounts[word][highlight.color]++;
            });
        }
    });

    // Graphique de nombre de prompts traités par jour (Bar chart)
    const dailyLabels = Object.keys(dailyCounts);
    const dailyData = Object.values(dailyCounts);
    const dailyPromptsChart = new Chart(document.getElementById('dailyPromptsChart'), {
        type: 'bar',
        data: {
            labels: dailyLabels,
            datasets: [{
                label: 'Prompts traités par jour',
                data: dailyData,
                backgroundColor: '#4CAF50',
                borderColor: '#388E3C',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: true }
            }
        }
    });

    // Graphique de ratio yellow et green (Doughnut chart)
    const highlightRatioChart = new Chart(document.getElementById('highlightRatioChart'), {
        type: 'doughnut',
        data: {
            labels: ['Demande', 'Précision'],
            datasets: [{
                data: [highlightCounts.yellow, highlightCounts.lightgreen],
                backgroundColor: ['yellow', 'lightgreen'],
                borderColor: ['#FFA500', '#32CD32'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true
        }
    });

    // Graphique des 10 mots les plus colorés
    const sortedWords = Object.keys(wordCounts)
        .map(word => ({
            word,
            yellow: wordCounts[word].yellow,
            lightgreen: wordCounts[word].lightgreen,
            total: wordCounts[word].yellow + wordCounts[word].lightgreen
        }))
        .sort((a, b) => b.total - a.total)
        .slice(0, 10);

    const wordsLabels = sortedWords.map(item => item.word);
    const wordsData = sortedWords.map(item => item.total);
    const wordsColors = sortedWords.map(item => item.yellow > item.lightgreen ? 'yellow' : 'lightgreen');

    const wordsChart = new Chart(document.getElementById('customChart'), {
        type: 'bar',
        data: {
            labels: wordsLabels,
            datasets: [{
                label: 'Mots les plus colorés',
                data: wordsData,
                backgroundColor: wordsColors,
                borderColor: wordsColors.map(color => color === 'yellow' ? '#FFA500' : '#32CD32'),
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}

document.querySelector('.ui.button.blue').addEventListener('click', () => {
    saveHighlightedPrompt();
});

window.onload = () => {
    checkConnection();
    console.log(username);
    fetchPrompts();
    fetchHighlightedPrompts();
    fetchAndDisplayHistory();
};
