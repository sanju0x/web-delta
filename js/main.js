/* ============================================================================
 * GLOBAL CONSTANTS
 * ============================================================================ */

const DOWNLOAD_URL = `https://discord.com/oauth2/authorize?client_id=1284517036260855901&permissions=66448640&integration_type=0&scope=bot+applications.commands`;

const NOTICE = {
    title: "Notice",
    text: "Join our community now to access exclusive features, updates, and perks! Don't miss out—be a part of the experience!",
    color: "#efefef",
    background: "#222",
    icon: "info",
    confirmButtonText: "Understood",
};

const INVITESS = {
    title: '<p class="coregrad-string" style="font-weight: 600;font-size: 2rem;">Directing To Bot Invite Link</p>',
    text: "A new sort of feature has came up check the updates",
    icon: "success",
    color: "#efefef",
    background: "#222",
    showDenyButton: true,
    denyButtonColor: "#343434",
    denyButtonText: "Close",
};

/* ============================================================================
 * DOM ELEMENTS CACHE
 * ============================================================================ */

let elements = {
    video: null,
    blurScreen: null,
    centerText: null,
    brandingImage: null,
    overlay: null,
    navbarContainer: null,
    navDownloadButton: null
};

/* ============================================================================
 * UTILITY FUNCTIONS
 * ============================================================================ */

/**
 * Debounce function to limit the rate at which a function can fire
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle function to ensure a function is called at most once per specified period
 */
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Check if element is in viewport
 */
function isElementInViewport(el) {
    if (!el) return false;
    
    const rect = el.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const windowWidth = window.innerWidth || document.documentElement.clientWidth;
    
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= windowHeight &&
        rect.right <= windowWidth
    );
}

/**
 * Create visibility change handler
 */
function createVisibilityHandler(el, callback) {
    let wasVisible = false;
    
    return function() {
        const isVisible = isElementInViewport(el);
        if (isVisible !== wasVisible) {
            wasVisible = isVisible;
            if (typeof callback === 'function') {
                callback(isVisible);
            }
        }
    };
}

/* ============================================================================
 * MAIN VIDEO BACKGROUND SETUP
 * ============================================================================ */

function setupVideoBackground() {
    const video = elements.video;
    if (!video) return;
    
    // Use requestAnimationFrame for better performance
    let animationFrameId = null;
    
    video.addEventListener('loadeddata', function() {
        const colorThief = new ColorThief();
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Set canvas size to match video (scaled down for performance)
        canvas.width = 100;
        canvas.height = Math.floor(100 * (video.videoHeight / video.videoWidth));
        
        function updateBoxShadow() {
            // Only update if video is playing and ready
            if (video.paused || video.ended || video.readyState < 2) {
                animationFrameId = requestAnimationFrame(updateBoxShadow);
                return;
            }
            
            // Draw video frame to canvas (scaled down for performance)
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            
            try {
                const dominantColor = colorThief.getColor(canvas);
                const [r, g, b] = dominantColor;
                const rgbColor = `rgb(${r}, ${g}, ${b})`;
                
                // Use CSS custom properties for better performance
                video.style.setProperty('--shadow-color', rgbColor);
                video.style.boxShadow = `0 0 70px 10px ${rgbColor}, 
                                         0 0 50px 10px rgba(${r}, ${g}, ${b}, 0.5)`;
            } catch (error) {
                // Fallback color if extraction fails
                video.style.boxShadow = `0 0 70px 10px rgba(100, 100, 255, 0.8),
                                         0 0 50px 10px rgba(100, 100, 255, 0.4)`;
            }
            
            // Limit update rate to 15fps for performance
            setTimeout(() => {
                animationFrameId = requestAnimationFrame(updateBoxShadow);
            }, 66);
        }
        
        // Start the animation
        updateBoxShadow();
    });
    
    // Clean up on video stop
    video.addEventListener('pause', () => {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
    });
}

/* ============================================================================
 * DYNAMIC TITLE ANIMATION
 * ============================================================================ */

const TITLES = [
    "Delta Music",
    "@Delta 4K",
    "Listen to the music",
    "4k music streaming",
    "@DELTA",
    "Music",
    "Spotify Streams",
    "Apple Music Streamers",
    "DJ Support",
    "Make An Room Of Music"
];

class TitleAnimator {
    constructor() {
        this.currentTitle = '';
        this.isAnimating = false;
        this.animationSpeed = 100; // ms per character
        this.intervalId = null;
    }
    
    getRandomTitle() {
        const titles = TITLES.filter(title => title !== this.currentTitle);
        return titles[Math.floor(Math.random() * titles.length)];
    }
    
    animateTitle(newTitle) {
        if (this.isAnimating || !newTitle) return;
        
        this.isAnimating = true;
        const currentTitle = document.title;
        let step = 0;
        const totalSteps = currentTitle.length + newTitle.length;
        
        this.intervalId = setInterval(() => {
            if (step < currentTitle.length) {
                // Delete phase
                document.title = currentTitle.substring(0, currentTitle.length - step - 1);
            } else if (step < totalSteps) {
                // Type phase
                const typeIndex = step - currentTitle.length;
                document.title = newTitle.substring(0, typeIndex + 1);
            } else {
                // Animation complete
                clearInterval(this.intervalId);
                this.currentTitle = newTitle;
                this.isAnimating = false;
                return;
            }
            step++;
        }, this.animationSpeed);
    }
    
    start() {
        // Initial title
        this.currentTitle = this.getRandomTitle();
        document.title = this.currentTitle;
        
        // Start periodic changes
        setInterval(() => {
            if (!this.isAnimating) {
                const newTitle = this.getRandomTitle();
                this.animateTitle(newTitle);
            }
        }, 5000);
    }
}

/* ============================================================================
 * BLUR SCREEN HANDLER
 * ============================================================================ */

function setupBlurScreen() {
    const { blurScreen, centerText, video, brandingImage } = elements;
    
    if (!blurScreen || !centerText || !video || !brandingImage) return;
    
    centerText.addEventListener("click", function() {
        // Play video if supported
        const playPromise = video.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.warn("Video autoplay prevented:", error);
                // Show play button or instructions
            });
        }
        
        // Smooth scroll to top
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        
        // Fade out blur screen
        blurScreen.style.transition = 'opacity 0.5s ease, visibility 0.5s ease';
        blurScreen.style.opacity = '0';
        blurScreen.style.visibility = 'hidden';
        
        // Animate branding image
        brandingImage.style.transition = 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.8s ease';
        brandingImage.style.transform = 'translateY(-20px) scale(1.1)';
        brandingImage.style.opacity = '0.9';
        
        // Reset animation after completion
        setTimeout(() => {
            brandingImage.style.transform = 'translateY(0) scale(1)';
            brandingImage.style.opacity = '1';
        }, 800);
    });
    
    // Video playback control
    video.addEventListener('click', function() {
        if (video.paused) {
            video.play();
        } else {
            video.pause();
        }
    });
}

/* ============================================================================
 * OVERLAY MENU FUNCTIONS
 * ============================================================================ */

function openNav() {
    const overlay = elements.overlay;
    const navbar = elements.navbarContainer;
    
    if (overlay) {
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }
    
    if (navbar) {
        navbar.style.opacity = '0';
        navbar.style.pointerEvents = 'none';
    }
}

function closeNav() {
    const overlay = elements.overlay;
    const navbar = elements.navbarContainer;
    
    if (overlay) {
        overlay.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    }
    
    if (navbar) {
        navbar.style.opacity = '1';
        navbar.style.pointerEvents = 'auto';
    }
}

/* ============================================================================
 * INVITE LINK HANDLER
 * ============================================================================ */

function invitelink() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
        // Direct redirect for mobile users
        window.location.href = DOWNLOAD_URL;
        return;
    }
    
    // Desktop flow with SweetAlerts
    Swal.fire(NOTICE).then(() => {
        Swal.fire(INVITESS).then((result) => {
            if (result.isConfirmed) {
                window.location.href = "https://discord.com/oauth2/authorize?client_id=1284517036260855901&permissions=66448640&integration_type=0&scope=bot+applications.commands";
            } else {
                Swal.close();
            }
        });
    }).catch(() => {
        // Fallback if SweetAlert fails
        window.location.href = DOWNLOAD_URL;
    });
}

/* ============================================================================
 * MODULES INTERACTIVE SYSTEM
 * ============================================================================ */

const module_list = window.module_list || {};

function changeAbtModuleTo(name, element) {
    const selectedElements = document.getElementsByClassName("module-array-img-selected");
    
    // Remove selection from previous element
    if (selectedElements.length > 0) {
        selectedElements[0].classList.remove("module-array-img-selected");
    }
    
    // Add selection to clicked element
    if (element) {
        element.classList.add("module-array-img-selected");
    }
    
    const whole = document.getElementById("modules-interactive-info");
    const title = document.getElementById("about-module-info-header");
    const description = document.getElementById("about-module-info-description");
    const image = document.getElementById("about-module-info-img");
    
    if (!whole || !title || !description || !image) return;
    
    // Add animation class
    whole.classList.add("toLeft");
    
    // Update content after animation starts
    setTimeout(() => {
        title.textContent = name;
        description.textContent = module_list[name] || "Description not available";
        image.src = `/img/Module/Card/${name}.png`;
        image.onerror = function() {
            this.src = '/img/Module/Card/default.png'; // Fallback image
        };
        
        // Remove animation class
        setTimeout(() => {
            whole.classList.remove("toLeft");
        }, 50);
    }, 300);
}

function initializeModules() {
    if (!module_list || Object.keys(module_list).length === 0) return;
    
    const moduleNames = Object.keys(module_list);
    
    // Populate module arrays
    moduleNames.forEach((name, index) => {
        const arrayIndex = index >= 5 ? 2 : 1;
        const arrayElement = document.getElementById(`array-${arrayIndex}`);
        
        if (arrayElement) {
            const img = document.createElement('img');
            img.src = `/img/Module/Icon/${name}.png`;
            img.className = 'module-array-img';
            img.alt = name;
            img.onclick = () => changeAbtModuleTo(name, img);
            img.onerror = function() {
                this.src = '/img/Module/Icon/default.png'; // Fallback icon
            };
            
            arrayElement.appendChild(img);
        }
    });
    
    // Select first module
    const firstArray = document.getElementById('array-1');
    if (firstArray && firstArray.firstElementChild) {
        changeAbtModuleTo(moduleNames[0], firstArray.firstElementChild);
    }
}

/* ============================================================================
 * INTERSECTION OBSERVER SETUP
 * ============================================================================ */

function setupIntersectionObservers() {
    const downloadButton = document.getElementById("dlbutton");
    const navDownloadButton = elements.navDownloadButton;
    const sections = document.querySelectorAll(".body-container");
    
    if (!downloadButton || !navDownloadButton) return;
    
    // Set up visibility handler for download button
    const visibilityHandler = createVisibilityHandler(downloadButton, (isVisible) => {
        navDownloadButton.classList.toggle("not-active", isVisible);
    });
    
    // Initial check
    visibilityHandler();
    
    // Event listeners for visibility changes
    const throttledHandler = throttle(visibilityHandler, 100);
    window.addEventListener('scroll', throttledHandler, { passive: true });
    window.addEventListener('resize', throttledHandler, { passive: true });
    
    // Set up observer for sections
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            entry.target.classList.toggle("body-container-visible", entry.isIntersecting);
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    sections.forEach(section => sectionObserver.observe(section));
}

/* ============================================================================
 * INITIALIZATION
 * ============================================================================ */

document.addEventListener("DOMContentLoaded", function() {
    // Cache DOM elements
    elements = {
        video: document.querySelector('.main-video video'),
        blurScreen: document.querySelector(".blur-screen"),
        centerText: document.querySelector(".center-text"),
        brandingImage: document.querySelector('.branding > img'),
        overlay: document.getElementById("myNav"),
        navbarContainer: document.getElementById("navbar-container"),
        navDownloadButton: document.getElementById("nav-dlbutton")
    };
    
    // Initialize components
    setupVideoBackground();
    setupBlurScreen();
    initializeModules();
    setupIntersectionObservers();
    
    // Start title animation
    const titleAnimator = new TitleAnimator();
    titleAnimator.start();
    
    // Close overlay when clicking outside on mobile
    if (elements.overlay) {
        elements.overlay.addEventListener('click', function(e) {
            if (e.target === this) {
                closeNav();
            }
        });
        
        // Close overlay with Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && elements.overlay.classList.contains('active')) {
                closeNav();
            }
        });
    }
    
    // Add touch support for mobile
    if ('ontouchstart' in window) {
        document.documentElement.classList.add('touch-device');
    }
});

// Cleanup on page unload
window.addEventListener('beforeunload', function() {
    // Cancel any ongoing animations or timeouts
    const titleAnimator = window.titleAnimator;
    if (titleAnimator && titleAnimator.intervalId) {
        clearInterval(titleAnimator.intervalId);
    }
    
    // Clean up video
    const video = elements.video;
    if (video) {
        video.pause();
        video.currentTime = 0;
    }
});

// Error handling
window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
    // You could add error reporting here
});

/* ============================================================================
 * EXPORTS (if needed for module system)
 * ============================================================================ */

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        invitelink,
        openNav,
        closeNav,
        changeAbtModuleTo
    };
      }
