class PortfolioManager {
    constructor() {
        this.sections = {
            "about-link": document.getElementById("about-me"),
            "projects-link": document.getElementById("projects"),
            "recognition-link": document.getElementById("recognition"),
            "contact-link": document.getElementById("contacts")
        };
        
        this.activeSection = "about-link";
        this.isTransitioning = false;
        this.transitionDuration = 300;
        
        this.init();
    }
    
    init() {
        this.setupInitialState();
        this.setupNavigationListeners();
        this.setupModalListeners();
        this.setupImagePopupListeners();
        this.setupKeyboardNavigation();
    }
    
    setupInitialState() {
        // Show about section by default with smooth animation
        const aboutSection = this.sections["about-link"];
        aboutSection.style.display = "flex";
        aboutSection.style.opacity = "0";
        aboutSection.style.transform = "scale(0.95)";
        
        // Animate in after a brief delay
        requestAnimationFrame(() => {
            aboutSection.style.opacity = "1";
            aboutSection.style.transform = "scale(1)";
        });
        
        // Set active state for about link
        document.getElementById("about-link").classList.add("active");
    }
    
    setupNavigationListeners() {
        const navLinks = document.querySelectorAll(".sidebar a");
        
        navLinks.forEach(link => {
            link.addEventListener("click", (event) => {
                event.preventDefault();
                
                // Prevent rapid clicking during transitions
                if (this.isTransitioning) return;
                
                const targetSectionId = link.id;
                
                // Don't do anything if clicking the same section
                if (targetSectionId === this.activeSection) return;
                
                this.switchSection(targetSectionId);
                this.updateActiveNavLink(link);
            });
        });
    }
    
    switchSection(targetSectionId) {
        if (!this.sections[targetSectionId]) return;
        
        this.isTransitioning = true;
        const currentSection = this.sections[this.activeSection];
        const targetSection = this.sections[targetSectionId];
        
        // Animate out current section
        currentSection.style.opacity = "0";
        currentSection.style.transform = "scale(0.95)";
        
        setTimeout(() => {
            // Hide current section
            currentSection.style.display = "none";
            
            // Show and animate in target section
            targetSection.style.display = "flex";
            targetSection.style.opacity = "0";
            targetSection.style.transform = "scale(0.95)";
            
            // Use requestAnimationFrame for smooth animation
            requestAnimationFrame(() => {
                targetSection.style.opacity = "1";
                targetSection.style.transform = "scale(1)";
            });
            
            // Update active section and allow new transitions
            this.activeSection = targetSectionId;
            
            setTimeout(() => {
                this.isTransitioning = false;
            }, this.transitionDuration);
            
        }, this.transitionDuration);
    }
    
    updateActiveNavLink(activeLink) {
        document.querySelectorAll(".sidebar a").forEach(link => {
            link.classList.remove("active");
            link.setAttribute("aria-current", "false");
        });
        
        activeLink.classList.add("active");
        activeLink.setAttribute("aria-current", "page");
    }
    
    setupKeyboardNavigation() {
        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                this.closeModal();
                this.closeImagePopup();
            }
        });
    }
    
    setupModalListeners() {
        const modal = document.getElementById("projectModal");
        if (!modal) return;
        
        // Close modal when clicking outside
        modal.addEventListener("click", (event) => {
            if (event.target === modal) {
                this.closeModal();
            }
        });
        
        // Close modal with close button
        const closeBtn = modal.querySelector(".close");
        if (closeBtn) {
            closeBtn.addEventListener("click", () => this.closeModal());
        }
    }
    
    setupImagePopupListeners() {
        const certImages = document.querySelectorAll('.certImg_img');
        const popUp = document.querySelector('.popUpImg');
        
        if (!popUp) return;
        
        certImages.forEach(image => {
            image.addEventListener('click', (event) => {
                this.openImagePopup(event.target.src);
            });
            
            // Add keyboard support for images
            image.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    this.openImagePopup(event.target.src);
                }
            });
            
            // Make images focusable
            image.setAttribute('tabindex', '0');
            image.setAttribute('role', 'button');
            image.setAttribute('aria-label', 'View certificate image');
        });
        
        // Close popup when clicking outside image
        popUp.addEventListener('click', (event) => {
            if (event.target !== popUp.querySelector('img')) {
                this.closeImagePopup();
            }
        });
        
        // Close button for popup
        const closeBtn = popUp.querySelector('.close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeImagePopup());
        }
    }
    
    openImagePopup(imageSrc) {
        const popUp = document.querySelector('.popUpImg');
        const popUpImg = popUp.querySelector('img');
        
        if (!popUp || !popUpImg) return;
        
        popUpImg.src = imageSrc;
        popUp.style.display = 'flex';
        
        // Focus trap for accessibility
        popUp.focus();
    }
    
    closeImagePopup() {
        const popUp = document.querySelector('.popUpImg');
        if (popUp) {
            popUp.style.display = 'none';
        }
    }
    
    openModal(title, description, imageSrc = '', linkHref = '') {
        const modal = document.getElementById("projectModal");
        const modalTitle = document.getElementById("modalTitle");
        const modalDescription = document.getElementById("modalDescription");
        const modalImage = document.getElementById("modalImage");
        const modalLink = document.getElementById("modalLink");
        
        if (!modal || !modalTitle || !modalDescription) return;
        
        // Set modal content
        modalTitle.textContent = title;
        modalDescription.textContent = description;
        
        // Handle modal image
        if (modalImage) {
            if (imageSrc) {
                modalImage.style.display = 'block';
                modalImage.src = imageSrc;
                modalImage.alt = `${title} project screenshot`;
            } else {
                modalImage.style.display = 'none';
            }
        }
        
        // Handle modal link
        if (modalLink) {
            if (linkHref) {
                modalLink.style.display = 'inline-block';
                modalLink.href = linkHref;
            } else {
                modalLink.style.display = 'none';
            }
        }
        
        // Show modal with animation
        modal.style.display = "flex";
        modal.style.opacity = "0";
        
        requestAnimationFrame(() => {
            modal.style.opacity = "1";
        });
        
        // Focus management for accessibility
        const firstFocusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (firstFocusable) {
            firstFocusable.focus();
        }
    }
    
    closeModal() {
        const modal = document.getElementById("projectModal");
        if (!modal) return;
        
        modal.style.opacity = "0";
        
        setTimeout(() => {
            modal.style.display = "none";
        }, 200);
    }
}

// Enhanced global functions for backward compatibility
let portfolioManager;

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", function() {
    portfolioManager = new PortfolioManager();
});

// Global functions for modal (called from HTML onclick attributes)
function openModal(title, description, imageSrc = '', linkHref = '') {
    if (portfolioManager) {
        portfolioManager.openModal(title, description, imageSrc, linkHref);
    }
}

function closeModal() {
    if (portfolioManager) {
        portfolioManager.closeModal();
    }
}

// Utility functions for performance optimization
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Smooth scrolling utility (if needed for future features)
const smoothScrollTo = (element, duration = 300) => {
    const targetPosition = element.offsetTop;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;
    
    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = ease(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    }
    
    function ease(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }
    
    requestAnimationFrame(animation);
};

// Performance monitoring (optional)
if (typeof performance !== 'undefined') {
    window.addEventListener('load', () => {
        const loadTime = performance.now();
        console.log(`Portfolio loaded in ${loadTime.toFixed(2)}ms`);
    });
}
let currentSlideIndex = 0;
const slides = document.querySelectorAll('.carousel-slide');
const wrapper = document.getElementById('carouselWrapper');
const dotsContainer = document.querySelector('.carousel-nav'); // Changed from getElementById to querySelector

// Generate dots based on number of slides
function generateDots() {
    dotsContainer.innerHTML = '';
    for (let i = 0; i < slides.length; i++) {
        const dot = document.createElement('span');
        dot.className = 'carousel-dot';
        if (i === 0) dot.classList.add('active');
        dot.setAttribute('onclick', `currentSlide(${i + 1})`);
        dotsContainer.appendChild(dot);
    }
}

// Initialize dots
generateDots();

const dots = document.querySelectorAll('.carousel-dot');

function showSlide(index) {
    if (index >= slides.length) currentSlideIndex = 0;
    if (index < 0) currentSlideIndex = slides.length - 1;
    
    wrapper.style.transform = `translateX(-${currentSlideIndex * 100}%)`;
    
    // Update dots - need to re-query dots after generation
    const currentDots = document.querySelectorAll('.carousel-dot');
    currentDots.forEach(dot => dot.classList.remove('active'));
    currentDots[currentSlideIndex].classList.add('active');
}

function nextSlide() {
    currentSlideIndex++;
    showSlide(currentSlideIndex);
}

function prevSlide() {
    currentSlideIndex--;
    showSlide(currentSlideIndex);
}

function currentSlide(index) {
    currentSlideIndex = index - 1;
    showSlide(currentSlideIndex);
}

// Auto-advance carousel (optional)
setInterval(() => {
    nextSlide();
}, 5000); // Change slide every 5 seconds

// Popup functionality for certification images
document.querySelectorAll('.certification img').forEach(img => {
    img.addEventListener('click', function() {
        const popupImg = document.querySelector('.popUpImg');
        const popupImage = document.querySelector('.popup-image');
        
        popupImage.src = this.src;
        popupImage.alt = this.alt;
        popupImg.style.display = 'flex';
    });
});

// Close popup
document.querySelector('.popUpImg').addEventListener('click', function() {
    this.style.display = 'none';
});

document.querySelector('.close').addEventListener('click', function() {
    document.querySelector('.popUpImg').style.display = 'none';
});

// Prevent popup from closing when clicking on the image
document.querySelector('.popup-image').addEventListener('click', function(e) {
    e.stopPropagation();
});