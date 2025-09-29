/**
 * 语言切换组件
 * 处理中文版(7788/)和英文版(7788-en/)之间的切换
 */

class LanguageSwitcher {
    constructor() {
        this.currentLang = this.detectCurrentLanguage();
        this.init();
    }

    /**
     * 根据URL路径检测当前语言
     */
    detectCurrentLanguage() {
        const path = window.location.pathname;
        if (path.includes('/7788-en/')) {
            return 'en';
        } else if (path.includes('/7788/')) {
            return 'zh';
        }
        // 基于域名或文件夹结构的默认检测
        return 'zh'; // 7788文件夹默认为中文
    }

    /**
     * 初始化语言切换器
     */
    init() {
        this.createSwitcherElement();
        this.attachEventListeners();
        this.updateSwitcherState();
    }

    /**
     * 创建语言切换器HTML元素
     */
    createSwitcherElement() {
        const switcherHTML = `
            <div class="language-switcher" id="languageSwitcher">
                <div class="lang-toggle">
                    <button class="lang-btn" data-lang="zh" title="切换至中文">
                        <span class="flag-icon">🇨🇳</span>
                        <span class="lang-text">中文</span>
                    </button>
                    <button class="lang-btn" data-lang="en" title="Switch to English">
                        <span class="flag-icon">🇺🇸</span>
                        <span class="lang-text">English</span>
                    </button>
                </div>
            </div>
        `;

        // 将切换器插入页面（尝试多个位置）
        const navbarContainer = document.querySelector('.navbar .container');
        const headerContainer = document.querySelector('header .container');
        const bodyElement = document.body;

        if (navbarContainer) {
            navbarContainer.insertAdjacentHTML('beforeend', switcherHTML);
        } else if (headerContainer) {
            headerContainer.insertAdjacentHTML('beforeend', switcherHTML);
        } else {
            // 后备方案：创建固定位置的切换器
            const fixedSwitcher = document.createElement('div');
            fixedSwitcher.className = 'language-switcher-fixed';
            fixedSwitcher.innerHTML = switcherHTML;
            bodyElement.appendChild(fixedSwitcher);
        }
    }

    /**
     * 为语言按钮附加事件监听器
     */
    attachEventListeners() {
        const langButtons = document.querySelectorAll('.lang-btn');
        langButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const targetLang = button.getAttribute('data-lang');
                this.switchLanguage(targetLang);
            });
        });
    }

    /**
     * 切换到指定语言
     */
    switchLanguage(targetLang) {
        if (targetLang === this.currentLang) {
            return; // 已经是目标语言
        }

        const currentPath = window.location.pathname;
        const currentSearch = window.location.search;
        const currentHash = window.location.hash;

        let newPath;

        if (targetLang === 'zh') {
            // 切换到中文版 (7788/)
            if (currentPath.includes('/7788-en/')) {
                newPath = currentPath.replace('/7788-en/', '/7788/');
            } else {
                newPath = '/7788/' + currentPath.split('/').pop();
            }
        } else {
            // 切换到英文版 (7788-en/)
            if (currentPath.includes('/7788/')) {
                newPath = currentPath.replace('/7788/', '/7788-en/');
            } else {
                newPath = '/7788-en/' + currentPath.split('/').pop();
            }
        }

        // 构建完整URL
        const newUrl = window.location.origin + newPath + currentSearch + currentHash;

        // 导航到新语言版本
        window.location.href = newUrl;
    }

    /**
     * 更新切换器的视觉状态
     */
    updateSwitcherState() {
        const langButtons = document.querySelectorAll('.lang-btn');
        langButtons.forEach(button => {
            const buttonLang = button.getAttribute('data-lang');
            if (buttonLang === this.currentLang) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
    }

    /**
     * 获取其他语言版本的等效页面URL
     */
    getAlternateLanguageUrl() {
        const alternateLang = this.currentLang === 'en' ? 'zh' : 'en';
        const currentPath = window.location.pathname;

        if (alternateLang === 'zh') {
            return currentPath.replace('/7788-en/', '/7788/');
        } else {
            return currentPath.replace('/7788/', '/7788-en/');
        }
    }
}

// 语言切换器的CSS样式
const switcherStyles = `
    .language-switcher {
        display: flex;
        align-items: center;
        margin-left: auto;
        padding: 0 15px;
    }

    .lang-toggle {
        display: flex;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 25px;
        padding: 4px;
        border: 1px solid rgba(255, 255, 255, 0.2);
        backdrop-filter: blur(10px);
    }

    .lang-btn {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 8px 12px;
        border: none;
        background: transparent;
        color: #ffffff;
        border-radius: 20px;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 14px;
        font-weight: 500;
        text-decoration: none;
    }

    .lang-btn:hover {
        background: rgba(255, 255, 255, 0.15);
        transform: translateY(-1px);
    }

    .lang-btn.active {
        background: rgba(255, 255, 255, 0.9);
        color: #333;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .flag-icon {
        font-size: 16px;
        line-height: 1;
    }

    .lang-text {
        font-size: 13px;
        font-weight: 600;
        letter-spacing: 0.5px;
    }

    /* 固定位置后备方案 */
    .language-switcher-fixed {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 1000;
        background: rgba(0, 0, 0, 0.8);
        border-radius: 30px;
        padding: 5px;
        backdrop-filter: blur(10px);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    }

    .language-switcher-fixed .lang-toggle {
        background: transparent;
        border: none;
        padding: 0;
    }

    /* 移动端响应式 */
    @media (max-width: 768px) {
        .language-switcher {
            padding: 0 10px;
        }

        .lang-btn {
            padding: 6px 10px;
            font-size: 12px;
        }

        .lang-text {
            display: none;
        }

        .flag-icon {
            font-size: 18px;
        }
    }

    /* 深色主题支持 */
    [data-theme="dark"] .lang-toggle {
        background: rgba(255, 255, 255, 0.05);
        border-color: rgba(255, 255, 255, 0.1);
    }

    [data-theme="dark"] .lang-btn.active {
        background: rgba(255, 255, 255, 0.9);
        color: #1a1a1a;
    }
`;

// 注入CSS样式
function injectSwitcherStyles() {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = switcherStyles;
    document.head.appendChild(styleSheet);
}

// 初始化语言切换器
function initLanguageSwitcher() {
    injectSwitcherStyles();
    new LanguageSwitcher();
}

// 自动初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLanguageSwitcher);
} else {
    initLanguageSwitcher();
}

// 导出供外部使用
window.LanguageSwitcher = LanguageSwitcher;