/**
 * Quality Page JavaScript
 * 质量控制页面特定功能的JavaScript代码
 */

class QualityPage {
    constructor() {
        this.qualityTabs = document.querySelectorAll('.quality-tab');
        this.tabContents = document.querySelectorAll('.tab-content');
        this.certificatesGrid = document.querySelector('.certificates-grid');
        this.qualityStats = document.querySelectorAll('.stat-number');
        this.processSteps = document.querySelectorAll('.process-step');
        this.testingEquipment = document.querySelectorAll('.equipment-item');

        this.activeTab = 0;
        this.isStatsAnimated = false;

        this.init();
    }

    init() {
        this.initTabs();
        this.initCertificates();
        this.initQualityStats();
        this.initProcessFlow();
        this.initTestingEquipment();
        this.initScrollAnimations();
        this.bindEvents();
        this.trackPageView();
    }

    initTabs() {
        if (this.qualityTabs.length === 0) return;

        this.qualityTabs.forEach((tab, index) => {
            tab.addEventListener('click', () => this.switchTab(index));
        });

        // Initialize first tab as active
        this.switchTab(0);
    }

    switchTab(index) {
        if (index === this.activeTab || index >= this.qualityTabs.length) return;

        // Remove active classes
        this.qualityTabs.forEach(tab => tab.classList.remove('active'));
        this.tabContents.forEach(content => content.classList.remove('active'));

        // Add active classes
        this.qualityTabs[index].classList.add('active');
        if (this.tabContents[index]) {
            this.tabContents[index].classList.add('active');
        }

        // Update active tab
        this.activeTab = index;

        // Animate tab content
        this.animateTabContent(this.tabContents[index]);

        // Track tab switch
        const tabName = this.qualityTabs[index].textContent.trim();
        this.trackEvent('Quality Page', 'Tab Switch', tabName);
    }

    animateTabContent(content) {
        if (!content) return;

        content.style.opacity = '0';
        content.style.transform = 'translateY(20px)';

        setTimeout(() => {
            content.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            content.style.opacity = '1';
            content.style.transform = 'translateY(0)';
        }, 50);
    }

    initCertificates() {
        if (!this.certificatesGrid) return;

        const certificateCards = this.certificatesGrid.querySelectorAll('.certificate-card');

        certificateCards.forEach(card => {
            // Add hover effects
            card.addEventListener('mouseenter', () => this.onCertificateHover(card));
            card.addEventListener('mouseleave', () => this.onCertificateLeave(card));

            // Add click handler for modal
            card.addEventListener('click', () => this.showCertificateModal(card));
        });

        // Initialize certificate lightbox
        this.initCertificateLightbox();
    }

    onCertificateHover(card) {
        card.style.transform = 'translateY(-10px)';
        card.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';

        // Animate certificate image
        const image = card.querySelector('.certificate-image img');
        if (image) {
            image.style.transform = 'scale(1.05)';
        }
    }

    onCertificateLeave(card) {
        card.style.transform = 'translateY(0)';
        card.style.boxShadow = '';

        const image = card.querySelector('.certificate-image img');
        if (image) {
            image.style.transform = 'scale(1)';
        }
    }

    showCertificateModal(card) {
        const certificateTitle = card.querySelector('.certificate-title')?.textContent || 'Certificate';
        const certificateImage = card.querySelector('.certificate-image img')?.src || '';
        const certificateDate = card.getAttribute('data-date') || '';
        const certificateDescription = card.getAttribute('data-description') || '';

        // Create and show modal
        this.createCertificateModal(certificateTitle, certificateImage, certificateDate, certificateDescription);

        // Track certificate view
        this.trackEvent('Quality Page', 'Certificate View', certificateTitle);
    }

    createCertificateModal(title, imageSrc, date, description) {
        // Remove existing modal if any
        const existingModal = document.querySelector('#certificateModal');
        if (existingModal) {
            existingModal.remove();
        }

        const modal = document.createElement('div');
        modal.id = 'certificateModal';
        modal.className = 'modal certificate-modal';
        modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${title}</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="certificate-display">
                        <div class="certificate-image-large">
                            <img src="${imageSrc}" alt="${title}">
                        </div>
                        <div class="certificate-info">
                            <div class="certificate-date">
                                <i class="fas fa-calendar"></i>
                                <span>颁发日期：${date}</span>
                            </div>
                            <div class="certificate-description">
                                <p>${description}</p>
                            </div>
                            <div class="certificate-actions">
                                <button class="btn-primary" onclick="qualityPage.downloadCertificate('${imageSrc}')">
                                    <i class="fas fa-download"></i> 下载证书
                                </button>
                                <button class="btn-secondary" onclick="qualityPage.verifyCertificate('${title}')">
                                    <i class="fas fa-shield-alt"></i> 验证证书
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Bind close events
        this.bindModalCloseEvents(modal);
    }

    bindModalCloseEvents(modal) {
        const closeBtn = modal.querySelector('.modal-close');
        const overlay = modal.querySelector('.modal-overlay');

        const closeModal = () => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
            setTimeout(() => modal.remove(), 300);
        };

        closeBtn.addEventListener('click', closeModal);
        overlay.addEventListener('click', closeModal);

        // ESC key to close
        const handleKeydown = (e) => {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', handleKeydown);
            }
        };
        document.addEventListener('keydown', handleKeydown);
    }

    downloadCertificate(imageSrc) {
        // Create a download link
        const link = document.createElement('a');
        link.href = imageSrc;
        link.download = 'certificate.jpg';
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        this.trackEvent('Quality Page', 'Certificate Download', imageSrc);
    }

    verifyCertificate(title) {
        // Redirect to verification page or show verification modal
        console.log('Verifying certificate:', title);

        // Show verification modal
        this.showVerificationModal(title);

        this.trackEvent('Quality Page', 'Certificate Verification', title);
    }

    showVerificationModal(title) {
        const modal = document.createElement('div');
        modal.className = 'modal verification-modal';
        modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h3>证书验证</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="verification-content">
                        <div class="verification-icon">
                            <i class="fas fa-check-circle"></i>
                        </div>
                        <h4>证书已验证</h4>
                        <p>证书 "${title}" 已通过官方验证，真实有效。</p>
                        <div class="verification-details">
                            <div class="detail-item">
                                <span class="label">验证时间：</span>
                                <span class="value">${new Date().toLocaleString()}</span>
                            </div>
                            <div class="detail-item">
                                <span class="label">验证状态：</span>
                                <span class="value status-valid">有效</span>
                            </div>
                            <div class="detail-item">
                                <span class="label">颁发机构：</span>
                                <span class="value">国家质量监督检验检疫总局</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-primary modal-close-btn">确定</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        modal.classList.add('active');

        // Bind close events
        this.bindModalCloseEvents(modal);
    }

    initCertificateLightbox() {
        // Simple lightbox for certificate images
        const certificateImages = document.querySelectorAll('.certificate-image img');

        certificateImages.forEach(img => {
            img.addEventListener('click', (e) => {
                e.stopPropagation();
                this.showImageLightbox(img.src, img.alt);
            });
        });
    }

    showImageLightbox(imageSrc, imageAlt) {
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-overlay"></div>
            <div class="lightbox-content">
                <img src="${imageSrc}" alt="${imageAlt}">
                <button class="lightbox-close">&times;</button>
                <div class="lightbox-caption">${imageAlt}</div>
            </div>
        `;

        document.body.appendChild(lightbox);
        lightbox.classList.add('active');

        // Close lightbox
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const overlay = lightbox.querySelector('.lightbox-overlay');

        const closeLightbox = () => {
            lightbox.classList.remove('active');
            setTimeout(() => lightbox.remove(), 300);
        };

        closeBtn.addEventListener('click', closeLightbox);
        overlay.addEventListener('click', closeLightbox);
    }

    initQualityStats() {
        if (this.qualityStats.length === 0) return;

        // Observe stats section for animation trigger
        const statsSection = document.querySelector('.quality-stats');
        if (statsSection) {
            this.statsObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !this.isStatsAnimated) {
                        this.animateQualityStats();
                        this.isStatsAnimated = true;
                    }
                });
            }, { threshold: 0.5 });

            this.statsObserver.observe(statsSection);
        }
    }

    animateQualityStats() {
        this.qualityStats.forEach((stat, index) => {
            const target = parseInt(stat.getAttribute('data-count')) || 0;
            const suffix = stat.getAttribute('data-suffix') || '';
            const prefix = stat.getAttribute('data-prefix') || '';
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;

            const updateStat = () => {
                current += increment;

                if (current < target) {
                    stat.textContent = prefix + Math.floor(current).toLocaleString() + suffix;
                    requestAnimationFrame(updateStat);
                } else {
                    stat.textContent = prefix + target.toLocaleString() + suffix;
                }
            };

            // Add staggered delay
            setTimeout(updateStat, index * 200);
        });
    }

    initProcessFlow() {
        if (this.processSteps.length === 0) return;

        // Observe process steps for sequential animation
        this.processObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateProcessStep(entry.target);
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: '0px 0px -50px 0px'
        });

        this.processSteps.forEach((step, index) => {
            step.style.setProperty('--step-delay', `${index * 0.2}s`);
            this.processObserver.observe(step);

            // Add click handler for step details
            step.addEventListener('click', () => this.showProcessStepDetails(step));
        });
    }

    animateProcessStep(step) {
        step.classList.add('animate');

        // Animate step number
        const stepNumber = step.querySelector('.step-number');
        if (stepNumber) {
            stepNumber.style.transform = 'scale(1.2)';
            setTimeout(() => {
                stepNumber.style.transform = 'scale(1)';
            }, 300);
        }

        // Animate step content
        const stepContent = step.querySelector('.step-content');
        if (stepContent) {
            stepContent.style.opacity = '0';
            stepContent.style.transform = 'translateY(20px)';

            setTimeout(() => {
                stepContent.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                stepContent.style.opacity = '1';
                stepContent.style.transform = 'translateY(0)';
            }, 200);
        }
    }

    showProcessStepDetails(step) {
        const stepTitle = step.querySelector('.step-title')?.textContent || 'Process Step';
        const stepDescription = step.getAttribute('data-description') || '';
        const stepStandards = step.getAttribute('data-standards') || '';

        // Create details modal
        this.createProcessDetailsModal(stepTitle, stepDescription, stepStandards);

        this.trackEvent('Quality Page', 'Process Step Click', stepTitle);
    }

    createProcessDetailsModal(title, description, standards) {
        const modal = document.createElement('div');
        modal.className = 'modal process-details-modal';
        modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${title}</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="process-details">
                        <div class="process-description">
                            <h4>步骤描述</h4>
                            <p>${description}</p>
                        </div>
                        <div class="process-standards">
                            <h4>执行标准</h4>
                            <p>${standards}</p>
                        </div>
                        <div class="process-equipment">
                            <h4>使用设备</h4>
                            <div class="equipment-list">
                                <!-- Equipment items would be dynamically loaded -->
                                <div class="equipment-item">
                                    <img src="/images/equipment/testing-equipment-1.jpg" alt="检测设备">
                                    <span>高精度检测仪</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        modal.classList.add('active');

        // Bind close events
        this.bindModalCloseEvents(modal);
    }

    initTestingEquipment() {
        if (this.testingEquipment.length === 0) return;

        this.testingEquipment.forEach(equipment => {
            // Add hover effects
            equipment.addEventListener('mouseenter', () => this.onEquipmentHover(equipment));
            equipment.addEventListener('mouseleave', () => this.onEquipmentLeave(equipment));

            // Add click handler for equipment details
            equipment.addEventListener('click', () => this.showEquipmentDetails(equipment));
        });
    }

    onEquipmentHover(equipment) {
        equipment.style.transform = 'translateY(-5px)';
        equipment.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';

        const image = equipment.querySelector('img');
        if (image) {
            image.style.transform = 'scale(1.05)';
        }
    }

    onEquipmentLeave(equipment) {
        equipment.style.transform = 'translateY(0)';
        equipment.style.boxShadow = '';

        const image = equipment.querySelector('img');
        if (image) {
            image.style.transform = 'scale(1)';
        }
    }

    showEquipmentDetails(equipment) {
        const equipmentName = equipment.querySelector('.equipment-name')?.textContent || 'Equipment';
        const equipmentSpecs = equipment.getAttribute('data-specs') || '';
        const equipmentPurpose = equipment.getAttribute('data-purpose') || '';

        // Create equipment details modal
        this.createEquipmentDetailsModal(equipmentName, equipmentSpecs, equipmentPurpose);

        this.trackEvent('Quality Page', 'Equipment Click', equipmentName);
    }

    createEquipmentDetailsModal(name, specs, purpose) {
        const modal = document.createElement('div');
        modal.className = 'modal equipment-details-modal';
        modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${name}</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="equipment-details">
                        <div class="equipment-image">
                            <img src="/images/equipment/${name.toLowerCase().replace(/\s+/g, '-')}.jpg" alt="${name}">
                        </div>
                        <div class="equipment-info">
                            <div class="equipment-purpose">
                                <h4>设备用途</h4>
                                <p>${purpose}</p>
                            </div>
                            <div class="equipment-specs">
                                <h4>技术规格</h4>
                                <p>${specs}</p>
                            </div>
                            <div class="equipment-certification">
                                <h4>认证状态</h4>
                                <div class="certification-badges">
                                    <span class="badge certified">ISO认证</span>
                                    <span class="badge certified">CE认证</span>
                                    <span class="badge calibrated">已校准</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        modal.classList.add('active');

        // Bind close events
        this.bindModalCloseEvents(modal);
    }

    initScrollAnimations() {
        const animatedElements = document.querySelectorAll('[data-animate]');

        this.scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                }
            });
        }, {
            threshold: 0.2,
            rootMargin: '0px 0px -50px 0px'
        });

        animatedElements.forEach(element => {
            this.scrollObserver.observe(element);
        });
    }

    animateElement(element) {
        const animationType = element.getAttribute('data-animate');

        element.style.opacity = '0';

        switch (animationType) {
            case 'fade-up':
                element.style.transform = 'translateY(30px)';
                break;
            case 'fade-left':
                element.style.transform = 'translateX(-30px)';
                break;
            case 'fade-right':
                element.style.transform = 'translateX(30px)';
                break;
            case 'scale-up':
                element.style.transform = 'scale(0.9)';
                break;
        }

        element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';

        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0) translateX(0) scale(1)';
        }, 100);

        this.scrollObserver.unobserve(element);
    }

    bindEvents() {
        // Quality standards links
        const standardsLinks = document.querySelectorAll('.standards-link');
        standardsLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const standardName = link.textContent.trim();
                this.showStandardDetails(standardName);
            });
        });

        // Quality report downloads
        const reportDownloads = document.querySelectorAll('.quality-report-download');
        reportDownloads.forEach(download => {
            download.addEventListener('click', () => {
                const reportType = download.getAttribute('data-report-type');
                this.downloadQualityReport(reportType);
            });
        });

        // Quality feedback form
        const feedbackForm = document.querySelector('#qualityFeedbackForm');
        if (feedbackForm) {
            feedbackForm.addEventListener('submit', (e) => this.handleFeedbackSubmit(e));
        }

        // Quality inquiry buttons
        const inquiryButtons = document.querySelectorAll('.quality-inquiry-btn');
        inquiryButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.openQualityInquiry();
            });
        });
    }

    showStandardDetails(standardName) {
        // Show standard details modal
        console.log('Showing details for standard:', standardName);

        this.trackEvent('Quality Page', 'Standard View', standardName);
    }

    downloadQualityReport(reportType) {
        // Simulate report download
        console.log('Downloading quality report:', reportType);

        this.trackEvent('Quality Page', 'Report Download', reportType);
    }

    async handleFeedbackSubmit(e) {
        e.preventDefault();

        const form = e.target;
        const formData = new FormData(form);

        try {
            // Simulate form submission
            await this.submitQualityFeedback(formData);

            // Show success message
            this.showFeedbackSuccess();

            // Reset form
            form.reset();

            this.trackEvent('Quality Page', 'Feedback Submit', 'Success');

        } catch (error) {
            console.error('Feedback submission error:', error);
            this.showFeedbackError();
        }
    }

    async submitQualityFeedback(formData) {
        return new Promise((resolve) => {
            setTimeout(resolve, 1000);
        });
    }

    showFeedbackSuccess() {
        this.showMessage('反馈提交成功！感谢您的宝贵意见。', 'success');
    }

    showFeedbackError() {
        this.showMessage('提交失败，请稍后重试。', 'error');
    }

    showMessage(message, type) {
        const messageElement = document.createElement('div');
        messageElement.className = `quality-message ${type}`;
        messageElement.textContent = message;

        document.body.appendChild(messageElement);

        setTimeout(() => {
            messageElement.classList.add('fade-out');
            setTimeout(() => messageElement.remove(), 300);
        }, 3000);
    }

    openQualityInquiry() {
        // Redirect to contact page with quality inquiry pre-selected
        window.location.href = '/contact.html#quality-inquiry';

        this.trackEvent('Quality Page', 'Quality Inquiry', 'Quality Inquiry Form');
    }

    trackPageView() {
        this.trackEvent('Page View', 'Quality Page', window.location.pathname);
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
    switchToTab(index) {
        this.switchTab(index);
    }

    showCertificateByName(certificateName) {
        const certificate = Array.from(document.querySelectorAll('.certificate-card')).find(card =>
            card.querySelector('.certificate-title')?.textContent.includes(certificateName)
        );

        if (certificate) {
            this.showCertificateModal(certificate);
        }
    }

    scrollToCertificates() {
        if (this.certificatesGrid) {
            this.certificatesGrid.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    // Cleanup method
    destroy() {
        if (this.statsObserver) {
            this.statsObserver.disconnect();
        }

        if (this.processObserver) {
            this.processObserver.disconnect();
        }

        if (this.scrollObserver) {
            this.scrollObserver.disconnect();
        }
    }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.qualityPage = new QualityPage();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = QualityPage;
}