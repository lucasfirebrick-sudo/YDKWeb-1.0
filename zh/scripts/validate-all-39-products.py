#!/usr/bin/env python3
"""
验证所有39个产品详情页修复效果
检查每个产品页面的图片显示和轮播功能
生成完整的验证报告
"""

import os
import json
import re
from pathlib import Path

# 路径配置
PROJECT_ROOT = r"D:\ai\新建文件夹\新建文件夹\7788"
PRODUCTS_DIR = os.path.join(PROJECT_ROOT, "products")
IMAGES_PRODUCTS = os.path.join(PROJECT_ROOT, "images", "products")
SCRIPTS_DIR = os.path.join(PROJECT_ROOT, "scripts")

def validate_product_page(product_id):
    """验证单个产品页面的配置和文件"""
    html_file = os.path.join(PRODUCTS_DIR, f"{product_id}.html")

    if not os.path.exists(html_file):
        return {
            'status': 'error',
            'error': '产品页面文件不存在',
            'issues': ['HTML文件缺失']
        }

    try:
        with open(html_file, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        return {
            'status': 'error',
            'error': f'读取文件失败: {e}',
            'issues': ['文件读取错误']
        }

    validation_result = {
        'status': 'success',
        'issues': [],
        'warnings': [],
        'fixes_needed': [],
        'javascript_check': {},
        'image_check': {},
        'html_structure': {},
        'available_images': []
    }

    # 1. JavaScript引用检查
    js_scripts = []
    script_pattern = r'<script src="([^"]*)" defer></script>'
    scripts = re.findall(script_pattern, content)

    for script in scripts:
        js_scripts.append(script)

    has_multi_gallery = any('multi-image-gallery.js' in script for script in js_scripts)
    has_product_db = any('product-database.js' in script for script in js_scripts)

    validation_result['javascript_check'] = {
        'scripts_found': js_scripts,
        'has_multi_gallery': has_multi_gallery,
        'has_product_database': has_product_db,
        'status': 'ok' if has_multi_gallery else 'missing_gallery_js'
    }

    if not has_multi_gallery:
        validation_result['issues'].append('缺少multi-image-gallery.js引用')
        validation_result['fixes_needed'].append('添加多图轮播JavaScript引用')

    # 2. 主图片配置检查
    main_image_pattern = r'<img[^>]+class="main-image"[^>]*>'
    main_image_match = re.search(main_image_pattern, content)

    has_main_image = bool(main_image_match)
    has_data_images = False
    main_image_src = None
    data_images = []

    if main_image_match:
        img_tag = main_image_match.group(0)
        # 检查src
        src_pattern = r'src="([^"]*)"'
        src_match = re.search(src_pattern, img_tag)
        if src_match:
            main_image_src = src_match.group(1)

        # 检查data-images
        data_images_pattern = r'data-images="([^"]*)"'
        data_match = re.search(data_images_pattern, img_tag)
        if data_match:
            has_data_images = True
            data_images = data_match.group(1).split(',')

    validation_result['image_check'] = {
        'has_main_image': has_main_image,
        'main_image_src': main_image_src,
        'has_data_images': has_data_images,
        'data_images_count': len(data_images),
        'data_images': data_images
    }

    if not has_main_image:
        validation_result['issues'].append('缺少主图片标签')
        validation_result['fixes_needed'].append('添加main-image标签')

    if has_main_image and not has_data_images:
        validation_result['warnings'].append('主图片存在但缺少data-images配置')

    # 3. 图片状态指示器检查
    status_pattern = r'<div class="image-status"[^>]*>'
    status_match = re.search(status_pattern, content)
    status_hidden = False

    if status_match:
        status_tag = status_match.group(0)
        status_hidden = 'display: none' in status_tag or 'style="display: none;"' in status_tag

    validation_result['html_structure'] = {
        'has_image_status': bool(status_match),
        'status_hidden': status_hidden
    }

    if status_match and not status_hidden:
        validation_result['warnings'].append('图片状态指示器未隐藏，可能显示占位符文本')

    # 4. 检查实际图片文件
    product_image_dir = os.path.join(IMAGES_PRODUCTS, product_id)
    available_images = []

    if os.path.exists(product_image_dir):
        for file in os.listdir(product_image_dir):
            if file.lower().endswith(('.jpg', '.jpeg', '.png', '.webp')):
                file_path = os.path.join(product_image_dir, file)
                file_size = os.path.getsize(file_path)
                available_images.append({
                    'filename': file,
                    'path': f"../images/products/{product_id}/{file}",
                    'size': file_size
                })

    validation_result['available_images'] = available_images

    if not available_images:
        validation_result['warnings'].append('产品图片目录无图片文件')

    # 5. 检查data-product-id
    product_images_pattern = r'<div class="product-images[^"]*"[^>]*data-product-id="([^"]*)"'
    product_id_match = re.search(product_images_pattern, content)
    has_product_id = bool(product_id_match)

    if not has_product_id:
        validation_result['warnings'].append('缺少data-product-id配置')

    # 确定总体状态
    if validation_result['issues']:
        validation_result['status'] = 'needs_fix'
    elif validation_result['warnings']:
        validation_result['status'] = 'has_warnings'
    else:
        validation_result['status'] = 'excellent'

    return validation_result

def get_all_product_ids():
    """获取所有产品ID"""
    products = []
    for file in os.listdir(PRODUCTS_DIR):
        if file.endswith('.html'):
            product_id = file[:-5]  # 移除.html
            products.append(product_id)
    return sorted(products)

def categorize_validation_results(results):
    """对验证结果进行分类"""
    categories = {
        '✅ 完美配置': [],
        '⚠️ 需要优化': [],
        '❌ 需要修复': [],
        '🚫 严重错误': []
    }

    for product_id, result in results.items():
        if result['status'] == 'excellent':
            categories['✅ 完美配置'].append(product_id)
        elif result['status'] == 'has_warnings':
            categories['⚠️ 需要优化'].append(product_id)
        elif result['status'] == 'needs_fix':
            categories['❌ 需要修复'].append(product_id)
        else:
            categories['🚫 严重错误'].append(product_id)

    return categories

def generate_validation_report(results, categories):
    """生成验证报告"""
    total_products = len(results)
    excellent_count = len(categories['✅ 完美配置'])
    warnings_count = len(categories['⚠️ 需要优化'])
    needs_fix_count = len(categories['❌ 需要修复'])
    error_count = len(categories['🚫 严重错误'])

    print("=" * 80)
    print("📊 全部39个产品详情页验证报告")
    print("=" * 80)

    print(f"\n📈 验证统计:")
    print(f"   总产品数: {total_products}")
    print(f"   完美配置: {excellent_count} ({excellent_count/total_products*100:.1f}%)")
    print(f"   需要优化: {warnings_count} ({warnings_count/total_products*100:.1f}%)")
    print(f"   需要修复: {needs_fix_count} ({needs_fix_count/total_products*100:.1f}%)")
    print(f"   严重错误: {error_count} ({error_count/total_products*100:.1f}%)")

    # 按类别详细显示
    for category, products in categories.items():
        if products:
            print(f"\n{category} ({len(products)} 个):")
            for i, product_id in enumerate(products, 1):
                result = results[product_id]
                print(f"   [{i:2d}] {product_id}")

                # 显示主要问题
                if result['issues']:
                    print(f"       问题: {', '.join(result['issues'])}")
                if result['warnings']:
                    print(f"       警告: {', '.join(result['warnings'])}")

                # 显示图片状态
                img_count = len(result['available_images'])
                js_status = "✅" if result['javascript_check']['has_multi_gallery'] else "❌"
                print(f"       图片: {img_count} 张 | JS: {js_status}")

    # 功能完整性检查
    print(f"\n🔧 功能组件检查:")

    js_ok_count = sum(1 for r in results.values() if r['javascript_check']['has_multi_gallery'])
    img_ok_count = sum(1 for r in results.values() if r['image_check']['has_main_image'])
    images_available_count = sum(1 for r in results.values() if r['available_images'])

    print(f"   JavaScript引用: {js_ok_count}/{total_products} ({js_ok_count/total_products*100:.1f}%)")
    print(f"   主图片配置: {img_ok_count}/{total_products} ({img_ok_count/total_products*100:.1f}%)")
    print(f"   有可用图片: {images_available_count}/{total_products} ({images_available_count/total_products*100:.1f}%)")

    # 推荐操作
    print(f"\n📝 下一步操作建议:")

    if needs_fix_count > 0:
        print(f"   1. 🚨 优先修复 {needs_fix_count} 个需要修复的产品")
        print(f"   2. ⚙️ 运行修复脚本解决配置问题")

    if warnings_count > 0:
        print(f"   3. ⚠️ 优化 {warnings_count} 个有警告的产品")

    print(f"   4. 🌐 在浏览器中测试图片轮播功能")
    print(f"   5. 🔄 清除浏览器缓存后重新加载")

    # 整体健康度评分
    health_score = (excellent_count + warnings_count * 0.7) / total_products * 100

    print(f"\n🏥 产品页面健康度: {health_score:.1f}%")

    if health_score >= 90:
        print("   🎉 产品页面配置优秀！")
    elif health_score >= 70:
        print("   👍 产品页面配置良好，还有提升空间")
    elif health_score >= 50:
        print("   ⚠️ 产品页面需要一些修复工作")
    else:
        print("   🚨 产品页面需要大量修复工作")

def save_validation_data(results):
    """保存验证数据"""
    report_file = os.path.join(SCRIPTS_DIR, 'validation_report.json')

    # 为JSON序列化准备数据
    json_data = {
        'timestamp': str(Path().absolute()),
        'total_products': len(results),
        'results': results
    }

    try:
        with open(report_file, 'w', encoding='utf-8') as f:
            json.dump(json_data, f, ensure_ascii=False, indent=2)
        print(f"\n💾 验证数据已保存: {report_file}")
    except Exception as e:
        print(f"\n❌ 保存验证数据失败: {e}")

def main():
    """主验证流程"""
    print("🔍 开始验证所有39个产品详情页...")

    # 获取所有产品
    product_ids = get_all_product_ids()
    print(f"   发现 {len(product_ids)} 个产品页面")

    # 验证每个产品
    results = {}

    for i, product_id in enumerate(product_ids, 1):
        print(f"   [{i:2d}/{len(product_ids)}] 验证: {product_id}")

        result = validate_product_page(product_id)
        results[product_id] = result

        # 简单状态显示
        if result['status'] == 'excellent':
            status_icon = "✅"
        elif result['status'] == 'has_warnings':
            status_icon = "⚠️"
        elif result['status'] == 'needs_fix':
            status_icon = "❌"
        else:
            status_icon = "🚫"

        print(f"      {status_icon} {result['status']}")

    # 分类结果
    categories = categorize_validation_results(results)

    # 生成报告
    generate_validation_report(results, categories)

    # 保存数据
    save_validation_data(results)

if __name__ == "__main__":
    main()