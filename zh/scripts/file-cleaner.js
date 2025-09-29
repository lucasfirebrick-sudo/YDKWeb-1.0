#!/usr/bin/env node

/**
 * 智能文件清理工具
 *
 * 功能：
 * 1. 安全删除备份和临时文件
 * 2. 合并重复的CSS/JS文件
 * 3. 清理未使用的资源
 * 4. 生成清理报告
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

class FileCleaner {
    constructor(projectRoot) {
        this.projectRoot = projectRoot;
        this.deleted = [];
        this.merged = [];
        this.errors = [];

        // 创建 readline 接口用于用户交互
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }

    async runCleanup() {
        console.log('🧹 开始智能文件清理...\n');

        try {
            // 第一步：清理备份文件
            await this.cleanBackupFiles();

            // 第二步：处理重复文件
            await this.handleDuplicateFiles();

            // 第三步：清理孤立文件
            await this.cleanOrphanedFiles();

            // 生成清理报告
            this.generateCleanupReport();

        } catch (error) {
            console.error('❌ 清理过程中发生错误:', error.message);
        } finally {
            this.rl.close();
        }
    }

    // 清理备份文件
    async cleanBackupFiles() {
        console.log('🗑️  查找备份文件...');

        const backupFiles = this.findBackupFiles();

        if (backupFiles.length === 0) {
            console.log('✅ 没有发现备份文件\n');
            return;
        }

        console.log(`发现 ${backupFiles.length} 个备份文件:`);
        backupFiles.forEach((file, index) => {
            console.log(`${index + 1}. ${file}`);
        });

        const answer = await this.askQuestion('\n是否删除这些备份文件? (y/n): ');

        if (answer.toLowerCase() === 'y') {
            for (const file of backupFiles) {
                try {
                    const fullPath = path.join(this.projectRoot, file);
                    fs.unlinkSync(fullPath);
                    this.deleted.push(file);
                    console.log(`删除: ${file}`);
                } catch (error) {
                    this.errors.push({ file, error: error.message });
                    console.log(`❌ 删除失败: ${file} - ${error.message}`);
                }
            }
        }
        console.log('');
    }

    // 处理重复文件
    async handleDuplicateFiles() {
        console.log('🔄 查找重复文件...');

        const duplicates = this.findDuplicateFiles();

        if (duplicates.length === 0) {
            console.log('✅ 没有发现重复文件\n');
            return;
        }

        console.log(`发现 ${duplicates.length} 组重复文件:`);

        for (let i = 0; i < duplicates.length; i++) {
            const group = duplicates[i];
            console.log(`\n组 ${i + 1}:`);
            group.files.forEach((file, index) => {
                const size = fs.statSync(path.join(this.projectRoot, file)).size;
                console.log(`  ${index + 1}. ${file} (${size} bytes)`);
            });

            const answer = await this.askQuestion('是否删除重复文件? (y/n/s=skip): ');

            if (answer.toLowerCase() === 'y') {
                // 保留第一个，删除其余
                const [keep, ...remove] = group.files;
                console.log(`保留: ${keep}`);

                for (const file of remove) {
                    try {
                        const fullPath = path.join(this.projectRoot, file);
                        fs.unlinkSync(fullPath);
                        this.deleted.push(file);
                        console.log(`删除: ${file}`);
                    } catch (error) {
                        this.errors.push({ file, error: error.message });
                    }
                }
            }
        }
        console.log('');
    }

    // 清理孤立文件
    async cleanOrphanedFiles() {
        console.log('🔍 查找孤立文件...');

        const orphanedFiles = this.findOrphanedFiles();

        if (orphanedFiles.length === 0) {
            console.log('✅ 没有发现孤立文件\n');
            return;
        }

        console.log(`发现 ${orphanedFiles.length} 个可能的孤立文件:`);
        orphanedFiles.forEach((file, index) => {
            console.log(`${index + 1}. ${file}`);
        });

        const answer = await this.askQuestion('\n查看详细分析? (y/n): ');

        if (answer.toLowerCase() === 'y') {
            await this.analyzeOrphanedFiles(orphanedFiles);
        }
        console.log('');
    }

    // 查找备份文件
    findBackupFiles() {
        const backupPatterns = [
            /backup/i,
            /old/i,
            /temp/i,
            /draft/i,
            /copy/i,
            /-\d{8}/,      // 日期后缀
            /-v\d+/,       // 版本后缀
            /\.bak$/i,     // .bak扩展名
            /before-/i,    // before-前缀
            /archived/i    // archived
        ];

        return this.scanFiles((filename, relativePath) => {
            return backupPatterns.some(pattern => pattern.test(filename));
        });
    }

    // 查找重复文件
    findDuplicateFiles() {
        const fileGroups = new Map();

        // 按文件内容分组
        const files = this.scanFiles((filename, relativePath) => {
            return filename.endsWith('.css') || filename.endsWith('.js');
        });

        for (const file of files) {
            try {
                const fullPath = path.join(this.projectRoot, file);
                const content = fs.readFileSync(fullPath, 'utf8');
                const normalizedContent = this.normalizeContent(content);
                const hash = this.simpleHash(normalizedContent);

                if (!fileGroups.has(hash)) {
                    fileGroups.set(hash, []);
                }
                fileGroups.get(hash).push(file);
            } catch (error) {
                // 忽略无法读取的文件
            }
        }

        // 只返回有多个文件的组
        return Array.from(fileGroups.values())
            .filter(group => group.length > 1)
            .map(files => ({ files, hash: this.simpleHash(files[0]) }));
    }

    // 查找孤立文件
    findOrphanedFiles() {
        // 找到所有CSS和JS文件
        const resourceFiles = this.scanFiles((filename) => {
            return filename.endsWith('.css') || filename.endsWith('.js');
        });

        // 找到所有HTML文件内容
        const htmlFiles = this.scanFiles((filename) => {
            return filename.endsWith('.html');
        });

        let allHtmlContent = '';
        for (const htmlFile of htmlFiles) {
            try {
                const fullPath = path.join(this.projectRoot, htmlFile);
                allHtmlContent += fs.readFileSync(fullPath, 'utf8') + '\n';
            } catch (error) {
                // 忽略无法读取的文件
            }
        }

        // 检查哪些资源文件没有被引用
        const orphaned = resourceFiles.filter(file => {
            const filename = path.basename(file);
            const filenameWithoutExt = path.basename(file, path.extname(file));

            return !allHtmlContent.includes(filename) &&
                   !allHtmlContent.includes(filenameWithoutExt);
        });

        return orphaned;
    }

    // 扫描文件的通用方法
    scanFiles(filterFn) {
        const results = [];

        const scanDir = (dir, relativePath = '') => {
            try {
                const items = fs.readdirSync(dir);

                for (const item of items) {
                    // 跳过特定目录
                    if (item === 'node_modules' || item === '.git' || item.startsWith('.')) {
                        continue;
                    }

                    const fullPath = path.join(dir, item);
                    const itemRelativePath = path.join(relativePath, item);

                    const stat = fs.statSync(fullPath);

                    if (stat.isDirectory()) {
                        scanDir(fullPath, itemRelativePath);
                    } else if (filterFn(item, itemRelativePath)) {
                        results.push(itemRelativePath);
                    }
                }
            } catch (error) {
                // 忽略无法访问的目录
            }
        };

        scanDir(this.projectRoot);
        return results;
    }

    // 内容规范化（用于比较）
    normalizeContent(content) {
        return content
            .replace(/\/\*[\s\S]*?\*\//g, '')  // 删除注释
            .replace(/\s+/g, ' ')              // 规范化空白字符
            .trim();
    }

    // 简单哈希函数
    simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash.toString();
    }

    // 分析孤立文件
    async analyzeOrphanedFiles(orphanedFiles) {
        for (const file of orphanedFiles) {
            console.log(`\n分析: ${file}`);

            try {
                const fullPath = path.join(this.projectRoot, file);
                const content = fs.readFileSync(fullPath, 'utf8');
                const lines = content.split('\n').length;
                const size = fs.statSync(fullPath).size;

                console.log(`  文件大小: ${size} bytes`);
                console.log(`  行数: ${lines}`);

                // 检查是否包含重要内容
                const hasImportantContent = this.hasImportantContent(content);
                if (hasImportantContent) {
                    console.log(`  ⚠️  可能包含重要内容，建议手动检查`);
                } else {
                    console.log(`  ✅ 看起来可以安全删除`);
                }
            } catch (error) {
                console.log(`  ❌ 无法分析: ${error.message}`);
            }
        }
    }

    // 检查是否包含重要内容
    hasImportantContent(content) {
        const importantPatterns = [
            /function\s+\w+/,    // 函数定义
            /class\s+\w+/,       // 类定义
            /export/,            // 导出
            /import/,            // 导入
            /@media/,            // 媒体查询
            /keyframes/,         // 动画
        ];

        return importantPatterns.some(pattern => pattern.test(content));
    }

    // 询问用户
    askQuestion(question) {
        return new Promise((resolve) => {
            this.rl.question(question, (answer) => {
                resolve(answer);
            });
        });
    }

    // 生成清理报告
    generateCleanupReport() {
        console.log('\n📋 清理报告');
        console.log('============\n');

        console.log(`✅ 删除文件: ${this.deleted.length} 个`);
        if (this.deleted.length > 0) {
            this.deleted.forEach(file => console.log(`  - ${file}`));
        }

        console.log(`\n🔄 合并文件: ${this.merged.length} 组`);
        if (this.merged.length > 0) {
            this.merged.forEach(merge => console.log(`  - ${merge.from} → ${merge.to}`));
        }

        if (this.errors.length > 0) {
            console.log(`\n❌ 错误: ${this.errors.length} 个`);
            this.errors.forEach(error => console.log(`  - ${error.file}: ${error.error}`));
        }

        // 保存报告到文件
        const report = {
            timestamp: new Date().toISOString(),
            deleted: this.deleted,
            merged: this.merged,
            errors: this.errors
        };

        const reportPath = path.join(this.projectRoot, 'cleanup-report.json');
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
        console.log(`\n📄 详细报告已保存到: cleanup-report.json`);
    }
}

// 如果直接运行此脚本
if (require.main === module) {
    const projectRoot = process.argv[2] || process.cwd();
    const cleaner = new FileCleaner(projectRoot);

    cleaner.runCleanup();
}

module.exports = FileCleaner;