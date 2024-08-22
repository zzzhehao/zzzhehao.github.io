document.addEventListener('DOMContentLoaded', function() {
  const galleries = document.querySelectorAll('.image-gallery');
  
  galleries.forEach((gallery) => {
    const images = Array.from(gallery.querySelectorAll('.gallery-image'));
    const nextButton = gallery.nextElementSibling;
    let currentIndex = 0;
    
    if (images.length > 1 && nextButton) {
      nextButton.addEventListener('click', () => {
        images[currentIndex].style.display = 'none';
        currentIndex = (currentIndex + 1) % images.length;
        images[currentIndex].style.display = 'block';
      });
    }
  });
  
  // Create toast element
  const toast = document.createElement('div');
  toast.className = 'toast';
  document.body.appendChild(toast);

  // Function to show toast
  function showToast(message) {
    toast.textContent = message;
    toast.style.display = 'block';
    setTimeout(() => {
      toast.style.display = 'none';
    }, 3000);
  }

  // Copy color code functionality
  document.querySelectorAll('.color-code').forEach(code => {
    code.addEventListener('click', function() {
      navigator.clipboard.writeText(this.dataset.color).then(() => {
        showToast('Color code copied!');
      });
    });
  });

  // Copy entire palette functionality
  document.querySelectorAll('.copy-palette-button').forEach(button => {
    button.addEventListener('click', function() {
      navigator.clipboard.writeText(this.dataset.palette).then(() => {
        showToast('Palette copied as CSS!');
      });
    });
  });

  // Copy R vector functionality
  document.querySelectorAll('.copy-r-vector-button').forEach(button => {
    button.addEventListener('click', function() {
      navigator.clipboard.writeText(this.dataset.vector).then(() => {
        showToast('Palette copied as R vector!');
      });
    });
  });
});