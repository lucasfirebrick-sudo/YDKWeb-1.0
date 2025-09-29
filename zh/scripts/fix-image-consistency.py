#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
产品列表页与详情页图片一致性修复脚本
解决用户从列表页点击进入详情页看到不同图片的问题
"""

import os
import re
import json
from bs4 import BeautifulSoup

def main():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    products_html = os.path.join(base_dir, 'products.html')
    products_dir = os.path.join(base_dir, 'products')
    images_dir = os.path.join(base_dir, 'images', 'products')

    print("🔍 分析产品列表页与详情页图片一致性...")

    # 解析产品列表页的图片配置
    product_list_images = extract_product_list_images(products_html)
    print(f"📋 产品列表页发现 {len(product_list_images)} 个产品图片")

    # 分析详情页图片配置
    detail_page_images = analyze_detail_pages(products_dir)
    print(f"📄 详情页分析完成，共 {len(detail_page_images)} 个产品")

    # 找出不匹配的产品
    mismatches = find_image_mismatches(product_list_images, detail_page_images)
    print(f"⚠️  发现 {len(mismatches)} 个图片不匹配的产品")

    # 修复不匹配问题
    fix_results = fix_image_mismatches(mismatches, products_dir, images_dir)

    # 输出修复报告
    print_fix_report(fix_results)

def extract_product_list_images(products_html_path):
    """提取产品列表页的图片配置"""
    product_images = {}

    with open(products_html_path, 'r', encoding='utf-8') as f:
        content = f.read()

    soup = BeautifulSoup(content, 'html.parser')

    # 查找所有产品卡片
    product_cards = soup.find_all('div', class_='product-card')

    for card in product_cards:
        # 获取产品链接
        href = card.get('data-original-href', '')
        if not href:
            continue

        # 提取产品ID
        product_id = href.replace('products/', '').replace('.html', '')

        # 获取产品图片
        img = card.find('img')
        if img and img.get('src'):
            img_src = img['src'].replace('images/products/', '')
            product_images[product_id] = {
                'list_image': img_src,
                'alt': img.get('alt', ''),
                'href': href
            }

    return product_images

def analyze_detail_pages(products_dir):
    """分析详情页的图片配置"""
    detail_images = {}

    for filename in os.listdir(products_dir):
        if not filename.endswith('.html'):
            continue

        product_id = filename.replace('.html', '')
        filepath = os.path.join(products_dir, filename)

        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        # 查找data-images配置
        data_images_match = re.search(r'data-images="([^"]*)"', content)
        main_image_match = re.search(r'<img[^>]*src="([^"]*)"[^>]*class="main-image"', content)

        detail_images[product_id] = {
            'has_data_images': bool(data_images_match),
            'data_images': data_images_match.group(1) if data_images_match else '',
            'main_image': main_image_match.group(1) if main_image_match else '',
            'filepath': filepath
        }

    return detail_images

def find_image_mismatches(list_images, detail_images):
    """找出图片不匹配的产品"""
    mismatches = []

    for product_id, list_data in list_images.items():
        if product_id not in detail_images:
            continue

        detail_data = detail_images[product_id]
        list_img = list_data['list_image']

        # 检查详情页是否包含列表页图片
        data_images = detail_data['data_images']
        main_image = detail_data['main_image']

        list_img_in_detail = list_img in data_images or list_img in main_image

        if not list_img_in_detail:
            mismatches.append({
                'product_id': product_id,
                'list_image': list_img,
                'detail_data_images': data_images,
                'detail_main_image': main_image,
                'filepath': detail_data['filepath']
            })

    return mismatches

def fix_image_mismatches(mismatches, products_dir, images_dir):
    """修复图片不匹配问题"""
    fix_results = {
        'success': [],
        'failed': [],
        'skipped': []
    }

    for mismatch in mismatches:
        product_id = mismatch['product_id']
        list_image = mismatch['list_image']
        filepath = mismatch['filepath']

        print(f"\n🔧 修复产品: {product_id}")
        print(f"   列表页图片: {list_image}")

        # 检查列表页图片是否存在
        list_image_path = os.path.join(images_dir, list_image)
        if not os.path.exists(list_image_path):
            print(f"   ❌ 列表页图片文件不存在: {list_image}")
            fix_results['failed'].append({
                'product_id': product_id,
                'reason': f'列表页图片文件不存在: {list_image}'
            })
            continue

        # 读取详情页内容
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        # 修复策略：将列表页图片添加到详情页data-images的第一位
        success = add_list_image_to_detail_page(content, list_image, filepath)

        if success:
            fix_results['success'].append({
                'product_id': product_id,
                'list_image': list_image,
                'action': '已将列表页图片添加到详情页轮播'
            })
            print(f"   ✅ 修复成功")
        else:
            fix_results['failed'].append({
                'product_id': product_id,
                'reason': '无法修改详情页配置'
            })
            print(f"   ❌ 修复失败")

    return fix_results

def add_list_image_to_detail_page(content, list_image, filepath):
    """将列表页图片添加到详情页轮播的第一位"""
    try:
        # 查找data-images配置
        data_images_pattern = r'data-images="([^"]*)"'
        match = re.search(data_images_pattern, content)

        if match:
            current_images = match.group(1)
            # 移除路径前缀，统一格式
            list_image_clean = list_image.replace('../images/products/', '')
            current_images_clean = current_images.replace('../images/products/', '')

            # 检查是否已经包含了
            if list_image_clean in current_images_clean:
                print(f"   📋 列表页图片已在详情页中")
                return True

            # 添加到第一位
            new_images = f"../images/products/{list_image_clean},{current_images}"
            new_content = re.sub(data_images_pattern, f'data-images="{new_images}"', content)

            # 同时更新主图片src
            main_image_pattern = r'(<img[^>]*src=")([^"]*)"([^>]*class="main-image")'
            new_content = re.sub(main_image_pattern, f'\\1../images/products/{list_image_clean}"\\3', new_content)

        else:
            # 如果没有data-images配置，查找main-image并添加data-images
            main_image_pattern = r'(<img[^>]*src="[^"]*"[^>]*class="main-image"[^>]*)'
            match = re.search(main_image_pattern, content)

            if match:
                # 在main-image标签中添加data-images属性
                img_tag = match.group(1)
                if 'data-images=' not in img_tag:
                    # 添加data-images属性
                    new_img_tag = img_tag.replace('class="main-image"',
                                                f'class="main-image"\n                                 data-images="../images/products/{list_image}"')
                    new_content = content.replace(img_tag, new_img_tag)
                else:
                    return True
            else:
                print(f"   ⚠️  未找到main-image标签")
                return False

        # 写入文件
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)

        return True

    except Exception as e:
        print(f"   ❌ 修复过程中出错: {str(e)}")
        return False

def print_fix_report(fix_results):
    """输出修复报告"""
    print("\n" + "="*60)
    print("📊 修复结果报告")
    print("="*60)

    print(f"✅ 修复成功: {len(fix_results['success'])} 个产品")
    for item in fix_results['success']:
        print(f"   - {item['product_id']}: {item['action']}")

    print(f"\n❌ 修复失败: {len(fix_results['failed'])} 个产品")
    for item in fix_results['failed']:
        print(f"   - {item['product_id']}: {item['reason']}")

    print(f"\n⏭️  跳过处理: {len(fix_results['skipped'])} 个产品")
    for item in fix_results['skipped']:
        print(f"   - {item['product_id']}: {item['reason']}")

    success_rate = len(fix_results['success']) / (len(fix_results['success']) + len(fix_results['failed'])) * 100 if (len(fix_results['success']) + len(fix_results['failed'])) > 0 else 0
    print(f"\n🎯 修复成功率: {success_rate:.1f}%")

if __name__ == '__main__':
    main()