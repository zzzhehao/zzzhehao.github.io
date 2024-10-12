import os
import yaml
import json

cwd = os.getcwd()
print(cwd)

def generate_gallery_metadata():
    with open('gallery/blue-marble/blue-marble-albums.yml', 'r') as file:
        albums = yaml.safe_load(file)
    
    metadata = []
    for album in albums:
        album_path = f"assets/gallery/album/blue-marble/{album['name']}"
        image_count = len([f for f in os.listdir(album_path) if f.endswith(('.jpg', '.png', '.jpeg'))])
        metadata.append({
            "name": album['name'],
            "prefix": album['name'],
            "count": image_count,
            "display_name": album['display_name']
        })
    
    with open('gallery/blue-marble/blue-marble-gallery_metadata.json', 'w') as file:
        json.dump(metadata, file)

generate_gallery_metadata()
