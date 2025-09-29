/**
 * YDK Navbar Component - English Version
 * Independent JavaScript component for professional navigation
 */

(function() {
    'use strict';

    // Dynamically get logo path - adjust based on current page location
    function getLogoPath() {
        const currentPath = window.location.pathname;
        // If current page is in products subdirectory, use relative path
        if (currentPath.includes('/products/') || currentPath.includes('\\products\\')) {
            return '../images/images/logo-new.jpg';
        }
        return 'images/images/logo-new.jpg';
    }

    // Dynamically get home page path
    function getHomePath() {
        const currentPath = window.location.pathname;
        if (currentPath.includes('/products/') || currentPath.includes('\\products\\')) {
            return '../index.html';
        }
        return 'index.html';
    }

    // Dynamically get menu path
    function getMenuPath(page) {
        const currentPath = window.location.pathname;
        if (currentPath.includes('/products/') || currentPath.includes('\\products\\')) {
            return '../' + page;
        }
        return page;
    }

    // Navbar HTML template - exactly as per screenshot
    const NAVBAR_HTML = `
    <nav class="ydk-navbar">
        <div class="ydk-navbar-container">
            <a href="${getHomePath()}" class="ydk-logo-section">
                <img src="${getLogoPath()}" alt="YDK" class="ydk-logo-img">
                <div class="ydk-logo-tagline">GLOBAL ONE-STOP REFRACTORY SOLUTIONS</div>
            </a>

            <ul class="ydk-nav-menu">
                <li class="ydk-nav-item">
                    <a href="${getHomePath()}" class="ydk-nav-link">Home</a>
                </li>
                <li class="ydk-nav-item">
                    <a href="${getMenuPath('products.html')}" class="ydk-nav-link">Products</a>
                </li>
                <li class="ydk-nav-item">
                    <a href="${getMenuPath('applications.html')}" class="ydk-nav-link">Applications</a>
                </li>
                <li class="ydk-nav-item">
                    <a href="${getMenuPath('quality.html')}" class="ydk-nav-link">Quality Control</a>
                </li>
                <li class="ydk-nav-item">
                    <a href="${getMenuPath('about.html')}" class="ydk-nav-link">About Us</a>
                </li>
                <li class="ydk-nav-item">
                    <a href="${getMenuPath('contact.html')}" class="ydk-nav-link">Contact Us</a>
                </li>
            </ul>

            <button class="ydk-hamburger" aria-label="Toggle Menu">
                <span class="ydk-hamburger-line"></span>
                <span class="ydk-hamburger-line"></span>
                <span class="ydk-hamburger-line"></span>
            </button>
        </div>
    </nav>
    `;

    // YDK Navbar Class
    class YDKNavbar {
        constructor() {
            this.navbar = null;
            this.hamburger = null;
            this.navMenu = null;
            this.init();
        }

        init() {
            this.render();
            this.setActiveLink();
            this.bindEvents();
        }

        render() {
            // Find insertion point
            const existingHeader = document.querySelector('header');
            const targetElement = existingHeader || document.body;

            if (existingHeader) {
                existingHeader.innerHTML = NAVBAR_HTML;
            } else {
                targetElement.insertAdjacentHTML('afterbegin', NAVBAR_HTML);
            }

            // Cache DOM elements
            this.navbar = document.querySelector('.ydk-navbar');
            this.hamburger = document.querySelector('.ydk-hamburger');
            this.navMenu = document.querySelector('.ydk-nav-menu');
        }

        setActiveLink() {
            const currentPath = window.location.pathname;
            const currentPage = currentPath.split('/').pop() || 'index.html';

            // Remove all active states
            document.querySelectorAll('.ydk-nav-link').forEach(link => {
                link.classList.remove('active');
            });

            // Set current page active
            const activeLink = document.querySelector(`.ydk-nav-link[href="${currentPage}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            } else if (currentPage === '' || currentPage === 'index.html') {
                const homeLink = document.querySelector('.ydk-nav-link[href="index.html"]');
                if (homeLink) homeLink.classList.add('active');
            }
        }

        bindEvents() {
            if (this.hamburger && this.navMenu) {
                // Hamburger menu click event
                this.hamburger.addEventListener('click', () => {
                    this.toggleMobileMenu();
                });

                // Navigation link click events
                document.querySelectorAll('.ydk-nav-link').forEach(link => {
                    link.addEventListener('click', () => {
                        this.closeMobileMenu();
                    });
                });

                // Click outside to close menu
                document.addEventListener('click', (e) => {
                    if (!e.target.closest('.ydk-navbar')) {
                        this.closeMobileMenu();
                    }
                });

                // ESC key to close menu
                document.addEventListener('keydown', (e) => {
                    if (e.key === 'Escape') {
                        this.closeMobileMenu();
                    }
                });
            }
        }

        toggleMobileMenu() {
            this.hamburger.classList.toggle('active');
            this.navMenu.classList.toggle('mobile-active');
        }

        closeMobileMenu() {
            this.hamburger.classList.remove('active');
            this.navMenu.classList.remove('mobile-active');
        }

        // Public method: reset active link
        updateActiveLink() {
            this.setActiveLink();
        }
    }

    // Auto initialization
    function initYDKNavbar() {
        window.YDKNavbar = new YDKNavbar();
    }

    // Initialize after DOM loading
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initYDKNavbar);
    } else {
        initYDKNavbar();
    }

})();