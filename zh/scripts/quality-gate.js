#!/usr/bin/env node

/**
 * 项目质量门禁系统
 *
 * 功能：
 * 1. 检查文件数量限制
 * 2. 识别重复和冗余文件
 * 3. 验证依赖关系
 * 4. 生成清理建议
 */

const fs = require('fs');
const path = require('path');

class QualityGate {
    constructor(projectRoot) {
        this.projectRoot = projectRoot;
        this.issues = [];
        this.stats = {
            totalFiles: 0,
            cssFiles: 0,
            jsFiles: 0,
            htmlFiles: 0,
            backupFiles: 0,
            duplicates: []
        };
    }

    // 执行完整的质量检查
    async runFullCheck() {
        console.log('🔍 开始项目质量检查...\n');

        await this.scanFiles();
        await this.checkFileLimits();
        await this.detectBackupFiles();
        await this.findDuplicateContent();
        await this.checkNamingConventions();

        this.generateReport();
        return this.issues.length === 0;
    }

    // 扫描所有文件
    async scanFiles() {
        const scanDir = (dir, relativePath = '') => {
            const items = fs.readdirSync(dir);

            for (const item of items) {
                const fullPath = path.join(dir, item);
                const relativeFilePath = path.join(relativePath, item);

                // 跳过 node_modules 和 .git
                if (item === 'node_modules' || item === '.git') continue;

                const stat = fs.statSync(fullPath);

                if (stat.isDirectory()) {
                    scanDir(fullPath, relativeFilePath);
                } else {
                    this.stats.totalFiles++;

                    if (item.endsWith('.css')) this.stats.cssFiles++;
                    if (item.endsWith('.js')) this.stats.jsFiles++;
                    if (item.endsWith('.html')) this.stats.htmlFiles++;

                    // 检查是否为备份文件
                    if (this.isBackupFile(item)) {
                        this.stats.backupFiles++;
                    }
                }
            }
        };

        scanDir(this.projectRoot);
    }

    // 检查文件数量限制
    checkFileLimits() {
        const limits = {
            css: { limit: 15, current: this.stats.cssFiles },
            js: { limit: 50, current: this.stats.jsFiles },
            backup: { limit: 0, current: this.stats.backupFiles }
        };

        for (const [type, data] of Object.entries(limits)) {
            if (data.current > data.limit) {
                this.addIssue('CRITICAL', `${type.toUpperCase()}文件数量超限`,
                    `当前 ${data.current} 个，限制 ${data.limit} 个`);
            }
        }
    }

    // 检测备份文件
    detectBackupFiles() {
        const backupFiles = this.findFilesByPattern([
            /backup/i,
            /old/i,
            /temp/i,
            /test.*(?!\.spec\.|\.test\.)/i,
            /draft/i,
            /copy/i,
            /-\d{8}/,  // 日期后缀
            /-v\d+/    // 版本后缀
        ]);

        if (backupFiles.length > 0) {
            this.addIssue('HIGH', '发现备份文件',
                `找到 ${backupFiles.length} 个备份文件，建议删除: ${backupFiles.slice(0, 5).join(', ')}`);
        }
    }

    // 查找重复内容
    findDuplicateContent() {
        const contentHashes = new Map();
        const duplicates = [];

        // 检查CSS文件重复
        const cssFiles = this.findFilesByExtension('.css');
        for (const file of cssFiles) {
            try {
                const content = fs.readFileSync(file, 'utf8');
                const hash = this.calculateHash(content);

                if (contentHashes.has(hash)) {
                    duplicates.push({
                        original: contentHashes.get(hash),
                        duplicate: file
                    });
                } else {
                    contentHashes.set(hash, file);
                }
            } catch (e) {
                // 忽略无法读取的文件
            }
        }

        if (duplicates.length > 0) {
            this.addIssue('MEDIUM', '发现重复文件',
                `${duplicates.length} 对重复文件需要合并`);
            this.stats.duplicates = duplicates;
        }
    }

    // 检查命名规范
    checkNamingConventions() {
        const problematicFiles = this.findFilesByPattern([
            /[A-Z]/,  // 包含大写字母
            /\s/,     // 包含空格
            /[^a-z0-9\-_.]/i  // 包含特殊字符
        ]);

        if (problematicFiles.length > 0) {
            this.addIssue('LOW', '文件命名不规范',
                `${problematicFiles.length} 个文件命名不符合规范`);
        }
    }

    // 工具方法
    isBackupFile(filename) {
        const backupPatterns = [
            /backup/i, /old/i, /temp/i, /draft/i, /copy/i,
            /-\d{8}/, /-v\d+/, /\.bak$/i
        ];
        return backupPatterns.some(pattern => pattern.test(filename));
    }

    findFilesByPattern(patterns) {
        const matches = [];
        const scanDir = (dir) => {
            const items = fs.readdirSync(dir);
            for (const item of items) {
                const fullPath = path.join(dir, item);
                if (fs.statSync(fullPath).isDirectory()) {
                    if (item !== 'node_modules' && item !== '.git') {
                        scanDir(fullPath);
                    }
                } else {
                    if (patterns.some(pattern => pattern.test(item))) {
                        matches.push(path.relative(this.projectRoot, fullPath));
                    }
                }
            }
        };
        scanDir(this.projectRoot);
        return matches;
    }

    findFilesByExtension(ext) {
        const matches = [];
        const scanDir = (dir) => {
            const items = fs.readdirSync(dir);
            for (const item of items) {
                const fullPath = path.join(dir, item);
                if (fs.statSync(fullPath).isDirectory()) {
                    if (item !== 'node_modules' && item !== '.git') {
                        scanDir(fullPath);
                    }
                } else if (item.endsWith(ext)) {
                    matches.push(fullPath);
                }
            }
        };
        scanDir(this.projectRoot);
        return matches;
    }

    calculateHash(content) {
        // 简单的内容哈希
        let hash = 0;
        for (let i = 0; i < content.length; i++) {
            const char = content.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // 转换为32位整数
        }
        return hash.toString();
    }

    addIssue(level, title, description) {
        this.issues.push({ level, title, description });
    }

    // 生成质量报告
    generateReport() {
        console.log('📊 项目质量报告');
        console.log('================\n');

        console.log('📈 文件统计：');
        console.log(`   总文件数: ${this.stats.totalFiles}`);
        console.log(`   CSS文件: ${this.stats.cssFiles} (限制: 15)`);
        console.log(`   JS文件: ${this.stats.jsFiles} (限制: 50)`);
        console.log(`   HTML文件: ${this.stats.htmlFiles}`);
        console.log(`   备份文件: ${this.stats.backupFiles} (应为: 0)`);
        console.log('');

        if (this.issues.length === 0) {
            console.log('✅ 所有质量检查通过！');
            return;
        }

        console.log('⚠️  发现以下问题：');
        const levelColors = {
            CRITICAL: '🔴',
            HIGH: '🟠',
            MEDIUM: '🟡',
            LOW: '🔵'
        };

        this.issues.forEach((issue, index) => {
            console.log(`${index + 1}. ${levelColors[issue.level]} ${issue.title}`);
            console.log(`   ${issue.description}\n`);
        });

        console.log(`\n❌ 发现 ${this.issues.length} 个问题需要解决`);
    }

    // 生成自动修复脚本
    generateCleanupScript() {
        const script = `#!/bin/bash
# 自动生成的清理脚本
# 运行前请确保已备份重要文件

echo "🧹 开始自动清理..."

# 删除备份文件
${this.findFilesByPattern([/backup/i, /old/i, /temp/i]).map(file =>
    `echo "删除: ${file}" && rm -f "${file}"`
).join('\n')}

echo "✅ 清理完成"
`;

        fs.writeFileSync(path.join(this.projectRoot, 'scripts', 'auto-cleanup.sh'), script);
        console.log('📝 已生成自动清理脚本: scripts/auto-cleanup.sh');
    }
}

// 如果直接运行此脚本
if (require.main === module) {
    const projectRoot = process.argv[2] || process.cwd();
    const gate = new QualityGate(projectRoot);

    gate.runFullCheck().then(passed => {
        if (!passed) {
            gate.generateCleanupScript();
            process.exit(1);
        }
        process.exit(0);
    });
}

module.exports = QualityGate;