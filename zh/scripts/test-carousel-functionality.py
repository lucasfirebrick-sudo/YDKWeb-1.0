#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
轮播功能测试脚本
验证修复后的轮播功能和图片显示是否正常
"""

import os
import re

def main():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    products_dir = os.path.join(base_dir, 'products')
    images_dir = os.path.join(base_dir, 'images', 'products')

    print("🔍 测试轮播功能和图片显示...")

    # 重点测试用户关注的产品
    test_products = [
        'mullite-brick',
        'high-alumina-brick',
        'clay-brick',
        'silica-brick'
    ]

    results = {}

    for product_id in test_products:
        print(f"\n📋 测试产品: {product_id}")
        result = test_product_carousel(product_id, products_dir, images_dir)
        results[product_id] = result
        print_test_result(product_id, result)

    # 输出总体测试报告
    print_summary_report(results)

def test_product_carousel(product_id, products_dir, images_dir):
    """测试单个产品的轮播功能"""
    result = {
        'product_id': product_id,
        'file_exists': False,
        'has_js_reference': False,
        'has_data_images': False,
        'has_main_image': False,
        'images_exist': [],
        'missing_images': [],
        'placeholder_hidden': False,
        'overall_status': 'unknown'
    }

    filepath = os.path.join(products_dir, f'{product_id}.html')

    # 检查文件是否存在
    if not os.path.exists(filepath):
        result['overall_status'] = 'file_missing'
        return result

    result['file_exists'] = True

    # 读取文件内容
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 检查JavaScript引用
    if 'multi-image-gallery.js' in content:
        result['has_js_reference'] = True

    # 检查data-images配置
    data_images_match = re.search(r'data-images="([^"]*)"', content)
    if data_images_match:
        result['has_data_images'] = True
        images_str = data_images_match.group(1)

        # 解析图片列表
        images = [img.strip().replace('../images/products/', '') for img in images_str.split(',')]

        # 检查图片文件是否存在
        for img in images:
            img_path = os.path.join(images_dir, img)
            if os.path.exists(img_path):
                result['images_exist'].append(img)
            else:
                result['missing_images'].append(img)

    # 检查主图片
    main_image_match = re.search(r'<img[^>]*src="([^"]*)"[^>]*class="main-image"', content)
    if main_image_match:
        result['has_main_image'] = True

    # 检查占位符是否隐藏
    if 'no-images-placeholder hidden' in content:
        result['placeholder_hidden'] = True

    # 判断整体状态
    if (result['has_js_reference'] and
        result['has_data_images'] and
        result['has_main_image'] and
        len(result['images_exist']) > 0 and
        len(result['missing_images']) == 0 and
        result['placeholder_hidden']):
        result['overall_status'] = 'excellent'
    elif (result['has_js_reference'] and
          result['has_data_images'] and
          len(result['images_exist']) > 0):
        result['overall_status'] = 'good'
    elif result['has_js_reference'] and result['has_data_images']:
        result['overall_status'] = 'partial'
    else:
        result['overall_status'] = 'failed'

    return result

def print_test_result(product_id, result):
    """打印单个产品的测试结果"""
    status_icons = {
        'excellent': '🎉',
        'good': '✅',
        'partial': '⚠️',
        'failed': '❌',
        'file_missing': '📂'
    }

    icon = status_icons.get(result['overall_status'], '❓')
    print(f"   {icon} 状态: {result['overall_status']}")

    if result['file_exists']:
        print(f"   📄 JavaScript引用: {'✅' if result['has_js_reference'] else '❌'}")
        print(f"   🖼️  data-images配置: {'✅' if result['has_data_images'] else '❌'}")
        print(f"   🎯 主图片配置: {'✅' if result['has_main_image'] else '❌'}")
        print(f"   📸 图片文件: {len(result['images_exist'])} 存在, {len(result['missing_images'])} 缺失")
        print(f"   🚫 占位符隐藏: {'✅' if result['placeholder_hidden'] else '❌'}")

        if result['missing_images']:
            print(f"   ⚠️  缺失图片: {', '.join(result['missing_images'])}")

def print_summary_report(results):
    """打印总体测试报告"""
    print("\n" + "="*60)
    print("📊 轮播功能测试总报告")
    print("="*60)

    status_counts = {}
    for result in results.values():
        status = result['overall_status']
        status_counts[status] = status_counts.get(status, 0) + 1

    print("\n📈 测试结果统计:")
    for status, count in status_counts.items():
        icon = {
            'excellent': '🎉',
            'good': '✅',
            'partial': '⚠️',
            'failed': '❌',
            'file_missing': '📂'
        }.get(status, '❓')
        print(f"   {icon} {status}: {count} 个产品")

    # 详细结果
    print("\n📋 详细测试结果:")
    for product_id, result in results.items():
        status = result['overall_status']
        icon = {
            'excellent': '🎉',
            'good': '✅',
            'partial': '⚠️',
            'failed': '❌',
            'file_missing': '📂'
        }.get(status, '❓')
        print(f"   {icon} {product_id}: {status}")

    # 成功率计算
    successful = sum(1 for r in results.values() if r['overall_status'] in ['excellent', 'good'])
    total = len(results)
    success_rate = (successful / total * 100) if total > 0 else 0

    print(f"\n🎯 轮播功能成功率: {success_rate:.1f}% ({successful}/{total})")

    # 建议
    print("\n💡 修复建议:")
    if any(r['overall_status'] == 'failed' for r in results.values()):
        print("   - 检查JavaScript引用和data-images配置")
    if any(len(r['missing_images']) > 0 for r in results.values()):
        print("   - 补充缺失的图片文件")
    if all(r['overall_status'] in ['excellent', 'good'] for r in results.values()):
        print("   - 🎉 所有测试产品的轮播功能都正常！")

if __name__ == '__main__':
    main()