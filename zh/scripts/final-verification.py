#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
最终验证工具
确保所有产品页面问题都已修复
"""

import os
import re
import json
from datetime import datetime

def main():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    products_dir = os.path.join(base_dir, 'products')
    images_dir = os.path.join(base_dir, 'images', 'products')

    print("🎯 开始最终验证所有产品页面...")
    print(f"📅 验证时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("="*80)

    # 获取所有产品页面
    product_files = [f for f in os.listdir(products_dir) if f.endswith('.html')]

    verification_results = {
        'total_products': len(product_files),
        'perfect_products': [],
        'good_products': [],
        'minor_issues': [],
        'critical_issues': [],
        'verification_summary': {}
    }

    # 重点验证产品（用户关注的）
    priority_products = [
        'insulating-brick',  # 用户报告的轮播问题
        'mullite-brick', 'high-alumina-brick', 'clay-brick', 'silica-brick',  # 用户重点关注
        'refractory-castable'  # 之前的关键问题
    ]

    print("🔍 开始验证...")

    for i, filename in enumerate(sorted(product_files), 1):
        product_id = filename.replace('.html', '')
        is_priority = product_id in priority_products

        priority_marker = "⭐" if is_priority else "  "
        print(f"{priority_marker}[{i:2d}/{len(product_files)}] 验证 {product_id}")

        result = verify_product(product_id, products_dir, images_dir)

        # 分类结果
        if result['score'] >= 95:
            verification_results['perfect_products'].append((product_id, result))
        elif result['score'] >= 85:
            verification_results['good_products'].append((product_id, result))
        elif result['score'] >= 70:
            verification_results['minor_issues'].append((product_id, result))
        else:
            verification_results['critical_issues'].append((product_id, result))

        # 显示简要结果
        print_verification_status(product_id, result, is_priority)

    # 生成最终报告
    generate_final_report(verification_results, priority_products, base_dir)

def verify_product(product_id, products_dir, images_dir):
    """验证单个产品页面"""
    result = {
        'product_id': product_id,
        'score': 0,
        'checks': {},
        'issues': [],
        'status': 'unknown'
    }

    filepath = os.path.join(products_dir, f'{product_id}.html')

    if not os.path.exists(filepath):
        result['issues'].append('产品文件不存在')
        return result

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. HTML结构检查 (20分)
    html_score = check_html_structure(content)
    result['checks']['html_structure'] = html_score
    result['score'] += html_score

    # 2. 图片配置检查 (25分)
    img_score = check_image_configuration(content, images_dir)
    result['checks']['image_config'] = img_score
    result['score'] += img_score

    # 3. JavaScript引用检查 (20分)
    js_score = check_javascript_references(content)
    result['checks']['javascript'] = js_score
    result['score'] += js_score

    # 4. 轮播功能检查 (20分)
    carousel_score = check_carousel_functionality(content)
    result['checks']['carousel'] = carousel_score
    result['score'] += carousel_score

    # 5. 获取报价功能检查 (15分)
    quote_score = check_quote_functionality(content, product_id)
    result['checks']['quote_function'] = quote_score
    result['score'] += quote_score

    # 确定状态
    if result['score'] >= 95:
        result['status'] = 'perfect'
    elif result['score'] >= 85:
        result['status'] = 'good'
    elif result['score'] >= 70:
        result['status'] = 'minor_issues'
    else:
        result['status'] = 'critical'

    return result

def check_html_structure(content):
    """检查HTML结构 (20分)"""
    score = 20
    issues = []

    # 检查未闭合的img标签
    unclosed_img = re.findall(r'<img[^>]*(?<!/)>', content)
    if unclosed_img:
        score -= 10
        issues.append(f'发现{len(unclosed_img)}个未闭合img标签')

    # 检查基本结构元素
    required_elements = [
        r'<h1[^>]*class="product-title"',
        r'<img[^>]*class="main-image"',
        r'<div[^>]*class="product-info"'
    ]

    for element in required_elements:
        if not re.search(element, content):
            score -= 3
            issues.append(f'缺少必需元素')

    return max(0, score)

def check_image_configuration(content, images_dir):
    """检查图片配置 (25分)"""
    score = 25
    issues = []

    # 检查主图片
    main_img_match = re.search(r'<img[^>]*class="main-image"[^>]*src="([^"]*)"', content)
    if not main_img_match:
        score -= 10
        issues.append('缺少主图片')
        return max(0, score)

    main_img_src = main_img_match.group(1).replace('../images/products/', '')

    # 检查主图片文件是否存在
    main_img_path = os.path.join(images_dir, main_img_src)
    if not os.path.exists(main_img_path):
        score -= 15
        issues.append('主图片文件不存在')

    # 检查data-images配置
    data_images_match = re.search(r'data-images="([^"]*)"', content)
    if data_images_match:
        data_images = data_images_match.group(1)

        # 检查是否包含placeholder.jpg
        if 'placeholder.jpg' in data_images:
            score -= 8
            issues.append('data-images包含placeholder.jpg')

        # 检查所有配置的图片是否存在
        if data_images.strip():
            images = [img.strip().replace('../images/products/', '')
                     for img in data_images.split(',') if img.strip()]

            for img in images:
                img_path = os.path.join(images_dir, img)
                if not os.path.exists(img_path):
                    score -= 5
                    issues.append(f'图片文件不存在: {img}')

    return max(0, score)

def check_javascript_references(content):
    """检查JavaScript引用 (20分)"""
    score = 20
    required_scripts = [
        'multi-image-gallery.js',
        'modal-components.js',
        'placeholder-randomizer.js'
    ]

    for script in required_scripts:
        if script not in content:
            score -= 7

    return max(0, score)

def check_carousel_functionality(content):
    """检查轮播功能 (20分)"""
    score = 20

    # 检查data-images配置
    data_images_match = re.search(r'data-images="([^"]*)"', content)
    if data_images_match:
        data_images = data_images_match.group(1)

        if data_images.strip():
            images = [img.strip() for img in data_images.split(',') if img.strip()]

            # 单图片不应该启用复杂轮播
            if len(images) == 1:
                # 这是正确的，单图片应该简单显示
                pass
            elif len(images) > 1:
                # 多图片应该有轮播功能
                if 'multi-image-gallery' not in content:
                    score -= 10
        else:
            # 空配置，检查是否有data-placeholder
            if 'data-placeholder="true"' not in content:
                score -= 5

    return max(0, score)

def check_quote_functionality(content, product_id):
    """检查获取报价功能 (15分)"""
    score = 15

    # 检查获取报价按钮
    quote_button_match = re.search(r'openInquiryModal\([\'"]([^\'"]*)[\'"]', content)
    if not quote_button_match:
        score -= 8
        return max(0, score)

    modal_product_id = quote_button_match.group(1)
    if modal_product_id != product_id:
        score -= 7

    return max(0, score)

def print_verification_status(product_id, result, is_priority):
    """打印验证状态"""
    status_icons = {
        'perfect': '🎉',
        'good': '✅',
        'minor_issues': '⚠️',
        'critical': '❌'
    }

    icon = status_icons.get(result['status'], '❓')
    priority_text = " (重点产品)" if is_priority else ""

    print(f"     {icon} {result['score']:3d}分 - {result['status'].upper()}{priority_text}")

    # 显示主要问题
    if result['issues']:
        for issue in result['issues'][:2]:  # 只显示前2个问题
            print(f"        🔸 {issue}")

def generate_final_report(verification_results, priority_products, base_dir):
    """生成最终验证报告"""
    total = verification_results['total_products']
    perfect = len(verification_results['perfect_products'])
    good = len(verification_results['good_products'])
    minor = len(verification_results['minor_issues'])
    critical = len(verification_results['critical_issues'])

    print("\n" + "="*80)
    print("🎯 最终验证报告")
    print("="*80)

    print(f"📊 总体统计:")
    print(f"   🎉 完美产品: {perfect:2d} 个 ({perfect/total*100:.1f}%)")
    print(f"   ✅ 良好产品: {good:2d} 个 ({good/total*100:.1f}%)")
    print(f"   ⚠️  轻微问题: {minor:2d} 个 ({minor/total*100:.1f}%)")
    print(f"   ❌ 关键问题: {critical:2d} 个 ({critical/total*100:.1f}%)")

    # 重点产品验证
    print(f"\n⭐ 重点产品验证结果:")
    for product_id in priority_products:
        for category_name, products in [
            ('perfect', verification_results['perfect_products']),
            ('good', verification_results['good_products']),
            ('minor_issues', verification_results['minor_issues']),
            ('critical_issues', verification_results['critical_issues'])
        ]:
            for pid, result in products:
                if pid == product_id:
                    icon = {'perfect': '🎉', 'good': '✅', 'minor_issues': '⚠️', 'critical_issues': '❌'}[category_name]
                    print(f"   {icon} {product_id}: {result['score']}分")
                    break

    # 质量保证
    success_rate = (perfect + good) / total * 100
    print(f"\n🎯 质量保证指标:")
    print(f"   ✅ 成功率: {success_rate:.1f}% (≥85分)")
    print(f"   🎉 完美率: {perfect/total*100:.1f}% (≥95分)")

    if success_rate >= 95:
        print(f"   🏆 质量等级: 优秀")
    elif success_rate >= 85:
        print(f"   🥇 质量等级: 良好")
    elif success_rate >= 70:
        print(f"   🥈 质量等级: 合格")
    else:
        print(f"   🥉 质量等级: 需要改进")

    # 保存详细报告
    report_path = os.path.join(base_dir, 'final-verification-report.json')
    with open(report_path, 'w', encoding='utf-8') as f:
        json.dump(verification_results, f, ensure_ascii=False, indent=2)

    print(f"\n📄 详细验证报告已保存到: {report_path}")

    # 给出建议
    print(f"\n💡 修复建议:")
    if critical > 0:
        print(f"   🚨 立即处理 {critical} 个关键问题产品")
    if minor > 0:
        print(f"   ⚠️  优化 {minor} 个轻微问题产品")
    if success_rate >= 95:
        print(f"   🎉 所有产品质量优秀，可以交付使用！")

if __name__ == '__main__':
    main()