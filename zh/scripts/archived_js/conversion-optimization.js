// Conversion Optimization JavaScript
// Handles lead capture popup, CTA buttons, and other conversion features

document.addEventListener('DOMContentLoaded', function() {
    initConversionOptimization();
});

function initConversionOptimization() {
    // Initialize lead popup functionality
    initLeadPopup();

    // Initialize exit intent detection
    initExitIntent();

    // Initialize scroll-based popup trigger
    initScrollTrigger();

    // Initialize form validation
    initFormValidation();

    // Initialize analytics tracking
    initAnalyticsTracking();
}

// Lead Popup Functions
function initLeadPopup() {
    const popup = document.getElementById('leadPopup');
    const form = document.getElementById('leadForm');

    if (!popup || !form) return;

    // Close popup when clicking overlay
    popup.addEventListener('click', function(e) {
        if (e.target === popup) {
            closeLead();
        }
    });

    // Handle form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        handleLeadSubmission();
    });

    // Prevent popup from showing if already shown today
    if (localStorage.getItem('leadPopupShown') === getTodayString()) {
        return;
    }
}

function showLead() {
    const popup = document.getElementById('leadPopup');
    if (popup) {
        popup.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Track popup view
        trackEvent('lead_popup', 'show', 'conversion_optimization');
    }
}

function closeLead() {
    const popup = document.getElementById('leadPopup');
    if (popup) {
        popup.classList.remove('active');
        document.body.style.overflow = '';

        // Mark as shown today to prevent spam
        localStorage.setItem('leadPopupShown', getTodayString());

        // Track popup close
        trackEvent('lead_popup', 'close', 'conversion_optimization');
    }
}

function handleLeadSubmission() {
    const form = document.getElementById('leadForm');
    const submitBtn = form.querySelector('.lead-submit-btn');
    const originalText = submitBtn.innerHTML;

    // Show loading state
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    submitBtn.disabled = true;

    // Collect form data
    const formData = new FormData(form);
    const leadData = {
        name: formData.get('name'),
        email: formData.get('email'),
        company: formData.get('company'),
        country: formData.get('country'),
        industry: formData.get('industry'),
        timestamp: new Date().toISOString(),
        source: 'homepage_lead_popup'
    };

    // Simulate API call (replace with actual endpoint)
    setTimeout(() => {
        // Show success message
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Success! Check your email';
        submitBtn.style.background = '#4caf50';

        // Track successful lead capture
        trackEvent('lead_capture', 'success', 'conversion_optimization', leadData);

        // Store lead data locally for demo purposes
        storeLead(leadData);

        // Close popup after delay
        setTimeout(() => {
            closeLead();

            // Simulate PDF download
            downloadPDFCatalog();

            // Reset form
            form.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.style.background = '';
            submitBtn.disabled = false;
        }, 2000);
    }, 1500);
}

// Exit Intent Detection
function initExitIntent() {
    let exitIntentShown = false;

    document.addEventListener('mouseleave', function(e) {
        if (e.clientY <= 0 && !exitIntentShown) {
            // Mouse left the top of the window
            if (!localStorage.getItem('leadPopupShown')) {
                showLead();
                exitIntentShown = true;
            }
        }
    });
}

// Scroll-based Trigger
function initScrollTrigger() {
    let scrollTriggerShown = false;

    window.addEventListener('scroll', function() {
        const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;

        if (scrollPercent > 70 && !scrollTriggerShown) {
            // User scrolled 70% of the page
            if (!localStorage.getItem('leadPopupShown')) {
                setTimeout(() => {
                    showLead();
                    scrollTriggerShown = true;
                }, 2000); // 2 second delay
            }
        }
    });
}

// Form Validation
function initFormValidation() {
    const form = document.getElementById('leadForm');
    if (!form) return;

    const inputs = form.querySelectorAll('input[required], select[required]');

    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
    });
}

function validateField(e) {
    const field = e.target;
    const value = field.value.trim();

    // Remove existing error styling
    field.classList.remove('error');

    if (field.hasAttribute('required') && !value) {
        showFieldError(field, 'This field is required');
        return false;
    }

    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showFieldError(field, 'Please enter a valid email address');
            return false;
        }
    }

    return true;
}

function showFieldError(field, message) {
    field.classList.add('error');

    // Remove existing error message
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }

    // Add error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.color = '#f44336';
    errorDiv.style.fontSize = '12px';
    errorDiv.style.marginTop = '5px';

    field.parentNode.appendChild(errorDiv);
}

function clearFieldError(e) {
    const field = e.target;
    field.classList.remove('error');

    const errorDiv = field.parentNode.querySelector('.field-error');
    if (errorDiv) {
        errorDiv.remove();
    }
}

// Analytics Tracking
function initAnalyticsTracking() {
    // Track CTA button clicks
    const ctaButton = document.querySelector('.fixed-cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', function() {
            trackEvent('cta_button', 'click', 'fixed_top_right');
        });
    }

    // Track WhatsApp button clicks
    const whatsappButton = document.querySelector('.whatsapp-floating');
    if (whatsappButton) {
        whatsappButton.addEventListener('click', function() {
            trackEvent('whatsapp_button', 'click', 'floating_bottom_right');
        });
    }

    // Track page engagement
    trackPageEngagement();
}

function trackEvent(category, action, label, data = null) {
    // Google Analytics 4 tracking (replace with your tracking ID)
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            event_category: category,
            event_label: label,
            custom_data: data
        });
    }

    // Console log for debugging
    console.log('Event tracked:', { category, action, label, data });
}

function trackPageEngagement() {
    let startTime = Date.now();
    let maxScroll = 0;

    window.addEventListener('scroll', function() {
        const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
        maxScroll = Math.max(maxScroll, scrollPercent);
    });

    window.addEventListener('beforeunload', function() {
        const timeOnPage = Date.now() - startTime;
        trackEvent('page_engagement', 'time_on_page', 'homepage', {
            time_seconds: Math.round(timeOnPage / 1000),
            max_scroll_percent: Math.round(maxScroll)
        });
    });
}

// Utility Functions
function getTodayString() {
    return new Date().toISOString().split('T')[0];
}

function storeLead(leadData) {
    let leads = JSON.parse(localStorage.getItem('captured_leads') || '[]');
    leads.push(leadData);
    localStorage.setItem('captured_leads', JSON.stringify(leads));
}

function downloadPDFCatalog() {
    // Simulate PDF download
    // In a real implementation, this would trigger an actual file download
    const link = document.createElement('a');
    link.href = '#'; // Replace with actual PDF URL
    link.download = 'yuandake-refractory-catalog.pdf';

    // Show download notification
    showNotification('Your catalog download will begin shortly. Check your email for the complete product guide!');

    console.log('PDF catalog download simulated');
}

function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4caf50;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        max-width: 300px;
        font-size: 14px;
        line-height: 1.4;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Remove after delay
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 4000);
}

// Product Filter Functions (for products page)
function initProductFilter() {
    const filterForm = document.querySelector('.product-filter-bar');
    if (!filterForm) return;

    const industryFilter = document.getElementById('industryFilter');
    const temperatureFilter = document.getElementById('temperatureFilter');
    const materialFilter = document.getElementById('materialFilter');
    const searchInput = document.getElementById('productSearch');

    // Add event listeners
    if (industryFilter) industryFilter.addEventListener('change', filterProducts);
    if (temperatureFilter) temperatureFilter.addEventListener('change', filterProducts);
    if (materialFilter) materialFilter.addEventListener('change', filterProducts);
    if (searchInput) searchInput.addEventListener('input', debounce(filterProducts, 300));
}

function filterProducts() {
    const industry = document.getElementById('industryFilter')?.value || '';
    const temperature = document.getElementById('temperatureFilter')?.value || '';
    const material = document.getElementById('materialFilter')?.value || '';
    const search = document.getElementById('productSearch')?.value.toLowerCase() || '';

    const productCards = document.querySelectorAll('.product-card, .product-item');

    productCards.forEach(card => {
        let show = true;

        // Check industry filter
        if (industry && !card.dataset.industry?.includes(industry)) {
            show = false;
        }

        // Check temperature filter
        if (temperature && !card.dataset.temperature?.includes(temperature)) {
            show = false;
        }

        // Check material filter
        if (material && !card.dataset.material?.includes(material)) {
            show = false;
        }

        // Check search filter
        if (search) {
            const cardText = card.textContent.toLowerCase();
            if (!cardText.includes(search)) {
                show = false;
            }
        }

        // Show/hide card
        card.style.display = show ? '' : 'none';
    });

    // Track filter usage
    trackEvent('product_filter', 'filter_applied', 'products_page', {
        industry, temperature, material, search
    });
}

function clearFilters() {
    document.getElementById('industryFilter').value = '';
    document.getElementById('temperatureFilter').value = '';
    document.getElementById('materialFilter').value = '';
    document.getElementById('productSearch').value = '';

    // Show all products
    const productCards = document.querySelectorAll('.product-card, .product-item');
    productCards.forEach(card => {
        card.style.display = '';
    });

    trackEvent('product_filter', 'filters_cleared', 'products_page');
}

// Utility function for debouncing
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Datasheet Download Functions
function downloadDatasheet(productId) {
    // Track datasheet download
    trackEvent('datasheet_download', 'click', productId);

    // Show notification
    showNotification(`Downloading ${productId} technical datasheet...`);

    // Simulate download (replace with actual file URLs)
    const link = document.createElement('a');
    link.href = '#'; // Replace with actual datasheet URL
    link.download = `${productId}-datasheet.pdf`;

    // In a real implementation, you would have actual PDF files
    console.log(`Downloading datasheet for: ${productId}`);

    // Optionally trigger lead capture for detailed datasheets
    setTimeout(() => {
        if (!localStorage.getItem('leadPopupShown')) {
            showNotification('Want complete technical specifications? Get our full catalog!');
            setTimeout(() => {
                showLead();
            }, 2000);
        }
    }, 3000);
}

// Initialize filter functionality when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initProductFilter();
});

// Case Study Functions
function openCaseStudy(caseId) {
    // Track case study click
    trackEvent('case_study', 'click', caseId);

    // In a real implementation, this would navigate to a dedicated case study page
    // For now, we'll show a notification and optionally trigger lead capture
    showNotification(`Opening detailed case study: ${caseId}`);

    // Simulate opening case study (replace with actual navigation)
    console.log(`Opening case study: ${caseId}`);

    // Optionally trigger lead capture for case study access
    setTimeout(() => {
        if (!localStorage.getItem('leadPopupShown')) {
            showNotification('Want to see more detailed case studies? Download our complete portfolio!');
            setTimeout(() => {
                showLead();
            }, 2000);
        }
    }, 3000);
}

// Dashboard Tooltips and Production Numbers
function initDashboardFeatures() {
    // Add production numbers to dashboard if it exists
    const dashboardSection = document.querySelector('.dashboard-section, .real-time-dashboard');
    if (dashboardSection) {
        addProductionNumbers(dashboardSection);
        addMapTooltips(dashboardSection);
    }
}

function addProductionNumbers(dashboardSection) {
    // Create production dashboard
    const productionDashboard = document.createElement('div');
    productionDashboard.className = 'production-dashboard';
    productionDashboard.innerHTML = `
        <h3 class="production-title">Last Week Production Data</h3>
        <div class="production-stats">
            <div class="production-stat">
                <span class="value" data-target="4250">0</span>
                <span class="label">Tons Produced</span>
                <span class="change">+12% vs last week</span>
            </div>
            <div class="production-stat">
                <span class="value" data-target="127">0</span>
                <span class="label">Orders Shipped</span>
                <span class="change">+8% vs last week</span>
            </div>
            <div class="production-stat">
                <span class="value" data-target="18">0</span>
                <span class="label">Countries Served</span>
                <span class="change">+2 new markets</span>
            </div>
            <div class="production-stat">
                <span class="value" data-target="99.7">0</span>
                <span class="label">Quality Rate %</span>
                <span class="change">+0.3% improvement</span>
            </div>
        </div>
    `;

    // Insert after dashboard section
    dashboardSection.insertAdjacentElement('afterend', productionDashboard);

    // Animate numbers when in view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateNumbers(entry.target);
                observer.unobserve(entry.target);
            }
        });
    });

    observer.observe(productionDashboard);
}

function animateNumbers(dashboard) {
    const numbers = dashboard.querySelectorAll('[data-target]');
    numbers.forEach(number => {
        const target = parseFloat(number.dataset.target);
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }

            // Format number appropriately
            if (target < 100) {
                number.textContent = current.toFixed(1);
            } else {
                number.textContent = Math.floor(current).toLocaleString();
            }
        }, 16);
    });
}

function addMapTooltips(dashboardSection) {
    // Find map points and add tooltips
    const mapPoints = dashboardSection.querySelectorAll('.map-point, .point');

    const tooltipData = {
        'china': 'China: 2,400 tons/month',
        'usa': 'USA: 850 tons/month',
        'germany': 'Germany: 650 tons/month',
        'india': 'India: 920 tons/month',
        'brazil': 'Brazil: 480 tons/month',
        'australia': 'Australia: 320 tons/month'
    };

    mapPoints.forEach((point, index) => {
        const countries = Object.keys(tooltipData);
        const country = countries[index % countries.length];
        const tooltipText = tooltipData[country];

        // Create tooltip element
        const tooltip = document.createElement('div');
        tooltip.className = 'map-tooltip';
        tooltip.textContent = tooltipText;

        point.appendChild(tooltip);
        point.style.cursor = 'pointer';

        // Add click event for more details
        point.addEventListener('click', () => {
            trackEvent('map_point', 'click', country);
            showNotification(`${country} market details: ${tooltipText}`);
        });
    });
}

// Initialize dashboard features when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initProductFilter();
    initDashboardFeatures();
});

// Global functions for HTML onclick handlers
window.showLead = showLead;
window.closeLead = closeLead;
window.clearFilters = clearFilters;
window.downloadDatasheet = downloadDatasheet;
window.filterProducts = filterProducts;
window.openCaseStudy = openCaseStudy;