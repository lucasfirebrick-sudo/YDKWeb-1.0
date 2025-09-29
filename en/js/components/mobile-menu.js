/**
 * 移动端菜单组件 - 处理移动设备导航交互
 * 支持触摸手势、键盘导航和无障碍访问
 */

class MobileMenu {
    constructor() {
        this.isOpen = false;
        this.menuToggle = null;
        this.menu = null;
        this.menuItems = [];
        this.focusableElements = [];
        this.lastFocusedElement = null;
        this.isInitialized = false;

        // 触摸相关
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.minSwipeDistance = 50;

        // 防抖
        this.debounceTimeout = null;
    }

    /**
     * 初始化移动端菜单
     */
    init() {
        if (this.isInitialized) return;

        this.bindElements();
        if (!this.menuToggle || !this.menu) return;

        this.bindEvents();
        this.setupAccessibility();
        this.isInitialized = true;

        console.log('✅ 移动端菜单初始化成功');
    }

    /**
     * 绑定DOM元素
     */
    bindElements() {
        this.menuToggle = document.getElementById('navToggle');
        this.menu = document.querySelector('.nav-menu');
        this.menuItems = Array.from(document.querySelectorAll('.nav-item'));

        if (this.menu) {
            this.focusableElements = Array.from(
                this.menu.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])')
            );
        }
    }

    /**
     * 绑定事件监听器
     */
    bindEvents() {
        // 菜单切换按钮
        this.menuToggle.addEventListener('click', (e) => this.handleToggleClick(e));
        this.menuToggle.addEventListener('keydown', (e) => this.handleToggleKeydown(e));

        // 菜单外部点击
        document.addEventListener('click', (e) => this.handleOutsideClick(e));

        // 键盘导航
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));

        // 触摸手势
        this.menu.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
        this.menu.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: true });

        // 窗口大小变化
        window.addEventListener('resize', () => this.handleResize());

        // 下拉菜单项
        this.menuItems.forEach(item => {
            if (item.classList.contains('has-mega-dropdown')) {
                this.bindDropdownEvents(item);
            }
        });
    }

    /**
     * 绑定下拉菜单事件
     */
    bindDropdownEvents(item) {
        const link = item.querySelector('.nav-link');
        if (!link) return;

        // 移动端下拉菜单切换
        link.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                this.toggleDropdown(item);
            }
        });

        link.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    this.toggleDropdown(item);
                }
            }
        });
    }

    /**
     * 设置无障碍访问属性
     */
    setupAccessibility() {
        // 设置菜单切换按钮属性
        this.menuToggle.setAttribute('aria-expanded', 'false');
        this.menuToggle.setAttribute('aria-controls', 'navMenu');
        this.menuToggle.setAttribute('aria-label', '菜单切换');

        // 设置菜单属性
        this.menu.setAttribute('role', 'navigation');
        this.menu.setAttribute('aria-label', '主导航菜单');

        // 设置下拉菜单属性
        this.menuItems.forEach((item, index) => {
            if (item.classList.contains('has-mega-dropdown')) {
                const link = item.querySelector('.nav-link');
                const dropdown = item.querySelector('.mega-dropdown-menu');

                if (link && dropdown) {
                    const dropdownId = `dropdown-${index}`;
                    dropdown.setAttribute('id', dropdownId);
                    link.setAttribute('aria-haspopup', 'true');
                    link.setAttribute('aria-expanded', 'false');
                    link.setAttribute('aria-controls', dropdownId);
                }
            }
        });
    }

    /**
     * 处理菜单切换按钮点击
     */
    handleToggleClick(e) {
        e.preventDefault();
        this.toggle();
    }

    /**
     * 处理菜单切换按钮键盘事件
     */
    handleToggleKeydown(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.toggle();
        }
    }

    /**
     * 处理外部点击
     */
    handleOutsideClick(e) {
        if (this.isOpen && !this.menuToggle.contains(e.target) && !this.menu.contains(e.target)) {
            this.close();
        }
    }

    /**
     * 处理键盘事件
     */
    handleKeyDown(e) {
        if (!this.isOpen) return;

        switch (e.key) {
            case 'Escape':
                e.preventDefault();
                this.close();
                this.menuToggle.focus();
                break;
            case 'Tab':
                this.handleTabNavigation(e);
                break;
        }
    }

    /**
     * 处理Tab导航
     */
    handleTabNavigation(e) {
        if (this.focusableElements.length === 0) return;

        const firstElement = this.focusableElements[0];
        const lastElement = this.focusableElements[this.focusableElements.length - 1];

        if (e.shiftKey) {
            // Shift + Tab: 向前导航
            if (document.activeElement === firstElement || document.activeElement === this.menuToggle) {
                e.preventDefault();
                lastElement.focus();
            }
        } else {
            // Tab: 向后导航
            if (document.activeElement === lastElement) {
                e.preventDefault();
                this.menuToggle.focus();
            }
        }
    }

    /**
     * 处理触摸开始
     */
    handleTouchStart(e) {
        this.touchStartX = e.touches[0].clientX;
        this.touchStartY = e.touches[0].clientY;
    }

    /**
     * 处理触摸结束
     */
    handleTouchEnd(e) {
        if (!this.isOpen) return;

        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        const deltaX = touchEndX - this.touchStartX;
        const deltaY = touchEndY - this.touchStartY;

        // 检查是否为有效的左滑手势
        if (deltaX < -this.minSwipeDistance && Math.abs(deltaY) < 100) {
            this.close();
        }
    }

    /**
     * 处理窗口大小变化
     */
    handleResize() {
        clearTimeout(this.debounceTimeout);
        this.debounceTimeout = setTimeout(() => {
            if (window.innerWidth > 768 && this.isOpen) {
                this.close(false); // 不触发焦点返回
            }
        }, 150);
    }

    /**
     * 切换菜单状态
     */
    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    /**
     * 打开菜单
     */
    open() {
        if (this.isOpen) return;

        this.isOpen = true;
        this.lastFocusedElement = document.activeElement;

        // 更新UI
        this.menuToggle.classList.add('active');
        this.menuToggle.setAttribute('aria-expanded', 'true');
        this.menu.classList.add('active');
        document.body.classList.add('nav-open');

        // 焦点管理
        requestAnimationFrame(() => {
            if (this.focusableElements.length > 0) {
                this.focusableElements[0].focus();
            }
        });

        // 触发自定义事件
        this.dispatchEvent('menuOpen');
    }

    /**
     * 关闭菜单
     */
    close(returnFocus = true) {
        if (!this.isOpen) return;

        this.isOpen = false;

        // 更新UI
        this.menuToggle.classList.remove('active');
        this.menuToggle.setAttribute('aria-expanded', 'false');
        this.menu.classList.remove('active');
        document.body.classList.remove('nav-open');

        // 关闭所有下拉菜单
        this.closeAllDropdowns();

        // 焦点管理
        if (returnFocus && this.lastFocusedElement) {
            this.lastFocusedElement.focus();
        }

        // 触发自定义事件
        this.dispatchEvent('menuClose');
    }

    /**
     * 切换下拉菜单
     */
    toggleDropdown(item) {
        const isActive = item.classList.contains('active');

        // 关闭其他下拉菜单
        this.menuItems.forEach(otherItem => {
            if (otherItem !== item && otherItem.classList.contains('has-mega-dropdown')) {
                this.closeDropdown(otherItem);
            }
        });

        // 切换当前下拉菜单
        if (isActive) {
            this.closeDropdown(item);
        } else {
            this.openDropdown(item);
        }
    }

    /**
     * 打开下拉菜单
     */
    openDropdown(item) {
        const link = item.querySelector('.nav-link');

        item.classList.add('active');
        if (link) {
            link.setAttribute('aria-expanded', 'true');
        }

        // 触发自定义事件
        this.dispatchEvent('dropdownOpen', { item });
    }

    /**
     * 关闭下拉菜单
     */
    closeDropdown(item) {
        const link = item.querySelector('.nav-link');

        item.classList.remove('active');
        if (link) {
            link.setAttribute('aria-expanded', 'false');
        }

        // 触发自定义事件
        this.dispatchEvent('dropdownClose', { item });
    }

    /**
     * 关闭所有下拉菜单
     */
    closeAllDropdowns() {
        this.menuItems.forEach(item => {
            if (item.classList.contains('has-mega-dropdown')) {
                this.closeDropdown(item);
            }
        });
    }

    /**
     * 分发自定义事件
     */
    dispatchEvent(type, detail = {}) {
        const event = new CustomEvent(`mobileMenu:${type}`, {
            detail: { ...detail, instance: this }
        });
        document.dispatchEvent(event);
    }

    /**
     * 销毁组件
     */
    destroy() {
        if (!this.isInitialized) return;

        // 移除事件监听器
        if (this.menuToggle) {
            this.menuToggle.removeEventListener('click', this.handleToggleClick);
            this.menuToggle.removeEventListener('keydown', this.handleToggleKeydown);
        }

        document.removeEventListener('click', this.handleOutsideClick);
        document.removeEventListener('keydown', this.handleKeyDown);
        window.removeEventListener('resize', this.handleResize);

        // 清理状态
        this.close(false);
        this.isInitialized = false;

        console.log('🧹 移动端菜单已销毁');
    }

    /**
     * 获取菜单状态
     */
    getState() {
        return {
            isOpen: this.isOpen,
            isInitialized: this.isInitialized,
            focusableElements: this.focusableElements.length,
            activeDropdowns: this.menuItems.filter(item =>
                item.classList.contains('has-mega-dropdown') && item.classList.contains('active')
            ).length
        };
    }

    /**
     * 调试信息
     */
    debug() {
        console.log('Mobile Menu Debug Info:', {
            state: this.getState(),
            elements: {
                menuToggle: !!this.menuToggle,
                menu: !!this.menu,
                menuItems: this.menuItems.length
            }
        });
    }
}

// 创建全局实例
window.mobileMenu = new MobileMenu();

// 页面加载完成后自动初始化
document.addEventListener('DOMContentLoaded', function() {
    window.mobileMenu.init();
});

// 导出供Node.js环境使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MobileMenu;
}