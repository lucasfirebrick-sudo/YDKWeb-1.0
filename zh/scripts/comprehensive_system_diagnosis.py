#!/usr/bin/env python3
"""
彻底检查整个39个产品系统的图片显示情况
检查：首页产品展示卡片、产品中心所有产品卡片、39个产品详情页
逐个完成，不跳过，仔细详细分析
"""

import os
import json
import re
from pathlib import Path
from collections import defaultdict

# 路径配置
PROJECT_ROOT = r"D:\ai\新建文件夹\新建文件夹\7788"
PRODUCTS_DIR = os.path.join(PROJECT_ROOT, "products")
IMAGES_PRODUCTS = os.path.join(PROJECT_ROOT, "images", "products")
SCRIPTS_DIR = os.path.join(PROJECT_ROOT, "scripts")

def check_image_exists(image_path):
    """检查图片文件是否存在"""
    if image_path.startswith('../'):
        # 相对路径，需要转换为绝对路径
        relative_path = image_path[3:]  # 去掉 '../'
        full_path = os.path.join(PROJECT_ROOT, relative_path)
    else:
        full_path = os.path.join(PROJECT_ROOT, image_path)

    return os.path.exists(full_path)

def analyze_homepage_products():
    """分析首页产品展示卡片"""
    print("🏠 分析首页产品展示卡片...")

    index_file = os.path.join(PROJECT_ROOT, "index.html")
    if not os.path.exists(index_file):
        return {"error": "index.html不存在"}

    try:
        with open(index_file, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        return {"error": f"读取index.html失败: {e}"}

    # 查找所有产品卡片
    card_pattern = r'<div class="product-card">(.*?)</div>\s*(?=<div class="product-card">|<div class="hover-overlay">)'
    cards = re.findall(card_pattern, content, re.DOTALL)

    results = []
    card_count = 0

    # 更准确的查找方式
    img_pattern = r'<img src="([^"]*)" alt="([^"]*)"[^>]*>'
    all_images = re.findall(img_pattern, content)

    for img_src, img_alt in all_images:
        if 'products/' in img_src and 'logo' not in img_src.lower():
            card_count += 1
            exists = check_image_exists(img_src)

            result = {
                'card_number': card_count,
                'product_name': img_alt,
                'image_src': img_src,
                'image_exists': exists,
                'status': '✅ 正常' if exists else '❌ 图片缺失'
            }
            results.append(result)

            print(f"   卡片 {card_count:2d}: {img_alt:15s} → {img_src:50s} {result['status']}")

    summary = {
        'total_cards': len(results),
        'images_exist': sum(1 for r in results if r['image_exists']),
        'images_missing': sum(1 for r in results if not r['image_exists']),
        'cards': results
    }

    print(f"   📊 首页产品卡片: {summary['total_cards']} 个，图片正常 {summary['images_exist']} 个，缺失 {summary['images_missing']} 个")
    return summary

def analyze_products_center():
    """分析产品中心所有产品卡片"""
    print("\n🏭 分析产品中心所有产品卡片...")

    products_file = os.path.join(PROJECT_ROOT, "products.html")
    if not os.path.exists(products_file):
        return {"error": "products.html不存在"}

    try:
        with open(products_file, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        return {"error": f"读取products.html失败: {e}"}

    # 查找所有产品卡片
    img_pattern = r'<img src="([^"]*)" alt="([^"]*)"[^>]*>'
    all_images = re.findall(img_pattern, content)

    results = []
    card_count = 0

    for img_src, img_alt in all_images:
        if 'products/' in img_src and 'logo' not in img_src.lower():
            card_count += 1
            exists = check_image_exists(img_src)

            result = {
                'card_number': card_count,
                'product_name': img_alt,
                'image_src': img_src,
                'image_exists': exists,
                'status': '✅ 正常' if exists else '❌ 图片缺失'
            }
            results.append(result)

            print(f"   卡片 {card_count:2d}: {img_alt:20s} → {img_src:50s} {result['status']}")

    summary = {
        'total_cards': len(results),
        'images_exist': sum(1 for r in results if r['image_exists']),
        'images_missing': sum(1 for r in results if not r['image_exists']),
        'cards': results
    }

    print(f"   📊 产品中心卡片: {summary['total_cards']} 个，图片正常 {summary['images_exist']} 个，缺失 {summary['images_missing']} 个")
    return summary

def analyze_single_product_detail(product_id):
    """分析单个产品详情页"""
    html_file = os.path.join(PRODUCTS_DIR, f"{product_id}.html")

    if not os.path.exists(html_file):
        return {
            'product_id': product_id,
            'status': 'error',
            'error': '页面文件不存在',
            'issues': ['HTML文件缺失']
        }

    try:
        with open(html_file, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        return {
            'product_id': product_id,
            'status': 'error',
            'error': f'读取文件失败: {e}',
            'issues': ['文件读取错误']
        }

    result = {
        'product_id': product_id,
        'status': 'ok',
        'issues': [],
        'structure_problems': [],
        'image_analysis': {},
        'placeholder_analysis': {},
        'javascript_analysis': {}
    }

    # 1. 检查主图片配置
    main_image_pattern = r'<img[^>]+class="main-image"[^>]*>'
    main_images = re.findall(main_image_pattern, content)

    if len(main_images) == 0:
        result['issues'].append('缺少主图片标签')
        result['structure_problems'].append('无main-image标签')
    elif len(main_images) > 1:
        result['issues'].append(f'重复的主图片标签 ({len(main_images)}个)')
        result['structure_problems'].append('重复img标签')

    # 分析主图片
    if main_images:
        first_img = main_images[0]

        # 提取src
        src_match = re.search(r'src="([^"]*)"', first_img)
        main_src = src_match.group(1) if src_match else None

        # 提取data-images
        data_images_match = re.search(r'data-images="([^"]*)"', first_img)
        data_images = data_images_match.group(1) if data_images_match else None

        # 检查图片是否存在
        src_exists = check_image_exists(main_src) if main_src else False

        result['image_analysis'] = {
            'main_image_count': len(main_images),
            'main_src': main_src,
            'main_src_exists': src_exists,
            'has_data_images': bool(data_images),
            'data_images': data_images.split(',') if data_images else [],
            'data_images_count': len(data_images.split(',')) if data_images else 0
        }

        if not src_exists:
            result['issues'].append('主图片文件不存在')

    # 2. 检查占位符
    placeholder_patterns = [
        r'<div[^>]*class="[^"]*placeholder[^"]*"[^>]*>',
        r'产品图片更新中',
        r'产品图片正在烧制中',
        r'Product Image in Production'
    ]

    placeholder_found = []
    for pattern in placeholder_patterns:
        matches = re.findall(pattern, content)
        if matches:
            placeholder_found.extend(matches)

    result['placeholder_analysis'] = {
        'has_placeholders': len(placeholder_found) > 0,
        'placeholder_count': len(placeholder_found),
        'placeholder_types': placeholder_found
    }

    # 3. 检查JavaScript引用
    js_pattern = r'<script src="([^"]*)" defer></script>'
    js_scripts = re.findall(js_pattern, content)

    has_multi_gallery = any('multi-image-gallery.js' in script for script in js_scripts)
    has_product_db = any('product-database.js' in script for script in js_scripts)

    result['javascript_analysis'] = {
        'total_scripts': len(js_scripts),
        'has_multi_gallery': has_multi_gallery,
        'has_product_database': has_product_db,
        'all_scripts': js_scripts
    }

    if not has_multi_gallery:
        result['issues'].append('缺少multi-image-gallery.js')

    # 4. 检查HTML结构问题
    if '<!-- 图片状态指示器 -- data-images=' in content:
        result['structure_problems'].append('data-images在HTML注释中')
        result['issues'].append('data-images配置在注释中，无效')

    # 确定整体状态
    if result['issues']:
        result['status'] = 'has_issues'

    return result

def analyze_all_product_details():
    """分析所有39个产品详情页"""
    print("\n📄 分析所有39个产品详情页...")

    # 获取所有产品ID
    product_ids = []
    for file in os.listdir(PRODUCTS_DIR):
        if file.endswith('.html'):
            product_id = file[:-5]  # 移除.html
            product_ids.append(product_id)

    product_ids.sort()

    results = {}
    issues_summary = defaultdict(int)

    for i, product_id in enumerate(product_ids, 1):
        print(f"   [{i:2d}/{len(product_ids)}] 分析: {product_id}")

        result = analyze_single_product_detail(product_id)
        results[product_id] = result

        # 统计问题类型
        for issue in result['issues']:
            issues_summary[issue] += 1

        # 显示状态
        if result['status'] == 'ok':
            status_icon = "✅"
        elif result['status'] == 'has_issues':
            status_icon = "⚠️"
        else:
            status_icon = "❌"

        print(f"      {status_icon} {result['status']} - {len(result['issues'])} 个问题")

        # 显示主要问题
        if result['issues']:
            for issue in result['issues'][:2]:  # 只显示前2个问题
                print(f"         • {issue}")

    # 统计总结
    total_products = len(results)
    ok_count = sum(1 for r in results.values() if r['status'] == 'ok')
    issues_count = sum(1 for r in results.values() if r['status'] == 'has_issues')
    error_count = sum(1 for r in results.values() if r['status'] == 'error')

    summary = {
        'total_products': total_products,
        'ok_count': ok_count,
        'issues_count': issues_count,
        'error_count': error_count,
        'common_issues': dict(issues_summary),
        'detailed_results': results
    }

    print(f"\n   📊 产品详情页总结:")
    print(f"      总数: {total_products}, 正常: {ok_count}, 有问题: {issues_count}, 错误: {error_count}")
    print(f"      常见问题:")
    for issue, count in sorted(issues_summary.items(), key=lambda x: x[1], reverse=True):
        print(f"         • {issue}: {count} 个产品")

    return summary

def generate_comprehensive_report(homepage_result, products_center_result, details_result):
    """生成综合报告"""
    print("\n" + "=" * 80)
    print("📊 整个系统图片显示状况综合报告")
    print("=" * 80)

    # 首页状况
    print(f"\n🏠 首页产品展示:")
    if 'error' not in homepage_result:
        print(f"   产品卡片: {homepage_result['total_cards']} 个")
        print(f"   图片正常: {homepage_result['images_exist']} 个")
        print(f"   图片缺失: {homepage_result['images_missing']} 个")
        print(f"   正常率: {homepage_result['images_exist']/homepage_result['total_cards']*100:.1f}%")
    else:
        print(f"   ❌ {homepage_result['error']}")

    # 产品中心状况
    print(f"\n🏭 产品中心:")
    if 'error' not in products_center_result:
        print(f"   产品卡片: {products_center_result['total_cards']} 个")
        print(f"   图片正常: {products_center_result['images_exist']} 个")
        print(f"   图片缺失: {products_center_result['images_missing']} 个")
        print(f"   正常率: {products_center_result['images_exist']/products_center_result['total_cards']*100:.1f}%")
    else:
        print(f"   ❌ {products_center_result['error']}")

    # 产品详情页状况
    print(f"\n📄 产品详情页:")
    print(f"   总产品数: {details_result['total_products']} 个")
    print(f"   完全正常: {details_result['ok_count']} 个")
    print(f"   有问题: {details_result['issues_count']} 个")
    print(f"   严重错误: {details_result['error_count']} 个")
    print(f"   健康率: {details_result['ok_count']/details_result['total_products']*100:.1f}%")

    # 问题分析
    print(f"\n🔍 主要问题分析:")
    if details_result['common_issues']:
        for issue, count in sorted(details_result['common_issues'].items(), key=lambda x: x[1], reverse=True)[:5]:
            print(f"   • {issue}: {count} 个产品 ({count/details_result['total_products']*100:.1f}%)")

    # 整体系统健康度
    total_components = 3  # 首页、产品中心、详情页
    healthy_components = 0

    if 'error' not in homepage_result and homepage_result['images_missing'] == 0:
        healthy_components += 1
    if 'error' not in products_center_result and products_center_result['images_missing'] == 0:
        healthy_components += 1
    if details_result['error_count'] == 0 and details_result['issues_count'] < details_result['total_products'] * 0.1:
        healthy_components += 1

    system_health = healthy_components / total_components * 100

    print(f"\n🏥 系统整体健康度: {system_health:.1f}%")

    if system_health >= 90:
        print("   🎉 系统状态优秀！")
    elif system_health >= 70:
        print("   👍 系统状态良好")
    elif system_health >= 50:
        print("   ⚠️ 系统需要优化")
    else:
        print("   🚨 系统需要大量修复工作")

    # 优先修复建议
    print(f"\n📝 优先修复建议:")

    priority_issues = []

    if 'error' in homepage_result:
        priority_issues.append("🚨 首页无法正常显示")
    elif homepage_result['images_missing'] > 0:
        priority_issues.append(f"⚠️ 首页 {homepage_result['images_missing']} 个产品卡片图片缺失")

    if 'error' in products_center_result:
        priority_issues.append("🚨 产品中心无法正常显示")
    elif products_center_result['images_missing'] > 0:
        priority_issues.append(f"⚠️ 产品中心 {products_center_result['images_missing']} 个产品卡片图片缺失")

    if details_result['error_count'] > 0:
        priority_issues.append(f"🚨 {details_result['error_count']} 个产品详情页严重错误")

    if details_result['common_issues']:
        top_issue = max(details_result['common_issues'].items(), key=lambda x: x[1])
        if top_issue[1] > details_result['total_products'] * 0.5:
            priority_issues.append(f"🔧 {top_issue[0]} 影响 {top_issue[1]} 个产品")

    if priority_issues:
        for i, issue in enumerate(priority_issues, 1):
            print(f"   {i}. {issue}")
    else:
        print("   ✅ 暂无紧急修复需求")

def save_comprehensive_data(homepage_result, products_center_result, details_result):
    """保存综合诊断数据"""
    report_file = os.path.join(SCRIPTS_DIR, 'comprehensive_system_diagnosis.json')

    comprehensive_data = {
        'timestamp': str(Path().absolute()),
        'homepage_analysis': homepage_result,
        'products_center_analysis': products_center_result,
        'product_details_analysis': details_result
    }

    try:
        with open(report_file, 'w', encoding='utf-8') as f:
            json.dump(comprehensive_data, f, ensure_ascii=False, indent=2)
        print(f"\n💾 综合诊断数据已保存: {report_file}")
    except Exception as e:
        print(f"\n❌ 保存诊断数据失败: {e}")

def main():
    """主诊断流程"""
    print("🔍 开始彻底检查整个39个产品系统...")
    print("检查范围: 首页产品展示卡片、产品中心所有产品卡片、39个产品详情页")
    print("=" * 80)

    # 1. 分析首页产品展示卡片
    homepage_result = analyze_homepage_products()

    # 2. 分析产品中心所有产品卡片
    products_center_result = analyze_products_center()

    # 3. 分析所有39个产品详情页
    details_result = analyze_all_product_details()

    # 4. 生成综合报告
    generate_comprehensive_report(homepage_result, products_center_result, details_result)

    # 5. 保存数据
    save_comprehensive_data(homepage_result, products_center_result, details_result)

if __name__ == "__main__":
    main()