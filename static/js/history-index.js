
function addToHistory(prompt) {
    history.unshift({ prompt: prompt, highlights: [...highlightedWords] });  // Ajouter l'état des surlignages à l'historique
    console.log(history);
    if (history.length > 15) {
        history.pop();  // Limiter l'historique à 15 éléments
    }
    renderHistory();
}

function splitTextIntoWords(text) {
    return text.replace(/([a-zA-Z0-9]+)([.,!?]*)/g, (match, p1, p2) => {
        return `<span class="word">${p1}</span>${p2}`;
    }).split(' ').join(' ');
}

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
            historyItem.innerHTML = `<p>${highlightedPrompt}</p>`;
            historyList.appendChild(historyItem);
        }
    });
}

function fetchAndDisplayHistory() {
    try {
        fetch("/get_highlighted_prompts")
        .then(response => response.json())
        .then(data => {
            dataStat = data.highlighted_prompts;
            // Filtrer les prompts par username
            let userPrompts = dataStat.filter(item => item.username === username);

            // Trier par date décroissante (plus récent en premier)
            userPrompts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

            // Garder uniquement les 15 derniers
            let latestPrompts = userPrompts.slice(0, 15);
            // Affichage des prompts dans l'historique
            let historyContainer = document.getElementById("history-list");

            latestPrompts.forEach(prompt => {
                addToHistory(prompt.prompt);
            });
        })
        .catch(err => console.error('Erreur lors de la récupération des prompts surlignés:', err));                

    } catch (error) {
        console.error("Erreur lors de la récupération des prompts :", error);
    }
}