import os
import json
import shutil
from moviepy.editor import VideoFileClip
from PIL import Image

films_dir = "films"
thumbnails_dir = "thumbnails"
films_json_path = "films.json"


def convert_to_mp4(video_path, output_path):
    print(f"Conversion de {video_path} en {output_path}...")
    os.system(f"ffmpeg -i {video_path} -vcodec libx264 -acodec aac {output_path}")
    print(f"Vidéo convertie et sauvegardée sous {output_path}")


def create_thumbnail(video_path, thumbnail_path, time=300):
    print(f"Création du thumbnail à {time} secondes...")
    try:
        clip = VideoFileClip(video_path)
        frame = clip.get_frame(time)
        img = Image.fromarray(frame)
        img.save(thumbnail_path)
        print(f"Thumbnail créé et sauvegardé sous {thumbnail_path}")
    except Exception as e:
        print(f"Erreur lors de la création du thumbnail: {e}")


def add_film_to_json(film_data):
    if os.path.exists(films_json_path):
        with open(films_json_path, 'r', encoding='utf-8') as f:
            films = json.load(f)
    else:
        films = []

    films.append(film_data)

    with open(films_json_path, 'w', encoding='utf-8') as f:
        json.dump(films, f, indent=4, ensure_ascii=False)
    print(f"Film ajouté au fichier {films_json_path}")


def add_film():
    title = input("Entrez le nom du film : ")
    actors = input("Entrez le nom des acteurs (séparés par des virgules) : ")
    description = input("Entrez une description du film : ")
    genre = input("Entrez le genres du film: ")
    tag = input("Entrez les tag du film (séparé par des virgules): ")
    director = input("Entrez le nom du réalisateur : ")

    video_path = input("Entrez le chemin de la vidéo : ")

    video_filename = title.replace(' ', '_').lower() + ".mp4"
    thumbnail_filename = title.replace(' ', '_').lower() + ".jpg"

    video_output_path = os.path.join(films_dir, video_filename)
    thumbnail_output_path = os.path.join(thumbnails_dir, thumbnail_filename)

    if not os.path.exists(video_path):
        print(f"Erreur : le fichier vidéo '{video_path}' n'existe pas.")
        return

    if not video_path.endswith('.mp4'):
        convert_to_mp4(video_path, video_output_path)
    else:
        shutil.copy(video_path, video_output_path)

    create_thumbnail(video_output_path, thumbnail_output_path)

    film_data = {
        "title": title,
        "category": genre,
        "tags": tag.split(', '),
        "director": director,
        "actors": actors,
        "plot": description,
        "video": f"films/{video_filename}",
        "thumbnail": f"thumbnails/{thumbnail_filename}",
        "id": video_filename.split('.')[0]
    }

    add_film_to_json(film_data)


if __name__ == "__main__":
    add_film()
