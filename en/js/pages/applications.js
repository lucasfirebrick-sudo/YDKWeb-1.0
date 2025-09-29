/**
 * Applications Page JavaScript
 * 应用领域页面特定功能的JavaScript代码
 */

class ApplicationsPage {
    constructor() {
        this.applicationsGrid = document.querySelector('.applications-grid');
        this.filterContainer = document.querySelector('.application-filters');
        this.searchInput = document.querySelector('.application-search');
        this.sortSelect = document.querySelector('.application-sort');
        this.categoryTabs = document.querySelectorAll('.category-tab');

        this.filters = {
            category: 'all',
            industry: 'all',
            search: ''
        };

        this.currentSort = 'default';
        this.applications = [];
        this.filteredApplications = [];

        this.init();
    }

    init() {
        this.loadApplications();
        this.initFilters();
        this.initSearch();
        this.initSorting();
        this.initCategoryTabs();
        this.bindEvents();
        this.trackPageView();
    }

    async loadApplications() {
        try {
            this.applications = await this.fetchApplicationsData();
            this.filteredApplications = [...this.applications];
            this.renderApplications();
        } catch (error) {
            console.error('Error loading applications:', error);
            this.showError('加载应用数据失败，请刷新页面重试。');
        }
    }

    async fetchApplicationsData() {
        // Simulate API call with applications data
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([
                    {
                        id: 'residential-construction',
                        title: '住宅建筑',
                        category: 'construction',
                        industry: 'residential',
                        image: '/images/applications/residential-construction.jpg',
                        description: '适用于各类住宅建筑项目，包括独栋别墅、公寓楼和住宅小区。',
                        features: ['保温隔热', '结构稳定', '环保安全', '成本经济'],
                        suitableProducts: ['clay-brick-1', 'clay-brick-2', 'insulation-brick-1'],
                        caseStudies: 3,
                        popularity: 95
                    },
                    {
                        id: 'commercial-buildings',
                        title: '商业建筑',
                        category: 'construction',
                        industry: 'commercial',
                        image: '/images/applications/commercial-buildings.jpg',
                        description: '商业综合体、办公楼、购物中心等商业建筑的理想选择。',
                        features: ['耐久性强', '防火安全', '美观大方', '维护简便'],
                        suitableProducts: ['concrete-block-1', 'decorative-brick-1'],
                        caseStudies: 8,
                        popularity: 88
                    },
                    {
                        id: 'industrial-facilities',
                        title: '工业设施',
                        category: 'industrial',
                        industry: 'manufacturing',
                        image: '/images/applications/industrial-facilities.jpg',
                        description: '工厂、仓库、生产车间等工业建筑的专业解决方案。',
                        features: ['承重能力强', '抗震性能好', '防潮防腐', '施工便捷'],
                        suitableProducts: ['concrete-block-2', 'clay-brick-3'],
                        caseStudies: 12,
                        popularity: 82
                    },
                    {
                        id: 'infrastructure-projects',
                        title: '基础设施',
                        category: 'infrastructure',
                        industry: 'public',
                        image: '/images/applications/infrastructure.jpg',
                        description: '道路、桥梁、隧道等基础设施建设的可靠材料。',
                        features: ['高强度', '耐候性优', '抗冻融', '长期稳定'],
                        suitableProducts: ['concrete-block-3', 'stone-brick-1'],
                        caseStudies: 15,
                        popularity: 75
                    }
                    // Add more applications as needed...
                ]);
            }, 300);
        });
    }

    initFilters() {
        if (!this.filterContainer) return;

        const filterButtons = this.filterContainer.querySelectorAll('.filter-btn');

        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const filterType = btn.getAttribute('data-filter-type');
                const filterValue = btn.getAttribute('data-filter-value');
                this.applyFilter(filterType, filterValue);
                this.updateFilterButtons(filterType, filterValue);
            });
        });

        // Clear filters button
        const clearFiltersBtn = this.filterContainer.querySelector('.clear-filters');
        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', () => this.clearAllFilters());
        }
    }

    applyFilter(filterType, filterValue) {
        this.filters[filterType] = filterValue;
        this.filterApplications();
        this.renderApplications();

        // Track filter usage
        this.trackEvent('Application Filter', filterType, filterValue);
    }

    updateFilterButtons(filterType, activeValue) {
        const buttons = this.filterContainer.querySelectorAll(`[data-filter-type="${filterType}"]`);
        buttons.forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-filter-value') === activeValue);
        });
    }

    clearAllFilters() {
        this.filters = {
            category: 'all',
            industry: 'all',
            search: ''
        };

        // Reset UI
        this.filterContainer.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-filter-value') === 'all');
        });

        if (this.searchInput) {
            this.searchInput.value = '';
        }

        this.filterApplications();
        this.renderApplications();

        this.trackEvent('Application Filter', 'Clear All', 'All Filters Cleared');
    }

    filterApplications() {
        this.filteredApplications = this.applications.filter(application => {
            // Category filter
            if (this.filters.category !== 'all' && application.category !== this.filters.category) {
                return false;
            }

            // Industry filter
            if (this.filters.industry !== 'all' && application.industry !== this.filters.industry) {
                return false;
            }

            // Search filter
            if (this.filters.search) {
                const searchTerm = this.filters.search.toLowerCase();
                const searchableText = `${application.title} ${application.description}`.toLowerCase();
                if (!searchableText.includes(searchTerm)) {
                    return false;
                }
            }

            return true;
        });

        // Apply sorting
        this.sortApplications();
    }

    initSearch() {
        if (!this.searchInput) return;

        let searchTimeout;

        this.searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);

            searchTimeout = setTimeout(() => {
                this.filters.search = e.target.value.trim();
                this.filterApplications();
                this.renderApplications();

                // Track search
                if (this.filters.search) {
                    this.trackEvent('Application Search', 'Search Query', this.filters.search);
                }
            }, 300);
        });
    }

    initSorting() {
        if (!this.sortSelect) return;

        this.sortSelect.addEventListener('change', (e) => {
            this.currentSort = e.target.value;
            this.sortApplications();
            this.renderApplications();

            this.trackEvent('Application Sort', 'Sort Change', this.currentSort);
        });
    }

    sortApplications() {
        switch (this.currentSort) {
            case 'title-asc':
                this.filteredApplications.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'title-desc':
                this.filteredApplications.sort((a, b) => b.title.localeCompare(a.title));
                break;
            case 'popularity-desc':
                this.filteredApplications.sort((a, b) => b.popularity - a.popularity);
                break;
            case 'cases-desc':
                this.filteredApplications.sort((a, b) => b.caseStudies - a.caseStudies);
                break;
            default:
                // Default sorting
                break;
        }
    }

    initCategoryTabs() {
        this.categoryTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const category = tab.getAttribute('data-category');
                this.switchCategoryTab(category);
            });
        });
    }

    switchCategoryTab(category) {
        // Update active tab
        this.categoryTabs.forEach(tab => {
            tab.classList.toggle('active', tab.getAttribute('data-category') === category);
        });

        // Apply category filter
        this.applyFilter('category', category);

        this.trackEvent('Application Category', 'Tab Switch', category);
    }

    renderApplications() {
        if (!this.applicationsGrid) return;

        if (this.filteredApplications.length === 0) {
            this.showNoApplications();
            return;
        }

        this.applicationsGrid.innerHTML = this.filteredApplications.map(application =>
            this.renderApplicationCard(application)
        ).join('');

        // Add event listeners
        this.bindApplicationEvents();

        // Animate applications in
        this.animateApplicationsIn();
    }

    renderApplicationCard(application) {
        return `
            <div class="application-card" data-application-id="${application.id}">
                <div class="application-image">
                    <img src="${application.image}" alt="${application.title}" loading="lazy">
                    <div class="application-overlay">
                        <div class="application-stats">
                            <span class="stat-item">
                                <i class="fas fa-chart-line"></i>
                                ${application.popularity}% 流行度
                            </span>
                            <span class="stat-item">
                                <i class="fas fa-briefcase"></i>
                                ${application.caseStudies} 案例
                            </span>
                        </div>
                    </div>
                    <div class="application-category-badge">
                        ${this.getCategoryDisplayName(application.category)}
                    </div>
                </div>
                <div class="application-content">
                    <h3 class="application-title">${application.title}</h3>
                    <p class="application-description">${application.description}</p>

                    <div class="application-features">
                        <h4>主要特点</h4>
                        <ul class="features-list">
                            ${application.features.map(feature => `<li>${feature}</li>`).join('')}
                        </ul>
                    </div>

                    <div class="application-actions">
                        <button class="btn-primary btn-view-details" data-application-id="${application.id}">
                            查看详情
                        </button>
                        <button class="btn-secondary btn-suitable-products" data-application-id="${application.id}">
                            适用产品
                        </button>
                        <button class="btn-outline btn-case-studies" data-application-id="${application.id}">
                            案例研究
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    showNoApplications() {
        this.applicationsGrid.innerHTML = `
            <div class="no-applications">
                <i class="fas fa-search"></i>
                <h3>未找到匹配的应用</h3>
                <p>请尝试调整筛选条件或搜索关键词</p>
                <button class="btn-primary" onclick="applicationsPage.clearAllFilters()">
                    清除筛选条件
                </button>
            </div>
        `;
    }

    bindApplicationEvents() {
        // View details buttons
        const detailsBtns = this.applicationsGrid.querySelectorAll('.btn-view-details');
        detailsBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const applicationId = btn.getAttribute('data-application-id');
                this.viewApplicationDetails(applicationId);
            });
        });

        // Suitable products buttons
        const productsBtns = this.applicationsGrid.querySelectorAll('.btn-suitable-products');
        productsBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const applicationId = btn.getAttribute('data-application-id');
                this.showSuitableProducts(applicationId);
            });
        });

        // Case studies buttons
        const casesBtns = this.applicationsGrid.querySelectorAll('.btn-case-studies');
        casesBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const applicationId = btn.getAttribute('data-application-id');
                this.showCaseStudies(applicationId);
            });
        });

        // Application card clicks
        const applicationCards = this.applicationsGrid.querySelectorAll('.application-card');
        applicationCards.forEach(card => {
            card.addEventListener('click', () => {
                const applicationId = card.getAttribute('data-application-id');
                this.viewApplicationDetails(applicationId);
            });
        });
    }

    viewApplicationDetails(applicationId) {
        // Navigate to application details page
        window.location.href = `/applications/${applicationId}.html`;

        // Track application view
        const application = this.applications.find(app => app.id === applicationId);
        if (application) {
            this.trackEvent('Application Interaction', 'View Details', application.title);
        }
    }

    showSuitableProducts(applicationId) {
        const application = this.applications.find(app => app.id === applicationId);
        if (!application) return;

        // Show modal with suitable products
        this.showSuitableProductsModal(application);

        this.trackEvent('Application Interaction', 'View Suitable Products', application.title);
    }

    showSuitableProductsModal(application) {
        // Create or show suitable products modal
        let modal = document.querySelector('#suitableProductsModal');

        if (!modal) {
            modal = this.createSuitableProductsModal();
            document.body.appendChild(modal);
        }

        // Update modal content
        const modalTitle = modal.querySelector('.modal-title');
        const productsList = modal.querySelector('.suitable-products-list');

        modalTitle.textContent = `${application.title} - 适用产品`;

        // Render suitable products
        productsList.innerHTML = application.suitableProducts.map(productId => {
            return this.renderSuitableProductItem(productId);
        }).join('');

        // Show modal
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Bind close events
        this.bindModalCloseEvents(modal);
    }

    createSuitableProductsModal() {
        const modal = document.createElement('div');
        modal.id = 'suitableProductsModal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h3 class="modal-title"></h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="suitable-products-list"></div>
                </div>
                <div class="modal-footer">
                    <button class="btn-secondary modal-close-btn">关闭</button>
                    <button class="btn-primary btn-contact-expert">咨询专家</button>
                </div>
            </div>
        `;
        return modal;
    }

    renderSuitableProductItem(productId) {
        // This would normally fetch product data
        return `
            <div class="suitable-product-item" data-product-id="${productId}">
                <div class="product-image">
                    <img src="/images/products/${productId}.jpg" alt="Product ${productId}" loading="lazy">
                </div>
                <div class="product-info">
                    <h4 class="product-name">产品 ${productId}</h4>
                    <p class="product-description">产品描述...</p>
                    <div class="product-actions">
                        <button class="btn-sm btn-primary" onclick="window.open('/products/${productId}.html', '_blank')">
                            查看产品
                        </button>
                        <button class="btn-sm btn-secondary" onclick="applicationsPage.addToQuote('${productId}')">
                            添加询价
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    showCaseStudies(applicationId) {
        const application = this.applications.find(app => app.id === applicationId);
        if (!application) return;

        // Navigate to case studies page with filter
        window.location.href = `/case-studies.html?application=${applicationId}`;

        this.trackEvent('Application Interaction', 'View Case Studies', application.title);
    }

    bindModalCloseEvents(modal) {
        const closeBtn = modal.querySelector('.modal-close');
        const closeBtnFooter = modal.querySelector('.modal-close-btn');
        const overlay = modal.querySelector('.modal-overlay');

        const closeModal = () => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        };

        closeBtn.addEventListener('click', closeModal);
        closeBtnFooter.addEventListener('click', closeModal);
        overlay.addEventListener('click', closeModal);

        // ESC key to close
        const handleKeydown = (e) => {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', handleKeydown);
            }
        };
        document.addEventListener('keydown', handleKeydown);

        // Contact expert button
        const contactBtn = modal.querySelector('.btn-contact-expert');
        if (contactBtn) {
            contactBtn.addEventListener('click', () => {
                this.contactExpert();
                closeModal();
            });
        }
    }

    contactExpert() {
        // Redirect to contact page or open contact modal
        window.location.href = '/contact.html#expert-consultation';

        this.trackEvent('Application Interaction', 'Contact Expert', 'Expert Consultation');
    }

    addToQuote(productId) {
        // Add product to quote (similar to products page)
        console.log('Adding product to quote:', productId);

        // Show confirmation
        this.showQuoteConfirmation(productId);

        this.trackEvent('Application Interaction', 'Add to Quote', productId);
    }

    showQuoteConfirmation(productId) {
        // Create toast notification
        const toast = document.createElement('div');
        toast.className = 'quote-toast';
        toast.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>产品已添加到询价单</span>
            <button class="toast-close">&times;</button>
        `;

        document.body.appendChild(toast);

        // Auto-remove toast
        setTimeout(() => {
            toast.classList.add('fade-out');
            setTimeout(() => toast.remove(), 300);
        }, 3000);

        // Manual close
        toast.querySelector('.toast-close').addEventListener('click', () => {
            toast.remove();
        });
    }

    animateApplicationsIn() {
        const applications = this.applicationsGrid.querySelectorAll('.application-card');

        applications.forEach((application, index) => {
            application.style.opacity = '0';
            application.style.transform = 'translateY(30px)';

            setTimeout(() => {
                application.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                application.style.opacity = '1';
                application.style.transform = 'translateY(0)';
            }, index * 150);
        });
    }

    bindEvents() {
        // Application comparison functionality
        const compareButtons = document.querySelectorAll('.btn-compare-application');
        compareButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const applicationId = btn.getAttribute('data-application-id');
                this.toggleApplicationComparison(applicationId);
            });
        });

        // Download application guides
        const downloadButtons = document.querySelectorAll('.btn-download-guide');
        downloadButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const applicationId = btn.getAttribute('data-application-id');
                this.downloadApplicationGuide(applicationId);
            });
        });

        // Share application
        const shareButtons = document.querySelectorAll('.btn-share-application');
        shareButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const applicationId = btn.getAttribute('data-application-id');
                this.shareApplication(applicationId);
            });
        });
    }

    toggleApplicationComparison(applicationId) {
        // Implementation for application comparison
        console.log('Toggle comparison for application:', applicationId);
        this.trackEvent('Application Interaction', 'Toggle Compare', applicationId);
    }

    downloadApplicationGuide(applicationId) {
        const application = this.applications.find(app => app.id === applicationId);
        if (!application) return;

        // Simulate download
        console.log('Downloading guide for:', application.title);

        // In real implementation, trigger actual download
        // window.open(`/downloads/guides/${applicationId}.pdf`, '_blank');

        this.trackEvent('Application Interaction', 'Download Guide', application.title);
    }

    shareApplication(applicationId) {
        const application = this.applications.find(app => app.id === applicationId);
        if (!application) return;

        if (navigator.share) {
            // Use native share API if available
            navigator.share({
                title: application.title,
                text: application.description,
                url: window.location.href + '#' + applicationId
            });
        } else {
            // Fallback to copying link
            const url = window.location.href + '#' + applicationId;
            navigator.clipboard.writeText(url).then(() => {
                // Show success message
                this.showShareConfirmation();
            });
        }

        this.trackEvent('Application Interaction', 'Share', application.title);
    }

    showShareConfirmation() {
        const toast = document.createElement('div');
        toast.className = 'share-toast';
        toast.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>链接已复制到剪贴板</span>
        `;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('fade-out');
            setTimeout(() => toast.remove(), 300);
        }, 2000);
    }

    getCategoryDisplayName(category) {
        const categoryNames = {
            'construction': '建筑施工',
            'industrial': '工业设施',
            'infrastructure': '基础设施',
            'residential': '住宅建筑',
            'commercial': '商业建筑'
        };
        return categoryNames[category] || category;
    }

    showError(message) {
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;

        if (this.applicationsGrid) {
            this.applicationsGrid.innerHTML = '';
            this.applicationsGrid.appendChild(errorElement);
        }
    }

    trackPageView() {
        this.trackEvent('Page View', 'Applications Page', window.location.pathname);
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
    searchApplications(query) {
        this.searchInput.value = query;
        this.filters.search = query;
        this.filterApplications();
        this.renderApplications();
    }

    filterByCategory(category) {
        this.applyFilter('category', category);
    }

    getFilteredApplications() {
        return this.filteredApplications;
    }

    // Cleanup method
    destroy() {
        // Clean up any intervals or observers
    }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.applicationsPage = new ApplicationsPage();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ApplicationsPage;
}