import os
import json
import shutil
from tkinter import filedialog
from PIL import Image
import customtkinter

# Création de la fenêtre principale
window = customtkinter.CTk()
window.title("Ajouter une Collection")
window.geometry("500x600")
window.configure(bg="#1a5fb4")

# Fonction pour sélectionner un dossier d'images
def browse_folder():
    folder_selected = filedialog.askdirectory()
    entry_images_folder.delete(0, "end")
    entry_images_folder.insert(0, folder_selected)

# Fonction pour convertir les images et enregistrer la collection
def add_collection():
    collection_title = entry_title.get()
    collection_director = entry_director.get()
    collection_actors = entry_actors.get().split(",")
    collection_tags = entry_tags.get().split(",")
    images_folder = entry_images_folder.get()

    if not collection_title or not images_folder:
        print("Veuillez remplir tous les champs et sélectionner un dossier d'images.")
        return

    collection_folder = os.path.join("collections", collection_title.replace(" ", "_"))
    if not os.path.exists(collection_folder):
        os.makedirs(collection_folder)

    converted_images = convert_images_to_jpg(images_folder, collection_folder)

    if not converted_images:
        print("Aucune image convertie.")
        return

    collection_data = {
        "id": collection_title.lower().replace(" ", "_"),
        "title": collection_title,
        "tags": [tag.strip() for tag in collection_tags],
        "director": collection_director,
        "actors": [actor.strip() for actor in collection_actors],
        "images": converted_images,
    }

    add_collection_to_json(collection_data)
    print(f"Collection '{collection_title}' ajoutée avec succès!")

# Fonction pour convertir les images en JPG
def convert_images_to_jpg(input_folder, output_folder):
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    image_extensions = ('.png', '.jpeg', '.jpg', '.webp', '.bmp', '.gif', '.tiff')
    image_files = [f for f in os.listdir(input_folder) if f.lower().endswith(image_extensions)]
    converted_images = []

    for image_file in image_files:
        image_path = os.path.join(input_folder, image_file)
        try:
            with Image.open(image_path) as img:
                rgb_image = img.convert("RGB")
                new_image_path = os.path.join(output_folder, os.path.splitext(image_file)[0] + ".jpg")
                rgb_image.save(new_image_path, "JPEG")
                converted_images.append(new_image_path)
        except Exception as e:
            print(f"Erreur lors de la conversion de {image_file}: {e}")

    return converted_images

# Fonction pour ajouter les informations dans le fichier JSON
def add_collection_to_json(collection_data, json_file="images.json"):
    if os.path.exists(json_file):
        with open(json_file, "r", encoding="utf-8") as f:
            collections = json.load(f)
    else:
        collections = []

    collections.append(collection_data)

    with open(json_file, "w", encoding="utf-8") as f:
        json.dump(collections, f, indent=4, ensure_ascii=False)

# Champs pour entrer les informations de la collection
entry_title = customtkinter.CTkEntry(window, placeholder_text="Title", font=("Arial", 16), height=50, width=450)
entry_title.place(x=20, y=10)

entry_director = customtkinter.CTkEntry(window, placeholder_text="Director", font=("Arial", 16), height=50, width=450)
entry_director.place(x=20, y=70)

entry_actors = customtkinter.CTkEntry(window, placeholder_text="Actors (comma separated)", font=("Arial", 16), height=50, width=450)
entry_actors.place(x=20, y=130)

entry_tags = customtkinter.CTkEntry(window, placeholder_text="Tags (comma separated)", font=("Arial", 16), height=50, width=450)
entry_tags.place(x=20, y=190)

# Champ pour sélectionner un dossier d'images
entry_images_folder = customtkinter.CTkEntry(window, placeholder_text="Select Image Folder", font=("Arial", 16), height=50, width=350)
entry_images_folder.place(x=20, y=250)

browse_button = customtkinter.CTkButton(window, text="Browse", font=("Arial", 14), height=50, width=80, command=browse_folder)
browse_button.place(x=380, y=250)

# Bouton pour ajouter la collection
add_button = customtkinter.CTkButton(window, text="Add Collection", font=("Arial", 14), height=60, width=200, command=add_collection)
add_button.place(x=150, y=500)

# Lancer l'interface Tkinter
window.mainloop()

