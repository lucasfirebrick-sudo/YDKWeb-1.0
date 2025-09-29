#!/usr/bin/env python3
"""
最终验证脚本 - 检查所有产品页面的轮播功能修复状态
"""

import os
import glob
import re
from pathlib import Path

# 路径配置
PRODUCTS_DIR = r"D:\ai\新建文件夹\新建文件夹\7788\products"
IMAGES_DIR = r"D:\ai\新建文件夹\新建文件夹\7788\images\products"

def check_product_page(html_file):
    """检查单个产品页面的配置状态"""
    product_id = Path(html_file).stem

    try:
        with open(html_file, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        return {
            'product_id': product_id,
            'status': 'error',
            'error': f'读取文件失败: {e}',
            'images_count': 0,
            'has_data_images': False,
            'has_gallery_js': False
        }

    # 检查是否有 data-images 配置
    data_images_match = re.search(r'data-images="([^"]*)"', content)
    has_data_images = bool(data_images_match)

    # 计算配置的图片数量
    images_count = 0
    if data_images_match:
        images_list = data_images_match.group(1).split(',')
        images_count = len([img.strip() for img in images_list if img.strip()])

    # 检查是否引用了轮播JS
    has_gallery_js = 'multi-image-gallery.js' in content

    # 检查实际存在的图片文件
    actual_images = []
    pattern = os.path.join(IMAGES_DIR, f"{product_id}*")
    image_files = glob.glob(pattern)
    for img_path in image_files:
        filename = os.path.basename(img_path)
        if filename.lower().endswith(('.png', '.jpg', '.jpeg')):
            actual_images.append(filename)

    # 判断状态
    if not actual_images:
        status = 'no_images'
    elif len(actual_images) == 1:
        if has_data_images and images_count == 1:
            status = 'single_image_ok'
        elif not has_data_images:
            status = 'single_image_missing_config'
        else:
            status = 'single_image_error'
    else:
        if has_data_images and images_count == len(actual_images):
            status = 'multi_image_ok'
        elif has_data_images:
            status = 'multi_image_partial'
        else:
            status = 'multi_image_missing_config'

    return {
        'product_id': product_id,
        'status': status,
        'actual_images_count': len(actual_images),
        'configured_images_count': images_count,
        'has_data_images': has_data_images,
        'has_gallery_js': has_gallery_js,
        'actual_images': actual_images[:3]  # 只显示前3个
    }

def generate_final_report():
    """生成最终验证报告"""
    print("=" * 60)
    print("🔍 产品详情页图片轮播功能 - 最终验证报告")
    print("=" * 60)

    # 获取所有产品HTML文件
    html_files = glob.glob(os.path.join(PRODUCTS_DIR, "*.html"))

    # 统计信息
    stats = {
        'total': 0,
        'multi_image_ok': 0,
        'single_image_ok': 0,
        'no_images': 0,
        'errors': 0,
        'missing_config': 0
    }

    results = []

    for html_file in sorted(html_files):
        result = check_product_page(html_file)
        results.append(result)

        stats['total'] += 1

        if result['status'] == 'multi_image_ok':
            stats['multi_image_ok'] += 1
        elif result['status'] == 'single_image_ok':
            stats['single_image_ok'] += 1
        elif result['status'] == 'no_images':
            stats['no_images'] += 1
        elif 'missing_config' in result['status']:
            stats['missing_config'] += 1
        else:
            stats['errors'] += 1

    # 打印总结
    print(f"\n📊 总体统计:")
    print(f"   总产品数: {stats['total']}")
    print(f"   ✅ 多图轮播正常: {stats['multi_image_ok']}")
    print(f"   ✅ 单图显示正常: {stats['single_image_ok']}")
    print(f"   ⚪ 无图片产品: {stats['no_images']}")
    print(f"   ❌ 配置缺失: {stats['missing_config']}")
    print(f"   ❌ 其他错误: {stats['errors']}")

    success_rate = ((stats['multi_image_ok'] + stats['single_image_ok']) / stats['total']) * 100
    print(f"\n🎯 修复成功率: {success_rate:.1f}%")

    # 详细列表
    print(f"\n📝 详细结果:")

    # 成功的产品
    successful = [r for r in results if r['status'] in ['multi_image_ok', 'single_image_ok']]
    if successful:
        print(f"\n✅ 轮播功能正常 ({len(successful)}个):")
        for result in successful:
            if result['status'] == 'multi_image_ok':
                print(f"   🖼️  {result['product_id']}: {result['actual_images_count']}张图片轮播")
            else:
                print(f"   📷 {result['product_id']}: 单图显示")

    # 无图片的产品
    no_images = [r for r in results if r['status'] == 'no_images']
    if no_images:
        print(f"\n⚪ 无图片产品 ({len(no_images)}个):")
        for result in no_images:
            print(f"   📭 {result['product_id']}")

    # 有问题的产品
    problems = [r for r in results if r['status'] not in ['multi_image_ok', 'single_image_ok', 'no_images']]
    if problems:
        print(f"\n❌ 需要注意的产品 ({len(problems)}个):")
        for result in problems:
            print(f"   ⚠️  {result['product_id']}: {result['status']}")
            print(f"      实际图片: {result['actual_images_count']}, 配置图片: {result['configured_images_count']}")

    # 生成测试建议
    print(f"\n🧪 测试建议:")
    if successful:
        sample_products = successful[:3]
        print(f"   推荐测试这些产品的轮播功能:")
        for result in sample_products:
            print(f"   • {result['product_id']}.html")

    print(f"\n🔧 如需进一步优化:")
    if no_images:
        print(f"   • 为{len(no_images)}个无图片产品添加占位符系统")
    if problems:
        print(f"   • 修复{len(problems)}个配置异常的产品")

    return results

if __name__ == "__main__":
    generate_final_report()