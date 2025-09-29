/**
 * 性能优化工具类 - 提供资源加载优化、代码分割和缓存管理
 * 支持懒加载、预加载和智能资源管理
 */

class PerformanceOptimizer {
    constructor() {
        this.loadedResources = new Set();
        this.observers = new Map();
        this.criticalResources = new Set();
        this.deferredResources = new Set();
        this.performanceMetrics = {};

        // 性能监控配置
        this.config = {
            enableLazyLoading: true,
            enablePreloading: true,
            enableResourceHints: true,
            enableCriticalCSS: true,
            enableServiceWorker: false, // 可根据需要启用
            cacheVersion: '1.0.0'
        };

        this.init();
    }

    /**
     * 初始化性能优化器
     */
    init() {
        this.measureInitialPerformance();
        this.setupIntersectionObserver();
        this.optimizeResourceLoading();
        this.setupImageLazyLoading();
        this.enablePrefetching();

        console.log('✅ 性能优化器初始化完成');
    }

    /**
     * 测量初始性能指标
     */
    measureInitialPerformance() {
        if ('performance' in window) {
            // 页面加载时间
            window.addEventListener('load', () => {
                const navigation = performance.getEntriesByType('navigation')[0];
                this.performanceMetrics.pageLoadTime = navigation.loadEventEnd - navigation.fetchStart;
                this.performanceMetrics.domContentLoaded = navigation.domContentLoadedEventEnd - navigation.fetchStart;
                this.performanceMetrics.firstPaint = this.getFirstPaint();

                this.reportPerformanceMetrics();
            });
        }
    }

    /**
     * 获取首次绘制时间
     */
    getFirstPaint() {
        const paintEntries = performance.getEntriesByType('paint');
        const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
        return firstPaint ? firstPaint.startTime : null;
    }

    /**
     * 设置交叉观察器用于懒加载
     */
    setupIntersectionObserver() {
        if (!('IntersectionObserver' in window)) {
            console.warn('⚠️ IntersectionObserver 不支持，启用备用懒加载方案');
            this.enableFallbackLazyLoading();
            return;
        }

        // 图片懒加载观察器
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadImage(entry.target);
                    imageObserver.unobserve(entry.target);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.1
        });

        // 内容懒加载观察器
        const contentObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadDeferredContent(entry.target);
                    contentObserver.unobserve(entry.target);
                }
            });
        }, {
            rootMargin: '100px 0px',
            threshold: 0.1
        });

        this.observers.set('image', imageObserver);
        this.observers.set('content', contentObserver);
    }

    /**
     * 设置图片懒加载
     */
    setupImageLazyLoading() {
        if (!this.config.enableLazyLoading) return;

        const lazyImages = document.querySelectorAll('img[data-src], img[loading="lazy"]');
        const imageObserver = this.observers.get('image');

        if (imageObserver) {
            lazyImages.forEach(img => {
                // 设置占位符
                if (!img.src && !img.getAttribute('data-src')) {
                    img.src = this.generatePlaceholder(img.width || 300, img.height || 200);
                }
                imageObserver.observe(img);
            });
        }
    }

    /**
     * 加载图片
     */
    loadImage(img) {
        const src = img.getAttribute('data-src') || img.src;
        if (!src || this.loadedResources.has(src)) return;

        // 创建新图片对象预加载
        const newImg = new Image();
        newImg.onload = () => {
            img.src = src;
            img.removeAttribute('data-src');
            img.classList.add('loaded');
            this.loadedResources.add(src);
        };

        newImg.onerror = () => {
            img.classList.add('error');
            console.warn(`⚠️ 图片加载失败: ${src}`);
        };

        newImg.src = src;
    }

    /**
     * 生成占位符图片
     */
    generatePlaceholder(width, height) {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        // 灰色渐变背景
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, '#f0f0f0');
        gradient.addColorStop(1, '#e0e0e0');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        return canvas.toDataURL();
    }

    /**
     * 优化资源加载
     */
    optimizeResourceLoading() {
        // 标记关键资源
        this.markCriticalResources();

        // 预加载关键资源
        this.preloadCriticalResources();

        // 延迟加载非关键资源
        this.deferNonCriticalResources();

        // 添加资源提示
        if (this.config.enableResourceHints) {
            this.addResourceHints();
        }
    }

    /**
     * 标记关键资源
     */
    markCriticalResources() {
        // CSS文件
        const criticalCSS = [
            'css/style.css',
            'css/components/navigation.css',
            'css/components/footer.css'
        ];

        // JavaScript文件
        const criticalJS = [
            'js/utils/path-resolver.js',
            'js/components/dynamic-navigation.js'
        ];

        criticalCSS.forEach(css => this.criticalResources.add(css));
        criticalJS.forEach(js => this.criticalResources.add(js));
    }

    /**
     * 预加载关键资源
     */
    preloadCriticalResources() {
        if (!this.config.enablePreloading) return;

        this.criticalResources.forEach(resource => {
            if (this.loadedResources.has(resource)) return;

            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource;

            if (resource.endsWith('.css')) {
                link.as = 'style';
            } else if (resource.endsWith('.js')) {
                link.as = 'script';
            } else if (this.isImageFile(resource)) {
                link.as = 'image';
            }

            link.onload = () => this.loadedResources.add(resource);
            document.head.appendChild(link);
        });
    }

    /**
     * 延迟加载非关键资源
     */
    deferNonCriticalResources() {
        // 延迟加载的JavaScript
        const deferredScripts = [
            'js/components/mobile-menu.js',
            'js/components/scroll-effects.js',
            'js/utils/analytics.js'
        ];

        deferredScripts.forEach(script => {
            this.deferredResources.add(script);
        });

        // 在页面加载完成后加载延迟资源
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(() => this.loadDeferredResources(), 100);
            });
        } else {
            setTimeout(() => this.loadDeferredResources(), 100);
        }
    }

    /**
     * 加载延迟资源
     */
    loadDeferredResources() {
        this.deferredResources.forEach(resource => {
            if (this.loadedResources.has(resource)) return;

            if (resource.endsWith('.js')) {
                this.loadScript(resource);
            } else if (resource.endsWith('.css')) {
                this.loadStylesheet(resource);
            }
        });
    }

    /**
     * 动态加载脚本
     */
    loadScript(src, callback) {
        if (this.loadedResources.has(src)) {
            if (callback) callback();
            return;
        }

        const script = document.createElement('script');
        script.src = src;
        script.defer = true;
        script.onload = () => {
            this.loadedResources.add(src);
            if (callback) callback();
        };
        script.onerror = () => {
            console.error(`❌ 脚本加载失败: ${src}`);
        };

        document.head.appendChild(script);
    }

    /**
     * 动态加载样式表
     */
    loadStylesheet(href, callback) {
        if (this.loadedResources.has(href)) {
            if (callback) callback();
            return;
        }

        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        link.onload = () => {
            this.loadedResources.add(href);
            if (callback) callback();
        };
        link.onerror = () => {
            console.error(`❌ 样式表加载失败: ${href}`);
        };

        document.head.appendChild(link);
    }

    /**
     * 添加资源提示
     */
    addResourceHints() {
        // DNS预解析
        const domains = [
            'cdnjs.cloudflare.com',
            'fonts.googleapis.com',
            'fonts.gstatic.com'
        ];

        domains.forEach(domain => {
            const link = document.createElement('link');
            link.rel = 'dns-prefetch';
            link.href = `//${domain}`;
            document.head.appendChild(link);
        });

        // 预连接关键第三方域名
        const preconnectDomains = ['fonts.googleapis.com'];
        preconnectDomains.forEach(domain => {
            const link = document.createElement('link');
            link.rel = 'preconnect';
            link.href = `https://${domain}`;
            link.crossOrigin = 'anonymous';
            document.head.appendChild(link);
        });
    }

    /**
     * 启用预取功能
     */
    enablePrefetching() {
        if (!this.config.enablePreloading) return;

        // 预取可能访问的页面
        const prefetchLinks = document.querySelectorAll('a[data-prefetch]');
        prefetchLinks.forEach(link => {
            link.addEventListener('mouseenter', () => {
                this.prefetchPage(link.href);
            }, { once: true });
        });
    }

    /**
     * 预取页面资源
     */
    prefetchPage(url) {
        if (this.loadedResources.has(url)) return;

        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = url;
        link.onload = () => this.loadedResources.add(url);
        document.head.appendChild(link);
    }

    /**
     * 启用备用懒加载方案
     */
    enableFallbackLazyLoading() {
        let lazyImages = document.querySelectorAll('img[data-src]');

        const loadImagesInViewport = () => {
            lazyImages.forEach(img => {
                const rect = img.getBoundingClientRect();
                if (rect.top < window.innerHeight + 100 && rect.bottom > -100) {
                    this.loadImage(img);
                }
            });

            // 移除已加载的图片
            lazyImages = Array.from(lazyImages).filter(img =>
                img.hasAttribute('data-src')
            );
        };

        // 初始检查
        loadImagesInViewport();

        // 绑定滚动事件（节流处理）
        let ticking = false;
        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    loadImagesInViewport();
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', handleScroll, { passive: true });
    }

    /**
     * 加载延迟内容
     */
    loadDeferredContent(element) {
        const src = element.getAttribute('data-src');
        if (src) {
            element.src = src;
            element.removeAttribute('data-src');
        }

        const content = element.getAttribute('data-content');
        if (content) {
            element.innerHTML = content;
            element.removeAttribute('data-content');
        }

        element.classList.add('loaded');
    }

    /**
     * 检查是否为图片文件
     */
    isImageFile(url) {
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.avif', '.svg'];
        return imageExtensions.some(ext => url.toLowerCase().includes(ext));
    }

    /**
     * 报告性能指标
     */
    reportPerformanceMetrics() {
        const metrics = {
            ...this.performanceMetrics,
            loadedResources: this.loadedResources.size,
            timestamp: new Date().toISOString()
        };

        console.log('📊 性能指标:', metrics);

        // 发送到分析服务（如果配置）
        if (window.gtag) {
            window.gtag('event', 'page_performance', {
                event_category: 'Performance',
                page_load_time: Math.round(metrics.pageLoadTime),
                dom_content_loaded: Math.round(metrics.domContentLoaded),
                first_paint: Math.round(metrics.firstPaint || 0)
            });
        }
    }

    /**
     * 获取性能状态
     */
    getPerformanceState() {
        return {
            config: this.config,
            loadedResources: Array.from(this.loadedResources),
            criticalResources: Array.from(this.criticalResources),
            deferredResources: Array.from(this.deferredResources),
            metrics: this.performanceMetrics,
            observers: Array.from(this.observers.keys())
        };
    }

    /**
     * 更新配置
     */
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
    }

    /**
     * 清理资源
     */
    cleanup() {
        // 断开所有观察器
        this.observers.forEach(observer => observer.disconnect());
        this.observers.clear();

        // 清理加载的资源记录
        this.loadedResources.clear();
        this.criticalResources.clear();
        this.deferredResources.clear();

        console.log('🧹 性能优化器已清理');
    }

    /**
     * 调试信息
     */
    debug() {
        console.log('Performance Optimizer Debug Info:', this.getPerformanceState());
    }
}

// 创建全局实例
window.performanceOptimizer = new PerformanceOptimizer();

// 导出供Node.js环境使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PerformanceOptimizer;
}