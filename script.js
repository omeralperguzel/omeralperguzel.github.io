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
    if (header) {
      if (window.scrollY > 50) {
        header.classList.add('py-2');
        header.classList.add('shadow-lg');
      } else {
        header.classList.remove('py-2');
        header.classList.remove('shadow-lg');
      }
    }
    
    // Call reveal animations
    revealOnScroll();
  });
});