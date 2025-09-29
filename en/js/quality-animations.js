/* ========== QUALITY CONTROL PAGE ANIMATIONS ========== */
/* 质量控制页面专用交互动画脚本 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Quality animations loaded');

    // Initialize essential animations only
    initCounterAnimations();
    initScrollAnimations();
    initEquipmentHover();

    // Initialize after a small delay to ensure DOM is fully loaded
    setTimeout(() => {
        observeElements();
    }, 100);
});

/* ========== 数字滚动动画 ========== */
function initCounterAnimations() {
    const counters = document.querySelectorAll('[data-count]');
    const observerOptions = {
        threshold: 0.7,
        rootMargin: '0px 0px -100px 0px'
    };

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                entry.target.classList.add('counted');
                animateCounter(entry.target);
            }
        });
    }, observerOptions);

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

function animateCounter(element) {
    const target = parseFloat(element.getAttribute('data-count'));
    const duration = 2000; // 2 seconds
    const increment = target / (duration / 16); // 60fps
    let current = 0;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }

        // Format number based on type
        const formattedNumber = target % 1 === 0 ?
            Math.floor(current).toString() :
            current.toFixed(1);

        element.textContent = formattedNumber;

        // Add some visual feedback
        if (current === target) {
            element.style.transform = 'scale(1.1)';
            setTimeout(() => {
                element.style.transform = 'scale(1)';
                element.style.transition = 'transform 0.3s ease';
            }, 200);
        }
    }, 16);
}

/* ========== 滚动触发动画 ========== */
function initScrollAnimations() {
    const animationElements = document.querySelectorAll('.quality-content-premium, .stat-card-premium, .equipment-showcase, .cert-card-premium, .process-step, .promise-feature');

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // 减少延迟和动画幅度
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    entry.target.classList.add('animate-in');
                }, index * 50); // 减少延迟从150ms到50ms
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animationElements.forEach(element => {
        // 减少初始位移
        element.style.opacity = '0';
        element.style.transform = 'translateY(15px)'; // 从30px减少到15px
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease'; // 从0.8s减少到0.5s
        scrollObserver.observe(element);
    });
}

/* ========== 设备展示悬停效果 ========== */
function initEquipmentHover() {
    const equipmentCards = document.querySelectorAll('.equipment-showcase');

    equipmentCards.forEach(card => {
        const overlay = card.querySelector('.equipment-overlay');
        const image = card.querySelector('.equipment-image img');

        card.addEventListener('mouseenter', () => {
            if (overlay) overlay.style.opacity = '1';
            if (image) {
                image.style.transform = 'scale(1.05)'; // 减少缩放从1.1到1.05
                image.style.filter = 'brightness(0.9)'; // 减少滤镜效果
            }
        });

        card.addEventListener('mouseleave', () => {
            if (overlay) overlay.style.opacity = '0';
            if (image) {
                image.style.transform = 'scale(1)';
                image.style.filter = 'brightness(1)';
            }
        });
    });
}

/* ========== 认证卡片动画效果 ========== */
function initCertificationHover() {
    const certCards = document.querySelectorAll('.cert-card-premium');

    certCards.forEach((card, index) => {
        // 为每个卡片添加独特的动画延迟
        card.style.animationDelay = (index * 100) + 'ms';

        card.addEventListener('mouseenter', () => {
            // 添加光晕效果
            card.style.boxShadow = `
                0 30px 80px rgba(211, 47, 47, 0.2),
                0 0 0 1px rgba(211, 47, 47, 0.1),
                inset 0 1px 0 rgba(255, 255, 255, 0.1)
            `;

            // 缩放效果
            card.style.transform = 'translateY(-15px) scale(1.02)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.boxShadow = '0 20px 60px rgba(0,0,0,0.08)';
            card.style.transform = 'translateY(0) scale(1)';
        });

        // 点击放大查看证书
        const certImage = card.querySelector('.cert-image img');
        if (certImage) {
            certImage.addEventListener('click', (e) => {
                e.stopPropagation();
                showCertificationModal(certImage.src, certImage.alt);
            });
        }
    });
}

/* ========== 认证证书模态框 ========== */
function showCertificationModal(imageSrc, imageAlt) {
    // 创建模态框
    const modal = document.createElement('div');
    modal.className = 'cert-modal';
    modal.innerHTML = `
        <div class="cert-modal-backdrop" onclick="closeCertificationModal()"></div>
        <div class="cert-modal-content">
            <button class="cert-modal-close" onclick="closeCertificationModal()">&times;</button>
            <img src="${imageSrc}" alt="${imageAlt}">
            <div class="cert-modal-info">
                <h3>${imageAlt}</h3>
                <p>点击图片可以查看大图，按ESC键或点击背景关闭</p>
            </div>
        </div>
    `;

    // 添加样式
    const style = document.createElement('style');
    style.textContent = `
        .cert-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .cert-modal-backdrop {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            backdrop-filter: blur(5px);
        }
        .cert-modal-content {
            position: relative;
            max-width: 90vw;
            max-height: 90vh;
            background: white;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 25px 50px rgba(0,0,0,0.5);
        }
        .cert-modal-close {
            position: absolute;
            top: 15px;
            right: 20px;
            background: rgba(0,0,0,0.5);
            color: white;
            border: none;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            font-size: 24px;
            cursor: pointer;
            z-index: 10;
        }
        .cert-modal-content img {
            width: 100%;
            height: auto;
            display: block;
        }
        .cert-modal-info {
            padding: 20px;
            text-align: center;
        }
    `;

    document.head.appendChild(style);
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';

    // ESC键关闭
    document.addEventListener('keydown', function escHandler(e) {
        if (e.key === 'Escape') {
            closeCertificationModal();
            document.removeEventListener('keydown', escHandler);
        }
    });
}

function closeCertificationModal() {
    const modal = document.querySelector('.cert-modal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = '';
    }
}

/* ========== 质量流程步骤动画 ========== */
function initProcessFlow() {
    const processSteps = document.querySelectorAll('.process-step');
    const progressObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('step-active');

                    // 添加连接线动画
                    const stepNumber = entry.target.querySelector('.step-number');
                    if (stepNumber) {
                        setTimeout(() => {
                            stepNumber.classList.add('number-pulse');
                        }, 500);
                    }
                }, index * 300);
            }
        });
    }, { threshold: 0.5 });

    processSteps.forEach(step => {
        progressObserver.observe(step);
    });
}

/* ========== 视差滚动效果 ========== */
function initParallaxEffect() {
    const heroSection = document.querySelector('.quality-hero');
    const promiseSection = document.querySelector('.quality-promise-premium');

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;

        if (heroSection) {
            heroSection.style.transform = `translate3d(0, ${rate}px, 0)`;
        }

        if (promiseSection && scrolled > promiseSection.offsetTop - window.innerHeight) {
            const promiseRate = (scrolled - promiseSection.offsetTop) * 0.3;
            promiseSection.style.transform = `translate3d(0, ${promiseRate}px, 0)`;
        }
    });
}

/* ========== 滚动监听器 ========== */
function observeElements() {
    // 检测页面滚动进度 - 简化版本
    window.addEventListener('scroll', throttle(() => {
        updateScrollProgress();
    }, 100));
}

function updateScrollProgress() {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;

    // 可以添加进度条显示
    let progressBar = document.querySelector('.scroll-progress');
    if (!progressBar) {
        progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: ${scrolled}%;
            height: 3px;
            background: linear-gradient(90deg, var(--primary-color), var(--primary-dark));
            z-index: 1000;
            transition: width 0.1s ease;
        `;
        document.body.appendChild(progressBar);
    } else {
        progressBar.style.width = scrolled + '%';
    }
}

function handleStickyNavigation() {
    // 删除动态导航栏效果 - 保持静态导航栏
    return;
}

/* ========== 性能优化 ========== */
// 节流函数
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// 防抖函数
function debounce(func, wait, immediate) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// 已在observeElements中处理滚动事件

/* ========== 错误处理 ========== */
window.addEventListener('error', function(e) {
    console.warn('Quality animations error:', e.error);
});

// 添加CSS动画样式
const animationStyles = document.createElement('style');
animationStyles.textContent = `
    .animate-in {
        animation: slideInUp 0.8s ease forwards;
    }

    .step-active .step-number {
        background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
        color: white;
        transform: scale(1.1);
        box-shadow: 0 10px 30px rgba(211, 47, 47, 0.3);
    }

    .number-pulse {
        animation: pulse 2s infinite;
    }

    .equipment-showcase.expanded {
        transform: scale(1.02);
        z-index: 10;
    }

    .equipment-showcase.expanded .equipment-specs {
        max-height: 300px !important;
        opacity: 1 !important;
    }

    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes pulse {
        0% { transform: scale(1.1); }
        50% { transform: scale(1.2); }
        100% { transform: scale(1.1); }
    }

    .equipment-specs {
        max-height: 0;
        opacity: 0;
        overflow: hidden;
        transition: max-height 0.5s ease, opacity 0.3s ease;
    }
`;
document.head.appendChild(animationStyles);