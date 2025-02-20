const nodes = new vis.DataSet([]);
const nodeData = {};
const wordOccurrences = {};

function nodeExists(word) {
  return nodes.get().some(node => node.label.toLowerCase() === word.toLowerCase());
}

function addYellowNodes() {
  dataStat.forEach(item => {
    let yellowNode = null;
    let greenWords = [];

    item.highlights.forEach(highlight => {
      const word = highlight.word;
      wordOccurrences[word] = (wordOccurrences[word] || 0) + 1;
      console.log(word)
      if (highlight.color === 'yellow') {
        yellowNode = highlight.word;
        
        if (!nodeExists(yellowNode)) {
          nodes.add({ 
            id: yellowNode, 
            label: yellowNode, 
            title: `Mot: ${yellowNode}`, 
            size: wordOccurrences[yellowNode] * 5
          });

          nodeData[yellowNode] = { words: [], count: 1 };
        } else {
          // Met à jour la taille si le nœud existe déjà
          nodes.update({ 
            id: yellowNode, 
            size: wordOccurrences[yellowNode] * 5 // Ajuste le facteur
          });

          nodeData[yellowNode].count++;
        }

        console.log("Nœud:", yellowNode, "Occurrences:", wordOccurrences[yellowNode]);
      }

      if (highlight.color === 'lightgreen' && yellowNode) {
        greenWords.push(highlight.word);
      }
    });

      if (yellowNode && greenWords.length > 0) {
        const existingGroup = nodeData[yellowNode].words.some(group =>
        group.every(word => greenWords.includes(word)) && greenWords.every(word => group.includes(word))
      );

      if (!existingGroup) {
        // Ajoute le groupe de mots verts si ce n'est pas déjà présent
        nodeData[yellowNode].words.push(greenWords);
      }
    }
  });
}


document.getElementById("search-input").addEventListener("input", function () {
  const searchQuery = this.value.toLowerCase();  // Récupérer la recherche en minuscules

  // Filtrer les nœuds pour ceux qui contiennent la chaîne de recherche dans leur label
  const filteredNodes = nodes.get().filter(node => node.label.toLowerCase().includes(searchQuery));

  // Créer un tableau d'IDs des nœuds filtrés
  const filteredNodeIds = filteredNodes.map(node => node.id);

  // Masquer ou afficher les nœuds en fonction de la recherche
  nodes.get().forEach(node => {
    const updatedNode = {
      id: node.id,
      hidden: !filteredNodeIds.includes(node.id)  // Masquer les nœuds qui ne sont pas dans le résultat de recherche
    };
    nodes.update(updatedNode);  // Met à jour chaque nœud avec l'attribut "hidden"
  });
});

const edges = new vis.DataSet([]);

const options = {
  nodes: {
    shape: "dot",
    size: 20,
    color: "#FFFF80",
    font: { size: 5, color: "#000000" },
    borderWidth: 2
  },
  edges: {
    width: 2,
    color: "#000000"
  },
  interaction: {
    hover: true
  },
  physics: {
    enabled: true, // Active la physique pour le placement des nœuds
    repulsion: {
      // Force de répulsion entre les nœuds
      nodeDistance: 10, // Distance minimale entre les nœuds
      springLength: 10, // Longueur des ressorts (distance cible)
      springConstant: 0.1, // Force du ressort
    },
    barnesHut: {
      // Amélioration des performances pour les grands réseaux
      gravitationalConstant: -2000, // Force gravitationnelle pour attirer les nœuds
      centralGravity: 0.3, // Attire les nœuds vers le centre
      springLength: 150, // Longueur des ressorts
      springConstant: 0.02 // Force des ressorts
    }
  }
};


const container = document.getElementById("network");
const data = { nodes, edges };
const network = new vis.Network(container, data, options);
network.setSize('100%', '1000px');

function showNodeNetwork(nodeId) {
  const nodeNetworkContainer = document.getElementById("node-network");
  let relatedNodes = [];

  if (nodeData[nodeId]) {
    // Crée un groupe de nœuds pour chaque tableau de mots verts
    nodeData[nodeId].words.forEach(group => {
      relatedNodes.push(`[${group.join(", ")}]`);
    });
    document.getElementById("node-occurrences").innerText = `Nombre d'occurrences : ${nodeData[nodeId].count}`;
  }

  const nodeList = relatedNodes.map((group, index) => ({ id: index + 1, label: group, title: `Mots: ${group}` }));
  const nodes = new vis.DataSet(nodeList);
  const edges = new vis.DataSet([]);

  const options = {
    nodes: { shape: "dot", size: 20, font: { size: 15, color: "#000000" }, borderWidth: 2, color:"#80FF00" },
    edges: { width: 2, color: "#000000" },
    interaction: { hover: true }
  };

  new vis.Network(nodeNetworkContainer, { nodes, edges }, options);
}


network.on("click", function (params) {
  if (params.nodes.length > 0) {
    const nodeId = params.nodes[0];
    const node = nodes.get(nodeId);
    document.getElementById("node-details").innerText = node.title;
    showNodeNetwork(nodeId);
    $("#node-modal").modal("show");
  }
});

