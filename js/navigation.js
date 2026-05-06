/**
 * Navigation Module
 * Manages hash-based SPA routing, active section visibility, and mobile menu toggling
 */

const Navigation = {
  /**
   * Initialize the navigation system
   * - Read initial hash (default to #welcome)
   * - Set up event listeners for hash changes and hamburger button
   */
  init() {
    // Get initial hash, remove the # and default to 'welcome'
    const initialHash = window.location.hash.slice(1) || 'welcome';
    
    // Navigate to the initial section
    this.navigateTo(initialHash);
    
    // Listen for hash changes
    window.addEventListener('hashchange', () => {
      const hash = window.location.hash.slice(1) || 'welcome';
      this.navigateTo(hash);
    });
    
    // Bind hamburger button click listener
    const hamburger = document.querySelector('.nav__hamburger');
    if (hamburger) {
      hamburger.addEventListener('click', () => {
        this.toggleMobileMenu();
      });
    }
  },

  /**
   * Navigate to a specific section
   * @param {string} sectionId - The id of the section to navigate to
   */
  navigateTo(sectionId) {
    // Get all section elements
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav__link');
    
    // Check if the section exists
    const targetSection = document.getElementById(sectionId);
    
    // Fall back to 'welcome' if section doesn't exist
    if (!targetSection) {
      sectionId = 'welcome';
    }
    
    // Remove active class from all sections
    sections.forEach(section => {
      section.classList.remove('section--active');
    });
    
    // Add active class to the target section
    const activeSection = document.getElementById(sectionId);
    if (activeSection) {
      activeSection.classList.add('section--active');
    }
    
    // Remove active class from all nav links
    navLinks.forEach(link => {
      link.classList.remove('nav__link--active');
    });
    
    // Add active class to the matching nav link
    const activeLink = document.querySelector(`a[href="#${sectionId}"]`);
    if (activeLink) {
      activeLink.classList.add('nav__link--active');
    }
    
    // Update the window location hash
    window.location.hash = `#${sectionId}`;
    
    // Scroll to top
    window.scrollTo(0, 0);
  },

  /**
   * Toggle the mobile menu
   */
  toggleMobileMenu() {
    const nav = document.getElementById('main-nav');
    if (nav) {
      nav.classList.toggle('nav--open');
    }
  },

  /**
   * Get the currently active section id
   * @returns {string} The id of the currently active section
   */
  getCurrentSection() {
    const activeSection = document.querySelector('.section--active');
    return activeSection ? activeSection.id : 'welcome';
  }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Navigation;
}
