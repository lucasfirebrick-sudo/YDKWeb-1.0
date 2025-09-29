// ========== 全站统一浮动按钮功能 ==========

/**
 * 浮动按钮管理器
 */
const floatingButtons = {
    // 初始化标志
    initialized: false,
    isModalAnimating: false,
    quickQuoteModal: null,

    /**
     * 初始化浮动按钮功能
     */
    init() {
        if (this.initialized) return;

        // 绑定事件监听器
        this.bindEvents();

        // 初始化字符计数器
        this.initCharacterCounter();

        // 初始化模态框
        this.initModal();

        this.initialized = true;
        console.log('✅ 浮动按钮组件已初始化');
    },

    /**
     * 绑定事件监听器
     */
    bindEvents() {
        // ESC键关闭模态框
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.quickQuoteModal && this.quickQuoteModal.classList.contains('show')) {
                this.closeQuickQuoteModal();
            }
        });

        // 表单提交事件
        document.addEventListener('submit', (e) => {
            if (e.target.id === 'quickQuoteForm') {
                e.preventDefault();
                this.handleQuoteSubmit(e);
            }
        });
    },

    /**
     * 初始化模态框
     */
    initModal() {
        // 等待DOM加载完成后查找模态框
        setTimeout(() => {
            this.quickQuoteModal = document.getElementById('quickQuoteModal');

            if (this.quickQuoteModal) {
                // 点击遮罩层关闭模态框
                this.quickQuoteModal.addEventListener('click', (e) => {
                    if (e.target === this.quickQuoteModal) {
                        this.closeQuickQuoteModal();
                    }
                });

                // 阻止模态框内容点击时关闭
                const modalContent = this.quickQuoteModal.querySelector('.modal-content');
                if (modalContent) {
                    modalContent.addEventListener('click', (e) => {
                        e.stopPropagation();
                    });
                }
            }
        }, 100);
    },

    /**
     * 初始化字符计数器
     */
    initCharacterCounter() {
        setTimeout(() => {
            const textarea = document.getElementById('requirements');
            const charCount = document.getElementById('charCount');

            if (textarea && charCount) {
                textarea.addEventListener('input', function() {
                    const count = this.value.length;
                    charCount.textContent = count;

                    // 根据字符数改变颜色
                    if (count === 0) {
                        charCount.style.color = '#999';
                    } else if (count < 50) {
                        charCount.style.color = '#ff6b35';
                    } else {
                        charCount.style.color = '#28a745';
                    }
                });
            }
        }, 100);
    },

    /**
     * 回到顶部功能
     */
    scrollToTop(event) {
        event.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        return false;
    },

    /**
     * 打开快速报价模态框
     */
    openQuickQuoteModal() {
        if (!this.quickQuoteModal || this.isModalAnimating) return;

        this.isModalAnimating = true;

        // 显示模态框
        this.quickQuoteModal.style.display = 'flex';

        // 禁用背景滚动
        document.body.style.overflow = 'hidden';

        // 强制重绘后添加show类
        setTimeout(() => {
            this.quickQuoteModal.classList.add('show');
            this.isModalAnimating = false;
        }, 10);

        // 聚焦到第一个输入框
        setTimeout(() => {
            const firstInput = this.quickQuoteModal.querySelector('#requirements');
            if (firstInput) {
                firstInput.focus();
            }
        }, 350);
    },

    /**
     * 关闭快速报价模态框
     */
    closeQuickQuoteModal() {
        if (!this.quickQuoteModal || this.isModalAnimating) return;

        this.isModalAnimating = true;

        // 添加关闭动画类
        this.quickQuoteModal.classList.add('closing');
        this.quickQuoteModal.classList.remove('show');

        setTimeout(() => {
            this.quickQuoteModal.style.display = 'none';
            this.quickQuoteModal.classList.remove('closing');
            document.body.style.overflow = '';
            this.isModalAnimating = false;

            // 重置表单
            this.resetQuoteForm();
        }, 300);
    },

    /**
     * 处理表单提交
     */
    async handleQuoteSubmit(e) {
        const form = e.target;
        const submitBtn = form.querySelector('.submit-quote-btn');

        // 表单验证
        if (!this.validateQuoteForm(form)) {
            return;
        }

        // 显示加载状态
        submitBtn.classList.add('loading');
        submitBtn.textContent = '正在发送...';

        try {
            // 模拟API调用
            await new Promise(resolve => setTimeout(resolve, 2000));

            // 显示成功消息
            this.showQuoteSuccess();

            // 延迟关闭模态框
            setTimeout(() => {
                this.closeQuickQuoteModal();
            }, 2000);

        } catch (error) {
            console.error('提交询价失败:', error);
            this.showQuoteError('提交失败，请稍后重试');
        } finally {
            // 恢复按钮状态
            submitBtn.classList.remove('loading');
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i>提交询价';
        }
    },

    /**
     * 验证表单
     */
    validateQuoteForm(form) {
        const requirements = form.querySelector('#requirements');
        const email = form.querySelector('#contactEmail');

        let isValid = true;

        // 清除之前的错误状态
        this.clearFormErrors(form);

        // 验证需求描述
        if (!requirements.value.trim()) {
            this.showFieldError(requirements, '请描述您的具体需求');
            isValid = false;
        } else if (requirements.value.trim().length < 10) {
            this.showFieldError(requirements, '需求描述至少需要10个字符');
            isValid = false;
        }

        // 验证邮箱
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.value.trim()) {
            this.showFieldError(email, '请输入邮箱地址');
            isValid = false;
        } else if (!emailPattern.test(email.value.trim())) {
            this.showFieldError(email, '请输入有效的邮箱地址');
            isValid = false;
        }

        return isValid;
    },

    /**
     * 显示字段错误
     */
    showFieldError(field, message) {
        const formGroup = field.closest('.form-group');
        if (formGroup) {
            formGroup.classList.add('error');

            // 移除已存在的错误信息
            const existingError = formGroup.querySelector('.error-message');
            if (existingError) {
                existingError.remove();
            }

            // 添加错误信息
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.textContent = message;
            formGroup.appendChild(errorDiv);
        }
    },

    /**
     * 清除表单错误
     */
    clearFormErrors(form) {
        const errorGroups = form.querySelectorAll('.form-group.error');
        errorGroups.forEach(group => {
            group.classList.remove('error');
            const errorMessage = group.querySelector('.error-message');
            if (errorMessage) {
                errorMessage.remove();
            }
        });
    },

    /**
     * 显示成功消息
     */
    showQuoteSuccess() {
        const form = document.getElementById('quickQuoteForm');
        if (form) {
            form.innerHTML = `
                <div style="text-align: center; padding: 40px 20px;">
                    <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #28a745, #20c997); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px;">
                        <i class="fas fa-check" style="font-size: 40px; color: white;"></i>
                    </div>
                    <h3 style="color: #28a745; margin-bottom: 12px;">询价已提交</h3>
                    <p style="color: #666; margin-bottom: 0;">我们已收到您的询价需求<br>将在24小时内与您联系</p>
                </div>
            `;
        }
    },

    /**
     * 显示错误消息
     */
    showQuoteError(message) {
        alert(message);
    },

    /**
     * 重置表单
     */
    resetQuoteForm() {
        const form = document.getElementById('quickQuoteForm');
        if (form) {
            // 检查是否显示了成功消息
            const successDiv = form.querySelector('div[style*="text-align: center"]');
            if (successDiv) {
                // 重新创建原始表单结构
                form.innerHTML = `
                    <div class="form-group">
                        <textarea id="requirements" name="requirements" rows="4"
                                  placeholder="请详细描述您的需求，包括产品类型、使用温度、应用场景等信息，支持任何语言输入..."
                                  required></textarea>
                        <div class="char-counter">
                            <span id="charCount">0</span>
                            <span class="char-limit">*</span>
                        </div>
                    </div>
                    <div class="form-group">
                        <input type="email" id="contactEmail" name="contactEmail"
                               placeholder="请输入您的邮箱地址" required>
                    </div>
                    <div class="form-group">
                        <input type="tel" id="contactPhone" name="contactPhone"
                               placeholder="请输入您的电话号码（可选）">
                    </div>
                    <div class="form-group">
                        <input type="text" id="companyName" name="companyName"
                               placeholder="请输入您的公司名称（可选）">
                    </div>
                    <button type="submit" class="submit-quote-btn">
                        <i class="fas fa-paper-plane"></i>
                        提交询价
                    </button>
                `;

                // 重新初始化字符计数器
                this.initCharacterCounter();
            } else {
                // 如果不是成功消息，则正常重置
                form.reset();
                this.clearFormErrors(form);

                // 重置字符计数
                const charCount = document.getElementById('charCount');
                if (charCount) {
                    charCount.textContent = '0';
                    charCount.style.color = '#999';
                }
            }
        }
    }
};

// 注意：初始化将由loader负责，避免重复初始化

// 导出到全局供HTML调用
window.floatingButtons = floatingButtons;