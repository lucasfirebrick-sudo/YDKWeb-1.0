// Henan Yuandake Refractory Materials Co., Ltd. Website - Core Script File

document.addEventListener('DOMContentLoaded', function() {

    // Mobile navigation menu functionality moved to navigation-loader.js

    // Scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, observerOptions);

    // Observe all elements that need animation
    const animatedElements = document.querySelectorAll('.scroll-reveal');
    animatedElements.forEach(el => observer.observe(el));

    // Hero carousel functionality is now managed by SlideManager, initialized at bottom

    // Product filtering functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.dataset.filter;

            // Update button state
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Filter products
            productCards.forEach(card => {
                if (filter === 'all' || card.dataset.category === filter) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeIn 0.3s ease';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // Smooth scrolling
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Page load completion animation
    document.body.classList.add('loaded');

    // Navigation scroll effects moved to navigation-loader.js

    // Form submission handling
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            // Form validation and submission logic can be added here
        });
    });

});

// Global utility functions
window.YuandakeUtils = {
    // Show notification
    showNotification: function(message, type = 'info') {
    },

    // Format phone number
    formatPhone: function(phone) {
        return phone.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
    }
};

// Quick inquiry functionality handler
document.addEventListener('DOMContentLoaded', function() {
    // Bind all quick inquiry buttons
    document.querySelectorAll('[data-action="quick-inquiry"]').forEach(btn => {
        btn.addEventListener('click', function() {
            // If there's an inquiry form modal, trigger it
            if (typeof showQuickInquiry === 'function') {
                showQuickInquiry();
            } else if (document.getElementById('aiSelectorTrigger')) {
                // Trigger AI selector
                document.getElementById('aiSelectorTrigger').click();
            } else {
                // Temporary fallback: redirect to contact page
                window.location.href = 'contact.html';
            }
        });
    });
});

// Universal carousel manager
const SlideManager = {
    // Hero carousel instance
    hero: null,
    // Project carousel instance
    project: null,

    // Initialize carousel
    initSlideShow(config) {
        const {
            containerSelector,
            slidesSelector,
            indicatorsSelector,
            prevBtnSelector,
            nextBtnSelector,
            autoPlay = true,
            interval = 5000
        } = config;

        const container = document.querySelector(containerSelector);
        if (!container) return null;

        const slides = container.querySelectorAll(slidesSelector);
        const indicators = indicatorsSelector ? container.querySelectorAll(indicatorsSelector) : [];
        const prevBtn = prevBtnSelector ? document.querySelector(prevBtnSelector) : null;
        const nextBtn = nextBtnSelector ? document.querySelector(nextBtnSelector) : null;

        if (slides.length === 0) return null;

        let currentIndex = 0;
        let autoPlayInterval = null;

        const instance = {
            showSlide(index) {
                slides.forEach((slide, i) => {
                    slide.classList.remove('active');
                    if (indicators[i]) indicators[i].classList.remove('active');
                });

                if (slides[index]) {
                    slides[index].classList.add('active');
                    if (indicators[index]) indicators[index].classList.add('active');
                }
                currentIndex = index;
            },

            nextSlide() {
                const next = (currentIndex + 1) % slides.length;
                this.showSlide(next);
            },

            prevSlide() {
                const prev = (currentIndex - 1 + slides.length) % slides.length;
                this.showSlide(prev);
            },

            startAutoPlay() {
                if (autoPlay) {
                    autoPlayInterval = setInterval(() => this.nextSlide(), interval);
                }
            },

            stopAutoPlay() {
                if (autoPlayInterval) {
                    clearInterval(autoPlayInterval);
                    autoPlayInterval = null;
                }
            },

            restartAutoPlay() {
                this.stopAutoPlay();
                this.startAutoPlay();
            }
        };

        // Bind events
        if (nextBtn) nextBtn.addEventListener('click', () => {
            instance.nextSlide();
            instance.restartAutoPlay();
        });

        if (prevBtn) prevBtn.addEventListener('click', () => {
            instance.prevSlide();
            instance.restartAutoPlay();
        });

        // Indicator clicks
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                instance.showSlide(index);
                instance.restartAutoPlay();
            });
        });

        // Mouse hover pause
        if (container) {
            container.addEventListener('mouseenter', () => instance.stopAutoPlay());
            container.addEventListener('mouseleave', () => instance.startAutoPlay());
        }

        // Initialize
        instance.showSlide(0);
        instance.startAutoPlay();

        return instance;
    }
};

// Initialize all carousels
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Hero carousel
    SlideManager.hero = SlideManager.initSlideShow({
        containerSelector: '#heroSlider',
        slidesSelector: '.slide',
        indicatorsSelector: '.indicator',
        prevBtnSelector: '#heroPrev',
        nextBtnSelector: '#heroNext',
        autoPlay: true,
        interval: 5000
    });

    // Initialize project carousel
    SlideManager.project = SlideManager.initSlideShow({
        containerSelector: '.project-carousel',
        slidesSelector: '.project-slide',
        indicatorsSelector: '.carousel-indicators .indicator',
        prevBtnSelector: '.carousel-btn:first-child',
        nextBtnSelector: '.carousel-btn:last-child',
        autoPlay: true,
        interval: 5000
    });
});

// Backward compatible global functions
window.nextSlide = function() {
    if (SlideManager.project) SlideManager.project.nextSlide();
};

window.prevSlide = function() {
    if (SlideManager.project) SlideManager.project.prevSlide();
};

window.currentSlide = function(index) {
    if (SlideManager.project) SlideManager.project.showSlide(index - 1);
};

