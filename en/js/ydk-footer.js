/**
 * YDK Footer Component - English Version
 * Professional English footer component for international users
 */

(function() {
    'use strict';

    // English Footer HTML Template
    const FOOTER_HTML = `
    <footer class="ydk-footer">
        <div class="ydk-footer-container">
            <div class="ydk-footer-main">
                <!-- Company Information -->
                <div class="ydk-company-section">
                    <h3>Three Generations of Dedication: Creating Reliable Refractory Materials You Can Trust</h3>
                    <p class="ydk-company-tagline">Professional Refractory Materials Manufacturer</p>
                    <p class="ydk-company-description">From traditional craftsmanship to modern technology, we maintain our commitment to quality. Specializing in the R&D and production of high-quality refractory bricks, castables, and other products, serving over 40 countries and regions worldwide.</p>
                </div>

                <!-- Newsletter Subscription -->
                <div class="ydk-newsletter-section">
                    <h4>Want to Learn About Our Story?</h4>
                    <p class="ydk-newsletter-intro">Subscribe to hear our story and discover the three-generation legacy of refractory brick craftsmanship, from traditional expertise to modern data-driven manufacturing.</p>

                    <form class="ydk-newsletter-form" id="ydkNewsletterForm">
                        <input
                            type="email"
                            class="ydk-email-input"
                            placeholder="Enter your email to receive our story"
                            required
                        >
                        <button type="submit" class="ydk-subscribe-btn">
                            <i class="fas fa-heart"></i>
                            Share Your Story With Us
                        </button>
                        <div class="ydk-privacy-note">We respect your privacy and will never send spam</div>
                        <div class="ydk-form-message"></div>
                    </form>
                </div>

                <!-- Contact Information -->
                <div class="ydk-contact-section">
                    <h4>Contact Us</h4>
                    <p class="ydk-contact-description">Professional Refractory Materials Solution Provider</p>
                    <div class="ydk-contact-info">
                        <div class="ydk-contact-item">
                            <i class="ydk-contact-icon fas fa-phone"></i>
                            <span>+86 371 86541085</span>
                        </div>
                        <div class="ydk-contact-item">
                            <i class="ydk-contact-icon fas fa-envelope"></i>
                            <span>export@yuandake.com</span>
                        </div>
                        <div class="ydk-contact-item">
                            <i class="ydk-contact-icon fas fa-map-marker-alt"></i>
                            <span>Chaohua Industrial Park, Xinmi City, Henan Province, China</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Copyright Information -->
            <div class="ydk-footer-bottom">
                <div class="ydk-footer-copyright">
                    <div class="ydk-copyright-main">© 2025 Henan Yuandake Refractory Materials Co., Ltd. All Rights Reserved | <a href="#" target="_blank">ICP License: xxxxxx</a></div>
                    <div class="ydk-copyright-slogan">Crafted with Care, Served with Love</div>
                </div>
            </div>
        </div>
    </footer>
    `;

    // YDK Footer class
    class YDKFooter {
        constructor() {
            this.footer = null;
            this.newsletterForm = null;
            this.init();
        }

        init() {
            this.render();
            this.updateCopyright();
            this.bindEvents();
        }

        render() {
            // Find insertion position
            let footerContainer = document.getElementById('footer-container');

            if (!footerContainer) {
                footerContainer = document.createElement('div');
                footerContainer.id = 'footer-container';
                document.body.appendChild(footerContainer);
            }

            footerContainer.innerHTML = FOOTER_HTML;

            // Cache DOM elements
            this.footer = document.querySelector('.ydk-footer');
            this.newsletterForm = document.getElementById('ydkNewsletterForm');
        }

        updateCopyright() {
            const currentYear = new Date().getFullYear();
            const copyrightMain = document.querySelector('.ydk-copyright-main');
            if (copyrightMain) {
                copyrightMain.innerHTML = copyrightMain.innerHTML.replace('2025', currentYear);
            }
        }

        bindEvents() {
            if (this.newsletterForm) {
                this.newsletterForm.addEventListener('submit', (e) => {
                    this.handleNewsletterSubmit(e);
                });

                // Hide error message on input
                const emailInput = this.newsletterForm.querySelector('.ydk-email-input');
                if (emailInput) {
                    emailInput.addEventListener('input', () => {
                        this.hideFormMessage();
                    });
                }
            }
        }

        handleNewsletterSubmit(e) {
            e.preventDefault();

            const emailInput = this.newsletterForm.querySelector('.ydk-email-input');
            const submitBtn = this.newsletterForm.querySelector('.ydk-subscribe-btn');
            const formMessage = this.newsletterForm.querySelector('.ydk-form-message');

            if (emailInput.value && emailInput.checkValidity()) {
                // Show loading state
                this.setLoadingState(submitBtn, true);

                // Simulate submission process
                setTimeout(() => {
                    this.showSuccessState(emailInput, submitBtn, formMessage);

                    // Log subscription
                    console.log('Newsletter subscription:', emailInput.value);

                    // Reset after 3 seconds
                    setTimeout(() => {
                        this.resetForm(emailInput, submitBtn, formMessage);
                    }, 3000);

                }, 1500);
            } else {
                this.showErrorMessage(formMessage, 'Please enter a valid email address');
            }
        }

        setLoadingState(submitBtn, isLoading) {
            if (isLoading) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Subscribing...';
            }
        }

        showSuccessState(emailInput, submitBtn, formMessage) {
            // Success state
            submitBtn.innerHTML = '<i class="fas fa-heart"></i> Thank you for becoming our friend!';

            formMessage.textContent = 'Subscription successful! We will share interesting refractory brick stories with you.';
            formMessage.className = 'ydk-form-message success';
            formMessage.style.display = 'block';

            emailInput.disabled = true;
            submitBtn.disabled = true;
        }

        showErrorMessage(formMessage, message) {
            formMessage.textContent = message;
            formMessage.className = 'ydk-form-message error';
            formMessage.style.display = 'block';

            setTimeout(() => {
                this.hideFormMessage();
            }, 3000);
        }

        resetForm(emailInput, submitBtn, formMessage) {
            submitBtn.innerHTML = '<i class="fas fa-heart"></i> Share Your Story With Us';
            emailInput.disabled = false;
            submitBtn.disabled = false;
            emailInput.value = '';
            this.hideFormMessage();
        }

        hideFormMessage() {
            const formMessage = document.querySelector('.ydk-form-message');
            if (formMessage) {
                formMessage.style.display = 'none';
            }
        }
    }

    // Auto initialization
    function initYDKFooter() {
        window.YDKFooter = new YDKFooter();
    }

    // Initialize after DOM loading completed
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initYDKFooter);
    } else {
        initYDKFooter();
    }

})();