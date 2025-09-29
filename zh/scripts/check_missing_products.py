#!/usr/bin/env python3
"""
检查产品中心页面缺失的产品
对比39个产品HTML文件和products.html中的卡片
"""

import os
import re

# 路径配置
PROJECT_ROOT = r"D:\ai\新建文件夹\新建文件夹\7788"
PRODUCTS_DIR = os.path.join(PROJECT_ROOT, "products")
PRODUCTS_HTML = os.path.join(PROJECT_ROOT, "products.html")

def get_all_product_files():
    """获取所有产品HTML文件列表"""
    products = []
    for file in os.listdir(PRODUCTS_DIR):
        if file.endswith('.html'):
            product_id = file[:-5]  # 移除.html
            products.append(product_id)
    return sorted(products)

def get_products_in_center():
    """获取产品中心页面中的所有产品"""
    with open(PRODUCTS_HTML, 'r', encoding='utf-8') as f:
        content = f.read()

    # 查找所有 data-original-href
    pattern = r'data-original-href="products/([^.]+)\.html"'
    matches = re.findall(pattern, content)

    return sorted(matches)

def main():
    print("🔍 检查产品中心页面是否包含全部39个产品...")
    print("=" * 60)

    # 获取所有产品文件
    all_products = get_all_product_files()
    print(f"📁 products/ 目录中的产品文件: {len(all_products)} 个")

    # 获取产品中心页面的产品
    center_products = get_products_in_center()
    print(f"🏭 products.html 中的产品卡片: {len(center_products)} 个")

    # 找出缺失的产品
    missing_products = set(all_products) - set(center_products)
    extra_products = set(center_products) - set(all_products)

    print(f"\n📊 对比结果:")
    print(f"   应有产品数: {len(all_products)}")
    print(f"   实际显示数: {len(center_products)}")
    print(f"   缺失产品数: {len(missing_products)}")
    print(f"   多余产品数: {len(extra_products)}")

    if missing_products:
        print(f"\n❌ 缺失的产品 ({len(missing_products)} 个):")
        for i, product in enumerate(sorted(missing_products), 1):
            print(f"   {i:2d}. {product}")

    if extra_products:
        print(f"\n⚠️ 多余的产品 ({len(extra_products)} 个):")
        for i, product in enumerate(sorted(extra_products), 1):
            print(f"   {i:2d}. {product}")

    if not missing_products and not extra_products:
        print(f"\n✅ 产品中心页面包含了全部39个产品！")

    print(f"\n📝 详细产品列表对比:")
    print(f"{'序号':<4} {'产品ID':<35} {'文件存在':<8} {'页面显示':<8}")
    print(f"{'-'*4} {'-'*35} {'-'*8} {'-'*8}")

    all_product_set = set(all_products) | set(center_products)
    for i, product in enumerate(sorted(all_product_set), 1):
        file_exists = "✅" if product in all_products else "❌"
        page_shows = "✅" if product in center_products else "❌"
        print(f"{i:<4} {product:<35} {file_exists:<8} {page_shows:<8}")

if __name__ == "__main__":
    main()