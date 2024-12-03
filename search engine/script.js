// Fonction pour charger les données JSON à partir d'un fichier externe
async function loadMovies() {
    try {
      const response = await fetch('movies.json');
      if (!response.ok) {
        throw new Error('Erreur de chargement des films');
      }
      const data = await response.json();
      console.log("Films chargés :", data);  // Affiche les films dans la console
      window.movies = data;  // Stocke les films dans une variable globale
    } catch (error) {
      console.error('Erreur lors du chargement des films:', error);
    }
  }
  
  // Fonction pour obtenir l'état des cases à cocher
  function getActiveFilters() {
    return {
      byName: document.getElementById('searchByName').checked,
      byActor: document.getElementById('searchByActor').checked,
      byGenre: document.getElementById('searchByGenre').checked,
      byTag: document.getElementById('searchByTag').checked
    };
  }
  
  // Fonction pour effectuer la recherche
  function searchMovies() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    
    // Vérifie si les films sont chargés
    if (!window.movies) {
      console.log("Les films ne sont pas encore chargés");
      return;
    }
  
    const filters = getActiveFilters();
  
    const results = window.movies.filter(movie => {
      let matches = false;
      
      // Vérifie chaque critère actif
      if (filters.byName) {
        matches = matches || movie.nom.toLowerCase().includes(query);
      }
      if (filters.byActor) {
        const movieActors = movie.acteurs.join(', ').toLowerCase();
        matches = matches || movieActors.includes(query);
      }
      if (filters.byGenre) {
        const movieGenre = movie.genre.toLowerCase();
        matches = matches || movieGenre.includes(query);
      }
      if (filters.byTag) {
        const movieTags = movie.tags.join(' ').toLowerCase();  // Remplace la virgule par un espace
        matches = matches || movieTags.includes(query);
      }
  
      return matches;
    });
  
    displayResults(results);
  }
  
  // Fonction pour afficher les résultats de la recherche
  function displayResults(results) {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = ''; // Effacer les résultats précédents
  
    if (results.length === 0) {
      resultsContainer.innerHTML = '<p>Aucun film trouvé.</p>';
    } else {
      results.forEach(movie => {
        const resultItem = document.createElement('div');
        resultItem.classList.add('result-item');
  
        resultItem.innerHTML = `
          <h2>${movie.nom}</h2>
          <p><strong>Réalisateur :</strong> ${movie.réalisateur}</p>
          <p><strong>Genre :</strong> ${movie.genre}</p>
          <p><strong>Acteurs :</strong> ${movie.acteurs.join(', ')}</p>
          <p><strong>Description :</strong> ${movie.description}</p>
          <p><strong>Tags :</strong> 
            <ul class="tag-list">
              ${movie.tags.map(tag => `<li>${tag}</li>`).join('')}
            </ul>
          </p>
        `;
  
        resultsContainer.appendChild(resultItem);
      });
    }
  }
  
  // Charge les films dès que la page est prête
  window.onload = loadMovies;
  