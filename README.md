# LocalFlix - Movie Library

**LocalFlix** est une plateforme de visionnage de films en local, qui permet aux utilisateurs de rechercher et de visualiser des films stockés sur leur machine. Ce projet utilise un fichier JSON pour stocker les informations des films, telles que les titres, les catégories, les tags, les réalisateurs, les acteurs, les vidéos et les vignettes. Il permet également la conversion des vidéos en MP4 et la création de vignettes à partir des films.

## Fonctionnalités

- **Page d'accueil** avec une barre de recherche.
- **Recherche avancée** permettant de filtrer les films par :
  - Titre
  - Tags
  - Catégorie
  - Réalisateur
  - Acteurs
- **Visionnage des films** avec un lecteur vidéo.
- **Conversion des vidéos** non MP4 en MP4.
- **Création automatique de vignettes** : si la vignette d'un film n'est pas disponible, une vignette est générée à partir d'une image du film (en prenant une capture à 5 minutes).
- **Gestion des films** : Ajout de nouveaux films, leur vidéo et vignette au système.

## Prérequis

- Python 3.7+.
- **ffmpeg** (pour la conversion vidéo) installé sur votre machine.
- **Node.js** et **npm** (si vous souhaitez exécuter le projet côté client pour la recherche dynamique).

## Installation

### 1. Cloner ce repository

```bash
git clone https://github.com/ton-utilisateur/localflix.git
cd localflix
