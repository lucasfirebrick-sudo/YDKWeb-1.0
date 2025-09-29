#!/usr/bin/env python3
"""
验证和修复产品详情页图片路径
检查所有39个产品详情页的图片配置和轮播功能
"""

import os
import glob
import re
import json
from pathlib import Path

# 路径配置
PROJECT_ROOT = r"D:\ai\新建文件夹\新建文件夹\7788"
PRODUCTS_DIR = os.path.join(PROJECT_ROOT, "products")
IMAGES_PRODUCTS = os.path.join(PROJECT_ROOT, "images", "products")
SCRIPTS_DIR = os.path.join(PROJECT_ROOT, "scripts")

def get_available_images():
    """获取可用的图片文件"""
    available_images = {}

    for ext in ['*.png', '*.jpg', '*.jpeg']:
        for img_path in glob.glob(os.path.join(IMAGES_PRODUCTS, ext)):
            filename = os.path.basename(img_path)
            available_images[filename] = f"../images/products/{filename}"

    return available_images

def analyze_product_page(html_file, available_images):
    """分析单个产品页面"""
    product_id = Path(html_file).stem

    try:
        with open(html_file, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        return {
            'status': 'read_error',
            'error': str(e),
            'issues': [f'无法读取文件: {e}']
        }

    issues = []
    recommendations = []

    # 1. 检查主图片标签
    main_img_pattern = r'<img[^>]+class="main-image"[^>]*src="([^"]*)"[^>]*>'
    main_img_match = re.search(main_img_pattern, content)

    if not main_img_match:
        issues.append('缺少主图片标签')
    else:
        main_src = main_img_match.group(1)
        if main_src.startswith('../images/products/'):
            img_filename = main_src.replace('../images/products/', '')
            if img_filename not in available_images:
                issues.append(f'主图片文件不存在: {img_filename}')
                # 查找替代图片
                potential_match = find_best_image_match(product_id, available_images)
                if potential_match:
                    recommendations.append({
                        'type': 'replace_main_image',
                        'current': main_src,
                        'recommended': potential_match,
                        'reason': '推荐使用匹配的图片'
                    })

    # 2. 检查data-images配置
    data_images_pattern = r'data-images="([^"]*)"'
    data_images_match = re.search(data_images_pattern, content)

    configured_images = []
    if data_images_match:
        data_images_value = data_images_match.group(1)
        configured_images = [img.strip() for img in data_images_value.split(',') if img.strip()]

        # 检查每个配置的图片是否存在
        missing_images = []
        for img_path in configured_images:
            if img_path.startswith('../images/products/'):
                img_filename = img_path.replace('../images/products/', '')
                if img_filename not in available_images:
                    missing_images.append(img_filename)

        if missing_images:
            issues.append(f'配置的图片不存在: {", ".join(missing_images)}')

    else:
        issues.append('缺少data-images配置')

    # 3. 检查HTML结构
    img_tag_pattern = r'<img[^>]+class="main-image"[^>]*>'
    img_tag_match = re.search(img_tag_pattern, content)

    if img_tag_match:
        img_tag = img_tag_match.group(0)
        if not img_tag.endswith('>'):
            issues.append('图片标签未正确闭合')

    # 4. 检查图片状态指示器
    status_pattern = r'<div class="image-status"[^>]*>'
    status_match = re.search(status_pattern, content)

    if status_match:
        status_tag = status_match.group(0)
        if 'style="display: none;"' not in status_tag and 'hidden' not in status_tag:
            issues.append('图片状态指示器未正确隐藏')

    # 5. 推荐图片配置
    if not configured_images or len(configured_images) == 0:
        # 查找该产品的所有相关图片
        product_images = find_product_images(product_id, available_images)
        if product_images:
            recommendations.append({
                'type': 'add_image_configuration',
                'images': product_images,
                'reason': f'为产品配置 {len(product_images)} 张图片'
            })

    # 6. 检查JavaScript引用
    if 'multi-image-gallery.js' not in content:
        issues.append('缺少multi-image-gallery.js引用')

    # 7. 检查data-product-id
    if f'data-product-id="{product_id}"' not in content:
        issues.append('缺少或错误的data-product-id')

    # 确定状态
    if not issues:
        status = 'perfect'
    elif len(issues) <= 2 and not any('不存在' in issue for issue in issues):
        status = 'minor_issues'
    elif any('不存在' in issue for issue in issues):
        status = 'image_issues'
    else:
        status = 'major_issues'

    return {
        'status': status,
        'issues': issues,
        'recommendations': recommendations,
        'configured_images': configured_images,
        'image_count': len(configured_images)
    }

def find_best_image_match(product_id, available_images):
    """为产品查找最佳匹配的图片"""
    # 优先级：official > new > numbered > 其他
    patterns = [
        f"{product_id}-official-1.png",
        f"{product_id}-official-1.jpg",
        f"{product_id}-new-1.png",
        f"{product_id}-new-1.jpg",
        f"{product_id}-1.png",
        f"{product_id}-1.jpg",
        f"{product_id}.png",
        f"{product_id}.jpg"
    ]

    for pattern in patterns:
        if pattern in available_images:
            return available_images[pattern]

    # 模糊匹配
    for img_name in available_images:
        if product_id.replace('-', '_') in img_name.replace('-', '_'):
            return available_images[img_name]

    return None

def find_product_images(product_id, available_images):
    """查找产品的所有相关图片"""
    product_images = []

    # 精确匹配
    for img_name, img_path in available_images.items():
        img_base = img_name.lower().replace('.png', '').replace('.jpg', '').replace('.jpeg', '')

        if img_base.startswith(product_id.lower()):
            product_images.append(img_path)

    # 按优先级排序
    def sort_priority(img_path):
        filename = os.path.basename(img_path).lower()
        if 'official' in filename:
            return 0
        elif 'new' in filename:
            return 1
        elif re.search(r'-\d+\.', filename):
            return 2
        else:
            return 3

    product_images.sort(key=sort_priority)
    return product_images[:6]  # 最多6张图片

def fix_product_page(html_file, analysis, available_images):
    """修复产品页面"""
    product_id = Path(html_file).stem

    try:
        with open(html_file, 'r', encoding='utf-8') as f:
            content = f.read()
    except:
        return False, []

    original_content = content
    fixes_applied = []

    # 应用推荐的修复
    for rec in analysis['recommendations']:
        if rec['type'] == 'replace_main_image':
            old_src = rec['current']
            new_src = rec['recommended']
            if old_src in content:
                content = content.replace(old_src, new_src)
                fixes_applied.append(f"替换主图片: {old_src} → {new_src}")

        elif rec['type'] == 'add_image_configuration':
            images = rec['images']
            if images:
                # 查找并更新data-images
                data_images_value = ",".join(images)

                # 查找现有的data-images
                data_images_pattern = r'data-images="[^"]*"'
                if re.search(data_images_pattern, content):
                    content = re.sub(data_images_pattern, f'data-images="{data_images_value}"', content)
                    fixes_applied.append(f"更新data-images配置: {len(images)}张图片")
                else:
                    # 在主图片标签中添加data-images
                    img_pattern = r'(<img[^>]+class="main-image"[^>]*)'
                    replacement = f'\\1 data-images="{data_images_value}"'
                    new_content = re.sub(img_pattern, replacement, content)
                    if new_content != content:
                        content = new_content
                        fixes_applied.append(f"添加data-images配置: {len(images)}张图片")

                # 更新主图片src
                if images:
                    main_img_pattern = r'(<img[^>]+class="main-image"[^>]+src=")[^"]*"'
                    replacement = f'\\1{images[0]}"'
                    new_content = re.sub(main_img_pattern, replacement, content)
                    if new_content != content:
                        content = new_content
                        fixes_applied.append(f"更新主图片src: {images[0]}")

    # 修复其他问题
    # 1. 修复未闭合的img标签
    unclosed_img_pattern = r'(<img[^>]+class="main-image"[^>]+onerror="[^"]*";?)\s*(?![>])'
    if re.search(unclosed_img_pattern, content):
        content = re.sub(unclosed_img_pattern, r'\1>', content)
        fixes_applied.append("修复未闭合的img标签")

    # 2. 隐藏图片状态指示器
    status_pattern = r'<div class="image-status"(?![^>]*style="display: none;")([^>]*)>'
    if re.search(status_pattern, content):
        content = re.sub(status_pattern, r'<div class="image-status" style="display: none;"\1>', content)
        fixes_applied.append("隐藏图片状态指示器")

    # 3. 添加data-product-id
    if f'data-product-id="{product_id}"' not in content:
        product_images_pattern = r'(<div class="product-images[^"]*")'
        replacement = f'\\1 data-product-id="{product_id}"'
        new_content = re.sub(product_images_pattern, replacement, content)
        if new_content != content:
            content = new_content
            fixes_applied.append(f"添加data-product-id: {product_id}")

    # 写回文件
    if content != original_content:
        try:
            with open(html_file, 'w', encoding='utf-8') as f:
                f.write(content)
            return True, fixes_applied
        except:
            return False, []

    return False, fixes_applied

def main():
    """主函数"""
    print("=" * 80)
    print("🔍 验证和修复产品详情页图片路径")
    print("=" * 80)

    # 获取可用图片
    available_images = get_available_images()
    print(f"📁 发现 {len(available_images)} 个可用图片")

    # 获取所有产品页面
    product_files = glob.glob(os.path.join(PRODUCTS_DIR, "*.html"))
    product_files.sort()

    results = {
        'perfect': [],
        'minor_issues': [],
        'image_issues': [],
        'major_issues': [],
        'read_error': []
    }

    fixes_summary = []

    print(f"\n🔍 分析 {len(product_files)} 个产品页面...")

    for i, html_file in enumerate(product_files, 1):
        product_id = Path(html_file).stem
        print(f"[{i:2d}/{len(product_files)}] 分析: {product_id}")

        # 分析页面
        analysis = analyze_product_page(html_file, available_images)
        results[analysis['status']].append({
            'product_id': product_id,
            'analysis': analysis
        })

        # 如果有问题，尝试修复
        if analysis['status'] in ['minor_issues', 'image_issues', 'major_issues']:
            if analysis['recommendations']:
                success, fixes = fix_product_page(html_file, analysis, available_images)
                if success and fixes:
                    print(f"   ✅ 修复: {', '.join(fixes[:2])}")
                    if len(fixes) > 2:
                        print(f"       + {len(fixes)-2} 项其他修复")
                    fixes_summary.append({
                        'product_id': product_id,
                        'fixes': fixes
                    })
                elif analysis['issues']:
                    print(f"   ⚠️  问题: {', '.join(analysis['issues'][:2])}")
            else:
                print(f"   ⚠️  问题: {', '.join(analysis['issues'][:2])}")
        else:
            print(f"   ✅ 状态: {analysis['status']}")

    # 生成报告
    print("\n" + "=" * 80)
    print("📊 验证结果报告")
    print("=" * 80)

    total_pages = len(product_files)
    perfect_count = len(results['perfect'])
    minor_count = len(results['minor_issues'])
    image_count = len(results['image_issues'])
    major_count = len(results['major_issues'])
    error_count = len(results['read_error'])

    print(f"\n📈 状态统计:")
    print(f"   ✅ 完美状态: {perfect_count} ({perfect_count/total_pages*100:.1f}%)")
    print(f"   ✨ 轻微问题: {minor_count} ({minor_count/total_pages*100:.1f}%)")
    print(f"   🖼️  图片问题: {image_count} ({image_count/total_pages*100:.1f}%)")
    print(f"   ❌ 严重问题: {major_count} ({major_count/total_pages*100:.1f}%)")
    print(f"   💥 读取错误: {error_count} ({error_count/total_pages*100:.1f}%)")

    working_pages = perfect_count + minor_count
    print(f"\n🎯 总体评估:")
    print(f"   工作正常: {working_pages}/{total_pages} ({working_pages/total_pages*100:.1f}%)")
    print(f"   需要修复: {image_count + major_count}")
    print(f"   本次修复: {len(fixes_summary)} 个页面")

    if fixes_summary:
        print(f"\n🔧 修复详情:")
        for fix in fixes_summary[:10]:
            print(f"   {fix['product_id']}: {len(fix['fixes'])} 项修复")
        if len(fixes_summary) > 10:
            print(f"   ... 还有 {len(fixes_summary)-10} 个页面被修复")

    # 保存详细报告
    report_data = {
        'summary': {
            'total_pages': total_pages,
            'perfect': perfect_count,
            'minor_issues': minor_count,
            'image_issues': image_count,
            'major_issues': major_count,
            'read_error': error_count,
            'fixes_applied': len(fixes_summary)
        },
        'results': results,
        'fixes_summary': fixes_summary
    }

    report_file = os.path.join(SCRIPTS_DIR, 'product_pages_verification_report.json')
    with open(report_file, 'w', encoding='utf-8') as f:
        json.dump(report_data, f, ensure_ascii=False, indent=2)

    print(f"\n💾 详细报告保存到: {report_file}")

if __name__ == "__main__":
    main()