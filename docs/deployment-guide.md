# YDKWeb GitHub部署指南

## 📋 部署概述

本指南将帮助您将YDKWeb项目成功部署到GitHub Pages，实现中英文双语网站的在线访问。

## 🚀 快速部署步骤

### 1. **上传到GitHub**

```bash
# 1. 创建GitHub仓库
# 在GitHub上创建新仓库，命名为 YDKWeb

# 2. 初始化本地Git仓库
cd YDKWeb
git init

# 3. 添加所有文件
git add .

# 4. 提交初始版本
git commit -m "🎉 Initial commit: YDK双语网站上线

- ✅ 完整中英文双语支持
- ✅ 响应式设计适配所有设备
- ✅ SEO优化和结构化数据
- ✅ 39个产品详情页面
- ✅ 专业企业级UI设计
- ✅ GitHub Pages部署就绪"

# 5. 连接远程仓库
git remote add origin https://github.com/你的用户名/YDKWeb.git

# 6. 推送到GitHub
git branch -M main
git push -u origin main
```

### 2. **启用GitHub Pages**

1. 进入GitHub仓库页面
2. 点击 **Settings** 选项卡
3. 滚动到 **Pages** 部分
4. 在 **Source** 下拉菜单中选择 **Deploy from a branch**
5. 选择 **main** 分支
6. 文件夹选择 **/ (root)**
7. 点击 **Save**

### 3. **访问网站**

等待几分钟后，您的网站将可通过以下地址访问：

- **主页**: `https://你的用户名.github.io/YDKWeb/`
- **中文版**: `https://你的用户名.github.io/YDKWeb/zh/`
- **英文版**: `https://你的用户名.github.io/YDKWeb/en/`

## 🔧 高级配置

### **自定义域名配置**

如果您有自己的域名（如 `www.yuandake.com`）：

1. 在仓库根目录创建 `CNAME` 文件：
```bash
echo "www.yuandake.com" > CNAME
git add CNAME
git commit -m "Add custom domain"
git push
```

2. 在您的域名DNS设置中添加CNAME记录：
```
CNAME    www    你的用户名.github.io
```

### **SSL证书（HTTPS）**

GitHub Pages自动为所有站点提供SSL证书，确保HTTPS访问。

## 📊 SEO和性能优化

### **搜索引擎提交**

1. **Google Search Console**
   - 提交站点地图: `https://你的域名/sitemap.xml`
   - 验证域名所有权

2. **百度站长平台**
   - 提交中文版链接
   - 配置移动适配

### **性能监控**

使用以下工具检查网站性能：
- Google PageSpeed Insights
- GTmetrix
- WebPageTest

## 🔄 更新和维护

### **内容更新流程**

```bash
# 1. 修改文件
# 编辑相关HTML、CSS、JS文件

# 2. 测试更改
# 在本地预览确认无误

# 3. 提交更改
git add .
git commit -m "📝 更新产品信息和价格"

# 4. 推送到GitHub
git push

# 5. 等待部署完成（通常2-3分钟）
```

### **定期维护任务**

- **每月**: 检查所有链接是否有效
- **每季度**: 更新产品信息和价格
- **每半年**: 优化图片和性能
- **每年**: 更新公司信息和认证

## 🌍 多语言SEO优化

### **URL结构**
- 中文版: `/zh/`
- 英文版: `/en/`
- 这种结构有利于搜索引擎识别语言版本

### **hreflang标签**
已在模板中配置，帮助搜索引擎理解语言版本关系：

```html
<link rel="alternate" hreflang="zh-CN" href="https://域名/zh/" />
<link rel="alternate" hreflang="en-US" href="https://域名/en/" />
```

## 📱 移动端优化

网站已完全适配移动端：
- 响应式布局设计
- 移动端优先的CSS
- 触摸友好的交互设计
- 快速加载优化

## 🔐 安全性考虑

- 所有外部链接使用HTTPS
- 表单提交包含CSRF保护
- 图片和资源CDN加载
- 定期更新依赖库

## 🎯 访问统计

建议配置Google Analytics进行访问统计：

1. 创建GA账户获取跟踪ID
2. 在`<head>`部分添加跟踪代码：

```html
<!-- Global site tag (gtag.js) - Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## 🐛 故障排除

### **常见问题**

1. **404错误**
   - 检查文件路径大小写
   - 确认文件存在于正确位置

2. **样式不加载**
   - 检查CSS文件路径
   - 确认相对路径正确

3. **图片不显示**
   - 检查图片文件大小（GitHub限制100MB）
   - 确认图片格式支持（jpg、png、gif、webp）

4. **部署时间过长**
   - GitHub Pages通常需要2-10分钟部署
   - 检查GitHub Status页面是否有服务问题

### **调试技巧**

```bash
# 检查Git状态
git status

# 查看提交历史
git log --oneline

# 强制推送（谨慎使用）
git push --force-with-lease

# 检查远程分支
git branch -r
```

## 📧 技术支持

如遇到部署问题，可通过以下方式获取帮助：

- **GitHub Issues**: 提交技术问题
- **Email**: tech@yuandake.com
- **微信**: yuandake2023

---

## ✅ 部署清单

- [ ] 创建GitHub仓库
- [ ] 上传所有文件
- [ ] 启用GitHub Pages
- [ ] 测试中英文版本访问
- [ ] 配置自定义域名（可选）
- [ ] 提交搜索引擎收录
- [ ] 配置访问统计
- [ ] 设置监控和备份

完成以上步骤后，您的YDK耐火材料公司网站就正式上线了！🎉