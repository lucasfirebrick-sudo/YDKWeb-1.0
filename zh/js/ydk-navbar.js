/**
 * YDK Navbar Component - 完全按照截图复刻
 * 独立JavaScript组件，不污染全局命名空间
 */

(function() {
    'use strict';

    // 动态获取Logo路径 - 根据当前页面位置调整
    function getLogoPath() {
        const currentPath = window.location.pathname;
        // 如果当前页面在products子目录下，使用相对路径
        if (currentPath.includes('/products/') || currentPath.includes('\\products\\')) {
            return '../images/logo-new.jpg';
        }
        return 'images/logo-new.jpg';
    }

    // 动态获取首页路径
    function getHomePath() {
        const currentPath = window.location.pathname;
        if (currentPath.includes('/products/') || currentPath.includes('\\products\\')) {
            return '../index.html';
        }
        return 'index.html';
    }

    // 动态获取菜单路径
    function getMenuPath(page) {
        const currentPath = window.location.pathname;
        if (currentPath.includes('/products/') || currentPath.includes('\\products\\')) {
            return '../' + page;
        }
        return page;
    }

    // Navbar HTML模板 - 完全按照截图
    const NAVBAR_HTML = `
    <nav class="ydk-navbar">
        <div class="ydk-navbar-container">
            <a href="${getHomePath()}" class="ydk-logo-section">
                <img src="${getLogoPath()}" alt="YDK" class="ydk-logo-img">
                <div class="ydk-logo-tagline">GLOBAL ONE-STOP REFRACTORY SOLUTIONS</div>
            </a>

            <ul class="ydk-nav-menu">
                <li class="ydk-nav-item">
                    <a href="${getHomePath()}" class="ydk-nav-link">首页</a>
                </li>
                <li class="ydk-nav-item">
                    <a href="${getMenuPath('products.html')}" class="ydk-nav-link">产品中心</a>
                </li>
                <li class="ydk-nav-item">
                    <a href="${getMenuPath('applications.html')}" class="ydk-nav-link">应用领域</a>
                </li>
                <li class="ydk-nav-item">
                    <a href="${getMenuPath('quality.html')}" class="ydk-nav-link">质量控制</a>
                </li>
                <li class="ydk-nav-item">
                    <a href="${getMenuPath('about.html')}" class="ydk-nav-link">关于我们</a>
                </li>
                <li class="ydk-nav-item">
                    <a href="${getMenuPath('contact.html')}" class="ydk-nav-link">联系我们</a>
                </li>
            </ul>

            <button class="ydk-hamburger" aria-label="切换菜单">
                <span class="ydk-hamburger-line"></span>
                <span class="ydk-hamburger-line"></span>
                <span class="ydk-hamburger-line"></span>
            </button>
        </div>
    </nav>
    `;

    // YDK Navbar 类
    class YDKNavbar {
        constructor() {
            this.navbar = null;
            this.hamburger = null;
            this.navMenu = null;
            this.init();
        }

        init() {
            this.render();
            this.setActiveLink();
            this.bindEvents();
        }

        render() {
            // 查找插入位置
            const existingHeader = document.querySelector('header');
            const targetElement = existingHeader || document.body;

            if (existingHeader) {
                existingHeader.innerHTML = NAVBAR_HTML;
            } else {
                targetElement.insertAdjacentHTML('afterbegin', NAVBAR_HTML);
            }

            // 缓存DOM元素
            this.navbar = document.querySelector('.ydk-navbar');
            this.hamburger = document.querySelector('.ydk-hamburger');
            this.navMenu = document.querySelector('.ydk-nav-menu');
        }

        setActiveLink() {
            const currentPath = window.location.pathname;
            const currentPage = currentPath.split('/').pop() || 'index.html';

            // 移除所有活跃状态
            document.querySelectorAll('.ydk-nav-link').forEach(link => {
                link.classList.remove('active');
            });

            // 设置当前页面活跃
            const activeLink = document.querySelector(`.ydk-nav-link[href="${currentPage}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            } else if (currentPage === '' || currentPage === 'index.html') {
                const homeLink = document.querySelector('.ydk-nav-link[href="index.html"]');
                if (homeLink) homeLink.classList.add('active');
            }
        }

        bindEvents() {
            if (this.hamburger && this.navMenu) {
                // 汉堡菜单点击事件
                this.hamburger.addEventListener('click', () => {
                    this.toggleMobileMenu();
                });

                // 导航链接点击事件
                document.querySelectorAll('.ydk-nav-link').forEach(link => {
                    link.addEventListener('click', () => {
                        this.closeMobileMenu();
                    });
                });

                // 点击外部关闭菜单
                document.addEventListener('click', (e) => {
                    if (!e.target.closest('.ydk-navbar')) {
                        this.closeMobileMenu();
                    }
                });

                // ESC键关闭菜单
                document.addEventListener('keydown', (e) => {
                    if (e.key === 'Escape') {
                        this.closeMobileMenu();
                    }
                });
            }
        }

        toggleMobileMenu() {
            this.hamburger.classList.toggle('active');
            this.navMenu.classList.toggle('mobile-active');
        }

        closeMobileMenu() {
            this.hamburger.classList.remove('active');
            this.navMenu.classList.remove('mobile-active');
        }

        // 公共方法：重新设置活跃链接
        updateActiveLink() {
            this.setActiveLink();
        }
    }

    // 自动初始化
    function initYDKNavbar() {
        window.YDKNavbar = new YDKNavbar();
    }

    // DOM加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initYDKNavbar);
    } else {
        initYDKNavbar();
    }

})();