

function checkButtonState() {
    const button = document.querySelector('.ui.button.blue');
    const hasYellow = highlightedWords.some(word => word.color === 'yellow');
    const hasGreen = highlightedWords.some(word => word.color === 'lightgreen');
    if (hasYellow || hasGreen) {
        button.disabled = false;
    }
}

function showHighlightMenu(event) {
    const word = event.target;
    if (currentHoveredWord !== word) {
        currentHoveredWord = word; 
        const menu = document.getElementById("highlight-menu");

        const wordRect = word.getBoundingClientRect();
        menu.style.top = `${wordRect.top - 30}px`;
        menu.style.left = `${wordRect.left}px`;
        menu.style.display = 'block';

        menu.querySelector('.yellow').onclick = () => highlightWord(word, 'yellow');
        menu.querySelector('.green').onclick = () => highlightWord(word, 'lightgreen');
    }
}

function highlightWord(word, color) {
    word.style.backgroundColor = color;
    highlightedWords.push({ word: word.innerText, color: color });  
    currentHoveredWord = null; 
    document.getElementById("highlight-menu").style.display = 'none';  
    checkButtonState();  
}

function hideHighlightMenu(event) {
    const menu = document.getElementById("highlight-menu");
    if (currentHoveredWord === event.target) {
        return;  
    }
    menu.style.display = 'none';
    currentHoveredWord = null;  
}

function saveHighlightedPrompt() {
    const highlightedPrompt = {
        prompt: randomPrompt.Prompt,  // Le texte du prompt
        highlights: highlightedWords,  // Les surlignages
        username: username || 'unknown',  // Le nom d'utilisateur si disponible
        timestamp: new Date().toISOString(),
        response: randomPrompt.Response
    };

    fetch("/save_highlighted_prompt", {
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

function removeHighlight() {
    if (currentHoveredWord) {
        currentHoveredWord.style.backgroundColor = '';  // Retirer le surlignage
        currentHoveredWord = null;  // Réinitialiser l'état du mot
        document.getElementById("highlight-menu").style.display = 'none';  // Cacher le menu après retrait
        checkButtonState();  // Vérifier si le bouton peut être activé
    }
}

function fetchHighlightedPrompts() {
    fetch("/get_highlighted_prompts")
        .then(response => response.json())
        .then(data => {
            dataStat = data.highlighted_prompts;
            updateCharts();
            addYellowNodes();
        })
        .catch(err => console.error('Erreur lors de la récupération des prompts surlignés:', err));
}