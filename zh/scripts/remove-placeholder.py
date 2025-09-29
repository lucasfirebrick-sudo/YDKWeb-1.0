#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
批量移除产品页面不必要的手动占位符
为有图片但显示占位符的产品移除占位符元素
"""

import os
import re
from datetime import datetime

def main():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    products_dir = os.path.join(base_dir, 'products')

    # 需要移除占位符的产品列表（根据分析结果）
    products_to_fix = [
        'corundum-brick.html',
        'lightweight-castable.html',
        'phosphate-brick.html',
        'plastic-refractory.html',
        'refractory-spray-coating.html'
    ]

    print("🔧 批量移除不必要的手动占位符")
    print(f"📅 处理时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"📁 产品目录: {products_dir}")
    print(f"🎯 需要处理的产品数量: {len(products_to_fix)}")
    print("="*80)

    success_count = 0
    failed_products = []

    for i, product_file in enumerate(products_to_fix, 1):
        print(f"[{i:2d}/{len(products_to_fix)}] 处理 {product_file}")

        filepath = os.path.join(products_dir, product_file)

        if not os.path.exists(filepath):
            print(f"   ❌ 文件不存在: {product_file}")
            failed_products.append((product_file, "文件不存在"))
            continue

        try:
            # 读取文件内容
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()

            # 查找并移除手动占位符
            original_content = content

            # 匹配占位符块（包括可能的缩进和换行）
            placeholder_pattern = r'\s*<div[^>]*class="[^"]*product-placeholder[^"]*"[^>]*>.*?</div>\s*'

            # 移除占位符
            new_content = re.sub(placeholder_pattern, '', content, flags=re.DOTALL)

            # 检查是否有变化
            if new_content == original_content:
                print(f"   ⚠️  未找到占位符元素")
                continue

            # 写入文件
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)

            print(f"   ✅ 成功移除占位符")
            success_count += 1

            # 显示移除的内容摘要
            removed_content = original_content.replace(new_content, '').strip()
            if removed_content:
                # 提取占位符文本用于确认
                zh_match = re.search(r'<span class="zh">(.*?)</span>', removed_content)
                if zh_match:
                    print(f"      🗑️  移除内容: {zh_match.group(1)}")

        except Exception as e:
            print(f"   ❌ 处理失败: {str(e)}")
            failed_products.append((product_file, str(e)))

    # 生成处理报告
    print("\n" + "="*80)
    print("🎯 占位符移除报告")
    print("="*80)

    print(f"📊 处理统计:")
    print(f"   ✅ 成功处理: {success_count} 个产品")
    print(f"   ❌ 处理失败: {len(failed_products)} 个产品")
    print(f"   📈 成功率: {success_count/(len(products_to_fix))*100:.1f}%")

    if failed_products:
        print(f"\n❌ 处理失败的产品:")
        for product, reason in failed_products:
            print(f"   🔸 {product}: {reason}")

    if success_count > 0:
        print(f"\n💡 后续建议:")
        print(f"   🔄 清除浏览器缓存后测试产品页面")
        print(f"   🌐 验证图片正常显示，占位符已消失")
        print(f"   📋 运行最终验证脚本确认修复效果")

    # 验证移除效果
    if success_count > 0:
        print(f"\n🔍 验证移除效果...")
        verify_removal_results(products_dir, products_to_fix)

def verify_removal_results(products_dir, products_to_fix):
    """验证占位符移除效果"""
    remaining_count = 0

    for product_file in products_to_fix:
        filepath = os.path.join(products_dir, product_file)

        if not os.path.exists(filepath):
            continue

        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        # 检查是否还有手动占位符
        if 'product-placeholder' in content:
            remaining_count += 1
            print(f"   ⚠️  {product_file}: 仍有占位符残留")
        else:
            print(f"   ✅ {product_file}: 占位符已完全移除")

    if remaining_count == 0:
        print(f"\n🎉 所有产品占位符移除完成！")
    else:
        print(f"\n⚠️  {remaining_count} 个产品仍有占位符残留，需要手动检查")

if __name__ == '__main__':
    main()