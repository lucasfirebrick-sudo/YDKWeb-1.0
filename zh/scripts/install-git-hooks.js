#!/usr/bin/env node

/**
 * Git Hooks 自动安装脚本
 *
 * 设置 pre-commit 和 pre-push hooks 来强制执行项目质量规则
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class GitHooksInstaller {
    constructor() {
        this.projectRoot = process.cwd();
        this.gitHooksDir = path.join(this.projectRoot, '.git', 'hooks');
    }

    install() {
        console.log('🔧 安装Git质量检查hooks...\n');

        try {
            // 检查是否为Git仓库
            if (!this.isGitRepo()) {
                console.log('❌ 当前目录不是Git仓库，正在初始化...');
                this.initGitRepo();
            }

            // 创建hooks目录（如果不存在）
            this.ensureHooksDir();

            // 安装pre-commit hook
            this.installPreCommitHook();

            // 安装pre-push hook
            this.installPrePushHook();

            // 设置执行权限
            this.setExecutePermissions();

            console.log('✅ Git hooks安装完成！\n');
            console.log('现在每次提交都会自动执行质量检查');

        } catch (error) {
            console.error('❌ Git hooks安装失败:', error.message);
            process.exit(1);
        }
    }

    isGitRepo() {
        try {
            execSync('git rev-parse --git-dir', { stdio: 'ignore' });
            return true;
        } catch (error) {
            return false;
        }
    }

    initGitRepo() {
        try {
            execSync('git init', { stdio: 'inherit' });
            console.log('✅ Git仓库初始化完成');
        } catch (error) {
            throw new Error('无法初始化Git仓库: ' + error.message);
        }
    }

    ensureHooksDir() {
        if (!fs.existsSync(this.gitHooksDir)) {
            fs.mkdirSync(this.gitHooksDir, { recursive: true });
            console.log('📁 创建hooks目录');
        }
    }

    installPreCommitHook() {
        const hookPath = path.join(this.gitHooksDir, 'pre-commit');

        const hookContent = `#!/bin/sh
#
# 自动生成的pre-commit hook
# 执行项目质量检查
#

echo "🔍 执行pre-commit质量检查..."

# 运行质量检查脚本
node scripts/pre-commit-check.js

# 如果检查失败，阻止提交
if [ $? -ne 0 ]; then
    echo ""
    echo "❌ 质量检查失败，提交被阻止"
    echo "请修复上述问题后重新提交"
    echo ""
    echo "💡 可以运行以下命令获得帮助:"
    echo "   npm run quality-check  # 查看所有问题"
    echo "   npm run clean-files    # 自动清理文件"
    echo "   npm run health-check   # 检查项目健康度"
    echo ""
    exit 1
fi

echo "✅ 质量检查通过，允许提交"
`;

        fs.writeFileSync(hookPath, hookContent);
        console.log('📝 已安装pre-commit hook');
    }

    installPrePushHook() {
        const hookPath = path.join(this.gitHooksDir, 'pre-push');

        const hookContent = `#!/bin/sh
#
# 自动生成的pre-push hook
# 执行最终质量验证
#

echo "🚀 执行pre-push质量验证..."

# 运行完整的健康检查
npm run health-check

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ 项目健康检查失败，推送被阻止"
    echo "请解决所有质量问题后重新推送"
    echo ""
    echo "💡 运行 'npm run quality-check' 查看详细问题"
    echo ""
    exit 1
fi

echo "✅ 项目健康检查通过，允许推送"
`;

        fs.writeFileSync(hookPath, hookContent);
        console.log('📝 已安装pre-push hook');
    }

    setExecutePermissions() {
        const hooks = ['pre-commit', 'pre-push'];

        hooks.forEach(hook => {
            const hookPath = path.join(this.gitHooksDir, hook);
            if (fs.existsSync(hookPath)) {
                try {
                    // 在Windows上设置文件为可执行
                    if (process.platform === 'win32') {
                        // Windows通常不需要特殊的执行权限设置
                        console.log(`✅ ${hook} hook已设置`);
                    } else {
                        // Unix/Linux系统设置执行权限
                        fs.chmodSync(hookPath, 0o755);
                        console.log(`✅ ${hook} hook已设置为可执行`);
                    }
                } catch (error) {
                    console.warn(`⚠️  无法设置${hook}执行权限:`, error.message);
                }
            }
        });
    }

    // 卸载hooks（用于调试或移除）
    uninstall() {
        console.log('🗑️  卸载Git hooks...');

        const hooks = ['pre-commit', 'pre-push'];
        let removed = 0;

        hooks.forEach(hook => {
            const hookPath = path.join(this.gitHooksDir, hook);
            if (fs.existsSync(hookPath)) {
                try {
                    fs.unlinkSync(hookPath);
                    console.log(`✅ 已删除 ${hook} hook`);
                    removed++;
                } catch (error) {
                    console.error(`❌ 删除 ${hook} hook失败:`, error.message);
                }
            }
        });

        if (removed > 0) {
            console.log(`\n🗑️  已删除 ${removed} 个hooks`);
        } else {
            console.log('\n✅ 没有找到需要删除的hooks');
        }
    }

    // 检查hooks状态
    status() {
        console.log('📊 Git Hooks 状态检查\n');

        if (!this.isGitRepo()) {
            console.log('❌ 不是Git仓库');
            return;
        }

        const hooks = ['pre-commit', 'pre-push'];
        let installed = 0;

        hooks.forEach(hook => {
            const hookPath = path.join(this.gitHooksDir, hook);
            if (fs.existsSync(hookPath)) {
                const stats = fs.statSync(hookPath);
                console.log(`✅ ${hook}: 已安装 (${stats.size} bytes)`);
                installed++;
            } else {
                console.log(`❌ ${hook}: 未安装`);
            }
        });

        console.log(`\n状态: ${installed}/${hooks.length} hooks已安装`);

        if (installed === hooks.length) {
            console.log('🎉 所有quality hooks都已正确安装！');
        } else {
            console.log('⚠️  建议运行 "npm run install-hooks" 安装缺失的hooks');
        }
    }
}

// 命令行接口
if (require.main === module) {
    const installer = new GitHooksInstaller();
    const command = process.argv[2] || 'install';

    switch (command) {
        case 'install':
            installer.install();
            break;
        case 'uninstall':
            installer.uninstall();
            break;
        case 'status':
            installer.status();
            break;
        case 'help':
            console.log(`
Git Hooks 管理工具

用法:
  node scripts/install-git-hooks.js [命令]

命令:
  install     安装quality hooks (默认)
  uninstall   卸载所有hooks
  status      检查hooks状态
  help        显示帮助信息

NPM脚本:
  npm run install-hooks    # 安装hooks
  npm run quality-check    # 手动运行质量检查
  npm run health-check     # 检查项目健康度
            `);
            break;
        default:
            console.error('❌ 未知命令:', command);
            console.log('运行 "node scripts/install-git-hooks.js help" 查看帮助');
            process.exit(1);
    }
}

module.exports = GitHooksInstaller;