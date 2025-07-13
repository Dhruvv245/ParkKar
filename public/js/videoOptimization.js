// Video optimization for better loading experience
document.addEventListener('DOMContentLoaded', function() {
  const videos = document.querySelectorAll('video');
  
  videos.forEach(video => {
    // Show video with fade-in effect once it can play
    video.addEventListener('canplay', function() {
      this.classList.add('loaded');
    });
    
    // Handle video loading errors
    video.addEventListener('error', function() {
      console.warn('Video failed to load:', this.src);
      // You could add a fallback image here
      this.style.display = 'none';
    });
    
    // Optimize playback for mobile
    if ('serviceWorker' in navigator) {
      video.preload = 'metadata';
    }
    
    // Add intersection observer for lazy loading on scroll
    if ('IntersectionObserver' in window) {
      const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const video = entry.target;
            if (video.readyState === 0) {
              video.load(); // Start loading when video comes into view
            }
            videoObserver.unobserve(video);
          }
        });
      });
      
      videoObserver.observe(video);
    }
  });
});

// Preload videos on page load for better UX
window.addEventListener('load', function() {
  const videos = document.querySelectorAll('video');
  videos.forEach(video => {
    // Set a timeout to prevent blocking the main thread
    setTimeout(() => {
      if (video.readyState < 3) { // If not loaded enough
        video.load();
      }
    }, 100);
  });
});
