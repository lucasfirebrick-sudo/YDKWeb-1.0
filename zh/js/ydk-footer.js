/**
 * YDK Footer Component - 完全按照截图复刻
 * 独立JavaScript组件，不污染全局命名空间
 */

(function() {
    'use strict';

    // Footer HTML模板 - 完全按照截图文字内容
    const FOOTER_HTML = `
    <footer class="ydk-footer">
        <div class="ydk-footer-container">
            <div class="ydk-footer-main">
                <!-- 公司信息 -->
                <div class="ydk-company-section">
                    <h3>三代人的小心思，只想做出让您安心的好砖</h3>
                    <p class="ydk-company-tagline">专业耐火材料制造商</p>
                    <p class="ydk-company-description">从手感判断到数据分析，我们始终坚持用心做砖。专注于高品质耐火砖、浇注料等产品的研发与生产，服务全球40多个国家和地区。</p>
                </div>

                <!-- Newsletter订阅 -->
                <div class="ydk-newsletter-section">
                    <h4>想听听我们的故事吗？</h4>
                    <p class="ydk-newsletter-intro">订阅我们的故事，了解三代人传承的耐火砖制作工艺，从手感判断到数据分析的匠心历程</p>

                    <form class="ydk-newsletter-form" id="ydkNewsletterForm">
                        <input
                            type="email"
                            class="ydk-email-input"
                            placeholder="留下您的邮箱，我们想和您分享故事"
                            required
                        >
                        <button type="submit" class="ydk-subscribe-btn">
                            <i class="fas fa-heart"></i>
                            我想听听你们的故事
                        </button>
                        <div class="ydk-privacy-note">我们承诺保护您的隐私，不会发送垃圾邮件</div>
                        <div class="ydk-form-message"></div>
                    </form>
                </div>

                <!-- 联系信息 -->
                <div class="ydk-contact-section">
                    <h4>联系我们</h4>
                    <p class="ydk-contact-description">专业的耐火材料解决方案提供商</p>
                    <div class="ydk-contact-info">
                        <div class="ydk-contact-item">
                            <i class="ydk-contact-icon fas fa-phone"></i>
                            <span>+86 371 86541085</span>
                        </div>
                        <div class="ydk-contact-item">
                            <i class="ydk-contact-icon fas fa-envelope"></i>
                            <span>export@yuandake.com</span>
                        </div>
                        <div class="ydk-contact-item">
                            <i class="ydk-contact-icon fas fa-map-marker-alt"></i>
                            <span>河南省新密市超化工业园区</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 版权信息 -->
            <div class="ydk-footer-bottom">
                <div class="ydk-footer-copyright">
                    <div class="ydk-copyright-main">© 2025 河南元达科耐火材料有限公司 版权所有 | <a href="#" target="_blank">豫ICP备xxxxxx号</a></div>
                    <div class="ydk-copyright-slogan">用心做砖，用爱服务</div>
                </div>
            </div>
        </div>
    </footer>
    `;

    // YDK Footer 类
    class YDKFooter {
        constructor() {
            this.footer = null;
            this.newsletterForm = null;
            this.init();
        }

        init() {
            this.render();
            this.updateCopyright();
            this.bindEvents();
        }

        render() {
            // 查找插入位置
            let footerContainer = document.getElementById('footer-container');

            if (!footerContainer) {
                footerContainer = document.createElement('div');
                footerContainer.id = 'footer-container';
                document.body.appendChild(footerContainer);
            }

            footerContainer.innerHTML = FOOTER_HTML;

            // 缓存DOM元素
            this.footer = document.querySelector('.ydk-footer');
            this.newsletterForm = document.getElementById('ydkNewsletterForm');
        }

        updateCopyright() {
            const currentYear = new Date().getFullYear();
            const copyrightMain = document.querySelector('.ydk-copyright-main');
            if (copyrightMain) {
                copyrightMain.innerHTML = copyrightMain.innerHTML.replace('2025', currentYear);
            }
        }

        bindEvents() {
            if (this.newsletterForm) {
                this.newsletterForm.addEventListener('submit', (e) => {
                    this.handleNewsletterSubmit(e);
                });

                // 输入时隐藏错误消息
                const emailInput = this.newsletterForm.querySelector('.ydk-email-input');
                if (emailInput) {
                    emailInput.addEventListener('input', () => {
                        this.hideFormMessage();
                    });
                }
            }
        }

        handleNewsletterSubmit(e) {
            e.preventDefault();

            const emailInput = this.newsletterForm.querySelector('.ydk-email-input');
            const submitBtn = this.newsletterForm.querySelector('.ydk-subscribe-btn');
            const formMessage = this.newsletterForm.querySelector('.ydk-form-message');

            if (emailInput.value && emailInput.checkValidity()) {
                // 显示加载状态
                this.setLoadingState(submitBtn, true);

                // 模拟提交过程
                setTimeout(() => {
                    this.showSuccessState(emailInput, submitBtn, formMessage);

                    // 记录订阅
                    console.log('Newsletter subscription:', emailInput.value);

                    // 3秒后重置
                    setTimeout(() => {
                        this.resetForm(emailInput, submitBtn, formMessage);
                    }, 3000);

                }, 1500);
            } else {
                this.showErrorMessage(formMessage, '请输入有效的邮箱地址');
            }
        }

        setLoadingState(submitBtn, isLoading) {
            if (isLoading) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 正在订阅...';
            }
        }

        showSuccessState(emailInput, submitBtn, formMessage) {
            // 成功状态
            submitBtn.innerHTML = '<i class="fas fa-heart"></i> 感谢您成为我们的朋友！';

            formMessage.textContent = '订阅成功！我们会分享有趣的耐火砖制作故事给您。';
            formMessage.className = 'ydk-form-message success';
            formMessage.style.display = 'block';

            emailInput.disabled = true;
            submitBtn.disabled = true;
        }

        showErrorMessage(formMessage, message) {
            formMessage.textContent = message;
            formMessage.className = 'ydk-form-message error';
            formMessage.style.display = 'block';

            setTimeout(() => {
                this.hideFormMessage();
            }, 3000);
        }

        resetForm(emailInput, submitBtn, formMessage) {
            submitBtn.innerHTML = '<i class="fas fa-heart"></i> 我想听听你们的故事';
            emailInput.disabled = false;
            submitBtn.disabled = false;
            emailInput.value = '';
            this.hideFormMessage();
        }

        hideFormMessage() {
            const formMessage = document.querySelector('.ydk-form-message');
            if (formMessage) {
                formMessage.style.display = 'none';
            }
        }
    }

    // 自动初始化
    function initYDKFooter() {
        window.YDKFooter = new YDKFooter();
    }

    // DOM加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initYDKFooter);
    } else {
        initYDKFooter();
    }

})();