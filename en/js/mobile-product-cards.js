/**
 * Mobile Product Card Interactions
 *
 * Features: Tap product card to show overlay on mobile devices,
 * tap again or tap close button to hide
 */

(function() {
    'use strict';

    // Detect if mobile device
    function isMobileDevice() {
        return window.innerWidth <= 768 ||
               ('ontouchstart' in window) ||
               (navigator.maxTouchPoints > 0);
    }

    // Initialize mobile product card interactions
    function initMobileProductCards() {
        if (!isMobileDevice()) {
            return; // Skip for non-mobile devices
        }

        const productCards = document.querySelectorAll('.product-card');

        if (productCards.length === 0) {
            return;
        }

        // Add click event to each product card
        productCards.forEach(card => {
            card.addEventListener('click', function(e) {
                const overlay = this.querySelector('.hover-overlay');

                // Allow clicks on buttons/links within overlay
                if (e.target.closest('.overlay-actions')) {
                    return;
                }

                // Check if close button area was clicked (top-right corner)
                const rect = overlay.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const clickY = e.clientY - rect.top;

                if (clickX > rect.width - 50 && clickY < 50) {
                    // Clicked close button area
                    this.classList.remove('mobile-active');
                    e.preventDefault();
                    e.stopPropagation();
                    return;
                }

                // Toggle active state
                const isActive = this.classList.contains('mobile-active');

                // Close all other cards
                document.querySelectorAll('.product-card.mobile-active').forEach(c => {
                    if (c !== this) {
                        c.classList.remove('mobile-active');
                    }
                });

                // Toggle current card state
                if (!isActive) {
                    this.classList.add('mobile-active');
                    e.preventDefault();
                    e.stopPropagation();
                } else {
                    this.classList.remove('mobile-active');
                }
            });

            // Prevent overlay event bubbling
            const overlay = card.querySelector('.hover-overlay');
            if (overlay) {
                overlay.addEventListener('click', function(e) {
                    // Allow button clicks
                    if (e.target.closest('.overlay-actions')) {
                        return;
                    }
                    e.stopPropagation();
                });
            }
        });

        // Close all overlays when clicking elsewhere
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.product-card')) {
                document.querySelectorAll('.product-card.mobile-active').forEach(card => {
                    card.classList.remove('mobile-active');
                });
            }
        });

        // Handle scroll (optional, improves performance)
        let scrollTimeout;
        window.addEventListener('scroll', function() {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(function() {
                // Don't auto-close on scroll - users may want to view products at different positions
                // Uncomment below to auto-close on scroll
                // document.querySelectorAll('.product-card.mobile-active').forEach(card => {
                //     card.classList.remove('mobile-active');
                // });
            }, 150);
        }, { passive: true });
    }

    // Reinitialize on window resize
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            // If changed from mobile to desktop, remove all active states
            if (!isMobileDevice()) {
                document.querySelectorAll('.product-card.mobile-active').forEach(card => {
                    card.classList.remove('mobile-active');
                });
            }
        }, 250);
    });

    // Initialize after page load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMobileProductCards);
    } else {
        initMobileProductCards();
    }

    // Export function for external use (optional)
    window.initMobileProductCards = initMobileProductCards;

})();
