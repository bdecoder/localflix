const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const app = express();

// Configurez multer pour gérer l'upload des fichiers
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const movieFolder = path.join(__dirname, 'video', req.body.nom);
    fs.mkdirSync(movieFolder, { recursive: true });
    cb(null, movieFolder);  // Destination du fichier
  },
  filename: function (req, file, cb) {
    const fileExtension = path.extname(file.originalname);
    cb(null, req.body.nom + fileExtension);  // Nouveau nom du fichier
  }
});

const upload = multer({ storage: storage });

// Middleware pour analyser les données JSON et les fichiers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir les fichiers statiques (comme index.html)
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint pour ajouter un film
app.post('/add-movie', upload.single('video'), (req, res) => {
  const newMovie = {
    nom: req.body.nom,
    description: req.body.description,
    réalisateur: req.body.réalisateur,
    date: req.body.date,
    acteurs: req.body.acteurs.split(',').map(a => a.trim()),
    genre: req.body.genre,
    tags: req.body.tags.split(',').map(t => t.trim()),
    videoPath: path.join('video', req.body.nom, req.body.nom + path.extname(req.file.originalname)) // Chemin du fichier vidéo
  };

  console.log('Nouveau film reçu:', newMovie);

  // Lire le fichier JSON existant
  fs.readFile(path.join(__dirname, 'films.json'), (err, data) => {
    if (err) {
      console.error('Erreur de lecture du fichier:', err);
      return res.status(500).json({ success: false, message: 'Erreur de lecture du fichier.' });
    }

    let films = [];
    if (data.length > 0) {
      try {
        films = JSON.parse(data);
      } catch (parseError) {
        console.error('Erreur de parsing JSON:', parseError);
        return res.status(500).json({ success: false, message: 'Erreur lors du parsing du fichier JSON.' });
      }
    }

    // Ajouter le nouveau film
    films.push(newMovie);

    // Sauvegarder à nouveau dans le fichier JSON
    fs.writeFile(path.join(__dirname, 'films.json'), JSON.stringify(films, null, 2), (writeError) => {
      if (writeError) {
        console.error('Erreur de sauvegarde dans le fichier:', writeError);
        return res.status(500).json({ success: false, message: 'Erreur de sauvegarde du fichier.' });
      }

      console.log('Film ajouté avec succès!');
      res.json({ success: true });
    });
  });
});

// Démarrer le serveur
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
