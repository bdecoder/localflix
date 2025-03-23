window.onload = function() {
    const params = new URLSearchParams(window.location.search);
    const collectionId = params.get('id');
    
    // Charger le fichier films.json
    fetch('films.json')
        .then(response => response.json())
        .then(films => {
            // Filtrer les films en fonction du réalisateur
            const collection = films.filter(film => film.director === collectionId);

            if (collection.length === 0) {
                document.querySelector('.collection-container').innerHTML = `<h1>Aucune collection trouvée</h1>`;
            } else {
                const collectionContainer = document.querySelector('.gallery');
                collection.forEach(film => {
                    const galleryItem = document.createElement('div');
                    galleryItem.classList.add('gallery-item');
                    galleryItem.innerHTML = `
                        <img src="${film.thumbnail}" alt="${film.title}" />
                        <div class="gallery-item-info">
                            <h3>${film.title}</h3>
                            <p><strong>Catégorie:</strong> ${film.category}</p>
                            <button onclick="window.location.href='viewer.html?id=${film.id}'">Voir le film</button>
                        </div>
                    `;
                    collectionContainer.appendChild(galleryItem);
                });
            }
        })
        .catch(error => console.error('Erreur de chargement des films:', error));
};

