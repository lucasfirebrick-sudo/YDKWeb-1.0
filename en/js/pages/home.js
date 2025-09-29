/**
 * Home Page JavaScript
 * 首页特定功能的JavaScript代码
 */

class HomePage {
    constructor() {
        this.heroCarousel = null;
        this.productShowcase = document.querySelector('.product-showcase');
        this.aboutSection = document.querySelector('.about-section');
        this.ctaSection = document.querySelector('.cta-section');
        this.counterElements = document.querySelectorAll('.counter');
        this.animatedElements = document.querySelectorAll('[data-animate]');

        this.isCounterAnimated = false;
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        this.init();
    }

    init() {
        this.initHeroCarousel();
        this.initScrollAnimations();
        this.initCounterAnimations();
        this.initProductShowcase();
        this.initParallaxEffects();
        this.bindEvents();
        this.trackPageView();
    }

    initHeroCarousel() {
        const carouselElement = document.querySelector('.hero-carousel');
        if (!carouselElement) return;

        // Initialize hero carousel with advanced features
        this.heroCarousel = {
            element: carouselElement,
            slides: carouselElement.querySelectorAll('.hero-slide'),
            indicators: carouselElement.querySelectorAll('.carousel-indicator'),
            prevBtn: carouselElement.querySelector('.carousel-prev'),
            nextBtn: carouselElement.querySelector('.carousel-next'),
            currentSlide: 0,
            autoplayInterval: null,
            autoplayDelay: 5000,
            isPlaying: true
        };

        this.setupCarouselNavigation();
        this.startCarouselAutoplay();
        this.addCarouselKeyboardSupport();
        this.setupCarouselTouchSupport();
    }

    setupCarouselNavigation() {
        const { prevBtn, nextBtn, indicators } = this.heroCarousel;

        // Previous button
        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.prevSlide());
        }

        // Next button
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextSlide());
        }

        // Indicators
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToSlide(index));
        });

        // Pause on hover
        this.heroCarousel.element.addEventListener('mouseenter', () => this.pauseCarousel());
        this.heroCarousel.element.addEventListener('mouseleave', () => this.resumeCarousel());
    }

    nextSlide() {
        const { slides, currentSlide } = this.heroCarousel;
        const nextIndex = (currentSlide + 1) % slides.length;
        this.goToSlide(nextIndex);
    }

    prevSlide() {
        const { slides, currentSlide } = this.heroCarousel;
        const prevIndex = currentSlide === 0 ? slides.length - 1 : currentSlide - 1;
        this.goToSlide(prevIndex);
    }

    goToSlide(index) {
        const { slides, indicators } = this.heroCarousel;

        if (index < 0 || index >= slides.length || index === this.heroCarousel.currentSlide) return;

        // Remove active classes
        slides[this.heroCarousel.currentSlide].classList.remove('active');
        indicators[this.heroCarousel.currentSlide]?.classList.remove('active');

        // Add active classes
        slides[index].classList.add('active');
        indicators[index]?.classList.add('active');

        // Update current slide
        this.heroCarousel.currentSlide = index;

        // Trigger slide change animation
        this.animateSlideChange(index);

        // Track slide change
        this.trackEvent('Hero Carousel', 'Slide Change', `Slide ${index + 1}`);
    }

    animateSlideChange(index) {
        const slide = this.heroCarousel.slides[index];
        const content = slide.querySelector('.hero-content');

        if (content) {
            // Reset animation
            content.style.opacity = '0';
            content.style.transform = 'translateY(30px)';

            // Animate in
            setTimeout(() => {
                content.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                content.style.opacity = '1';
                content.style.transform = 'translateY(0)';
            }, 100);
        }
    }

    startCarouselAutoplay() {
        if (!this.heroCarousel.isPlaying) return;

        this.heroCarousel.autoplayInterval = setInterval(() => {
            this.nextSlide();
        }, this.heroCarousel.autoplayDelay);
    }

    pauseCarousel() {
        if (this.heroCarousel.autoplayInterval) {
            clearInterval(this.heroCarousel.autoplayInterval);
            this.heroCarousel.autoplayInterval = null;
        }
    }

    resumeCarousel() {
        if (this.heroCarousel.isPlaying && !this.heroCarousel.autoplayInterval) {
            this.startCarouselAutoplay();
        }
    }

    addCarouselKeyboardSupport() {
        document.addEventListener('keydown', (e) => {
            if (!this.isCarouselFocused()) return;

            switch (e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    this.prevSlide();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.nextSlide();
                    break;
                case ' ':
                    e.preventDefault();
                    this.toggleCarouselAutoplay();
                    break;
            }
        });
    }

    setupCarouselTouchSupport() {
        let startX = null;
        let currentX = null;
        const threshold = 50;

        this.heroCarousel.element.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });

        this.heroCarousel.element.addEventListener('touchmove', (e) => {
            if (!startX) return;
            currentX = e.touches[0].clientX;
        });

        this.heroCarousel.element.addEventListener('touchend', () => {
            if (!startX || !currentX) return;

            const diffX = startX - currentX;

            if (Math.abs(diffX) > threshold) {
                if (diffX > 0) {
                    this.nextSlide();
                } else {
                    this.prevSlide();
                }
            }

            startX = null;
            currentX = null;
        });
    }

    isCarouselFocused() {
        return this.heroCarousel.element.contains(document.activeElement) ||
               document.activeElement === document.body;
    }

    toggleCarouselAutoplay() {
        this.heroCarousel.isPlaying = !this.heroCarousel.isPlaying;

        if (this.heroCarousel.isPlaying) {
            this.startCarouselAutoplay();
        } else {
            this.pauseCarousel();
        }
    }

    initScrollAnimations() {
        // Intersection Observer for scroll animations
        this.scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                }
            });
        }, this.observerOptions);

        // Observe animated elements
        this.animatedElements.forEach(element => {
            this.scrollObserver.observe(element);
        });
    }

    animateElement(element) {
        const animationType = element.getAttribute('data-animate');

        switch (animationType) {
            case 'fade-up':
                element.style.opacity = '0';
                element.style.transform = 'translateY(30px)';
                element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';

                setTimeout(() => {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }, 100);
                break;

            case 'fade-in':
                element.style.opacity = '0';
                element.style.transition = 'opacity 1s ease';

                setTimeout(() => {
                    element.style.opacity = '1';
                }, 100);
                break;

            case 'slide-left':
                element.style.opacity = '0';
                element.style.transform = 'translateX(-50px)';
                element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';

                setTimeout(() => {
                    element.style.opacity = '1';
                    element.style.transform = 'translateX(0)';
                }, 100);
                break;

            case 'slide-right':
                element.style.opacity = '0';
                element.style.transform = 'translateX(50px)';
                element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';

                setTimeout(() => {
                    element.style.opacity = '1';
                    element.style.transform = 'translateX(0)';
                }, 100);
                break;

            case 'scale-up':
                element.style.opacity = '0';
                element.style.transform = 'scale(0.8)';
                element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';

                setTimeout(() => {
                    element.style.opacity = '1';
                    element.style.transform = 'scale(1)';
                }, 100);
                break;
        }

        // Stop observing once animated
        this.scrollObserver.unobserve(element);
    }

    initCounterAnimations() {
        if (this.counterElements.length === 0) return;

        // Observe counters section
        const countersSection = document.querySelector('.counters-section');
        if (countersSection) {
            this.counterObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !this.isCounterAnimated) {
                        this.animateCounters();
                        this.isCounterAnimated = true;
                    }
                });
            }, { threshold: 0.5 });

            this.counterObserver.observe(countersSection);
        }
    }

    animateCounters() {
        this.counterElements.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count')) || 0;
            const duration = 2000; // 2 seconds
            const increment = target / (duration / 16); // 60fps
            let current = 0;

            const updateCounter = () => {
                current += increment;

                if (current < target) {
                    counter.textContent = Math.floor(current).toLocaleString();
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target.toLocaleString();
                }
            };

            updateCounter();
        });
    }

    initProductShowcase() {
        if (!this.productShowcase) return;

        const productCards = this.productShowcase.querySelectorAll('.product-card');

        productCards.forEach(card => {
            // Add hover effects
            card.addEventListener('mouseenter', () => this.onProductHover(card));
            card.addEventListener('mouseleave', () => this.onProductLeave(card));

            // Track product clicks
            card.addEventListener('click', () => {
                const productName = card.querySelector('.product-title')?.textContent || 'Unknown';
                this.trackEvent('Product Showcase', 'Product Click', productName);
            });
        });

        // Initialize product showcase carousel if needed
        this.initProductCarousel();
    }

    onProductHover(card) {
        card.style.transform = 'translateY(-10px)';
        card.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';

        // Animate product image
        const image = card.querySelector('.product-image img');
        if (image) {
            image.style.transform = 'scale(1.05)';
        }
    }

    onProductLeave(card) {
        card.style.transform = 'translateY(0)';
        card.style.boxShadow = '';

        const image = card.querySelector('.product-image img');
        if (image) {
            image.style.transform = 'scale(1)';
        }
    }

    initProductCarousel() {
        const carouselContainer = this.productShowcase.querySelector('.product-carousel');
        if (!carouselContainer) return;

        const products = carouselContainer.querySelectorAll('.product-card');
        const productsPerView = this.getProductsPerView();
        let currentIndex = 0;

        // Create navigation buttons
        this.createProductNavigation(carouselContainer);

        // Auto-scroll products
        setInterval(() => {
            currentIndex = (currentIndex + 1) % Math.max(1, products.length - productsPerView + 1);
            this.scrollProductCarousel(carouselContainer, currentIndex);
        }, 4000);
    }

    getProductsPerView() {
        const width = window.innerWidth;
        if (width >= 1200) return 4;
        if (width >= 768) return 3;
        if (width >= 480) return 2;
        return 1;
    }

    scrollProductCarousel(container, index) {
        const cardWidth = container.querySelector('.product-card').offsetWidth;
        const gap = 20; // Gap between cards
        const scrollDistance = index * (cardWidth + gap);

        container.style.transform = `translateX(-${scrollDistance}px)`;
    }

    createProductNavigation(container) {
        const navContainer = document.createElement('div');
        navContainer.className = 'product-nav';

        const prevBtn = document.createElement('button');
        prevBtn.className = 'product-nav-btn prev';
        prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';

        const nextBtn = document.createElement('button');
        nextBtn.className = 'product-nav-btn next';
        nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';

        navContainer.appendChild(prevBtn);
        navContainer.appendChild(nextBtn);

        container.parentNode.appendChild(navContainer);
    }

    initParallaxEffects() {
        const parallaxElements = document.querySelectorAll('[data-parallax]');

        if (parallaxElements.length === 0) return;

        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset;

            parallaxElements.forEach(element => {
                const speed = parseFloat(element.getAttribute('data-parallax')) || 0.5;
                const yPos = -(scrollTop * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
        });
    }

    bindEvents() {
        // CTA Button clicks
        const ctaButtons = document.querySelectorAll('.cta-btn');
        ctaButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = btn.getAttribute('data-action') || 'CTA Click';
                this.trackEvent('CTA', action, btn.textContent.trim());
            });
        });

        // Quick contact form
        const quickContactForm = document.querySelector('#quickContactForm');
        if (quickContactForm) {
            quickContactForm.addEventListener('submit', (e) => this.handleQuickContact(e));
        }

        // Newsletter subscription
        const newsletterForm = document.querySelector('#newsletterForm');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => this.handleNewsletterSubscription(e));
        }

        // Social proof clicks
        const socialProofElements = document.querySelectorAll('.social-proof-item');
        socialProofElements.forEach(item => {
            item.addEventListener('click', () => {
                const proofType = item.getAttribute('data-proof-type') || 'Social Proof';
                this.trackEvent('Social Proof', 'Click', proofType);
            });
        });

        // Scroll to section links
        const scrollLinks = document.querySelectorAll('a[href^="#"]');
        scrollLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleSmoothScroll(e));
        });
    }

    async handleQuickContact(e) {
        e.preventDefault();

        const form = e.target;
        const formData = new FormData(form);
        const submitBtn = form.querySelector('button[type="submit"]');

        // Show loading state
        const originalText = submitBtn.textContent;
        submitBtn.textContent = '发送中...';
        submitBtn.disabled = true;

        try {
            // Simulate form submission
            await this.submitContactForm(formData);

            // Show success message
            this.showFormMessage(form, '消息发送成功！我们会尽快回复您。', 'success');
            form.reset();

            // Track successful submission
            this.trackEvent('Contact Form', 'Quick Contact Submit', 'Homepage');

        } catch (error) {
            console.error('Contact form error:', error);
            this.showFormMessage(form, '发送失败，请稍后重试。', 'error');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }

    async handleNewsletterSubscription(e) {
        e.preventDefault();

        const form = e.target;
        const emailInput = form.querySelector('input[type="email"]');
        const submitBtn = form.querySelector('button[type="submit"]');

        if (!this.isValidEmail(emailInput.value)) {
            this.showFormMessage(form, '请输入有效的邮箱地址。', 'error');
            return;
        }

        // Show loading state
        const originalText = submitBtn.textContent;
        submitBtn.textContent = '订阅中...';
        submitBtn.disabled = true;

        try {
            // Simulate subscription
            await this.submitNewsletterSubscription(emailInput.value);

            // Show success message
            this.showFormMessage(form, '订阅成功！感谢您的关注。', 'success');
            form.reset();

            // Track successful subscription
            this.trackEvent('Newsletter', 'Subscribe', 'Homepage');

        } catch (error) {
            console.error('Newsletter subscription error:', error);
            this.showFormMessage(form, '订阅失败，请稍后重试。', 'error');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }

    async submitContactForm(formData) {
        // Simulate API call
        return new Promise((resolve) => {
            setTimeout(resolve, 1500);
        });
    }

    async submitNewsletterSubscription(email) {
        // Simulate API call
        return new Promise((resolve) => {
            setTimeout(resolve, 1000);
        });
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    showFormMessage(form, message, type) {
        let messageElement = form.querySelector('.form-message');

        if (!messageElement) {
            messageElement = document.createElement('div');
            messageElement.className = 'form-message';
            form.appendChild(messageElement);
        }

        messageElement.textContent = message;
        messageElement.className = `form-message ${type}`;
        messageElement.style.display = 'block';

        // Auto-hide success messages
        if (type === 'success') {
            setTimeout(() => {
                messageElement.style.display = 'none';
            }, 5000);
        }
    }

    handleSmoothScroll(e) {
        e.preventDefault();

        const targetId = e.currentTarget.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });

            // Track scroll navigation
            this.trackEvent('Navigation', 'Smooth Scroll', targetId);
        }
    }

    trackPageView() {
        // Track page view
        this.trackEvent('Page View', 'Home Page', window.location.pathname);

        // Track time on page
        this.pageStartTime = Date.now();

        window.addEventListener('beforeunload', () => {
            const timeOnPage = Math.round((Date.now() - this.pageStartTime) / 1000);
            this.trackEvent('Engagement', 'Time on Page', `${timeOnPage}s`);
        });
    }

    trackEvent(category, action, label) {
        // Google Analytics tracking
        if (typeof gtag !== 'undefined') {
            gtag('event', action, {
                event_category: category,
                event_label: label
            });
        }

        // Console log for debugging
        console.log('Event tracked:', { category, action, label });
    }

    // Public methods for external access
    goToHeroSlide(index) {
        if (this.heroCarousel) {
            this.goToSlide(index);
        }
    }

    pauseHeroCarousel() {
        if (this.heroCarousel) {
            this.pauseCarousel();
        }
    }

    resumeHeroCarousel() {
        if (this.heroCarousel) {
            this.resumeCarousel();
        }
    }

    // Cleanup method
    destroy() {
        if (this.scrollObserver) {
            this.scrollObserver.disconnect();
        }

        if (this.counterObserver) {
            this.counterObserver.disconnect();
        }

        if (this.heroCarousel?.autoplayInterval) {
            clearInterval(this.heroCarousel.autoplayInterval);
        }
    }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.homePage = new HomePage();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HomePage;
}