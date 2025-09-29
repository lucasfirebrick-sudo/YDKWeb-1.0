// 图片加载失败处理和降级方案
(function() {
    'use strict';

    // 产品图片映射表 - SVG作为降级方案
    const imageFallbacks = {
        'magnesium-chrome-brick.jpg': 'magnesium-chrome-brick.svg',
        'ceramic-honeycomb-regenerator.jpg': 'ceramic-honeycomb-regenerator.svg',
        'lightweight-mullite-brick.jpg': 'lightweight-mullite-brick.svg',
        'alumina-hollow-sphere-brick.jpg': 'alumina-hollow-sphere-brick.svg',
        'lightweight-insulating-castable.jpg': 'lightweight-insulating-castable.svg',
        'general-silica-brick.jpg': 'general-silica-brick.svg',
        'bf-ceramic-cup-material.jpg': 'bf-ceramic-cup-material.svg'
    };

    // 图片加载错误处理
    function handleImageError(img) {
        const src = img.src;
        const filename = src.split('/').pop();


        // 如果是JPG图片失败，尝试加载SVG降级
        if (imageFallbacks[filename]) {
            const svgPath = src.replace(filename, imageFallbacks[filename]);

            img.src = svgPath;
            img.setAttribute('data-fallback-used', 'true');

            // 添加降级提示
            addFallbackNotice(img);
        } else {
            // 使用通用占位符
            img.src = 'data:image/svg+xml;base64,' + btoa(`
                <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
                    <rect width="100%" height="100%" fill="#f5f5f5"/>
                    <text x="50%" y="50%" text-anchor="middle" dy=".3em"
                          font-family="Arial, sans-serif" font-size="16" fill="#999">
                        产品图片加载中...
                    </text>
                </svg>
            `);
            img.setAttribute('data-fallback-used', 'placeholder');
        }
    }

    // 添加降级提示
    function addFallbackNotice(img) {
        // 避免重复添加提示
        if (img.parentNode.querySelector('.image-fallback-notice')) {
            return;
        }

        const notice = document.createElement('div');
        notice.className = 'image-fallback-notice';
        notice.innerHTML = `
            <i class="fas fa-info-circle"></i>
            <span>使用示意图展示，真实产品图片正在更新中</span>
        `;
        notice.style.cssText = `
            position: absolute;
            bottom: 10px;
            left: 10px;
            background: rgba(0,0,0,0.7);
            color: white;
            padding: 5px 10px;
            border-radius: 4px;
            font-size: 12px;
            z-index: 10;
            display: flex;
            align-items: center;
            gap: 5px;
        `;

        // 确保父容器有相对定位
        if (img.parentNode.style.position !== 'relative') {
            img.parentNode.style.position = 'relative';
        }

        img.parentNode.appendChild(notice);
    }

    // 预加载图片并检测是否存在
    function preloadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(src);
            img.onerror = () => reject(src);
            img.src = src;
        });
    }

    // 批量检查图片状态
    async function checkImageAvailability() {
        const productImages = document.querySelectorAll('.product-card img, .main-image img');
        const imageChecks = [];

        productImages.forEach(img => {
            const originalSrc = img.src;
            imageChecks.push(
                preloadImage(originalSrc)
                    .then(src => ({ img, src, status: 'success' }))
                    .catch(src => ({ img, src, status: 'failed' }))
            );
        });

        try {
            const results = await Promise.allSettled(imageChecks);
            results.forEach(result => {
                if (result.status === 'fulfilled' && result.value.status === 'failed') {
                    handleImageError(result.value.img);
                }
            });
        } catch (error) {
            console.error('图片检查过程中出错:', error);
        }
    }

    // DOM加载完成后执行
    document.addEventListener('DOMContentLoaded', function() {
        // 为所有产品图片添加错误处理
        const allImages = document.querySelectorAll('img[src*="/products/"]');
        allImages.forEach(img => {
            img.addEventListener('error', function() {
                handleImageError(this);
            });
        });

        // 延迟检查图片可用性
        setTimeout(checkImageAvailability, 1000);
    });

    // 图片懒加载优化
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        observer.unobserve(img);
                    }
                }
            });
        });

        // 观察所有带有data-src的图片
        document.addEventListener('DOMContentLoaded', function() {
            const lazyImages = document.querySelectorAll('img[data-src]');
            lazyImages.forEach(img => imageObserver.observe(img));
        });
    }

    // 添加CSS样式
    const style = document.createElement('style');
    style.textContent = `
        .image-fallback-notice {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            transition: opacity 0.3s ease;
        }
        .image-fallback-notice:hover {
            opacity: 0.8;
        }

        /* 产品图片容器样式 */
        .product-images, .product-card .product-image {
            position: relative;
            overflow: hidden;
        }

        /* 图片加载状态 */
        img[data-fallback-used="true"] {
            border: 2px dashed #ddd;
        }

        img[data-fallback-used="placeholder"] {
            opacity: 0.6;
        }
    `;
    document.head.appendChild(style);

    // 导出全局函数供外部调用
    window.ImageFallback = {
        handleError: handleImageError,
        checkAvailability: checkImageAvailability,
        fallbacks: imageFallbacks
    };
})();