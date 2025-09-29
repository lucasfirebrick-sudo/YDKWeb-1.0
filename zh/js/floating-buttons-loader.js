// ========== 浮动按钮组件动态加载器 ==========

/**
 * 浮动按钮加载器
 * 类似于导航栏和页脚加载器，负责动态加载浮动按钮组件
 */
const FloatingButtonsLoader = {
    // 加载状态
    loaded: false,
    loading: false,

    /**
     * 初始化加载器
     */
    async init() {
        if (this.loaded || this.loading) return;

        this.loading = true;

        try {
            // 并行加载CSS和HTML
            await Promise.all([
                this.loadCSS(),
                this.loadHTML()
            ]);

            // 加载JavaScript功能
            await this.loadJS();

            this.loaded = true;
            console.log('✅ 浮动按钮组件加载完成');

        } catch (error) {
            console.error('❌ 浮动按钮组件加载失败:', error);
        } finally {
            this.loading = false;
        }
    },

    /**
     * 加载CSS样式
     */
    loadCSS() {
        return new Promise((resolve, reject) => {
            // 检查是否已经加载
            if (document.querySelector('link[href*="floating-buttons.css"]')) {
                resolve();
                return;
            }

            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.type = 'text/css';
            link.href = 'css/components/floating-buttons.css';

            link.onload = () => {
                console.log('✅ 浮动按钮CSS加载完成');
                resolve();
            };

            link.onerror = () => {
                console.error('❌ 浮动按钮CSS加载失败');
                reject(new Error('CSS加载失败'));
            };

            document.head.appendChild(link);
        });
    },

    /**
     * 加载HTML结构
     */
    loadHTML() {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await fetch('components/floating-buttons.html');

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }

                const html = await response.text();

                // 创建容器并插入HTML
                const container = document.createElement('div');
                container.innerHTML = html;

                // 将内容插入到body末尾
                document.body.appendChild(container);

                console.log('✅ 浮动按钮HTML加载完成');
                resolve();

            } catch (error) {
                console.error('❌ 浮动按钮HTML加载失败:', error);

                // 如果网络加载失败，使用内联HTML作为备选
                this.loadInlineHTML();
                resolve();
            }
        });
    },

    /**
     * 备选方案：加载内联HTML
     */
    loadInlineHTML() {
        const html = `
            <!-- 全站统一浮动按钮组件 -->
            <div class="floating-buttons-container">
                <!-- 回到顶部按钮 -->
                <a href="#top" class="float-btn back-to-top" title="回到顶部" aria-label="回到页面顶部" onclick="floatingButtons.scrollToTop(event)">
                    <i class="fas fa-arrow-up" aria-hidden="true"></i>
                    <span class="sr-only">回到顶部</span>
                </a>

                <!-- 快速报价按钮 -->
                <a href="javascript:void(0)" class="float-btn quick-quote" title="快速报价" aria-label="获取快速报价" onclick="floatingButtons.openQuickQuoteModal()">
                    <i class="fas fa-calculator" aria-hidden="true"></i>
                    <span class="sr-only">快速报价</span>
                </a>

                <!-- WhatsApp按钮 -->
                <a href="https://wa.me/8613503976002" class="float-btn whatsapp" title="WhatsApp" target="_blank" aria-label="通过WhatsApp联系我们">
                    <i class="fab fa-whatsapp" aria-hidden="true"></i>
                    <span class="sr-only">WhatsApp</span>
                </a>
            </div>

            <!-- 快速报价模态框 -->
            <div id="quickQuoteModal" class="modal-overlay">
                <div class="modal-content quick-quote-modal">
                    <div class="modal-header">
                        <div class="modal-title-icon">
                            <i class="fas fa-calculator"></i>
                            <h3>快速询价</h3>
                        </div>
                        <button class="modal-close" onclick="floatingButtons.closeQuickQuoteModal()" type="button" aria-label="关闭">&times;</button>
                    </div>
                    <div class="modal-subtitle">
                        描述您的需求，我们将快速为您报价
                    </div>
                    <form class="quick-quote-form" id="quickQuoteForm">
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
                    </form>
                </div>
            </div>
        `;

        const container = document.createElement('div');
        container.innerHTML = html;
        document.body.appendChild(container);

        console.log('✅ 浮动按钮内联HTML加载完成');
    },

    /**
     * 加载JavaScript功能
     */
    loadJS() {
        return new Promise((resolve, reject) => {
            // 检查是否已经加载
            if (document.querySelector('script[src*="floating-buttons.js"]')) {
                // 如果已加载但未初始化，则立即初始化
                setTimeout(() => {
                    if (window.floatingButtons && !window.floatingButtons.initialized) {
                        window.floatingButtons.init();
                    }
                }, 100);
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = 'js/components/floating-buttons.js';
            script.type = 'text/javascript';

            script.onload = () => {
                console.log('✅ 浮动按钮JS加载完成');
                // 确保HTML已经加载完成后再初始化
                setTimeout(() => {
                    if (window.floatingButtons) {
                        window.floatingButtons.init();
                    } else {
                        console.error('❌ floatingButtons对象未找到');
                    }
                }, 150);
                resolve();
            };

            script.onerror = () => {
                console.error('❌ 浮动按钮JS加载失败');
                reject(new Error('JavaScript加载失败'));
            };

            document.head.appendChild(script);
        });
    },

    /**
     * 检查依赖（Font Awesome图标）
     */
    checkDependencies() {
        // 检查Font Awesome是否已加载
        if (!document.querySelector('link[href*="font-awesome"]') &&
            !document.querySelector('link[href*="fontawesome"]')) {
            console.warn('⚠️  警告：未检测到Font Awesome，图标可能无法正常显示');
        }
    }
};

// 自动初始化
(function() {
    // 检查依赖
    FloatingButtonsLoader.checkDependencies();

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            FloatingButtonsLoader.init();
        });
    } else {
        // 如果DOM已经加载完成
        FloatingButtonsLoader.init();
    }
})();

// 导出到全局
window.FloatingButtonsLoader = FloatingButtonsLoader;