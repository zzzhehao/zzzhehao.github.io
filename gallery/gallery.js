console.log("Gallery script loaded");
document.addEventListener('DOMContentLoaded', () => {
    const galleryGrid = document.querySelector('.gallery-grid');
    const fullscreenGallery = document.getElementById('fullscreen-gallery');
    const closeButton = document.getElementById('close-gallery');
    const currentImage = document.getElementById('current-image');
    const prevButton = document.getElementById('prev-image');
    const nextButton = document.getElementById('next-image');
  
    let currentAlbum = [];
    let currentIndex = 0;
  
    galleryGrid.addEventListener('click', (e) => {
      const thumbnail = e.target.closest('.album-thumbnail');
      if (thumbnail) {
        const albumName = thumbnail.dataset.album;
        openGallery(albumName);
      }
    });
  
    closeButton.addEventListener('click', closeGallery);
    prevButton.addEventListener('click', showPreviousImage);
    nextButton.addEventListener('click', showNextImage);
  
    function openGallery(albumName) {
      // Fetch album images (you'll need to implement this based on your data structure)
      currentAlbum = fetchAlbumImages(albumName);
      currentIndex = 0;
      updateGalleryImage();
      fullscreenGallery.style.display = 'block';
    }
  
    function closeGallery() {
      fullscreenGallery.style.display = 'none';
    }
  
    function showPreviousImage() {
      currentIndex = (currentIndex - 1 + currentAlbum.length) % currentAlbum.length;
      updateGalleryImage();
    }
  
    function showNextImage() {
      currentIndex = (currentIndex + 1) % currentAlbum.length;
      updateGalleryImage();
    }
  
    function updateGalleryImage() {
      currentImage.src = currentAlbum[currentIndex];
    }
  
    function fetchAlbumImages(albumName) {
      // Implement this function to return an array of image URLs for the given album
      // This could involve fetching data from a JSON file or your server
      return ['path/to/image1.jpg', 'path/to/image2.jpg', 'path/to/image3.jpg'];
    }
  });