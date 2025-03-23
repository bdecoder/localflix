document.addEventListener('DOMContentLoaded', function () {
    const searchQuery = document.getElementById('search-query');
    const searchResultsContainer = document.getElementById('search-results');
    const searchByFilm = document.getElementById('search-by-film');
    const searchByCollection = document.getElementById('search-by-collection');
    const filterOptions = document.getElementById('filter-options');
    const searchByName = document.getElementById('search-by-name');
    const searchByTag = document.getElementById('search-by-tag');
    const searchByCategory = document.getElementById('search-by-category');
    const searchByDirector = document.getElementById('search-by-director');
    const searchByActors = document.getElementById('search-by-actors');
    let debounceTimer;

    // Fonction de recherche
    function search(query, isCollectionSearch) {
        console.log("DEBUG: Recherche en cours pour : " + query);

        if (!query.trim()) {
            searchResultsContainer.style.display = 'none';
            return;
        }

        searchResultsContainer.style.display = 'block';

        const fileToFetch = isCollectionSearch ? 'images.json' : 'films.json';
        fetch(fileToFetch)
            .then(response => response.json())
            .then(data => {
                console.log("DEBUG: Données chargées:", data);
                const searchTerms = query.toLowerCase().split(/\s+/);

                const filteredResults = data.filter(item => {
                    let matches = true;
                    if (searchByName.checked) {
                        matches = matches && searchTerms.every(term => item.title.toLowerCase().includes(term));
                    }

                    if (searchByTag.checked) {
                        matches = matches && searchTerms.every(term => item.tags && item.tags.some(tag => tag.toLowerCase().includes(term)));
                    }

                    if (searchByCategory.checked) {
                        matches = matches && searchTerms.every(term => item.category && item.category.toLowerCase().includes(term));
                    }

                    if (searchByDirector.checked) {
                        if (item.director) {
                            matches = matches && searchTerms.every(term => item.director.toLowerCase().includes(term));
                        } else {
                            matches = false;
                        }
                    }

                    if (searchByActors.checked) {
                        if (item.actors && item.actors.length > 0) {
                            matches = matches && searchTerms.every(term => item.actors.some(actor => actor.toLowerCase().includes(term)));
                        } else {
                            matches = false;
                        }
                    }

                    return matches;
                });

                console.log("DEBUG: Résultats filtrés:", filteredResults);

                displaySearchResults(filteredResults, isCollectionSearch);
            })
            .catch(error => {
                console.error('Erreur lors du chargement des données:', error);
            });
    }

    // Fonction d'affichage des résultats
    function displaySearchResults(results, isCollectionSearch) {
        searchResultsContainer.innerHTML = '';
        if (results.length === 0) {
            searchResultsContainer.innerHTML = '<p>Aucun résultat trouvé</p>';
            return;
        }

        results.forEach(result => {
            const resultElement = document.createElement('div');
            resultElement.classList.add('search-result');

            const resultLink = document.createElement('a');
            resultLink.href = isCollectionSearch ? `collection.html?id=${result.id}` : `viewer.html?id=${result.id}`;
            resultLink.classList.add('search-result-link');

            const previewImage = isCollectionSearch ? result.images[0] : result.thumbnail;

            resultLink.innerHTML = `
                <img src="${previewImage}" alt="${result.title}" class="result-thumbnail">
                <div class="result-details">
                    <h3>${result.title}</h3>
                    <p>Category: ${result.category || 'N/A'}</p>
                    <p>Tags: ${result.tags ? result.tags.join(', ') : 'No tags available'}</p>
                    <p>Director: ${result.director || 'Director not available'}</p>
                    <p>Actors: ${result.actors ? result.actors.join(', ') : 'No actors available'}</p>
                </div>
            `;

            resultElement.appendChild(resultLink);
            searchResultsContainer.appendChild(resultElement);
        });
    }

    // Lancement de la recherche après saisie
    searchQuery.addEventListener('input', function () {
        clearTimeout(debounceTimer);
        const query = searchQuery.value;
        const isCollectionSearch = searchByCollection.checked;

        debounceTimer = setTimeout(() => {
            search(query, isCollectionSearch);
        }, 300);
    });

    // Mise à jour du filtre en fonction du choix (film ou collection)
    const radioButtons = [searchByFilm, searchByCollection, searchByName, searchByTag, searchByCategory, searchByDirector, searchByActors];
    radioButtons.forEach(button => {
        button.addEventListener('change', function () {
            const query = searchQuery.value;
            const isCollectionSearch = searchByCollection.checked;
            search(query, isCollectionSearch);
        });
    });
});
