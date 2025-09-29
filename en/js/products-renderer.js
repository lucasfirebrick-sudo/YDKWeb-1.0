/**
 * 产品页面渲染器 - 基于数据驱动的产品展示系统
 * 使用JSON数据动态生成产品卡片，减少HTML重复代码
 */

class ProductsRenderer {
    constructor() {
        this.products = [];
        this.currentFilter = 'all';
        this.searchQuery = '';
        this.container = null;
        this.init();
    }

    async init() {
        try {
            await this.loadProducts();
            this.setupContainer();
            this.renderProducts();
            this.updateStats();
            console.log('✅ 产品渲染器初始化完成，共加载', this.products.length, '个产品');
        } catch (error) {
            console.error('❌ 产品渲染器初始化失败:', error);
            this.showError('产品数据加载失败，请刷新页面重试');
        }
    }

    /**
     * 加载产品数据
     */
    async loadProducts() {
        try {
            const response = await fetch('data/products.json');
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            this.products = await response.json();
        } catch (error) {
            console.error('产品数据加载失败:', error);
            // 如果JSON加载失败，尝试从现有HTML中提取数据（向后兼容）
            this.extractFromExistingHTML();
        }
    }

    /**
     * 向后兼容：从现有HTML提取产品数据
     */
    extractFromExistingHTML() {
        const existingCards = document.querySelectorAll('.product-card');
        this.products = Array.from(existingCards).map((card, index) => {
            const title = card.querySelector('.product-title')?.textContent || '';
            const image = card.querySelector('.product-image img')?.src || '';
            const alt = card.querySelector('.product-image img')?.alt || title;
            const category = card.getAttribute('data-category') || 'shaped';
            const href = card.getAttribute('href') || '#';

            const specs = Array.from(card.querySelectorAll('.spec-item')).map(el => el.textContent);
            const applications = Array.from(card.querySelectorAll('.app-tag')).map(el => el.textContent);
            const badges = Array.from(card.querySelectorAll('.product-badge')).map(el => el.textContent);
            const description = card.querySelector('.hover-desc')?.textContent || '';

            return {
                id: index + 1,
                title,
                description,
                category,
                image,
                alt,
                href,
                specs,
                applications,
                badges
            };
        });

        console.log('从现有HTML提取了', this.products.length, '个产品');
    }

    /**
     * 设置渲染容器
     */
    setupContainer() {
        this.container = document.getElementById('productsGrid');
        if (!this.container) {
            this.container = document.querySelector('.products-grid');
        }

        if (!this.container) {
            throw new Error('未找到产品容器元素');
        }
    }

    /**
     * 渲染所有产品
     */
    renderProducts() {
        if (!this.container) return;

        // 清空现有内容
        this.container.innerHTML = '';

        // 过滤产品
        const filteredProducts = this.getFilteredProducts();

        // 渲染产品卡片
        const fragment = document.createDocumentFragment();
        filteredProducts.forEach(product => {
            const cardElement = this.createProductCard(product);
            fragment.appendChild(cardElement);
        });

        this.container.appendChild(fragment);

        // 更新显示统计
        this.updateDisplayStats(filteredProducts.length);
    }

    /**
     * 创建产品卡片元素
     */
    createProductCard(product) {
        const card = document.createElement('a');
        card.href = product.href;
        card.className = 'product-card';
        card.setAttribute('data-category', product.category);
        card.setAttribute('data-id', product.id);

        // 生成徽章HTML
        const badgesHTML = product.badges.map(badge =>
            `<span class="product-badge ${this.getBadgeClass(badge)}">${badge}</span>`
        ).join('');

        // 生成规格HTML
        const specsHTML = product.specs.map(spec =>
            `<span class="spec-item">${spec}</span>`
        ).join('');

        // 生成应用标签HTML
        const appsHTML = product.applications.map(app =>
            `<span class="app-tag">${app}</span>`
        ).join('');

        card.innerHTML = `
            <div class="product-badges">
                ${badgesHTML}
            </div>
            <div class="product-image">
                <img src="${product.image}"
                     alt="${product.alt}"
                     loading="lazy"
                     width="280"
                     height="200"
                     onerror="this.onerror=null; this.src='images/placeholder-product.jpg';">
            </div>
            <div class="product-content">
                <h3 class="product-title">${product.title}</h3>
                <div class="product-specs">
                    ${specsHTML}
                    <div class="product-applications">
                        ${appsHTML}
                    </div>
                </div>
            </div>
            <div class="product-hover-overlay">
                <div class="hover-content">
                    <h4 class="hover-title">${product.title}</h4>
                    <p class="hover-desc">${product.description}</p>
                    <div class="action-buttons">
                        <span class="btn-inquiry">
                            <i class="fas fa-comments"></i>立即询价
                        </span>
                        <span class="btn-details">了解详情</span>
                    </div>
                </div>
            </div>
        `;

        return card;
    }

    /**
     * 根据徽章文本获取CSS类名
     */
    getBadgeClass(badgeText) {
        const badgeMap = {
            '热门产品': 'badge-hot',
            '新品上市': 'badge-new',
            '高端选择': 'badge-premium',
            '经典产品': 'badge-classic',
            '久经考验': 'badge-reliable',
            '绿色材料': 'badge-eco',
            '品质保证': 'badge-premium',
            '环保首选': 'badge-eco',
            '工业标准': 'badge-industrial',
            '节能首选': 'badge-energy'
        };

        return badgeMap[badgeText] || 'badge-default';
    }

    /**
     * 获取过滤后的产品列表
     */
    getFilteredProducts() {
        let filtered = [...this.products];

        // 分类过滤
        if (this.currentFilter !== 'all') {
            filtered = filtered.filter(product => product.category === this.currentFilter);
        }

        // 搜索过滤
        if (this.searchQuery) {
            const query = this.searchQuery.toLowerCase();
            filtered = filtered.filter(product => {
                return product.title.toLowerCase().includes(query) ||
                       product.description.toLowerCase().includes(query) ||
                       product.specs.some(spec => spec.toLowerCase().includes(query)) ||
                       product.applications.some(app => app.toLowerCase().includes(query));
            });
        }

        return filtered;
    }

    /**
     * 设置分类过滤
     */
    setFilter(category) {
        this.currentFilter = category;
        this.renderProducts();
    }

    /**
     * 设置搜索查询
     */
    setSearch(query) {
        this.searchQuery = query;
        this.renderProducts();
    }

    /**
     * 更新统计信息
     */
    updateStats() {
        const stats = this.getProductStats();

        // 更新页面统计显示
        const totalElement = document.querySelector('[data-stat="total"]');
        if (totalElement) {
            totalElement.textContent = stats.total;
        }

        // 更新各分类统计
        Object.keys(stats.categories).forEach(category => {
            const element = document.querySelector(`[data-stat="${category}"]`);
            if (element) {
                element.textContent = stats.categories[category];
            }
        });
    }

    /**
     * 更新显示统计
     */
    updateDisplayStats(displayedCount) {
        const displayElement = document.querySelector('.products-count');
        if (displayElement) {
            displayElement.textContent = `显示 ${displayedCount} / ${this.products.length} 个产品`;
        }
    }

    /**
     * 获取产品统计信息
     */
    getProductStats() {
        const stats = {
            total: this.products.length,
            categories: {}
        };

        this.products.forEach(product => {
            const category = product.category;
            stats.categories[category] = (stats.categories[category] || 0) + 1;
        });

        return stats;
    }

    /**
     * 显示错误信息
     */
    showError(message) {
        if (this.container) {
            this.container.innerHTML = `
                <div class="products-error">
                    <div class="error-icon">
                        <i class="fas fa-exclamation-triangle"></i>
                    </div>
                    <h3>加载失败</h3>
                    <p>${message}</p>
                    <button onclick="location.reload()" class="btn btn-primary">重新加载</button>
                </div>
            `;
        }
    }

    /**
     * 获取产品详情（供其他组件使用）
     */
    getProduct(id) {
        return this.products.find(product => product.id === parseInt(id));
    }

    /**
     * 获取分类列表
     */
    getCategories() {
        const categories = [...new Set(this.products.map(product => product.category))];
        return categories.sort();
    }

    /**
     * 重新渲染（供外部调用）
     */
    refresh() {
        this.renderProducts();
    }
}

// 全局变量，供其他脚本使用
let productsRenderer = null;

// DOM加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    productsRenderer = new ProductsRenderer();

    // 绑定到全局对象，供其他脚本访问
    window.productsRenderer = productsRenderer;
});

// 导出供ES6模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProductsRenderer;
}