document.addEventListener('DOMContentLoaded', function() {
    const galleries = document.querySelectorAll('.image-gallery');
    
    galleries.forEach(gallery => {
      const images = gallery.querySelectorAll('.gallery-image');
      const prevButton = gallery.querySelector('.prev-button');
      const nextButton = gallery.querySelector('.next-button');
      let currentIndex = 0;
      
      if (images.length > 1) {
        prevButton.addEventListener('click', () => {
          images[currentIndex].style.display = 'none';
          currentIndex = (currentIndex - 1 + images.length) % images.length;
          images[currentIndex].style.display = 'block';
        });
        
        nextButton.addEventListener('click', () => {
          images[currentIndex].style.display = 'none';
          currentIndex = (currentIndex + 1) % images.length;
          images[currentIndex].style.display = 'block';
        });
      } else {
        if (prevButton) prevButton.style.display = 'none';
        if (nextButton) nextButton.style.display = 'none';
      }
    });
    // Copy color code functionality
  document.querySelectorAll('.color-code').forEach(code => {
    code.addEventListener('click', function() {
      navigator.clipboard.writeText(this.dataset.color).then(() => {
        alert('Color code copied to clipboard!');
      });
    });
  });

  // Copy entire palette functionality
  document.querySelectorAll('.copy-palette-button').forEach(button => {
    button.addEventListener('click', function() {
      navigator.clipboard.writeText(this.dataset.palette).then(() => {
        alert('Palette copied to clipboard!');
      });
    });
  });
});