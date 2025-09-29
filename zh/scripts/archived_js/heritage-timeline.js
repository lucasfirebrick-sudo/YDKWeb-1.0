// 三代传承时间轴动画效果
document.addEventListener('DOMContentLoaded', function() {
    const timelineItems = document.querySelectorAll('.timeline-item');

    // 创建滚动观察器
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');

                // 添加闪烁动画到时间年份
                const timelineYear = entry.target.querySelector('.timeline-year');
                if (timelineYear) {
                    setTimeout(() => {
                        timelineYear.style.animation = 'pulse 1s ease-in-out';
                    }, 300);
                }
            }
        });
    }, observerOptions);

    // 观察所有时间轴项目
    timelineItems.forEach(item => {
        observer.observe(item);
    });

    // 为现代功能特性添加悬停效果
    const featureItems = document.querySelectorAll('.feature-item');
    featureItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(10px) scale(1.02)';
            this.style.boxShadow = '0 8px 25px rgba(197, 55, 55, 0.15)';
        });

        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0) scale(1)';
            this.style.boxShadow = 'none';
        });
    });

    // 时间轴标题火焰动画
    const sectionTitle = document.querySelector('.heritage-timeline .section-title');
    if (sectionTitle) {
        // 鼠标悬停时增强火焰效果
        sectionTitle.addEventListener('mouseenter', function() {
            const flame = this.querySelector('::after');
            this.style.textShadow = '0 0 20px rgba(197, 55, 55, 0.5)';
        });

        sectionTitle.addEventListener('mouseleave', function() {
            this.style.textShadow = 'none';
        });
    }

    // 结论文本的动画效果
    const conclusionText = document.querySelector('.conclusion-text');
    if (conclusionText) {
        const conclusionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'fadeInUp 1s ease-out';
                    entry.target.style.opacity = '1';
                }
            });
        }, { threshold: 0.3 });

        conclusionObserver.observe(conclusionText);
    }
});