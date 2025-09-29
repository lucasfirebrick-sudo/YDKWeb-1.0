#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
修复多图产品轮播CSS引用脚本
为缺少轮播CSS的多图产品添加正确的CSS文件引用
"""

import os
import re

def main():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    products_dir = os.path.join(base_dir, 'products')

    # 需要添加轮播CSS的产品列表（除了已修复的alumina-castable.html）
    products_to_fix = [
        'alumina-hollow-sphere-brick.html',
        'chrome-corundum-castable.html',
        'corundum-brick.html',
        'corundum-mullite.html',
        'general-silica-brick.html',
        'heavy-clay-brick.html',
        'hot-blast-stove-silica-brick.html',
        'insulating-material.html',
        'lightweight-clay-brick.html',
        'lightweight-high-alumina-brick.html',
        'lightweight-mullite-brick.html',
        'phosphate-brick.html',
        'phosphate-wear-resistant-brick.html',
        'plastic-refractory.html',
        'refractory-castable.html',
        'silica-molybdenum-brick.html',
        'standard-high-alumina-brick.html',
        'steel-fiber-castable.html',
        'thermal-insulation-brick.html',
        'unshaped-refractory.html',
        'unshaped-refractory-material.html'
    ]

    print("🔧 开始修复多图产品轮播CSS引用...")
    print(f"📁 产品目录: {products_dir}")
    print(f"🎯 需要修复的产品数量: {len(products_to_fix)}")
    print("="*80)

    success_count = 0
    failed_products = []

    for i, product_file in enumerate(products_to_fix, 1):
        print(f"[{i:2d}/{len(products_to_fix)}] 修复 {product_file}")

        filepath = os.path.join(products_dir, product_file)

        if not os.path.exists(filepath):
            print(f"   ❌ 文件不存在: {product_file}")
            failed_products.append((product_file, "文件不存在"))
            continue

        try:
            # 读取文件内容
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()

            # 检查是否已经有轮播CSS引用
            if 'multi-image-gallery.css' in content:
                print(f"   ✅ 已存在轮播CSS，跳过")
                success_count += 1
                continue

            # 检查是否有多图配置
            if 'data-images.*,' not in content:
                if not re.search(r'data-images="[^"]*,[^"]*"', content):
                    print(f"   ⚠️  非多图产品，跳过")
                    continue

            # 查找插入位置（在product-placeholder.css之后）
            pattern = r'(\s*<link rel="stylesheet" href="../css/product-placeholder\.css">\s*)'
            match = re.search(pattern, content)

            if not match:
                print(f"   ❌ 找不到插入位置")
                failed_products.append((product_file, "找不到插入位置"))
                continue

            # 插入轮播CSS引用
            insert_position = match.end()
            css_line = '    <link rel="stylesheet" href="../css/multi-image-gallery.css">\n'

            new_content = content[:insert_position] + css_line + content[insert_position:]

            # 写入文件
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)

            print(f"   ✅ 成功添加轮播CSS")
            success_count += 1

        except Exception as e:
            print(f"   ❌ 修复失败: {str(e)}")
            failed_products.append((product_file, str(e)))

    # 生成修复报告
    print("\n" + "="*80)
    print("🎯 轮播CSS修复报告")
    print("="*80)

    print(f"📊 修复统计:")
    print(f"   ✅ 成功修复: {success_count} 个产品")
    print(f"   ❌ 修复失败: {len(failed_products)} 个产品")
    print(f"   📈 成功率: {success_count/(len(products_to_fix))*100:.1f}%")

    if failed_products:
        print(f"\n❌ 修复失败的产品:")
        for product, reason in failed_products:
            print(f"   🔸 {product}: {reason}")

    if success_count > 0:
        print(f"\n💡 修复建议:")
        print(f"   🔄 请运行最终验证脚本确认修复效果")
        print(f"   🌐 清除浏览器缓存后测试多图轮播功能")

    return success_count, failed_products

if __name__ == '__main__':
    main()