/**
 * Language Switcher Component
 * Handles switching between Chinese (zh/) and English (en/) versions
 */

class LanguageSwitcher {
    constructor() {
        this.currentLang = this.detectCurrentLanguage();
        this.init();
    }

    /**
     * Detect current language based on URL path
     */
    detectCurrentLanguage() {
        const path = window.location.pathname;
        if (path.includes('/en/')) {
            return 'en';
        } else if (path.includes('/zh/')) {
            return 'zh';
        }
        // Default detection based on domain or folder structure
        return 'en'; // Default to English for en folder
    }

    /**
     * Initialize the language switcher
     */
    init() {
        this.createSwitcherElement();
        this.attachEventListeners();
        this.updateSwitcherState();
    }

    /**
     * Create the language switcher HTML element
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

        // Insert switcher into page (try multiple locations)
        const navbarContainer = document.querySelector('.navbar .container');
        const headerContainer = document.querySelector('header .container');
        const bodyElement = document.body;

        if (navbarContainer) {
            navbarContainer.insertAdjacentHTML('beforeend', switcherHTML);
        } else if (headerContainer) {
            headerContainer.insertAdjacentHTML('beforeend', switcherHTML);
        } else {
            // Fallback: create a fixed position switcher
            const fixedSwitcher = document.createElement('div');
            fixedSwitcher.className = 'language-switcher-fixed';
            fixedSwitcher.innerHTML = switcherHTML;
            bodyElement.appendChild(fixedSwitcher);
        }
    }

    /**
     * Attach event listeners to language buttons
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
     * Switch to the specified language
     */
    switchLanguage(targetLang) {
        if (targetLang === this.currentLang) {
            return; // Already in target language
        }

        const currentPath = window.location.pathname;
        const currentSearch = window.location.search;
        const currentHash = window.location.hash;

        let newPath;

        if (targetLang === 'zh') {
            // Switch to Chinese version (zh/)
            if (currentPath.includes('/en/')) {
                newPath = currentPath.replace('/en/', '/zh/');
            } else {
                newPath = '/zh/' + currentPath.split('/').pop();
            }
        } else {
            // Switch to English version (en/)
            if (currentPath.includes('/zh/')) {
                newPath = currentPath.replace('/zh/', '/en/');
            } else {
                newPath = '/en/' + currentPath.split('/').pop();
            }
        }

        // Construct full URL
        const newUrl = window.location.origin + newPath + currentSearch + currentHash;

        // Navigate to new language version
        window.location.href = newUrl;
    }

    /**
     * Update the visual state of the switcher
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
     * Get the equivalent page URL in the other language
     */
    getAlternateLanguageUrl() {
        const alternateLang = this.currentLang === 'en' ? 'zh' : 'en';
        const currentPath = window.location.pathname;

        if (alternateLang === 'zh') {
            return currentPath.replace('/en/', '/zh/');
        } else {
            return currentPath.replace('/zh/', '/en/');
        }
    }
}

// CSS Styles for Language Switcher
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

    /* Fixed position fallback */
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

    /* Mobile responsive */
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

        /* Fix: Move language switcher down to avoid blocking navbar */
        .language-switcher-fixed {
            top: 95px !important;
            right: 15px;
        }
    }

    /* Dark theme support */
    [data-theme="dark"] .lang-toggle {
        background: rgba(255, 255, 255, 0.05);
        border-color: rgba(255, 255, 255, 0.1);
    }

    [data-theme="dark"] .lang-btn.active {
        background: rgba(255, 255, 255, 0.9);
        color: #1a1a1a;
    }
`;

// Inject CSS styles
function injectSwitcherStyles() {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = switcherStyles;
    document.head.appendChild(styleSheet);
}

// Initialize when DOM is ready
function initLanguageSwitcher() {
    injectSwitcherStyles();
    new LanguageSwitcher();
}

// Auto-initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLanguageSwitcher);
} else {
    initLanguageSwitcher();
}

// Export for external use
window.LanguageSwitcher = LanguageSwitcher;