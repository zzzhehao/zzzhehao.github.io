# Run this script to fetch photo paths and urls

import os
import json
from urllib.parse import quote

def generate_photo_json(directory_path, base_url):
    photos = []
    for root, dirs, files in os.walk(directory_path):
        for file in files:
            if file.lower().endswith(('.jpg', '.jpeg', '.png', '.gif')):
                # Get the relative path from the albums directory
                relative_path = os.path.relpath(os.path.join(root, file), directory_path)
                # Create the URL for the photo
                url = f"{base_url}/{quote(relative_path)}"
                # Get the name without extension
                name = os.path.splitext(file)[0]
                # Append photo info to the list
                photos.append({
                    "url": url,
                    "name": name
                })
    
    return {"photos": photos}

# Set your directory path and base URL
directory_path = "assets/gallery/album"  
base_url = "https://zzzhehao.github.io/assets/gallery/album"

# Generate the JSON data
photo_data = generate_photo_json(directory_path, base_url)

# Write the JSON data to a file
output_file_path = 'picked-photo/photos.json'  
os.makedirs(os.path.dirname(output_file_path), exist_ok=True)  

with open(output_file_path, 'w') as f:
    json.dump(photo_data, f, indent=2)

print("JSON file 'photos.json' has been created successfully.")