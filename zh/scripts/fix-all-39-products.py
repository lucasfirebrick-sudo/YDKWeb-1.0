#!/usr/bin/env python3
"""
修复所有39个产品详情页
基于诊断结果，按类别逐一修复每个产品的问题
确保100%的产品都能正确显示图片
"""

import os
import json
import re
import shutil
from pathlib import Path

# 路径配置
PROJECT_ROOT = r"D:\ai\新建文件夹\新建文件夹\7788"
PRODUCTS_DIR = os.path.join(PROJECT_ROOT, "products")
IMAGES_PRODUCTS = os.path.join(PROJECT_ROOT, "images", "products")
SCRIPTS_DIR = os.path.join(PROJECT_ROOT, "scripts")

def load_diagnosis_results():
    """加载诊断结果"""
    report_file = os.path.join(SCRIPTS_DIR, 'comprehensive_product_diagnosis.json')
    try:
        with open(report_file, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"❌ 无法加载诊断结果: {e}")
        return None

def fix_javascript_references(product_id):
    """修复JavaScript引用问题 (A类问题)"""
    html_file = os.path.join(PRODUCTS_DIR, f"{product_id}.html")

    try:
        with open(html_file, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        return False, [f"读取文件失败: {e}"]

    original_content = content
    fixes_applied = []

    # 检查是否已有multi-image-gallery.js引用
    if 'multi-image-gallery.js' not in content:
        # 查找现有script标签的位置
        script_pattern = r'(<script src="../js/[^"]*" defer></script>)'
        script_matches = re.findall(script_pattern, content)

        if script_matches:
            # 在最后一个script标签后添加
            last_script = script_matches[-1]
            new_script = '    <script src="../js/multi-image-gallery.js" defer></script>'
            content = content.replace(last_script, last_script + '\n' + new_script)
            fixes_applied.append("添加multi-image-gallery.js引用")
        else:
            # 如果没有找到其他script标签，在</head>前添加
            head_end_pattern = r'</head>'
            if re.search(head_end_pattern, content):
                new_script = '    <script src="../js/multi-image-gallery.js" defer></script>\n</head>'
                content = re.sub(head_end_pattern, new_script, content)
                fixes_applied.append("添加multi-image-gallery.js引用")

    # 写回文件
    if content != original_content:
        try:
            with open(html_file, 'w', encoding='utf-8') as f:
                f.write(content)
            return True, fixes_applied
        except Exception as e:
            return False, [f"写入文件失败: {e}"]

    return False, ["无需修复或修复失败"]

def fix_image_configuration(product_id, diagnosis_result):
    """修复图片配置问题 (B类问题)"""
    html_file = os.path.join(PRODUCTS_DIR, f"{product_id}.html")

    try:
        with open(html_file, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        return False, [f"读取文件失败: {e}"]

    original_content = content
    fixes_applied = []

    # 获取可用图片
    available_images = diagnosis_result['available_images']
    if not available_images:
        return False, ["没有可用的图片文件"]

    # 选择最佳图片
    main_image = available_images[0]['path']
    all_images = [img['path'] for img in available_images[:6]]  # 最多6张

    # 1. 添加或修复主图片标签
    img_config = diagnosis_result['image_config']
    if not img_config['has_main_image']:
        # 查找主图片容器
        container_pattern = r'(<div class="main-image-container">)\s*'
        container_match = re.search(container_pattern, content)

        if container_match:
            # 在容器中添加img标签
            img_tag = f'''<img src="{main_image}" alt="{product_id}" class="main-image"
                                 loading="lazy"
                                 data-images="{','.join(all_images)}"
                                 onerror="this.onerror=null; this.src='../images/products/placeholder.jpg';">
                            '''
            replacement = container_match.group(1) + '\n                            ' + img_tag
            content = content.replace(container_match.group(0), replacement)
            fixes_applied.append("添加主图片标签")

    # 2. 添加或修复data-images配置
    if not img_config['has_data_images'] and img_config['has_main_image']:
        # 在现有img标签中添加data-images
        img_pattern = r'(<img[^>]+class="main-image"[^>]*)'
        img_match = re.search(img_pattern, content)
        if img_match:
            img_tag = img_match.group(1)
            if 'data-images=' not in img_tag:
                new_img_tag = img_tag + f' data-images="{",".join(all_images)}"'
                content = content.replace(img_tag, new_img_tag)
                fixes_applied.append("添加data-images配置")

    # 3. 添加data-product-id
    if not img_config['has_data_product_id']:
        product_images_pattern = r'(<div class="product-images[^"]*")'
        product_match = re.search(product_images_pattern, content)
        if product_match:
            old_div = product_match.group(1)
            if 'data-product-id=' not in old_div:
                new_div = old_div + f' data-product-id="{product_id}"'
                content = content.replace(old_div, new_div)
                fixes_applied.append("添加data-product-id")

    # 4. 确保图片状态指示器隐藏
    status_pattern = r'<div class="image-status"(?![^>]*style="display: none;")([^>]*)>'
    if re.search(status_pattern, content):
        content = re.sub(status_pattern, r'<div class="image-status" style="display: none;"\1>', content)
        fixes_applied.append("隐藏图片状态指示器")

    # 写回文件
    if content != original_content:
        try:
            with open(html_file, 'w', encoding='utf-8') as f:
                f.write(content)
            return True, fixes_applied
        except Exception as e:
            return False, [f"写入文件失败: {e}"]

    return False, fixes_applied if fixes_applied else ["无需修复"]

def run_category_a_fixes(diagnosis_data):
    """修复A类问题：35个缺少JavaScript的产品"""
    print("🚨 开始修复A类问题：JavaScript缺失")

    category_a_products = []
    for product_id, result in diagnosis_data['detailed_results'].items():
        if result['categorization']['category'] == 'A - 缺少JavaScript':
            category_a_products.append(product_id)

    print(f"   需要修复的产品: {len(category_a_products)} 个")

    fixed_count = 0
    failed_products = []

    for i, product_id in enumerate(category_a_products, 1):
        print(f"   [{i:2d}/{len(category_a_products)}] 修复: {product_id}")

        success, fixes = fix_javascript_references(product_id)
        if success:
            print(f"      ✅ {', '.join(fixes)}")
            fixed_count += 1
        else:
            print(f"      ❌ {', '.join(fixes)}")
            failed_products.append(product_id)

    print(f"\n   📊 A类修复结果: {fixed_count}/{len(category_a_products)} 成功")
    if failed_products:
        print(f"   ❌ 失败的产品: {', '.join(failed_products)}")

    return fixed_count, failed_products

def run_category_b_fixes(diagnosis_data):
    """修复B类问题：4个缺少图片配置的产品"""
    print("\n⚙️ 开始修复B类问题：图片配置缺失")

    category_b_products = []
    for product_id, result in diagnosis_data['detailed_results'].items():
        if result['categorization']['category'] == 'B - 缺少图片配置':
            category_b_products.append(product_id)

    print(f"   需要修复的产品: {len(category_b_products)} 个")

    fixed_count = 0
    failed_products = []

    for i, product_id in enumerate(category_b_products, 1):
        print(f"   [{i:2d}/{len(category_b_products)}] 修复: {product_id}")

        diagnosis_result = diagnosis_data['detailed_results'][product_id]
        success, fixes = fix_image_configuration(product_id, diagnosis_result)

        if success:
            print(f"      ✅ {', '.join(fixes)}")
            fixed_count += 1
        else:
            print(f"      ❌ {', '.join(fixes)}")
            failed_products.append(product_id)

    print(f"\n   📊 B类修复结果: {fixed_count}/{len(category_b_products)} 成功")
    if failed_products:
        print(f"   ❌ 失败的产品: {', '.join(failed_products)}")

    return fixed_count, failed_products

def create_backup():
    """创建修复前的备份"""
    print("📄 创建修复前的备份...")

    backup_dir = os.path.join(SCRIPTS_DIR, "product_pages_backup")
    if os.path.exists(backup_dir):
        shutil.rmtree(backup_dir)

    shutil.copytree(PRODUCTS_DIR, backup_dir)
    print(f"   ✅ 备份创建完成: {backup_dir}")

def main():
    """主修复流程"""
    print("=" * 80)
    print("🔧 修复所有39个产品详情页")
    print("=" * 80)

    # 1. 加载诊断结果
    diagnosis_data = load_diagnosis_results()
    if not diagnosis_data:
        print("❌ 无法加载诊断结果，请先运行诊断脚本")
        return

    print(f"📊 诊断结果概要:")
    print(f"   总产品数: {diagnosis_data['total_products']}")
    for category, count in diagnosis_data['category_counts'].items():
        print(f"   {category}: {count} 个")

    # 2. 创建备份
    create_backup()

    # 3. 修复A类问题 (JavaScript缺失)
    a_fixed, a_failed = run_category_a_fixes(diagnosis_data)

    # 4. 修复B类问题 (图片配置缺失)
    b_fixed, b_failed = run_category_b_fixes(diagnosis_data)

    # 5. 生成修复总结
    total_fixed = a_fixed + b_fixed
    total_products = diagnosis_data['total_products']

    print("\n" + "=" * 80)
    print("📊 修复完成总结")
    print("=" * 80)

    print(f"\n📈 修复统计:")
    print(f"   总产品数: {total_products}")
    print(f"   成功修复: {total_fixed}")
    print(f"   修复成功率: {total_fixed/total_products*100:.1f}%")

    print(f"\n🎯 按类别修复结果:")
    print(f"   A类(JavaScript): {a_fixed} 修复成功")
    print(f"   B类(图片配置): {b_fixed} 修复成功")

    all_failed = a_failed + b_failed
    if all_failed:
        print(f"\n❌ 需要手动处理的产品 ({len(all_failed)} 个):")
        for product in all_failed:
            print(f"   • {product}")
    else:
        print(f"\n🎉 所有产品修复成功！")

    print(f"\n📝 下一步:")
    print(f"   1. 运行验证脚本检查修复效果")
    print(f"   2. 在浏览器中测试产品页面")
    print(f"   3. 清除浏览器缓存后重新加载")

if __name__ == "__main__":
    main()