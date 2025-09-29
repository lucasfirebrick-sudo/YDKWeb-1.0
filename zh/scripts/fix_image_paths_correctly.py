#!/usr/bin/env python3
"""
正确修复主图片文件路径错误
只使用每个产品真实对应的图片，没有对应图片的使用占位图
"""

import os
import re

# 路径配置
PROJECT_ROOT = r"D:\ai\新建文件夹\新建文件夹\7788"
PRODUCTS_DIR = os.path.join(PROJECT_ROOT, "products")
IMAGES_PRODUCTS = os.path.join(PROJECT_ROOT, "images", "products")

# 需要修复路径的产品列表（基于之前的诊断）
PRODUCTS_TO_FIX = [
    "coke-oven-brick",
    "hot-blast-stove-clay-checker-brick",
    "insulating-brick",
    "insulating-material",
    "refractory-castable",  # 已修复data-images，但可能还有路径问题
    "semi-silica-brick",
    "standard-silica-brick",
    "unshaped-refractory",
    "unshaped-refractory-material",
    "wear-resistant-ceramic"
]

def find_product_images(product_id):
    """查找产品对应的真实图片文件"""
    # 获取所有图片文件
    all_images = os.listdir(IMAGES_PRODUCTS)

    # 查找与产品ID匹配的图片
    matching_images = []
    for img in all_images:
        if img.lower().startswith(product_id.lower().replace('-', '_')) or \
           img.lower().startswith(product_id.lower().replace('-', '-')) or \
           product_id.lower().replace('-', '_') in img.lower() or \
           product_id.lower().replace('-', '-') in img.lower():
            matching_images.append(img)

    return matching_images

def check_current_image_path(product_id):
    """检查产品当前的图片路径"""
    html_file = os.path.join(PRODUCTS_DIR, f"{product_id}.html")

    try:
        with open(html_file, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        return None, f"读取失败: {e}"

    # 查找主图片标签
    img_pattern = r'<img[^>]+class="main-image"[^>]*src="([^"]*)"[^>]*>'
    match = re.search(img_pattern, content)

    if match:
        current_src = match.group(1)
        return current_src, None
    else:
        return None, "未找到主图片标签"

def main():
    print("🔍 检查需要修复路径的产品，寻找合适的图片...")
    print("=" * 60)

    for product_id in PRODUCTS_TO_FIX:
        print(f"\n📦 产品: {product_id}")

        # 检查当前路径
        current_src, error = check_current_image_path(product_id)
        if error:
            print(f"   ❌ 当前路径检查失败: {error}")
            continue

        print(f"   📄 当前图片路径: {current_src}")

        # 检查当前路径的图片是否存在
        if current_src.startswith('../'):
            relative_path = current_src[3:]  # 去掉 '../'
            full_path = os.path.join(PROJECT_ROOT, relative_path)
        else:
            full_path = os.path.join(PROJECT_ROOT, current_src)

        current_exists = os.path.exists(full_path)
        print(f"   {'✅' if current_exists else '❌'} 当前图片存在: {current_exists}")

        if current_exists:
            print(f"   ✅ 该产品图片路径正确，无需修复")
            continue

        # 查找匹配的图片
        matching_images = find_product_images(product_id)
        print(f"   🔍 找到匹配图片: {len(matching_images)} 个")

        if matching_images:
            print(f"   📸 可用图片:")
            for i, img in enumerate(matching_images, 1):
                print(f"      {i}. {img}")
            print(f"   ✅ 建议使用: {matching_images[0]}")
        else:
            print(f"   ⚠️ 未找到匹配图片，应使用占位图")

if __name__ == "__main__":
    main()