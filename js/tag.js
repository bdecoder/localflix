document.addEventListener("DOMContentLoaded", function() {
    const urlParams = new URLSearchParams(window.location.search);
    const tag = urlParams.get('tag');

    if (tag) {
        document.title = `Films - ${tag}`;
        document.getElementById('tag-title').innerText = `Tag: ${tag}`;

        const filmsButton = document.getElementById('films-button');
        const collectionsButton = document.getElementById('collections-button');
        const filmsByTagContent = document.getElementById('films-by-tag-content');

        // Function to display films by tag
        function displayFilms() {
            fetch('films.json')
                .then(response => response.json())
                .then(data => {
                    const filmsWithTag = data.filter(film => film.tags.includes(tag));

                    if (filmsWithTag.length === 0 && !collectionsWithTag.length) {
                        filmsByTagContent.innerHTML = `<p>Aucun film ou collection trouvé pour le tag "${tag}".</p>`;
                    } else {
                        filmsByTagContent.innerHTML = '';
                        filmsWithTag.forEach(film => {
                            const filmContainer = document.createElement('div');
                            filmContainer.className = 'film-container';

                            // Utilisation de la bonne vignette, avec un fallback à une image par défaut
                            const filmThumbnail = film.thumbnail || 'misc/default_thumbnail.jpg'; // Ajout d'une valeur par défaut

                            filmContainer.innerHTML = `
                                <div class="film-thumbnail-container">
                                    <img src="${filmThumbnail}" class="film-thumbnail" alt="${film.title}">
                                </div>
                                <div class="film-info">
                                    <h3>${film.title}</h3>
                                    <p><strong>Catégorie:</strong> ${film.category}</p>
                                    <p><strong>Tags:</strong> ${film.tags.join(', ')}</p>
                                    <button onclick="window.location.href='viewer.html?id=${film.id}'">Voir le film</button>
                                </div>
                            `;

                            filmsByTagContent.appendChild(filmContainer);
                        });
                    }
                })
                .catch(error => console.error('Error loading films:', error));
        }

        // Function to display collections by tag
        function displayCollections() {
            fetch('images.json')
                .then(response => response.json())
                .then(data => {
                    const collectionsWithTag = data.filter(collection => collection.tags.includes(tag));

                    if (collectionsWithTag.length === 0 && !filmsWithTag.length) {
                        filmsByTagContent.innerHTML = `<p>Aucune collection ou film trouvé pour le tag "${tag}".</p>`;
                    } else {
                        filmsByTagContent.innerHTML = '';
                        collectionsWithTag.forEach(collection => {
                            const collectionContainer = document.createElement('div');
                            collectionContainer.className = 'collection-container';

                            // Utilisation de la première image de la collection
                            const collectionThumbnail = collection.images && collection.images.length > 0 ? collection.images[0] : 'misc/default_thumbnail.jpg';

                            collectionContainer.innerHTML = `
                                <div class="collection-thumbnail-container">
                                    <img src="${collectionThumbnail}" class="collection-thumbnail" alt="${collection.title}">
                                </div>
                                <div class="collection-info">
                                    <h3>${collection.title}</h3>
                                    <p><strong>Tags:</strong> ${collection.tags.join(', ')}</p>
                                    <button onclick="window.location.href='collection.html?id=${collection.id}'">Voir la collection</button>
                                </div>
                            `;

                            filmsByTagContent.appendChild(collectionContainer);
                        });
                    }
                })
                .catch(error => console.error('Error loading collections:', error));
        }

        // Initially display films by default
        displayFilms();

        // Event listeners for the buttons
        filmsButton.addEventListener('click', function() {
            filmsButton.classList.add('active');
            collectionsButton.classList.remove('active');
            displayFilms();
        });

        collectionsButton.addEventListener('click', function() {
            collectionsButton.classList.add('active');
            filmsButton.classList.remove('active');
            displayCollections();
        });
    } else {
        window.location.href = 'index.html';
    }
});
