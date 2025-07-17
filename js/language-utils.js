/**
 * Language Utilities for the website
 * Handles language switching, URL routing, and translation application
 */

// Global language utility object
const LanguageUtils = {
  // Ensure default language is Turkish
  defaultLanguage: 'tr',
  
  // Available languages
  availableLanguages: ['tr', 'en'],
  
  // Common translations that apply to all pages
  commonTranslations: {
    tr: {
      'lang-home': 'Ana Sayfa',
      'lang-about': 'Hakkımda',
      'lang-coding': 'Yazılım',
      'lang-design': 'Tasarım',
      'lang-drawing': 'Çizim',
      'lang-certificates': 'Sertifikalar'
    },
    en: {
      'lang-home': 'Home',
      'lang-about': 'About',
      'lang-coding': 'Coding',
      'lang-design': 'Design',
      'lang-drawing': 'Drawing',
      'lang-certificates': 'Certificates'
    }
  },
  
  // Initialize language settings
  init: function() {
    // First check URL path for language
    const pathLanguage = this.getLanguageFromPath();
    
    // If language is specified in URL, use it
    if (pathLanguage) {
      this.applyLanguage(pathLanguage, false);
      return;
    }
    
    // Otherwise check localStorage, default to Turkish if not set
    const savedLanguage = localStorage.getItem('language') || this.defaultLanguage;
    
    // Apply saved language and update URL
    this.applyLanguage(savedLanguage, true);
  },
  
  // Extract language code from current URL
  getLanguageFromPath: function() {
    const path = window.location.pathname;
    
    // Check if URL contains language segment
    for (let lang of this.availableLanguages) {
      // Match either /en/ or /en at end of URL
      if (path.includes(`/${lang}/`) || path.endsWith(`/${lang}`)) {
        return lang;
      }
    }
    
    return null;
  },
  
  // Change URL to reflect language without reloading page
  updateUrlPath: function(language) {
    if (!history.pushState) return; // Ignore if browser doesn't support history API
    
    let path = window.location.pathname;
    let newPath = path;
    
    // Remove any existing language code from path
    for (let lang of this.availableLanguages) {
      newPath = newPath.replace(`/${lang}/`, '/');
      newPath = newPath.replace(`/${lang}`, '');
    }
    
    // Ensure path starts with / if it's empty after replacements
    if (!newPath || newPath === '') {
      newPath = '/';
    }
    
    // Add new language code to path
    // If it already ends with a slash, add language code
    if (newPath.endsWith('/')) {
      newPath = `${newPath}${language}`;
    } 
    // If it's just the root, add language with slash
    else if (newPath === '/') {
      newPath = `/${language}`;
    }
    // Otherwise add slash + language
    else {
      newPath = `${newPath}/${language}`;
    }
    
    // Update URL without reloading page
    window.history.pushState({}, document.title, newPath);
  },
  
  // Apply language to page - make sure this properly applies translations
  applyLanguage: function(language, updateUrl = true) {
    // Ensure language is one we support, default to Turkish
    if (!this.availableLanguages.includes(language)) {
      language = 'tr'; // Force to Turkish if invalid
    }
    
    // Update HTML lang attribute
    document.documentElement.setAttribute('lang', language);
    document.documentElement.setAttribute('data-language', language);
    
    // Get page-specific translations
    let translations = this.commonTranslations;
    
    // If page defines its own translations object, merge with common translations
    if (window.pageTranslations) {
      translations = {
        tr: {...this.commonTranslations.tr, ...pageTranslations.tr},
        en: {...this.commonTranslations.en, ...pageTranslations.en}
      };
    }
    
    // Apply translations to elements
    this.applyTranslations(translations[language]);
    
    // Update language toggle buttons
    this.updateLanguageToggles(language);
    
    // Update URL if needed
    if (updateUrl) {
      this.updateUrlPath(language);
    }
    
    // Store preference in localStorage
    localStorage.setItem('language', language);
    
    // Handle special cases (e.g., typing animation on home page)
    this.handleSpecialCases(language);
    
    // Dispatch an event so other scripts can react to language change
    const event = new CustomEvent('languageChanged', { detail: { language } });
    document.dispatchEvent(event);
  },
  
  // Apply translations to page elements
  applyTranslations: function(translationSet) {
    if (!translationSet) return;
    
    Object.keys(translationSet).forEach(key => {
      const elements = document.querySelectorAll('.' + key);
      elements.forEach(el => {
        el.textContent = translationSet[key];
      });
    });
  },
  
  // Update language toggle buttons
  updateLanguageToggles: function(language) {
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
  },
  
  // Handle special cases for specific pages
  handleSpecialCases: function(language) {
    // Handle typing animation on home page
    if (window.typingAnimation && window.typingAnimationTexts) {
      const texts = window.typingAnimationTexts[language];
      if (texts) {
        window.typingAnimation.reset(texts);
      }
    }
  },
  
  // Switch language
  switchLanguage: function(language) {
    if (!this.availableLanguages.includes(language)) return;
    
    // If current language is already the requested one, do nothing
    const currentLanguage = document.documentElement.getAttribute('data-language');
    if (language === currentLanguage) return;
    
    this.applyLanguage(language);
  },
  
  // Toggle between available languages
  toggleLanguage: function() {
    const currentLanguage = document.documentElement.getAttribute('data-language');
    const newLanguage = currentLanguage === 'tr' ? 'en' : 'tr';
    this.switchLanguage(newLanguage);
  },
  
  // Set up event listeners for language toggle buttons
  setupEventListeners: function() {
    const langToggles = document.querySelectorAll('#languageToggle, #mobileLanguageToggle');
    langToggles.forEach(toggle => {
      toggle.addEventListener('click', () => this.toggleLanguage());
    });
  }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Ensure default language is set to Turkish
  document.documentElement.setAttribute('lang', 'tr');
  document.documentElement.setAttribute('data-language', 'tr');
  
  // Initialize
  LanguageUtils.init();
  LanguageUtils.setupEventListeners();
});

// Also handle page loads
window.addEventListener('load', function() {
  // Re-apply language in case DOMContentLoaded was missed
  const savedLanguage = localStorage.getItem('language') || LanguageUtils.defaultLanguage;
  LanguageUtils.applyLanguage(savedLanguage, false); // Don't update URL on page load
});