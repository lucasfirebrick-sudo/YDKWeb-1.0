/**
 * 无障碍访问增强器 - 提供完整的ARIA支持和键盘导航
 * 支持屏幕阅读器、键盘导航和高对比度模式
 */

class AccessibilityEnhancer {
    constructor() {
        this.focusableElements = [];
        this.currentFocusIndex = -1;
        this.skipLinks = [];
        this.landmarks = new Map();
        this.announcements = [];
        this.isInitialized = false;

        // 配置选项
        this.config = {
            enableSkipLinks: true,
            enableLiveAnnouncements: true,
            enableFocusManagement: true,
            enableLandmarkNavigation: true,
            enableKeyboardShortcuts: true,
            focusOutlineWidth: '2px',
            focusOutlineColor: '#005fcc'
        };

        this.init();
    }

    /**
     * 初始化无障碍访问增强
     */
    init() {
        if (this.isInitialized) return;

        this.setupSkipLinks();
        this.enhanceFormElements();
        this.setupLandmarks();
        this.setupFocusManagement();
        this.setupKeyboardShortcuts();
        this.setupLiveRegions();
        this.enhanceImages();
        this.setupColorContrastSupport();
        this.bindEvents();

        this.isInitialized = true;
        console.log('✅ 无障碍访问增强器初始化完成');
    }

    /**
     * 设置跳转链接
     */
    setupSkipLinks() {
        if (!this.config.enableSkipLinks) return;

        const skipLinksContainer = document.createElement('div');
        skipLinksContainer.className = 'skip-links';
        skipLinksContainer.setAttribute('aria-label', '跳转链接');

        const skipLinks = [
            { href: '#mainNavigation', text: '跳转到导航' },
            { href: '#main-content', text: '跳转到主要内容' },
            { href: '#site-footer', text: '跳转到页脚' }
        ];

        skipLinks.forEach(link => {
            const skipLink = document.createElement('a');
            skipLink.href = link.href;
            skipLink.textContent = link.text;
            skipLink.className = 'skip-link';
            skipLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.focusElement(link.href);
            });
            skipLinksContainer.appendChild(skipLink);
            this.skipLinks.push(skipLink);
        });

        document.body.insertBefore(skipLinksContainer, document.body.firstChild);
    }

    /**
     * 增强表单元素
     */
    enhanceFormElements() {
        // 为所有表单控件添加适当的标签和描述
        const formControls = document.querySelectorAll('input, select, textarea');

        formControls.forEach(control => {
            this.enhanceFormControl(control);
        });

        // 增强表单验证
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            this.enhanceFormValidation(form);
        });
    }

    /**
     * 增强单个表单控件
     */
    enhanceFormControl(control) {
        // 确保每个控件都有适当的标签
        if (!control.getAttribute('aria-label') && !control.getAttribute('aria-labelledby')) {
            const label = control.closest('label') || document.querySelector(`label[for="${control.id}"]`);
            if (label && !control.getAttribute('aria-labelledby')) {
                if (!label.id) {
                    label.id = `label-${this.generateId()}`;
                }
                control.setAttribute('aria-labelledby', label.id);
            }
        }

        // 为必填字段添加aria-required
        if (control.hasAttribute('required') && !control.getAttribute('aria-required')) {
            control.setAttribute('aria-required', 'true');
        }

        // 增强错误提示
        const errorElement = document.querySelector(`[data-error-for="${control.id}"]`);
        if (errorElement) {
            if (!errorElement.id) {
                errorElement.id = `error-${this.generateId()}`;
            }
            control.setAttribute('aria-describedby', errorElement.id);
            errorElement.setAttribute('role', 'alert');
            errorElement.setAttribute('aria-live', 'polite');
        }
    }

    /**
     * 增强表单验证
     */
    enhanceFormValidation(form) {
        form.addEventListener('submit', (e) => {
            const invalidControls = form.querySelectorAll(':invalid');
            if (invalidControls.length > 0) {
                e.preventDefault();
                this.focusFirstInvalidControl(invalidControls);
                this.announceFormErrors(invalidControls);
            }
        });

        // 实时验证反馈
        const controls = form.querySelectorAll('input, select, textarea');
        controls.forEach(control => {
            control.addEventListener('invalid', () => {
                control.setAttribute('aria-invalid', 'true');
                this.updateErrorMessage(control);
            });

            control.addEventListener('input', () => {
                if (control.checkValidity()) {
                    control.setAttribute('aria-invalid', 'false');
                    this.clearErrorMessage(control);
                }
            });
        });
    }

    /**
     * 设置页面地标
     */
    setupLandmarks() {
        const landmarkSelectors = {
            'banner': 'header, [role="banner"]',
            'navigation': 'nav, [role="navigation"]',
            'main': 'main, [role="main"]',
            'complementary': 'aside, [role="complementary"]',
            'contentinfo': 'footer, [role="contentinfo"]'
        };

        Object.entries(landmarkSelectors).forEach(([role, selector]) => {
            const elements = document.querySelectorAll(selector);
            elements.forEach((element, index) => {
                if (!element.getAttribute('role')) {
                    element.setAttribute('role', role);
                }

                // 为多个相同类型的地标添加标签
                if (elements.length > 1) {
                    const label = this.generateLandmarkLabel(element, role, index);
                    if (label && !element.getAttribute('aria-label')) {
                        element.setAttribute('aria-label', label);
                    }
                }

                this.landmarks.set(element, role);
            });
        });
    }

    /**
     * 生成地标标签
     */
    generateLandmarkLabel(element, role, index) {
        const heading = element.querySelector('h1, h2, h3, h4, h5, h6');
        if (heading) {
            return heading.textContent.trim();
        }

        const roleLabels = {
            'banner': '网站横幅',
            'navigation': '导航菜单',
            'main': '主要内容',
            'complementary': '补充信息',
            'contentinfo': '页脚信息'
        };

        return `${roleLabels[role] || role} ${index + 1}`;
    }

    /**
     * 设置焦点管理
     */
    setupFocusManagement() {
        if (!this.config.enableFocusManagement) return;

        // 收集所有可聚焦元素
        this.updateFocusableElements();

        // 设置焦点样式
        this.setupFocusStyles();

        // 监听焦点变化
        document.addEventListener('focusin', (e) => {
            this.handleFocusIn(e);
        });

        document.addEventListener('focusout', (e) => {
            this.handleFocusOut(e);
        });
    }

    /**
     * 更新可聚焦元素列表
     */
    updateFocusableElements() {
        const focusableSelector = `
            a[href],
            button:not([disabled]),
            input:not([disabled]),
            select:not([disabled]),
            textarea:not([disabled]),
            [tabindex]:not([tabindex="-1"]),
            [role="button"]:not([disabled]),
            [role="link"]:not([disabled])
        `;

        this.focusableElements = Array.from(document.querySelectorAll(focusableSelector))
            .filter(element => {
                return element.offsetWidth > 0 && element.offsetHeight > 0 &&
                       !element.disabled && element.tabIndex !== -1;
            });
    }

    /**
     * 设置焦点样式
     */
    setupFocusStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .skip-links {
                position: absolute;
                top: -40px;
                left: 6px;
                z-index: 999999;
            }

            .skip-link {
                display: inline-block;
                padding: 8px 16px;
                background: #000;
                color: #fff;
                text-decoration: none;
                border-radius: 4px;
                margin-right: 8px;
                transition: top 0.3s;
            }

            .skip-link:focus {
                position: absolute;
                top: 6px;
                text-decoration: underline;
            }

            *:focus {
                outline: ${this.config.focusOutlineWidth} solid ${this.config.focusOutlineColor} !important;
                outline-offset: 2px !important;
            }

            .focus-indicator {
                position: absolute;
                pointer-events: none;
                border: 2px solid ${this.config.focusOutlineColor};
                border-radius: 4px;
                transition: all 0.1s ease;
                z-index: 999999;
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * 设置键盘快捷键
     */
    setupKeyboardShortcuts() {
        if (!this.config.enableKeyboardShortcuts) return;

        document.addEventListener('keydown', (e) => {
            // Alt + M: 跳转到主要内容
            if (e.altKey && e.key.toLowerCase() === 'm') {
                e.preventDefault();
                this.focusElement('#main-content');
                this.announce('已跳转到主要内容');
            }

            // Alt + N: 跳转到导航
            if (e.altKey && e.key.toLowerCase() === 'n') {
                e.preventDefault();
                this.focusElement('#mainNavigation');
                this.announce('已跳转到导航菜单');
            }

            // Alt + F: 跳转到页脚
            if (e.altKey && e.key.toLowerCase() === 'f') {
                e.preventDefault();
                this.focusElement('#site-footer');
                this.announce('已跳转到页脚');
            }

            // Escape: 关闭模态框或下拉菜单
            if (e.key === 'Escape') {
                this.closeOpenComponents();
            }
        });
    }

    /**
     * 设置实时区域
     */
    setupLiveRegions() {
        if (!this.config.enableLiveAnnouncements) return;

        // 创建实时公告区域
        const liveRegion = document.createElement('div');
        liveRegion.id = 'live-announcements';
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.style.cssText = `
            position: absolute;
            left: -10000px;
            width: 1px;
            height: 1px;
            overflow: hidden;
        `;
        document.body.appendChild(liveRegion);

        // 创建紧急公告区域
        const assertiveRegion = document.createElement('div');
        assertiveRegion.id = 'assertive-announcements';
        assertiveRegion.setAttribute('aria-live', 'assertive');
        assertiveRegion.setAttribute('aria-atomic', 'true');
        assertiveRegion.style.cssText = liveRegion.style.cssText;
        document.body.appendChild(assertiveRegion);
    }

    /**
     * 增强图片无障碍
     */
    enhanceImages() {
        const images = document.querySelectorAll('img');

        images.forEach(img => {
            // 确保装饰性图片被屏幕阅读器忽略
            if (img.alt === '' || img.hasAttribute('data-decorative')) {
                img.setAttribute('role', 'presentation');
                img.setAttribute('aria-hidden', 'true');
            }

            // 为没有alt属性的重要图片添加警告
            if (!img.hasAttribute('alt') && !img.hasAttribute('aria-label')) {
                console.warn('⚠️ 图片缺少alt属性:', img.src);
                img.setAttribute('alt', '图片描述缺失');
            }
        });
    }

    /**
     * 设置颜色对比度支持
     */
    setupColorContrastSupport() {
        // 检测系统是否启用高对比度模式
        const highContrastQuery = window.matchMedia('(prefers-contrast: high)');

        const handleContrastChange = (e) => {
            if (e.matches) {
                document.body.classList.add('high-contrast');
                this.announce('已启用高对比度模式');
            } else {
                document.body.classList.remove('high-contrast');
            }
        };

        highContrastQuery.addListener(handleContrastChange);
        handleContrastChange(highContrastQuery);

        // 检测减少动画偏好
        const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

        const handleMotionChange = (e) => {
            if (e.matches) {
                document.body.classList.add('reduced-motion');
            } else {
                document.body.classList.remove('reduced-motion');
            }
        };

        motionQuery.addListener(handleMotionChange);
        handleMotionChange(motionQuery);
    }

    /**
     * 绑定事件监听器
     */
    bindEvents() {
        // 页面内容变化时更新可聚焦元素
        const observer = new MutationObserver(() => {
            this.updateFocusableElements();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['disabled', 'tabindex', 'hidden']
        });
    }

    /**
     * 处理焦点进入事件
     */
    handleFocusIn(e) {
        const element = e.target;
        this.currentFocusIndex = this.focusableElements.indexOf(element);

        // 公告当前聚焦元素的信息
        if (element.getAttribute('aria-label') || element.getAttribute('title')) {
            const label = element.getAttribute('aria-label') || element.getAttribute('title');
            this.announce(label, 'polite');
        }
    }

    /**
     * 处理焦点离开事件
     */
    handleFocusOut(e) {
        // 可以在这里添加焦点离开时的逻辑
    }

    /**
     * 聚焦指定元素
     */
    focusElement(selector) {
        const element = typeof selector === 'string' ?
            document.querySelector(selector) : selector;

        if (element) {
            // 确保元素可见
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });

            // 聚焦元素
            element.focus();

            // 如果元素不能自然聚焦，设置tabindex
            if (document.activeElement !== element) {
                element.setAttribute('tabindex', '-1');
                element.focus();
            }
        }
    }

    /**
     * 聚焦第一个无效控件
     */
    focusFirstInvalidControl(invalidControls) {
        if (invalidControls.length > 0) {
            this.focusElement(invalidControls[0]);
        }
    }

    /**
     * 公告表单错误
     */
    announceFormErrors(invalidControls) {
        const errorCount = invalidControls.length;
        const message = `表单包含 ${errorCount} 个错误，请检查并修正`;
        this.announce(message, 'assertive');
    }

    /**
     * 更新错误信息
     */
    updateErrorMessage(control) {
        const errorElement = document.querySelector(`[data-error-for="${control.id}"]`);
        if (errorElement) {
            errorElement.textContent = control.validationMessage;
            errorElement.style.display = 'block';
        }
    }

    /**
     * 清除错误信息
     */
    clearErrorMessage(control) {
        const errorElement = document.querySelector(`[data-error-for="${control.id}"]`);
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        }
    }

    /**
     * 关闭打开的组件
     */
    closeOpenComponents() {
        // 关闭模态框
        const modals = document.querySelectorAll('.modal.active, [role="dialog"][aria-hidden="false"]');
        modals.forEach(modal => {
            modal.classList.remove('active');
            modal.setAttribute('aria-hidden', 'true');
        });

        // 关闭下拉菜单
        const dropdowns = document.querySelectorAll('.dropdown.active, [aria-expanded="true"]');
        dropdowns.forEach(dropdown => {
            dropdown.classList.remove('active');
            dropdown.setAttribute('aria-expanded', 'false');
        });
    }

    /**
     * 公告消息
     */
    announce(message, priority = 'polite') {
        if (!this.config.enableLiveAnnouncements) return;

        const regionId = priority === 'assertive' ? 'assertive-announcements' : 'live-announcements';
        const region = document.getElementById(regionId);

        if (region) {
            region.textContent = message;
            this.announcements.push({
                message,
                priority,
                timestamp: new Date().toISOString()
            });

            // 清除消息（让屏幕阅读器读完）
            setTimeout(() => {
                region.textContent = '';
            }, 1000);
        }
    }

    /**
     * 生成唯一ID
     */
    generateId() {
        return 'a11y-' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * 获取无障碍状态
     */
    getAccessibilityState() {
        return {
            isInitialized: this.isInitialized,
            config: this.config,
            focusableElementsCount: this.focusableElements.length,
            skipLinksCount: this.skipLinks.length,
            landmarksCount: this.landmarks.size,
            announcementsCount: this.announcements.length,
            currentFocusIndex: this.currentFocusIndex
        };
    }

    /**
     * 更新配置
     */
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
    }

    /**
     * 销毁组件
     */
    destroy() {
        if (!this.isInitialized) return;

        // 清理跳转链接
        const skipLinksContainer = document.querySelector('.skip-links');
        if (skipLinksContainer) {
            skipLinksContainer.remove();
        }

        // 清理实时区域
        ['live-announcements', 'assertive-announcements'].forEach(id => {
            const element = document.getElementById(id);
            if (element) element.remove();
        });

        // 清理状态
        this.focusableElements = [];
        this.skipLinks = [];
        this.landmarks.clear();
        this.announcements = [];
        this.isInitialized = false;

        console.log('🧹 无障碍访问增强器已销毁');
    }

    /**
     * 调试信息
     */
    debug() {
        console.log('Accessibility Enhancer Debug Info:', this.getAccessibilityState());
    }
}

// 创建全局实例
window.accessibilityEnhancer = new AccessibilityEnhancer();

// 导出供Node.js环境使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AccessibilityEnhancer;
}