/**
 * 智能路径解析器
 * 解决多层级目录下相对路径的问题
 */

class PathResolver {
    constructor() {
        this.currentPath = this.getCurrentPath();
        this.pathLevel = this.getPathLevel();
    }

    /**
     * 获取当前页面路径
     */
    getCurrentPath() {
        const path = window.location.pathname;
        return path.endsWith('/') ? path.slice(0, -1) : path;
    }

    /**
     * 计算当前路径的层级深度
     */
    getPathLevel() {
        const segments = this.currentPath.split('/').filter(seg => seg && seg !== '');

        // 根目录
        if (segments.length === 0) return 0;

        // 一级目录 (如 /products.html, /about.html)
        if (segments.length === 1) return 1;

        // 子目录 (如 /products/high-alumina-brick.html)
        return segments.length;
    }

    /**
     * 生成相对路径前缀
     */
    getRelativePrefix() {
        if (this.pathLevel <= 1) return './';
        return '../'.repeat(this.pathLevel - 1);
    }

    /**
     * 解析资源路径
     */
    resolvePath(path) {
        // 如果是绝对路径，直接返回
        if (path.startsWith('http') || path.startsWith('/')) {
            return path;
        }

        // 处理相对路径
        const prefix = this.getRelativePrefix();

        // 移除路径开头的 ./ 或 ../
        const cleanPath = path.replace(/^(\.\/|\.\.\/)+/, '');

        return prefix + cleanPath;
    }

    /**
     * 解析导航链接
     */
    resolveNavLink(href) {
        // 特殊处理首页链接
        if (href === 'index.html' || href === './index.html') {
            return this.pathLevel <= 1 ? 'index.html' : this.getRelativePrefix() + 'index.html';
        }

        return this.resolvePath(href);
    }

    /**
     * 解析图片路径
     */
    resolveImagePath(src) {
        if (!src) return src;

        // 处理已经包含相对路径的情况
        if (src.startsWith('../')) {
            // 计算当前../的数量
            const currentLevel = (src.match(/\.\.\//g) || []).length;
            const targetLevel = this.pathLevel - 1;

            if (currentLevel !== targetLevel) {
                const cleanSrc = src.replace(/^(\.\.\/)+/, '');
                return '../'.repeat(Math.max(0, targetLevel)) + cleanSrc;
            }
        }

        return this.resolvePath(src);
    }

    /**
     * 批量解析页面中的所有链接和资源
     */
    resolvePagePaths() {
        // 解析导航链接
        document.querySelectorAll('nav a[href]').forEach(link => {
            const href = link.getAttribute('href');
            if (href && !href.startsWith('http') && !href.startsWith('#') && !href.startsWith('tel:') && !href.startsWith('mailto:')) {
                link.setAttribute('href', this.resolveNavLink(href));
            }
        });

        // 解析图片路径
        document.querySelectorAll('img[src]').forEach(img => {
            const src = img.getAttribute('src');
            if (src && !src.startsWith('http') && !src.startsWith('data:')) {
                img.setAttribute('src', this.resolveImagePath(src));
            }
        });

        // 解析CSS链接
        document.querySelectorAll('link[href]').forEach(link => {
            const href = link.getAttribute('href');
            if (href && href.endsWith('.css') && !href.startsWith('http')) {
                link.setAttribute('href', this.resolvePath(href));
            }
        });

        // 解析JS脚本
        document.querySelectorAll('script[src]').forEach(script => {
            const src = script.getAttribute('src');
            if (src && src.endsWith('.js') && !src.startsWith('http')) {
                script.setAttribute('src', this.resolvePath(src));
            }
        });
    }

    /**
     * 为模板渲染提供路径上下文
     */
    getPathContext() {
        return {
            level: this.pathLevel,
            prefix: this.getRelativePrefix(),
            isRoot: this.pathLevel <= 1,
            isProduct: this.currentPath.includes('/products/'),
            isApplication: this.currentPath.includes('/applications/')
        };
    }

    /**
     * 调试信息
     */
    debug() {
        console.log('PathResolver Debug Info:', {
            currentPath: this.currentPath,
            pathLevel: this.pathLevel,
            relativePrefix: this.getRelativePrefix(),
            context: this.getPathContext()
        });
    }
}

// 创建全局实例
window.pathResolver = new PathResolver();

// 页面加载完成后自动解析路径
document.addEventListener('DOMContentLoaded', function() {
    // 延迟执行，确保所有内容都已加载
    setTimeout(() => {
        window.pathResolver.resolvePagePaths();
    }, 100);
});

// 导出供Node.js环境使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PathResolver;
}