let albumConfig = {};

document.addEventListener('DOMContentLoaded', async () => {
  const galleryGrid = document.querySelector('.gallery-grid');
  const fullscreenGallery = document.getElementById('fullscreen-gallery');
  const closeButton = document.getElementById('close-gallery');
  const prevButton = document.getElementById('prev-image');
  const nextButton = document.getElementById('next-image');
  const image1 = document.getElementById('gallery-image-1');
  const image2 = document.getElementById('gallery-image-2');

  albumConfig = await fetchAlbumConfig();

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

  // Handle hash changes
  window.addEventListener('hashchange', handleHashChange);

  function handleHashChange() {
    const hash = window.location.hash.slice(1);
    const [albumName, imageNumber] = hash.split('-');
    if (albumName) {
      openGallery(albumName, imageNumber ? parseInt(imageNumber) - 1 : 0);
    } else {
      closeGallery();
    }
  }

  function openGallery(albumName, startIndex = 0) {
    logStatus(`Opening gallery for album: ${albumName}, starting at index: ${startIndex}`);
    currentAlbum = fetchAlbumImages(albumName);
    console.log("Current album images:", currentAlbum);
    currentIndex = startIndex;
  
    if (fullscreenGallery) {
      // Set the album title
      const albumTitleElement = document.getElementById('gallery-title');
      const albumDisplayName = albumConfig[albumName].display_name;
      albumTitleElement.textContent = albumDisplayName;
  
      fullscreenGallery.style.display = 'block';
      document.body.classList.add('gallery-open');
  
      // Reset images
      image1.src = '';
      image2.src = '';
      image1.classList.remove('active');
      image2.classList.remove('active');
  
      // Load the image at startIndex
      activeImage = image1;
      inactiveImage = image2;
      loadImage(currentAlbum[currentIndex], activeImage, () => {
        activeImage.classList.add('active');
        logStatus(`Image loaded and displayed at index: ${currentIndex}`);
      });

      // Update URL hash
      updateUrlHash(albumName, currentIndex);
    }
  }

  function updateUrlHash(albumName, index) {
    if (index === 0) {
      history.replaceState(null, '', `#${albumName}`);
    } else {
      history.replaceState(null, '', `#${albumName}-${index + 1}`);
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

      // Remove hash from URL
      history.pushState("", document.title, window.location.pathname + window.location.search);
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

  function getCurrentAlbumName() {
    return window.location.hash.split('-')[0].slice(1);
  }

  function updateGalleryImage() {
    if (currentAlbum.length > 0 && !isTransitioning) {
      isTransitioning = true;
      logStatus(`Updating gallery image to index: ${currentIndex}`);
  
      inactiveImage.src = currentAlbum[currentIndex];
      inactiveImage.onload = () => {
        activeImage.classList.remove('active');
        inactiveImage.classList.add('active');
  
        // Wait for the transition to complete before swapping images and updating URL
        setTimeout(() => {
          [activeImage, inactiveImage] = [inactiveImage, activeImage];
          updateUrlHash(getCurrentAlbumName(), currentIndex);
          isTransitioning = false;
          logStatus('Image transition complete');
        }, 700); // This should match your CSS transition duration
      };
  
      inactiveImage.onerror = () => {
        console.error(`Failed to load image: ${currentAlbum[currentIndex]}`);
        isTransitioning = false;
      };
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

  async function fetchAlbumConfig() {
    try {
      console.log('Attempting to fetch gallery_metadata.json');
      const response = await fetch('/gallery/gallery_metadata.json');
      console.log('Fetch response:', response);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Loaded album config:", data);
      
      // Convert the array to an object with album names as keys
      albumConfig = data.reduce((acc, album) => {
        acc[album.name] = album;
        return acc;
      }, {});
      
      console.log("Processed album config:", albumConfig);
      return albumConfig;
    } catch (error) {
      console.error('Failed to fetch album metadata:', error);
      return {};
    }
  }

  function fetchAlbumImages(albumName) {
    console.log("Fetching images for album:", albumName);
    console.log("Current albumConfig:", albumConfig);
    
    const config = albumConfig[albumName];
    if (!config) {
        console.error(`No config found for album: ${albumName}`);
        return [];
    }

    const { count, prefix } = config;
    const folderName = prefix.toLowerCase().replace(/\s+/g, '-');
    
    const images = Array.from({ length: count }, (_, i) => 
        `../assets/gallery/album/${folderName}/${prefix.toLowerCase()}-${i + 1}.jpg`
    );
    console.log(`Generated image paths for ${albumName}:`, images);
    return images;
  }

  // Handle initial hash on page load
  handleHashChange();

  const copyUrlButton = document.getElementById('copy-url-button');

  copyUrlButton.addEventListener('click', () => {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl).then(() => {
      copyUrlButton.textContent = 'Copied!';
      copyUrlButton.classList.add('clicked'); // Add the clicked class
      setTimeout(() => {
        copyUrlButton.textContent = 'Copy URL';
        copyUrlButton.classList.remove('clicked'); // Remove the clicked class
      }, 3000);
    }).catch(err => {
      console.error('Failed to copy URL: ', err);
    });
  });
});

// Copyright alert
document.addEventListener('contextmenu', function(e) {
    if (e.target.tagName === 'IMG') {
        e.preventDefault();
        var modal = document.getElementById('custom-modal');
        var modalContent = modal.querySelector('.modal-content');
        
        // Get the clicked image's position and dimensions
        var rect = e.target.getBoundingClientRect();
        
        // Center the modal on the image
        modalContent.style.left = rect.left + rect.width / 2 + 'px';
        modalContent.style.top = rect.top + rect.height / 2 + 'px';
        
        // Show the modal with fade effect
        modal.style.display = 'block';
        setTimeout(function() {
            modal.classList.add('show');
        }, 10);
    }
}, false);

// Close the modal when clicking outside of it
window.onclick = function(event) {
    var modal = document.getElementById('custom-modal');
    if (event.target == modal) {
        modal.classList.remove('show');
        setTimeout(function() {
            modal.style.display = 'none';
        }, 300);
    }
}