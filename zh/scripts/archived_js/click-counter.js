/**
 * 产品页面点击计数器功能
 * Product Page Click Counter Functionality
 */

(function() {
    'use strict';

    // 配置参数
    const CONFIG = {
        STORAGE_KEY: 'ydk_product_stats',
        INCREMENT_DELAY: 1000, // 1秒后增加浏览量
        ANIMATION_DURATION: 500,
        API_ENDPOINT: null // 可以配置为实际的API端点
    };

    // 获取当前产品ID（从页面URL或其他标识符）
    function getCurrentProductId() {
        const path = window.location.pathname;
        const filename = path.split('/').pop().replace('.html', '');
        return filename || 'unknown-product';
    }

    // 从localStorage获取产品统计数据
    function getProductStats(productId) {
        const allStats = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEY) || '{}');
        return allStats[productId] || {
            views: Math.floor(Math.random() * 1000) + 500, // 初始随机浏览量
            inquiries: Math.floor(Math.random() * 50) + 20, // 初始随机咨询量
            rating: (Math.random() * 1.5 + 3.5).toFixed(1), // 3.5-5.0评分
            lastVisit: Date.now()
        };
    }

    // 保存产品统计数据到localStorage
    function saveProductStats(productId, stats) {
        const allStats = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEY) || '{}');
        allStats[productId] = stats;
        localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(allStats));
    }

    // 增加浏览量
    function incrementViews(productId) {
        const stats = getProductStats(productId);

        // 检查是否应该增加浏览量（避免重复刷新页面时多次计数）
        const timeSinceLastVisit = Date.now() - stats.lastVisit;
        if (timeSinceLastVisit > 60000) { // 1分钟内不重复计数
            stats.views += 1;
            stats.lastVisit = Date.now();
            saveProductStats(productId, stats);
        }

        return stats;
    }

    // 增加咨询量
    function incrementInquiries(productId) {
        const stats = getProductStats(productId);
        stats.inquiries += 1;
        saveProductStats(productId, stats);
        updateDisplay(productId, stats);
        return stats;
    }

    // 数字动画效果
    function animateNumber(element, targetNumber) {
        if (!element) return;

        const startNumber = parseInt(element.textContent.replace(/[^0-9]/g, '')) || 0;
        const difference = targetNumber - startNumber;
        const duration = CONFIG.ANIMATION_DURATION;
        const increment = difference / (duration / 16); // 60fps
        let current = startNumber;

        const timer = setInterval(() => {
            current += increment;
            if ((increment > 0 && current >= targetNumber) || (increment < 0 && current <= targetNumber)) {
                current = targetNumber;
                clearInterval(timer);
            }

            // 格式化数字显示（添加千位分隔符）
            const formattedNumber = Math.floor(current).toLocaleString();
            element.textContent = formattedNumber;
        }, 16);
    }

    // 更新页面显示
    function updateDisplay(productId, stats) {
        // 更新浏览量
        const viewCountElement = document.getElementById('viewCount');
        if (viewCountElement) {
            animateNumber(viewCountElement, stats.views);
        }

        // 更新咨询量
        const inquiryCountElement = document.getElementById('inquiryCount');
        if (inquiryCountElement) {
            animateNumber(inquiryCountElement, stats.inquiries);
        }

        // 更新评分显示
        updateRatingDisplay(stats.rating);

        // 更新热度条
        updatePopularityBars(stats.views);
    }

    // 更新评分显示
    function updateRatingDisplay(rating) {
        const ratingNumberElement = document.querySelector('.rating-number');
        if (ratingNumberElement) {
            ratingNumberElement.textContent = rating;
        }

        // 更新星级显示
        const stars = document.querySelectorAll('.rating-stars i');
        const ratingValue = parseFloat(rating);

        stars.forEach((star, index) => {
            star.classList.remove('filled');
            if (index < Math.floor(ratingValue)) {
                star.classList.add('filled');
            } else if (index < ratingValue && ratingValue % 1 >= 0.5) {
                star.classList.add('filled');
            }
        });
    }

    // 更新热度条
    function updatePopularityBars(views) {
        const bars = document.querySelectorAll('.popularity-bar');
        const maxViews = 2000; // 假设最大浏览量
        const activeBarCount = Math.min(5, Math.ceil((views / maxViews) * 5));

        bars.forEach((bar, index) => {
            bar.classList.toggle('active', index < activeBarCount);
        });
    }

    // 绑定事件监听器
    function bindEventListeners(productId) {
        // 咨询按钮点击事件
        const inquiryButtons = document.querySelectorAll('.btn-primary, .contact-btn, .inquiry-btn');
        inquiryButtons.forEach(button => {
            button.addEventListener('click', () => {
                incrementInquiries(productId);

                // 显示反馈动画
                showClickFeedback(button);
            });
        });

        // 技术参数查看事件
        const techButtons = document.querySelectorAll('.btn-secondary, [href="#tech-specs"]');
        techButtons.forEach(button => {
            button.addEventListener('click', () => {
                // 记录用户查看详细信息的行为
                trackDetailedView(productId);
            });
        });

        // 产品图片点击事件
        const productImages = document.querySelectorAll('.product-gallery img');
        productImages.forEach(img => {
            img.addEventListener('click', () => {
                trackImageView(productId);
            });
        });

        // 页面滚动事件（用于跟踪用户参与度）
        let scrollDepth = 0;
        window.addEventListener('scroll', throttle(() => {
            const scrollPercentage = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
            if (scrollPercentage > scrollDepth) {
                scrollDepth = scrollPercentage;
                if (scrollDepth % 25 === 0) { // 每25%记录一次
                    trackScrollDepth(productId, scrollDepth);
                }
            }
        }, 1000));
    }

    // 节流函数
    function throttle(func, delay) {
        let lastTime = 0;
        return function(...args) {
            const now = Date.now();
            if (now - lastTime >= delay) {
                lastTime = now;
                func.apply(this, args);
            }
        };
    }

    // 显示点击反馈动画
    function showClickFeedback(element) {
        element.style.transform = 'scale(0.95)';
        element.style.transition = 'transform 0.1s ease';

        setTimeout(() => {
            element.style.transform = 'scale(1)';
        }, 100);

        // 创建浮动提示
        const feedback = document.createElement('div');
        feedback.className = 'click-feedback';
        feedback.textContent = '+1 咨询';
        feedback.style.cssText = `
            position: absolute;
            top: -30px;
            right: 0;
            background: #4CAF50;
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: bold;
            opacity: 0;
            transform: translateY(10px);
            transition: all 0.3s ease;
            pointer-events: none;
            z-index: 1000;
        `;

        element.style.position = 'relative';
        element.appendChild(feedback);

        // 动画显示
        setTimeout(() => {
            feedback.style.opacity = '1';
            feedback.style.transform = 'translateY(0)';
        }, 10);

        // 动画隐藏
        setTimeout(() => {
            feedback.style.opacity = '0';
            feedback.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                if (feedback.parentNode) {
                    feedback.parentNode.removeChild(feedback);
                }
            }, 300);
        }, 1500);
    }

    // 跟踪详细查看
    function trackDetailedView(productId) {
        console.log(`Detailed view tracked for product: ${productId}`);
        // 这里可以发送数据到服务器
    }

    // 跟踪图片查看
    function trackImageView(productId) {
        console.log(`Image view tracked for product: ${productId}`);
        // 这里可以发送数据到服务器
    }

    // 跟踪滚动深度
    function trackScrollDepth(productId, depth) {
        console.log(`Scroll depth ${depth}% tracked for product: ${productId}`);
        // 这里可以发送数据到服务器
    }

    // 初始化
    function init() {
        const productId = getCurrentProductId();

        // 延迟增加浏览量（确保不是机器人访问）
        setTimeout(() => {
            const stats = incrementViews(productId);
            updateDisplay(productId, stats);
        }, CONFIG.INCREMENT_DELAY);

        // 绑定事件监听器
        bindEventListeners(productId);

        // 每隔一定时间模拟其他用户的访问（仅用于演示）
        if (Math.random() > 0.7) { // 30%概率
            setTimeout(() => {
                const stats = getProductStats(productId);
                stats.views += Math.floor(Math.random() * 3) + 1;
                saveProductStats(productId, stats);
                updateDisplay(productId, stats);
            }, Math.random() * 10000 + 5000); // 5-15秒后
        }
    }

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // 导出全局函数（供其他脚本使用）
    window.ProductClickCounter = {
        getCurrentProductId,
        getProductStats,
        incrementViews,
        incrementInquiries,
        updateDisplay
    };

})();