// Product Filter Functionality
document.addEventListener('DOMContentLoaded', function() {
    const filterTabs = document.querySelectorAll('.filter-tab');
    const productCards = document.querySelectorAll('.product-card');
    const loadMoreBtn = document.querySelector('.btn-load-more');
    const productsCount = document.querySelector('.products-count');

    let currentCategory = 'all';
    let visibleCount = 6;
    const totalProducts = productCards.length;

    // Initialize filter functionality
    initializeFilters();
    updateProductsDisplay();

    function initializeFilters() {
        filterTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                const category = this.dataset.category;

                // Update active tab
                filterTabs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');

                // Filter products
                currentCategory = category;
                visibleCount = 6; // Reset visible count
                filterProducts(category);
                updateProductsDisplay();
            });
        });

        // Load more button
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', function() {
                visibleCount += 6;
                updateProductsDisplay();
            });
        }
    }

    function filterProducts(category) {
        productCards.forEach(card => {
            if (category === 'all' || card.dataset.category === category) {
                card.style.display = 'block';
                card.classList.add('filtered-visible');
            } else {
                card.style.display = 'none';
                card.classList.remove('filtered-visible');
            }
        });
    }

    function updateProductsDisplay() {
        const visibleCards = document.querySelectorAll('.product-card.filtered-visible');
        const filteredCount = visibleCards.length;

        // Hide/show cards based on visible count
        visibleCards.forEach((card, index) => {
            if (index < visibleCount) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });

        // Update products count
        if (productsCount) {
            const actualVisible = Math.min(visibleCount, filteredCount);
            productsCount.textContent = `显示 ${actualVisible} 个产品，共 ${filteredCount} 个产品`;
        }

        // Show/hide load more button
        if (loadMoreBtn) {
            if (visibleCount >= filteredCount) {
                loadMoreBtn.style.display = 'none';
            } else {
                loadMoreBtn.style.display = 'block';
            }
        }
    }

    // Add smooth scroll animation for better UX
    function smoothScrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    // Add hover effects for product cards
    productCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 10px 30px rgba(0,0,0,0.15)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
        });
    });
});