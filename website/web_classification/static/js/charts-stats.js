function updateCharts() {
    // Initialisation des compteurs
    const dailyCounts = {};
    const highlightCounts = { yellow: 0, lightgreen: 0 };
    const wordCounts = {};
    const weeklyElementsCounts = { Monday: 0, Tuesday: 0, Wednesday: 0, Thursday: 0, Friday: 0, Saturday: 0, Sunday: 0 }; // Comptage par jour de la semaine

    // Traitement des données
    dataStat.forEach(item => {
        const date = new Date(item.timestamp);
        const day = date.toISOString().split('T')[0];
        dailyCounts[day] = (dailyCounts[day] || 0) + 1;
        // Calculer le jour de la semaine pour chaque élément
        const weekDay = date.toLocaleString('en-US', { weekday: 'long' }); // Obtient le nom complet du jour
        weeklyElementsCounts[weekDay] = (weeklyElementsCounts[weekDay] || 0) + item.highlights.length; // Utilisation des highlights pour le comptage

        item.highlights.forEach(highlight => {
            if (highlight.color === 'yellow') {
                highlightCounts.yellow++;
            } else if (highlight.color === 'lightgreen') {
                highlightCounts.lightgreen++;
            }
            const word = highlight.word.toLowerCase();
            if (!wordCounts[word]) {
                wordCounts[word] = { yellow: 0, lightgreen: 0 };
            }
            wordCounts[word][highlight.color]++;
        });
    });

    // Graphique des prompts traités par jour
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

    // Graphique du nombre d'éléments traités par jour de la semaine
    const weeklyLabels = Object.keys(weeklyElementsCounts);
    const weeklyData = Object.values(weeklyElementsCounts);
    const weeklyElementsChart = new Chart(document.getElementById('weeklyElementsChart'), {
        type: 'line',
        data: {
            labels: weeklyLabels,
            datasets: [{
                label: 'Éléments traités par jour de la semaine',
                data: weeklyData,
                fill: false,
                borderColor: '#2196F3',
                tension: 0.1,
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: true }
            }
        }
    });

    // Graphique du ratio des surlignages
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
