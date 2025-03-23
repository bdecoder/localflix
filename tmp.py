import os
import json
import shutil
import customtkinter
from moviepy.editor import VideoFileClip
from PIL import Image
from tkinter import filedialog as fd

# Répertoires pour les films et les vignettes
films_dir = "films"
thumbnails_dir = "thumbnails"
films_json_path = "films.json"

# Fonction pour convertir la vidéo en mp4 si nécessaire
def convert_to_mp4(video_path, output_path):
    print(f"Conversion de {video_path} en {output_path}...")
    os.system(f"ffmpeg -i {video_path} -vcodec libx264 -acodec aac {output_path}")
    print(f"Vidéo convertie et sauvegardée sous {output_path}")

# Fonction pour créer un thumbnail de la vidéo
def create_thumbnail(video_path, thumbnail_path, time):
    print(f"Création du thumbnail à {time} secondes...")
    try:
        clip = VideoFileClip(video_path)
        frame = clip.get_frame(time)
        img = Image.fromarray(frame)
        img.save(thumbnail_path)
        print(f"Thumbnail créé et sauvegardé sous {thumbnail_path}")
    except Exception as e:
        print(f"Erreur lors de la création du thumbnail: {e}")

# Fonction pour ajouter un film dans le fichier JSON
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

# Fonction pour parcourir les fichiers et choisir une vidéo
def browse_video():
    video_path = fd.askopenfilename(title="Sélectionner une vidéo", filetypes=(("Fichiers vidéo", "*.mp4 ;*.mkv ;*.avi"), ("Tous les fichiers", "*.*")))
    entry_video.delete(0, "end")
    entry_video.insert(0, video_path)
    return video_path

# Fonction appelée lorsque l'utilisateur clique sur "Add Movie"
def add_movie():
    title = entry_title.get()
    actors = entry_actors.get()
    description = entry_description.get()
    genre = entry_genre.get()
    tags = entry_tags.get()
    director = entry_director.get()
    video_path = entry_video.get()  
    
    # Si aucun fichier n'est sélectionné, on arrête l'ajout
    if not video_path:
        print("Aucune vidéo sélectionnée.")
        return

    # Création des noms de fichiers pour la vidéo et le thumbnail
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

    create_thumbnail(video_output_path, thumbnail_output_path, entry_thumbnail_time.get())

    film_data = {
        "title": title,
        "category": genre,
        "tags": tags.split(', '),
        "director": director,
        "actors": actors,
        "plot": description,
        "video": f"films/{video_filename}",
        "thumbnail": f"thumbnails/{thumbnail_filename}",
        "id": video_filename.split('.')[0]
    }

    add_film_to_json(film_data)
    print("Film ajouté avec succès.")

    # Si l'option de réinitialisation est activée (i.e., "on"), on vide les champs
    if reset_fields.get() == "on":
        entry_title.delete(0, "end")
        entry_genre.delete(0, "end")
        entry_director.delete(0, "end")
        entry_actors.delete(0, "end")
        entry_description.delete(0, "end")
        entry_tags.delete(0, "end")
        entry_thumbnail_time.delete(0, "end")
        entry_video.delete(0, "end")

# Créer la fenêtre principale Tkinter
window = customtkinter.CTk()
window.title("Ajouter un Film")
window.geometry("500x600")
window.configure(bg="#1a5fb4")

# Champs de texte pour saisir les informations sur le film
entry_title = customtkinter.CTkEntry(window, placeholder_text="Title", font=("Arial", 16), height=50, width=450)
entry_title.place(x=20, y=10)

entry_genre = customtkinter.CTkEntry(window, placeholder_text="Genre", font=("Arial", 16), height=50, width=450)
entry_genre.place(x=20, y=70)

entry_director = customtkinter.CTkEntry(window, placeholder_text="Director", font=("Arial", 16), height=50, width=450)
entry_director.place(x=20, y=130)

entry_actors = customtkinter.CTkEntry(window, placeholder_text="Actors", font=("Arial", 16), height=50, width=450)
entry_actors.place(x=20, y=190)

entry_description = customtkinter.CTkEntry(window, placeholder_text="Description", font=("Arial", 16), height=50, width=450)
entry_description.place(x=20, y=250)

entry_tags = customtkinter.CTkEntry(window, placeholder_text="Tags (comma separated)", font=("Arial", 16), height=50, width=450)
entry_tags.place(x=20, y=310)

entry_thumbnail_time = customtkinter.CTkEntry(window, placeholder_text="Thumbnail (in seconds)", font=("Arial", 16), height=50, width=450)
entry_thumbnail_time.place(x=20, y=370)

entry_video = customtkinter.CTkEntry(window, placeholder_text="Select Video", font=("Arial", 16), height=50, width=350)
entry_video.place(x=20, y=430)

browse_button = customtkinter.CTkButton(window, text="Browse", font=("Arial", 14), height=50, width=80, command=browse_video)
browse_button.place(x=380, y=430)

# Variable pour savoir si les champs doivent être réinitialisés après l'ajout
reset_fields = customtkinter.StringVar(value="off")

# Case à cocher pour réinitialiser les champs
reset_checkbox = customtkinter.CTkCheckBox(window, text="Mode série", variable=reset_fields, onvalue="on", offvalue="off")
reset_checkbox.place(x=20, y=490)

# Bouton pour ajouter le film
add_button = customtkinter.CTkButton(window, text="Add Movie", font=("Arial", 14), height=60, width=150, command=add_movie)
add_button.place(x=175, y=530)

# Lancer l'interface Tkinter
window.mainloop()

