// ========== Modal Components - English Version ==========

/**
 * Modal Components Manager
 * Provides modal functionality for product detail pages
 */
const ModalComponents = {
    // Initialization flag
    initialized: false,
    activeModal: null,

    /**
     * Initialize modal components
     */
    init() {
        if (this.initialized) return;

        this.bindEvents();
        this.initialized = true;
        console.log('✅ Modal components initialized');
    },

    /**
     * Bind global events
     */
    bindEvents() {
        // ESC key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.activeModal) {
                this.closeModal(this.activeModal);
            }
        });

        // Click outside to close modal
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-overlay') && this.activeModal) {
                this.closeModal(this.activeModal);
            }
        });
    },

    /**
     * Open modal
     */
    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return;

        this.activeModal = modal;
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';

        // Add show class for animation
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
    },

    /**
     * Close modal
     */
    closeModal(modal) {
        if (!modal) return;

        modal.classList.remove('show');

        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = '';
            this.activeModal = null;
        }, 300);
    },

    /**
     * Show image modal
     */
    showImageModal(imageSrc, imageAlt = '') {
        // Create modal if it doesn't exist
        let modal = document.getElementById('imageModal');
        if (!modal) {
            modal = this.createImageModal();
        }

        const img = modal.querySelector('.modal-image');
        const caption = modal.querySelector('.modal-caption');

        img.src = imageSrc;
        img.alt = imageAlt;
        caption.textContent = imageAlt;

        this.openModal('imageModal');
    },

    /**
     * Create image modal
     */
    createImageModal() {
        const modal = document.createElement('div');
        modal.id = 'imageModal';
        modal.className = 'modal-overlay image-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <button class="modal-close" onclick="ModalComponents.closeModal(this.closest('.modal-overlay'))">&times;</button>
                <img class="modal-image" src="" alt="">
                <div class="modal-caption"></div>
            </div>
        `;
        document.body.appendChild(modal);
        return modal;
    },

    /**
     * Show specification modal
     */
    showSpecModal(productId) {
        // Get product data from database
        if (window.productDatabase) {
            const product = window.productDatabase.getProduct(productId);
            if (product) {
                this.createSpecModal(product);
            }
        }
    },

    /**
     * Create specification modal
     */
    createSpecModal(product) {
        // Remove existing spec modal
        const existingModal = document.getElementById('specModal');
        if (existingModal) {
            existingModal.remove();
        }

        const modal = document.createElement('div');
        modal.id = 'specModal';
        modal.className = 'modal-overlay spec-modal';

        let specsHtml = '';
        if (product.specifications) {
            for (const [key, spec] of Object.entries(product.specifications)) {
                specsHtml += `
                    <div class="spec-row">
                        <span class="spec-label">${spec.label || key}:</span>
                        <span class="spec-value">${spec.value} ${spec.unit || ''}</span>
                    </div>
                `;
            }
        }

        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${product.name} - Technical Specifications</h3>
                    <button class="modal-close" onclick="ModalComponents.closeModal(this.closest('.modal-overlay'))">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="specifications-grid">
                        ${specsHtml}
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        this.openModal('specModal');
    }
};

// Auto initialization
document.addEventListener('DOMContentLoaded', function() {
    ModalComponents.init();
});

// Export to global scope
window.ModalComponents = ModalComponents;

// Backward compatibility functions
window.openImageModal = function(src, alt) {
    ModalComponents.showImageModal(src, alt);
};

window.openSpecModal = function(productId) {
    ModalComponents.showSpecModal(productId);
};