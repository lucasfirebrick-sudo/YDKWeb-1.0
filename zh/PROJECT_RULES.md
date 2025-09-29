# 项目文件管理规则

## 🚨 **严格执行的规则**

### **文件命名规范**

#### ✅ **允许的命名模式**
```
主要文件：[功能名].html/css/js
- ✅ products.html
- ✅ about.css
- ✅ navigation.js

组件文件：[组件名]-[功能].css/js
- ✅ modal-components.css
- ✅ hero-carousel.js
- ✅ image-optimizer.js

工具文件：[工具名].js
- ✅ quality-gate.js
- ✅ file-cleaner.js
```

#### ❌ **禁止的命名模式**
```
- ❌ 任何包含 backup, old, temp, test, draft, copy 的文件名
- ❌ 带时间戳的备份: index-20250926.html
- ❌ 版本号后缀: style-v2.css, products-core.css
- ❌ 重复功能文件: products-clean.css + products-core.css
- ❌ 大写字母: ProductsPage.js
- ❌ 空格: my file.css
- ❌ 特殊字符: file@#$.js
```

### **文件数量限制**

| 文件类型 | 最大数量 | 当前状态 | 状态 |
|---------|---------|----------|------|
| CSS文件  | 15      | 48       | 🔴 超限 |
| JS文件   | 50      | 4177     | 🔴 严重超限 |
| 备份文件 | 0       | 246      | 🔴 严重违规 |

### **目录结构规范**

```
css/
├── core-base.css           # 唯一的基础样式系统
├── unified-navigation-footer.css  # 导航和Footer样式
├── components/             # 组件样式
│   ├── modal.css
│   ├── buttons.css
│   └── forms.css
└── pages/                  # 页面特定样式
    ├── home.css
    ├── products.css
    └── about.css

js/
├── script.js              # 主脚本
├── components/            # 组件脚本
│   ├── modal-components.js
│   └── hero-carousel.js
├── utils/                 # 工具函数
│   ├── image-optimizer.js
│   └── validation.js
└── loaders/               # 动态加载器
    ├── navigation-loader.js
    ├── footer-loader.js
    └── floating-buttons-loader.js
```

## 🔧 **工作流程规则**

### **修改文件的强制流程**

1. **修改前检查**
   ```bash
   node scripts/quality-gate.js
   ```

2. **修改原则**
   - 🔴 **禁止创建新文件解决旧文件问题**
   - ✅ **必须明确替换哪个旧文件**
   - ✅ **修改后立即删除被替换的文件**

3. **提交前验证**
   ```bash
   node scripts/pre-commit-check.js
   ```

### **Git提交规范**

```bash
# 好的提交
git add products.css
git rm products-old.css products-backup.css
git commit -m "优化产品页面样式，删除重复文件"

# 坏的提交
git add products-new.css products-fixed.css
git commit -m "修复样式"  # 没有删除旧文件
```

## 🚫 **零容忍规则**

### **立即删除的文件**
任何包含以下关键词的文件将被自动标记删除：
- `backup`, `old`, `temp`, `draft`, `copy`
- 时间戳后缀：`-20250926`, `-v2`, `-final`
- 测试文件：`test-*` (除了正规的单元测试)

### **重复功能检测**
系统将自动检测：
- 相同内容的CSS文件
- 重复定义的JavaScript函数
- 未被引用的资源文件

## ⚡ **自动化工具**

### **每日自动检查**
```bash
# 质量门禁检查
npm run quality-check

# 文件清理
npm run clean-files

# 生成清理报告
npm run cleanup-report
```

### **Git Hooks**
- **pre-commit**: 自动运行质量检查
- **pre-push**: 验证文件数量限制
- **post-merge**: 检测并清理冲突文件

## 📊 **质量指标**

### **项目健康度评分**
- CSS文件数量 ≤ 15个：+20分
- JS文件数量 ≤ 50个：+20分
- 零备份文件：+20分
- 零重复文件：+20分
- 规范命名：+20分

**目标：100分 | 当前：0分**

## 🎯 **执行计划**

### **第一阶段：紧急清理（本周）**
1. 删除246个备份文件
2. 合并重复的CSS文件（48→15个）
3. 清理无用的JS文件（4177→50个）

### **第二阶段：建立防护（下周）**
1. 配置Git hooks
2. 建立自动化检查
3. 培训团队成员

### **第三阶段：持续维护（长期）**
1. 每日质量报告
2. 月度深度清理
3. 规则更新和优化

---

**⚠️ 警告：违反这些规则的提交将被自动拒绝**

**📞 如有疑问，请联系项目维护者**