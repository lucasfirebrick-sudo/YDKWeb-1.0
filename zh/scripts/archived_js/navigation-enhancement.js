// Enhanced Navigation JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializePageTransitions();
    initializeSmoothScrolling();
    initializeMobileNavigation();
});

function initializeNavigation() {
    // Add smooth hover effects and transitions
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });

        link.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Enhanced dropdown functionality
    const dropdowns = document.querySelectorAll('.dropdown');

    dropdowns.forEach(dropdown => {
        const menu = dropdown.querySelector('.dropdown-menu');
        let timeoutId;

        dropdown.addEventListener('mouseenter', function() {
            clearTimeout(timeoutId);
            menu.style.opacity = '1';
            menu.style.visibility = 'visible';
            menu.style.transform = 'translateY(0)';
        });

        dropdown.addEventListener('mouseleave', function() {
            timeoutId = setTimeout(() => {
                menu.style.opacity = '0';
                menu.style.visibility = 'hidden';
                menu.style.transform = 'translateY(-10px)';
            }, 150);
        });
    });

    // Enhanced submenu functionality
    const submenus = document.querySelectorAll('.dropdown-submenu');

    submenus.forEach(submenu => {
        const menu = submenu.querySelector('.submenu');
        let timeoutId;

        submenu.addEventListener('mouseenter', function() {
            clearTimeout(timeoutId);
            if (menu) {
                menu.style.opacity = '1';
                menu.style.visibility = 'visible';
                menu.style.transform = 'translateX(0)';
            }
        });

        submenu.addEventListener('mouseleave', function() {
            timeoutId = setTimeout(() => {
                if (menu) {
                    menu.style.opacity = '0';
                    menu.style.visibility = 'hidden';
                    menu.style.transform = 'translateX(-10px)';
                }
            }, 150);
        });
    });
}

function initializePageTransitions() {
    // Add loading animation to page content
    const pageContent = document.querySelector('main') || document.querySelector('.main-content');

    if (pageContent) {
        pageContent.classList.add('page-transition');

        setTimeout(() => {
            pageContent.classList.add('loaded');
        }, 100);
    }

    // Smooth navigation between pages
    const internalLinks = document.querySelectorAll('a[href^="/"], a[href^="./"], a[href^="../"]');

    internalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            // Skip if it's a hash link or external
            if (href.startsWith('#') || href.startsWith('http')) return;

            e.preventDefault();

            // Add fade out effect
            if (pageContent) {
                pageContent.style.opacity = '0';
                pageContent.style.transform = 'translateY(20px)';
            }

            // Navigate after animation
            setTimeout(() => {
                window.location.href = href;
            }, 300);
        });
    });
}

function initializeSmoothScrolling() {
    // Smooth scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            if (href === '#') return;

            const target = document.querySelector(href);

            if (target) {
                e.preventDefault();

                const offsetTop = target.offsetTop - 80; // Account for fixed navbar

                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });

                // Update URL without jumping
                history.pushState(null, null, href);
            }
        });
    });
}

function initializeMobileNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Mobile dropdown toggle
        const mobileDropdowns = document.querySelectorAll('.nav-item.dropdown');

        mobileDropdowns.forEach(dropdown => {
            const link = dropdown.querySelector('.nav-link');

            link.addEventListener('click', function(e) {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    dropdown.classList.toggle('active');
                }
            });
        });

        // Mobile submenu toggle
        const mobileSubmenus = document.querySelectorAll('.dropdown-submenu');

        mobileSubmenus.forEach(submenu => {
            const link = submenu.querySelector('a');

            link.addEventListener('click', function(e) {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    submenu.classList.toggle('active');
                }
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }
}

// Initialize product quick view functionality
function quickView(productSlug) {
    // Create modal for quick view
    const modal = document.createElement('div');
    modal.className = 'modal-backdrop';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>产品快速预览</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <iframe src="products/${productSlug}.html" width="100%" height="500px" frameborder="0"></iframe>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Close modal functionality
    const closeBtn = modal.querySelector('.modal-close');
    closeBtn.addEventListener('click', () => {
        document.body.removeChild(modal);
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}

// Add comparison functionality
let comparisonList = [];

function addToComparison(productSlug) {
    if (comparisonList.length >= 3) {
        alert('最多只能比较3个产品');
        return;
    }

    if (!comparisonList.includes(productSlug)) {
        comparisonList.push(productSlug);
        updateComparisonUI();
        showNotification('产品已添加到比较列表');
    } else {
        showNotification('该产品已在比较列表中');
    }
}

function updateComparisonUI() {
    // Create or update comparison floating widget
    let widget = document.querySelector('.comparison-widget');

    if (!widget && comparisonList.length > 0) {
        widget = document.createElement('div');
        widget.className = 'comparison-widget';
        widget.innerHTML = `
            <div class="comparison-content">
                <span class="comparison-count">${comparisonList.length}</span>
                <span class="comparison-text">产品对比</span>
                <button class="comparison-view">查看对比</button>
            </div>
        `;
        document.body.appendChild(widget);

        widget.querySelector('.comparison-view').addEventListener('click', () => {
            showComparison();
        });
    } else if (widget) {
        widget.querySelector('.comparison-count').textContent = comparisonList.length;
    }

    if (comparisonList.length === 0 && widget) {
        widget.remove();
    }
}

function showComparison() {
    // Implement comparison view
    console.log('Showing comparison for:', comparisonList);
}

function toggleFavorite(productSlug) {
    // Implement favorites functionality
    showNotification('收藏功能正在开发中');
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #d32f2f;
        color: white;
        padding: 12px 20px;
        border-radius: 5px;
        z-index: 10000;
        animation: slideInRight 0.3s ease;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); }
        to { transform: translateX(0); }
    }

    @keyframes slideOutRight {
        from { transform: translateX(0); }
        to { transform: translateX(100%); }
    }

    .comparison-widget {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #d32f2f;
        color: white;
        padding: 15px 20px;
        border-radius: 25px;
        z-index: 9999;
        cursor: pointer;
        box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        animation: slideInUp 0.3s ease;
    }

    .comparison-content {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .comparison-count {
        background: white;
        color: #d32f2f;
        border-radius: 50%;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        font-size: 12px;
    }

    .comparison-view {
        background: transparent;
        border: 1px solid white;
        color: white;
        padding: 5px 10px;
        border-radius: 15px;
        cursor: pointer;
        font-size: 12px;
    }

    .modal-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        z-index: 9998;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .modal-content {
        background: white;
        border-radius: 10px;
        padding: 20px;
        max-width: 90%;
        max-height: 90%;
        overflow: auto;
    }

    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        padding-bottom: 10px;
        border-bottom: 1px solid #eee;
    }

    .modal-close {
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: #999;
    }
`;

document.head.appendChild(style);