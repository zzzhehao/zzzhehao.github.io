document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM fully loaded and parsed');
  
  const galleryGrid = document.querySelector('.gallery-grid');
  console.log('Gallery grid:', galleryGrid);

  const fullscreenGallery = document.getElementById('fullscreen-gallery');
  console.log('Fullscreen gallery:', fullscreenGallery);

  const closeButton = document.getElementById('close-gallery');
  console.log('Close button:', closeButton);

  const currentImage = document.getElementById('current-image');
  console.log('Current image:', currentImage);

  const prevButton = document.getElementById('prev-image');
  console.log('Previous button:', prevButton);

  const nextButton = document.getElementById('next-image');
  console.log('Next button:', nextButton);

  let currentAlbum = [];
  let currentIndex = 0;

  if (galleryGrid) {
    galleryGrid.addEventListener('click', (e) => {
      console.log('Click event on gallery grid');
      const thumbnail = e.target.closest('.album-thumbnail');
      if (thumbnail) {
        console.log('Thumbnail clicked:', thumbnail.dataset.album);
        const albumName = thumbnail.dataset.album;
        openGallery(albumName);
      }
    });
  } else {
    console.error('Gallery grid not found');
  }

  if (closeButton) {
    closeButton.addEventListener('click', closeGallery);
  } else {
    console.error('Close button not found');
  }

  if (prevButton) {
    prevButton.addEventListener('click', showPreviousImage);
  } else {
    console.error('Previous button not found');
  }

  if (nextButton) {
    nextButton.addEventListener('click', showNextImage);
  } else {
    console.error('Next button not found');
  }

  function openGallery(albumName) {
    console.log('Opening gallery for album:', albumName);
    currentAlbum = fetchAlbumImages(albumName);
    console.log('Fetched images:', currentAlbum);
    currentIndex = 0;
    updateGalleryImage();
    if (fullscreenGallery) {
      fullscreenGallery.style.display = 'block';
      console.log('Fullscreen gallery should now be visible');
    } else {
      console.error('Fullscreen gallery element not found');
    }
  }

  function closeGallery() {
    console.log('Closing gallery');
    if (fullscreenGallery) {
      fullscreenGallery.style.display = 'none';
    } else {
      console.error('Fullscreen gallery element not found');
    }
  }

  function showPreviousImage() {
    console.log('Showing previous image');
    currentIndex = (currentIndex - 1 + currentAlbum.length) % currentAlbum.length;
    updateGalleryImage();
  }

  function showNextImage() {
    console.log('Showing next image');
    currentIndex = (currentIndex + 1) % currentAlbum.length;
    updateGalleryImage();
  }

  function updateGalleryImage() {
    if (currentAlbum.length > 0) {
      if (currentImage) {
        currentImage.src = currentAlbum[currentIndex];
        console.log('Updated image src:', currentImage.src);
      } else {
        console.error('Current image element not found');
      }
    } else {
      console.log('No images in the current album');
    }
  }

  function fetchAlbumImages(albumName) {
    console.log('Fetching images for album:', albumName);
    const albums = {
      'Nova': ['album/copenhagen/copenhagen1.jpg', 'album/copenhagen/copenhagen2.jpg'],
      'Cope': ['album/copenhagen/copenhagen3.jpg', 'album/copenhagen/copenhagen4.jpg']
    };
    return albums[albumName] || [];
  }
});