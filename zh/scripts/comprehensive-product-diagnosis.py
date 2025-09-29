#!/usr/bin/env python3
"""
39个产品详情页全面诊断工具
逐一检查每个产品页面的JavaScript引用、图片配置和文件存在情况
确保零遗漏，每个产品都得到正确处理
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
JS_DIR = os.path.join(PROJECT_ROOT, "js")
SCRIPTS_DIR = os.path.join(PROJECT_ROOT, "scripts")

def get_all_product_files():
    """获取所有39个产品HTML文件"""
    product_files = glob.glob(os.path.join(PRODUCTS_DIR, "*.html"))
    product_files.sort()

    print(f"📁 发现 {len(product_files)} 个产品HTML文件")

    # 列出所有产品ID
    product_ids = []
    for file_path in product_files:
        product_id = Path(file_path).stem
        product_ids.append(product_id)

    print("📋 产品列表:")
    for i, product_id in enumerate(product_ids, 1):
        print(f"   {i:2d}. {product_id}")

    return product_files

def check_javascript_references(html_file):
    """检查JavaScript引用情况"""
    try:
        with open(html_file, 'r', encoding='utf-8') as f:
            content = f.read()
    except:
        return {'error': '无法读取文件', 'status': 'read_error'}

    required_scripts = {
        'multi-image-gallery.js': False,
        'product-database.js': False
    }

    # 检查每个必需的脚本
    for script_name in required_scripts:
        if script_name in content:
            required_scripts[script_name] = True

    # 计算缺失的脚本
    missing_scripts = [script for script, exists in required_scripts.items() if not exists]

    return {
        'required_scripts': required_scripts,
        'missing_scripts': missing_scripts,
        'status': 'complete' if not missing_scripts else 'missing_js'
    }

def check_image_configuration(html_file):
    """检查图片配置情况"""
    product_id = Path(html_file).stem

    try:
        with open(html_file, 'r', encoding='utf-8') as f:
            content = f.read()
    except:
        return {'error': '无法读取文件', 'status': 'read_error'}

    config_check = {
        'has_main_image': False,
        'has_data_images': False,
        'has_data_product_id': False,
        'main_image_src': None,
        'data_images_list': [],
        'configured_images_count': 0
    }

    # 1. 检查主图片标签
    img_pattern = r'<img[^>]*class="main-image"[^>]*src="([^"]*)"[^>]*>'
    img_match = re.search(img_pattern, content, re.DOTALL)
    if img_match:
        config_check['has_main_image'] = True
        config_check['main_image_src'] = img_match.group(1)

    # 2. 检查data-images配置
    data_images_pattern = r'data-images="([^"]*)"'
    data_match = re.search(data_images_pattern, content)
    if data_match:
        config_check['has_data_images'] = True
        images_str = data_match.group(1)
        if images_str.strip():
            images_list = [img.strip() for img in images_str.split(',') if img.strip()]
            config_check['data_images_list'] = images_list
            config_check['configured_images_count'] = len(images_list)

    # 3. 检查data-product-id
    if f'data-product-id="{product_id}"' in content:
        config_check['has_data_product_id'] = True

    # 确定状态
    if config_check['has_main_image'] and config_check['has_data_images'] and config_check['has_data_product_id']:
        config_check['status'] = 'complete'
    elif config_check['has_main_image']:
        config_check['status'] = 'partial'
    else:
        config_check['status'] = 'missing_config'

    return config_check

def check_image_files_existence(image_config):
    """检查图片文件是否存在"""
    file_check = {
        'main_image_exists': False,
        'data_images_exist': [],
        'missing_images': [],
        'existing_images': [],
        'total_configured': 0,
        'total_existing': 0
    }

    # 检查主图片文件
    if image_config.get('main_image_src'):
        main_src = image_config['main_image_src']
        if main_src.startswith('../images/products/'):
            img_filename = main_src.replace('../images/products/', '')
            img_path = os.path.join(IMAGES_PRODUCTS, img_filename)
            file_check['main_image_exists'] = os.path.exists(img_path)

    # 检查data-images文件
    for img_path in image_config.get('data_images_list', []):
        if img_path.startswith('../images/products/'):
            img_filename = img_path.replace('../images/products/', '')
            full_path = os.path.join(IMAGES_PRODUCTS, img_filename)
            exists = os.path.exists(full_path)

            file_check['data_images_exist'].append({
                'path': img_path,
                'filename': img_filename,
                'exists': exists
            })

            if exists:
                file_check['existing_images'].append(img_filename)
            else:
                file_check['missing_images'].append(img_filename)

    file_check['total_configured'] = len(image_config.get('data_images_list', []))
    file_check['total_existing'] = len(file_check['existing_images'])

    # 确定状态
    if file_check['total_configured'] == 0:
        file_check['status'] = 'no_config'
    elif file_check['total_existing'] == file_check['total_configured']:
        file_check['status'] = 'all_exist'
    elif file_check['total_existing'] > 0:
        file_check['status'] = 'partial_exist'
    else:
        file_check['status'] = 'none_exist'

    return file_check

def find_available_images_for_product(product_id):
    """查找产品可用的图片文件"""
    available_images = []

    # 搜索模式
    patterns = [
        f"{product_id}*.png",
        f"{product_id}*.jpg",
        f"{product_id}*.jpeg"
    ]

    for pattern in patterns:
        for img_path in glob.glob(os.path.join(IMAGES_PRODUCTS, pattern)):
            filename = os.path.basename(img_path)
            available_images.append({
                'filename': filename,
                'path': f"../images/products/{filename}",
                'size': os.path.getsize(img_path)
            })

    # 按优先级排序
    def sort_priority(img):
        name = img['filename'].lower()
        if 'official' in name:
            return 0
        elif 'new' in name:
            return 1
        elif re.search(r'-\d+\.', name):
            return 2
        else:
            return 3

    available_images.sort(key=sort_priority)
    return available_images

def categorize_product_issues(js_check, img_config, file_check, available_images):
    """对产品问题进行分类"""
    issues = []
    category = None
    priority = 0

    # A类：缺少JavaScript引用
    if js_check['status'] == 'missing_js':
        issues.append(f"缺少JavaScript: {', '.join(js_check['missing_scripts'])}")
        category = 'A - 缺少JavaScript'
        priority = 1

    # B类：缺少图片配置
    if img_config['status'] in ['missing_config', 'partial']:
        if not img_config['has_main_image']:
            issues.append("缺少主图片标签")
        if not img_config['has_data_images']:
            issues.append("缺少data-images配置")
        if not img_config['has_data_product_id']:
            issues.append("缺少data-product-id")

        if category is None:
            category = 'B - 缺少图片配置'
            priority = 2

    # C类：图片文件缺失
    if file_check['status'] in ['none_exist', 'partial_exist']:
        if file_check['missing_images']:
            issues.append(f"图片文件缺失: {len(file_check['missing_images'])}个")

        if category is None:
            category = 'C - 图片文件缺失'
            priority = 3

    # D类：HTML结构问题（需要进一步检查）
    if not issues:
        if available_images and img_config['configured_images_count'] == 0:
            issues.append("有可用图片但未配置")
            category = 'D - HTML结构问题'
            priority = 4

    # E类：完全正常
    if not issues:
        category = 'E - 完全正常'
        priority = 0

    return {
        'category': category,
        'priority': priority,
        'issues': issues
    }

def diagnose_single_product(html_file):
    """诊断单个产品页面"""
    product_id = Path(html_file).stem

    # 1. JavaScript检查
    js_check = check_javascript_references(html_file)

    # 2. 图片配置检查
    img_config = check_image_configuration(html_file)

    # 3. 图片文件检查
    file_check = check_image_files_existence(img_config)

    # 4. 查找可用图片
    available_images = find_available_images_for_product(product_id)

    # 5. 问题分类
    categorization = categorize_product_issues(js_check, img_config, file_check, available_images)

    return {
        'product_id': product_id,
        'javascript': js_check,
        'image_config': img_config,
        'file_check': file_check,
        'available_images': available_images,
        'categorization': categorization
    }

def run_comprehensive_diagnosis():
    """运行39个产品的全面诊断"""
    print("=" * 80)
    print("🔍 39个产品详情页全面诊断")
    print("=" * 80)

    # 获取所有产品文件
    product_files = get_all_product_files()

    if len(product_files) != 39:
        print(f"⚠️ 警告：期望39个产品，实际发现{len(product_files)}个")

    print(f"\n🔬 开始逐一诊断...")

    # 诊断结果
    diagnosis_results = {}
    category_counts = {}

    for i, html_file in enumerate(product_files, 1):
        product_id = Path(html_file).stem
        print(f"[{i:2d}/39] 诊断: {product_id}")

        # 诊断单个产品
        result = diagnose_single_product(html_file)
        diagnosis_results[product_id] = result

        # 统计分类
        category = result['categorization']['category']
        if category not in category_counts:
            category_counts[category] = 0
        category_counts[category] += 1

        # 显示问题
        issues = result['categorization']['issues']
        if issues:
            print(f"    ⚠️ {category}: {', '.join(issues[:2])}")
            if len(issues) > 2:
                print(f"       + {len(issues)-2} 个其他问题")
        else:
            print(f"    ✅ {category}")

    # 生成诊断报告
    print("\n" + "=" * 80)
    print("📊 诊断结果汇总")
    print("=" * 80)

    print(f"\n📈 分类统计:")
    for category, count in sorted(category_counts.items()):
        percentage = count / len(product_files) * 100
        print(f"   {category}: {count} 个 ({percentage:.1f}%)")

    # 按优先级分类显示
    priority_groups = {}
    for product_id, result in diagnosis_results.items():
        priority = result['categorization']['priority']
        if priority not in priority_groups:
            priority_groups[priority] = []
        priority_groups[priority].append(product_id)

    print(f"\n🎯 修复优先级:")
    priority_names = {
        1: "🚨 高优先级 - JavaScript缺失",
        2: "⚙️ 中优先级 - 配置缺失",
        3: "📁 中优先级 - 文件缺失",
        4: "🔧 低优先级 - 结构问题",
        0: "✅ 无需修复 - 完全正常"
    }

    for priority in sorted(priority_groups.keys()):
        if priority in priority_names:
            products = priority_groups[priority]
            print(f"   {priority_names[priority]}: {len(products)} 个")
            if len(products) <= 10:
                print(f"      {', '.join(products)}")
            else:
                print(f"      {', '.join(products[:10])}...")

    # 保存详细诊断结果
    report_data = {
        'total_products': len(product_files),
        'category_counts': category_counts,
        'priority_groups': priority_groups,
        'detailed_results': diagnosis_results
    }

    report_file = os.path.join(SCRIPTS_DIR, 'comprehensive_product_diagnosis.json')
    with open(report_file, 'w', encoding='utf-8') as f:
        json.dump(report_data, f, ensure_ascii=False, indent=2)

    print(f"\n💾 详细诊断结果保存到: {report_file}")

    return report_data

if __name__ == "__main__":
    run_comprehensive_diagnosis()