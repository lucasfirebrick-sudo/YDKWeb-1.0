// ========== Floating Buttons Component Dynamic Loader ==========

/**
 * Floating Buttons Loader
 * Similar to navbar and footer loaders, responsible for dynamically loading floating button components
 */
const FloatingButtonsLoader = {
    // Loading status
    loaded: false,
    loading: false,

    /**
     * Initialize loader
     */
    async init() {
        if (this.loaded || this.loading) return;

        this.loading = true;

        try {
            // Load CSS and HTML in parallel
            await Promise.all([
                this.loadCSS(),
                this.loadHTML()
            ]);

            // Load JavaScript functionality
            await this.loadJS();

            this.loaded = true;
            console.log('✅ Floating buttons component loading completed');

        } catch (error) {
            console.error('❌ Floating buttons component loading failed:', error);
        } finally {
            this.loading = false;
        }
    },

    /**
     * Load CSS styles
     */
    loadCSS() {
        return new Promise((resolve, reject) => {
            // Check if already loaded
            if (document.querySelector('link[href*="floating-buttons.css"]')) {
                resolve();
                return;
            }

            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.type = 'text/css';
            link.href = 'css/css/components/floating-buttons.css';

            link.onload = () => {
                console.log('✅ Floating buttons CSS loaded');
                resolve();
            };

            link.onerror = () => {
                console.error('❌ Floating buttons CSS failed to load');
                reject(new Error('CSS loading failed'));
            };

            document.head.appendChild(link);
        });
    },

    /**
     * Load HTML structure
     */
    loadHTML() {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await fetch('components/components/floating-buttons.html');

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }

                const html = await response.text();

                // Create container and insert HTML
                const container = document.createElement('div');
                container.innerHTML = html;

                // Insert content at the end of body
                document.body.appendChild(container);

                console.log('✅ Floating buttons HTML loaded');
                resolve();

            } catch (error) {
                console.error('❌ Floating buttons HTML failed to load:', error);

                // If network loading fails, use inline HTML as fallback
                this.loadInlineHTML();
                resolve();
            }
        });
    },

    /**
     * Fallback: Load inline HTML
     */
    loadInlineHTML() {
        const html = `
            <!-- Global Unified Floating Buttons Component -->
            <div class="floating-buttons-container">
                <!-- Back to Top Button -->
                <a href="#top" class="float-btn back-to-top" title="Back to Top" aria-label="Back to page top" onclick="floatingButtons.scrollToTop(event)">
                    <i class="fas fa-arrow-up" aria-hidden="true"></i>
                    <span class="sr-only">Back to Top</span>
                </a>

                <!-- Quick Quote Button -->
                <a href="javascript:void(0)" class="float-btn quick-quote" title="Quick Quote" aria-label="Get Quick Quote" onclick="floatingButtons.openQuickQuoteModal()">
                    <i class="fas fa-calculator" aria-hidden="true"></i>
                    <span class="sr-only">Quick Quote</span>
                </a>

                <!-- WhatsApp Button -->
                <a href="https://wa.me/8613503976002" class="float-btn whatsapp" title="WhatsApp" target="_blank" aria-label="Contact us via WhatsApp">
                    <i class="fab fa-whatsapp" aria-hidden="true"></i>
                    <span class="sr-only">WhatsApp</span>
                </a>
            </div>

            <!-- Quick Quote Modal -->
            <div id="quickQuoteModal" class="modal-overlay">
                <div class="modal-content quick-quote-modal">
                    <div class="modal-header">
                        <div class="modal-title-icon">
                            <i class="fas fa-calculator"></i>
                            <h3>Quick Quote</h3>
                        </div>
                        <button class="modal-close" onclick="floatingButtons.closeQuickQuoteModal()" type="button" aria-label="Close">&times;</button>
                    </div>
                    <div class="modal-subtitle">
                        Describe your requirements and we will quickly provide you with a quote
                    </div>
                    <form class="quick-quote-form" id="quickQuoteForm">
                        <div class="form-group">
                            <textarea id="requirements" name="requirements" rows="4"
                                      placeholder="Please describe your requirements in detail, including product type, operating temperature, application scenarios, etc. Any language supported..."
                                      required></textarea>
                            <div class="char-counter">
                                <span id="charCount">0</span>
                                <span class="char-limit">*</span>
                            </div>
                        </div>
                        <div class="form-group">
                            <input type="email" id="contactEmail" name="contactEmail"
                                   placeholder="Please enter your email address" required>
                        </div>
                        <div class="form-group">
                            <input type="tel" id="contactPhone" name="contactPhone"
                                   placeholder="Please enter your phone number (optional)">
                        </div>
                        <div class="form-group">
                            <input type="text" id="companyName" name="companyName"
                                   placeholder="Please enter your company name (optional)">
                        </div>
                        <button type="submit" class="submit-quote-btn">
                            <i class="fas fa-paper-plane"></i>
                            Submit Quote Request
                        </button>
                    </form>
                </div>
            </div>
        `;

        const container = document.createElement('div');
        container.innerHTML = html;
        document.body.appendChild(container);

        console.log('✅ Floating buttons inline HTML loaded');
    },

    /**
     * Load JavaScript functionality
     */
    loadJS() {
        return new Promise((resolve, reject) => {
            // Check if already loaded
            if (document.querySelector('script[src*="floating-buttons.js"]')) {
                // If loaded but not initialized, initialize immediately
                setTimeout(() => {
                    if (window.floatingButtons && !window.floatingButtons.initialized) {
                        window.floatingButtons.init();
                    }
                }, 100);
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = 'js/components/floating-buttons.js';
            script.type = 'text/javascript';

            script.onload = () => {
                console.log('✅ Floating buttons JS loaded');
                // Ensure HTML is loaded before initialization
                setTimeout(() => {
                    if (window.floatingButtons) {
                        window.floatingButtons.init();
                    } else {
                        console.error('❌ floatingButtons object not found');
                    }
                }, 150);
                resolve();
            };

            script.onerror = () => {
                console.error('❌ Floating buttons JS failed to load');
                reject(new Error('JavaScript loading failed'));
            };

            document.head.appendChild(script);
        });
    },

    /**
     * Check dependencies (Font Awesome icons)
     */
    checkDependencies() {
        // Check if Font Awesome is loaded
        if (!document.querySelector('link[href*="font-awesome"]') &&
            !document.querySelector('link[href*="fontawesome"]')) {
            console.warn('⚠️  Warning: Font Awesome not detected, icons may not display properly');
        }
    }
};

// Auto initialization
(function() {
    // Check dependencies
    FloatingButtonsLoader.checkDependencies();

    // Initialize after page loading
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            FloatingButtonsLoader.init();
        });
    } else {
        // If DOM is already loaded
        FloatingButtonsLoader.init();
    }
})();

// Export to global scope
window.FloatingButtonsLoader = FloatingButtonsLoader;