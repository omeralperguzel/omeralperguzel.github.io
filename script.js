// List of sentences for typing animation
var _CONTENT = [ 
	"Ben kodluyorum.", 
	"Ben tasarlıyorum.", 
	"Ben çiziyorum."
];

// Variables for typing effect
var _PART = 0;
var _PART_INDEX = 0;
var _INTERVAL_VAL;
var _ELEMENT = null;
var _CURSOR = null;

// Initialize typing effect
function initTypingEffect() {
  _ELEMENT = document.querySelector("#text");
  _CURSOR = document.querySelector("#cursor");
  
  if (_ELEMENT && _CURSOR) {
    _PART = 0;
    _PART_INDEX = 0;
    if (_INTERVAL_VAL) {
      clearInterval(_INTERVAL_VAL);
    }
    _INTERVAL_VAL = setInterval(Type, 100);
  }
}

// Implements typing effect
function Type() { 
  if (!_ELEMENT || !_CURSOR) return;
  
	// Get substring with 1 character added
	var text = _CONTENT[_PART].substring(0, _PART_INDEX + 1);
	_ELEMENT.innerHTML = text;
	_PART_INDEX++;

	// If full sentence has been displayed then start to delete the sentence after some time
	if(text === _CONTENT[_PART]) {
		// Hide the cursor
		_CURSOR.style.display = 'none';

		clearInterval(_INTERVAL_VAL);
		setTimeout(function() {
			_INTERVAL_VAL = setInterval(Delete, 50);
		}, 1000);
	}
}

// Implements deleting effect
function Delete() {
  if (!_ELEMENT || !_CURSOR) return;
  
	// Get substring with 1 character deleted
	var text = _CONTENT[_PART].substring(0, _PART_INDEX - 1);
	_ELEMENT.innerHTML = text;
	_PART_INDEX--;

	// If sentence has been deleted then start to display the next sentence
	if(text === '') {
		clearInterval(_INTERVAL_VAL);

		// If current sentence was last then display the first one, else move to the next
		if(_PART == (_CONTENT.length - 1))
			_PART = 0;
		else
			_PART++;
		
		_PART_INDEX = 0;

		// Start to display the next sentence after some time
		setTimeout(function() {
			_CURSOR.style.display = 'inline-block';
			_INTERVAL_VAL = setInterval(Type, 100);
		}, 200);
	}
}

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
  
  // Initialize typing effect if on home page
  if (document.getElementById('text') && document.getElementById('cursor')) {
    initTypingEffect();
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
  
  // Call reveal animations
  revealOnScroll();
});