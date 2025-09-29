// 三代传承严肃时间轴分层动画效果
document.addEventListener('DOMContentLoaded', function() {
    const timelineItems = document.querySelectorAll('.heritage-timeline .timeline-item');
    const timelineSection = document.querySelector('.heritage-timeline');

    // 滚动观察器配置
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -80px 0px'
    };

    // 分步动画函数：先年代，再标题，再说明文字
    function animateTimelineItem(item, itemIndex) {
        const dot = item.querySelector('.timeline-dot');
        const generationNumber = item.querySelector('.generation-number');
        const year = item.querySelector('.timeline-year');
        const title = item.querySelector('.generation-title');
        const descriptionLines = item.querySelectorAll('.description-line');

        // 基础延迟时间，每个项目错开
        const baseDelay = itemIndex * 400;

        // 第一步：时间节点出现
        setTimeout(() => {
            if (dot) dot.classList.add('animate');
        }, baseDelay);

        // 第二步：代数标注出现
        setTimeout(() => {
            if (generationNumber) generationNumber.classList.add('animate');
        }, baseDelay + 150);

        // 第三步：年代数字出现
        setTimeout(() => {
            if (year) year.classList.add('animate');
        }, baseDelay + 250);

        // 第四步：标题出现
        setTimeout(() => {
            if (title) title.classList.add('animate');
        }, baseDelay + 550);

        // 第五步：说明文字逐行出现
        descriptionLines.forEach((line, lineIndex) => {
            setTimeout(() => {
                line.classList.add('animate');
            }, baseDelay + 850 + (lineIndex * 150));
        });

        // 项目整体标记为已动画
        setTimeout(() => {
            item.classList.add('animate');
        }, baseDelay);
    }

    // 创建滚动观察器
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const itemIndex = Array.from(timelineItems).indexOf(entry.target);
                animateTimelineItem(entry.target, itemIndex);
                // 动画后取消观察，避免重复触发
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // 观察所有时间轴项目
    timelineItems.forEach(item => {
        observer.observe(item);
    });

    // 结论文本动画
    const conclusionText = document.querySelector('.heritage-timeline .conclusion-text');
    if (conclusionText) {
        const conclusionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                    conclusionObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        conclusionObserver.observe(conclusionText);
    }

    // 轻微视差效果 - 营造历史展开的感觉
    let ticking = false;
    function updateParallax() {
        if (!timelineSection) return;

        const scrolled = window.pageYOffset;
        const rect = timelineSection.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

        if (isVisible) {
            // 计算视差移动率
            const scrollProgress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
            const parallaxY = scrollProgress * 30; // 轻微的30px视差效果

            // 应用视差变换到背景
            timelineSection.style.backgroundPosition = `center ${parallaxY}px`;

            // 为时间轴项目添加轻微的分层视差
            timelineItems.forEach((item, index) => {
                const itemRect = item.getBoundingClientRect();
                if (itemRect.top < window.innerHeight && itemRect.bottom > 0) {
                    const itemParallax = (scrollProgress * (index + 1) * 2); // 每个项目略有不同
                    item.style.transform = `translateY(${itemParallax}px)`;
                }
            });
        }

        ticking = false;
    }

    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }

    // 节流的滚动事件监听
    window.addEventListener('scroll', requestTick);

    // 键盘导航支持
    timelineItems.forEach((item, index) => {
        item.setAttribute('tabindex', '0');
        item.setAttribute('role', 'article');
        item.setAttribute('aria-label', `第${index + 1}个历史阶段`);

        item.addEventListener('focus', function() {
            this.style.outline = '2px solid rgba(212, 44, 40, 0.8)';
            this.style.outlineOffset = '4px';
        });

        item.addEventListener('blur', function() {
            this.style.outline = 'none';
        });
    });

    // 添加动态样式到文档头部
    const dynamicStyles = document.createElement('style');
    dynamicStyles.textContent = `
        /* 确保视差效果的平滑性 */
        .heritage-timeline {
            will-change: background-position;
        }

        .timeline-item {
            will-change: transform;
        }

        /* 减少动画偏好支持 */
        @media (prefers-reduced-motion: reduce) {
            .heritage-timeline,
            .timeline-item {
                will-change: auto;
                transform: none !important;
            }
        }
    `;
    document.head.appendChild(dynamicStyles);

    // 性能优化：在页面即将卸载时清理事件监听器
    window.addEventListener('beforeunload', function() {
        window.removeEventListener('scroll', requestTick);
        observer.disconnect();
        if (conclusionObserver) conclusionObserver.disconnect();
    });
});