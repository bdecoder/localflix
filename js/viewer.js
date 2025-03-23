window.onload = function () {
    const params = new URLSearchParams(window.location.search);
    const videoId = params.get('id');

    fetch('films.json')
        .then(response => response.json())
        .then(films => {
            const film = films.find(f => f.id === videoId);
            if (film) {
                document.getElementById('film-title').innerText = film.title;
                document.getElementById('film-category').innerText = film.category;
                document.getElementById('film-tags').innerText = film.tags.join(', ');
                document.getElementById('film-director').innerText = film.director;
                document.getElementById('film-actors').innerText = film.actors;
                document.getElementById('film-description').innerText = film.plot;

                const videoElement = document.getElementById('film-video');
                videoElement.src = film.video;
            } else {
                alert('Film non trouvé');
            }
        })
        .catch(error => console.error('Erreur de chargement des films:', error));
};
