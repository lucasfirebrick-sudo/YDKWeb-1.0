/**
 * Products Page JavaScript
 * 产品页面特定功能的JavaScript代码
 */

class ProductsPage {
    constructor() {
        this.filterContainer = document.querySelector('.product-filters');
        this.productGrid = document.querySelector('.products-grid');
        this.searchInput = document.querySelector('.product-search');
        this.sortSelect = document.querySelector('.product-sort');
        this.paginationContainer = document.querySelector('.pagination');
        this.loadMoreBtn = document.querySelector('.load-more-btn');
        this.viewToggle = document.querySelector('.view-toggle');

        this.filters = {
            category: 'all',
            priceRange: 'all',
            material: 'all',
            size: 'all',
            search: ''
        };

        this.currentPage = 1;
        this.itemsPerPage = 12;
        this.currentSort = 'default';
        this.currentView = 'grid'; // grid or list
        this.products = [];
        this.filteredProducts = [];

        this.init();
    }

    init() {
        this.loadProducts();
        this.initFilters();
        this.initSearch();
        this.initSorting();
        this.initPagination();
        this.initViewToggle();
        this.bindEvents();
        this.trackPageView();
    }

    async loadProducts() {
        try {
            // In a real application, this would fetch from an API
            this.products = await this.fetchProductsData();
            this.filteredProducts = [...this.products];
            this.renderProducts();
            this.updateProductCount();
        } catch (error) {
            console.error('Error loading products:', error);
            this.showError('加载产品数据失败，请刷新页面重试。');
        }
    }

    async fetchProductsData() {
        // Simulate API call with product data
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([
                    {
                        id: 'clay-brick-1',
                        name: '标准粘土砖',
                        category: 'clay-brick',
                        price: 0.5,
                        material: 'clay',
                        size: '240x115x53',
                        image: '/images/products/clay-brick/clay-brick-1.jpg',
                        rating: 4.8,
                        reviews: 125,
                        inStock: true,
                        description: '高品质标准粘土砖，适用于各种建筑项目。'
                    },
                    {
                        id: 'clay-brick-2',
                        name: '多孔粘土砖',
                        category: 'clay-brick',
                        price: 0.7,
                        material: 'clay',
                        size: '240x115x90',
                        image: '/images/products/clay-brick/clay-brick-2.jpg',
                        rating: 4.9,
                        reviews: 89,
                        inStock: true,
                        description: '优质多孔粘土砖，保温隔热性能优异。'
                    },
                    // Add more products as needed...
                ]);
            }, 500);
        });
    }

    initFilters() {
        if (!this.filterContainer) return;

        const filterButtons = this.filterContainer.querySelectorAll('.filter-btn');
        const filterDropdowns = this.filterContainer.querySelectorAll('.filter-dropdown');

        // Filter buttons
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const filterType = btn.getAttribute('data-filter-type');
                const filterValue = btn.getAttribute('data-filter-value');
                this.applyFilter(filterType, filterValue);
                this.updateFilterButtons(filterType, filterValue);
            });
        });

        // Filter dropdowns
        filterDropdowns.forEach(dropdown => {
            dropdown.addEventListener('change', (e) => {
                const filterType = dropdown.getAttribute('data-filter-type');
                const filterValue = e.target.value;
                this.applyFilter(filterType, filterValue);
            });
        });

        // Clear filters button
        const clearFiltersBtn = this.filterContainer.querySelector('.clear-filters');
        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', () => this.clearAllFilters());
        }

        // Mobile filter toggle
        const mobileFilterToggle = document.querySelector('.mobile-filter-toggle');
        if (mobileFilterToggle) {
            mobileFilterToggle.addEventListener('click', () => this.toggleMobileFilters());
        }
    }

    applyFilter(filterType, filterValue) {
        this.filters[filterType] = filterValue;
        this.currentPage = 1; // Reset to first page
        this.filterProducts();
        this.renderProducts();
        this.updatePagination();
        this.updateProductCount();

        // Track filter usage
        this.trackEvent('Product Filter', filterType, filterValue);
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
            priceRange: 'all',
            material: 'all',
            size: 'all',
            search: ''
        };

        // Reset UI
        this.filterContainer.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-filter-value') === 'all');
        });

        this.filterContainer.querySelectorAll('.filter-dropdown').forEach(dropdown => {
            dropdown.value = 'all';
        });

        if (this.searchInput) {
            this.searchInput.value = '';
        }

        this.currentPage = 1;
        this.filterProducts();
        this.renderProducts();
        this.updatePagination();
        this.updateProductCount();

        this.trackEvent('Product Filter', 'Clear All', 'All Filters Cleared');
    }

    filterProducts() {
        this.filteredProducts = this.products.filter(product => {
            // Category filter
            if (this.filters.category !== 'all' && product.category !== this.filters.category) {
                return false;
            }

            // Price range filter
            if (this.filters.priceRange !== 'all') {
                const [min, max] = this.parsePriceRange(this.filters.priceRange);
                if (product.price < min || product.price > max) {
                    return false;
                }
            }

            // Material filter
            if (this.filters.material !== 'all' && product.material !== this.filters.material) {
                return false;
            }

            // Size filter
            if (this.filters.size !== 'all' && !product.size.includes(this.filters.size)) {
                return false;
            }

            // Search filter
            if (this.filters.search) {
                const searchTerm = this.filters.search.toLowerCase();
                const searchableText = `${product.name} ${product.description}`.toLowerCase();
                if (!searchableText.includes(searchTerm)) {
                    return false;
                }
            }

            return true;
        });

        // Apply sorting
        this.sortProducts();
    }

    parsePriceRange(rangeString) {
        // Parse price range like "0.5-1.0" or "1.0+"
        if (rangeString.includes('-')) {
            const [min, max] = rangeString.split('-').map(Number);
            return [min, max];
        } else if (rangeString.includes('+')) {
            const min = Number(rangeString.replace('+', ''));
            return [min, Infinity];
        }
        return [0, Infinity];
    }

    initSearch() {
        if (!this.searchInput) return;

        let searchTimeout;

        this.searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);

            searchTimeout = setTimeout(() => {
                this.filters.search = e.target.value.trim();
                this.currentPage = 1;
                this.filterProducts();
                this.renderProducts();
                this.updatePagination();
                this.updateProductCount();

                // Track search
                if (this.filters.search) {
                    this.trackEvent('Product Search', 'Search Query', this.filters.search);
                }
            }, 300); // Debounce search
        });

        // Search suggestions (if implemented)
        this.initSearchSuggestions();
    }

    initSearchSuggestions() {
        // Create suggestions dropdown
        const suggestionsContainer = document.createElement('div');
        suggestionsContainer.className = 'search-suggestions';
        this.searchInput.parentNode.appendChild(suggestionsContainer);

        this.searchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim().toLowerCase();

            if (query.length < 2) {
                suggestionsContainer.style.display = 'none';
                return;
            }

            const suggestions = this.getSearchSuggestions(query);
            this.renderSearchSuggestions(suggestionsContainer, suggestions);
        });

        // Hide suggestions when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-container')) {
                suggestionsContainer.style.display = 'none';
            }
        });
    }

    getSearchSuggestions(query) {
        const suggestions = new Set();

        this.products.forEach(product => {
            if (product.name.toLowerCase().includes(query)) {
                suggestions.add(product.name);
            }

            // Add category suggestions
            if (product.category.includes(query)) {
                suggestions.add(this.getCategoryDisplayName(product.category));
            }
        });

        return Array.from(suggestions).slice(0, 5);
    }

    renderSearchSuggestions(container, suggestions) {
        if (suggestions.length === 0) {
            container.style.display = 'none';
            return;
        }

        container.innerHTML = suggestions.map(suggestion => `
            <div class="suggestion-item" data-suggestion="${suggestion}">
                ${suggestion}
            </div>
        `).join('');

        container.style.display = 'block';

        // Add click handlers
        container.querySelectorAll('.suggestion-item').forEach(item => {
            item.addEventListener('click', () => {
                const suggestion = item.getAttribute('data-suggestion');
                this.searchInput.value = suggestion;
                this.filters.search = suggestion;
                this.filterProducts();
                this.renderProducts();
                this.updatePagination();
                this.updateProductCount();
                container.style.display = 'none';
            });
        });
    }

    initSorting() {
        if (!this.sortSelect) return;

        this.sortSelect.addEventListener('change', (e) => {
            this.currentSort = e.target.value;
            this.sortProducts();
            this.renderProducts();

            this.trackEvent('Product Sort', 'Sort Change', this.currentSort);
        });
    }

    sortProducts() {
        switch (this.currentSort) {
            case 'name-asc':
                this.filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'name-desc':
                this.filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
                break;
            case 'price-asc':
                this.filteredProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                this.filteredProducts.sort((a, b) => b.price - a.price);
                break;
            case 'rating-desc':
                this.filteredProducts.sort((a, b) => b.rating - a.rating);
                break;
            case 'newest':
                // Assuming products have a created date
                this.filteredProducts.sort((a, b) => new Date(b.created || 0) - new Date(a.created || 0));
                break;
            default:
                // Default sorting (e.g., relevance, featured products)
                break;
        }
    }

    initViewToggle() {
        if (!this.viewToggle) return;

        const viewButtons = this.viewToggle.querySelectorAll('.view-btn');

        viewButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const view = btn.getAttribute('data-view');
                this.setView(view);
                this.updateViewButtons(view);
            });
        });
    }

    setView(view) {
        this.currentView = view;
        this.productGrid.className = `products-grid view-${view}`;
        this.renderProducts();

        this.trackEvent('Product View', 'View Change', view);
    }

    updateViewButtons(activeView) {
        const viewButtons = this.viewToggle.querySelectorAll('.view-btn');
        viewButtons.forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-view') === activeView);
        });
    }

    renderProducts() {
        if (!this.productGrid) return;

        // Calculate products for current page
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const productsToShow = this.filteredProducts.slice(startIndex, endIndex);

        if (productsToShow.length === 0) {
            this.showNoProducts();
            return;
        }

        // Render products
        this.productGrid.innerHTML = productsToShow.map(product => {
            return this.currentView === 'grid' ?
                this.renderProductCard(product) :
                this.renderProductListItem(product);
        }).join('');

        // Add event listeners to product cards
        this.bindProductEvents();

        // Animate products in
        this.animateProductsIn();
    }

    renderProductCard(product) {
        return `
            <div class="product-card" data-product-id="${product.id}">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}" loading="lazy">
                    <div class="product-overlay">
                        <button class="btn-quick-view" data-product-id="${product.id}">
                            <i class="fas fa-eye"></i> 快速查看
                        </button>
                        <button class="btn-add-to-quote" data-product-id="${product.id}">
                            <i class="fas fa-plus"></i> 添加到询价
                        </button>
                    </div>
                    ${!product.inStock ? '<div class="out-of-stock-badge">缺货</div>' : ''}
                </div>
                <div class="product-info">
                    <h3 class="product-title">${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    <div class="product-rating">
                        ${this.renderStars(product.rating)}
                        <span class="rating-count">(${product.reviews})</span>
                    </div>
                    <div class="product-price">
                        <span class="price">¥${product.price.toFixed(2)}</span>
                        <span class="price-unit">/块</span>
                    </div>
                    <div class="product-actions">
                        <button class="btn-primary btn-quote" data-product-id="${product.id}">
                            获取报价
                        </button>
                        <button class="btn-secondary btn-details" data-product-id="${product.id}">
                            查看详情
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    renderProductListItem(product) {
        return `
            <div class="product-list-item" data-product-id="${product.id}">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}" loading="lazy">
                </div>
                <div class="product-info">
                    <h3 class="product-title">${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    <div class="product-meta">
                        <span class="product-category">${this.getCategoryDisplayName(product.category)}</span>
                        <span class="product-size">规格: ${product.size}mm</span>
                        <span class="product-material">材质: ${this.getMaterialDisplayName(product.material)}</span>
                    </div>
                    <div class="product-rating">
                        ${this.renderStars(product.rating)}
                        <span class="rating-count">(${product.reviews} 评价)</span>
                    </div>
                </div>
                <div class="product-price-actions">
                    <div class="product-price">
                        <span class="price">¥${product.price.toFixed(2)}</span>
                        <span class="price-unit">/块</span>
                    </div>
                    <div class="product-actions">
                        <button class="btn-primary btn-quote" data-product-id="${product.id}">
                            获取报价
                        </button>
                        <button class="btn-secondary btn-details" data-product-id="${product.id}">
                            查看详情
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    renderStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

        return `
            ${'<i class="fas fa-star"></i>'.repeat(fullStars)}
            ${hasHalfStar ? '<i class="fas fa-star-half-alt"></i>' : ''}
            ${'<i class="far fa-star"></i>'.repeat(emptyStars)}
        `;
    }

    showNoProducts() {
        this.productGrid.innerHTML = `
            <div class="no-products">
                <i class="fas fa-search"></i>
                <h3>未找到匹配的产品</h3>
                <p>请尝试调整筛选条件或搜索关键词</p>
                <button class="btn-primary" onclick="productsPage.clearAllFilters()">
                    清除筛选条件
                </button>
            </div>
        `;
    }

    bindProductEvents() {
        // Quick view buttons
        const quickViewBtns = this.productGrid.querySelectorAll('.btn-quick-view');
        quickViewBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const productId = btn.getAttribute('data-product-id');
                this.showQuickView(productId);
            });
        });

        // Quote buttons
        const quoteBtns = this.productGrid.querySelectorAll('.btn-quote');
        quoteBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const productId = btn.getAttribute('data-product-id');
                this.addToQuote(productId);
            });
        });

        // Details buttons
        const detailsBtns = this.productGrid.querySelectorAll('.btn-details');
        detailsBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const productId = btn.getAttribute('data-product-id');
                this.goToProductDetails(productId);
            });
        });

        // Add to quote buttons
        const addToQuoteBtns = this.productGrid.querySelectorAll('.btn-add-to-quote');
        addToQuoteBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const productId = btn.getAttribute('data-product-id');
                this.addToQuote(productId);
            });
        });

        // Product card clicks
        const productCards = this.productGrid.querySelectorAll('.product-card, .product-list-item');
        productCards.forEach(card => {
            card.addEventListener('click', () => {
                const productId = card.getAttribute('data-product-id');
                this.goToProductDetails(productId);
            });
        });
    }

    showQuickView(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        // Create or show quick view modal
        this.showQuickViewModal(product);

        this.trackEvent('Product Interaction', 'Quick View', product.name);
    }

    showQuickViewModal(product) {
        // Implementation for quick view modal
        console.log('Showing quick view for:', product.name);
        // This would show a modal with product details
    }

    addToQuote(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        // Add to quote system
        this.addProductToQuote(product);

        // Show confirmation
        this.showQuoteConfirmation(product);

        this.trackEvent('Product Interaction', 'Add to Quote', product.name);
    }

    addProductToQuote(product) {
        // Implementation for adding to quote
        let quote = JSON.parse(localStorage.getItem('productQuote') || '[]');

        // Check if product already in quote
        const existingIndex = quote.findIndex(item => item.id === product.id);

        if (existingIndex >= 0) {
            quote[existingIndex].quantity += 1;
        } else {
            quote.push({
                ...product,
                quantity: 1,
                addedAt: new Date().toISOString()
            });
        }

        localStorage.setItem('productQuote', JSON.stringify(quote));

        // Update quote badge if exists
        this.updateQuoteBadge(quote.length);
    }

    showQuoteConfirmation(product) {
        // Create toast notification
        const toast = document.createElement('div');
        toast.className = 'quote-toast';
        toast.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>${product.name} 已添加到询价单</span>
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

    updateQuoteBadge(count) {
        const badge = document.querySelector('.quote-badge');
        if (badge) {
            badge.textContent = count;
            badge.style.display = count > 0 ? 'inline-block' : 'none';
        }
    }

    goToProductDetails(productId) {
        window.location.href = `/products/${productId}.html`;
    }

    animateProductsIn() {
        const products = this.productGrid.querySelectorAll('.product-card, .product-list-item');

        products.forEach((product, index) => {
            product.style.opacity = '0';
            product.style.transform = 'translateY(20px)';

            setTimeout(() => {
                product.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                product.style.opacity = '1';
                product.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    initPagination() {
        this.updatePagination();
    }

    updatePagination() {
        if (!this.paginationContainer && !this.loadMoreBtn) return;

        const totalPages = Math.ceil(this.filteredProducts.length / this.itemsPerPage);

        if (this.paginationContainer) {
            this.renderPagination(totalPages);
        }

        if (this.loadMoreBtn) {
            this.updateLoadMoreButton(totalPages);
        }
    }

    renderPagination(totalPages) {
        if (totalPages <= 1) {
            this.paginationContainer.style.display = 'none';
            return;
        }

        this.paginationContainer.style.display = 'flex';

        const pagination = [];

        // Previous button
        pagination.push(`
            <button class="pagination-btn prev ${this.currentPage === 1 ? 'disabled' : ''}"
                    data-page="${this.currentPage - 1}" ${this.currentPage === 1 ? 'disabled' : ''}>
                <i class="fas fa-chevron-left"></i>
            </button>
        `);

        // Page numbers
        const maxVisiblePages = 5;
        let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        if (startPage > 1) {
            pagination.push(`<button class="pagination-btn" data-page="1">1</button>`);
            if (startPage > 2) {
                pagination.push(`<span class="pagination-ellipsis">...</span>`);
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            pagination.push(`
                <button class="pagination-btn ${i === this.currentPage ? 'active' : ''}"
                        data-page="${i}">${i}</button>
            `);
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                pagination.push(`<span class="pagination-ellipsis">...</span>`);
            }
            pagination.push(`<button class="pagination-btn" data-page="${totalPages}">${totalPages}</button>`);
        }

        // Next button
        pagination.push(`
            <button class="pagination-btn next ${this.currentPage === totalPages ? 'disabled' : ''}"
                    data-page="${this.currentPage + 1}" ${this.currentPage === totalPages ? 'disabled' : ''}>
                <i class="fas fa-chevron-right"></i>
            </button>
        `);

        this.paginationContainer.innerHTML = pagination.join('');

        // Bind pagination events
        this.bindPaginationEvents();
    }

    bindPaginationEvents() {
        const pageButtons = this.paginationContainer.querySelectorAll('.pagination-btn[data-page]');

        pageButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const page = parseInt(btn.getAttribute('data-page'));
                if (page !== this.currentPage && page >= 1) {
                    this.goToPage(page);
                }
            });
        });
    }

    goToPage(page) {
        this.currentPage = page;
        this.renderProducts();
        this.updatePagination();

        // Scroll to top of products
        this.productGrid.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });

        this.trackEvent('Pagination', 'Page Change', `Page ${page}`);
    }

    updateLoadMoreButton(totalPages) {
        if (this.currentPage >= totalPages) {
            this.loadMoreBtn.style.display = 'none';
        } else {
            this.loadMoreBtn.style.display = 'block';
            this.loadMoreBtn.onclick = () => this.loadMore();
        }
    }

    loadMore() {
        this.currentPage++;

        // Get next page products
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const nextProducts = this.filteredProducts.slice(startIndex, endIndex);

        // Append to existing products
        const newProductsHTML = nextProducts.map(product => {
            return this.currentView === 'grid' ?
                this.renderProductCard(product) :
                this.renderProductListItem(product);
        }).join('');

        this.productGrid.insertAdjacentHTML('beforeend', newProductsHTML);

        // Bind events to new products
        this.bindProductEvents();

        // Update load more button
        const totalPages = Math.ceil(this.filteredProducts.length / this.itemsPerPage);
        this.updateLoadMoreButton(totalPages);

        this.trackEvent('Pagination', 'Load More', `Page ${this.currentPage}`);
    }

    updateProductCount() {
        const countElement = document.querySelector('.product-count');
        if (countElement) {
            const start = Math.min((this.currentPage - 1) * this.itemsPerPage + 1, this.filteredProducts.length);
            const end = Math.min(this.currentPage * this.itemsPerPage, this.filteredProducts.length);
            const total = this.filteredProducts.length;

            countElement.textContent = `显示 ${start}-${end} 项，共 ${total} 项产品`;
        }
    }

    toggleMobileFilters() {
        const filtersPanel = document.querySelector('.filters-panel');
        if (filtersPanel) {
            filtersPanel.classList.toggle('active');
            document.body.classList.toggle('filters-open');
        }
    }

    bindEvents() {
        // Compare products functionality
        const compareButtons = document.querySelectorAll('.btn-compare');
        compareButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const productId = btn.getAttribute('data-product-id');
                this.toggleProductComparison(productId);
            });
        });

        // Wishlist functionality
        const wishlistButtons = document.querySelectorAll('.btn-wishlist');
        wishlistButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const productId = btn.getAttribute('data-product-id');
                this.toggleWishlist(productId);
            });
        });
    }

    toggleProductComparison(productId) {
        // Implementation for product comparison
        console.log('Toggle comparison for product:', productId);
        this.trackEvent('Product Interaction', 'Toggle Compare', productId);
    }

    toggleWishlist(productId) {
        // Implementation for wishlist
        console.log('Toggle wishlist for product:', productId);
        this.trackEvent('Product Interaction', 'Toggle Wishlist', productId);
    }

    getCategoryDisplayName(category) {
        const categoryNames = {
            'clay-brick': '粘土砖',
            'concrete-block': '混凝土砌块',
            'insulation-brick': '保温砖',
            'decorative-brick': '装饰砖'
        };
        return categoryNames[category] || category;
    }

    getMaterialDisplayName(material) {
        const materialNames = {
            'clay': '粘土',
            'concrete': '混凝土',
            'ceramic': '陶瓷',
            'stone': '石材'
        };
        return materialNames[material] || material;
    }

    showError(message) {
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;

        if (this.productGrid) {
            this.productGrid.innerHTML = '';
            this.productGrid.appendChild(errorElement);
        }
    }

    trackPageView() {
        this.trackEvent('Page View', 'Products Page', window.location.pathname);
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
    searchProducts(query) {
        this.searchInput.value = query;
        this.filters.search = query;
        this.filterProducts();
        this.renderProducts();
        this.updatePagination();
        this.updateProductCount();
    }

    filterByCategory(category) {
        this.applyFilter('category', category);
    }

    getFilteredProducts() {
        return this.filteredProducts;
    }

    getCurrentFilters() {
        return { ...this.filters };
    }

    // Cleanup method
    destroy() {
        // Clean up any intervals or observers
    }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.productsPage = new ProductsPage();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProductsPage;
}