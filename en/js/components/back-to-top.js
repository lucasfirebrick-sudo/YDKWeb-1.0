/**
 * Back to Top & Floating Buttons Component
 * 负责返回顶部和其他浮动按钮的功能
 */

class BackToTopComponent {
    constructor() {
        this.backToTopBtn = document.querySelector('.back-to-top');
        this.floatingButtons = document.querySelectorAll('.floating-buttons .floating-btn');
        this.whatsappBtn = document.querySelector('.whatsapp-btn');
        this.quickQuoteBtn = document.querySelector('.quick-quote-btn');
        this.customerServiceBtn = document.querySelector('.customer-service-btn');

        this.scrollThreshold = 300;
        this.isVisible = false;
        this.lastScrollTop = 0;
        this.scrollDirection = 'up';

        this.init();
    }

    init() {
        this.bindEvents();
        this.handleScroll();
        this.initTooltips();
        this.initAnimations();
    }

    bindEvents() {
        // Back to top button click
        if (this.backToTopBtn) {
            this.backToTopBtn.addEventListener('click', (e) => this.scrollToTop(e));
        }

        // WhatsApp button click
        if (this.whatsappBtn) {
            this.whatsappBtn.addEventListener('click', (e) => this.handleWhatsAppClick(e));
        }

        // Quick quote button click
        if (this.quickQuoteBtn) {
            this.quickQuoteBtn.addEventListener('click', (e) => this.handleQuickQuoteClick(e));
        }

        // Customer service button click
        if (this.customerServiceBtn) {
            this.customerServiceBtn.addEventListener('click', (e) => this.handleCustomerServiceClick(e));
        }

        // Scroll events
        window.addEventListener('scroll', () => this.handleScroll(), { passive: true });

        // Resize events
        window.addEventListener('resize', () => this.handleResize());

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));

        // Mouse events for animation triggers
        this.floatingButtons.forEach(btn => {
            btn.addEventListener('mouseenter', () => this.onButtonHover(btn));
            btn.addEventListener('mouseleave', () => this.onButtonLeave(btn));
        });
    }

    handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // Determine scroll direction
        this.scrollDirection = scrollTop > this.lastScrollTop ? 'down' : 'up';
        this.lastScrollTop = scrollTop;

        // Show/hide floating buttons based on scroll position
        this.toggleButtonsVisibility(scrollTop);

        // Update progress indicator if exists
        this.updateScrollProgress(scrollTop);

        // Add scroll-based animations
        this.animateButtonsOnScroll(scrollTop);
    }

    toggleButtonsVisibility(scrollTop) {
        const shouldShow = scrollTop > this.scrollThreshold;

        if (shouldShow !== this.isVisible) {
            this.isVisible = shouldShow;
            this.animateButtonsVisibility(shouldShow);
        }

        // Special handling for different scroll directions
        const container = document.querySelector('.floating-buttons');
        if (container) {
            container.classList.toggle('scroll-down', this.scrollDirection === 'down');
            container.classList.toggle('scroll-up', this.scrollDirection === 'up');
        }
    }

    animateButtonsVisibility(show) {
        const container = document.querySelector('.floating-buttons');
        if (!container) return;

        if (show) {
            container.classList.add('visible');

            // Stagger animation for individual buttons
            this.floatingButtons.forEach((btn, index) => {
                setTimeout(() => {
                    btn.classList.add('animate-in');
                }, index * 100);
            });
        } else {
            container.classList.remove('visible');
            this.floatingButtons.forEach(btn => {
                btn.classList.remove('animate-in');
            });
        }
    }

    updateScrollProgress(scrollTop) {
        const progressIndicator = document.querySelector('.scroll-progress');
        if (!progressIndicator) return;

        const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / documentHeight) * 100;

        progressIndicator.style.background = `conic-gradient(var(--primary-color) ${progress}%, transparent ${progress}%)`;
    }

    animateButtonsOnScroll(scrollTop) {
        // Add parallax effect to floating buttons
        const container = document.querySelector('.floating-buttons');
        if (container) {
            const parallaxOffset = scrollTop * 0.02;
            container.style.transform = `translateY(${parallaxOffset}px)`;
        }

        // Pulse animation when near important sections
        const sections = document.querySelectorAll('.section[data-animate]');
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (scrollTop >= sectionTop - 200 && scrollTop <= sectionTop + sectionHeight) {
                this.pulseButtons();
            }
        });
    }

    pulseButtons() {
        if (this.pulseTimeout) return; // Prevent multiple pulses

        this.floatingButtons.forEach(btn => {
            btn.classList.add('pulse');
        });

        this.pulseTimeout = setTimeout(() => {
            this.floatingButtons.forEach(btn => {
                btn.classList.remove('pulse');
            });
            this.pulseTimeout = null;
        }, 1000);
    }

    scrollToTop(e) {
        e.preventDefault();

        // Smooth scroll to top
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });

        // Add click animation
        const btn = e.currentTarget;
        btn.classList.add('clicked');
        setTimeout(() => btn.classList.remove('clicked'), 300);

        // Track event
        this.trackEvent('Navigation', 'Back to Top', 'Floating Button');
    }

    handleWhatsAppClick(e) {
        e.preventDefault();

        const phoneNumber = this.whatsappBtn.getAttribute('data-phone') || '8615878896305';
        const message = this.whatsappBtn.getAttribute('data-message') ||
                       '您好！我对您的产品感兴趣，请问可以提供更多信息吗？';

        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

        // Open WhatsApp in new window
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

        // Add click animation
        this.animateButtonClick(e.currentTarget);

        // Track event
        this.trackEvent('Contact', 'WhatsApp', 'Floating Button');
    }

    handleQuickQuoteClick(e) {
        e.preventDefault();

        // Show quick quote modal or redirect
        const quoteModal = document.querySelector('#quickQuoteModal');
        if (quoteModal) {
            this.showQuickQuoteModal(quoteModal);
        } else {
            // Redirect to quote page
            window.location.href = '/contact.html#quote';
        }

        // Add click animation
        this.animateButtonClick(e.currentTarget);

        // Track event
        this.trackEvent('Contact', 'Quick Quote', 'Floating Button');
    }

    handleCustomerServiceClick(e) {
        e.preventDefault();

        // Show customer service options
        this.showCustomerServiceOptions(e.currentTarget);

        // Add click animation
        this.animateButtonClick(e.currentTarget);

        // Track event
        this.trackEvent('Contact', 'Customer Service', 'Floating Button');
    }

    showQuickQuoteModal(modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Focus on first input
        const firstInput = modal.querySelector('input, textarea');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 300);
        }

        // Close modal events
        const closeBtn = modal.querySelector('.modal-close');
        const overlay = modal.querySelector('.modal-overlay');

        const closeModal = () => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        };

        if (closeBtn) {
            closeBtn.addEventListener('click', closeModal);
        }

        if (overlay) {
            overlay.addEventListener('click', closeModal);
        }

        // ESC key to close
        const handleKeydown = (e) => {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', handleKeydown);
            }
        };
        document.addEventListener('keydown', handleKeydown);
    }

    showCustomerServiceOptions(button) {
        // Create or show customer service dropdown
        let dropdown = document.querySelector('.customer-service-dropdown');

        if (!dropdown) {
            dropdown = this.createCustomerServiceDropdown();
            button.parentNode.appendChild(dropdown);
        }

        dropdown.classList.toggle('active');

        // Close dropdown when clicking outside
        const closeDropdown = (e) => {
            if (!e.target.closest('.customer-service-btn') &&
                !e.target.closest('.customer-service-dropdown')) {
                dropdown.classList.remove('active');
                document.removeEventListener('click', closeDropdown);
            }
        };

        setTimeout(() => {
            document.addEventListener('click', closeDropdown);
        }, 100);
    }

    createCustomerServiceDropdown() {
        const dropdown = document.createElement('div');
        dropdown.className = 'customer-service-dropdown';
        dropdown.innerHTML = `
            <div class="service-option" data-action="phone">
                <i class="fas fa-phone"></i>
                <span>电话咨询</span>
            </div>
            <div class="service-option" data-action="email">
                <i class="fas fa-envelope"></i>
                <span>邮件咨询</span>
            </div>
            <div class="service-option" data-action="chat">
                <i class="fas fa-comments"></i>
                <span>在线客服</span>
            </div>
        `;

        // Bind click events to options
        const options = dropdown.querySelectorAll('.service-option');
        options.forEach(option => {
            option.addEventListener('click', (e) => {
                const action = e.currentTarget.getAttribute('data-action');
                this.handleServiceOptionClick(action);
                dropdown.classList.remove('active');
            });
        });

        return dropdown;
    }

    handleServiceOptionClick(action) {
        switch (action) {
            case 'phone':
                window.location.href = 'tel:+8615878896305';
                this.trackEvent('Contact', 'Phone Call', 'Service Dropdown');
                break;
            case 'email':
                window.location.href = 'mailto:info@yidelong.com';
                this.trackEvent('Contact', 'Email', 'Service Dropdown');
                break;
            case 'chat':
                // Open chat widget or redirect to chat page
                this.openChatWidget();
                this.trackEvent('Contact', 'Live Chat', 'Service Dropdown');
                break;
        }
    }

    openChatWidget() {
        // Implement chat widget logic
        console.log('Opening chat widget...');

        // If using third-party chat service, trigger it here
        // Example: window.chatWidget.open();
    }

    animateButtonClick(button) {
        button.classList.add('clicked');

        // Create ripple effect
        const ripple = document.createElement('div');
        ripple.className = 'click-ripple';
        button.appendChild(ripple);

        setTimeout(() => {
            button.classList.remove('clicked');
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 300);
    }

    onButtonHover(button) {
        button.classList.add('hovered');

        // Show tooltip with delay
        this.showTooltip(button);
    }

    onButtonLeave(button) {
        button.classList.remove('hovered');
        this.hideTooltip(button);
    }

    initTooltips() {
        this.floatingButtons.forEach(btn => {
            const tooltipText = btn.getAttribute('data-tooltip') || btn.getAttribute('title');
            if (tooltipText) {
                btn.setAttribute('data-tooltip', tooltipText);
                btn.removeAttribute('title'); // Remove default tooltip
            }
        });
    }

    showTooltip(button) {
        const tooltipText = button.getAttribute('data-tooltip');
        if (!tooltipText) return;

        let tooltip = button.querySelector('.floating-tooltip');
        if (!tooltip) {
            tooltip = document.createElement('div');
            tooltip.className = 'floating-tooltip';
            button.appendChild(tooltip);
        }

        tooltip.textContent = tooltipText;
        tooltip.classList.add('visible');
    }

    hideTooltip(button) {
        const tooltip = button.querySelector('.floating-tooltip');
        if (tooltip) {
            tooltip.classList.remove('visible');
        }
    }

    initAnimations() {
        // Add CSS animations through JavaScript if needed
        const style = document.createElement('style');
        style.textContent = `
            .floating-btn.animate-in {
                animation: slideInRight 0.5s ease-out;
            }

            .floating-btn.clicked {
                animation: buttonClick 0.3s ease;
            }

            .floating-btn.pulse {
                animation: buttonPulse 1s ease-in-out;
            }

            @keyframes slideInRight {
                from {
                    transform: translateX(100px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }

            @keyframes buttonClick {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(0.95); }
            }

            @keyframes buttonPulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.1); }
            }
        `;
        document.head.appendChild(style);
    }

    handleResize() {
        // Adjust button positions on mobile
        const isMobile = window.innerWidth <= 768;
        const container = document.querySelector('.floating-buttons');

        if (container) {
            container.classList.toggle('mobile', isMobile);
        }
    }

    handleKeyboard(e) {
        // Keyboard shortcuts
        if (e.ctrlKey || e.metaKey) {
            switch (e.key) {
                case 'Home':
                    e.preventDefault();
                    this.scrollToTop(e);
                    break;
            }
        }

        // ESC to close dropdowns
        if (e.key === 'Escape') {
            const activeDropdown = document.querySelector('.customer-service-dropdown.active');
            if (activeDropdown) {
                activeDropdown.classList.remove('active');
            }
        }
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

    // Public methods
    showButtons() {
        this.animateButtonsVisibility(true);
    }

    hideButtons() {
        this.animateButtonsVisibility(false);
    }

    updateButtonText(selector, text) {
        const button = document.querySelector(selector);
        if (button) {
            const textElement = button.querySelector('.btn-text');
            if (textElement) {
                textElement.textContent = text;
            }
        }
    }

    setButtonBadge(selector, count) {
        const button = document.querySelector(selector);
        if (button) {
            let badge = button.querySelector('.btn-badge');
            if (!badge && count > 0) {
                badge = document.createElement('span');
                badge.className = 'btn-badge';
                button.appendChild(badge);
            }

            if (badge) {
                badge.textContent = count;
                badge.style.display = count > 0 ? 'block' : 'none';
            }
        }
    }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.backToTopComponent = new BackToTopComponent();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BackToTopComponent;
}