/* Products Page Event Management - Event Delegation System */

class ProductsEventManager {
    constructor() {
        this.cache = {};
        this.init();
    }

    // DOM element caching
    getCachedElement(selector) {
        if (!this.cache[selector]) {
            this.cache[selector] = document.querySelector(selector);
        }
        return this.cache[selector];
    }

    getCachedElements(selector) {
        const cacheKey = `all_${selector}`;
        if (!this.cache[cacheKey]) {
            this.cache[cacheKey] = document.querySelectorAll(selector);
        }
        return this.cache[cacheKey];
    }

    // Initialize event delegation system
    init() {
        this.setupEventDelegation();
        this.setupModalEvents();
        this.setupFormHandlers();
        this.setupFilterTabs();
    }

    // Event delegation for product cards and buttons
    setupEventDelegation() {
        // Delegate all click events to document body
        document.body.addEventListener('click', (e) => {
            const target = e.target;

            // Handle inquiry buttons
            if (target.classList.contains('btn-inquiry')) {
                e.preventDefault();
                e.stopPropagation();
                const productCard = target.closest('.product-card');
                const productTitle = productCard?.querySelector('.product-title')?.textContent;
                this.openGetQuote(productTitle);
                return;
            }

            // Handle details buttons
            if (target.classList.contains('btn-details')) {
                e.preventDefault();
                e.stopPropagation();
                const productCard = target.closest('.product-card');
                const productLink = productCard?.getAttribute('href');
                if (productLink) {
                    window.location.href = productLink;
                }
                return;
            }

            // Handle modal close buttons
            if (target.classList.contains('panel-close') || target.classList.contains('modal-close')) {
                const modal = target.closest('.modal-overlay');
                this.closeModal(modal);
                return;
            }

            // Handle specific close functions
            if (target.hasAttribute('data-action')) {
                const action = target.getAttribute('data-action');
                switch (action) {
                    case 'close-quick-inquiry':
                        this.closeQuickInquiry();
                        break;
                    case 'close-get-quote':
                        this.closeGetQuote();
                        break;
                    case 'next-step':
                        this.nextStep();
                        break;
                    case 'prev-step':
                        this.prevStep();
                        break;
                }
                return;
            }

            // Handle modal overlay clicks (close modal when clicking outside)
            if (target.classList.contains('modal-overlay')) {
                this.closeModal(target);
                return;
            }
        });

        // ESC key handler
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });
    }

    // Modal management
    setupModalEvents() {
        // Prevent modal body clicks from closing modal
        const modalBodies = this.getCachedElements('.modal-content');
        modalBodies.forEach(body => {
            body.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        });
    }

    // Form handlers
    setupFormHandlers() {
        // Quick inquiry form
        const quickInquiryForm = this.getCachedElement('#quick-inquiry-form');
        if (quickInquiryForm) {
            quickInquiryForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleQuickInquirySubmit(e.target);
            });
        }

        // Quote form
        const quoteForm = this.getCachedElement('#get-quote-form');
        if (quoteForm) {
            quoteForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleQuoteSubmit(e.target);
            });
        }

    }

    // Filter tabs functionality
    setupFilterTabs() {
        const filterTabs = this.getCachedElements('.filter-tab');
        const productCards = this.getCachedElements('.product-card');

        filterTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                const category = tab.getAttribute('data-category');

                // Update active tab
                filterTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                // Filter products
                this.filterProducts(category, productCards);
            });
        });
    }

    // Filter products with animation
    filterProducts(category, productCards) {
        productCards.forEach(card => {
            if (category === 'all' || card.getAttribute('data-category') === category) {
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 50);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    }

    // Modal functions
    openGetQuote(productName = '') {
        // Function cleared - ready for new functionality
        console.log('获取报价按钮被点击 - 等待新功能实现');
    }

    closeGetQuote() {
        // Function cleared - now handled by quote-wizard.js component
        console.log('关闭获取报价按钮被点击 - 现在由报价向导组件处理');
    }

    openQuickInquiry() {
        // 使用悬浮按钮的统一快速询价功能
        if (typeof floatingButtons !== 'undefined' && floatingButtons.openQuickQuoteModal) {
            floatingButtons.openQuickQuoteModal();
        } else {
            console.warn('悬浮按钮组件未加载，无法打开快速询价');
        }
    }

    closeQuickInquiry() {
        // 关闭悬浮按钮的快速询价模态框
        if (typeof floatingButtons !== 'undefined' && floatingButtons.closeQuickQuoteModal) {
            floatingButtons.closeQuickQuoteModal();
        }
    }


    // Generic modal functions
    showModal(modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    hideModal(modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    closeModal(modal) {
        if (modal && modal.classList.contains('modal-overlay')) {
            this.hideModal(modal);
        }
    }

    closeAllModals() {
        const modals = this.getCachedElements('.modal-overlay');
        modals.forEach(modal => {
            this.hideModal(modal);
        });
    }

    // Step navigation for quote form
    nextStep() {
        const currentStep = this.getCachedElement('.form-step.active');
        const nextStep = this.getCachedElement('.form-step[data-step="2"]');
        const stepIndicators = this.getCachedElements('.step');

        if (currentStep && nextStep) {
            currentStep.classList.remove('active');
            nextStep.classList.add('active');

            // Update step indicators
            stepIndicators.forEach(indicator => {
                indicator.classList.remove('active');
                if (indicator.dataset.step === '2') {
                    indicator.classList.add('active');
                }
            });

            this.updateSummary();
        }
    }

    prevStep() {
        const currentStep = this.getCachedElement('.form-step.active');
        const prevStep = this.getCachedElement('.form-step[data-step="1"]');
        const stepIndicators = this.getCachedElements('.step');

        if (currentStep && prevStep) {
            currentStep.classList.remove('active');
            prevStep.classList.add('active');

            // Update step indicators
            stepIndicators.forEach(indicator => {
                indicator.classList.remove('active');
                if (indicator.dataset.step === '1') {
                    indicator.classList.add('active');
                }
            });
        }
    }

    updateSummary() {
        const form = this.getCachedElement('#get-quote-form');
        if (!form) return;

        const formData = new FormData(form);
        const quantity = formData.get('quantity') || '待填写';
        const deliveryTime = formData.get('delivery_time') || '待填写';

        const summaryQuantity = this.getCachedElement('#summary-quantity');
        const summaryDelivery = this.getCachedElement('#summary-delivery');

        if (summaryQuantity) summaryQuantity.textContent = quantity;
        if (summaryDelivery) summaryDelivery.textContent = deliveryTime;
    }

    // Form submission handlers
    handleQuickInquirySubmit(form) {
        // Add form validation and submission logic here
        console.log('Quick inquiry submitted');
        // Show success message
        this.showSuccessMessage('quick-inquiry-success');
    }

    handleQuoteSubmit(form) {
        // Add form validation and submission logic here
        console.log('Quote submitted');
        // Show success message
        this.showSuccessMessage('get-quote-success');
    }


    showSuccessMessage(elementId) {
        const successEl = this.getCachedElement(`#${elementId}`);
        if (successEl) {
            successEl.style.display = 'block';
        }
    }
}

// Global functions for modal management - Removed to avoid conflicts
// These functions are now handled by quote-wizard.js component

// Note: openGetQuote, openInquiryModal functions are now provided by quote-wizard.js

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    window.productsEventManager = new ProductsEventManager();
});