// 产品页面增强功能 JavaScript
// Enhanced Products Page Features

document.addEventListener('DOMContentLoaded', function() {

    // 初始化所有增强功能
    initSmartSearch();
    initAdvancedFilters();
    initProductGrid();
    initViewControls();
    initProductComparison();
    initQuickView();
    initFavorites();
    initProductStats();
    initVoiceSearch();

    // 智能搜索功能
    function initSmartSearch() {
        const searchInput = document.getElementById('smartSearch');
        const searchSuggestions = document.getElementById('searchSuggestions');
        let searchTimeout;

        if (!searchInput) return;

        // 预定义的搜索建议
        const suggestions = [
            '高铝砖', '轻质硅砖', '保温砖', '莫来石砖', '粘土砖', '刚玉砖',
            '钢铁行业', '水泥行业', '玻璃行业', '石化行业',
            '耐火度1800°C', '高强度', '抗热震', '耐腐蚀', '保温性能',
            'Al₂O₃含量75%', '导热系数低', '体密轻', '化学稳定性'
        ];

        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            const query = this.value.toLowerCase().trim();

            if (query.length < 2) {
                searchSuggestions.style.display = 'none';
                return;
            }

            searchTimeout = setTimeout(() => {
                const filteredSuggestions = suggestions.filter(suggestion =>
                    suggestion.toLowerCase().includes(query)
                );

                if (filteredSuggestions.length > 0) {
                    showSearchSuggestions(filteredSuggestions, query);
                } else {
                    searchSuggestions.style.display = 'none';
                }
            }, 300);
        });

        searchInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                performSearch(this.value);
                searchSuggestions.style.display = 'none';
            }
        });

        // 点击外部关闭建议
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.smart-search-bar')) {
                searchSuggestions.style.display = 'none';
            }
        });
    }

    function showSearchSuggestions(suggestions, query) {
        const searchSuggestions = document.getElementById('searchSuggestions');
        const html = suggestions.slice(0, 6).map(suggestion => {
            const highlighted = suggestion.replace(
                new RegExp(query, 'gi'),
                match => `<mark>${match}</mark>`
            );
            return `
                <div class="suggestion-item" onclick="selectSuggestion('${suggestion}')">
                    <i class="fas fa-search"></i>
                    <span>${highlighted}</span>
                </div>
            `;
        }).join('');

        searchSuggestions.innerHTML = html;
        searchSuggestions.style.display = 'block';
    }

    // 全局函数：选择搜索建议
    window.selectSuggestion = function(suggestion) {
        const searchInput = document.getElementById('smartSearch');
        const searchSuggestions = document.getElementById('searchSuggestions');

        searchInput.value = suggestion;
        searchSuggestions.style.display = 'none';
        performSearch(suggestion);
    };

    // 执行搜索
    function performSearch(query) {
        const productCards = document.querySelectorAll('.product-card');
        const productCount = document.getElementById('productCount');
        const filterStatus = document.getElementById('filterStatus');
        let visibleCount = 0;

        productCards.forEach(card => {
            const productName = card.querySelector('h3').textContent.toLowerCase();
            const productDesc = card.querySelector('.product-description').textContent.toLowerCase();
            const productTags = Array.from(card.querySelectorAll('.tag')).map(tag => tag.textContent.toLowerCase());
            const searchText = query.toLowerCase();

            const isMatch = productName.includes(searchText) ||
                          productDesc.includes(searchText) ||
                          productTags.some(tag => tag.includes(searchText));

            if (isMatch) {
                card.style.display = 'block';
                card.style.animation = 'fadeInUp 0.5s ease';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        // 更新结果统计
        productCount.textContent = visibleCount;
        filterStatus.textContent = query ? `搜索"${query}"的结果` : '显示全部产品';

        // 如果没有结果，显示提示
        if (visibleCount === 0) {
            showNoResultsMessage(query);
        } else {
            hideNoResultsMessage();
        }
    }

    // 高级筛选功能
    function initAdvancedFilters() {
        const filterToggle = document.getElementById('advancedFilterToggle');
        const filterPanel = document.getElementById('advancedFilterPanel');
        const applyFilters = document.getElementById('applyFilters');
        const resetFilters = document.getElementById('resetFilters');

        if (!filterToggle) return;

        // 切换高级筛选面板
        filterToggle.addEventListener('click', function() {
            const isVisible = filterPanel.style.display === 'block';
            filterPanel.style.display = isVisible ? 'none' : 'block';

            this.classList.toggle('active');

            if (!isVisible) {
                filterPanel.style.animation = 'slideDown 0.3s ease';
            }
        });

        // 快速筛选标签
        const filterTags = document.querySelectorAll('.filter-tag');
        filterTags.forEach(tag => {
            tag.addEventListener('click', function() {
                filterTags.forEach(t => t.classList.remove('active'));
                this.classList.add('active');

                const category = this.dataset.category;
                filterProductsByCategory(category);
            });
        });

        // 性能标签筛选
        const performanceTags = document.querySelectorAll('.performance-tag');
        performanceTags.forEach(tag => {
            tag.addEventListener('click', function() {
                this.classList.toggle('active');
            });
        });

        // 应用筛选
        if (applyFilters) {
            applyFilters.addEventListener('click', applyAdvancedFilters);
        }

        // 重置筛选
        if (resetFilters) {
            resetFilters.addEventListener('click', function() {
                resetAllFilters();
                const allProducts = document.querySelectorAll('.product-card');
                allProducts.forEach(card => {
                    card.style.display = 'block';
                });
                updateProductCount(allProducts.length);
            });
        }
    }

    function filterProductsByCategory(category) {
        const productCards = document.querySelectorAll('.product-card');
        let visibleCount = 0;

        productCards.forEach(card => {
            const cardCategory = card.dataset.category;

            if (category === 'all' || cardCategory === category) {
                card.style.display = 'block';
                card.style.animation = 'fadeInUp 0.5s ease';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        updateProductCount(visibleCount);

        const filterStatus = document.getElementById('filterStatus');
        const categoryNames = {
            'all': '全部产品',
            'refractory-bricks': '耐火砖',
            'insulation': '保温材料',
            'castables': '浇注料',
            'special': '特种砖',
            'shaped': '异型砖'
        };
        filterStatus.textContent = `显示${categoryNames[category] || category}`;
    }

    function applyAdvancedFilters() {
        const productCards = document.querySelectorAll('.product-card');
        let visibleCount = 0;

        // 获取筛选条件
        const tempRange = document.getElementById('tempRange');
        const aluminaChecks = document.querySelectorAll('.checkbox-group input:checked');
        const industrySelect = document.querySelector('.industry-select');
        const activePerformanceTags = document.querySelectorAll('.performance-tag.active');

        productCards.forEach(card => {
            let matches = true;

            // 温度范围筛选
            if (tempRange) {
                const cardTemp = parseInt(card.dataset.temperature);
                const minTemp = parseInt(tempRange.min);
                const maxTemp = parseInt(tempRange.max);

                if (cardTemp < minTemp || cardTemp > maxTemp) {
                    matches = false;
                }
            }

            // Al₂O₃含量筛选
            if (aluminaChecks.length > 0) {
                const cardAlumina = parseInt(card.dataset.alumina);
                let aluminaMatch = false;

                aluminaChecks.forEach(check => {
                    const range = check.value;
                    if ((range === 'low' && cardAlumina >= 30 && cardAlumina < 50) ||
                        (range === 'medium' && cardAlumina >= 50 && cardAlumina < 75) ||
                        (range === 'high' && cardAlumina >= 75)) {
                        aluminaMatch = true;
                    }
                });

                if (!aluminaMatch) matches = false;
            }

            // 行业筛选
            if (industrySelect && industrySelect.value !== 'all') {
                const cardIndustries = card.dataset.industry ? card.dataset.industry.split(',') : [];
                if (!cardIndustries.includes(industrySelect.value)) {
                    matches = false;
                }
            }

            // 显示/隐藏产品卡片
            if (matches) {
                card.style.display = 'block';
                card.style.animation = 'fadeInUp 0.5s ease';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        updateProductCount(visibleCount);

        // 关闭筛选面板
        const filterPanel = document.getElementById('advancedFilterPanel');
        filterPanel.style.display = 'none';
        document.getElementById('advancedFilterToggle').classList.remove('active');
    }

    function resetAllFilters() {
        // 重置所有筛选控件
        const tempRange = document.getElementById('tempRange');
        const aluminaChecks = document.querySelectorAll('.checkbox-group input');
        const industrySelect = document.querySelector('.industry-select');
        const performanceTags = document.querySelectorAll('.performance-tag');
        const filterTags = document.querySelectorAll('.filter-tag');

        if (tempRange) {
            tempRange.value = `${tempRange.min},${tempRange.max}`;
        }

        aluminaChecks.forEach(check => check.checked = false);

        if (industrySelect) {
            industrySelect.value = 'all';
        }

        performanceTags.forEach(tag => tag.classList.remove('active'));

        filterTags.forEach(tag => tag.classList.remove('active'));
        filterTags[0]?.classList.add('active'); // 激活"全部产品"
    }

    // 产品网格功能
    function initProductGrid() {
        const sortSelect = document.getElementById('sortSelect');

        if (sortSelect) {
            sortSelect.addEventListener('change', function() {
                sortProducts(this.value);
            });
        }

        // 加载更多功能
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        const loadingSpinner = document.getElementById('loadingSpinner');

        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', function() {
                this.style.display = 'none';
                loadingSpinner.style.display = 'flex';

                // 模拟加载延迟
                setTimeout(() => {
                    loadMoreProducts();
                    this.style.display = 'inline-flex';
                    loadingSpinner.style.display = 'none';
                }, 1500);
            });
        }
    }

    function sortProducts(sortBy) {
        const productGrid = document.getElementById('productGrid');
        const productCards = Array.from(productGrid.querySelectorAll('.product-card'));

        productCards.sort((a, b) => {
            switch (sortBy) {
                case 'name':
                    return a.querySelector('h3').textContent.localeCompare(b.querySelector('h3').textContent);
                case 'temperature':
                    return parseInt(b.dataset.temperature) - parseInt(a.dataset.temperature);
                case 'alumina':
                    return parseInt(b.dataset.alumina) - parseInt(a.dataset.alumina);
                case 'popularity':
                    return (b.querySelector('.product-badge') ? 1 : 0) - (a.querySelector('.product-badge') ? 1 : 0);
                default:
                    return 0;
            }
        });

        // 重新排列DOM元素
        productCards.forEach((card, index) => {
            card.style.order = index;
            card.style.animation = `fadeInUp 0.3s ease ${index * 0.1}s`;
        });
    }

    function loadMoreProducts() {
        // 模拟加载更多产品数据
        const additionalProducts = [
            {
                name: '高铝锚固砖',
                category: 'shaped',
                temperature: '1800',
                alumina: '75',
                industry: 'steel',
                image: 'high-alumina-anchor-brick.jpg',
                description: '专用于高温窑炉的锚固结构',
                specs: [
                    { label: 'Al₂O₃', value: '≥75%' },
                    { label: '耐火度', value: '≥1800°C' },
                    { label: '体密', value: '2.4-2.7g/cm³' }
                ],
                tags: ['shaped', 'high-strength']
            }
            // 可以添加更多产品...
        ];

        const productGrid = document.getElementById('productGrid');

        additionalProducts.forEach(product => {
            const productCard = createProductCard(product);
            productGrid.appendChild(productCard);
        });

        updateProductCount(document.querySelectorAll('.product-card').length);
    }

    function createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.dataset.category = product.category;
        card.dataset.temperature = product.temperature;
        card.dataset.alumina = product.alumina;
        card.dataset.industry = product.industry;

        card.innerHTML = `
            <div class="product-image">
                <img src="images/${product.image}" alt="${product.name}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPuS6p+WTgeWbvueJhzwvdGV4dD48L3N2Zz4='">
                <div class="product-overlay">
                    <div class="overlay-actions">
                        <button class="action-btn" data-tooltip="快速查看" onclick="quickView('${product.name}')">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="action-btn" data-tooltip="添加对比" onclick="addToComparison('${product.name}')">
                            <i class="fas fa-balance-scale"></i>
                        </button>
                        <button class="action-btn" data-tooltip="收藏产品" onclick="toggleFavorite('${product.name}')">
                            <i class="far fa-heart"></i>
                        </button>
                    </div>
                </div>
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-specs">
                    ${product.specs.map(spec => `
                        <div class="spec-item">
                            <span class="spec-label">${spec.label}:</span>
                            <span class="spec-value">${spec.value}</span>
                        </div>
                    `).join('')}
                </div>
                <div class="product-tags">
                    ${product.tags.map(tag => `<span class="tag ${tag}">${getTagLabel(tag)}</span>`).join('')}
                </div>
                <div class="product-actions">
                    <a href="products/${product.name.toLowerCase().replace(/\s+/g, '-')}.html" class="btn btn-primary">查看详情</a>
                    <button class="btn btn-secondary" onclick="document.getElementById('inquiryBtn').click()">询价</button>
                </div>
            </div>
        `;

        return card;
    }

    function getTagLabel(tag) {
        const tagLabels = {
            'shaped': '异型',
            'high-strength': '高强度',
            'insulation': '保温',
            'thermal-shock': '抗热震',
            'corrosion-resistant': '耐腐蚀',
            'wear-resistant': '耐磨',
            'economical': '经济实用',
            'versatile': '应用广泛',
            'high-purity': '高纯度',
            'stable': '化学稳定',
            'eco': '节能环保'
        };
        return tagLabels[tag] || tag;
    }

    // 视图控制功能
    function initViewControls() {
        const viewBtns = document.querySelectorAll('.view-btn');
        const productGrid = document.getElementById('productGrid');

        viewBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const view = this.dataset.view;

                viewBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');

                switchView(view, productGrid);
            });
        });
    }

    function switchView(view, productGrid) {
        productGrid.className = `smart-product-grid view-${view}`;

        // 根据视图类型调整布局
        switch (view) {
            case 'list':
                productGrid.style.gridTemplateColumns = '1fr';
                break;
            case 'comparison':
                productGrid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(350px, 1fr))';
                break;
            default:
                productGrid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(280px, 1fr))';
        }
    }

    // 产品对比功能
    function initProductComparison() {
        window.comparisonList = [];

        // 创建对比浮动面板
        createComparisonPanel();
    }

    function createComparisonPanel() {
        const panel = document.createElement('div');
        panel.id = 'comparisonPanel';
        panel.className = 'comparison-panel';
        panel.innerHTML = `
            <div class="comparison-header">
                <h4><i class="fas fa-balance-scale"></i> 产品对比 (<span id="comparisonCount">0</span>/3)</h4>
                <button class="close-comparison" onclick="clearComparison()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="comparison-items" id="comparisonItems"></div>
            <div class="comparison-actions">
                <button class="btn btn-primary" onclick="showComparison()" disabled id="compareBtn">
                    <i class="fas fa-columns"></i> 开始对比
                </button>
                <button class="btn btn-secondary" onclick="clearComparison()">
                    <i class="fas fa-trash"></i> 清空
                </button>
            </div>
        `;

        document.body.appendChild(panel);
    }

    // 全局函数：添加到对比
    window.addToComparison = function(productId) {
        if (window.comparisonList.length >= 3) {
            showNotification('最多只能对比3个产品', 'warning');
            return;
        }

        if (window.comparisonList.includes(productId)) {
            showNotification('该产品已在对比列表中', 'info');
            return;
        }

        window.comparisonList.push(productId);
        updateComparisonPanel();
        showNotification('产品已添加到对比列表', 'success');
    };

    // 全局函数：显示对比
    window.showComparison = function() {
        if (window.comparisonList.length < 2) {
            showNotification('至少需要2个产品才能对比', 'warning');
            return;
        }

        // 创建对比模态框
        createComparisonModal();
    };

    // 全局函数：清空对比
    window.clearComparison = function() {
        window.comparisonList = [];
        updateComparisonPanel();

        // 更新所有对比按钮状态
        const comparisonBtns = document.querySelectorAll('.action-btn[onclick*="addToComparison"]');
        comparisonBtns.forEach(btn => {
            btn.classList.remove('active');
        });
    };

    function updateComparisonPanel() {
        const panel = document.getElementById('comparisonPanel');
        const count = document.getElementById('comparisonCount');
        const items = document.getElementById('comparisonItems');
        const compareBtn = document.getElementById('compareBtn');

        count.textContent = window.comparisonList.length;
        compareBtn.disabled = window.comparisonList.length < 2;

        if (window.comparisonList.length > 0) {
            panel.classList.add('active');

            items.innerHTML = window.comparisonList.map(productId => `
                <div class="comparison-item">
                    <span>${productId}</span>
                    <button onclick="removeFromComparison('${productId}')" class="remove-item">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `).join('');
        } else {
            panel.classList.remove('active');
        }
    }

    // 全局函数：从对比中移除
    window.removeFromComparison = function(productId) {
        const index = window.comparisonList.indexOf(productId);
        if (index > -1) {
            window.comparisonList.splice(index, 1);
            updateComparisonPanel();
        }
    };

    // 快速查看功能
    function initQuickView() {
        // 快速查看功能已在HTML中通过onclick实现
    }

    // 全局函数：快速查看
    window.quickView = function(productId) {
        // 创建快速查看模态框
        const modal = document.createElement('div');
        modal.className = 'quick-view-modal';
        modal.innerHTML = `
            <div class="modal-backdrop" onclick="closeQuickView()"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${productId} - 快速查看</h3>
                    <button class="modal-close" onclick="closeQuickView()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="quick-view-content">
                        <div class="product-image-large">
                            <img src="images/${productId.toLowerCase().replace(/\s+/g, '-')}.jpg" alt="${productId}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPuS6p+WTgeWbvueJhzwvdGV4dD48L3N2Zz4='">
                        </div>
                        <div class="product-details">
                            <h4>${productId}</h4>
                            <p>高质量耐火材料，适用于各种高温工业应用场景。</p>
                            <div class="detail-specs">
                                <div class="spec-row">
                                    <span>耐火度:</span>
                                    <span>≥1750°C</span>
                                </div>
                                <div class="spec-row">
                                    <span>体密:</span>
                                    <span>2.0-2.5g/cm³</span>
                                </div>
                                <div class="spec-row">
                                    <span>应用:</span>
                                    <span>钢铁、水泥、玻璃行业</span>
                                </div>
                            </div>
                            <div class="quick-actions">
                                <a href="products/${productId.toLowerCase().replace(/\s+/g, '-')}.html" class="btn btn-primary">查看详情</a>
                                <button class="btn btn-secondary" onclick="document.getElementById('inquiryBtn').click(); closeQuickView();">立即询价</button>
                                <button class="btn btn-outline" onclick="addToComparison('${productId}')">添加对比</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        setTimeout(() => modal.classList.add('active'), 10);
    };

    // 全局函数：关闭快速查看
    window.closeQuickView = function() {
        const modal = document.querySelector('.quick-view-modal');
        if (modal) {
            modal.classList.remove('active');
            setTimeout(() => modal.remove(), 300);
        }
    };

    // 收藏功能
    function initFavorites() {
        // 从localStorage读取收藏列表
        window.favoritesList = JSON.parse(localStorage.getItem('favoriteProducts')) || [];

        // 更新收藏按钮状态
        updateFavoriteButtons();
    }

    // 全局函数：切换收藏状态
    window.toggleFavorite = function(productId) {
        const index = window.favoritesList.indexOf(productId);

        if (index > -1) {
            window.favoritesList.splice(index, 1);
            showNotification('已从收藏中移除', 'info');
        } else {
            window.favoritesList.push(productId);
            showNotification('已添加到收藏', 'success');
        }

        // 保存到localStorage
        localStorage.setItem('favoriteProducts', JSON.stringify(window.favoritesList));

        // 更新按钮状态
        updateFavoriteButtons();
    };

    function updateFavoriteButtons() {
        const favoriteButtons = document.querySelectorAll('.action-btn[onclick*="toggleFavorite"]');

        favoriteButtons.forEach(btn => {
            const onclick = btn.getAttribute('onclick');
            const productId = onclick.match(/'([^']+)'/)[1];
            const icon = btn.querySelector('i');

            if (window.favoritesList.includes(productId)) {
                icon.className = 'fas fa-heart';
                btn.classList.add('favorited');
            } else {
                icon.className = 'far fa-heart';
                btn.classList.remove('favorited');
            }
        });
    }

    // 产品统计动画
    function initProductStats() {
        const statNumbers = document.querySelectorAll('.stat-number');

        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateStatNumber(entry.target);
                    statsObserver.unobserve(entry.target);
                }
            });
        });

        statNumbers.forEach(stat => statsObserver.observe(stat));
    }

    function animateStatNumber(element) {
        const target = parseInt(element.dataset.target);
        const increment = target / 50;
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 30);
    }

    // 语音搜索功能
    function initVoiceSearch() {
        const voiceBtn = document.getElementById('voiceSearch');

        if (!voiceBtn || !('webkitSpeechRecognition' in window)) {
            if (voiceBtn) voiceBtn.style.display = 'none';
            return;
        }

        const recognition = new webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'zh-CN';

        voiceBtn.addEventListener('click', function() {
            if (this.classList.contains('listening')) {
                recognition.stop();
                return;
            }

            this.classList.add('listening');
            this.innerHTML = '<i class="fas fa-microphone-slash"></i>';
            recognition.start();
        });

        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript;
            const searchInput = document.getElementById('smartSearch');

            searchInput.value = transcript;
            performSearch(transcript);

            voiceBtn.classList.remove('listening');
            voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
        };

        recognition.onerror = function() {
            voiceBtn.classList.remove('listening');
            voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
            showNotification('语音识别失败，请重试', 'error');
        };

        recognition.onend = function() {
            voiceBtn.classList.remove('listening');
            voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
        };
    }

    // 工具函数
    function updateProductCount(count) {
        const productCount = document.getElementById('productCount');
        if (productCount) {
            productCount.textContent = count;
        }
    }

    function showNoResultsMessage(query) {
        const productGrid = document.getElementById('productGrid');
        const existing = productGrid.querySelector('.no-results');

        if (!existing) {
            const noResults = document.createElement('div');
            noResults.className = 'no-results';
            noResults.innerHTML = `
                <div class="no-results-content">
                    <i class="fas fa-search"></i>
                    <h3>未找到相关产品</h3>
                    <p>没有找到与"${query}"相关的产品</p>
                    <button class="btn btn-primary" onclick="resetAllFilters(); performSearch('')">
                        查看全部产品
                    </button>
                </div>
            `;
            productGrid.appendChild(noResults);
        }
    }

    function hideNoResultsMessage() {
        const noResults = document.querySelector('.no-results');
        if (noResults) {
            noResults.remove();
        }
    }

    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${getNotificationIcon(type)}"></i>
                <span>${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        document.body.appendChild(notification);

        setTimeout(() => notification.classList.add('show'), 100);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    function getNotificationIcon(type) {
        const icons = {
            'success': 'check-circle',
            'error': 'exclamation-circle',
            'warning': 'exclamation-triangle',
            'info': 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

});