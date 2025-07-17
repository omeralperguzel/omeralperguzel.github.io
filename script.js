// Typing Animation
class TypingAnimation {
  constructor(element, texts, typingSpeed = 100, deleteSpeed = 50, pauseTime = 1000) {
    this.textElement = element;
    this.texts = texts;
    this.typingSpeed = typingSpeed;
    this.deleteSpeed = deleteSpeed;
    this.pauseTime = pauseTime;
    
    this.textIndex = 0;
    this.charIndex = 0;
    this.isDeleting = false;
    this.isWaiting = false;
    this.isActive = true;
    
    this.cursorElement = document.getElementById('cursor');
    if (this.cursorElement) {
      this.cursorElement.textContent = '|';
    }
    
    this.type();
  }
  
  type() {
    if (!this.isActive || !this.texts || this.texts.length === 0) return;
    
    // Current text based on index
    const currentText = this.texts[this.textIndex];
    
    // Calculate typing/deleting speed
    let speed = this.isDeleting ? this.deleteSpeed : this.typingSpeed;
    
    if (this.isDeleting) {
      // Remove character
      this.textElement.textContent = currentText.substring(0, this.charIndex - 1);
      this.charIndex--;
    } else {
      // Add character
      this.textElement.textContent = currentText.substring(0, this.charIndex + 1);
      this.charIndex++;
    }
    
    // If finished typing current text
    if (!this.isDeleting && this.charIndex === currentText.length) {
      speed = this.pauseTime;
      this.isDeleting = true;
      this.isWaiting = true;
    }
    
    // If deleted all text
    if (this.isDeleting && this.charIndex === 0) {
      this.isDeleting = false;
      this.textIndex = (this.textIndex + 1) % this.texts.length;
      this.isWaiting = true;
    }
    
    setTimeout(() => this.type(), speed);
  }
  
  reset(newTexts) {
    // Stop current animation cycle
    this.isActive = false;
    
    // Reset everything
    setTimeout(() => {
      this.texts = newTexts;
      this.textIndex = 0;
      this.charIndex = 0;
      this.isDeleting = false;
      this.isWaiting = false;
      this.textElement.textContent = '';
      this.isActive = true;
      this.type(); // Restart typing with new texts
    }, 50);
  }
}

// Shared language utilities
const languageUtils = {
  // Switch language across the site
  switchLanguage: function(language) {
    // Update html lang attribute
    document.documentElement.setAttribute('lang', language);
    document.documentElement.setAttribute('data-language', language);
    
    // Find translations object - could be global or page-specific
    let translations;
    if (typeof aboutTranslations !== 'undefined') {
      translations = aboutTranslations;
    } else if (typeof window.translations !== 'undefined') {
      translations = window.translations;
    } else {
      return; // No translations found
    }
    
    // Update all elements with language classes
    if (translations[language]) {
      Object.keys(translations[language]).forEach(key => {
        const elements = document.querySelectorAll('.' + key);
        elements.forEach(el => {
          el.textContent = translations[language][key];
        });
      });
    }
    
    // Update typing animation if it exists
    if (window.typingAnimation && window.typingAnimationTexts) {
      const texts = window.typingAnimationTexts[language];
      if (texts) {
        window.typingAnimation.reset(texts);
      }
    }
    
    // Update language toggle buttons
    const langToggles = document.querySelectorAll('#languageToggle, #mobileLanguageToggle');
    langToggles.forEach(toggle => {
      const currentLang = toggle.querySelector('.current-lang');
      const otherLang = toggle.querySelector('.other-lang');
      
      if (currentLang && otherLang) {
        currentLang.textContent = language.toUpperCase();
        otherLang.textContent = language === 'tr' ? 'EN' : 'TR';
        
        // Toggle text colors for emphasis
        currentLang.classList.remove('text-gray-medium');
        otherLang.classList.add('text-gray-medium');
      }
    });
    
    // Save preference to localStorage
    localStorage.setItem('language', language);
  },
  
  // Initialize language settings from localStorage
  initLanguage: function() {
    const savedLanguage = localStorage.getItem('language') || 'tr';
    this.switchLanguage(savedLanguage);
  }
};

// Reveal animations when scrolling
function revealOnScroll() {
  const sections = document.querySelectorAll('.section-fade');
  
  sections.forEach(section => {
    const sectionTop = section.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;
    
    if (sectionTop < windowHeight - 150) {
      section.classList.add('appear');
    }
  });
}

// Page loader
window.addEventListener('load', function() {
  setTimeout(function() {
    document.getElementById('pageLoader').style.opacity = '0';
    setTimeout(function() {
      document.getElementById('pageLoader').style.display = 'none';
    }, 300);
  }, 500);
  
  // Make sure a page is loaded on initial page load
  if (!location.hash && location.pathname === '/index.html') {
    location.hash = '#home';
  }
  
  // Initialize language on page load
  languageUtils.initLanguage();
});

// Document ready function
document.addEventListener('DOMContentLoaded', function() {
  // Initialize AOS
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      once: true
    });
  }
  
  // Initialize GLightbox if available
  if (typeof GLightbox !== 'undefined') {
    const lightbox = GLightbox({
      touchNavigation: true,
      loop: true,
      autoplayVideos: true
    });
  }
  
  // Theme toggle functionality
  const themeToggleBtn = document.getElementById('themeToggle');
  const sunIcon = document.querySelector('.sun-icon');
  const moonIcon = document.querySelector('.moon-icon');
  
  // Check if user has a saved theme preference
  const savedTheme = localStorage.getItem('theme') || 'dark'; // Default to dark theme
  
  // Apply the saved theme on page load
  document.documentElement.setAttribute('data-theme', savedTheme);
  
  // Only call updateThemeIcons if we're on a page with theme toggle buttons
  if (themeToggleBtn && (sunIcon || moonIcon)) {
    updateThemeIcons(savedTheme);
  }
  
  // Handle theme toggle click
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', function() {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      // Apply the new theme
      document.documentElement.setAttribute('data-theme', newTheme);
      
      // Update icons visibility if they exist
      if (sunIcon || moonIcon) {
        updateThemeIcons(newTheme);
      }
      
      // Save user preference
      localStorage.setItem('theme', newTheme);
    });
  }
  
  function updateThemeIcons(theme) {
    // Get all theme icons in the page
    const sunIcons = document.querySelectorAll('.sun-icon');
    const moonIcons = document.querySelectorAll('.moon-icon');
    
    if (theme === 'light') {
      sunIcons.forEach(icon => icon.classList.add('hidden'));
      moonIcons.forEach(icon => icon.classList.remove('hidden'));
    } else {
      sunIcons.forEach(icon => icon.classList.remove('hidden'));
      moonIcons.forEach(icon => icon.classList.add('hidden'));
    }
  }

  // Mobile menu toggle
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const closeMenu = document.getElementById('closeMenu');
  const mobileNav = document.getElementById('mobileNav');
  
  if (mobileMenuToggle && mobileNav) {
    mobileMenuToggle.addEventListener('click', function() {
      mobileNav.classList.remove('translate-x-full');
    });
  }
  
  if (closeMenu && mobileNav) {
    closeMenu.addEventListener('click', function() {
      mobileNav.classList.add('translate-x-full');
    });
  }
  
  // Navbar scroll effect
  window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    const logoContainer = document.querySelector('.logo-container');
    const headerLogo = document.querySelector('.header-logo');
    const headerTitle = document.querySelector('.header-title');
    const navLinks = document.querySelector('.nav-links');
    
    if (window.scrollY > 50) {
      // Scrolled state
      header.classList.add('py-2', 'shadow-lg');
      logoContainer.classList.remove('mx-auto');
      headerLogo.classList.remove('hidden'); // Show logo when scrolled
      headerTitle.classList.add('hidden');
      navLinks.classList.add('justify-end');
    } else {
      // Initial state
      header.classList.remove('py-2', 'shadow-lg');
      logoContainer.classList.add('mx-auto');
      headerLogo.classList.add('hidden'); // Hide logo when at top
      headerTitle.classList.remove('hidden');
      navLinks.classList.remove('justify-end');
    }
  });
  
  // Update active nav link based on scroll position
  window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.clientHeight;
      const scrollPosition = window.scrollY;
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        const sectionId = section.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}` || link.getAttribute('href').endsWith(`#${sectionId}`)) {
            link.classList.add('active');
          }
        });
      }
    });
  });
  
  // Set up language toggle handlers
  const langToggles = document.querySelectorAll('#languageToggle, #mobileLanguageToggle');
  langToggles.forEach(toggle => {
    toggle.addEventListener('click', function() {
      const currentLanguage = document.documentElement.getAttribute('data-language');
      const newLanguage = currentLanguage === 'tr' ? 'en' : 'tr';
      languageUtils.switchLanguage(newLanguage);
    });
  });
  
  // Listen for language changes to update typing animation
  document.addEventListener('languageChanged', function(e) {
    const language = e.detail.language;
    if (window.typingAnimation && window.typingAnimationTexts && window.typingAnimationTexts[language]) {
      window.typingAnimation.reset(window.typingAnimationTexts[language]);
    }
  });
  
  // Call reveal animations
  revealOnScroll();
});