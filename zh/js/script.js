// 河南元达科进出口贸易有限公司网站 - 基础脚本文件 - 已解锁编辑

document.addEventListener('DOMContentLoaded', function() {

    // 移动端导航菜单功能已移至navigation-loader.js

    // 滚动动画
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, observerOptions);

    // 观察所有需要动画的元素
    const animatedElements = document.querySelectorAll('.scroll-reveal');
    animatedElements.forEach(el => observer.observe(el));

    // Hero轮播功能现在由SlideManager统一管理，在文件底部初始化

    // 产品筛选功能
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.dataset.filter;

            // 更新按钮状态
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // 筛选产品
            productCards.forEach(card => {
                if (filter === 'all' || card.dataset.category === filter) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeIn 0.3s ease';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // 平滑滚动
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // 页面加载完成动画
    document.body.classList.add('loaded');

    // 导航栏滚动效果已移至navigation-loader.js

    // 表单提交处理
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            // 这里可以添加表单验证和提交逻辑
        });
    });

});

// 全局工具函数
window.YuandakeUtils = {
    // 显示通知
    showNotification: function(message, type = 'info') {
    },

    // 格式化电话号码
    formatPhone: function(phone) {
        return phone.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
    }
};

// 快速询价功能处理
document.addEventListener('DOMContentLoaded', function() {
    // 绑定所有快速询价按钮
    document.querySelectorAll('[data-action="quick-inquiry"]').forEach(btn => {
        btn.addEventListener('click', function() {
            // 如果有询价表单 modal，就触发它
            if (typeof showQuickInquiry === 'function') {
                showQuickInquiry();
            } else if (document.getElementById('aiSelectorTrigger')) {
                // 触发AI选型器
                document.getElementById('aiSelectorTrigger').click();
            } else {
                // 临时 fallback：跳转到联系页面
                window.location.href = 'contact.html';
            }
        });
    });
});

// 通用轮播管理器
const SlideManager = {
    // Hero轮播实例
    hero: null,
    // 项目轮播实例
    project: null,

    // 初始化轮播
    initSlideShow(config) {
        const {
            containerSelector,
            slidesSelector,
            indicatorsSelector,
            prevBtnSelector,
            nextBtnSelector,
            autoPlay = true,
            interval = 5000
        } = config;

        const container = document.querySelector(containerSelector);
        if (!container) return null;

        const slides = container.querySelectorAll(slidesSelector);
        const indicators = indicatorsSelector ? container.querySelectorAll(indicatorsSelector) : [];
        const prevBtn = prevBtnSelector ? document.querySelector(prevBtnSelector) : null;
        const nextBtn = nextBtnSelector ? document.querySelector(nextBtnSelector) : null;

        if (slides.length === 0) return null;

        let currentIndex = 0;
        let autoPlayInterval = null;

        const instance = {
            showSlide(index) {
                slides.forEach((slide, i) => {
                    slide.classList.remove('active');
                    if (indicators[i]) indicators[i].classList.remove('active');
                });

                if (slides[index]) {
                    slides[index].classList.add('active');
                    if (indicators[index]) indicators[index].classList.add('active');
                }
                currentIndex = index;
            },

            nextSlide() {
                const next = (currentIndex + 1) % slides.length;
                this.showSlide(next);
            },

            prevSlide() {
                const prev = (currentIndex - 1 + slides.length) % slides.length;
                this.showSlide(prev);
            },

            startAutoPlay() {
                if (autoPlay) {
                    autoPlayInterval = setInterval(() => this.nextSlide(), interval);
                }
            },

            stopAutoPlay() {
                if (autoPlayInterval) {
                    clearInterval(autoPlayInterval);
                    autoPlayInterval = null;
                }
            },

            restartAutoPlay() {
                this.stopAutoPlay();
                this.startAutoPlay();
            }
        };

        // 绑定事件
        if (nextBtn) nextBtn.addEventListener('click', () => {
            instance.nextSlide();
            instance.restartAutoPlay();
        });

        if (prevBtn) prevBtn.addEventListener('click', () => {
            instance.prevSlide();
            instance.restartAutoPlay();
        });

        // 指示器点击
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                instance.showSlide(index);
                instance.restartAutoPlay();
            });
        });

        // 鼠标悬停暂停
        if (container) {
            container.addEventListener('mouseenter', () => instance.stopAutoPlay());
            container.addEventListener('mouseleave', () => instance.startAutoPlay());
        }

        // 初始化
        instance.showSlide(0);
        instance.startAutoPlay();

        return instance;
    }
};

// 初始化所有轮播
document.addEventListener('DOMContentLoaded', function() {
    // 初始化Hero轮播
    SlideManager.hero = SlideManager.initSlideShow({
        containerSelector: '#heroSlider',
        slidesSelector: '.slide',
        indicatorsSelector: '.indicator',
        prevBtnSelector: '#heroPrev',
        nextBtnSelector: '#heroNext',
        autoPlay: true,
        interval: 5000
    });

    // 初始化项目轮播
    SlideManager.project = SlideManager.initSlideShow({
        containerSelector: '.project-carousel',
        slidesSelector: '.project-slide',
        indicatorsSelector: '.carousel-indicators .indicator',
        prevBtnSelector: '.carousel-btn:first-child',
        nextBtnSelector: '.carousel-btn:last-child',
        autoPlay: true,
        interval: 5000
    });
});

// 向后兼容的全局函数
window.nextSlide = function() {
    if (SlideManager.project) SlideManager.project.nextSlide();
};

window.prevSlide = function() {
    if (SlideManager.project) SlideManager.project.prevSlide();
};

window.currentSlide = function(index) {
    if (SlideManager.project) SlideManager.project.showSlide(index - 1);
};

