let prompts = [];
let username = null;
let history = [];
let selectedColor = null;
let currentHoveredWord = null;
let first = 1;
let highlightedWords = [];
let randomPrompt = null;
let dataStat = null;

window.onload = () => {
    checkConnection();
    fetchPrompts();
    fetchHighlightedPrompts();
    fetchAndDisplayHistory();
};

document.querySelector('.ui.button.blue').addEventListener('click', () => {
    saveHighlightedPrompt();
});