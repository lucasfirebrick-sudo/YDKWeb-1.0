/**
 * YDK Language Switcher - Navbar Integrated
 * 语言切换器组件 - 集成到导航栏
 *
 * 特点：
 * - 桌面端：显示 🌐 EN ▼，点击展开下拉菜单
 * - 移动端：只显示 🌐，放置在汉堡菜单旁边
 * - 智能路径映射，自动跳转到对应语言页面
 */

class YDKLanguageSwitcher {
    constructor() {
        this.currentLang = this.detectLanguage();
        this.isOpen = false;
        this.init();
    }

    /**
     * 检测当前语言
     */
    detectLanguage() {
        // 标准化路径(处理Windows反斜杠)
        const path = window.location.pathname.replace(/\\/g, '/');

        // 多种检测方式
        if (path.includes('/en/')) {
            return 'en';
        } else if (path.includes('/zh/')) {
            return 'zh';
        }

        // 默认根据文件位置判断
        const lowerPath = path.toLowerCase();
        if (lowerPath.indexOf('ydkweb-1.0/en') !== -1) {
            return 'en';
        } else if (lowerPath.indexOf('ydkweb-1.0/zh') !== -1) {
            return 'zh';
        }

        return 'zh'; // 最终默认中文
    }

    /**
     * 初始化
     */
    init() {
        this.injectStyles();
        this.render();
        this.bindEvents();

        // 详细调试信息
        if (window.DEBUG_MODE) {
            console.log('🌐 YDK Language Switcher Initialized');
            console.log(`   Current Language: ${this.currentLang}`);
            console.log(`   Current Path: ${window.location.pathname}`);
            console.log(`   Origin: ${window.location.origin}`);
            console.log(`   Protocol: ${window.location.protocol}`);
        }
    }

    /**
     * 注入CSS样式
     */
    injectStyles() {
        const styles = `
            /* ========== YDK Language Switcher Styles ========== */
            .ydk-language-switcher {
                position: relative;
                margin-left: auto;
                margin-right: 15px;
                z-index: 100;
            }

            .ydk-lang-trigger {
                display: flex;
                align-items: center;
                gap: 6px;
                padding: 8px 14px;
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 20px;
                color: white;
                cursor: pointer;
                transition: all 0.3s ease;
                font-family: inherit;
                font-size: 14px;
                font-weight: 600;
            }

            .ydk-lang-trigger:hover {
                background: rgba(255, 255, 255, 0.2);
                transform: translateY(-1px);
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            }

            .globe-icon {
                font-size: 18px;
                line-height: 1;
            }

            .lang-text {
                font-size: 14px;
                font-weight: 600;
                letter-spacing: 0.5px;
            }

            .arrow-icon {
                font-size: 10px;
                transition: transform 0.3s ease;
            }

            .ydk-language-switcher.open .arrow-icon {
                transform: rotate(180deg);
            }

            /* 下拉菜单 */
            .ydk-lang-dropdown {
                position: absolute;
                top: calc(100% + 10px);
                right: 0;
                background: white;
                border-radius: 12px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05);
                min-width: 160px;
                opacity: 0;
                visibility: hidden;
                transform: translateY(-10px);
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                overflow: hidden;
            }

            .ydk-language-switcher.open .ydk-lang-dropdown {
                opacity: 1;
                visibility: visible;
                transform: translateY(0);
            }

            .lang-option {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 12px 16px;
                color: #333;
                font-weight: 600;
                text-decoration: none;
                transition: background 0.2s ease;
                cursor: pointer;
                border: none;
                width: 100%;
                background: none;
                text-align: left;
                font-size: 14px;
            }

            .lang-option:hover {
                background: #f5f5f5;
            }

            .lang-option.active {
                background: rgba(211, 47, 47, 0.1);
                color: #d32f2f;
            }

            .lang-option .flag {
                font-size: 20px;
                line-height: 1;
            }

            /* ========== 移动端样式 (≤768px) ========== */
            @media (max-width: 768px) {
                .ydk-language-switcher {
                    margin-left: 0;
                    margin-right: 10px;
                    order: 10; /* 确保在汉堡菜单之前 */
                }

                .ydk-lang-trigger {
                    padding: 8px 10px;
                    min-width: 44px; /* 足够的触摸区域 */
                    justify-content: center;
                }

                /* 移动端：隐藏文字和箭头，只显示地球图标 */
                .lang-text,
                .arrow-icon {
                    display: none;
                }

                .globe-icon {
                    font-size: 22px;
                }

                /* 下拉菜单从左侧展开 */
                .ydk-lang-dropdown {
                    right: auto;
                    left: 0;
                }
            }

            @media (max-width: 480px) {
                .ydk-lang-trigger {
                    padding: 6px 8px;
                    min-width: 40px;
                }

                .globe-icon {
                    font-size: 20px;
                }
            }

            /* 暗色主题支持 */
            [data-theme="dark"] .ydk-lang-trigger {
                background: rgba(255, 255, 255, 0.05);
                border-color: rgba(255, 255, 255, 0.1);
            }

            [data-theme="dark"] .ydk-lang-dropdown {
                background: #2a2a2a;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
            }

            [data-theme="dark"] .lang-option {
                color: #e0e0e0;
            }

            [data-theme="dark"] .lang-option:hover {
                background: #3a3a3a;
            }

            [data-theme="dark"] .lang-option.active {
                background: rgba(211, 47, 47, 0.2);
                color: #ff5252;
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    /**
     * 渲染语言切换器HTML
     */
    render() {
        const container = document.getElementById('ydkLanguageSwitcherContainer');
        if (!container) {
            return;
        }

        const currentLangText = this.currentLang === 'en' ? 'EN' : '中';

        const html = `
            <div class="ydk-language-switcher">
                <button class="ydk-lang-trigger" aria-label="Switch Language" aria-expanded="false">
                    <span class="globe-icon">🌐</span>
                    <span class="lang-text">${currentLangText}</span>
                    <i class="fas fa-chevron-down arrow-icon"></i>
                </button>
                <div class="ydk-lang-dropdown" role="menu">
                    <button class="lang-option ${this.currentLang === 'zh' ? 'active' : ''}"
                            data-lang="zh" role="menuitem">
                        <span class="flag">🇨🇳</span>
                        <span>中文</span>
                    </button>
                    <button class="lang-option ${this.currentLang === 'en' ? 'active' : ''}"
                            data-lang="en" role="menuitem">
                        <span class="flag">🇺🇸</span>
                        <span>English</span>
                    </button>
                </div>
            </div>
        `;

        container.innerHTML = html;
    }

    /**
     * 绑定事件
     */
    bindEvents() {
        const switcher = document.querySelector('.ydk-language-switcher');
        if (!switcher) return;

        const trigger = switcher.querySelector('.ydk-lang-trigger');
        const langOptions = switcher.querySelectorAll('.lang-option');

        // 点击按钮切换下拉菜单
        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleDropdown();
        });

        // 点击语言选项
        langOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                e.preventDefault();
                const targetLang = option.getAttribute('data-lang');
                this.switchLanguage(targetLang);
            });
        });

        // 点击外部关闭下拉菜单
        document.addEventListener('click', (e) => {
            if (!switcher.contains(e.target)) {
                this.closeDropdown();
            }
        });

        // ESC键关闭
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeDropdown();
            }
        });
    }

    /**
     * 切换下拉菜单
     */
    toggleDropdown() {
        const switcher = document.querySelector('.ydk-language-switcher');
        const trigger = switcher.querySelector('.ydk-lang-trigger');

        this.isOpen = !this.isOpen;

        if (this.isOpen) {
            switcher.classList.add('open');
            trigger.setAttribute('aria-expanded', 'true');
        } else {
            switcher.classList.remove('open');
            trigger.setAttribute('aria-expanded', 'false');
        }
    }

    /**
     * 关闭下拉菜单
     */
    closeDropdown() {
        const switcher = document.querySelector('.ydk-language-switcher');
        const trigger = switcher?.querySelector('.ydk-lang-trigger');

        if (switcher && this.isOpen) {
            this.isOpen = false;
            switcher.classList.remove('open');
            trigger.setAttribute('aria-expanded', 'false');
        }
    }

    /**
     * 切换语言
     */
    switchLanguage(targetLang) {
        if (targetLang === this.currentLang) {
            this.closeDropdown();
            return;
        }

        const currentPath = window.location.pathname;
        const newUrl = this.translatePath(currentPath, targetLang);

        // 验证并跳转
        this.navigateTo(newUrl, targetLang);
    }

    /**
     * 翻译路径
     */
    translatePath(path, targetLang) {
        // 标准化路径(处理Windows反斜杠)
        const normalizedPath = path.replace(/\\/g, '/');

        // 提取文件名
        const pathParts = normalizedPath.split('/');
        const fileName = pathParts[pathParts.length - 1] || 'index.html';

        // 提取子目录(支持多级)
        let subDir = '';
        if (normalizedPath.includes('/products/')) {
            subDir = 'products/';
        } else if (normalizedPath.includes('/applications/')) {
            subDir = 'applications/';
        }
        // 可扩展:未来添加更多子目录

        // 构建新路径
        const origin = window.location.origin;
        const langPrefix = targetLang === 'zh' ? '/zh/' : '/en/';

        // 处理file://协议(本地文件系统)
        if (origin.startsWith('file://')) {
            // 提取基础路径(到YDKWeb-1.0/)
            const match = normalizedPath.match(/(.*?YDKWeb-1\.0)\/(en|zh)\//i);
            if (match) {
                const basePath = match[1];
                const newPath = `${basePath}${langPrefix}${subDir}${fileName}`;
                return `file:///${newPath}`.replace(/\\/g, '/').replace(/\/+/g, '/').replace('file:/', 'file:///');
            }
        }

        return origin + langPrefix + subDir + fileName;
    }

    /**
     * 导航到目标URL
     */
    navigateTo(url, targetLang) {
        // 本地文件直接跳转(不做HEAD检查)
        if (url.startsWith('file://')) {
            window.location.href = url;
            return;
        }

        // HTTP(S)协议才做HEAD检查
        fetch(url, { method: 'HEAD' })
            .then(response => {
                if (response.ok) {
                    window.location.href = url;
                } else {
                    // 页面不存在，跳转到首页
                    const homepage = window.location.origin +
                        (targetLang === 'zh' ? '/zh/index.html' : '/en/index.html');
                    window.location.href = homepage;
                }
            })
            .catch((error) => {
                // 网络错误或其他问题，直接尝试跳转
                window.location.href = url;
            });
    }
}

// 自动初始化
(function() {
    // 等待navbar容器准备好
    function initWhenReady() {
        const container = document.getElementById('ydkLanguageSwitcherContainer');
        if (container) {
            window.ydkLanguageSwitcher = new YDKLanguageSwitcher();
        } else {
            // 如果容器还没准备好，等待一下再试
            setTimeout(initWhenReady, 100);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initWhenReady);
    } else {
        initWhenReady();
    }
})();

// 导出到全局
window.YDKLanguageSwitcher = YDKLanguageSwitcher;