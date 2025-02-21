# Semantic Cache for Large Language Models (LLM) 🌐⚡

# scLLM - Structure du Projet 🚀

## 📖 Description
scLLM est un projet structuré permettant de séparer clairement les différentes composantes essentielles :
- **`data/`** 📊 : Gestion des données (brutes, prétraitées, prédictions, etc.).
- **`docs/`** 📄 : Documentation détaillée.
- **`logs/`** 📝 : Logs d'exécution.
- **`models/`** 🤖 : Modèles sauvegardés.
- **`reports/`** 📈 : Rapports d'analyse et résultats visuels.
- **`src/`** 🏗️ : Code source organisé par fonctionnalités (gestion des données, modèles, visualisation, etc.).
- **`tests/`** ✅ : Tests pour garantir la stabilité du code.
- **`website/`** 🌍 : Interface web pour interagir avec le modèle (classification, visualisation des résultats, etc.).

---

## 📂 Arborescence du projet
```plaintext
scLLM
├── README.md
├── data
│   ├── clean_raw        # Données nettoyées mais non transformées
│   ├── metric           # Résultats des métriques d'évaluation
│   ├── prediction       # Prédictions générées par les modèles
│   ├── processed        # Données prétraitées prêtes pour l'entraînement
│   ├── raw              # Données brutes non traitées
│   └── temporary        # Fichiers temporaires générés pendant le traitement
├── docs                 # Documentation du projet
├── logs                 # Fichiers de logs générés pendant l'exécution
├── models               # Modèles entraînés et sauvegardés
├── reports              # Rapports générés (visualisation, analyse, etc.)
├── requierements        # Dépendances et configurations requises
├── semantic             # Informations liées à la sémantique et aux embeddings
├── src                  # Code source principal du projet
│   ├── data             # Scripts de gestion et de transformation des données
│   ├── features         # Extraction et ingénierie des caractéristiques
│   ├── models          # Définition, entraînement et évaluation des modèles
│   ├── reports         # Génération de rapports et visualisations
│   ├── tools           # Outils auxiliaires et utilitaires
│   └── visualisation   # Scripts de visualisation des résultats
├── tests                # Tests unitaires et d'intégration
└── website              # Interface web pour l'exploitation du modèle
    └── web_classification
        ├── __pycache__  # Fichiers compilés Python
        ├── connexion.csv             # Historique des connexions
        ├── highlighted_prompts.json  # Prompts mis en évidence
        ├── login.csv                 # Informations de connexion
        ├── main.py                   # Script principal du site web
        ├── prompts.csv               # Prompts utilisés
        └── static                    # Fichiers statiques (HTML, CSS, JS, images)
            ├── aide.html              # Page d'aide
            ├── css                    # Fichiers CSS pour le style
            │   ├── styles-index.css
            │   ├── styles-login.css
            │   └── styles-stats.css
            ├── img                    # Images du site
            │   └── aide.png
            ├── index.html             # Page d'accueil
            ├── js                     # Scripts JavaScript pour l'interactivité
            │   ├── charts-index.js
            │   ├── charts-stats.js
            │   ├── connection-index.js
            │   ├── connection-login.js
            │   ├── error-login.js
            │   ├── highlighting-index.js
            │   ├── highlighting-stats.js
            │   ├── history-index.js
            │   ├── main-index.js
            │   ├── main-login.js
            │   ├── main-stats.js
            │   ├── network-stats.js
            │   ├── prompts-index.js
            │   └── register-login.js
            ├── login.html             # Page de connexion
            └── stats.html             # Page des statistiques
```

---

## 🔧 Installation

Pour installer et utiliser le projet, suivez ces étapes :

1. Clonez le dépôt :
   ```bash
   git clone https://github.com/your-username/scLLM.git
   cd scLLM
   ```

2. Installez les dépendances :
   ```bash
   pip install -r requirements.txt
   ```

---

## 🌍 Lancement du service web

### ▶️ Démarrer le serveur
```bash
nohup uvicorn main:app --host 0.0.0.0 --port 7000 > output.log 2>&1 &
```

### ⏹️ Arrêter le serveur
```bash
kill $(pgrep -f "uvicorn main:app")
```

---

## 📌 Objectifs
- **Optimiser la gestion des données et des modèles** 🔄
- **Améliorer la scalabilité et la réutilisation des résultats** 🚀
- **Faciliter l'intégration et la visualisation des analyses** 📊

Ce README a été conçu pour structurer et clarifier l'architecture du projet **scLLM**. N'hésitez pas à proposer des améliorations ou des ajouts ! 💡


## Overview 🚀

The increasing size of large language models (LLMs) has resulted in significant computational costs, making their deployment at scale challenging. This project explores the hypothesis that a semantic cache could reduce these costs by efficiently reusing previously generated responses for semantically similar queries. Unlike traditional caching methods that rely on exact matches, our approach uses vector representations and semantic similarity measures to identify when precomputed responses can be reused. This method aims not only to improve computational efficiency but also to maintain the quality of responses. Future experimental evaluations will be necessary to test this hypothesis and assess the impact of the semantic cache on inference time and the overall performance of LLMs.

## Motivation 💡

Large Language Models (LLMs) are deep neural networks pre-trained on vast amounts of textual data. These models are capable of understanding, generating, and transforming text based on the knowledge they have learned. LLMs are widely used in a variety of applications, such as machine translation, text generation, and question answering.

The performance of an LLM largely depends on the formulation of the input prompt, as it influences how the model interprets and generates its output. Therefore, optimizing how prompts are managed, particularly for similar prompts, is key to improving LLM performance.

In this project, we hypothesize that a semantic cache could efficiently manage similar prompts, improving the overall computational efficiency of LLMs without compromising the quality of the responses.

## Key Concepts 🔑

### Prompts 📝
A prompt is the input sequence of text provided to the model to guide its response. It could be a question, instruction, or context. The way a prompt is structured can greatly influence the model's understanding and output. For example:

- **Example Prompt**: "What is the weather in Paris?"
  
The performance of an LLM is highly dependent on how the prompt is formulated, as it determines how the model interprets the query and generates a response.

### Semantic Caching 💾
Semantic caching is the process of reusing responses that are generated for semantically similar queries. Instead of matching exact strings (as in traditional caching), semantic caching uses vector embeddings of the prompts and calculates semantic similarity to identify opportunities for reusing responses.

### Request vs. Precision 🎯
In our approach, we distinguish two main components in a prompt: **Request** and **Precision**.

- **Request**: This is the core question or instruction being asked to the model. It is the part that directly queries the model to get an answer. For example, in the prompt "What is the weather in Paris today?", the request is "What is the weather?".
  
- **Precision**: This refers to additional information that helps to refine or specify the request. It helps make the answer more accurate. In the same example, "in Paris today" represents the precision that contextualizes the request.

Understanding this distinction helps us design the semantic cache, which can effectively identify when the same request (but with different precisions) has been answered previously, allowing the system to reuse answers efficiently.

## Approach 🛠️

The core idea is to use semantic representations (such as vector embeddings from transformer models like BERT or GPT) to encode prompts. When a new prompt is received, we compute its vector representation and compare it to those stored in the cache using a similarity measure like cosine similarity.

If a sufficiently similar prompt exists in the cache, the system can retrieve and return the precomputed response. If no similar prompt is found, the system generates a new response and stores both the prompt and response for future reuse.

### Key Components 🔧
1. **Vectorization of Prompts**: The input prompts are transformed into vector embeddings using a pre-trained model (e.g., BERT or GPT).
2. **Similarity Calculation**: For every incoming prompt, we calculate its similarity with previously cached prompts using a similarity metric (e.g., cosine similarity).
3. **Caching Mechanism**: If the similarity between the new prompt and an existing one exceeds a predefined threshold, the cached response is reused. Otherwise, the model generates a new response and stores it.
4. **Precision Handling**: The system distinguishes between the request and the precision of the prompt to handle subtle variations in context, ensuring that reusing cached responses doesn’t lead to irrelevant or inaccurate answers.

## Objectives 🎯
- **Improve Computational Efficiency**: By reusing previously generated responses, we can reduce the computational overhead associated with generating responses for similar prompts.
- **Maintain Response Quality**: Ensure that the reused responses are still relevant and accurate by considering the precision in each prompt.
- **Reduce Inference Time**: Decrease the amount of time spent generating responses by leveraging a cache of precomputed answers.


