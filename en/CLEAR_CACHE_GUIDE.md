# 🔄 浏览器缓存清除指南 - Browser Cache Clearing Guide

## 问题描述 | Issue Description

如果您在访问产品页面时看到产品卡片的overlay（悬停遮罩层）异常显示，这可能是由于浏览器缓存了旧版本的CSS文件导致的。

If you see abnormal overlay display on product cards, it's likely due to browser caching old CSS files.

---

## 快速解决方案 | Quick Fix

### ⚡ 硬刷新页面 (推荐 | Recommended)

这是最简单快速的方法，能立即清除当前页面的缓存：

**Windows:**
- **Chrome / Edge / Firefox:** `Ctrl + F5` 或 `Ctrl + Shift + R`
- **Opera:** `Ctrl + F5`

**Mac:**
- **Chrome / Edge / Opera:** `Cmd + Shift + R`
- **Firefox:** `Cmd + Shift + R`
- **Safari:** `Cmd + Option + R`

**Linux:**
- **所有浏览器:** `Ctrl + F5` 或 `Ctrl + Shift + R`

---

## 完整清除缓存 | Full Cache Clear

如果硬刷新后问题仍然存在，请完整清除浏览器缓存：

### Google Chrome / Microsoft Edge

1. 按 `Ctrl + Shift + Delete` (Windows/Linux) 或 `Cmd + Shift + Delete` (Mac)
2. 在"时间范围"中选择"所有时间"
3. 勾选"缓存的图片和文件"
4. **不要**勾选"Cookie和其他网站数据"（以保持登录状态）
5. 点击"清除数据"
6. 重新加载页面

### Mozilla Firefox

1. 按 `Ctrl + Shift + Delete` (Windows/Linux) 或 `Cmd + Shift + Delete` (Mac)
2. 在"时间范围"中选择"所有内容"
3. 勾选"缓存"
4. **不要**勾选"Cookie"（以保持登录状态）
5. 点击"立即清除"
6. 重新加载页面

### Safari (Mac)

1. 打开Safari偏好设置: `Cmd + ,`
2. 选择"高级"标签
3. 勾选"在菜单栏中显示开发菜单"
4. 点击顶部菜单栏的"开发" → "清空缓存"
5. 或者直接按 `Cmd + Option + E`
6. 重新加载页面

---

## 🔍 验证修复 | Verify Fix

清除缓存后，请打开浏览器开发者工具检查：

1. 按 `F12` 打开开发者工具
2. 切换到"Console"（控制台）标签
3. 刷新页面
4. 查找以下消息：

**成功状态：**
```
🔍 开始检查产品卡片overlay状态...
✅ 所有overlay状态正常！共检查 36 个卡片
```

**如果仍有问题：**
```
❌ Overlay异常 #X: [产品名称]
⚠️ 发现 X 个overlay显示异常！
```

系统会自动弹出警告对话框，并在控制台显示详细的调试信息。

---

## 📋 技术详情 | Technical Details

### 修复内容 (v3.0-overlay-fix)

1. **CSS冲突清理**
   - 删除了重复的 `.product-card` opacity定义
   - 合并了加载状态和动画样式

2. **强化隐藏规则**
   ```css
   .product-card:not(:hover) .hover-overlay {
       opacity: 0 !important;
       visibility: hidden !important;
       pointer-events: none !important;
   }
   ```

3. **缓存破坏**
   - CSS版本号从 `v=2.0` 更新到 `v=3.0-overlay-fix`
   - 添加了强制无缓存meta标签

4. **自动调试**
   - 页面加载时自动检查所有overlay状态
   - 发现异常时在控制台输出详细信息
   - 异常卡片会被红色边框高亮3秒

---

## ❓ 常见问题 | FAQ

### Q1: 清除缓存后仍然有问题？
**A:** 请尝试：
1. 关闭所有浏览器窗口
2. 重新打开浏览器
3. 直接访问页面URL（不要从历史记录打开）

### Q2: 为什么只有一个卡片有问题？
**A:** 这通常是由于：
- 浏览器渐进式渲染导致部分CSS缓存不一致
- 特定卡片位置触发了旧版CSS规则
- 滚动加载时CSS未完全应用

### Q3: 会影响其他页面吗？
**A:** 不会。修复仅针对产品页面(products.html)的卡片overlay系统，不影响其他页面功能。

### Q4: 需要清除Cookie吗？
**A:** 不需要。只需清除缓存（缓存的图片和文件），保留Cookie可以维持您的登录状态。

---

## 📞 仍需帮助？ | Still Need Help?

如果按照上述步骤操作后问题仍未解决：

1. 打开浏览器开发者工具（F12）
2. 切换到Console标签
3. 截图控制台显示的错误信息
4. 发送截图给技术支持

**联系方式:**
- Email: sales@yuandake.com
- Phone: +86-371-55555555

---

## 📝 更新日志 | Change Log

### v3.0-overlay-fix (2025-09-30)
- ✅ 修复: 特定产品卡片overlay异常显示
- ✅ 优化: CSS优先级和冲突清理
- ✅ 新增: 自动overlay状态检测
- ✅ 增强: 缓存破坏机制

---

*Generated with Claude Code - Yuandake Refractory Materials Website*