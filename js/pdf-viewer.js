/**
 * PDF Viewer Module
 * Handles PDF rendering with native browser support and PDF.js fallback
 * Manages loading states, error handling, and retry functionality
 */

const PDFViewer = {
  /**
   * Initialize PDF viewers by scanning DOM for [data-pdf] elements
   * Calls render() for each PDF container found
   */
  init() {
    const pdfContainers = document.querySelectorAll('[data-pdf]');
    pdfContainers.forEach((container) => {
      const pdfPath = container.getAttribute('data-pdf');
      this.render(container, pdfPath);
    });
  },

  /**
   * Render a PDF in the given container
   * @param {HTMLElement} containerEl - The container element to render into
   * @param {string} pdfPath - The path to the PDF file
   */
  render(containerEl, pdfPath) {
    // Clear any existing content
    containerEl.innerHTML = '';
    
    // Add loading state
    this.showLoading(containerEl);
    
    // Determine the PDF URL based on native support
    let pdfUrl = pdfPath;
    if (!this.isPDFNativelySupported()) {
      // Use PDF.js viewer as fallback
      pdfUrl = `pdfjs/web/viewer.html?file=${encodeURIComponent(pdfPath)}`;
    }
    
    // Create iframe element
    const iframe = document.createElement('iframe');
    iframe.className = 'pdf-viewer__frame';
    iframe.src = pdfUrl;
    iframe.title = 'PDF Document';
    iframe.setAttribute('loading', 'lazy');
    
    // Set up timeout for error handling (10 seconds)
    let loadTimeout = setTimeout(() => {
      this.showError(containerEl, pdfPath);
    }, 10000);
    
    // Handle successful load
    iframe.addEventListener('load', () => {
      clearTimeout(loadTimeout);
      const spinner = containerEl.querySelector('.pdf-viewer__spinner');
      if (spinner) {
        spinner.remove();
      }
      containerEl.classList.remove('pdf-viewer--loading');
    });
    
    // Handle load error
    iframe.addEventListener('error', () => {
      clearTimeout(loadTimeout);
      this.showError(containerEl, pdfPath);
    });
    
    // Append iframe to container
    containerEl.appendChild(iframe);
  },

  /**
   * Show loading spinner in the container
   * @param {HTMLElement} containerEl - The container element
   */
  showLoading(containerEl) {
    containerEl.classList.add('pdf-viewer--loading');
    
    const spinner = document.createElement('div');
    spinner.className = 'pdf-viewer__spinner';
    spinner.setAttribute('aria-label', 'Loading PDF...');
    
    containerEl.appendChild(spinner);
  },

  /**
   * Show error message with download link and retry button
   * @param {HTMLElement} containerEl - The container element
   * @param {string} pdfPath - The path to the PDF file (for download link)
   */
  showError(containerEl, pdfPath) {
    // Clear container
    containerEl.innerHTML = '';
    containerEl.classList.remove('pdf-viewer--loading');
    
    // Create error card
    const errorCard = document.createElement('div');
    errorCard.className = 'pdf-viewer__error';
    errorCard.setAttribute('role', 'alert');
    
    // Error message
    const message = document.createElement('p');
    message.textContent = 'Unable to load the PDF document.';
    errorCard.appendChild(message);
    
    // Download link
    const downloadLink = document.createElement('a');
    downloadLink.href = pdfPath;
    downloadLink.download = '';
    downloadLink.className = 'btn btn--secondary';
    downloadLink.textContent = 'Download PDF';
    errorCard.appendChild(downloadLink);
    
    // Retry button
    const retryButton = document.createElement('button');
    retryButton.className = 'btn btn--primary';
    retryButton.setAttribute('data-retry', '');
    retryButton.textContent = 'Retry';
    retryButton.addEventListener('click', () => {
      this.render(containerEl, pdfPath);
    });
    errorCard.appendChild(retryButton);
    
    containerEl.appendChild(errorCard);
  },

  /**
   * Check if the browser natively supports PDF rendering
   * @returns {boolean} True if PDF MIME type is supported
   */
  isPDFNativelySupported() {
    return navigator.mimeTypes && navigator.mimeTypes['application/pdf'];
  },
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PDFViewer;
}
