/**
 * 产品占位图随机版本选择器
 * 为没有图片的产品提供美观的占位符显示
 */

class PlaceholderRandomizer {
    constructor() {
        this.versions = ['placeholder-version-2', 'placeholder-version-3'];
        this.init();
    }

    init() {
        // 页面加载完成后初始化
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.randomizePlaceholders());
        } else {
            this.randomizePlaceholders();
        }
    }

    /**
     * 随机分配占位图版本
     */
    randomizePlaceholders() {
        const randomPlaceholders = document.querySelectorAll('.placeholder-random');

        if (randomPlaceholders.length === 0) {
            // 如果没有找到 placeholder-random 类，检查是否有隐藏的占位符需要显示
            this.checkForHiddenPlaceholders();
            return;
        }

        randomPlaceholders.forEach(placeholder => {
            this.assignRandomVersion(placeholder);
        });
    }

    /**
     * 为单个占位符分配随机版本
     */
    assignRandomVersion(placeholder) {
        // 移除可能存在的版本类
        this.versions.forEach(version => {
            placeholder.classList.remove(version);
        });

        // 随机选择版本
        const randomVersion = this.versions[Math.floor(Math.random() * this.versions.length)];

        // 添加新版本类
        placeholder.classList.add(randomVersion);

        // 移除 placeholder-random 类，避免重复处理
        placeholder.classList.remove('placeholder-random');

        // 添加显示动画
        placeholder.classList.add('placeholder-show');

        console.log(`Applied ${randomVersion} to placeholder`);
    }

    /**
     * 检查并处理隐藏的占位符
     */
    checkForHiddenPlaceholders() {
        // 延迟执行，让轮播组件先初始化
        setTimeout(() => {
            const hiddenPlaceholders = document.querySelectorAll('.no-images-placeholder.hidden');

            // 如果产品确实没有图片，显示占位符
            hiddenPlaceholders.forEach(placeholder => {
                const imageContainer = placeholder.closest('.product-images');
                const mainImage = imageContainer?.querySelector('.main-image');
                const productId = imageContainer?.getAttribute('data-product-id');

                // 产品ID验证 - 确保不会误操作其他产品的图片
                console.log(`Checking placeholder for product: ${productId}`);

                // 新增：检查是否有轮播组件已经初始化
                const hasGallery = imageContainer?.classList.contains('multi-image-gallery');
                const hasImages = imageContainer?.querySelector('.image-thumbnails')?.children.length > 0;

                // 只有在真正没有图片且没有轮播组件时才显示占位符
                if (mainImage && this.shouldShowPlaceholder(mainImage) && !hasGallery && !hasImages) {
                    this.showPlaceholder(placeholder);
                }
            });
        }, 1000); // 给轮播组件充分的初始化时间
    }

    /**
     * 判断是否应该显示占位符
     */
    shouldShowPlaceholder(imageElement) {
        // 检查是否被锁定（不允许修改）
        if (imageElement.hasAttribute('data-locked')) {
            return false;
        }

        // 检查是否有data-images配置（说明是轮播组件）
        const hasDataImages = imageElement.hasAttribute('data-images') &&
                             imageElement.getAttribute('data-images').trim() !== '';

        // 如果有data-images配置，说明是轮播组件，不应该显示占位符
        if (hasDataImages) {
            return false;
        }

        // 检查图片是否加载失败或不存在
        return (
            !imageElement.complete ||
            imageElement.naturalWidth === 0 ||
            imageElement.src.includes('placeholder') ||
            imageElement.src === '' ||
            imageElement.hasAttribute('data-placeholder')
        );
    }

    /**
     * 显示占位符
     */
    showPlaceholder(placeholder) {
        // 移除隐藏类
        placeholder.classList.remove('hidden');

        // 添加随机版本
        placeholder.classList.add('placeholder-random');
        this.assignRandomVersion(placeholder);

        // 隐藏原始图片容器
        const mainImageContainer = placeholder.closest('.product-images')?.querySelector('.main-image-container');
        if (mainImageContainer) {
            mainImageContainer.style.display = 'none';
        }
    }

    /**
     * 手动刷新占位符（用于动态内容）
     */
    refresh() {
        this.randomizePlaceholders();
    }

    /**
     * 添加新的占位符
     */
    addPlaceholder(element) {
        if (element && element.classList.contains('no-images-placeholder')) {
            element.classList.add('placeholder-random');
            this.assignRandomVersion(element);
        }
    }
}

// 创建全局实例
const placeholderRandomizer = new PlaceholderRandomizer();

// 暴露给全局作用域，供其他脚本使用
window.PlaceholderRandomizer = PlaceholderRandomizer;
window.placeholderRandomizer = placeholderRandomizer;

// 图片错误处理增强
document.addEventListener('DOMContentLoaded', function() {
    const productImages = document.querySelectorAll('.product-images .main-image');

    productImages.forEach(img => {
        img.addEventListener('error', function() {
            console.log('Image failed to load, showing placeholder');
            const placeholder = this.closest('.product-images')?.querySelector('.no-images-placeholder');
            if (placeholder) {
                placeholderRandomizer.showPlaceholder(placeholder);
            }
        });
    });
});

// 导出模块（如果支持）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PlaceholderRandomizer;
}