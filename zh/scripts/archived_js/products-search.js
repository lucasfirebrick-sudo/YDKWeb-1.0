/**
 * 产品搜索和筛选功能
 * Products Search and Filter Functionality
 */

class ProductsFilter {
    constructor() {
        this.searchInput = document.getElementById('productSearch');
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.productCards = document.querySelectorAll('.product-card');
        this.resultCount = document.getElementById('resultCount');
        this.noResults = document.getElementById('noResults');

        // 升级搜索框新元素
        this.advancedToggle = document.getElementById('advancedToggle');
        this.advancedFilters = document.getElementById('advancedFilters');
        this.refractorinessFilter = document.getElementById('refractoriness');
        this.aluminaContentFilter = document.getElementById('aluminaContent');
        this.industryFilter = document.getElementById('industry');
        this.densityFilter = document.getElementById('density');
        this.resetButton = document.getElementById('resetFilters');
        this.applyButton = document.getElementById('applyFilters');

        this.currentCategory = 'all';
        this.currentSearchTerm = '';
        this.currentAdvancedFilters = {
            refractoriness: '',
            aluminaContent: '',
            industry: '',
            density: ''
        };
        this.advancedFiltersVisible = false;

        this.init();
    }

    init() {
        // 绑定搜索输入事件
        if (this.searchInput) {
            this.searchInput.addEventListener('input', this.handleSearch.bind(this));
        }

        // 绑定分类筛选按钮事件
        this.filterButtons.forEach(button => {
            button.addEventListener('click', this.handleCategoryFilter.bind(this));
        });

        // 绑定高级筛选事件
        if (this.advancedToggle) {
            this.advancedToggle.addEventListener('click', this.toggleAdvancedFilters.bind(this));
        }

        if (this.resetButton) {
            this.resetButton.addEventListener('click', this.resetAdvancedFilters.bind(this));
        }

        if (this.applyButton) {
            this.applyButton.addEventListener('click', this.applyAdvancedFilters.bind(this));
        }

        // 绑定高级筛选下拉框事件
        [this.refractorinessFilter, this.aluminaContentFilter, this.industryFilter, this.densityFilter].forEach(filter => {
            if (filter) {
                filter.addEventListener('change', this.handleAdvancedFilterChange.bind(this));
            }
        });

        // 初始化显示所有产品
        this.updateDisplay();
    }

    /**
     * 处理搜索输入
     */
    handleSearch(event) {
        this.currentSearchTerm = event.target.value.toLowerCase().trim();
        this.updateDisplay();
    }

    /**
     * 处理分类筛选
     */
    handleCategoryFilter(event) {
        // 移除所有active类
        this.filterButtons.forEach(btn => btn.classList.remove('active'));

        // 给当前按钮添加active类
        event.target.classList.add('active');

        // 更新当前分类
        this.currentCategory = event.target.dataset.category;

        // 更新显示
        this.updateDisplay();
    }

    /**
     * 更新产品显示
     */
    updateDisplay() {
        let visibleCount = 0;

        this.productCards.forEach(card => {
            const shouldShow = this.shouldShowProduct(card);

            if (shouldShow) {
                this.showProduct(card);
                visibleCount++;
            } else {
                this.hideProduct(card);
            }
        });

        // 更新结果计数
        this.updateResultCount(visibleCount);
    }

    /**
     * 切换高级筛选面板
     */
    toggleAdvancedFilters() {
        this.advancedFiltersVisible = !this.advancedFiltersVisible;

        if (this.advancedFiltersVisible) {
            this.advancedFilters.style.display = 'block';
            this.advancedToggle.innerHTML = '<i class="fas fa-times"></i> 关闭筛选';
        } else {
            this.advancedFilters.style.display = 'none';
            this.advancedToggle.innerHTML = '<i class="fas fa-sliders-h"></i> 高级筛选';
        }
    }

    /**
     * 处理高级筛选变化
     */
    handleAdvancedFilterChange() {
        // 实时更新筛选条件（可选）
        // 或者等待用户点击"应用筛选"按钮
    }

    /**
     * 应用高级筛选
     */
    applyAdvancedFilters() {
        this.currentAdvancedFilters = {
            refractoriness: this.refractorinessFilter?.value || '',
            aluminaContent: this.aluminaContentFilter?.value || '',
            industry: this.industryFilter?.value || '',
            density: this.densityFilter?.value || ''
        };

        this.updateDisplay();
        this.addSearchHighlight();
    }

    /**
     * 重置高级筛选
     */
    resetAdvancedFilters() {
        [this.refractorinessFilter, this.aluminaContentFilter, this.industryFilter, this.densityFilter].forEach(filter => {
            if (filter) {
                filter.value = '';
            }
        });

        this.currentAdvancedFilters = {
            refractoriness: '',
            aluminaContent: '',
            industry: '',
            density: ''
        };

        this.updateDisplay();
        this.removeSearchHighlight();
    }

    /**
     * 添加搜索结果高亮
     */
    addSearchHighlight() {
        if (!this.currentSearchTerm) return;

        this.productCards.forEach(card => {
            if (!card.classList.contains('hidden')) {
                const title = card.querySelector('h3');
                const description = card.querySelector('.product-description');

                [title, description].forEach(element => {
                    if (element) {
                        this.highlightText(element, this.currentSearchTerm);
                    }
                });
            }
        });
    }

    /**
     * 移除搜索结果高亮
     */
    removeSearchHighlight() {
        this.productCards.forEach(card => {
            const highlighted = card.querySelectorAll('.highlight');
            highlighted.forEach(element => {
                element.outerHTML = element.innerHTML;
            });
        });
    }

    /**
     * 高亮文本
     */
    highlightText(element, searchTerm) {
        const originalText = element.textContent;
        const regex = new RegExp(`(${searchTerm})`, 'gi');
        element.innerHTML = originalText.replace(regex, '<span class="highlight">$1</span>');
    }

    /**
     * 判断产品是否应该显示
     */
    shouldShowProduct(card) {
        // 检查分类筛选
        const categoryMatch = this.currentCategory === 'all' ||
                             card.dataset.category === this.currentCategory;

        // 检查搜索匹配
        let searchMatch = true;
        if (this.currentSearchTerm) {
            const keywords = card.dataset.keywords?.toLowerCase() || '';
            const title = card.querySelector('h3')?.textContent?.toLowerCase() || '';
            const description = card.querySelector('.product-description')?.textContent?.toLowerCase() || '';

            const searchableText = `${keywords} ${title} ${description}`;
            searchMatch = searchableText.includes(this.currentSearchTerm);
        }

        // 检查高级筛选匹配
        let advancedMatch = true;

        // 耐火度筛选
        if (this.currentAdvancedFilters.refractoriness) {
            const refractoriness = card.dataset.refractoriness || '';
            advancedMatch = advancedMatch && this.matchesRange(refractoriness, this.currentAdvancedFilters.refractoriness);
        }

        // Al₂O₃含量筛选
        if (this.currentAdvancedFilters.aluminaContent) {
            const aluminaContent = card.dataset.aluminaContent || '';
            advancedMatch = advancedMatch && this.matchesRange(aluminaContent, this.currentAdvancedFilters.aluminaContent);
        }

        // 适用行业筛选
        if (this.currentAdvancedFilters.industry) {
            const industries = card.dataset.industries?.split(',') || [];
            advancedMatch = advancedMatch && industries.includes(this.currentAdvancedFilters.industry);
        }

        // 体积密度筛选
        if (this.currentAdvancedFilters.density) {
            const density = card.dataset.density || '';
            advancedMatch = advancedMatch && this.matchesRange(density, this.currentAdvancedFilters.density);
        }

        return categoryMatch && searchMatch && advancedMatch;
    }

    /**
     * 检查数值是否在指定范围内
     */
    matchesRange(value, range) {
        if (!value || !range) return true;

        // 解析范围和数值
        const numValue = parseFloat(value);
        if (isNaN(numValue)) return false;

        if (range.includes('-')) {
            const [min, max] = range.split('-').map(v => parseFloat(v.replace('+', '')));
            return numValue >= min && (max ? numValue <= max : true);
        } else if (range.includes('+')) {
            const min = parseFloat(range.replace('+', ''));
            return numValue >= min;
        } else {
            // 完全匹配
            return value === range;
        }
    }

    /**
     * 显示产品卡片
     */
    showProduct(card) {
        card.classList.remove('hidden', 'fade-out');
        card.classList.add('fade-in');
        card.style.display = 'block';
    }

    /**
     * 隐藏产品卡片
     */
    hideProduct(card) {
        card.classList.remove('fade-in');
        card.classList.add('fade-out');

        // 延迟隐藏以显示动画效果
        setTimeout(() => {
            if (card.classList.contains('fade-out')) {
                card.style.display = 'none';
                card.classList.add('hidden');
            }
        }, 300);
    }

    /**
     * 更新结果计数显示
     */
    updateResultCount(count) {
        if (count === 0) {
            // 没有结果
            this.resultCount.style.display = 'none';
            this.noResults.style.display = 'inline';
        } else {
            // 有结果
            this.resultCount.style.display = 'inline';
            this.noResults.style.display = 'none';

            // 更新计数文本
            if (this.currentSearchTerm || this.currentCategory !== 'all') {
                this.resultCount.innerHTML = `找到 <strong>${count}</strong> 个相关产品`;
            } else {
                this.resultCount.innerHTML = `显示 <strong>${count}</strong> 个产品`;
            }
        }
    }

    /**
     * 重置所有筛选
     */
    reset() {
        // 重置搜索框
        if (this.searchInput) {
            this.searchInput.value = '';
        }

        // 重置分类筛选
        this.filterButtons.forEach(btn => btn.classList.remove('active'));
        this.filterButtons[0]?.classList.add('active'); // 激活"全部产品"

        // 重置高级筛选
        this.resetAdvancedFilters();

        // 关闭高级筛选面板
        if (this.advancedFiltersVisible) {
            this.toggleAdvancedFilters();
        }

        // 重置状态
        this.currentCategory = 'all';
        this.currentSearchTerm = '';

        // 更新显示
        this.updateDisplay();
        this.removeSearchHighlight();
    }

    /**
     * 获取当前筛选状态
     */
    getFilterState() {
        return {
            category: this.currentCategory,
            searchTerm: this.currentSearchTerm,
            visibleCount: document.querySelectorAll('.product-card:not(.hidden)').length
        };
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 只在产品页面初始化
    if (document.querySelector('.products-filter')) {
        window.productsFilter = new ProductsFilter();

        // 添加一些键盘快捷键
        document.addEventListener('keydown', function(event) {
            // Ctrl/Cmd + K 聚焦搜索框
            if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
                event.preventDefault();
                const searchInput = document.getElementById('productSearch');
                if (searchInput) {
                    searchInput.focus();
                    searchInput.select();
                }
            }

            // Escape 清空搜索
            if (event.key === 'Escape') {
                const searchInput = document.getElementById('productSearch');
                if (searchInput && document.activeElement === searchInput) {
                    searchInput.value = '';
                    window.productsFilter.handleSearch({ target: searchInput });
                    searchInput.blur();
                }
            }
        });

        // 添加搜索框占位符动画（可选）
        const searchInput = document.getElementById('productSearch');
        if (searchInput) {
            const placeholders = [
                '搜索产品名称或描述...',
                '试试"高铝砖"...',
                '试试"浇注料"...',
                '试试"保温"...',
                '试试"耐火"...'
            ];

            let currentIndex = 0;
            setInterval(() => {
                if (!searchInput.value && document.activeElement !== searchInput) {
                    currentIndex = (currentIndex + 1) % placeholders.length;
                    searchInput.placeholder = placeholders[currentIndex];
                }
            }, 3000);
        }
    }
});

// 暴露一些有用的方法到全局
window.ProductsFilterUtils = {
    // 快速筛选到指定分类
    filterByCategory: function(category) {
        if (window.productsFilter) {
            const button = document.querySelector(`[data-category="${category}"]`);
            if (button) {
                button.click();
            }
        }
    },

    // 快速搜索
    search: function(term) {
        if (window.productsFilter) {
            const searchInput = document.getElementById('productSearch');
            if (searchInput) {
                searchInput.value = term;
                window.productsFilter.handleSearch({ target: searchInput });
            }
        }
    },

    // 重置筛选
    reset: function() {
        if (window.productsFilter) {
            window.productsFilter.reset();
        }
    }
};