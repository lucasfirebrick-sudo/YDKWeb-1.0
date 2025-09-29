/**
 * 中文网站添加语言切换器脚本
 * 使用 Node.js 运行: node add-language-switcher.js
 */

const fs = require('fs');
const path = require('path');

// 向HTML文件添加语言切换器脚本的函数
function addLanguageSwitcher(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');

        // 检查是否已经添加了语言切换器
        if (content.includes('language-switcher.js')) {
            console.log(`✓ ${filePath} 已经包含语言切换器`);
            return false;
        }

        // 查找脚本插入点的模式
        const scriptInsertPattern = /<\/body>\s*<\/html>/i;

        if (scriptInsertPattern.test(content)) {
            // 在关闭body标签前插入语言切换器脚本
            const languageSwitcherScript = `
    <!-- 语言切换器组件 -->
    <script src="js/language-switcher.js"></script>

</body>`;

            content = content.replace(/<\/body>/i, languageSwitcherScript);

            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`✓ 已向 ${filePath} 添加语言切换器`);
            return true;
        } else {
            console.log(`⚠ 无法在 ${filePath} 中找到插入点`);
            return false;
        }
    } catch (error) {
        console.error(`✗ 处理 ${filePath} 时出错:`, error.message);
        return false;
    }
}

// 递归查找所有HTML文件的函数
function findHTMLFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            // 跳过不必要的目录
            if (!['node_modules', '.git', 'css', 'js', 'images', 'data'].includes(file)) {
                findHTMLFiles(filePath, fileList);
            }
        } else if (file.endsWith('.html')) {
            fileList.push(filePath);
        }
    });

    return fileList;
}

// 主执行函数
function main() {
    const rootDir = __dirname;
    console.log('向所有HTML文件添加语言切换器...\n');

    // 查找所有HTML文件
    const htmlFiles = findHTMLFiles(rootDir);

    let addedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    // 处理每个HTML文件
    htmlFiles.forEach(filePath => {
        const relativePath = path.relative(rootDir, filePath);
        const result = addLanguageSwitcher(filePath);

        if (result === true) {
            addedCount++;
        } else if (result === false && !filePath.includes('language-switcher')) {
            skippedCount++;
        } else {
            errorCount++;
        }
    });

    // 摘要
    console.log('\n' + '='.repeat(50));
    console.log('语言切换器集成摘要');
    console.log('='.repeat(50));
    console.log(`找到的HTML文件总数: ${htmlFiles.length}`);
    console.log(`✓ 成功添加: ${addedCount}`);
    console.log(`- 已有切换器: ${skippedCount}`);
    console.log(`✗ 错误: ${errorCount}`);
    console.log('='.repeat(50));

    if (addedCount > 0) {
        console.log('\n✅ 语言切换器集成完成!');
        console.log('所有页面现在都支持中英文版本之间的切换。');
    }
}

// 运行脚本
main();