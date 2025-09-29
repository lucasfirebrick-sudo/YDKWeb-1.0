// Products page main JavaScript file - full functionality restored
(function() {
    'use strict';

    // Products page application object
    const ProductsPageApp = {
        initialized: false,
        searchInput: null,
        categoryFilter: null,
        industryFilter: null,
        filterTabs: null,
        productCards: null,

        // Initialize application
        init() {
            if (this.initialized) return;

            console.log('🚀 Initializing products page...');

            // Wait for DOM loading completion
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.setupComponents());
            } else {
                this.setupComponents();
            }

            this.initialized = true;
        },

        // Setup components
        setupComponents() {
            this.cacheElements();
            this.initializeSearch();
            this.initializeFilters();
            this.initializeAnimations();
            this.setupMobileMenu();
            console.log('✅ Products page initialization completed');
        },

        // Cache DOM elements
        cacheElements() {
            this.searchInput = document.getElementById('productSearch');
            this.categoryFilter = document.getElementById('categoryFilter');
            this.industryFilter = document.getElementById('industryFilter');
            this.filterTabs = document.querySelectorAll('.filter-tab');
            this.productCards = document.querySelectorAll('.product-card');
        },

        // Initialize search functionality
        initializeSearch() {
            if (!this.searchInput) return;

            this.searchInput.addEventListener('input', (e) => {
                const searchTerm = e.target.value.toLowerCase().trim();
                this.filterProducts({ search: searchTerm });
            });

            console.log('✅ Product search functionality activated');
        },

        // Initialize filters
        initializeFilters() {
            // Category filter
            if (this.categoryFilter) {
                this.categoryFilter.addEventListener('change', (e) => {
                    const category = e.target.value;
                    this.filterProducts({ category });
                    this.updateFilterTabs(category);
                });
            }

            // Industry filter
            if (this.industryFilter) {
                this.industryFilter.addEventListener('change', (e) => {
                    const industry = e.target.value;
                    this.filterProducts({ industry });
                });
            }

            console.log('✅ Dropdown filter functionality activated');
        },

        // 产品筛选逻辑
        filterProducts(filters = {}) {
            const { search = '', category = '', industry = '' } = filters;

            this.productCards.forEach(card => {
                let shouldShow = true;

                // 搜索筛选
                if (search) {
                    const title = card.querySelector('.product-title')?.textContent.toLowerCase() || '';
                    const specs = card.querySelector('.product-specs')?.textContent.toLowerCase() || '';
                    shouldShow = shouldShow && (title.includes(search) || specs.includes(search));
                }

                // 类别筛选
                if (category) {
                    const cardCategory = card.getAttribute('data-category');
                    shouldShow = shouldShow && cardCategory === category;
                }

                // 行业筛选 (根据产品应用特性)
                if (industry) {
                    const industrialApplications = this.getProductIndustryApplications(card);
                    shouldShow = shouldShow && industrialApplications.includes(industry);
                }

                // 显示/隐藏产品卡片
                this.toggleProductCard(card, shouldShow);
            });

            // 更新产品数量显示
            this.updateProductCounts();
        },

        // 获取产品的行业应用
        getProductIndustryApplications(card) {
            const category = card.getAttribute('data-category');
            const title = card.querySelector('.product-title')?.textContent || '';

            // 根据产品类型映射应用行业
            const industryMap = {
                'shaped': ['钢铁工业', '建材工业', '电力工业'],
                'unshaped': ['钢铁工业', '石化工业', '有色金属'],
                'special': ['钢铁工业', '玻璃工业', '石化工业', '有色金属'],
                'lightweight': ['建材工业', '电力工业', '玻璃工业']
            };

            return industryMap[category] || [];
        },

        // 切换产品卡片显示状态
        toggleProductCard(card, shouldShow) {
            if (shouldShow) {
                card.style.display = 'block';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    if (card.style.opacity === '0') {
                        card.style.display = 'none';
                    }
                }, 300);
            }
        },

        // 更新筛选标签状态
        updateFilterTabs(activeCategory) {
            this.filterTabs.forEach(tab => {
                const tabCategory = tab.getAttribute('data-category');
                if (activeCategory === '' || activeCategory === 'all') {
                    tab.classList.toggle('active', tabCategory === 'all');
                } else {
                    tab.classList.toggle('active', tabCategory === activeCategory);
                }
            });
        },

        // 更新产品数量显示
        updateProductCounts() {
            const visibleCards = Array.from(this.productCards).filter(card =>
                card.style.display !== 'none' && card.style.opacity !== '0'
            );

            // 更新各类别的显示数量
            this.filterTabs.forEach(tab => {
                const category = tab.getAttribute('data-category');
                const countElement = tab.querySelector('.tab-count');

                if (countElement) {
                    let count;
                    if (category === 'all') {
                        count = visibleCards.length;
                    } else {
                        count = visibleCards.filter(card =>
                            card.getAttribute('data-category') === category
                        ).length;
                    }
                    countElement.textContent = count;
                }
            });
        },

        // 初始化动画效果
        initializeAnimations() {
            // 统计数字动画
            this.animateStatNumbers();

            // 滚动动画观察器
            this.setupScrollAnimations();
        },

        // 统计数字动画
        animateStatNumbers() {
            const statNumbers = document.querySelectorAll('.stat-number');

            statNumbers.forEach(element => {
                const targetText = element.textContent;
                const targetNumber = parseInt(targetText) || 0;

                if (targetNumber > 0) {
                    this.animateNumber(element, 0, targetNumber, 2000, targetText);
                }
            });
        },

        // 数字递增动画
        animateNumber(element, start, end, duration, suffix = '') {
            const startTime = performance.now();

            const updateNumber = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);

                // 缓动函数
                const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                const currentNumber = Math.floor(start + (end - start) * easeOutQuart);

                element.textContent = currentNumber + suffix.replace(/\d+/, '');

                if (progress < 1) {
                    requestAnimationFrame(updateNumber);
                } else {
                    element.textContent = suffix; // 确保最终显示原始文本
                }
            };

            requestAnimationFrame(updateNumber);
        },

        // 设置滚动动画
        setupScrollAnimations() {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-in');

                        // 如果是统计数字，触发动画
                        if (entry.target.classList.contains('stat-number')) {
                            const targetText = entry.target.textContent;
                            const targetNumber = parseInt(targetText) || 0;
                            if (targetNumber > 0) {
                                this.animateNumber(entry.target, 0, targetNumber, 2000, targetText);
                            }
                        }
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });

            // 观察需要动画的元素
            document.querySelectorAll('.intro-stats, .stat-item, .cta-content').forEach(el => {
                observer.observe(el);
            });
        },

        // 设置移动端菜单
        setupMobileMenu() {
            const hamburger = document.querySelector('.hamburger');
            const navMenu = document.querySelector('.nav-menu');

            if (hamburger && navMenu) {
                hamburger.addEventListener('click', () => {
                    hamburger.classList.toggle('active');
                    navMenu.classList.toggle('active');
                });

                // 点击菜单项关闭移动端菜单
                const navLinks = document.querySelectorAll('.nav-link');
                navLinks.forEach(link => {
                    link.addEventListener('click', () => {
                        hamburger.classList.remove('active');
                        navMenu.classList.remove('active');
                    });
                });
            }
        }
    };

    // 初始化应用
    ProductsPageApp.init();

    // 将应用对象暴露到全局作用域，供其他脚本使用
    window.ProductsPageApp = ProductsPageApp;

})();