document.addEventListener("DOMContentLoaded", function() {
    // Charger les films
    fetch('films.json')
        .then(response => response.json())
        .then(filmsData => {
            const lastFilmsContent = document.getElementById('films-content');
            const filmsToDisplay = filmsData.slice(-5);  // Derniers films

            filmsToDisplay.forEach(film => {
                const filmButton = document.createElement('button');
                filmButton.className = 'film-thumbnail-button';
                // Correction de la syntaxe de l'innerHTML
                filmButton.innerHTML = `<img src="${film.thumbnail}" class="film-thumbnail" alt="${film.title}">`;
                filmButton.onclick = () => {
                    window.location.href = `viewer.html?id=${film.id}`;
                };
                lastFilmsContent.appendChild(filmButton);
            });

            // Afficher les tags des films
            const tagsCount = {};

            filmsData.forEach(film => {
                film.tags.forEach(tag => {
                    tagsCount[tag] = (tagsCount[tag] || 0) + 1;
                });
            });

            // Charger les collections
            fetch('images.json')
                .then(response => response.json())
                .then(collectionsData => {
                    const lastCollectionsContent = document.getElementById('collections-content');
                    const collectionsToDisplay = collectionsData.slice(-5);  // Dernières collections

                    collectionsToDisplay.forEach(collection => {
                        const collectionButton = document.createElement('button');
                        collectionButton.className = 'film-thumbnail-button';  // Utilisation du même style que pour les films

                        // Utiliser la première image de la collection comme vignette
                        const collectionThumbnail = collection.images && collection.images.length > 0 ? collection.images[0] : 'misc/default_thumbnail.jpg';

                        // Correction de la syntaxe de l'innerHTML
                        collectionButton.innerHTML = `<img src="${collectionThumbnail}" class="film-thumbnail" alt="${collection.name}">`;
                        collectionButton.onclick = () => {
                            window.location.href = `collection.html?id=${collection.id}`;
                        };

                        lastCollectionsContent.appendChild(collectionButton);

                        // Ajouter les tags des collections au compteur
                        collection.tags.forEach(tag => {
                            tagsCount[tag] = (tagsCount[tag] || 0) + 1;
                        });
                    });

                    // Trier les tags par fréquence et obtenir les 10 plus populaires
                    const sortedTags = Object.entries(tagsCount)
                        .sort((a, b) => b[1] - a[1])  // Trier par la fréquence (décroissante)
                        .slice(0, 30);  // Garder les 30 premiers tags

                    // Afficher les 30 tags les plus populaires
                    const tagsHTML = sortedTags.map(([tag, count]) => {
                        return `<button class="categorie-button" onclick="window.location.href='tag.html?tag=${encodeURIComponent(tag)}'">${tag} (${count})</button>`;
                    }).join('');

                    // Insérer les tags populaires dans le DOM
                    document.getElementById('categories-content').innerHTML = tagsHTML;
                })
                .catch(error => console.error('Error loading collections:', error));

        })
        .catch(error => console.error('Error loading films:', error));
});
