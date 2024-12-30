document.addEventListener("DOMContentLoaded", function() {
    const urlParams = new URLSearchParams(window.location.search);
    const tag = urlParams.get('tag');

    if (tag) {
        document.title = `Films - ${tag}`;

        document.getElementById('tag-title').innerText = `Films avec le tag: ${tag}`;

        fetch('films.json')
            .then(response => response.json())
            .then(data => {
                const filmsByTagContent = document.getElementById('films-by-tag-content');
                const filmsWithTag = data.filter(film => film.tags.includes(tag));

                if (filmsWithTag.length === 0) {
                    filmsByTagContent.innerHTML = `<p>Aucun film trouvé pour le tag "${tag}".</p>`;
                } else {
                    filmsWithTag.forEach(film => {
                        const filmContainer = document.createElement('div');
                        filmContainer.className = 'film-container';

                        filmContainer.innerHTML = `
                            <div class="film-thumbnail-container">
                                <img src="${film.thumbnail}" class="film-thumbnail" alt="${film.title}">
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
    } else {
        window.location.href = 'index.html';
    }
});
