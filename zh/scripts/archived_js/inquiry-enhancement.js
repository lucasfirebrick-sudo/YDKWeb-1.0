// 询价功能增强 - 产品选择和自动填充
class InquiryEnhancement {
    constructor() {
        this.selectedProducts = new Set();
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateSelectedCount();
    }

    bindEvents() {
        // 监听复选框变化
        document.addEventListener('change', (e) => {
            if (e.target.matches('input[name="products[]"]')) {
                this.handleProductSelection(e.target);
            }
        });

        // 监听表单提交
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                this.handleFormSubmit(e);
            });
        }
    }

    handleProductSelection(checkbox) {
        const productName = checkbox.getAttribute('data-product');
        const productValue = checkbox.value;

        if (checkbox.checked) {
            this.selectedProducts.add({
                name: productName,
                value: productValue
            });
        } else {
            // 移除产品
            this.selectedProducts.forEach(product => {
                if (product.value === productValue) {
                    this.selectedProducts.delete(product);
                }
            });
        }

        this.updateSelectedCount();
        this.updateMessageField();
    }

    updateSelectedCount() {
        const countElement = document.getElementById('selectedCount');
        if (countElement) {
            countElement.textContent = this.selectedProducts.size;
        }
    }

    updateMessageField() {
        const messageField = document.getElementById('message');
        if (messageField && this.selectedProducts.size > 0) {
            const productNames = Array.from(this.selectedProducts).map(p => p.name);
            const existingMessage = messageField.value;

            // 检查是否已经有产品信息
            if (!existingMessage.includes('咨询产品：')) {
                const productText = `咨询产品：${productNames.join('、')}\\n\\n`;
                messageField.value = productText + existingMessage;
            } else {
                // 更新现有的产品信息
                const newProductText = `咨询产品：${productNames.join('、')}`;
                messageField.value = messageField.value.replace(
                    /咨询产品：[^\\n]*/,
                    newProductText
                );
            }
        }
    }

    handleFormSubmit(e) {
        e.preventDefault();

        const formData = new FormData(e.target);
        const selectedProducts = Array.from(this.selectedProducts);

        // 构建提交数据
        const submitData = {
            name: formData.get('name'),
            company: formData.get('company'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            country: formData.get('country'),
            products: selectedProducts,
            application: formData.get('application'),
            message: formData.get('message')
        };


        // 显示成功消息
        this.showSuccessMessage();

        // 重置表单
        e.target.reset();
        this.selectedProducts.clear();
        this.updateSelectedCount();
    }

    showSuccessMessage() {
        // 创建成功提示
        const successDiv = document.createElement('div');
        successDiv.className = 'inquiry-success-message';
        successDiv.innerHTML = `
            <div class="success-content">
                <i class="fas fa-check-circle"></i>
                <h3>询价信息已提交</h3>
                <p>我们已收到您的询价信息，将在24小时内回复您。</p>
            </div>
        `;

        // 添加样式
        successDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            z-index: 10000;
            text-align: center;
            max-width: 400px;
            width: 90%;
        `;

        document.body.appendChild(successDiv);

        // 3秒后自动移除
        setTimeout(() => {
            if (successDiv.parentNode) {
                successDiv.parentNode.removeChild(successDiv);
            }
        }, 3000);
    }

    // 从主页产品卡片直接选择产品
    selectProductFromCard(productName, productId) {
        // 跳转到联系页面
        const contactUrl = window.location.origin + '/contact.html';
        const params = new URLSearchParams();
        params.set('product', productId);
        params.set('productName', productName);

        window.location.href = `${contactUrl}?${params.toString()}`;
    }

    // 从URL参数预选产品
    preselectFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('product');
        const productName = urlParams.get('productName');

        if (productId && productName) {
            // 自动选中对应的复选框
            const checkbox = document.querySelector(`input[value="${productId}"]`);
            if (checkbox) {
                checkbox.checked = true;
                this.handleProductSelection(checkbox);
            }

            // 显示提示信息
            this.showPreselectionMessage(productName);
        }
    }

    showPreselectionMessage(productName) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'preselection-message';
        messageDiv.innerHTML = `
            <i class="fas fa-info-circle"></i>
            已为您预选产品：<strong>${productName}</strong>
        `;

        messageDiv.style.cssText = `
            background: #e8f5e8;
            color: #2e7d32;
            padding: 10px 15px;
            border-radius: 6px;
            margin-bottom: 15px;
            border: 1px solid #a5d6a7;
            font-size: 14px;
        `;

        // 插入到产品选择区域上方
        const productSelection = document.getElementById('productSelection');
        if (productSelection) {
            productSelection.parentNode.insertBefore(messageDiv, productSelection);

            // 5秒后淡出
            setTimeout(() => {
                messageDiv.style.transition = 'opacity 1s ease';
                messageDiv.style.opacity = '0';
                setTimeout(() => {
                    if (messageDiv.parentNode) {
                        messageDiv.parentNode.removeChild(messageDiv);
                    }
                }, 1000);
            }, 5000);
        }
    }
}

// 全局函数：从产品卡片打开询价
function openInquiryWithProduct(button) {
    const productName = button.getAttribute('data-product');
    const productId = button.getAttribute('data-product-id');

    if (productName && productId) {
        // 如果当前就在联系页面，直接选择产品
        if (window.location.pathname.includes('contact.html')) {
            const checkbox = document.querySelector(`input[value="${productId}"]`);
            if (checkbox && !checkbox.checked) {
                checkbox.checked = true;
                checkbox.dispatchEvent(new Event('change'));
            }
        } else {
            // 跳转到联系页面并预选产品
            const contactUrl = window.location.origin + window.location.pathname.replace(/[^/]*$/, 'contact.html');
            const params = new URLSearchParams();
            params.set('product', productId);
            params.set('productName', productName);

            window.location.href = `${contactUrl}?${params.toString()}`;
        }
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    const inquiryEnhancement = new InquiryEnhancement();

    // 如果是联系页面，检查URL参数并预选产品
    if (window.location.pathname.includes('contact.html')) {
        setTimeout(() => {
            inquiryEnhancement.preselectFromURL();
        }, 100);
    }
});

// 为产品页面添加CSS样式
const inquiryStyles = `
<style>
.inquiry-success-message .success-content {
    color: #2e7d32;
}

.inquiry-success-message .success-content i {
    font-size: 48px;
    color: #4CAF50;
    margin-bottom: 15px;
}

.inquiry-success-message .success-content h3 {
    margin: 15px 0 10px 0;
    color: #2e7d32;
}

.inquiry-success-message .success-content p {
    margin: 0;
    color: #666;
}
</style>
`;

// 添加样式到页面
if (document.head) {
    document.head.insertAdjacentHTML('beforeend', inquiryStyles);
}