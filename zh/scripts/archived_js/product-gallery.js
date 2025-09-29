/**
 * 产品图片库功能
 * Product Gallery Functionality
 */

class ProductGallery {
    constructor() {
        this.mainImage = document.querySelector('.main-gallery-image');
        this.thumbnails = document.querySelectorAll('.thumbnail');
        this.currentIndex = 0;
        this.images = [];

        this.init();
    }

    init() {
        if (!this.mainImage || this.thumbnails.length === 0) {
            return;
        }

        // 收集所有图片信息
        this.collectImages();

        // 绑定缩略图点击事件
        this.bindThumbnailEvents();

        // 绑定键盘事件
        this.bindKeyboardEvents();

        // 设置初始状态
        this.setActiveImage(0);

        // 添加图片预加载
        this.preloadImages();
    }

    /**
     * 收集所有图片信息
     */
    collectImages() {
        this.thumbnails.forEach((thumbnail, index) => {
            const img = thumbnail.querySelector('img');
            if (img) {
                this.images.push({
                    src: img.src,
                    alt: img.alt || `产品图片 ${index + 1}`,
                    title: img.title || ''
                });
            }
        });
    }

    /**
     * 绑定缩略图点击事件
     */
    bindThumbnailEvents() {
        this.thumbnails.forEach((thumbnail, index) => {
            thumbnail.addEventListener('click', () => {
                this.setActiveImage(index);
            });

            // 添加悬停预览效果
            thumbnail.addEventListener('mouseenter', () => {
                this.previewImage(index);
            });

            thumbnail.addEventListener('mouseleave', () => {
                this.restoreCurrentImage();
            });
        });
    }

    /**
     * 绑定键盘事件
     */
    bindKeyboardEvents() {
        document.addEventListener('keydown', (event) => {
            // 只在产品详情页激活键盘导航
            if (!document.querySelector('.product-gallery')) {
                return;
            }

            switch (event.key) {
                case 'ArrowLeft':
                    event.preventDefault();
                    this.previousImage();
                    break;
                case 'ArrowRight':
                    event.preventDefault();
                    this.nextImage();
                    break;
                case 'Home':
                    event.preventDefault();
                    this.setActiveImage(0);
                    break;
                case 'End':
                    event.preventDefault();
                    this.setActiveImage(this.images.length - 1);
                    break;
            }
        });
    }

    /**
     * 设置当前活动图片
     */
    setActiveImage(index) {
        if (index < 0 || index >= this.images.length) {
            return;
        }

        this.currentIndex = index;
        const imageData = this.images[index];

        // 更新主图片
        this.updateMainImage(imageData);

        // 更新缩略图状态
        this.updateThumbnailStates(index);

        // 触发自定义事件
        this.dispatchImageChangeEvent(imageData, index);
    }

    /**
     * 更新主图片
     */
    updateMainImage(imageData) {
        // 添加淡出效果
        this.mainImage.style.opacity = '0.7';

        setTimeout(() => {
            this.mainImage.src = imageData.src;
            this.mainImage.alt = imageData.alt;
            this.mainImage.title = imageData.title;

            // 淡入效果
            this.mainImage.style.opacity = '1';
        }, 150);
    }

    /**
     * 更新缩略图状态
     */
    updateThumbnailStates(activeIndex) {
        this.thumbnails.forEach((thumbnail, index) => {
            if (index === activeIndex) {
                thumbnail.classList.add('active');
                thumbnail.setAttribute('aria-selected', 'true');
            } else {
                thumbnail.classList.remove('active');
                thumbnail.setAttribute('aria-selected', 'false');
            }
        });
    }

    /**
     * 悬停预览图片
     */
    previewImage(index) {
        if (index === this.currentIndex) {
            return;
        }

        const imageData = this.images[index];
        this.mainImage.style.opacity = '0.8';
        this.mainImage.src = imageData.src;
    }

    /**
     * 恢复当前图片
     */
    restoreCurrentImage() {
        const currentImageData = this.images[this.currentIndex];
        this.mainImage.style.opacity = '1';
        this.mainImage.src = currentImageData.src;
    }

    /**
     * 上一张图片
     */
    previousImage() {
        const newIndex = this.currentIndex > 0
            ? this.currentIndex - 1
            : this.images.length - 1;
        this.setActiveImage(newIndex);
    }

    /**
     * 下一张图片
     */
    nextImage() {
        const newIndex = this.currentIndex < this.images.length - 1
            ? this.currentIndex + 1
            : 0;
        this.setActiveImage(newIndex);
    }

    /**
     * 预加载图片
     */
    preloadImages() {
        this.images.forEach(imageData => {
            const img = new Image();
            img.src = imageData.src;
        });
    }

    /**
     * 触发图片切换事件
     */
    dispatchImageChangeEvent(imageData, index) {
        const event = new CustomEvent('imageChanged', {
            detail: {
                imageData,
                index,
                totalImages: this.images.length
            }
        });
        document.dispatchEvent(event);
    }

    /**
     * 获取当前图片信息
     */
    getCurrentImage() {
        return {
            imageData: this.images[this.currentIndex],
            index: this.currentIndex,
            totalImages: this.images.length
        };
    }

    /**
     * 添加新图片
     */
    addImage(src, alt = '', title = '') {
        this.images.push({ src, alt, title });

        // 创建新的缩略图元素
        const thumbnail = this.createThumbnailElement(src, alt, this.images.length - 1);
        document.querySelector('.thumbnail-gallery').appendChild(thumbnail);

        // 重新绑定事件
        this.bindThumbnailEvents();
    }

    /**
     * 创建缩略图元素
     */
    createThumbnailElement(src, alt, index) {
        const thumbnail = document.createElement('div');
        thumbnail.className = 'thumbnail';
        thumbnail.innerHTML = `<img src="${src}" alt="${alt}">`;

        thumbnail.addEventListener('click', () => {
            this.setActiveImage(index);
        });

        return thumbnail;
    }

    /**
     * 重置图片库
     */
    reset() {
        this.currentIndex = 0;
        this.setActiveImage(0);
    }
}

// 自动初始化
document.addEventListener('DOMContentLoaded', function() {
    // 只在有产品图片库的页面初始化
    if (document.querySelector('.product-gallery')) {
        window.productGallery = new ProductGallery();

        // 监听图片切换事件（可用于统计或其他功能）
        document.addEventListener('imageChanged', function(event) {
            const { imageData, index, totalImages } = event.detail;
            console.log(`图片切换: ${index + 1}/${totalImages} - ${imageData.alt}`);
        });

        // 添加图片懒加载支持
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

            // 观察所有带有 data-src 的图片
            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }
});

// 暴露到全局
window.ProductGallery = ProductGallery;