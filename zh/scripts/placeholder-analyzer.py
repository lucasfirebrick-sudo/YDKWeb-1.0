#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
产品页面占位符分析工具
检查所有产品页面的手动占位符情况，识别需要移除的占位符
"""

import os
import re
from datetime import datetime

def main():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    products_dir = os.path.join(base_dir, 'products')
    images_dir = os.path.join(base_dir, 'images', 'products')

    print("🔍 产品页面占位符分析")
    print(f"📅 分析时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"📁 产品目录: {products_dir}")
    print("="*80)

    # 获取所有产品页面
    product_files = [f for f in os.listdir(products_dir) if f.endswith('.html')]
    product_files.sort()

    # 分析结果
    analysis_results = {
        'total_products': len(product_files),
        'products_with_manual_placeholder': [],
        'products_with_images_but_placeholder': [],
        'products_without_images_need_placeholder': [],
        'placeholder_removal_candidates': [],
        'safe_products': []
    }

    print(f"🎯 开始分析 {len(product_files)} 个产品页面...")
    print()

    for i, filename in enumerate(product_files, 1):
        product_id = filename.replace('.html', '')
        print(f"[{i:2d}/{len(product_files)}] 分析 {product_id}")

        filepath = os.path.join(products_dir, filename)
        result = analyze_product_placeholder(filepath, images_dir, product_id)

        # 分类结果
        if result['has_manual_placeholder']:
            analysis_results['products_with_manual_placeholder'].append((product_id, result))

            if result['has_valid_images']:
                analysis_results['products_with_images_but_placeholder'].append((product_id, result))
                analysis_results['placeholder_removal_candidates'].append((product_id, result))
                print(f"   ❌ 有图片但显示占位符 - 建议移除占位符")
            else:
                analysis_results['products_without_images_need_placeholder'].append((product_id, result))
                print(f"   ⚠️  无图片需要占位符 - 保留占位符")
        else:
            analysis_results['safe_products'].append((product_id, result))
            print(f"   ✅ 无手动占位符")

    # 生成分析报告
    generate_analysis_report(analysis_results, base_dir)

def analyze_product_placeholder(filepath, images_dir, product_id):
    """分析单个产品的占位符情况"""
    result = {
        'product_id': product_id,
        'has_manual_placeholder': False,
        'placeholder_content': '',
        'has_valid_images': False,
        'image_count': 0,
        'missing_images': [],
        'data_images_config': '',
        'recommendation': 'unknown'
    }

    if not os.path.exists(filepath):
        return result

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 检查是否有手动占位符
    placeholder_match = re.search(r'<div[^>]*class="[^"]*product-placeholder[^"]*"[^>]*>(.*?)</div>',
                                content, re.DOTALL)
    if placeholder_match:
        result['has_manual_placeholder'] = True
        result['placeholder_content'] = placeholder_match.group(0)

    # 检查data-images配置
    data_images_match = re.search(r'data-images="([^"]*)"', content)
    if data_images_match:
        result['data_images_config'] = data_images_match.group(1)

        # 检查配置的图片是否存在
        if result['data_images_config'].strip():
            images = [img.strip().replace('../images/products/', '')
                     for img in result['data_images_config'].split(',')
                     if img.strip()]

            valid_images = []
            for img in images:
                img_path = os.path.join(images_dir, img)
                if os.path.exists(img_path):
                    valid_images.append(img)
                else:
                    result['missing_images'].append(img)

            result['image_count'] = len(valid_images)
            result['has_valid_images'] = len(valid_images) > 0

    # 确定建议
    if result['has_manual_placeholder'] and result['has_valid_images']:
        result['recommendation'] = 'remove_placeholder'
    elif result['has_manual_placeholder'] and not result['has_valid_images']:
        result['recommendation'] = 'keep_placeholder'
    else:
        result['recommendation'] = 'no_change'

    return result

def generate_analysis_report(analysis_results, base_dir):
    """生成分析报告"""
    print("\n" + "="*80)
    print("🎯 占位符分析报告")
    print("="*80)

    total = analysis_results['total_products']
    manual_count = len(analysis_results['products_with_manual_placeholder'])
    problematic_count = len(analysis_results['products_with_images_but_placeholder'])
    removal_count = len(analysis_results['placeholder_removal_candidates'])

    print(f"📊 总体统计:")
    print(f"   📦 总产品数: {total}")
    print(f"   🎭 有手动占位符: {manual_count} 个 ({manual_count/total*100:.1f}%)")
    print(f"   ❌ 有图片但显示占位符: {problematic_count} 个")
    print(f"   🔧 建议移除占位符: {removal_count} 个")

    # 显示需要移除占位符的产品
    if analysis_results['placeholder_removal_candidates']:
        print(f"\n❌ 建议移除占位符的产品:")
        for product_id, result in analysis_results['placeholder_removal_candidates']:
            print(f"   🔸 {product_id}: 有 {result['image_count']} 张图片")

    # 显示需要保留占位符的产品
    need_placeholder = analysis_results['products_without_images_need_placeholder']
    if need_placeholder:
        print(f"\n⚠️  需要保留占位符的产品 ({len(need_placeholder)} 个):")
        for product_id, result in need_placeholder[:5]:  # 只显示前5个
            print(f"   🔸 {product_id}: 缺少图片")
        if len(need_placeholder) > 5:
            print(f"   ... 还有 {len(need_placeholder) - 5} 个产品")

    # 质量评级
    if problematic_count == 0:
        quality_grade = "🏆 优秀"
    elif problematic_count <= 3:
        quality_grade = "🥇 良好"
    elif problematic_count <= 10:
        quality_grade = "🥈 合格"
    else:
        quality_grade = "🥉 需要改进"

    print(f"\n🎯 占位符配置质量: {quality_grade}")

    # 修复建议
    print(f"\n💡 修复建议:")
    if removal_count > 0:
        print(f"   🚨 移除 {removal_count} 个产品的不必要占位符")
        print(f"   📝 这些产品有有效图片，不应显示占位符")
    else:
        print(f"   🎉 所有产品占位符配置正确！")

    print(f"\n🛠️  操作建议:")
    print(f"   📋 创建批量移除脚本处理有图片但显示占位符的产品")
    print(f"   🔍 保留真正缺少图片产品的占位符功能")

    # 保存详细报告
    import json
    report_data = {
        'analysis_time': datetime.now().isoformat(),
        'statistics': {
            'total_products': total,
            'products_with_manual_placeholder': manual_count,
            'problematic_products': problematic_count,
            'removal_candidates': removal_count
        },
        'removal_candidates': [
            {
                'product_id': pid,
                'image_count': result['image_count'],
                'placeholder_content': result['placeholder_content'][:100] + '...' if len(result['placeholder_content']) > 100 else result['placeholder_content']
            }
            for pid, result in analysis_results['placeholder_removal_candidates']
        ],
        'quality_grade': quality_grade
    }

    report_path = os.path.join(base_dir, 'placeholder-analysis-report.json')
    with open(report_path, 'w', encoding='utf-8') as f:
        json.dump(report_data, f, ensure_ascii=False, indent=2)

    print(f"\n📄 详细分析报告已保存到: {report_path}")

if __name__ == '__main__':
    main()