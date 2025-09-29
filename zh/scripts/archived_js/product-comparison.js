/**
 * 产品对比功能
 * Product Comparison Functionality
 */

class ProductComparison {
    constructor() {
        this.selectedProducts = new Set();
        this.maxCompareProducts = 3;

        this.compareBtn = document.getElementById('compareBtn');
        this.clearCompareBtn = document.getElementById('clearCompareBtn');
        this.compareCount = document.getElementById('compareCount');
        this.compareControls = document.querySelector('.compare-controls');
        this.comparisonModal = document.getElementById('comparisonModal');
        this.comparisonClose = document.getElementById('comparisonClose');
        this.comparisonBody = document.getElementById('comparisonBody');

        // 新增悬浮面板元素
        this.compareFloatPanel = document.getElementById('compareFloatPanel');
        this.floatCompareCount = document.getElementById('floatCompareCount');
        this.comparePanelToggle = document.getElementById('comparePanelToggle');
        this.comparePanelBody = document.getElementById('comparePanelBody');
        this.compareItems = document.getElementById('compareItems');
        this.compareNowBtn = document.getElementById('compareNowBtn');
        this.clearAllBtn = document.getElementById('clearAllBtn');

        this.isPanelCollapsed = false;

        this.productData = {
            'clay-brick': {
                name: '标准粘土砖',
                englishName: 'Standard Clay Brick',
                image: 'images/products/轻质黏土砖.jpg',
                al2o3: '35-45%',
                tempRange: '1200-1400℃',
                porosity: '18-24%',
                strength: '25-45 MPa',
                application: '工业窑炉一般部位',
                advantages: ['价格经济', '性能稳定', '适应性强'],
                category: '定型耐火制品'
            },
            'high-alumina': {
                name: '高铝砖',
                englishName: 'High Alumina Brick',
                image: 'images/products/高铝砖.jpg',
                al2o3: '55-80%',
                tempRange: '1450-1530℃',
                porosity: '19-24%',
                strength: '45-70 MPa',
                application: '高温工业设备',
                advantages: ['耐火度高', '抗侵蚀强', '机械强度高'],
                category: '定型耐火制品'
            },
            'lightweight': {
                name: '轻质保温砖',
                englishName: 'Lightweight Insulating Brick',
                image: 'images/products/高铝聚轻砖.jpg',
                al2o3: '45-70%',
                tempRange: '1000-1400℃',
                porosity: '60-75%',
                strength: '3-8 MPa',
                application: '保温隔热层',
                advantages: ['导热率低', '重量轻', '节能效果好'],
                category: '轻质保温制品'
            }
        };

        this.init();
    }

    init() {
        this.bindEvents();
        this.addCompareCheckboxes();
    }

    bindEvents() {
        // 对比按钮事件
        if (this.compareBtn) {
            this.compareBtn.addEventListener('click', () => {
                this.showComparison();
            });
        }

        // 清空选择按钮事件
        if (this.clearCompareBtn) {
            this.clearCompareBtn.addEventListener('click', () => {
                this.clearSelection();
            });
        }

        // 关闭对比弹窗事件
        if (this.comparisonClose) {
            this.comparisonClose.addEventListener('click', () => {
                this.hideComparison();
            });
        }

        // 点击弹窗背景关闭
        if (this.comparisonModal) {
            this.comparisonModal.addEventListener('click', (e) => {
                if (e.target === this.comparisonModal) {
                    this.hideComparison();
                }
            });
        }

        // ESC键关闭弹窗
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.comparisonModal.classList.contains('active')) {
                this.hideComparison();
            }
        });

        // 悬浮面板事件绑定
        if (this.comparePanelToggle) {
            this.comparePanelToggle.addEventListener('click', () => {
                this.toggleFloatPanel();
            });
        }

        if (this.compareNowBtn) {
            this.compareNowBtn.addEventListener('click', () => {
                this.showComparison();
            });
        }

        if (this.clearAllBtn) {
            this.clearAllBtn.addEventListener('click', () => {
                this.clearSelection();
            });
        }
    }

    addCompareCheckboxes() {
        const productCards = document.querySelectorAll('.product-card');

        productCards.forEach((card, index) => {
            // 跳过已经有对比复选框的卡片
            if (card.querySelector('.compare-checkbox')) {
                return;
            }

            const productId = this.generateProductId(card, index);
            const productName = this.extractProductName(card);

            // 创建对比复选框
            const compareCheckbox = document.createElement('div');
            compareCheckbox.className = 'compare-checkbox';
            compareCheckbox.innerHTML = `
                <input type="checkbox" class="compare-select" id="compare-${productId}" data-product="${productId}">
                <label for="compare-${productId}" class="compare-label">
                    <i class="fas fa-balance-scale"></i>
                </label>
            `;

            // 添加到产品卡片
            card.appendChild(compareCheckbox);

            // 绑定复选框事件
            const checkbox = compareCheckbox.querySelector('.compare-select');
            checkbox.addEventListener('change', (e) => {
                this.handleProductSelection(e, productId, productName, card);
            });
        });
    }

    generateProductId(card, index) {
        // 尝试从data属性获取ID
        let productId = card.dataset.productId;

        if (!productId) {
            // 从产品名称生成ID
            const title = card.querySelector('h3');
            if (title) {
                productId = title.textContent.trim()
                    .replace(/\s+/g, '-')
                    .replace(/[^\w\-]/g, '')
                    .toLowerCase();
            } else {
                productId = `product-${index}`;
            }
        }

        return productId;
    }

    extractProductName(card) {
        const title = card.querySelector('h3');
        return title ? title.textContent.trim() : '未知产品';
    }

    handleProductSelection(event, productId, productName, card) {
        if (event.target.checked) {
            if (this.selectedProducts.size >= this.maxCompareProducts) {
                event.target.checked = false;
                this.showMaxProductsAlert();
                return;
            }

            this.selectedProducts.add({
                id: productId,
                name: productName,
                element: card
            });
            card.classList.add('selected-for-compare');
        } else {
            // 移除产品
            for (let product of this.selectedProducts) {
                if (product.id === productId) {
                    this.selectedProducts.delete(product);
                    break;
                }
            }
            card.classList.remove('selected-for-compare');
        }

        this.updateCompareControls();
    }

    updateCompareControls() {
        const count = this.selectedProducts.size;

        // 更新计数器
        this.compareCount.textContent = `已选择 ${count} 个产品对比`;

        // 更新按钮状态
        if (count >= 2) {
            this.compareBtn.disabled = false;
            this.compareBtn.classList.remove('disabled');
            this.compareControls.classList.add('active');
            this.compareCount.classList.add('active');
        } else {
            this.compareBtn.disabled = true;
            this.compareBtn.classList.add('disabled');
            this.compareControls.classList.remove('active');
            this.compareCount.classList.remove('active');
        }

        // 显示/隐藏清空按钮
        if (count > 0) {
            this.clearCompareBtn.style.display = 'flex';
        } else {
            this.clearCompareBtn.style.display = 'none';
        }

        // 更新悬浮面板
        this.updateFloatPanel();
    }

    /**
     * 更新悬浮对比面板
     */
    updateFloatPanel() {
        const count = this.selectedProducts.size;

        // 更新计数
        if (this.floatCompareCount) {
            this.floatCompareCount.textContent = `已选对比 (${count})`;
        }

        // 显示/隐藏面板
        if (count > 0) {
            this.showFloatPanel();
        } else {
            this.hideFloatPanel();
        }

        // 更新面板内容
        this.updateFloatPanelContent();

        // 更新按钮状态
        if (this.compareNowBtn) {
            this.compareNowBtn.disabled = count < 2;
        }
    }

    /**
     * 显示悬浮面板
     */
    showFloatPanel() {
        if (this.compareFloatPanel) {
            this.compareFloatPanel.style.display = 'block';
            // 延迟添加class以触发动画
            setTimeout(() => {
                this.compareFloatPanel.classList.add('visible');
            }, 10);
        }
    }

    /**
     * 隐藏悬浮面板
     */
    hideFloatPanel() {
        if (this.compareFloatPanel) {
            this.compareFloatPanel.classList.remove('visible');
            setTimeout(() => {
                this.compareFloatPanel.style.display = 'none';
            }, 300);
        }
    }

    /**
     * 切换悬浮面板折叠状态
     */
    toggleFloatPanel() {
        this.isPanelCollapsed = !this.isPanelCollapsed;

        if (this.isPanelCollapsed) {
            this.compareFloatPanel.classList.add('collapsed');
        } else {
            this.compareFloatPanel.classList.remove('collapsed');
        }
    }

    /**
     * 更新悬浮面板内容
     */
    updateFloatPanelContent() {
        if (!this.compareItems) return;

        if (this.selectedProducts.size === 0) {
            this.compareItems.innerHTML = `
                <div class="compare-empty-state">
                    <i class="fas fa-balance-scale"></i>
                    <p>还未选择产品对比</p>
                </div>
            `;
            return;
        }

        const itemsHTML = Array.from(this.selectedProducts).map(product => {
            const productImage = this.getProductImage(product.element);
            const productCategory = this.getProductCategory(product.element);

            return `
                <div class="compare-item" data-product-id="${product.id}">
                    <img class="compare-item-image"
                         src="${productImage}"
                         alt="${product.name}"
                         onerror="this.src='images/fallback-product.jpg'">
                    <div class="compare-item-info">
                        <div class="compare-item-name">${product.name}</div>
                        <div class="compare-item-category">${productCategory}</div>
                    </div>
                    <button class="compare-item-remove"
                            onclick="window.productComparison.removeProductFromFloat('${product.id}')">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;
        }).join('');

        this.compareItems.innerHTML = itemsHTML;
    }

    /**
     * 从悬浮面板移除产品
     */
    removeProductFromFloat(productId) {
        const checkbox = document.querySelector(`#compare-${productId}`);
        if (checkbox) {
            checkbox.checked = false;
            checkbox.dispatchEvent(new Event('change'));
        }
    }

    /**
     * 获取产品图片
     */
    getProductImage(element) {
        const img = element.querySelector('img');
        return img ? img.src : 'images/fallback-product.jpg';
    }

    /**
     * 获取产品类别
     */
    getProductCategory(element) {
        const category = element.dataset.category;
        const categoryMap = {
            'shaped': '定型耐火制品',
            'unshaped': '不定型耐火材料',
            'special': '特种耐火制品',
            'lightweight': '轻质保温制品'
        };
        return categoryMap[category] || '耐火材料';
    }

    showMaxProductsAlert() {
        // 创建临时提示
        const alert = document.createElement('div');
        alert.className = 'compare-alert';
        alert.innerHTML = `
            <div class="alert-content">
                <i class="fas fa-exclamation-triangle"></i>
                最多只能选择 ${this.maxCompareProducts} 个产品进行对比
            </div>
        `;

        document.body.appendChild(alert);

        // 添加样式
        Object.assign(alert.style, {
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: '#ff6b6b',
            color: 'white',
            padding: '1rem 2rem',
            borderRadius: '8px',
            zIndex: '10000',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            fontSize: '0.9rem',
            fontWeight: '500'
        });

        // 3秒后自动移除
        setTimeout(() => {
            if (alert.parentNode) {
                alert.parentNode.removeChild(alert);
            }
        }, 3000);
    }

    clearSelection() {
        // 清除所有选择
        this.selectedProducts.forEach(product => {
            const checkbox = document.querySelector(`#compare-${product.id}`);
            if (checkbox) {
                checkbox.checked = false;
            }
            product.element.classList.remove('selected-for-compare');
        });

        this.selectedProducts.clear();
        this.updateCompareControls();
    }

    showComparison() {
        if (this.selectedProducts.size < 2) {
            return;
        }

        this.generateComparisonTable();
        this.comparisonModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    hideComparison() {
        this.comparisonModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    generateComparisonTable() {
        const products = Array.from(this.selectedProducts);

        const table = document.createElement('table');
        table.className = 'comparison-table';

        // 表头
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        headerRow.innerHTML = `
            <th>产品特性</th>
            ${products.map(product => `
                <th class="product-header">${product.name}</th>
            `).join('')}
        `;
        thead.appendChild(headerRow);
        table.appendChild(thead);

        // 表体
        const tbody = document.createElement('tbody');

        // 产品图片行
        const imageRow = document.createElement('tr');
        imageRow.innerHTML = `
            <td><strong>产品图片</strong></td>
            ${products.map(product => {
                const data = this.productData[product.id] || {};
                return `
                    <td class="product-image">
                        <img src="${data.image || 'images/fallback-product.jpg'}"
                             alt="${product.name}"
                             onerror="this.src='images/fallback-product.jpg'">
                    </td>
                `;
            }).join('')}
        `;
        tbody.appendChild(imageRow);

        // 产品参数行
        const parameters = [
            { key: 'al2o3', label: 'Al₂O₃含量', unit: '' },
            { key: 'tempRange', label: '使用温度', unit: '' },
            { key: 'porosity', label: '显气孔率', unit: '' },
            { key: 'strength', label: '耐压强度', unit: '' },
            { key: 'application', label: '主要应用', unit: '' },
            { key: 'category', label: '产品类别', unit: '' }
        ];

        parameters.forEach(param => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><strong>${param.label}</strong></td>
                ${products.map(product => {
                    const data = this.productData[product.id] || {};
                    const value = data[param.key] || '请咨询';
                    return `<td>${value}${param.unit}</td>`;
                }).join('')}
            `;
            tbody.appendChild(row);
        });

        // 产品优势行
        const advantagesRow = document.createElement('tr');
        advantagesRow.innerHTML = `
            <td><strong>产品优势</strong></td>
            ${products.map(product => {
                const data = this.productData[product.id] || {};
                const advantages = data.advantages || ['请咨询详细信息'];
                return `
                    <td>
                        <ul style="margin: 0; padding-left: 1rem;">
                            ${advantages.map(adv => `<li>${adv}</li>`).join('')}
                        </ul>
                    </td>
                `;
            }).join('')}
        `;
        tbody.appendChild(advantagesRow);

        table.appendChild(tbody);

        // 清空并插入新表格
        this.comparisonBody.innerHTML = '';
        this.comparisonBody.appendChild(table);
    }

    // 获取产品数据（可以从DOM或API获取）
    getProductDataFromCard(card, productId) {
        const title = card.querySelector('h3');
        const description = card.querySelector('.product-description');
        const image = card.querySelector('img');

        return {
            name: title ? title.textContent.trim() : '未知产品',
            description: description ? description.textContent.trim() : '',
            image: image ? image.src : 'images/fallback-product.jpg',
            // 从data属性获取技术参数
            al2o3: card.dataset.al2o3 || '请咨询',
            tempRange: card.dataset.tempRange || '请咨询',
            porosity: card.dataset.porosity || '请咨询',
            strength: card.dataset.strength || '请咨询',
            application: card.dataset.application || '请咨询',
            category: card.dataset.category === 'shaped' ? '定型耐火制品' :
                     card.dataset.category === 'unshaped' ? '不定型耐火材料' :
                     card.dataset.category === 'special' ? '特种耐火材料' :
                     card.dataset.category === 'lightweight' ? '轻质保温制品' : '请咨询'
        };
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 只在产品页面初始化
    if (document.querySelector('.products-page')) {
        window.productComparison = new ProductComparison();
    }
});

// 暴露到全局
window.ProductComparison = ProductComparison;