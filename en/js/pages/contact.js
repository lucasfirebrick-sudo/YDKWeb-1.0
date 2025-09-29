/**
 * Contact Page JavaScript
 * 联系我们页面特定功能的JavaScript代码
 */

class ContactPage {
    constructor() {
        this.contactForm = document.querySelector('#contactForm');
        this.quickQuoteForm = document.querySelector('#quickQuoteForm');
        this.map = document.querySelector('#contactMap');
        this.officeLocations = document.querySelectorAll('.office-location');
        this.contactMethods = document.querySelectorAll('.contact-method');

        this.formSteps = document.querySelectorAll('.form-step');
        this.currentStep = 0;

        this.init();
    }

    init() {
        this.initContactForm();
        this.initQuickQuoteForm();
        this.initMap();
        this.initOfficeLocations();
        this.initContactMethods();
        this.bindEvents();
        this.trackPageView();
    }

    initContactForm() {
        if (!this.contactForm) return;

        // Form validation
        this.initFormValidation(this.contactForm);

        // Form submission
        this.contactForm.addEventListener('submit', (e) => this.handleContactFormSubmit(e));

        // Real-time validation
        const inputs = this.contactForm.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateInput(input));
            input.addEventListener('input', () => this.clearInputError(input));
        });

        // File upload handling
        const fileInput = this.contactForm.querySelector('input[type="file"]');
        if (fileInput) {
            this.initFileUpload(fileInput);
        }
    }

    initQuickQuoteForm() {
        if (!this.quickQuoteForm) return;

        // Multi-step form
        this.initMultiStepForm();

        // Form validation
        this.initFormValidation(this.quickQuoteForm);

        // Form submission
        this.quickQuoteForm.addEventListener('submit', (e) => this.handleQuickQuoteSubmit(e));

        // Product selector
        this.initProductSelector();

        // Quantity calculator
        this.initQuantityCalculator();
    }

    initMultiStepForm() {
        const nextButtons = this.quickQuoteForm.querySelectorAll('.btn-next');
        const prevButtons = this.quickQuoteForm.querySelectorAll('.btn-prev');
        const stepIndicators = this.quickQuoteForm.querySelectorAll('.step-indicator');

        nextButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.nextFormStep(e));
        });

        prevButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.prevFormStep(e));
        });

        // Initialize first step
        this.goToFormStep(0);
    }

    nextFormStep(e) {
        e.preventDefault();

        if (!this.validateCurrentFormStep()) {
            this.showFormError('请完成当前步骤的所有必填项');
            return;
        }

        if (this.currentStep < this.formSteps.length - 1) {
            this.goToFormStep(this.currentStep + 1);
        }

        this.trackEvent('Contact Form', 'Next Step', `Step ${this.currentStep + 1}`);
    }

    prevFormStep(e) {
        e.preventDefault();

        if (this.currentStep > 0) {
            this.goToFormStep(this.currentStep - 1);
        }

        this.trackEvent('Contact Form', 'Previous Step', `Step ${this.currentStep + 1}`);
    }

    goToFormStep(stepIndex) {
        if (stepIndex < 0 || stepIndex >= this.formSteps.length) return;

        // Hide all steps
        this.formSteps.forEach(step => step.classList.remove('active'));

        // Show target step
        this.formSteps[stepIndex].classList.add('active');

        // Update step indicators
        this.updateStepIndicators(stepIndex);

        // Update current step
        this.currentStep = stepIndex;

        // Update navigation buttons
        this.updateFormNavigation();

        // Focus first input in step
        this.focusFirstInput(this.formSteps[stepIndex]);
    }

    updateStepIndicators(activeStep) {
        const indicators = this.quickQuoteForm.querySelectorAll('.step-indicator');

        indicators.forEach((indicator, index) => {
            indicator.classList.remove('active', 'completed');

            if (index < activeStep) {
                indicator.classList.add('completed');
            } else if (index === activeStep) {
                indicator.classList.add('active');
            }
        });
    }

    updateFormNavigation() {
        const prevButtons = this.quickQuoteForm.querySelectorAll('.btn-prev');
        const nextButtons = this.quickQuoteForm.querySelectorAll('.btn-next');
        const submitButton = this.quickQuoteForm.querySelector('button[type="submit"]');

        // Update previous buttons
        prevButtons.forEach(btn => {
            btn.style.display = this.currentStep > 0 ? 'inline-block' : 'none';
        });

        // Update next buttons
        nextButtons.forEach(btn => {
            btn.style.display = this.currentStep < this.formSteps.length - 1 ? 'inline-block' : 'none';
        });

        // Update submit button
        if (submitButton) {
            submitButton.style.display = this.currentStep === this.formSteps.length - 1 ? 'inline-block' : 'none';
        }
    }

    validateCurrentFormStep() {
        const currentStepElement = this.formSteps[this.currentStep];
        const requiredInputs = currentStepElement.querySelectorAll('[required]');

        let isValid = true;

        requiredInputs.forEach(input => {
            if (!this.validateInput(input)) {
                isValid = false;
            }
        });

        return isValid;
    }

    initProductSelector() {
        const productSelector = this.quickQuoteForm.querySelector('.product-selector');
        if (!productSelector) return;

        const productCards = productSelector.querySelectorAll('.product-option');

        productCards.forEach(card => {
            card.addEventListener('click', () => {
                // Toggle selection
                card.classList.toggle('selected');

                // Update hidden input
                this.updateSelectedProducts();

                // Track product selection
                const productName = card.querySelector('.product-name')?.textContent || 'Unknown';
                this.trackEvent('Quote Form', 'Product Selection', productName);
            });
        });
    }

    updateSelectedProducts() {
        const selectedProducts = this.quickQuoteForm.querySelectorAll('.product-option.selected');
        const hiddenInput = this.quickQuoteForm.querySelector('input[name="selected_products"]');

        if (hiddenInput) {
            const productIds = Array.from(selectedProducts).map(card =>
                card.getAttribute('data-product-id')
            );
            hiddenInput.value = JSON.stringify(productIds);
        }
    }

    initQuantityCalculator() {
        const calculator = this.quickQuoteForm.querySelector('.quantity-calculator');
        if (!calculator) return;

        const inputs = calculator.querySelectorAll('input[type="number"]');
        const totalDisplay = calculator.querySelector('.total-quantity');

        inputs.forEach(input => {
            input.addEventListener('input', () => {
                this.calculateTotalQuantity(calculator);
            });
        });

        // Initialize calculation
        this.calculateTotalQuantity(calculator);
    }

    calculateTotalQuantity(calculator) {
        const inputs = calculator.querySelectorAll('input[type="number"]');
        let total = 0;

        inputs.forEach(input => {
            const value = parseFloat(input.value) || 0;
            const multiplier = parseFloat(input.getAttribute('data-multiplier')) || 1;
            total += value * multiplier;
        });

        const totalDisplay = calculator.querySelector('.total-quantity');
        if (totalDisplay) {
            totalDisplay.textContent = total.toLocaleString();
        }

        // Update hidden input
        const hiddenInput = calculator.querySelector('input[name="total_quantity"]');
        if (hiddenInput) {
            hiddenInput.value = total;
        }
    }

    initFormValidation(form) {
        // Custom validation rules
        this.validationRules = {
            email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
            phone: (value) => /^[\d\s\-\+\(\)]{10,}$/.test(value),
            required: (value) => value.trim().length > 0,
            minLength: (value, min) => value.length >= min,
            maxLength: (value, max) => value.length <= max
        };

        // Error messages
        this.errorMessages = {
            email: '请输入有效的邮箱地址',
            phone: '请输入有效的电话号码',
            required: '此字段为必填项',
            minLength: '输入内容过短',
            maxLength: '输入内容过长'
        };
    }

    validateInput(input) {
        const value = input.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Required validation
        if (input.hasAttribute('required') && !this.validationRules.required(value)) {
            isValid = false;
            errorMessage = this.errorMessages.required;
        }

        // Type-specific validation
        if (isValid && value.length > 0) {
            switch (input.type) {
                case 'email':
                    if (!this.validationRules.email(value)) {
                        isValid = false;
                        errorMessage = this.errorMessages.email;
                    }
                    break;
                case 'tel':
                    if (!this.validationRules.phone(value)) {
                        isValid = false;
                        errorMessage = this.errorMessages.phone;
                    }
                    break;
            }
        }

        // Length validation
        const minLength = input.getAttribute('data-min-length');
        const maxLength = input.getAttribute('data-max-length');

        if (isValid && minLength && !this.validationRules.minLength(value, parseInt(minLength))) {
            isValid = false;
            errorMessage = `${this.errorMessages.minLength}（最少${minLength}个字符）`;
        }

        if (isValid && maxLength && !this.validationRules.maxLength(value, parseInt(maxLength))) {
            isValid = false;
            errorMessage = `${this.errorMessages.maxLength}（最多${maxLength}个字符）`;
        }

        // Update UI
        this.setInputValidation(input, isValid, errorMessage);

        return isValid;
    }

    setInputValidation(input, isValid, errorMessage) {
        input.classList.toggle('valid', isValid);
        input.classList.toggle('invalid', !isValid);

        let errorElement = input.parentNode.querySelector('.field-error');

        if (!isValid && errorMessage) {
            if (!errorElement) {
                errorElement = document.createElement('div');
                errorElement.className = 'field-error';
                input.parentNode.appendChild(errorElement);
            }
            errorElement.textContent = errorMessage;
        } else if (errorElement) {
            errorElement.remove();
        }
    }

    clearInputError(input) {
        input.classList.remove('invalid');
        const errorElement = input.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }

    initFileUpload(fileInput) {
        const dropZone = fileInput.parentNode;
        const fileList = dropZone.querySelector('.file-list') || this.createFileList(dropZone);

        // Click to upload
        fileInput.addEventListener('change', (e) => {
            this.handleFileSelection(e.target.files, fileList);
        });

        // Drag and drop
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('drag-over');
        });

        dropZone.addEventListener('dragleave', () => {
            dropZone.classList.remove('drag-over');
        });

        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('drag-over');
            this.handleFileSelection(e.dataTransfer.files, fileList);
        });
    }

    createFileList(container) {
        const fileList = document.createElement('div');
        fileList.className = 'file-list';
        container.appendChild(fileList);
        return fileList;
    }

    handleFileSelection(files, fileList) {
        Array.from(files).forEach(file => {
            if (this.validateFile(file)) {
                this.addFileToList(file, fileList);
            }
        });
    }

    validateFile(file) {
        const maxSize = 10 * 1024 * 1024; // 10MB
        const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf', 'application/msword'];

        if (file.size > maxSize) {
            this.showFormError('文件大小不能超过10MB');
            return false;
        }

        if (!allowedTypes.includes(file.type)) {
            this.showFormError('只允许上传图片、PDF或Word文档');
            return false;
        }

        return true;
    }

    addFileToList(file, fileList) {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        fileItem.innerHTML = `
            <div class="file-info">
                <i class="fas fa-file"></i>
                <span class="file-name">${file.name}</span>
                <span class="file-size">${this.formatFileSize(file.size)}</span>
            </div>
            <button type="button" class="file-remove" title="删除文件">
                <i class="fas fa-times"></i>
            </button>
        `;

        fileList.appendChild(fileItem);

        // Remove file functionality
        fileItem.querySelector('.file-remove').addEventListener('click', () => {
            fileItem.remove();
        });
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    async handleContactFormSubmit(e) {
        e.preventDefault();

        const form = e.target;
        const submitButton = form.querySelector('button[type="submit"]');

        // Validate entire form
        if (!this.validateEntireForm(form)) {
            this.showFormError('请填写所有必填字段');
            return;
        }

        // Show loading state
        this.setFormLoading(submitButton, true);

        try {
            const formData = new FormData(form);
            await this.submitContactForm(formData);

            // Show success message
            this.showFormSuccess('消息发送成功！我们会在24小时内回复您。');

            // Reset form
            form.reset();
            this.clearAllErrors(form);

            // Track successful submission
            this.trackEvent('Contact Form', 'Form Submit', 'Contact Form Success');

        } catch (error) {
            console.error('Contact form submission error:', error);
            this.showFormError('发送失败，请稍后重试或直接联系我们。');
        } finally {
            this.setFormLoading(submitButton, false);
        }
    }

    async handleQuickQuoteSubmit(e) {
        e.preventDefault();

        const form = e.target;
        const submitButton = form.querySelector('button[type="submit"]');

        // Validate entire form
        if (!this.validateEntireForm(form)) {
            this.showFormError('请完成所有步骤的必填项');
            return;
        }

        // Show loading state
        this.setFormLoading(submitButton, true);

        try {
            const formData = new FormData(form);
            await this.submitQuickQuote(formData);

            // Show success message
            this.showFormSuccess('询价请求已提交！我们会尽快为您准备详细报价。');

            // Reset form
            form.reset();
            this.clearAllErrors(form);
            this.goToFormStep(0);

            // Track successful submission
            this.trackEvent('Quote Form', 'Form Submit', 'Quick Quote Success');

        } catch (error) {
            console.error('Quick quote submission error:', error);
            this.showFormError('提交失败，请稍后重试或直接联系我们。');
        } finally {
            this.setFormLoading(submitButton, false);
        }
    }

    async submitContactForm(formData) {
        // Simulate API call
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate random success/failure for demo
                if (Math.random() > 0.1) { // 90% success rate
                    resolve({ success: true, message: 'Form submitted successfully' });
                } else {
                    reject(new Error('Submission failed'));
                }
            }, 2000);
        });

        // Real implementation:
        // const response = await fetch('/api/contact', {
        //     method: 'POST',
        //     body: formData
        // });
        // return await response.json();
    }

    async submitQuickQuote(formData) {
        // Simulate API call
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (Math.random() > 0.1) {
                    resolve({ success: true, message: 'Quote request submitted successfully' });
                } else {
                    reject(new Error('Submission failed'));
                }
            }, 2500);
        });
    }

    validateEntireForm(form) {
        const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!this.validateInput(input)) {
                isValid = false;
            }
        });

        return isValid;
    }

    clearAllErrors(form) {
        const errorElements = form.querySelectorAll('.field-error');
        errorElements.forEach(error => error.remove());

        const inputs = form.querySelectorAll('.invalid');
        inputs.forEach(input => {
            input.classList.remove('invalid', 'valid');
        });
    }

    setFormLoading(button, isLoading) {
        button.disabled = isLoading;
        button.classList.toggle('loading', isLoading);

        if (isLoading) {
            button.setAttribute('data-original-text', button.textContent);
            button.textContent = '提交中...';
        } else {
            const originalText = button.getAttribute('data-original-text');
            if (originalText) {
                button.textContent = originalText;
            }
        }
    }

    showFormSuccess(message) {
        this.showFormMessage(message, 'success');
    }

    showFormError(message) {
        this.showFormMessage(message, 'error');
    }

    showFormMessage(message, type) {
        // Create or update message element
        let messageElement = document.querySelector('.form-message');

        if (!messageElement) {
            messageElement = document.createElement('div');
            messageElement.className = 'form-message';

            // Insert at top of contact section
            const contactSection = document.querySelector('.contact-section');
            if (contactSection) {
                contactSection.insertBefore(messageElement, contactSection.firstChild);
            }
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

        // Scroll to message
        messageElement.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest'
        });
    }

    focusFirstInput(container) {
        const firstInput = container.querySelector('input, textarea, select');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 300);
        }
    }

    initMap() {
        if (!this.map) return;

        // Initialize map (using a placeholder for now)
        this.renderMapPlaceholder();

        // In a real implementation, you would initialize Google Maps or another mapping service
        // this.initGoogleMap();
    }

    renderMapPlaceholder() {
        this.map.innerHTML = `
            <div class="map-placeholder">
                <i class="fas fa-map-marker-alt"></i>
                <h3>我们的位置</h3>
                <p>广东省佛山市三水区</p>
                <button class="btn-primary" onclick="contactPage.openExternalMap()">
                    在地图中查看
                </button>
            </div>
        `;
    }

    openExternalMap() {
        // Open in external map service
        const coordinates = '23.1552,112.8994'; // Example coordinates for Foshan
        const mapUrl = `https://maps.google.com/maps?q=${coordinates}`;
        window.open(mapUrl, '_blank');

        this.trackEvent('Contact', 'Map Interaction', 'Open External Map');
    }

    initOfficeLocations() {
        this.officeLocations.forEach(location => {
            location.addEventListener('click', () => {
                this.selectOfficeLocation(location);
            });
        });

        // Select first location by default
        if (this.officeLocations.length > 0) {
            this.selectOfficeLocation(this.officeLocations[0]);
        }
    }

    selectOfficeLocation(selectedLocation) {
        // Remove active class from all locations
        this.officeLocations.forEach(location => {
            location.classList.remove('active');
        });

        // Add active class to selected location
        selectedLocation.classList.add('active');

        // Update contact information display
        this.updateContactDisplay(selectedLocation);

        // Update map if needed
        this.updateMapLocation(selectedLocation);

        // Track location selection
        const locationName = selectedLocation.querySelector('.location-name')?.textContent || 'Unknown';
        this.trackEvent('Contact', 'Office Selection', locationName);
    }

    updateContactDisplay(location) {
        const contactInfo = {
            address: location.getAttribute('data-address'),
            phone: location.getAttribute('data-phone'),
            email: location.getAttribute('data-email'),
            hours: location.getAttribute('data-hours')
        };

        // Update contact info display
        const addressElement = document.querySelector('.contact-address');
        const phoneElement = document.querySelector('.contact-phone');
        const emailElement = document.querySelector('.contact-email');
        const hoursElement = document.querySelector('.contact-hours');

        if (addressElement) addressElement.textContent = contactInfo.address;
        if (phoneElement) phoneElement.textContent = contactInfo.phone;
        if (emailElement) emailElement.textContent = contactInfo.email;
        if (hoursElement) hoursElement.textContent = contactInfo.hours;
    }

    updateMapLocation(location) {
        // Update map to show selected location
        // In a real implementation, this would update the map center and marker
        console.log('Updating map for location:', location);
    }

    initContactMethods() {
        this.contactMethods.forEach(method => {
            method.addEventListener('click', () => {
                this.handleContactMethodClick(method);
            });
        });
    }

    handleContactMethodClick(method) {
        const methodType = method.getAttribute('data-method');
        const methodValue = method.getAttribute('data-value');

        switch (methodType) {
            case 'phone':
                window.location.href = `tel:${methodValue}`;
                break;
            case 'email':
                window.location.href = `mailto:${methodValue}`;
                break;
            case 'whatsapp':
                window.open(`https://wa.me/${methodValue}`, '_blank');
                break;
            case 'wechat':
                this.showWeChatQR(methodValue);
                break;
        }

        this.trackEvent('Contact', 'Contact Method', methodType);
    }

    showWeChatQR(wechatId) {
        // Show WeChat QR code modal
        const modal = document.createElement('div');
        modal.className = 'modal wechat-modal';
        modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h3>微信联系</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="wechat-qr">
                        <img src="/images/qr-codes/wechat-${wechatId}.png" alt="微信二维码">
                        <p>扫描二维码添加微信</p>
                        <p class="wechat-id">微信号：${wechatId}</p>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        modal.classList.add('active');

        // Close modal
        const closeBtn = modal.querySelector('.modal-close');
        const overlay = modal.querySelector('.modal-overlay');

        const closeModal = () => {
            modal.classList.remove('active');
            setTimeout(() => modal.remove(), 300);
        };

        closeBtn.addEventListener('click', closeModal);
        overlay.addEventListener('click', closeModal);
    }

    bindEvents() {
        // FAQ section if exists
        const faqItems = document.querySelectorAll('.faq-item');
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            if (question) {
                question.addEventListener('click', () => {
                    item.classList.toggle('active');

                    const questionText = question.textContent.trim();
                    this.trackEvent('Contact', 'FAQ Click', questionText);
                });
            }
        });

        // Live chat button
        const liveChatBtn = document.querySelector('.live-chat-btn');
        if (liveChatBtn) {
            liveChatBtn.addEventListener('click', () => {
                this.openLiveChat();
            });
        }

        // Callback request
        const callbackBtn = document.querySelector('.callback-request-btn');
        if (callbackBtn) {
            callbackBtn.addEventListener('click', () => {
                this.showCallbackForm();
            });
        }
    }

    openLiveChat() {
        // Integrate with live chat service
        console.log('Opening live chat...');

        // If using third-party chat service
        // window.chatWidget.open();

        this.trackEvent('Contact', 'Live Chat', 'Live Chat Opened');
    }

    showCallbackForm() {
        // Show callback request modal
        console.log('Showing callback form...');

        this.trackEvent('Contact', 'Callback Request', 'Callback Form Opened');
    }

    trackPageView() {
        this.trackEvent('Page View', 'Contact Page', window.location.pathname);
    }

    trackEvent(category, action, label) {
        // Google Analytics tracking
        if (typeof gtag !== 'undefined') {
            gtag('event', action, {
                event_category: category,
                event_label: label
            });
        }

        console.log('Event tracked:', { category, action, label });
    }

    // Public methods
    scrollToForm() {
        if (this.contactForm) {
            this.contactForm.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    scrollToQuote() {
        if (this.quickQuoteForm) {
            this.quickQuoteForm.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    prefillForm(data) {
        Object.keys(data).forEach(key => {
            const input = this.contactForm.querySelector(`[name="${key}"]`);
            if (input) {
                input.value = data[key];
            }
        });
    }

    // Cleanup method
    destroy() {
        // Clean up any intervals or observers
    }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.contactPage = new ContactPage();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ContactPage;
}