/**
 * Header Navigation Component
 * 负责网站导航功能的核心JavaScript
 */

class HeaderNavigation {
    constructor() {
        this.mobileMenuButton = document.querySelector('.mobile-menu-toggle');
        this.mobileMenu = document.querySelector('.mobile-menu');
        this.dropdownToggles = document.querySelectorAll('.dropdown-toggle');
        this.navbar = document.querySelector('.navbar');
        this.searchToggle = document.querySelector('.search-toggle');
        this.searchForm = document.querySelector('.navbar-search');

        this.init();
    }

    init() {
        this.bindEvents();
        this.handleScroll();
        this.initDropdowns();
        this.initSearch();
    }

    bindEvents() {
        // Mobile menu toggle
        if (this.mobileMenuButton) {
            this.mobileMenuButton.addEventListener('click', () => this.toggleMobileMenu());
        }

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.navbar') && this.mobileMenu?.classList.contains('active')) {
                this.closeMobileMenu();
            }
        });

        // Handle window resize
        window.addEventListener('resize', () => this.handleResize());

        // Handle scroll for navbar effects
        window.addEventListener('scroll', () => this.handleScroll());

        // Escape key to close menus
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllMenus();
            }
        });
    }

    toggleMobileMenu() {
        if (!this.mobileMenu) return;

        const isActive = this.mobileMenu.classList.contains('active');

        if (isActive) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    }

    openMobileMenu() {
        if (!this.mobileMenu) return;

        this.mobileMenu.classList.add('active');
        this.mobileMenuButton?.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent body scroll

        // Animate menu items
        const menuItems = this.mobileMenu.querySelectorAll('.nav-item');
        menuItems.forEach((item, index) => {
            item.style.animationDelay = `${index * 0.1}s`;
            item.classList.add('animate-in');
        });
    }

    closeMobileMenu() {
        if (!this.mobileMenu) return;

        this.mobileMenu.classList.remove('active');
        this.mobileMenuButton?.classList.remove('active');
        document.body.style.overflow = '';

        // Reset animations
        const menuItems = this.mobileMenu.querySelectorAll('.nav-item');
        menuItems.forEach(item => {
            item.classList.remove('animate-in');
            item.style.animationDelay = '';
        });
    }

    initDropdowns() {
        this.dropdownToggles.forEach(toggle => {
            const dropdown = toggle.nextElementSibling;

            // Click to toggle dropdown
            toggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggleDropdown(toggle, dropdown);
            });

            // Hover effects for desktop
            const navItem = toggle.closest('.nav-item');
            if (navItem) {
                navItem.addEventListener('mouseenter', () => {
                    if (window.innerWidth > 768) {
                        this.showDropdown(toggle, dropdown);
                    }
                });

                navItem.addEventListener('mouseleave', () => {
                    if (window.innerWidth > 768) {
                        this.hideDropdown(toggle, dropdown);
                    }
                });
            }
        });
    }

    toggleDropdown(toggle, dropdown) {
        if (!dropdown) return;

        const isActive = dropdown.classList.contains('active');

        // Close all other dropdowns
        this.closeAllDropdowns();

        if (!isActive) {
            this.showDropdown(toggle, dropdown);
        }
    }

    showDropdown(toggle, dropdown) {
        if (!dropdown) return;

        dropdown.classList.add('active');
        toggle.classList.add('active');

        // Add animation
        dropdown.style.opacity = '0';
        dropdown.style.transform = 'translateY(-10px)';

        requestAnimationFrame(() => {
            dropdown.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            dropdown.style.opacity = '1';
            dropdown.style.transform = 'translateY(0)';
        });
    }

    hideDropdown(toggle, dropdown) {
        if (!dropdown) return;

        dropdown.style.opacity = '0';
        dropdown.style.transform = 'translateY(-10px)';

        setTimeout(() => {
            dropdown.classList.remove('active');
            toggle.classList.remove('active');
        }, 300);
    }

    closeAllDropdowns() {
        this.dropdownToggles.forEach(toggle => {
            const dropdown = toggle.nextElementSibling;
            if (dropdown) {
                this.hideDropdown(toggle, dropdown);
            }
        });
    }

    initSearch() {
        if (this.searchToggle && this.searchForm) {
            this.searchToggle.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleSearch();
            });

            // Close search when clicking outside
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.navbar-search') &&
                    !e.target.closest('.search-toggle') &&
                    this.searchForm.classList.contains('active')) {
                    this.closeSearch();
                }
            });

            // Handle search form submission
            const searchInput = this.searchForm.querySelector('input[type="search"]');
            if (searchInput) {
                searchInput.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        this.handleSearch(searchInput.value);
                    }
                });
            }
        }
    }

    toggleSearch() {
        if (!this.searchForm) return;

        const isActive = this.searchForm.classList.contains('active');

        if (isActive) {
            this.closeSearch();
        } else {
            this.openSearch();
        }
    }

    openSearch() {
        if (!this.searchForm) return;

        this.searchForm.classList.add('active');
        const searchInput = this.searchForm.querySelector('input[type="search"]');
        if (searchInput) {
            setTimeout(() => searchInput.focus(), 300);
        }
    }

    closeSearch() {
        if (!this.searchForm) return;

        this.searchForm.classList.remove('active');
    }

    handleSearch(query) {
        if (!query.trim()) return;

        // 实现搜索逻辑
        console.log('Searching for:', query);

        // 这里可以添加实际的搜索功能
        // 例如：window.location.href = `/search?q=${encodeURIComponent(query)}`;
    }

    handleScroll() {
        if (!this.navbar) return;

        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // Add/remove scrolled class for styling
        if (scrollTop > 100) {
            this.navbar.classList.add('scrolled');
        } else {
            this.navbar.classList.remove('scrolled');
        }

        // Hide/show navbar on scroll (optional)
        if (scrollTop > this.lastScrollTop && scrollTop > 200) {
            this.navbar.classList.add('navbar-hidden');
        } else {
            this.navbar.classList.remove('navbar-hidden');
        }

        this.lastScrollTop = scrollTop;
    }

    handleResize() {
        // Close mobile menu on resize to desktop
        if (window.innerWidth > 768) {
            this.closeMobileMenu();
            this.closeAllDropdowns();
        }
    }

    closeAllMenus() {
        this.closeMobileMenu();
        this.closeAllDropdowns();
        this.closeSearch();
    }

    // Public method to update active navigation item
    setActiveNavItem(pageId) {
        const navItems = document.querySelectorAll('.nav-link');
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('data-page') === pageId) {
                item.classList.add('active');
            }
        });
    }

    // Method to add new navigation items dynamically
    addNavItem(item) {
        const navList = document.querySelector('.navbar-nav');
        if (navList && item) {
            const li = document.createElement('li');
            li.className = 'nav-item';
            li.innerHTML = `<a href="${item.href}" class="nav-link">${item.text}</a>`;
            navList.appendChild(li);
        }
    }

    // Method to update navigation badge counts
    updateBadge(selector, count) {
        const badge = document.querySelector(selector);
        if (badge) {
            badge.textContent = count;
            badge.style.display = count > 0 ? 'inline-block' : 'none';
        }
    }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.headerNavigation = new HeaderNavigation();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HeaderNavigation;
}