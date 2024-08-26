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
    const albumConfig = {
      // Setup albums here
      // template: '': { count: , prefix: ''},
      'adria': { count: 69, prefix: 'adria' },
      'berlin21': { count: 11, prefix: 'berlin21'},
      'best-of-film': { count: 36, prefix: 'best-of-film'},
      'boltenhagen': { count: 27, prefix: 'boltenhagen'},
      'copenhagen': { count: 70, prefix: 'copenhagen' },
      'dasyueshan24': { count: 55, prefix: 'dasyueshan24'},
      'kihh21': { count: 66, prefix: 'kihh21'},
      'life20': { count: 173, prefix: 'life20'},
      'life21': { count: 204, prefix: 'life21'},
      'life22': { count: 132, prefix: 'life22'},
      'life23': { count: 44, prefix: 'life23'},
      'life24': { count: 100, prefix: 'life24'},
      'okinawa23': { count: 31, prefix: 'okinawa23'},
      'taiwan23': { count: 105, prefix: 'taiwan23'},
      'tl': { count: 190, prefix: 'tl'},
      'tokyo18': { count: 69, prefix: 'tokyo18'}
    };

    const config = albumConfig[albumName];
    if (!config) return [];

    const { count, prefix } = config;
    const folderName = prefix.toLowerCase().replace(/\s+/g, '-');
    
    return Array.from({ length: count }, (_, i) => 
      `../assets/gallery/album/${folderName}/${prefix.toLowerCase()}-${i + 1}.jpg`
    );
  }
});