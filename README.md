# Semantic Cache for Large Language Models (LLM) 🌐⚡

# scLLM - Project Structure 🚀

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

## 📚 Description
scLLM is a structured project that clearly separates essential components:
- **`data/`** 📊 : Data management (raw, preprocessed, predictions, etc.).
- **`docs/`** 📄 : Detailed documentation.
- **`logs/`** 🗒️ : Execution logs.
- **`models/`** 🤖 : Saved models.
- **`reports/`** 📊 : Analysis reports and visual results.
- **`src/`** 🏭️ : Source code organized by functionality (data management, models, visualization, etc.).
- **`tests/`** ✅ : Tests to ensure code stability.
- **`website/`** 🌐 : Web interface for interacting with the model (classification, result visualization, etc.).

## 📂 Project Structure
```plaintext
scLLM
├── README.md
├── data
│   ├── clean_raw
│   ├── metric
│   ├── prediction
│   ├── processed
│   ├── raw
│   └── temporary
├── docs
├── logs
├── models
├── reports
├── requirements
├── semantic
├── src
│   ├── data
│   ├── features
│   ├── models
│   ├── reports
│   ├── tools
│   └── visualization
├── tests
└── website
    └── web_classification
        ├── __pycache__
        ├── connexion.csv
        ├── highlighted_prompts.json
        ├── login.csv
        ├── main.py
        ├── prompts.csv
        ├── static
            ├── aide.html
            ├── css
            ├── img
            ├── index.html
            ├── js
            ├── login.html
            └── stats.html
```

## 🔧 Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/scLLM.git
   cd scLLM
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## 🌐 Launching the Web Service

### ▶️ Start the server
```bash
nohup uvicorn main:app --host 0.0.0.0 --port 7000 > output.log 2>&1 &
```

### ⏹️ Stop the server
```bash
kill $(pgrep -f "uvicorn main:app")
```

## 📌 Objectives
- **Optimize data and model management** 🔄
- **Improve scalability and result reuse** 🚀
- **Facilitate integration and visualization of analyses** 📊


