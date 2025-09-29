/**
 * 多图产品画廊组件
 * 支持图片滚动、缩略图导航、自动播放
 */

class MultiImageGallery {
    constructor() {
        this.currentIndex = 0;
        this.images = [];
        this.autoPlayInterval = null;
        this.autoPlayDelay = 5000; // 5秒自动切换
        this.init();
    }

    init() {
        // 页面加载完成后初始化
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeGallery());
        } else {
            this.initializeGallery();
        }
    }

    initializeGallery() {
        const mainImage = document.querySelector('.main-image');
        if (!mainImage) return;

        // 获取图片数据
        const imagesData = mainImage.getAttribute('data-images');
        if (!imagesData || !imagesData.trim()) return;

        this.images = imagesData.split(',').map(src => src.trim()).filter(src => src.length > 0);

        // 如果只有一张图片，设置单图片模式
        if (this.images.length <= 1) {
            this.setupSingleImageMode(mainImage);
            return;
        }

        // 多图片模式：启用完整画廊功能
        this.setupGallery(mainImage);
        this.createThumbnails();
        this.bindEvents();
        this.startAutoPlay();
    }

    setupGallery(mainImage) {
        // 添加画廊容器类
        const container = mainImage.closest('.product-images');
        if (container) {
            container.classList.add('multi-image-gallery');
        }

        // 添加导航按钮
        this.createNavigationButtons(mainImage.parentElement);

        // 添加图片计数器
        this.createImageCounter(mainImage.parentElement);
    }

    createNavigationButtons(container) {
        // 上一张按钮
        const prevBtn = document.createElement('button');
        prevBtn.className = 'gallery-nav-btn prev-btn';
        prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
        prevBtn.setAttribute('aria-label', '上一张图片');

        // 下一张按钮
        const nextBtn = document.createElement('button');
        nextBtn.className = 'gallery-nav-btn next-btn';
        nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
        nextBtn.setAttribute('aria-label', '下一张图片');

        container.appendChild(prevBtn);
        container.appendChild(nextBtn);

        // 绑定事件
        prevBtn.addEventListener('click', () => this.previousImage());
        nextBtn.addEventListener('click', () => this.nextImage());
    }

    createImageCounter(container) {
        const counter = document.createElement('div');
        counter.className = 'image-counter';
        counter.innerHTML = `<span class="current">1</span> / <span class="total">${this.images.length}</span>`;
        container.appendChild(counter);
    }

    createThumbnails() {
        const thumbnailsContainer = document.querySelector('.image-thumbnails');
        if (!thumbnailsContainer) return;

        // 清空现有缩略图
        thumbnailsContainer.innerHTML = '';

        // 创建缩略图
        this.images.forEach((imageSrc, index) => {
            const thumbnail = document.createElement('div');
            thumbnail.className = `thumbnail ${index === 0 ? 'active' : ''}`;
            thumbnail.innerHTML = `
                <img src="${imageSrc}" alt="产品图片 ${index + 1}" loading="lazy">
            `;

            thumbnail.addEventListener('click', () => this.showImage(index));
            thumbnailsContainer.appendChild(thumbnail);
        });

        // 显示缩略图容器
        const thumbnailsWrapper = thumbnailsContainer.closest('.image-thumbnails-container');
        if (thumbnailsWrapper) {
            thumbnailsWrapper.classList.remove('hidden');
        }
    }

    showImage(index) {
        if (index < 0 || index >= this.images.length) return;

        this.currentIndex = index;
        const mainImage = document.querySelector('.main-image');

        if (mainImage) {
            // 添加淡出效果
            mainImage.style.opacity = '0.5';

            setTimeout(() => {
                mainImage.src = this.images[index];
                mainImage.style.opacity = '1';
            }, 150);
        }

        // 更新缩略图状态
        this.updateThumbnails();

        // 更新计数器
        this.updateCounter();

        // 重新开始自动播放
        this.restartAutoPlay();
    }

    updateThumbnails() {
        const thumbnails = document.querySelectorAll('.thumbnail');
        thumbnails.forEach((thumb, index) => {
            thumb.classList.toggle('active', index === this.currentIndex);
        });
    }

    updateCounter() {
        const counter = document.querySelector('.image-counter .current');
        if (counter) {
            counter.textContent = this.currentIndex + 1;
        }
    }

    nextImage() {
        const nextIndex = (this.currentIndex + 1) % this.images.length;
        this.showImage(nextIndex);
    }

    previousImage() {
        const prevIndex = this.currentIndex === 0 ? this.images.length - 1 : this.currentIndex - 1;
        this.showImage(prevIndex);
    }

    startAutoPlay() {
        if (this.images.length <= 1) return;

        this.autoPlayInterval = setInterval(() => {
            this.nextImage();
        }, this.autoPlayDelay);
    }

    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }

    restartAutoPlay() {
        this.stopAutoPlay();
        this.startAutoPlay();
    }

    bindEvents() {
        const container = document.querySelector('.product-images');
        if (!container) return;

        // 鼠标悬停时暂停自动播放
        container.addEventListener('mouseenter', () => this.stopAutoPlay());
        container.addEventListener('mouseleave', () => this.startAutoPlay());

        // 键盘导航
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                this.previousImage();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                this.nextImage();
            }
        });

        // 触摸滑动支持
        this.addTouchSupport(container);
    }

    setupSingleImageMode(mainImage) {
        // 单图片模式：确保显示第一张图片，不启用轮播功能
        if (this.images.length === 1) {
            mainImage.src = this.images[0];
            mainImage.alt = '产品图片';
        }

        // 隐藏轮播相关元素
        const container = mainImage.closest('.product-images');
        if (container) {
            container.classList.add('single-image-mode');

            // 隐藏可能已存在的导航按钮
            const navButtons = container.querySelectorAll('.gallery-nav-btn');
            navButtons.forEach(btn => btn.style.display = 'none');

            // 隐藏图片计数器
            const counter = container.querySelector('.image-counter');
            if (counter) counter.style.display = 'none';
        }

        // 隐藏缩略图容器
        const thumbnailsWrapper = document.querySelector('.image-thumbnails-container');
        if (thumbnailsWrapper) {
            thumbnailsWrapper.classList.add('hidden');
        }
    }

    addTouchSupport(container) {
        let startX = 0;
        let endX = 0;

        container.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });

        container.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            const diffX = startX - endX;

            // 最小滑动距离
            if (Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    this.nextImage(); // 向左滑动，显示下一张
                } else {
                    this.previousImage(); // 向右滑动，显示上一张
                }
            }
        });
    }

    // 公共方法：外部控制
    goToImage(index) {
        this.showImage(index);
    }

    getCurrentIndex() {
        return this.currentIndex;
    }

    getTotalImages() {
        return this.images.length;
    }
}

// 创建全局实例
const multiImageGallery = new MultiImageGallery();

// 暴露给全局作用域
window.MultiImageGallery = MultiImageGallery;
window.multiImageGallery = multiImageGallery;

// 导出模块（如果支持）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MultiImageGallery;
}