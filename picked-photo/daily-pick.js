function initializeDailyPhoto() {
    fetch('/picked-photo/photos.json')
    .then(response => response.json())
    .then(data => {
        const photos = data.photos;
        const today = new Date();
        const seed = today.getFullYear() * 1000 + (today.getMonth()) * 100 + today.getDate();
        
        // Simple pseudo-random number generator
        function seededRandom(seed) {
            let x = Math.sin(seed) * 10000;
            return x - Math.floor(x);
        }

        const randomIndex = Math.floor(seededRandom(seed) * photos.length);
        const photo = photos[randomIndex];
        
        const photoElement = document.getElementById('daily-photo');
        photoElement.innerHTML = `
        <div class="name-title" style="font-size: 2rem">Today's Pick</div>
        <br>
        <div class="image-container">
            <div class="pick-image">
            <a href="https://zzzhehao.github.io/gallery/gallery.html#${photo.name}">
                <img src="${photo.url}" alt="${photo.name}">
            </a>
            </div>
        </div>
        `;
    });
}

document.addEventListener('DOMContentLoaded', initializeDailyPhoto);