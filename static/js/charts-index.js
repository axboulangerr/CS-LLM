function updateCharts() {
    const dailyCounts = {};
    const highlightCounts = { yellow: 0, lightgreen: 0 };
    const wordCounts = {};

    dataStat.forEach(item => {
        if (item.username === username) {
            const date = new Date(item.timestamp);
            const day = date.toISOString().split('T')[0];
            dailyCounts[day] = (dailyCounts[day] || 0) + 1;

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
        }
    });

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
