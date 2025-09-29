#!/usr/bin/env node

/**
 * 批量更新应用页面 - Navbar和Footer统一脚本
 * =======================================
 */

const fs = require('fs');
const path = require('path');

// 应用页面目录
const APPLICATIONS_DIR = './applications';

// 需要替换的CSS文件映射
const CSS_REPLACEMENTS = [
    {
        old: 'css/components/navigation.css',
        new: 'css/unified-navigation-footer.css?v=1.0'
    },
    {
        old: 'css/components/footer.css',
        remove: true
    },
    {
        old: 'css/footer-redesign.css',
        remove: true
    }
];

// 硬编码导航的匹配模式
const NAVBAR_PATTERNS = [
    /<header[^>]*class="navbar"[^>]*>[\s\S]*?<\/header>/g,
    /<nav[^>]*class="navbar"[^>]*>[\s\S]*?<\/nav>/g,
    /<!-- 页面头部 -->[\s\S]*?<\/header>/g
];

console.log('🚀 开始批量更新应用页面...');

function updateApplicationPage(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        let updated = false;

        // 1. 移除硬编码导航
        NAVBAR_PATTERNS.forEach(pattern => {
            if (pattern.test(content)) {
                content = content.replace(pattern, '    <!-- 导航栏将由navigation-loader.js动态加载 -->');
                updated = true;
                console.log(`  ✅ 移除硬编码导航: ${path.basename(filePath)}`);
            }
        });

        // 2. 更新CSS引用
        CSS_REPLACEMENTS.forEach(replacement => {
            const oldPattern = new RegExp(`<link[^>]*href="[^"]*${replacement.old}[^"]*"[^>]*>`, 'g');
            if (oldPattern.test(content)) {
                if (replacement.remove) {
                    content = content.replace(oldPattern, '');
                    console.log(`  🗑️  移除CSS文件: ${replacement.old} from ${path.basename(filePath)}`);
                } else {
                    content = content.replace(oldPattern, `<link rel="stylesheet" href="../${replacement.new}">`);
                    console.log(`  🔄 更新CSS文件: ${replacement.old} -> ../${replacement.new} in ${path.basename(filePath)}`);
                }
                updated = true;
            }
        });

        // 3. 添加core-base.css和unified-navigation-footer.css (注意路径前缀)
        const coreBasePattern = /href="[^"]*core-base\.css/;
        const unifiedNavFooterPattern = /href="[^"]*unified-navigation-footer\.css/;

        if (!coreBasePattern.test(content)) {
            // 在第一个CSS引用前添加core-base.css
            content = content.replace(
                /(<link[^>]*rel="stylesheet"[^>]*>)/,
                '<link rel="stylesheet" href="../css/core-base.css?v=2.1">\n    $1'
            );
            console.log(`  ➕ 添加核心样式: ../core-base.css to ${path.basename(filePath)}`);
            updated = true;
        }

        if (!unifiedNavFooterPattern.test(content)) {
            // 在core-base.css后添加unified-navigation-footer.css
            content = content.replace(
                /(<link[^>]*href="[^"]*core-base\.css[^>]*>)/,
                '$1\n    <link rel="stylesheet" href="../css/unified-navigation-footer.css?v=1.0">'
            );
            console.log(`  ➕ 添加统一导航Footer样式: ${path.basename(filePath)}`);
            updated = true;
        }

        // 4. 确保navigation-loader.js引用存在 (注意路径前缀)
        const navLoaderPattern = /src="[^"]*navigation-loader\.js"/;
        if (!navLoaderPattern.test(content)) {
            // 在footer-loader.js前添加navigation-loader.js
            const footerLoaderPattern = /(<script[^>]*src="[^"]*footer-loader\.js"[^>]*>)/;
            if (footerLoaderPattern.test(content)) {
                content = content.replace(
                    footerLoaderPattern,
                    '<script src="../js/navigation-loader.js"></script>\n    $1'
                );
                console.log(`  ➕ 添加导航加载脚本: ${path.basename(filePath)}`);
                updated = true;
            }
        }

        // 5. 写回文件
        if (updated) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`  ✅ 更新完成: ${path.basename(filePath)}`);
            return true;
        } else {
            console.log(`  ⏭️  无需更新: ${path.basename(filePath)}`);
            return false;
        }

    } catch (error) {
        console.error(`  ❌ 更新失败: ${path.basename(filePath)} - ${error.message}`);
        return false;
    }
}

// 主处理函数
function main() {
    if (!fs.existsSync(APPLICATIONS_DIR)) {
        console.error(`❌ 应用目录不存在: ${APPLICATIONS_DIR}`);
        return;
    }

    const files = fs.readdirSync(APPLICATIONS_DIR)
        .filter(file => file.endsWith('.html'))
        .filter(file => !file.includes('backup') && !file.includes('before'))
        .map(file => path.join(APPLICATIONS_DIR, file));

    console.log(`📁 发现 ${files.length} 个应用页面文件`);
    console.log('');

    let successCount = 0;
    let totalCount = files.length;

    files.forEach((file, index) => {
        console.log(`[${index + 1}/${totalCount}] 处理: ${path.basename(file)}`);
        if (updateApplicationPage(file)) {
            successCount++;
        }
        console.log('');
    });

    console.log('📊 批量更新统计:');
    console.log(`  ✅ 成功更新: ${successCount} 个文件`);
    console.log(`  ⏭️  无需更新: ${totalCount - successCount} 个文件`);
    console.log(`  📁 总计处理: ${totalCount} 个文件`);
    console.log('');
    console.log('🎉 应用页面批量更新完成！');
}

// 运行脚本
main();