#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
轮播CSS引用验证工具
检查所有产品页面的轮播CSS引用一致性，防止类似问题再次发生
"""

import os
import re
from datetime import datetime

def main():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    products_dir = os.path.join(base_dir, 'products')

    print("🔍 轮播CSS引用一致性检查")
    print(f"📅 检查时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"📁 产品目录: {products_dir}")
    print("="*80)

    # 获取所有产品页面
    product_files = [f for f in os.listdir(products_dir) if f.endswith('.html')]
    product_files.sort()

    # 分类统计
    stats = {
        'total_products': len(product_files),
        'multi_image_products': [],
        'single_image_products': [],
        'correct_css_reference': [],
        'incorrect_css_reference': [],
        'missing_css_reference': [],
        'css_issues': []
    }

    print(f"🎯 开始检查 {len(product_files)} 个产品页面...")
    print()

    for i, filename in enumerate(product_files, 1):
        product_id = filename.replace('.html', '')
        print(f"[{i:2d}/{len(product_files)}] 检查 {product_id}")

        filepath = os.path.join(products_dir, filename)

        if not os.path.exists(filepath):
            print(f"   ❌ 文件不存在")
            continue

        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        # 检查是否为多图产品
        multi_image_match = re.search(r'data-images="[^"]*,[^"]*"', content)
        is_multi_image = multi_image_match is not None

        if is_multi_image:
            stats['multi_image_products'].append(product_id)

            # 检查CSS引用
            correct_css = 'multi-image-gallery.css' in content
            incorrect_css = 'multi-image-carousel.css' in content

            if correct_css:
                stats['correct_css_reference'].append(product_id)
                print(f"   ✅ 多图产品 - CSS引用正确")
            elif incorrect_css:
                stats['incorrect_css_reference'].append(product_id)
                stats['css_issues'].append((product_id, "引用错误的CSS文件: multi-image-carousel.css"))
                print(f"   ❌ 多图产品 - CSS引用错误 (multi-image-carousel.css)")
            else:
                stats['missing_css_reference'].append(product_id)
                stats['css_issues'].append((product_id, "缺少轮播CSS文件引用"))
                print(f"   ⚠️  多图产品 - 缺少轮播CSS")
        else:
            stats['single_image_products'].append(product_id)

            # 检查单图产品是否不必要地引用了轮播CSS
            has_carousel_css = 'multi-image-gallery.css' in content or 'multi-image-carousel.css' in content
            if has_carousel_css:
                print(f"   ℹ️  单图产品 - 有轮播CSS (可选)")
            else:
                print(f"   ✅ 单图产品 - 无轮播CSS")

    # 生成检查报告
    generate_validation_report(stats, base_dir)

def generate_validation_report(stats, base_dir):
    """生成验证报告"""
    print("\n" + "="*80)
    print("🎯 轮播CSS引用验证报告")
    print("="*80)

    total = stats['total_products']
    multi_count = len(stats['multi_image_products'])
    single_count = len(stats['single_image_products'])
    correct_count = len(stats['correct_css_reference'])
    incorrect_count = len(stats['incorrect_css_reference'])
    missing_count = len(stats['missing_css_reference'])

    print(f"📊 产品统计:")
    print(f"   📦 总产品数: {total}")
    print(f"   🖼️  多图产品: {multi_count} 个")
    print(f"   🖼️  单图产品: {single_count} 个")

    print(f"\n🎯 多图产品CSS引用分析:")
    print(f"   ✅ 正确引用: {correct_count} 个 ({correct_count/multi_count*100:.1f}%)")
    print(f"   ❌ 错误引用: {incorrect_count} 个 ({incorrect_count/multi_count*100:.1f}%)")
    print(f"   ⚠️  缺少引用: {missing_count} 个 ({missing_count/multi_count*100:.1f}%)")

    # 质量评级
    if incorrect_count == 0 and missing_count == 0:
        quality_grade = "🏆 优秀"
        quality_color = "绿色"
    elif incorrect_count == 0 and missing_count <= 2:
        quality_grade = "🥇 良好"
        quality_color = "黄色"
    elif incorrect_count <= 2 and missing_count <= 5:
        quality_grade = "🥈 合格"
        quality_color = "橙色"
    else:
        quality_grade = "🥉 需要改进"
        quality_color = "红色"

    print(f"\n🎯 CSS引用质量评级: {quality_grade}")

    # 问题详情
    if stats['css_issues']:
        print(f"\n❌ 发现的问题:")
        for product_id, issue in stats['css_issues']:
            print(f"   🔸 {product_id}: {issue}")

    # 建议
    print(f"\n💡 建议:")
    if incorrect_count > 0:
        print(f"   🚨 立即修复 {incorrect_count} 个错误CSS引用")
    if missing_count > 0:
        print(f"   ⚠️  为 {missing_count} 个多图产品添加轮播CSS引用")
    if incorrect_count == 0 and missing_count == 0:
        print(f"   🎉 所有多图产品CSS引用配置正确，质量优秀！")

    # 预防措施
    print(f"\n🛡️  预防措施:")
    print(f"   📋 定期运行此验证脚本检查CSS引用一致性")
    print(f"   📝 新增产品时必须遵循CSS引用标准")
    print(f"   🔍 修改产品页面后必须验证轮播功能")

    # 保存详细报告
    report_data = {
        'check_time': datetime.now().isoformat(),
        'statistics': stats,
        'quality_grade': quality_grade,
        'recommendations': []
    }

    if incorrect_count > 0:
        report_data['recommendations'].append(f"修复 {incorrect_count} 个错误CSS引用")
    if missing_count > 0:
        report_data['recommendations'].append(f"为 {missing_count} 个多图产品添加CSS引用")

    report_path = os.path.join(base_dir, 'carousel-css-validation-report.json')
    import json
    with open(report_path, 'w', encoding='utf-8') as f:
        json.dump(report_data, f, ensure_ascii=False, indent=2)

    print(f"\n📄 详细验证报告已保存到: {report_path}")

if __name__ == '__main__':
    main()