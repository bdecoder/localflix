document.addEventListener("DOMContentLoaded", function() {
    fetch('films.json')
        .then(response => response.json())
        .then(data => {
            const lastFilmsContent = document.getElementById('films-content');
            const filmsToDisplay = data.slice(-5);

            filmsToDisplay.forEach(film => {
                const filmButton = document.createElement('button');
                filmButton.className = 'film-thumbnail-button';
                filmButton.innerHTML = `<img src="${film.thumbnail}" class="film-thumbnail" alt="${film.title}">`;
                filmButton.onclick = () => {
                    window.location.href = `viewer.html?id=${film.id}`;
                };
                lastFilmsContent.appendChild(filmButton);
            });

            const statistiquesContent = document.getElementById('statistiques-content');
            const categoriesCount = {};

            data.forEach(film => {
                categoriesCount[film.category] = (categoriesCount[film.category] || 0) + 1;
            });

            let statistiquesHTML = '<ul>';
            for (const [category, count] of Object.entries(categoriesCount)) {
                statistiquesHTML += `<li>Films ${category.toLowerCase()}: ${count}</li>`;
            }
            statistiquesHTML += '</ul>';
            statistiquesContent.innerHTML = statistiquesHTML;

            const tagsSet = new Set();
            data.forEach(film => {
                film.tags.forEach(tag => tagsSet.add(tag));
            });

            const tagsHTML = Array.from(tagsSet).map(tag => {
                return `<button class="categorie-button" onclick="window.location.href='films_by_tag.html?tag=${encodeURIComponent(tag)}'">${tag}</button>`;
            }).join('');
            document.getElementById('categories-content').innerHTML = tagsHTML;
        })
        .catch(error => console.error('Error loading films:', error));
});
