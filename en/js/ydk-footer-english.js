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
                            <span>sales@yuandake.com</span>
                        </div>
                        <div class="ydk-contact-item">
                            <i class="ydk-contact-icon fas fa-map-marker-alt"></i>
                            <span>Chaohua Industrial Park, Xinmi City, Henan Province, China</span>
                        </div>
                        <div class="ydk-contact-item">
                            <i class="ydk-contact-icon fab fa-whatsapp"></i>
                            <span>WhatsApp: +86 135 0397 6002</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Quick Links Navigation -->
            <div class="ydk-footer-nav">
                <div class="ydk-nav-section">
                    <h5>Products</h5>
                    <ul class="ydk-nav-links">
                        <li><a href="products/clay-brick.html">Clay Brick</a></li>
                        <li><a href="products/high-alumina-brick.html">High Alumina Brick</a></li>
                        <li><a href="products/silica-brick.html">Silica Brick</a></li>
                        <li><a href="products/mullite-brick.html">Mullite Brick</a></li>
                        <li><a href="products/refractory-castable.html">Castable</a></li>
                    </ul>
                </div>

                <div class="ydk-nav-section">
                    <h5>Applications</h5>
                    <ul class="ydk-nav-links">
                        <li><a href="applications/steel-plants.html">Steel Industry</a></li>
                        <li><a href="applications/cement-kilns.html">Cement Industry</a></li>
                        <li><a href="applications/glass-furnaces.html">Glass Industry</a></li>
                        <li><a href="applications/petrochemical.html">Petrochemical</a></li>
                        <li><a href="applications/thermal-power.html">Power Generation</a></li>
                    </ul>
                </div>

                <div class="ydk-nav-section">
                    <h5>Company</h5>
                    <ul class="ydk-nav-links">
                        <li><a href="about.html">About Us</a></li>
                        <li><a href="quality.html">Quality Control</a></li>
                        <li><a href="contact.html">Contact Us</a></li>
                        <li><a href="#" onclick="openQuoteModal('general')">Get Quote</a></li>
                        <li><a href="https://wa.me/8613503976002" target="_blank">WhatsApp</a></li>
                    </ul>
                </div>

                <div class="ydk-nav-section">
                    <h5>Support</h5>
                    <ul class="ydk-nav-links">
                        <li><a href="mailto:sales@yuandake.com">Technical Support</a></li>
                        <li><a href="tel:+8637186541085">24/7 Hotline</a></li>
                        <li><a href="contact.html#faq">FAQ</a></li>
                        <li><a href="contact.html#warranty">Warranty</a></li>
                        <li><a href="contact.html#training">Training</a></li>
                    </ul>
                </div>
            </div>

            <!-- Footer Bottom -->
            <div class="ydk-footer-bottom">
                <div class="ydk-footer-social">
                    <h5>Follow Us</h5>
                    <div class="ydk-social-links">
                        <a href="https://wa.me/8613503976002" target="_blank" class="ydk-social-link whatsapp">
                            <i class="fab fa-whatsapp"></i>
                            <span>WhatsApp</span>
                        </a>
                        <a href="mailto:sales@yuandake.com" class="ydk-social-link email">
                            <i class="fas fa-envelope"></i>
                            <span>Email</span>
                        </a>
                        <a href="tel:+8637186541085" class="ydk-social-link phone">
                            <i class="fas fa-phone"></i>
                            <span>Call</span>
                        </a>
                    </div>
                </div>

                <div class="ydk-footer-legal">
                    <div class="ydk-copyright">
                        <p>&copy; 2024 Henan Yuandake Refractory Materials Co., Ltd. All rights reserved.</p>
                        <p class="ydk-company-desc">Professional manufacturer with 55 years of experience | ISO 9001 Certified | Exporting to 40+ countries</p>
                    </div>
                    <div class="ydk-legal-links">
                        <a href="contact.html#privacy">Privacy Policy</a>
                        <a href="contact.html#terms">Terms of Service</a>
                        <a href="contact.html#cookies">Cookie Policy</a>
                        <a href="contact.html#sitemap">Sitemap</a>
                    </div>
                </div>

                <div class="ydk-footer-certifications">
                    <h5>Certifications</h5>
                    <div class="ydk-cert-badges">
                        <div class="cert-badge">
                            <i class="fas fa-certificate"></i>
                            <span>ISO 9001:2015</span>
                        </div>
                        <div class="cert-badge">
                            <i class="fas fa-shield-alt"></i>
                            <span>ISO 14001:2015</span>
                        </div>
                        <div class="cert-badge">
                            <i class="fas fa-award"></i>
                            <span>ISO 45001:2018</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </footer>
    `;

    // Footer CSS Styles
    const FOOTER_STYLES = `
        .ydk-footer {
            background: linear-gradient(135deg, #1a1a1a 0%, #2c2c2c 100%);
            color: #ffffff;
            padding: 40px 0 20px 0;
            margin-top: 60px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .ydk-footer-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
        }

        .ydk-footer-main {
            display: grid;
            grid-template-columns: 2fr 1.5fr 1fr;
            gap: 40px;
            margin-bottom: 40px;
        }

        .ydk-company-section h3 {
            font-size: 1.4em;
            font-weight: 600;
            color: #f0f0f0;
            margin-bottom: 15px;
            line-height: 1.3;
        }

        .ydk-company-tagline {
            font-size: 1.1em;
            color: #c41e3a;
            font-weight: 600;
            margin-bottom: 15px;
        }

        .ydk-company-description {
            font-size: 0.95em;
            line-height: 1.6;
            color: #cccccc;
            margin-bottom: 0;
        }

        .ydk-newsletter-section h4 {
            font-size: 1.2em;
            font-weight: 600;
            color: #f0f0f0;
            margin-bottom: 10px;
        }

        .ydk-newsletter-intro {
            font-size: 0.9em;
            color: #cccccc;
            line-height: 1.5;
            margin-bottom: 20px;
        }

        .ydk-newsletter-form {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        .ydk-email-input {
            padding: 12px 15px;
            border: 2px solid #404040;
            border-radius: 6px;
            background: #2a2a2a;
            color: #ffffff;
            font-size: 0.9em;
            transition: border-color 0.3s ease;
        }

        .ydk-email-input:focus {
            outline: none;
            border-color: #c41e3a;
        }

        .ydk-email-input::placeholder {
            color: #888888;
        }

        .ydk-subscribe-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            padding: 12px 20px;
            background: linear-gradient(135deg, #c41e3a, #d32f2f);
            color: white;
            border: none;
            border-radius: 6px;
            font-size: 0.9em;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .ydk-subscribe-btn:hover {
            background: linear-gradient(135deg, #b71c1c, #c41e3a);
            transform: translateY(-1px);
        }

        .ydk-privacy-note {
            font-size: 0.8em;
            color: #999999;
            text-align: center;
        }

        .ydk-contact-section h4 {
            font-size: 1.2em;
            font-weight: 600;
            color: #f0f0f0;
            margin-bottom: 10px;
        }

        .ydk-contact-description {
            font-size: 0.9em;
            color: #cccccc;
            margin-bottom: 20px;
        }

        .ydk-contact-info {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        .ydk-contact-item {
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 0.9em;
        }

        .ydk-contact-icon {
            width: 16px;
            color: #c41e3a;
            flex-shrink: 0;
        }

        .ydk-footer-nav {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 30px;
            margin-bottom: 40px;
            padding-top: 30px;
            border-top: 1px solid #404040;
        }

        .ydk-nav-section h5 {
            font-size: 1.1em;
            font-weight: 600;
            color: #f0f0f0;
            margin-bottom: 15px;
        }

        .ydk-nav-links {
            list-style: none;
            padding: 0;
            margin: 0;
        }

        .ydk-nav-links li {
            margin-bottom: 8px;
        }

        .ydk-nav-links a {
            color: #cccccc;
            text-decoration: none;
            font-size: 0.9em;
            transition: color 0.3s ease;
        }

        .ydk-nav-links a:hover {
            color: #c41e3a;
        }

        .ydk-footer-bottom {
            display: grid;
            grid-template-columns: 1fr 2fr 1fr;
            gap: 30px;
            padding-top: 30px;
            border-top: 1px solid #404040;
        }

        .ydk-footer-social h5 {
            font-size: 1em;
            color: #f0f0f0;
            margin-bottom: 15px;
        }

        .ydk-social-links {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        .ydk-social-link {
            display: flex;
            align-items: center;
            gap: 8px;
            color: #cccccc;
            text-decoration: none;
            font-size: 0.9em;
            transition: color 0.3s ease;
        }

        .ydk-social-link:hover {
            color: #c41e3a;
        }

        .ydk-footer-legal {
            text-align: center;
        }

        .ydk-copyright p {
            margin: 0 0 8px 0;
            font-size: 0.85em;
            color: #cccccc;
        }

        .ydk-company-desc {
            color: #999999;
        }

        .ydk-legal-links {
            display: flex;
            justify-content: center;
            gap: 20px;
            margin-top: 15px;
        }

        .ydk-legal-links a {
            color: #999999;
            text-decoration: none;
            font-size: 0.8em;
            transition: color 0.3s ease;
        }

        .ydk-legal-links a:hover {
            color: #c41e3a;
        }

        .ydk-footer-certifications h5 {
            font-size: 1em;
            color: #f0f0f0;
            margin-bottom: 15px;
        }

        .ydk-cert-badges {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        .cert-badge {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 0.85em;
            color: #cccccc;
        }

        .cert-badge i {
            color: #c41e3a;
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
            .ydk-footer-main {
                grid-template-columns: 1fr;
                gap: 30px;
            }

            .ydk-footer-nav {
                grid-template-columns: repeat(2, 1fr);
                gap: 20px;
            }

            .ydk-footer-bottom {
                grid-template-columns: 1fr;
                gap: 20px;
                text-align: center;
            }

            .ydk-social-links {
                flex-direction: row;
                justify-content: center;
            }

            .ydk-legal-links {
                flex-wrap: wrap;
            }
        }

        @media (max-width: 768px) {
            .ydk-footer {
                padding: 30px 0 15px 0;
            }

            .ydk-footer-container {
                padding: 0 15px;
            }

            .ydk-footer-nav {
                grid-template-columns: 1fr;
                gap: 20px;
            }

            .ydk-company-section h3 {
                font-size: 1.2em;
            }

            .ydk-legal-links {
                flex-direction: column;
                gap: 10px;
            }
        }
    `;

    // Newsletter form functionality
    function initializeNewsletter() {
        const form = document.getElementById('ydkNewsletterForm');
        if (!form) return;

        form.addEventListener('submit', function(e) {
            e.preventDefault();

            const emailInput = form.querySelector('.ydk-email-input');
            const messageDiv = form.querySelector('.ydk-form-message');
            const submitBtn = form.querySelector('.ydk-subscribe-btn');

            if (!emailInput.value || !emailInput.value.includes('@')) {
                showMessage(messageDiv, 'Please enter a valid email address', 'error');
                return;
            }

            // Simulate subscription process
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Subscribing...';

            setTimeout(() => {
                showMessage(messageDiv, 'Thank you for subscribing! We\'ll share our story with you soon.', 'success');
                emailInput.value = '';
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-heart"></i> Share Your Story With Us';
            }, 2000);
        });
    }

    function showMessage(container, message, type) {
        container.innerHTML = `<div class="message ${type}">${message}</div>`;
        container.style.display = 'block';

        // Add message styles
        const messageEl = container.querySelector('.message');
        messageEl.style.cssText = `
            padding: 10px 15px;
            border-radius: 4px;
            font-size: 0.85em;
            margin-top: 10px;
            ${type === 'success' ?
                'background: #1b5e20; color: #a5d6a7; border: 1px solid #2e7d32;' :
                'background: #b71c1c; color: #ffcdd2; border: 1px solid #c62828;'
            }
        `;

        setTimeout(() => {
            container.style.display = 'none';
        }, 5000);
    }

    // Dynamic path resolution for links
    function adjustFooterPaths() {
        const currentPath = window.location.pathname;
        const isInSubDirectory = currentPath.includes('/products/') || currentPath.includes('/applications/');

        if (isInSubDirectory) {
            // Update all relative links to include '../'
            const links = document.querySelectorAll('.ydk-footer a[href^="products/"], .ydk-footer a[href^="applications/"], .ydk-footer a[href^="about.html"], .ydk-footer a[href^="quality.html"], .ydk-footer a[href^="contact.html"]');
            links.forEach(link => {
                const href = link.getAttribute('href');
                if (!href.startsWith('../') && !href.startsWith('http') && !href.startsWith('mailto:') && !href.startsWith('tel:')) {
                    link.setAttribute('href', '../' + href);
                }
            });
        }
    }

    // Initialize footer
    function initializeFooter() {
        // Insert CSS
        const style = document.createElement('style');
        style.textContent = FOOTER_STYLES;
        document.head.appendChild(style);

        // Insert footer HTML
        const footer = document.createElement('div');
        footer.innerHTML = FOOTER_HTML;
        document.body.appendChild(footer.firstElementChild);

        // Adjust paths and initialize functionality
        adjustFooterPaths();
        initializeNewsletter();

        console.log('YDK English Footer initialized successfully');
    }

    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeFooter);
    } else {
        initializeFooter();
    }

    // Export for external use
    window.YDKFooterEnglish = {
        init: initializeFooter
    };

})();