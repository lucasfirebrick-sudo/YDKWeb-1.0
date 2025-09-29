/**
 * 滚动效果组件 - 处理导航栏和返回顶部按钮的滚动交互
 * 支持节流优化、平滑滚动和无障碍访问
 */

class ScrollEffects {
    constructor() {
        this.navbar = null;
        this.backToTop = null;
        this.lastScrollY = 0;
        this.ticking = false;
        this.isInitialized = false;

        // 配置选项
        this.options = {
            scrollThreshold: 100,      // 滚动阈值
            backToTopThreshold: 300,   // 返回顶部按钮显示阈值
            navbarScrollClass: 'scrolled',
            backToTopShowClass: 'show',
            smoothScrollDuration: 800  // 平滑滚动持续时间
        };

        // 绑定this上下文
        this.handleScroll = this.handleScroll.bind(this);
        this.updateElements = this.updateElements.bind(this);
        this.handleBackToTop = this.handleBackToTop.bind(this);
    }

    /**
     * 初始化滚动效果
     */
    init() {
        if (this.isInitialized) return;

        this.bindElements();
        this.bindEvents();
        this.setupAccessibility();
        this.updateElements(); // 初始状态检查

        this.isInitialized = true;
        console.log('✅ 滚动效果初始化成功');
    }

    /**
     * 绑定DOM元素
     */
    bindElements() {
        this.navbar = document.querySelector('.navbar');
        this.backToTop = document.getElementById('backToTop');

        if (!this.navbar) {
            console.warn('⚠️ 未找到导航栏元素 (.navbar)');
        }

        if (!this.backToTop) {
            console.warn('⚠️ 未找到返回顶部按钮 (#backToTop)');
        }
    }

    /**
     * 绑定事件监听器
     */
    bindEvents() {
        // 滚动事件（使用节流优化）
        window.addEventListener('scroll', this.handleScroll, { passive: true });

        // 返回顶部按钮点击
        if (this.backToTop) {
            this.backToTop.addEventListener('click', this.handleBackToTop);
            this.backToTop.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.handleBackToTop();
                }
            });
        }

        // 页面加载后的初始检查
        window.addEventListener('load', () => {
            this.updateElements();
        });
    }

    /**
     * 设置无障碍访问属性
     */
    setupAccessibility() {
        if (this.backToTop) {
            this.backToTop.setAttribute('role', 'button');
            this.backToTop.setAttribute('tabindex', '0');
            this.backToTop.setAttribute('aria-label', '返回页面顶部');
            this.backToTop.setAttribute('title', '返回顶部');
        }
    }

    /**
     * 处理滚动事件（节流处理）
     */
    handleScroll() {
        this.lastScrollY = window.scrollY;

        if (!this.ticking) {
            requestAnimationFrame(this.updateElements);
            this.ticking = true;
        }
    }

    /**
     * 更新元素状态
     */
    updateElements() {
        const scrollY = this.lastScrollY;

        // 更新导航栏状态
        this.updateNavbar(scrollY);

        // 更新返回顶部按钮状态
        this.updateBackToTop(scrollY);

        this.ticking = false;
    }

    /**
     * 更新导航栏状态
     */
    updateNavbar(scrollY) {
        if (!this.navbar) return;

        if (scrollY > this.options.scrollThreshold) {
            if (!this.navbar.classList.contains(this.options.navbarScrollClass)) {
                this.navbar.classList.add(this.options.navbarScrollClass);
                this.dispatchEvent('navbarScrolled', { scrollY });
            }
        } else {
            if (this.navbar.classList.contains(this.options.navbarScrollClass)) {
                this.navbar.classList.remove(this.options.navbarScrollClass);
                this.dispatchEvent('navbarUnscrolled', { scrollY });
            }
        }
    }

    /**
     * 更新返回顶部按钮状态
     */
    updateBackToTop(scrollY) {
        if (!this.backToTop) return;

        if (scrollY > this.options.backToTopThreshold) {
            if (!this.backToTop.classList.contains(this.options.backToTopShowClass)) {
                this.backToTop.classList.add(this.options.backToTopShowClass);
                this.backToTop.setAttribute('aria-hidden', 'false');
                this.dispatchEvent('backToTopShow', { scrollY });
            }
        } else {
            if (this.backToTop.classList.contains(this.options.backToTopShowClass)) {
                this.backToTop.classList.remove(this.options.backToTopShowClass);
                this.backToTop.setAttribute('aria-hidden', 'true');
                this.dispatchEvent('backToTopHide', { scrollY });
            }
        }
    }

    /**
     * 处理返回顶部按钮点击
     */
    handleBackToTop() {
        this.smoothScrollTo(0);
        this.dispatchEvent('backToTopClicked');
    }

    /**
     * 平滑滚动到指定位置
     */
    smoothScrollTo(targetY, duration = this.options.smoothScrollDuration) {
        const startY = window.scrollY;
        const distance = targetY - startY;
        const startTime = performance.now();

        const easeInOutCubic = (t) => {
            return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
        };

        const animateScroll = (currentTime) => {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            const ease = easeInOutCubic(progress);

            window.scrollTo(0, startY + (distance * ease));

            if (progress < 1) {
                requestAnimationFrame(animateScroll);
            } else {
                // 滚动完成后触发事件
                this.dispatchEvent('smoothScrollComplete', { targetY });
            }
        };

        requestAnimationFrame(animateScroll);
    }

    /**
     * 滚动到指定元素
     */
    scrollToElement(element, offset = 0) {
        if (!element) return;

        const elementTop = element.offsetTop;
        const navbarHeight = this.navbar ? this.navbar.offsetHeight : 0;
        const targetY = elementTop - navbarHeight - offset;

        this.smoothScrollTo(Math.max(0, targetY));
    }

    /**
     * 处理锚点链接的平滑滚动
     */
    handleAnchorLinks() {
        const anchorLinks = document.querySelectorAll('a[href^="#"]');

        anchorLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href === '#' || href === '#top') {
                    e.preventDefault();
                    this.handleBackToTop();
                    return;
                }

                const targetElement = document.querySelector(href);
                if (targetElement) {
                    e.preventDefault();
                    this.scrollToElement(targetElement);

                    // 更新浏览器历史记录
                    history.pushState(null, null, href);
                }
            });
        });
    }

    /**
     * 获取当前滚动状态
     */
    getScrollState() {
        return {
            scrollY: window.scrollY,
            isNavbarScrolled: this.navbar ? this.navbar.classList.contains(this.options.navbarScrollClass) : false,
            isBackToTopVisible: this.backToTop ? this.backToTop.classList.contains(this.options.backToTopShowClass) : false,
            documentHeight: document.documentElement.scrollHeight,
            viewportHeight: window.innerHeight,
            scrollPercentage: Math.round((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100)
        };
    }

    /**
     * 更新配置选项
     */
    updateOptions(newOptions) {
        this.options = { ...this.options, ...newOptions };
        this.updateElements(); // 重新评估当前状态
    }

    /**
     * 分发自定义事件
     */
    dispatchEvent(type, detail = {}) {
        const event = new CustomEvent(`scrollEffects:${type}`, {
            detail: { ...detail, instance: this, state: this.getScrollState() }
        });
        document.dispatchEvent(event);
    }

    /**
     * 销毁组件
     */
    destroy() {
        if (!this.isInitialized) return;

        // 移除事件监听器
        window.removeEventListener('scroll', this.handleScroll);
        window.removeEventListener('load', this.updateElements);

        if (this.backToTop) {
            this.backToTop.removeEventListener('click', this.handleBackToTop);
        }

        // 清理状态
        if (this.navbar) {
            this.navbar.classList.remove(this.options.navbarScrollClass);
        }

        if (this.backToTop) {
            this.backToTop.classList.remove(this.options.backToTopShowClass);
            this.backToTop.setAttribute('aria-hidden', 'true');
        }

        this.isInitialized = false;
        console.log('🧹 滚动效果已销毁');
    }

    /**
     * 调试信息
     */
    debug() {
        console.log('Scroll Effects Debug Info:', {
            isInitialized: this.isInitialized,
            elements: {
                navbar: !!this.navbar,
                backToTop: !!this.backToTop
            },
            options: this.options,
            state: this.getScrollState()
        });
    }
}

// 创建全局实例
window.scrollEffects = new ScrollEffects();

// 页面加载完成后自动初始化
document.addEventListener('DOMContentLoaded', function() {
    window.scrollEffects.init();

    // 初始化锚点链接处理
    setTimeout(() => {
        window.scrollEffects.handleAnchorLinks();
    }, 100);
});

// 导出供Node.js环境使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ScrollEffects;
}