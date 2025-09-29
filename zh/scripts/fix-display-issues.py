#!/usr/bin/env python3
"""
修复显示异常问题 - 解决23个产品页面的图片轮播显示问题
主要解决HTML结构错误和JavaScript初始化问题
"""

import os
import glob
import re
import json
from pathlib import Path

# 路径配置
PRODUCTS_DIR = r"D:\ai\新建文件夹\新建文件夹\7788\products"
IMAGES_DIR = r"D:\ai\新建文件夹\新建文件夹\7788\images\products"

# 加载诊断结果
def load_diagnostic_results():
    """加载之前的诊断结果"""
    results_file = os.path.join(os.path.dirname(PRODUCTS_DIR), 'scripts', 'diagnostic_results.json')

    try:
        with open(results_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
            return data['results']
    except:
        return None

def fix_html_structure_issues(html_file):
    """修复HTML结构问题"""
    product_id = Path(html_file).stem

    try:
        with open(html_file, 'r', encoding='utf-8') as f:
            content = f.read()

        original_content = content
        fixed_issues = []

        # 1. 修复未关闭的img标签
        # 查找模式：<img ... data-images="..." onerror="..."
        # 问题：缺少闭合的 >
        img_pattern = r'(<img[^>]+class="main-image"[^>]+data-images="[^"]*"[^>]+onerror="[^"]*";)\s*(?!>)'

        def fix_img_tag(match):
            img_tag = match.group(1)
            if not img_tag.endswith('>'):
                return img_tag + '>'
            return img_tag

        new_content = re.sub(img_pattern, fix_img_tag, content)
        if new_content != content:
            fixed_issues.append('修复了未关闭的img标签')
            content = new_content

        # 2. 修复错误的HTML结构嵌套
        # 查找在img标签内部错误嵌套的div
        img_with_nested_div_pattern = r'(<img[^>]+>)\s*(<!--[^>]*-->)?\s*(<div class="image-status)'

        def fix_nested_structure(match):
            img_tag = match.group(1)
            comment = match.group(2) if match.group(2) else ''
            div_tag = match.group(3)
            return img_tag + '\n                            ' + comment + '\n                            ' + div_tag

        new_content = re.sub(img_with_nested_div_pattern, fix_nested_structure, content)
        if new_content != content:
            fixed_issues.append('修复了HTML结构嵌套问题')
            content = new_content

        # 3. 确保图片状态指示器正确隐藏
        # 将 image-status 从 hidden 改为 style="display: none;"
        status_pattern = r'<div class="image-status hidden">'
        new_content = re.sub(status_pattern, '<div class="image-status" style="display: none;">', content)
        if new_content != content:
            fixed_issues.append('修复了图片状态指示器')
            content = new_content

        # 4. 确保正确的缩略图容器结构
        # 检查缩略图容器是否有正确的结构
        thumbnails_pattern = r'<div class="image-thumbnails" id="[^"]*">\s*</div>'
        if re.search(thumbnails_pattern, content):
            # 缩略图容器是空的，添加注释说明
            replacement = '''<div class="image-thumbnails" id="image-thumbnails">
                                <!-- 缩略图将由JavaScript动态生成 -->
                            </div>'''
            new_content = re.sub(thumbnails_pattern, replacement, content)
            if new_content != content:
                fixed_issues.append('添加了缩略图容器说明')
                content = new_content

        # 5. 检查并修复data-product-id
        if f'data-product-id="{product_id}"' not in content:
            product_images_pattern = r'(<div class="product-images[^"]*")'
            replacement = f'\\1 data-product-id="{product_id}"'
            new_content = re.sub(product_images_pattern, replacement, content)
            if new_content != content:
                fixed_issues.append('添加了data-product-id属性')
                content = new_content

        # 写回文件（如果有修改）
        if content != original_content:
            with open(html_file, 'w', encoding='utf-8') as f:
                f.write(content)
            return fixed_issues
        else:
            return []

    except Exception as e:
        return [f'修复失败: {str(e)}']

def fix_missing_configurations(html_file):
    """修复缺失的图片配置"""
    product_id = Path(html_file).stem

    # 获取该产品的实际图片
    pattern = os.path.join(IMAGES_DIR, f"{product_id}*")
    image_files = glob.glob(pattern)

    valid_images = []
    for img_path in image_files:
        filename = os.path.basename(img_path)
        if filename.lower().endswith(('.png', '.jpg', '.jpeg')):
            valid_images.append(filename)

    if not valid_images:
        return []

    # 按优先级排序
    def sort_key(filename):
        if 'official' in filename:
            return (0, filename)
        elif 'new' in filename:
            return (1, filename)
        else:
            return (2, filename)

    valid_images = sorted(valid_images, key=sort_key)

    try:
        with open(html_file, 'r', encoding='utf-8') as f:
            content = f.read()

        original_content = content
        fixed_issues = []

        # 构建图片路径
        image_paths = [f"../images/products/{img}" for img in valid_images]
        data_images_value = ",".join(image_paths)
        main_image_path = image_paths[0]

        # 检查是否需要添加主图片
        if 'class="main-image"' not in content:
            # 寻找主图容器并添加img标签
            container_pattern = r'(<div class="main-image-container">\s*)'
            img_tag = f'''<img src="{main_image_path}" alt="{product_id}" class="main-image"
                                 loading="lazy"
                                 data-images="{data_images_value}"
                                 onerror="this.onerror=null; this.src='../images/products/placeholder.jpg';">'''

            replacement = f'\\1\n                            {img_tag}\n                            '
            new_content = re.sub(container_pattern, replacement, content)
            if new_content != content:
                fixed_issues.append('添加了主图片配置')
                content = new_content

        # 检查是否需要添加data-images
        elif 'data-images=' not in content:
            # 在现有的img标签中添加data-images
            img_pattern = r'(<img[^>]+class="main-image"[^>]*)'
            replacement = f'\\1 data-images="{data_images_value}"'
            new_content = re.sub(img_pattern, replacement, content)
            if new_content != content:
                fixed_issues.append('添加了data-images配置')
                content = new_content

        # 写回文件（如果有修改）
        if content != original_content:
            with open(html_file, 'w', encoding='utf-8') as f:
                f.write(content)

        return fixed_issues

    except Exception as e:
        return [f'配置修复失败: {str(e)}']

def run_comprehensive_fixes():
    """运行全面修复"""
    print("=" * 80)
    print("🔧 开始修复产品详情页显示问题")
    print("=" * 80)

    # 加载诊断结果
    diagnostic_results = load_diagnostic_results()
    if not diagnostic_results:
        print("❌ 无法加载诊断结果，请先运行comprehensive-diagnosis.py")
        return

    # 按优先级分组
    display_issues = []
    config_issues = []

    for product_id, result in diagnostic_results.items():
        if result['status'] == 'display_issue':
            display_issues.append(product_id)
        elif 'missing_config' in result['status']:
            config_issues.append(product_id)

    print(f"\n📊 修复计划:")
    print(f"   🚨 高优先级 - 显示异常: {len(display_issues)}个产品")
    print(f"   ⚙️ 中优先级 - 配置缺失: {len(config_issues)}个产品")

    total_fixed = 0

    # 修复显示异常问题
    print(f"\n🚨 开始修复显示异常问题...")
    for i, product_id in enumerate(display_issues, 1):
        html_file = os.path.join(PRODUCTS_DIR, f"{product_id}.html")

        print(f"[{i:2d}/{len(display_issues)}] 修复: {product_id}")

        fixed_issues = fix_html_structure_issues(html_file)
        if fixed_issues:
            print(f"  ✅ 修复项目: {', '.join(fixed_issues)}")
            total_fixed += 1
        else:
            print(f"  ℹ️  无需修复或修复失败")

    # 修复配置缺失问题
    if config_issues:
        print(f"\n⚙️ 开始修复配置缺失问题...")
        for i, product_id in enumerate(config_issues, 1):
            html_file = os.path.join(PRODUCTS_DIR, f"{product_id}.html")

            print(f"[{i:2d}/{len(config_issues)}] 配置: {product_id}")

            fixed_issues = fix_missing_configurations(html_file)
            if fixed_issues:
                print(f"  ✅ 配置项目: {', '.join(fixed_issues)}")
                total_fixed += 1
            else:
                print(f"  ℹ️  无需配置或配置失败")

    print(f"\n🎯 修复完成:")
    print(f"   总修复产品: {total_fixed}")
    print(f"   显示异常修复: {len(display_issues)}个")
    print(f"   配置缺失修复: {len(config_issues)}个")

    print(f"\n📝 建议:")
    print(f"   1. 清除浏览器缓存")
    print(f"   2. 重新加载产品页面")
    print(f"   3. 测试轮播功能")
    print(f"   4. 运行验证脚本确认修复效果")

if __name__ == "__main__":
    run_comprehensive_fixes()