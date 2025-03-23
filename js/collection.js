document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const collectionId = urlParams.get('id');
    const collectionTitle = document.getElementById('collection-title');
    const collectionDirector = document.getElementById('collection-director');
    const collectionActors = document.getElementById('collection-actors');
    const collectionTags = document.getElementById('collection-tags');
    const imagesContainer = document.querySelector('.gallery');

    console.log("URL Parameter (id):", collectionId); // Log de l'ID récupéré depuis l'URL

    // Vérification de la présence de l'ID dans l'URL
    if (!collectionId) {
        console.error("Aucun ID de collection trouvé dans l'URL.");
        return;
    }

    // Charger le fichier JSON contenant les collections
    fetch("images.json")
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }
            return response.json();
        })
        .then(collections => {
            console.log("Collections chargées:", collections);  // Log des données récupérées
            const collection = collections.find(c => c.id === collectionId);

            if (!collection) {
                console.error("Aucune collection trouvée avec l'ID spécifié :", collectionId);
                document.body.innerHTML = `<p>Collection introuvable.</p>`;
                return;
            }

            console.log("Collection trouvée:", collection);  // Log de la collection trouvée

            // Remplir les informations de la collection
            collectionTitle.textContent = collection.title || "Titre inconnu";
            collectionDirector.textContent = collection.director || "Inconnu";
            collectionActors.textContent = collection.actors ? collection.actors.join(", ") : "Aucun acteur spécifié";
            collectionTags.textContent = collection.tags.join(", ");

            // Affichage des images de la collection
            collection.images.forEach(image => {
                const linkElement = document.createElement('a');
                linkElement.href = image;
                linkElement.target = '_blank'; // Ouvre dans une nouvelle fenêtre

                const imgElement = document.createElement('img');
                imgElement.src = image;  // Assurez-vous que l'URL de l'image est correcte
                imgElement.alt = "Image de la collection";
                imgElement.classList.add('collection-image');

                linkElement.appendChild(imgElement);
                imagesContainer.appendChild(linkElement);
            });
        })
        .catch(error => {
            console.error('Erreur lors du chargement du fichier JSON:', error);
        });
});
