// 产品页面侧边栏功能

document.addEventListener('DOMContentLoaded', function() {

    // 产品页面侧边栏功能
    initProductSidebar();

    function initProductSidebar() {
        // 创建产品侧边栏（如果不存在）
        if (!document.querySelector('.product-sidebar')) {
            createProductSidebar();
        }

        // 绑定侧边栏事件
        bindSidebarEvents();
    }

    function createProductSidebar() {
        // 检查是否在产品页面
        if (!window.location.pathname.includes('/products/')) {
            return;
        }

        const sidebarHTML = `
            <div class="product-sidebar">
                <div class="sidebar-toggle" id="sidebarToggle">
                    <i class="fas fa-list"></i>
                    <span>产品导航</span>
                </div>
                <div class="sidebar-content" id="sidebarContent">
                    <div class="sidebar-header">
                        <h4>相关产品</h4>
                        <button class="sidebar-close" id="sidebarClose">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="sidebar-menu">
                        <div class="menu-category">
                            <h5>耐火砖系列</h5>
                            <ul>
                                <li><a href="high-alumina-brick.html">高铝砖</a></li>
                                <li><a href="fireclay-brick.html">粘土砖</a></li>
                                <li><a href="lightweight-silica-brick.html">轻质硅砖</a></li>
                                <li><a href="insulating-fire-brick.html">保温砖</a></li>
                                <li><a href="mullite-brick.html">莫来石砖</a></li>
                            </ul>
                        </div>
                        <div class="menu-category">
                            <h5>特种砖系列</h5>
                            <ul>
                                <li><a href="chrome-corundum-brick.html">铬刚玉砖</a></li>
                                <li><a href="corundum-brick.html">刚玉砖</a></li>
                                <li><a href="chrome-zirconium-corundum-brick.html">铬锆刚玉砖</a></li>
                            </ul>
                        </div>
                        <div class="menu-category">
                            <h5>异型砖系列</h5>
                            <ul>
                                <li><a href="high-alumina-arch-brick.html">高铝万能弧砖</a></li>
                                <li><a href="fireclay-arch-brick.html">粘土万能弧砖</a></li>
                                <li><a href="high-alumina-anchor-brick.html">高铝锚固砖</a></li>
                            </ul>
                        </div>
                        <div class="menu-category">
                            <h5>浇注料系列</h5>
                            <ul>
                                <li><a href="castables-mortar.html">耐火浇注料</a></li>
                            </ul>
                        </div>
                    </div>
                    <div class="sidebar-contact">
                        <div class="contact-item">
                            <i class="fas fa-phone"></i>
                            <span>+86 371 86541085</span>
                        </div>
                        <div class="contact-item">
                            <i class="fas fa-envelope"></i>
                            <span>service@yuandake.com</span>
                        </div>
                        <button class="sidebar-inquiry-btn" onclick="document.getElementById('inquiryBtn').click()">
                            <i class="fas fa-paper-plane"></i>
                            立即询价
                        </button>
                    </div>
                </div>
            </div>
        `;

        const style = document.createElement('style');
        style.textContent = `
            .product-sidebar {
                position: fixed;
                right: 20px;
                top: 50%;
                transform: translateY(-50%);
                z-index: 1000;
            }

            .sidebar-toggle {
                background: #d32f2f;
                color: white;
                padding: 10px 15px;
                border-radius: 5px 0 0 5px;
                cursor: pointer;
                box-shadow: -2px 0 10px rgba(0,0,0,0.1);
                display: flex;
                align-items: center;
                gap: 8px;
                font-size: 0.9rem;
                writing-mode: vertical-rl;
                text-orientation: mixed;
                transition: all 0.3s ease;
            }

            .sidebar-toggle:hover {
                background: #b71c1c;
                transform: translateX(-5px);
            }

            .sidebar-content {
                position: fixed;
                top: 0;
                right: -350px;
                width: 320px;
                height: 100vh;
                background: white;
                box-shadow: -5px 0 20px rgba(0,0,0,0.1);
                transition: right 0.3s ease;
                overflow-y: auto;
                z-index: 1001;
            }

            .sidebar-content.active {
                right: 0;
            }

            .sidebar-header {
                background: #d32f2f;
                color: white;
                padding: 20px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .sidebar-header h4 {
                margin: 0;
                font-size: 1.1rem;
            }

            .sidebar-close {
                background: none;
                border: none;
                color: white;
                font-size: 1.2rem;
                cursor: pointer;
                padding: 5px;
                border-radius: 3px;
                transition: background 0.3s ease;
            }

            .sidebar-close:hover {
                background: rgba(255,255,255,0.1);
            }

            .sidebar-menu {
                padding: 20px;
            }

            .menu-category {
                margin-bottom: 25px;
            }

            .menu-category h5 {
                color: #d32f2f;
                margin-bottom: 10px;
                font-size: 1rem;
                border-bottom: 1px solid #e9ecef;
                padding-bottom: 5px;
            }

            .menu-category ul {
                list-style: none;
                padding: 0;
                margin: 0;
            }

            .menu-category li {
                margin-bottom: 8px;
            }

            .menu-category a {
                color: #333;
                text-decoration: none;
                padding: 5px 10px;
                display: block;
                border-radius: 3px;
                transition: all 0.3s ease;
                font-size: 0.9rem;
            }

            .menu-category a:hover {
                background: #f8f9fa;
                color: #d32f2f;
                padding-left: 15px;
            }

            .sidebar-contact {
                background: #f8f9fa;
                padding: 20px;
                border-top: 1px solid #e9ecef;
            }

            .contact-item {
                display: flex;
                align-items: center;
                gap: 10px;
                margin-bottom: 12px;
                font-size: 0.9rem;
                color: #666;
            }

            .contact-item i {
                color: #d32f2f;
                width: 16px;
            }

            .sidebar-inquiry-btn {
                width: 100%;
                background: #d32f2f;
                color: white;
                border: none;
                padding: 12px;
                border-radius: 5px;
                cursor: pointer;
                font-size: 0.9rem;
                font-weight: 500;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                transition: background 0.3s ease;
                margin-top: 15px;
            }

            .sidebar-inquiry-btn:hover {
                background: #b71c1c;
            }

            /* 移动端适配 */
            @media (max-width: 768px) {
                .product-sidebar {
                    display: none;
                }
            }

            /* 为当前页面添加高亮 */
            .menu-category a.current {
                background: #d32f2f;
                color: white;
            }
        `;

        document.head.appendChild(style);
        document.body.insertAdjacentHTML('beforeend', sidebarHTML);

        // 高亮当前页面
        highlightCurrentPage();
    }

    function bindSidebarEvents() {
        const sidebarToggle = document.getElementById('sidebarToggle');
        const sidebarContent = document.getElementById('sidebarContent');
        const sidebarClose = document.getElementById('sidebarClose');

        if (!sidebarToggle || !sidebarContent || !sidebarClose) {
            return;
        }

        // 打开侧边栏
        sidebarToggle.addEventListener('click', function() {
            sidebarContent.classList.add('active');
        });

        // 关闭侧边栏
        function closeSidebar() {
            sidebarContent.classList.remove('active');
        }

        sidebarClose.addEventListener('click', closeSidebar);

        // 点击外部关闭
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.product-sidebar') && sidebarContent.classList.contains('active')) {
                closeSidebar();
            }
        });

        // ESC键关闭
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && sidebarContent.classList.contains('active')) {
                closeSidebar();
            }
        });
    }

    function highlightCurrentPage() {
        const currentPath = window.location.pathname;
        const currentFile = currentPath.split('/').pop();

        const sidebarLinks = document.querySelectorAll('.menu-category a');
        sidebarLinks.forEach(link => {
            if (link.getAttribute('href') === currentFile) {
                link.classList.add('current');
            }
        });
    }

});