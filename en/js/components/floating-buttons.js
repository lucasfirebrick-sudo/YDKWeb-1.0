// ========== Global Unified Floating Buttons Functionality ==========

/**
 * Floating Buttons Manager
 */
const floatingButtons = {
    // Initialization flag
    initialized: false,
    isModalAnimating: false,
    quickQuoteModal: null,

    /**
     * Initialize floating buttons functionality
     */
    init() {
        if (this.initialized) return;

        // Bind event listeners
        this.bindEvents();

        // Initialize character counter
        this.initCharacterCounter();

        // Initialize modal
        this.initModal();

        this.initialized = true;
        console.log('✅ Floating buttons component initialized');
    },

    /**
     * Bind event listeners
     */
    bindEvents() {
        // ESC key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.quickQuoteModal && this.quickQuoteModal.classList.contains('show')) {
                this.closeQuickQuoteModal();
            }
        });

        // Form submit event
        document.addEventListener('submit', (e) => {
            if (e.target.id === 'quickQuoteForm') {
                e.preventDefault();
                this.handleQuoteSubmit(e);
            }
        });
    },

    /**
     * Initialize modal
     */
    initModal() {
        // Wait for DOM to load before finding modal
        setTimeout(() => {
            this.quickQuoteModal = document.getElementById('quickQuoteModal');

            if (this.quickQuoteModal) {
                // Click mask to close modal
                this.quickQuoteModal.addEventListener('click', (e) => {
                    if (e.target === this.quickQuoteModal) {
                        this.closeQuickQuoteModal();
                    }
                });

                // Prevent modal content clicks from closing modal
                const modalContent = this.quickQuoteModal.querySelector('.modal-content');
                if (modalContent) {
                    modalContent.addEventListener('click', (e) => {
                        e.stopPropagation();
                    });
                }
            }
        }, 100);
    },

    /**
     * Initialize character counter
     */
    initCharacterCounter() {
        setTimeout(() => {
            const textarea = document.getElementById('requirements');
            const charCount = document.getElementById('charCount');

            if (textarea && charCount) {
                textarea.addEventListener('input', function() {
                    const count = this.value.length;
                    charCount.textContent = count;

                    // Change color based on character count
                    if (count === 0) {
                        charCount.style.color = '#999';
                    } else if (count < 50) {
                        charCount.style.color = '#ff6b35';
                    } else {
                        charCount.style.color = '#28a745';
                    }
                });
            }
        }, 100);
    },

    /**
     * Back to top functionality
     */
    scrollToTop(event) {
        event.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        return false;
    },

    /**
     * Open quick quote modal
     */
    openQuickQuoteModal() {
        if (!this.quickQuoteModal || this.isModalAnimating) return;

        this.isModalAnimating = true;

        // Show modal
        this.quickQuoteModal.style.display = 'flex';

        // Disable background scrolling
        document.body.style.overflow = 'hidden';

        // Force redraw then add show class
        setTimeout(() => {
            this.quickQuoteModal.classList.add('show');
            this.isModalAnimating = false;
        }, 10);

        // Focus on first input field
        setTimeout(() => {
            const firstInput = this.quickQuoteModal.querySelector('#requirements');
            if (firstInput) {
                firstInput.focus();
            }
        }, 350);
    },

    /**
     * Close quick quote modal
     */
    closeQuickQuoteModal() {
        if (!this.quickQuoteModal || this.isModalAnimating) return;

        this.isModalAnimating = true;

        // Add closing animation class
        this.quickQuoteModal.classList.add('closing');
        this.quickQuoteModal.classList.remove('show');

        setTimeout(() => {
            this.quickQuoteModal.style.display = 'none';
            this.quickQuoteModal.classList.remove('closing');
            document.body.style.overflow = '';
            this.isModalAnimating = false;

            // Reset form
            this.resetQuoteForm();
        }, 300);
    },

    /**
     * Handle form submission
     */
    async handleQuoteSubmit(e) {
        const form = e.target;
        const submitBtn = form.querySelector('.submit-quote-btn');

        // Form validation
        if (!this.validateQuoteForm(form)) {
            return;
        }

        // Show loading state
        submitBtn.classList.add('loading');
        submitBtn.textContent = 'Sending...';

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Show success message
            this.showQuoteSuccess();

            // Delay closing modal
            setTimeout(() => {
                this.closeQuickQuoteModal();
            }, 2000);

        } catch (error) {
            console.error('Quote submission failed:', error);
            this.showQuoteError('Submission failed, please try again later');
        } finally {
            // Restore button state
            submitBtn.classList.remove('loading');
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i>Submit Quote';
        }
    },

    /**
     * Validate form
     */
    validateQuoteForm(form) {
        const requirements = form.querySelector('#requirements');
        const email = form.querySelector('#contactEmail');

        let isValid = true;

        // Clear previous error states
        this.clearFormErrors(form);

        // Validate requirements description
        if (!requirements.value.trim()) {
            this.showFieldError(requirements, 'Please describe your specific requirements');
            isValid = false;
        } else if (requirements.value.trim().length < 10) {
            this.showFieldError(requirements, 'Requirements description needs at least 10 characters');
            isValid = false;
        }

        // Validate email
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.value.trim()) {
            this.showFieldError(email, 'Please enter email address');
            isValid = false;
        } else if (!emailPattern.test(email.value.trim())) {
            this.showFieldError(email, 'Please enter a valid email address');
            isValid = false;
        }

        return isValid;
    },

    /**
     * Show field error
     */
    showFieldError(field, message) {
        const formGroup = field.closest('.form-group');
        if (formGroup) {
            formGroup.classList.add('error');

            // Remove existing error messages
            const existingError = formGroup.querySelector('.error-message');
            if (existingError) {
                existingError.remove();
            }

            // Add error message
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.textContent = message;
            formGroup.appendChild(errorDiv);
        }
    },

    /**
     * Clear form errors
     */
    clearFormErrors(form) {
        const errorGroups = form.querySelectorAll('.form-group.error');
        errorGroups.forEach(group => {
            group.classList.remove('error');
            const errorMessage = group.querySelector('.error-message');
            if (errorMessage) {
                errorMessage.remove();
            }
        });
    },

    /**
     * Show success message
     */
    showQuoteSuccess() {
        const form = document.getElementById('quickQuoteForm');
        if (form) {
            form.innerHTML = `
                <div style="text-align: center; padding: 40px 20px;">
                    <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #28a745, #20c997); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px;">
                        <i class="fas fa-check" style="font-size: 40px; color: white;"></i>
                    </div>
                    <h3 style="color: #28a745; margin-bottom: 12px;">Quote Submitted</h3>
                    <p style="color: #666; margin-bottom: 0;">We have received your quote request<br>We will contact you within 24 hours</p>
                </div>
            `;
        }
    },

    /**
     * Show error message
     */
    showQuoteError(message) {
        alert(message);
    },

    /**
     * Reset form
     */
    resetQuoteForm() {
        const form = document.getElementById('quickQuoteForm');
        if (form) {
            // Check if success message is displayed
            const successDiv = form.querySelector('div[style*="text-align: center"]');
            if (successDiv) {
                // Recreate original form structure
                form.innerHTML = `
                    <div class="form-group">
                        <textarea id="requirements" name="requirements" rows="4"
                                  placeholder="Please describe your requirements in detail, including product type, operating temperature, application scenarios, etc. All languages supported..."
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
                        Submit Quote
                    </button>
                `;

                // Reinitialize character counter
                this.initCharacterCounter();
            } else {
                // If not success message, reset normally
                form.reset();
                this.clearFormErrors(form);

                // Reset character count
                const charCount = document.getElementById('charCount');
                if (charCount) {
                    charCount.textContent = '0';
                    charCount.style.color = '#999';
                }
            }
        }
    }
};

// Note: Initialization will be handled by loader to avoid duplicate initialization

// Export to global for HTML calls
window.floatingButtons = floatingButtons;