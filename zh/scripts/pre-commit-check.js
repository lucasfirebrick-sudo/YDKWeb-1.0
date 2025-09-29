#!/usr/bin/env node

/**
 * Git Pre-commit Hook 质量检查
 *
 * 在每次提交前自动执行质量检查，防止问题代码进入版本控制
 */

const { execSync } = require('child_process');
const path = require('path');
const QualityGate = require('./quality-gate');

class PreCommitCheck {
    constructor() {
        this.projectRoot = process.cwd();
        this.exitCode = 0;
    }

    async run() {
        console.log('🔍 Git Pre-commit 质量检查...\n');

        try {
            // 1. 运行质量门禁
            await this.runQualityGate();

            // 2. 检查暂存文件
            await this.checkStagedFiles();

            // 3. 验证文件命名
            await this.validateFileNaming();

            // 4. 检查文件大小
            await this.checkFileSizes();

            if (this.exitCode === 0) {
                console.log('✅ 所有检查通过，允许提交\n');
            } else {
                console.log('❌ 发现问题，阻止提交\n');
                console.log('请修复上述问题后重新提交');
            }

        } catch (error) {
            console.error('❌ Pre-commit检查失败:', error.message);
            this.exitCode = 1;
        }

        process.exit(this.exitCode);
    }

    // 运行质量门禁
    async runQualityGate() {
        try {
            const gate = new QualityGate(this.projectRoot);
            const passed = await gate.runFullCheck();

            if (!passed) {
                console.log('❌ 项目质量检查失败');
                this.exitCode = 1;
            }
        } catch (error) {
            console.log('⚠️  质量门禁检查出错:', error.message);
            // 质量门禁失败不阻止提交，但会发出警告
        }
    }

    // 检查暂存的文件
    async checkStagedFiles() {
        try {
            const stagedFiles = execSync('git diff --cached --name-only', { encoding: 'utf8' })
                .split('\n')
                .filter(file => file.trim() !== '');

            if (stagedFiles.length === 0) {
                console.log('⚠️  没有暂存的文件');
                return;
            }

            console.log(`📁 检查 ${stagedFiles.length} 个暂存文件:`);

            // 检查是否有备份文件
            const backupFiles = stagedFiles.filter(file => this.isBackupFile(file));
            if (backupFiles.length > 0) {
                console.log('❌ 发现备份文件在暂存区:');
                backupFiles.forEach(file => console.log(`   - ${file}`));
                console.log('   请移除这些备份文件');
                this.exitCode = 1;
            }

            // 检查是否有大文件
            const largeFiles = this.checkLargeFiles(stagedFiles);
            if (largeFiles.length > 0) {
                console.log('⚠️  发现大文件:');
                largeFiles.forEach(({ file, size }) => {
                    console.log(`   - ${file} (${(size / 1024 / 1024).toFixed(2)}MB)`);
                });
            }

            console.log('');

        } catch (error) {
            // 可能不在git仓库中
            console.log('ℹ️  不在Git仓库中，跳过暂存文件检查\n');
        }
    }

    // 验证文件命名规范
    async validateFileNaming() {
        const problematicFiles = [];

        // 检查所有相关文件
        const allFiles = this.getAllProjectFiles();

        for (const file of allFiles) {
            const filename = path.basename(file);

            // 检查命名规范
            if (this.hasNamingIssues(filename)) {
                problematicFiles.push({
                    file,
                    issues: this.getNamingIssues(filename)
                });
            }
        }

        if (problematicFiles.length > 0) {
            console.log('❌ 文件命名不规范:');
            problematicFiles.forEach(({ file, issues }) => {
                console.log(`   - ${file}`);
                issues.forEach(issue => console.log(`     * ${issue}`));
            });
            console.log('');
            this.exitCode = 1;
        }
    }

    // 检查文件大小
    async checkFileSizes() {
        const fs = require('fs');
        const sizeWarnings = [];
        const sizeErrors = [];

        const files = this.getAllProjectFiles();

        for (const file of files) {
            try {
                const fullPath = path.join(this.projectRoot, file);
                const stats = fs.statSync(fullPath);
                const sizeInMB = stats.size / 1024 / 1024;

                if (sizeInMB > 10) {  // 超过10MB
                    sizeErrors.push({ file, size: sizeInMB });
                } else if (sizeInMB > 1) {  // 超过1MB
                    sizeWarnings.push({ file, size: sizeInMB });
                }
            } catch (error) {
                // 忽略无法访问的文件
            }
        }

        if (sizeErrors.length > 0) {
            console.log('❌ 文件过大 (>10MB):');
            sizeErrors.forEach(({ file, size }) => {
                console.log(`   - ${file} (${size.toFixed(2)}MB)`);
            });
            this.exitCode = 1;
        }

        if (sizeWarnings.length > 0) {
            console.log('⚠️  文件较大 (>1MB):');
            sizeWarnings.forEach(({ file, size }) => {
                console.log(`   - ${file} (${size.toFixed(2)}MB)`);
            });
        }

        if (sizeErrors.length > 0 || sizeWarnings.length > 0) {
            console.log('');
        }
    }

    // 获取所有项目文件
    getAllProjectFiles() {
        const fs = require('fs');
        const files = [];

        const scanDir = (dir, relativePath = '') => {
            try {
                const items = fs.readdirSync(dir);

                for (const item of items) {
                    if (item === 'node_modules' || item === '.git' || item.startsWith('.')) {
                        continue;
                    }

                    const fullPath = path.join(dir, item);
                    const itemRelativePath = path.join(relativePath, item);

                    const stat = fs.statSync(fullPath);

                    if (stat.isDirectory()) {
                        scanDir(fullPath, itemRelativePath);
                    } else {
                        files.push(itemRelativePath);
                    }
                }
            } catch (error) {
                // 忽略无法访问的目录
            }
        };

        scanDir(this.projectRoot);
        return files;
    }

    // 检查是否为备份文件
    isBackupFile(filename) {
        const backupPatterns = [
            /backup/i, /old/i, /temp/i, /draft/i, /copy/i,
            /-\d{8}/, /-v\d+/, /\.bak$/i, /before-/i
        ];
        return backupPatterns.some(pattern => pattern.test(filename));
    }

    // 检查大文件
    checkLargeFiles(files) {
        const fs = require('fs');
        const largeFiles = [];

        for (const file of files) {
            try {
                const fullPath = path.join(this.projectRoot, file);
                const stats = fs.statSync(fullPath);

                if (stats.size > 1024 * 1024) {  // 超过1MB
                    largeFiles.push({ file, size: stats.size });
                }
            } catch (error) {
                // 忽略无法访问的文件
            }
        }

        return largeFiles;
    }

    // 检查文件命名问题
    hasNamingIssues(filename) {
        return this.getNamingIssues(filename).length > 0;
    }

    getNamingIssues(filename) {
        const issues = [];

        // 不应包含空格
        if (/\s/.test(filename)) {
            issues.push('包含空格');
        }

        // 不应包含特殊字符（除了 - _ .）
        if (/[^a-zA-Z0-9\-_.]/.test(filename)) {
            issues.push('包含特殊字符');
        }

        // CSS/JS文件应使用小写
        if (/\.(css|js)$/.test(filename) && /[A-Z]/.test(filename)) {
            issues.push('应使用小写字母');
        }

        // 不应以数字开头
        if (/^\d/.test(filename)) {
            issues.push('不应以数字开头');
        }

        return issues;
    }
}

// 如果直接运行此脚本
if (require.main === module) {
    const checker = new PreCommitCheck();
    checker.run();
}

module.exports = PreCommitCheck;