

function fetchPrompts() {
    fetch("/getPrompt")
        .then(response => response.json())
        .then(data => {
            prompts = data;
            console.log(prompts)
            loadRandomPrompt();
        })
        .catch(err => console.error('Erreur lors de la récupération des prompts:', err));
}

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
