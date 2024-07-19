document.addEventListener('DOMContentLoaded', () => {
  const galleryGrid = document.querySelector('.gallery-grid');
  const fullscreenGallery = document.getElementById('fullscreen-gallery');
  const closeButton = document.getElementById('close-gallery');
  const prevButton = document.getElementById('prev-image');
  const nextButton = document.getElementById('next-image');
  const image1 = document.getElementById('gallery-image-1');
  const image2 = document.getElementById('gallery-image-2');

  let currentAlbum = [];
  let currentIndex = 0;
  let activeImage = image1;
  let inactiveImage = image2;
  let isTransitioning = false;

  function logStatus(message) {
    console.log(`[Gallery Status] ${message}`);
  }

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
    logStatus(`Opening gallery for album: ${albumName}`);
    currentAlbum = fetchAlbumImages(albumName);
    currentIndex = 0;

    if (fullscreenGallery) {
      fullscreenGallery.style.display = 'block';
      document.body.classList.add('gallery-open');

      // Reset images
      image1.src = '';
      image2.src = '';
      image1.classList.remove('active');
      image2.classList.remove('active');

      // Load the first image
      activeImage = image1;
      inactiveImage = image2;
      loadImage(currentAlbum[currentIndex], activeImage, () => {
        activeImage.classList.add('active');
        logStatus('First image loaded and displayed');
      });
    }
  }

  function closeGallery() {
    logStatus('Closing gallery');
    if (fullscreenGallery) {
      fullscreenGallery.style.display = 'none';
      document.body.classList.remove('gallery-open');
  
      // Clear both images when closing
      image1.src = '';
      image2.src = '';
      image1.classList.remove('active');
      image2.classList.remove('active');
  
      // Reset the transition flag
      isTransitioning = false;
    }
  }

  function showPreviousImage() {
    if (!isTransitioning) {
      currentIndex = (currentIndex - 1 + currentAlbum.length) % currentAlbum.length;
      updateGalleryImage();
    }
  }

  function showNextImage() {
    if (!isTransitioning) {
      currentIndex = (currentIndex + 1) % currentAlbum.length;
      updateGalleryImage();
    }
  }

  function updateGalleryImage() {
    if (currentAlbum.length > 0 && !isTransitioning) {
      isTransitioning = true;
      logStatus(`Updating gallery image to index: ${currentIndex}`);

      loadImage(currentAlbum[currentIndex], inactiveImage, () => {
        activeImage.classList.remove('active');
        inactiveImage.classList.add('active');

        [activeImage, inactiveImage] = [inactiveImage, activeImage];

        setTimeout(() => {
          isTransitioning = false;
          logStatus('Image transition complete');
        }, 700);
      });
    }
  }

  function loadImage(src, imgElement, onLoadCallback) {
    logStatus(`Loading image: ${src}`);
    imgElement.src = src;
    imgElement.onload = () => {
      logStatus(`Image loaded successfully: ${src}`);
      onLoadCallback();
    };
    imgElement.onerror = () => {
      console.error(`Failed to load image: ${src}`);
      isTransitioning = false;
    };
  }

  function fetchAlbumImages(albumName) {
    const albums = {
      'Nova': ['album/copenhagen/copenhagen1.jpg', 'album/copenhagen/copenhagen2.jpg', 'album/copenhagen/copenhagen5.jpg'],
      'Cope': ['album/copenhagen/copenhagen3.jpg', 'album/copenhagen/copenhagen4.jpg']
    };
    return albums[albumName] || [];
  }
});