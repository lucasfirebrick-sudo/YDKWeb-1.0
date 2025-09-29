#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
批量修复轮播配置中的placeholder.jpg问题
移除所有data-images中不应该出现的placeholder.jpg
"""

import os
import re

def main():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    products_dir = os.path.join(base_dir, 'products')

    print("🔍 检查所有产品页面的placeholder配置问题...")

    # 找出所有包含placeholder的文件
    problematic_files = find_placeholder_issues(products_dir)

    if not problematic_files:
        print("✅ 没有发现placeholder配置问题")
        return

    print(f"⚠️  发现 {len(problematic_files)} 个文件有placeholder配置问题")

    # 修复所有问题文件
    fix_results = fix_placeholder_issues(problematic_files)

    # 输出修复报告
    print_fix_report(fix_results)

def find_placeholder_issues(products_dir):
    """查找所有包含placeholder.jpg的data-images配置"""
    problematic_files = []

    for filename in os.listdir(products_dir):
        if not filename.endswith('.html'):
            continue

        filepath = os.path.join(products_dir, filename)

        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        # 查找包含placeholder的data-images配置
        if re.search(r'data-images="[^"]*placeholder\.jpg[^"]*"', content):
            problematic_files.append({
                'filename': filename,
                'filepath': filepath,
                'product_id': filename.replace('.html', '')
            })

    return problematic_files

def fix_placeholder_issues(problematic_files):
    """修复所有placeholder配置问题"""
    fix_results = {
        'success': [],
        'failed': []
    }

    for file_info in problematic_files:
        filepath = file_info['filepath']
        product_id = file_info['product_id']

        print(f"\n🔧 修复产品: {product_id}")

        try:
            # 读取文件内容
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()

            # 记录修复前的配置
            original_match = re.search(r'data-images="([^"]*)"', content)
            if original_match:
                original_config = original_match.group(1)
                print(f"   修复前: {original_config}")

                # 修复配置
                new_content = fix_data_images_config(content)

                # 验证修复结果
                new_match = re.search(r'data-images="([^"]*)"', new_content)
                if new_match:
                    new_config = new_match.group(1)
                    print(f"   修复后: {new_config}")

                    # 写入文件
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(new_content)

                    fix_results['success'].append({
                        'product_id': product_id,
                        'original': original_config,
                        'fixed': new_config
                    })
                    print(f"   ✅ 修复成功")

                else:
                    fix_results['failed'].append({
                        'product_id': product_id,
                        'reason': '修复后未找到data-images配置'
                    })
                    print(f"   ❌ 修复失败")

        except Exception as e:
            fix_results['failed'].append({
                'product_id': product_id,
                'reason': f'文件操作错误: {str(e)}'
            })
            print(f"   ❌ 修复失败: {str(e)}")

    return fix_results

def fix_data_images_config(content):
    """修复data-images配置，移除placeholder.jpg"""
    def replace_data_images(match):
        full_config = match.group(1)

        # 分割图片列表
        images = [img.strip() for img in full_config.split(',')]

        # 过滤掉placeholder.jpg
        filtered_images = [img for img in images if not img.endswith('placeholder.jpg')]

        # 重新组合
        new_config = ','.join(filtered_images)

        return f'data-images="{new_config}"'

    # 使用正则表达式替换
    new_content = re.sub(r'data-images="([^"]*)"', replace_data_images, content)

    return new_content

def print_fix_report(fix_results):
    """输出修复报告"""
    print("\n" + "="*60)
    print("📊 Placeholder修复结果报告")
    print("="*60)

    print(f"✅ 修复成功: {len(fix_results['success'])} 个产品")
    for item in fix_results['success']:
        print(f"   - {item['product_id']}")
        print(f"     原始: {item['original']}")
        print(f"     修复: {item['fixed']}")

    print(f"\n❌ 修复失败: {len(fix_results['failed'])} 个产品")
    for item in fix_results['failed']:
        print(f"   - {item['product_id']}: {item['reason']}")

    success_rate = len(fix_results['success']) / (len(fix_results['success']) + len(fix_results['failed'])) * 100 if (len(fix_results['success']) + len(fix_results['failed'])) > 0 else 0
    print(f"\n🎯 修复成功率: {success_rate:.1f}%")

if __name__ == '__main__':
    main()