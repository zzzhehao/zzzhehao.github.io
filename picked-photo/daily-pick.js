fetch('/picked-photo/photos.json')
.then(response => response.json())
.then(data => {
    const photos = data.photos;
    const today = new Date();
    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    const randomIndex = Math.floor((seed % photos.length + photos.length) % photos.length);
    const photo = photos[randomIndex];
    
    const photoElement = document.getElementById('daily-photo');
    photoElement.innerHTML = `
    <h2 class="name-title" style="font-size: 1.5rem">Today's Pick</h2>
    <div class="image-container">
        <div class="pick-image">
        <a href="https://zzzhehao.github.io/gallery/gallery.html#${photo.name}">
            <img src="${photo.url}" alt="${photo.name}">
        </a>
        </div>
    </div>
    `;
});