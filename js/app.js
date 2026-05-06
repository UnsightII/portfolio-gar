/**
 * App.js - Main Application Bootstrap
 * Initializes all modules and sets up the application
 */

document.addEventListener('DOMContentLoaded', function() {
  // Initialize theme toggle
  initThemeToggle();

  // Initialize Navigation module
  if (typeof Navigation !== 'undefined') {
    Navigation.init();
  }

  // Initialize PDF Viewer module
  if (typeof PDFViewer !== 'undefined') {
    PDFViewer.init();
  }

  // Initialize Video Player module
  if (typeof VideoPlayer !== 'undefined') {
    VideoPlayer.init();
  }

  // Initialize Reflection Tab Switching
  initReflectionTabs();

  // Set welcome section as active on initial load
  const welcomeSection = document.getElementById('welcome');
  if (welcomeSection && !welcomeSection.classList.contains('section--active')) {
    welcomeSection.classList.add('section--active');
  }
});

/**
 * Initialize dark mode theme toggle
 */
function initThemeToggle() {
  const themeToggle = document.getElementById('theme-toggle');
  const htmlElement = document.documentElement;
  const body = document.body;

  // Check for saved theme preference or default to light mode
  const savedTheme = localStorage.getItem('theme') || 'light';
  
  // Apply saved theme
  if (savedTheme === 'dark') {
    body.classList.add('dark-mode');
    themeToggle.classList.add('dark-mode-active');
    htmlElement.setAttribute('data-theme', 'dark');
  } else {
    body.classList.remove('dark-mode');
    themeToggle.classList.remove('dark-mode-active');
    htmlElement.setAttribute('data-theme', 'light');
  }

  // Toggle theme on button click
  themeToggle.addEventListener('click', function() {
    const isDarkMode = body.classList.toggle('dark-mode');
    themeToggle.classList.toggle('dark-mode-active');
    
    // Save preference
    const theme = isDarkMode ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
    htmlElement.setAttribute('data-theme', theme);
  });
}

/**
 * Initialize reflection tab switching functionality
 */
function initReflectionTabs() {
  const tabs = document.querySelectorAll('.reflections__tab');
  const panels = document.querySelectorAll('.reflection-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', function() {
      const targetId = this.getAttribute('data-target');

      // Remove active class from all tabs and panels
      tabs.forEach(t => t.classList.remove('reflections__tab--active'));
      panels.forEach(p => p.classList.remove('reflection-panel--active'));

      // Add active class to clicked tab and corresponding panel
      this.classList.add('reflections__tab--active');
      const targetPanel = document.getElementById(`reflection-${targetId}`);
      if (targetPanel) {
        targetPanel.classList.add('reflection-panel--active');
      }
    });
  });
}

/**
 * Smooth scroll to section when navigation link is clicked
 */
document.addEventListener('click', function(e) {
  if (e.target.classList.contains('nav__link')) {
    // Close mobile menu if open
    const nav = document.getElementById('main-nav');
    if (nav && nav.classList.contains('nav--open')) {
      nav.classList.remove('nav--open');
    }
  }
});

/**
 * Handle window resize for responsive behavior
 */
window.addEventListener('resize', function() {
  // Close mobile menu on larger screens
  const nav = document.getElementById('main-nav');
  if (window.innerWidth > 767 && nav && nav.classList.contains('nav--open')) {
    nav.classList.remove('nav--open');
  }
});
