#!/usr/bin/env python3
"""
批量修复产品页面图片配置脚本
为所有产品页面生成正确的 data-images 配置
"""

import os
import re
import glob
from pathlib import Path

# 路径配置
PRODUCTS_DIR = r"D:\ai\新建文件夹\新建文件夹\7788\products"
IMAGES_DIR = r"D:\ai\新建文件夹\新建文件夹\7788\images\products"

def get_product_images(product_id):
    """获取指定产品的所有图片"""
    pattern = os.path.join(IMAGES_DIR, f"{product_id}*")
    image_files = glob.glob(pattern)

    # 过滤出图片文件
    valid_images = []
    for img_path in image_files:
        filename = os.path.basename(img_path)
        if filename.lower().endswith(('.png', '.jpg', '.jpeg')):
            valid_images.append(filename)

    # 按优先级排序：official > new > 数字编号
    def sort_key(filename):
        if 'official' in filename:
            return (0, filename)
        elif 'new' in filename:
            return (1, filename)
        else:
            return (2, filename)

    return sorted(valid_images, key=sort_key)

def fix_product_page_images(html_file_path):
    """修复单个产品页面的图片配置"""
    product_id = Path(html_file_path).stem

    print(f"处理产品: {product_id}")

    # 获取该产品的所有图片
    images = get_product_images(product_id)

    if not images:
        print(f"  无图片文件，跳过")
        return False

    print(f"  找到 {len(images)} 张图片: {images}")

    # 读取HTML文件
    with open(html_file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 构建新的图片路径列表
    image_paths = [f"../images/products/{img}" for img in images]
    data_images_value = ",".join(image_paths)

    # 设置主图片（使用第一张图片）
    main_image_path = f"../images/products/{images[0]}"

    # 更新主图片 src
    main_image_pattern = r'<img\s+src="[^"]*"\s+alt="[^"]*"\s+class="main-image"'
    new_main_image = f'<img src="{main_image_path}" alt="{product_id}" class="main-image"'
    content = re.sub(main_image_pattern, new_main_image, content)

    # 更新 data-images 属性
    data_images_pattern = r'data-images="[^"]*"'
    new_data_images = f'data-images="{data_images_value}"'

    if re.search(data_images_pattern, content):
        content = re.sub(data_images_pattern, new_data_images, content)
        print(f"  更新 data-images: {len(images)}张图片")
    else:
        # 如果没找到data-images，在main-image标签中添加
        main_image_tag_pattern = r'(<img[^>]+class="main-image"[^>]*)'
        replacement = f'\\1 {new_data_images}'
        content = re.sub(main_image_tag_pattern, replacement, content)
        print(f"  添加 data-images: {len(images)}张图片")

    # 写回文件
    with open(html_file_path, 'w', encoding='utf-8') as f:
        f.write(content)

    return True

def fix_all_products():
    """修复所有产品页面"""
    print("开始批量修复产品页面图片配置...")

    # 获取所有产品HTML文件
    html_files = glob.glob(os.path.join(PRODUCTS_DIR, "*.html"))

    fixed_count = 0
    skipped_count = 0

    for html_file in html_files:
        if fix_product_page_images(html_file):
            fixed_count += 1
        else:
            skipped_count += 1

    print(f"\n修复完成:")
    print(f"  成功修复: {fixed_count} 个产品页面")
    print(f"  跳过(无图片): {skipped_count} 个产品页面")

def generate_summary_report():
    """生成修复总结报告"""
    print("\n=== 图片配置总结报告 ===")

    html_files = glob.glob(os.path.join(PRODUCTS_DIR, "*.html"))

    has_images = []
    no_images = []

    for html_file in html_files:
        product_id = Path(html_file).stem
        images = get_product_images(product_id)

        if images:
            has_images.append((product_id, len(images)))
        else:
            no_images.append(product_id)

    print(f"\n有图片的产品 ({len(has_images)}个):")
    for product_id, count in sorted(has_images):
        print(f"  {product_id}: {count}张图片")

    print(f"\n无图片的产品 ({len(no_images)}个):")
    for product_id in sorted(no_images):
        print(f"  {product_id}")

if __name__ == "__main__":
    fix_all_products()
    generate_summary_report()