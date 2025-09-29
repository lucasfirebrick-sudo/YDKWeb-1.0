#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
验证placeholder修复效果
检查所有产品的轮播配置是否正确
"""

import os
import re

def main():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    products_dir = os.path.join(base_dir, 'products')

    print("🔍 验证所有产品的placeholder修复效果...")

    # 被修复的产品列表
    fixed_products = [
        'insulating-brick',
        'semi-silica-brick',
        'coke-oven-brick',
        'standard-silica-brick',
        'hot-blast-stove-clay-checker-brick',
        'wear-resistant-ceramic'
    ]

    results = {}

    for product_id in fixed_products:
        print(f"\n📋 验证产品: {product_id}")
        result = verify_product_config(product_id, products_dir)
        results[product_id] = result
        print_verification_result(product_id, result)

    # 输出总体验证报告
    print_verification_summary(results)

def verify_product_config(product_id, products_dir):
    """验证单个产品的配置"""
    result = {
        'product_id': product_id,
        'file_exists': False,
        'has_data_images': False,
        'data_images_content': '',
        'has_placeholder_in_carousel': False,
        'has_placeholder_attribute': False,
        'status': 'unknown'
    }

    filepath = os.path.join(products_dir, f'{product_id}.html')

    if not os.path.exists(filepath):
        result['status'] = 'file_missing'
        return result

    result['file_exists'] = True

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 检查data-images配置
    data_images_match = re.search(r'data-images="([^"]*)"', content)
    if data_images_match:
        result['has_data_images'] = True
        result['data_images_content'] = data_images_match.group(1)

        # 检查是否包含placeholder.jpg
        if 'placeholder.jpg' in result['data_images_content']:
            result['has_placeholder_in_carousel'] = True

    # 检查data-placeholder属性
    if 'data-placeholder="true"' in content:
        result['has_placeholder_attribute'] = True

    # 判断状态
    if result['has_placeholder_in_carousel']:
        result['status'] = 'bad_placeholder_in_carousel'
    elif result['data_images_content'] == '':
        if result['has_placeholder_attribute']:
            result['status'] = 'good_empty_with_placeholder_attr'
        else:
            result['status'] = 'warning_empty_no_placeholder_attr'
    elif result['data_images_content'] and not result['has_placeholder_in_carousel']:
        result['status'] = 'good_images_no_placeholder'
    else:
        result['status'] = 'unknown'

    return result

def print_verification_result(product_id, result):
    """打印单个产品的验证结果"""
    status_icons = {
        'good_images_no_placeholder': '✅',
        'good_empty_with_placeholder_attr': '✅',
        'warning_empty_no_placeholder_attr': '⚠️',
        'bad_placeholder_in_carousel': '❌',
        'file_missing': '📂',
        'unknown': '❓'
    }

    icon = status_icons.get(result['status'], '❓')
    print(f"   {icon} 状态: {result['status']}")

    if result['file_exists']:
        print(f"   📋 data-images: \"{result['data_images_content']}\"")
        if result['has_placeholder_attribute']:
            print(f"   🏷️  data-placeholder: ✅")

        # 状态说明
        if result['status'] == 'good_images_no_placeholder':
            print(f"   💡 说明: 轮播配置正确，包含真实图片")
        elif result['status'] == 'good_empty_with_placeholder_attr':
            print(f"   💡 说明: 正确的占位符配置，应显示\"产品图片更新中\"")
        elif result['status'] == 'bad_placeholder_in_carousel':
            print(f"   ⚠️  问题: 轮播中包含placeholder.jpg，需要修复")

def print_verification_summary(results):
    """输出验证总结"""
    print("\n" + "="*60)
    print("📊 Placeholder修复验证报告")
    print("="*60)

    status_counts = {}
    for result in results.values():
        status = result['status']
        status_counts[status] = status_counts.get(status, 0) + 1

    print("\n📈 验证结果统计:")
    for status, count in status_counts.items():
        icon = {
            'good_images_no_placeholder': '✅',
            'good_empty_with_placeholder_attr': '✅',
            'warning_empty_no_placeholder_attr': '⚠️',
            'bad_placeholder_in_carousel': '❌',
            'file_missing': '📂',
            'unknown': '❓'
        }.get(status, '❓')

        status_desc = {
            'good_images_no_placeholder': '正确轮播配置',
            'good_empty_with_placeholder_attr': '正确占位符配置',
            'warning_empty_no_placeholder_attr': '需要占位符属性',
            'bad_placeholder_in_carousel': '轮播包含占位符',
            'file_missing': '文件缺失',
            'unknown': '未知状态'
        }.get(status, status)

        print(f"   {icon} {status_desc}: {count} 个产品")

    # 详细结果
    print("\n📋 详细验证结果:")
    for product_id, result in results.items():
        status = result['status']
        icon = {
            'good_images_no_placeholder': '✅',
            'good_empty_with_placeholder_attr': '✅',
            'warning_empty_no_placeholder_attr': '⚠️',
            'bad_placeholder_in_carousel': '❌',
            'file_missing': '📂',
            'unknown': '❓'
        }.get(status, '❓')
        print(f"   {icon} {product_id}")
        if result['data_images_content']:
            print(f"      图片: {result['data_images_content']}")
        else:
            print(f"      配置: 占位符产品")

    # 成功率计算
    good_count = sum(1 for r in results.values() if r['status'].startswith('good'))
    total = len(results)
    success_rate = (good_count / total * 100) if total > 0 else 0

    print(f"\n🎯 修复成功率: {success_rate:.1f}% ({good_count}/{total})")

    if all(r['status'].startswith('good') for r in results.values()):
        print("\n🎉 所有被修复的产品配置都正确！")
    else:
        print("\n💡 修复建议:")
        for product_id, result in results.items():
            if result['status'] == 'bad_placeholder_in_carousel':
                print(f"   - {product_id}: 需要从轮播配置中移除placeholder.jpg")
            elif result['status'] == 'warning_empty_no_placeholder_attr':
                print(f"   - {product_id}: 需要添加data-placeholder=\"true\"属性")

if __name__ == '__main__':
    main()