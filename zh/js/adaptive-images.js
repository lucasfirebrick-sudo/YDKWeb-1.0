/**
 * 自适应产品图片展示系统
 * 根据图片资源情况自动调整展示模式
 */

class AdaptiveImageSystem {
    constructor() {
        this.imageDatabase = this.buildImageDatabase();
        this.fallbackImages = [
            'shaped_high_alumina_brick.jpg',
            'shaped_silica_brick.jpg',
            'shaped_clay_brick.jpg'
        ];
        this.init();
    }

    /**
     * 构建完整的产品图片映射数据库
     * 基于实际图片资源分析结果和39个产品的对应关系
     */
    buildImageDatabase() {
        return {
            // 高铝系列 - 有对应图片文件
            'high-alumina-brick': {
                primary: 'high-alumina-brick-new.jpg',
                alternatives: ['shaped_high_alumina_brick.jpg'],
                fallback: 'shaped_high_alumina_brick.jpg'
            },
            'shaped-high-alumina-brick': {
                primary: 'shaped_high_alumina_brick.jpg',
                alternatives: ['high-alumina-brick-new.jpg'],
                fallback: 'shaped_high_alumina_brick.jpg'
            },
            'lightweight-high-alumina-brick': {
                primary: 'shaped_lightweight_high_alumina_brick.jpg',
                alternatives: ['shaped_high_alumina_brick.jpg'],
                fallback: 'shaped_high_alumina_brick.jpg'
            },
            'alumina-hollow-sphere-brick': {
                primary: 'special_alumina_hollow_sphere_brick.jpg',
                alternatives: ['shaped_high_alumina_brick.jpg'],
                fallback: 'shaped_high_alumina_brick.jpg'
            },

            // 粘土系列
            'clay-brick': {
                primary: 'clay-brick-new.jpg',
                alternatives: ['shaped_clay_brick.jpg'],
                fallback: 'shaped_clay_brick.jpg'
            },
            'shaped-clay-brick': {
                primary: 'shaped_clay_brick.jpg',
                alternatives: ['clay-brick-new.jpg'],
                fallback: 'shaped_clay_brick.jpg'
            },
            'lightweight-clay-brick': {
                primary: 'shaped_lightweight_clay_brick.jpg',
                alternatives: ['shaped_clay_brick.jpg'],
                fallback: 'shaped_clay_brick.jpg'
            },

            // 硅质系列
            'silica-brick': {
                primary: 'silica-brick.jpg',
                alternatives: ['shaped_silica_brick.jpg'],
                fallback: 'shaped_silica_brick.jpg'
            },
            'shaped-silica-brick': {
                primary: 'shaped_silica_brick.jpg',
                alternatives: ['silica-brick.jpg'],
                fallback: 'shaped_silica_brick.jpg'
            },
            'hot-blast-furnace-silica-brick': {
                primary: 'shaped_hot_blast_furnace_silica_brick.jpg',
                alternatives: ['shaped_silica_brick.jpg'],
                fallback: 'shaped_silica_brick.jpg'
            },

            // 莫来石系列
            'sintered-mullite-brick': {
                primary: 'sintered-mullite-brick.jpg',
                alternatives: ['shaped_sintered_mullite_brick.jpg'],
                fallback: 'shaped_high_alumina_brick.jpg'
            },
            'shaped-mullite-brick': {
                primary: 'shaped_sintered_mullite_brick.jpg',
                alternatives: ['sintered-mullite-brick.jpg'],
                fallback: 'shaped_high_alumina_brick.jpg'
            },
            'lightweight-mullite-brick': {
                primary: 'shaped_lightweight_mullite_brick.jpg',
                alternatives: ['shaped_sintered_mullite_brick.jpg'],
                fallback: 'shaped_high_alumina_brick.jpg'
            },
            'mullite-light-brick': {
                primary: 'shaped_mullite_light_brick.jpg',
                alternatives: ['shaped_lightweight_mullite_brick.jpg'],
                fallback: 'shaped_high_alumina_brick.jpg'
            },
            'silica-mullite-brick': {
                primary: 'shaped_silica_mullite_brick.jpg',
                alternatives: ['shaped_sintered_mullite_brick.jpg'],
                fallback: 'shaped_silica_brick.jpg'
            },

            // 组合砖系列
            'combination-brick': {
                primary: 'shaped_combination_brick.jpg',
                alternatives: ['shaped_high_alumina_brick.jpg'],
                fallback: 'shaped_high_alumina_brick.jpg'
            },
            'shaped-combination-brick': {
                primary: 'shaped_combination_brick.jpg',
                alternatives: ['shaped_high_alumina_brick.jpg'],
                fallback: 'shaped_high_alumina_brick.jpg'
            },

            // 不定形耐火材料
            'alumina-castable': {
                primary: 'unshaped_high_alumina_castable.jpg',
                alternatives: ['shaped_high_alumina_brick.jpg'],
                fallback: 'shaped_high_alumina_brick.jpg'
            },

            // 特种耐火材料
            'corundum-ball': {
                primary: 'special_corundum_ball.jpg',
                alternatives: ['shaped_high_alumina_brick.jpg'],
                fallback: 'shaped_high_alumina_brick.jpg'
            },
            'ceramic-honeycomb-regenerator': {
                primary: 'lightweight_ceramic_honeycomb_regenerator.jpg',
                alternatives: ['shaped_high_alumina_brick.jpg'],
                fallback: 'shaped_high_alumina_brick.jpg'
            },

            // 保温材料系列 - 这些产品可能没有专门图片，使用相关备用图
            'insulating-material': {
                primary: 'shaped_lightweight_clay_brick.jpg',
                alternatives: ['shaped_lightweight_high_alumina_brick.jpg'],
                fallback: 'shaped_high_alumina_brick.jpg'
            },
            'thermal-insulation-brick': {
                primary: 'shaped_lightweight_fireclay_brick.jpg',
                alternatives: ['shaped_lightweight_clay_brick.jpg'],
                fallback: 'shaped_high_alumina_brick.jpg'
            },
            'wear-resistant-ceramic': {
                primary: 'shaped_high_alumina_brick.jpg',
                alternatives: ['special_corundum_ball.jpg'],
                fallback: 'shaped_high_alumina_brick.jpg'
            },

            // 轻质系列专用图片
            'lightweight-fireclay-brick': {
                primary: 'shaped_lightweight_fireclay_brick.jpg',
                alternatives: ['shaped_lightweight_clay_brick.jpg'],
                fallback: 'shaped_clay_brick.jpg'
            },

            // 默认配置 - 作为最终兜底方案
            'default': {
                primary: 'shaped_high_alumina_brick.jpg',
                alternatives: ['shaped_silica_brick.jpg', 'shaped_clay_brick.jpg'],
                fallback: 'shaped_high_alumina_brick.jpg'
            }
        };
    }

    /**
     * 初始化系统
     */
    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.initializeAdaptiveImages();
        });
    }

    /**
     * 初始化所有自适应图片容器
     */
    initializeAdaptiveImages() {
        const containers = document.querySelectorAll('.adaptive-images');
        containers.forEach(container => {
            this.setupImageContainer(container);
        });
    }

    /**
     * 设置单个图片容器
     */
    async setupImageContainer(container) {
        const productId = container.dataset.productId || 'default';
        const imageConfig = this.imageDatabase[productId] || this.imageDatabase['default'];

        // 获取主图元素
        const mainImage = container.querySelector('.main-image');
        const thumbnailsContainer = container.querySelector('#image-thumbnails');
        const statusIndicator = container.querySelector('.image-status');
        const noImagesPlaceholder = container.querySelector('.no-images-placeholder');

        if (!mainImage) return;

        // 显示加载状态
        this.showLoadingState(statusIndicator, mainImage);

        try {
            // 尝试加载主图（传递产品ID给验证系统）
            const availableImages = await this.getAvailableImages(imageConfig, productId);

            if (availableImages.length === 0) {
                // 无可用图片 - 显示占位符
                this.showNoImagesState(container, noImagesPlaceholder, statusIndicator);
            } else if (availableImages.length === 1) {
                // 单图模式
                this.setupSingleImageMode(container, mainImage, availableImages[0], statusIndicator);
            } else {
                // 多图模式
                this.setupMultiImageMode(container, mainImage, thumbnailsContainer, availableImages, statusIndicator);
            }
        } catch (error) {
            console.error('图片加载失败:', error);
            this.showNoImagesState(container, noImagesPlaceholder, statusIndicator);
        }
    }

    /**
     * 检查图片可用性（集成图片验证系统）
     */
    async getAvailableImages(imageConfig, productId = null) {
        // 如果图片验证系统可用，优先使用安全验证
        if (window.ImageValidator && productId) {
            try {
                const safeImage = await window.ImageValidator.getSafeImagePath(productId, imageConfig);
                return [{
                    path: safeImage.path,
                    name: safeImage.name,
                    isPrimary: safeImage.isPrimary,
                    isValidated: true,
                    risk: safeImage.risk || 'none',
                    isFallback: safeImage.isFallback || false
                }];
            } catch (error) {
                console.warn('⚠️ 图片验证系统失败，使用传统方法:', error);
            }
        }

        // 传统方法作为备用
        const imagesToCheck = [
            imageConfig.primary,
            ...imageConfig.alternatives,
            imageConfig.fallback
        ].filter(Boolean);

        const availableImages = [];

        for (const imagePath of imagesToCheck) {
            const fullPath = `../images/products/${imagePath}`;
            if (await this.imageExists(fullPath)) {
                availableImages.push({
                    path: fullPath,
                    name: imagePath,
                    isPrimary: imagePath === imageConfig.primary,
                    isValidated: false
                });
            }
        }

        return availableImages;
    }

    /**
     * 检查图片是否存在
     */
    imageExists(imagePath) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = imagePath;

            // 超时处理
            setTimeout(() => resolve(false), 3000);
        });
    }

    /**
     * 显示加载状态
     */
    showLoadingState(statusIndicator, mainImage) {
        if (statusIndicator) {
            statusIndicator.innerHTML = `
                <i class="fas fa-spinner fa-spin"></i>
                <span>图片加载中...</span>
            `;
            statusIndicator.classList.remove('hidden');
        }
        if (mainImage) {
            mainImage.classList.add('loading');
        }
    }

    /**
     * 显示无图片状态
     */
    showNoImagesState(container, placeholder, statusIndicator) {
        // 隐藏主图和缩略图
        const mainImageContainer = container.querySelector('.main-image-container');
        const thumbnailsContainer = container.querySelector('.image-thumbnails-container');

        if (mainImageContainer) mainImageContainer.style.display = 'none';
        if (thumbnailsContainer) thumbnailsContainer.style.display = 'none';

        // 显示占位符
        if (placeholder) {
            placeholder.classList.remove('hidden');
            placeholder.classList.add('fade-in');
        }

        // 隐藏状态指示器
        if (statusIndicator) {
            statusIndicator.classList.add('hidden');
        }
    }

    /**
     * 设置单图模式
     */
    setupSingleImageMode(container, mainImage, imageData, statusIndicator) {
        container.classList.add('single-image');

        // 设置主图
        mainImage.src = imageData.path;
        mainImage.alt = `产品图片 - ${imageData.name}`;

        // 图片加载完成后的处理
        mainImage.onload = () => {
            mainImage.classList.remove('loading');
            if (statusIndicator) {
                statusIndicator.classList.add('hidden');
            }
            mainImage.classList.add('fade-in');
        };

        mainImage.onerror = () => {
            this.showNoImagesState(container, container.querySelector('.no-images-placeholder'), statusIndicator);
        };
    }

    /**
     * 设置多图模式
     */
    setupMultiImageMode(container, mainImage, thumbnailsContainer, availableImages, statusIndicator) {
        container.classList.remove('single-image');

        // 设置主图（使用第一张可用图片）
        const primaryImage = availableImages[0];
        mainImage.src = primaryImage.path;
        mainImage.alt = `产品主图 - ${primaryImage.name}`;

        // 生成缩略图
        this.generateThumbnails(thumbnailsContainer, availableImages, mainImage);

        // 主图加载完成处理
        mainImage.onload = () => {
            mainImage.classList.remove('loading');
            if (statusIndicator) {
                statusIndicator.classList.add('hidden');
            }
            mainImage.classList.add('fade-in');
        };

        mainImage.onerror = () => {
            // 尝试下一张图片
            if (availableImages.length > 1) {
                availableImages.shift();
                this.setupMultiImageMode(container, mainImage, thumbnailsContainer, availableImages, statusIndicator);
            } else {
                this.showNoImagesState(container, container.querySelector('.no-images-placeholder'), statusIndicator);
            }
        };
    }

    /**
     * 生成缩略图
     */
    generateThumbnails(container, images, mainImage) {
        if (!container || images.length <= 1) return;

        container.innerHTML = '';

        images.forEach((imageData, index) => {
            const thumbBtn = document.createElement('button');
            thumbBtn.className = `thumb-btn ${index === 0 ? 'active' : ''}`;
            thumbBtn.innerHTML = `<img src="${imageData.path}" alt="产品图片 ${index + 1}">`;

            // 点击切换主图
            thumbBtn.addEventListener('click', () => {
                this.switchMainImage(mainImage, imageData, container);
                this.updateActiveThumbnail(container, thumbBtn);
            });

            container.appendChild(thumbBtn);
        });
    }

    /**
     * 切换主图
     */
    switchMainImage(mainImage, imageData, container) {
        mainImage.classList.add('loading');

        const tempImage = new Image();
        tempImage.onload = () => {
            mainImage.src = imageData.path;
            mainImage.alt = `产品图片 - ${imageData.name}`;
            mainImage.classList.remove('loading');
        };
        tempImage.onerror = () => {
            mainImage.classList.remove('loading');
            console.error('切换图片失败:', imageData.path);
        };
        tempImage.src = imageData.path;
    }

    /**
     * 更新活跃缩略图
     */
    updateActiveThumbnail(container, activeBtn) {
        const allThumbs = container.querySelectorAll('.thumb-btn');
        allThumbs.forEach(btn => btn.classList.remove('active'));
        activeBtn.classList.add('active');
    }

    /**
     * 刷新指定产品的图片展示
     */
    refreshProduct(productId) {
        const container = document.querySelector(`[data-product-id="${productId}"]`);
        if (container) {
            this.setupImageContainer(container);
        }
    }

    /**
     * 批量刷新所有产品图片
     */
    refreshAll() {
        this.initializeAdaptiveImages();
    }
}

// 全局实例化
window.AdaptiveImageSystem = new AdaptiveImageSystem();

// 暴露全局方法供外部调用
window.refreshProductImages = (productId) => {
    window.AdaptiveImageSystem.refreshProduct(productId);
};

window.refreshAllProductImages = () => {
    window.AdaptiveImageSystem.refreshAll();
};