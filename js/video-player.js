/**
 * Video Player Module
 * Handles video embedding for YouTube, Google Drive, and local video files
 * Manages type detection, loading states, and error handling
 */

const VideoPlayer = {
  /**
   * Initialize video players by scanning DOM for [data-video] elements
   * Calls render() for each video container found
   */
  init() {
    const videoContainers = document.querySelectorAll('[data-video]');
    videoContainers.forEach((container) => {
      const videoSrc = container.getAttribute('data-video');
      this.render(container, videoSrc);
    });
  },

  /**
   * Render a video in the given container
   * Detects video type and delegates to appropriate builder
   * @param {HTMLElement} containerEl - The container element to render into
   * @param {string} videoSrc - The video source (URL or file path)
   */
  render(containerEl, videoSrc) {
    // Clear any existing content
    containerEl.innerHTML = '';
    
    // Detect video type
    const videoType = this.detectVideoType(videoSrc);
    
    // Build appropriate embed element
    let embedElement;
    if (videoType === 'youtube') {
      embedElement = this.buildYouTubeEmbed(videoSrc);
    } else if (videoType === 'drive') {
      embedElement = this.buildDriveEmbed(videoSrc);
    } else {
      embedElement = this.buildLocalVideo(videoSrc);
    }
    
    // Set up timeout for error handling (10 seconds)
    let loadTimeout = setTimeout(() => {
      this.showError(containerEl);
    }, 10000);
    
    // Handle successful load
    embedElement.addEventListener('load', () => {
      clearTimeout(loadTimeout);
    });
    
    // Handle load error
    embedElement.addEventListener('error', () => {
      clearTimeout(loadTimeout);
      this.showError(containerEl);
    });
    
    // For video elements, also listen to canplay event
    if (embedElement.tagName === 'VIDEO') {
      embedElement.addEventListener('canplay', () => {
        clearTimeout(loadTimeout);
      });
    }
    
    // Append embed element to container
    containerEl.appendChild(embedElement);
  },

  /**
   * Detect the type of video source
   * @param {string} src - The video source URL or file path
   * @returns {string} 'youtube' | 'drive' | 'local'
   */
  detectVideoType(src) {
    if (!src) {
      return 'local';
    }
    
    // Check for YouTube patterns
    if (src.includes('youtube.com/watch') || src.includes('youtu.be/')) {
      return 'youtube';
    }
    
    // Check for Google Drive pattern
    if (src.includes('drive.google.com')) {
      return 'drive';
    }
    
    // Default to local
    return 'local';
  },

  /**
   * Build a YouTube embed iframe
   * @param {string} src - The YouTube URL
   * @returns {HTMLElement} iframe element
   */
  buildYouTubeEmbed(src) {
    // Extract video ID from YouTube URL
    let videoId;
    
    if (src.includes('youtube.com/watch')) {
      const urlParams = new URLSearchParams(src.split('?')[1]);
      videoId = urlParams.get('v');
    } else if (src.includes('youtu.be/')) {
      videoId = src.split('youtu.be/')[1].split('?')[0];
    }
    
    const iframe = document.createElement('iframe');
    iframe.className = 'video-player__frame';
    iframe.src = `https://www.youtube.com/embed/${videoId}`;
    iframe.title = 'YouTube Video';
    iframe.setAttribute('loading', 'lazy');
    iframe.setAttribute('allowfullscreen', '');
    iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
    
    return iframe;
  },

  /**
   * Build a Google Drive embed iframe
   * @param {string} src - The Google Drive URL
   * @returns {HTMLElement} iframe element
   */
  buildDriveEmbed(src) {
    // Extract file ID from Google Drive URL
    let fileId;
    
    if (src.includes('/d/')) {
      fileId = src.split('/d/')[1].split('/')[0];
    } else if (src.includes('id=')) {
      const urlParams = new URLSearchParams(src.split('?')[1]);
      fileId = urlParams.get('id');
    }
    
    const iframe = document.createElement('iframe');
    iframe.className = 'video-player__frame';
    iframe.src = `https://drive.google.com/file/d/${fileId}/preview`;
    iframe.title = 'Google Drive Video';
    iframe.setAttribute('loading', 'lazy');
    iframe.setAttribute('allowfullscreen', '');
    
    return iframe;
  },

  /**
   * Build a local video element
   * @param {string} src - The local video file path
   * @returns {HTMLElement} video element
   */
  buildLocalVideo(src) {
    const video = document.createElement('video');
    video.className = 'video-player__video';
    video.src = src;
    video.setAttribute('controls', '');
    video.setAttribute('loading', 'lazy');
    video.title = 'Video Player';
    
    return video;
  },

  /**
   * Show error message in the container
   * @param {HTMLElement} containerEl - The container element
   */
  showError(containerEl) {
    // Clear container
    containerEl.innerHTML = '';
    
    // Create error card
    const errorCard = document.createElement('div');
    errorCard.className = 'video-player__error';
    errorCard.setAttribute('role', 'alert');
    
    // Error message
    const message = document.createElement('p');
    message.textContent = 'Unable to load the video. Please try again later.';
    errorCard.appendChild(message);
    
    containerEl.appendChild(errorCard);
  },
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = VideoPlayer;
}
