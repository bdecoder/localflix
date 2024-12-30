document.addEventListener('DOMContentLoaded', function () {
    const searchQuery = document.getElementById('search-query');
    const searchResultsContainer = document.getElementById('search-results');
    const searchByName = document.getElementById('search-by-name');
    const searchByTag = document.getElementById('search-by-tag');
    const searchByCategory = document.getElementById('search-by-category');
    const searchByDirector = document.getElementById('search-by-director');
    const searchByActors = document.getElementById('search-by-actors');
    let debounceTimer;

    function searchFilms(query) {
        if (!query.trim()) {
            searchResultsContainer.style.display = 'none';
            return;
        }

        searchResultsContainer.style.display = 'block';

        fetch('films.json')
            .then(response => response.json())
            .then(films => {
                console.log('Films loaded:', films);

                const searchTerms = query.toLowerCase().split(/\s+/);

                const filteredFilms = films.filter(film => {
                    let matches = true;

                    console.log('Film:', film);

                    if (searchByName.checked) {
                        matches = matches && searchTerms.every(term => film.title.toLowerCase().includes(term));
                    }

                    if (searchByTag.checked) {
                        matches = matches && searchTerms.every(term => film.tags.some(tag => tag.toLowerCase().includes(term)));
                    }

                    if (searchByCategory.checked) {
                        matches = matches && searchTerms.every(term => film.category.toLowerCase().includes(term));
                    }

                    if (searchByDirector.checked) {
                        if (!film.director) {
                            matches = false;
                        } else {
                            matches = matches && searchTerms.every(term => film.director.toLowerCase().includes(term));
                        }
                    }

                    if (searchByActors.checked) {
                        if (!film.actors || film.actors.length === 0) {
                            matches = false;
                        } else {
                            matches = matches && searchTerms.every(term => film.actors.some(actor => actor.toLowerCase().includes(term)));
                        }
                    }

                    return matches;
                });

                console.log('Filtered Films:', filteredFilms);

                displaySearchResults(filteredFilms);
            })
            .catch(error => {
                console.error('Error loading films:', error);
            });
    }

    function displaySearchResults(films) {
        searchResultsContainer.innerHTML = '';
        if (films.length === 0) {
            searchResultsContainer.innerHTML = '<p>No films found</p>';
            return;
        }

        films.forEach(film => {
            const filmElement = document.createElement('div');
            filmElement.classList.add('search-result');

            const filmLink = document.createElement('a');
            filmLink.href = `viewer.html?id=${film.id}`;
            filmLink.classList.add('search-result-link');

            filmLink.innerHTML = `
                <img src="${film.thumbnail}" alt="${film.title}" class="result-thumbnail">
                <div class="result-details">
                    <h3>${film.title}</h3>
                    <p>Category: ${film.category}</p>
                    <p>Tags: ${film.tags ? film.tags.join(', ') : 'No tags available'}</p>
                    <p>Director: ${film.director || 'Director not available'}</p>
                    <p>Actors: ${film.actors && film.actors.length > 0 ? film.actors.join(', ') : 'No actors available'}</p>
                </div>
            `;

            filmElement.appendChild(filmLink);
            searchResultsContainer.appendChild(filmElement);
        });
    }

    searchQuery.addEventListener('input', function () {
        clearTimeout(debounceTimer);
        const query = searchQuery.value;

        debounceTimer = setTimeout(() => {
            searchFilms(query);
        }, 100);
    });

    const radioButtons = [searchByName, searchByTag, searchByCategory, searchByDirector, searchByActors];
    radioButtons.forEach(button => {
        button.addEventListener('change', function () {
            const query = searchQuery.value;
            searchFilms(query);
        });
    });
});
