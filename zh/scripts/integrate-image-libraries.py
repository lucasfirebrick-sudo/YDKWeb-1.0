#!/usr/bin/env python3
"""
整合分离的图片库系统
统一管理images/根目录和images/products/目录的产品图片
建立一致的图片管理体系
"""

import os
import shutil
import glob
import re
from pathlib import Path

# 路径配置
PROJECT_ROOT = r"D:\ai\新建文件夹\新建文件夹\7788"
IMAGES_ROOT = os.path.join(PROJECT_ROOT, "images")
IMAGES_PRODUCTS = os.path.join(IMAGES_ROOT, "products")
SCRIPTS_DIR = os.path.join(PROJECT_ROOT, "scripts")

def analyze_image_distribution():
    """分析当前图片分布情况"""
    print("🔍 分析当前图片分布...")

    analysis = {
        'root_products': [],
        'products_dir': [],
        'duplicates': [],
        'potential_moves': []
    }

    # 扫描根目录的产品相关图片
    product_keywords = [
        'brick', 'alumina', 'clay', 'silica', 'mullite', 'castable',
        'refractory', 'fireclay', 'corundum', 'magnesia', 'chrome'
    ]

    for ext in ['*.png', '*.jpg', '*.jpeg']:
        for img_path in glob.glob(os.path.join(IMAGES_ROOT, ext)):
            filename = os.path.basename(img_path).lower()

            # 检查是否是产品相关图片
            if any(keyword in filename for keyword in product_keywords):
                analysis['root_products'].append({
                    'filename': os.path.basename(img_path),
                    'path': img_path,
                    'size': os.path.getsize(img_path)
                })

    # 扫描products目录
    for ext in ['*.png', '*.jpg', '*.jpeg']:
        for img_path in glob.glob(os.path.join(IMAGES_PRODUCTS, ext)):
            analysis['products_dir'].append({
                'filename': os.path.basename(img_path),
                'path': img_path,
                'size': os.path.getsize(img_path)
            })

    # 查找潜在的重复文件
    root_names = {item['filename'].lower() for item in analysis['root_products']}
    products_names = {item['filename'].lower() for item in analysis['products_dir']}

    for root_item in analysis['root_products']:
        root_name = root_item['filename'].lower()

        # 检查直接重复
        if root_name in products_names:
            products_item = next(
                item for item in analysis['products_dir']
                if item['filename'].lower() == root_name
            )
            analysis['duplicates'].append({
                'root_file': root_item,
                'products_file': products_item,
                'type': 'exact_duplicate'
            })
        else:
            # 检查是否应该移动到products目录
            analysis['potential_moves'].append(root_item)

    print(f"   📊 分析结果:")
    print(f"      根目录产品图片: {len(analysis['root_products'])} 个")
    print(f"      products目录图片: {len(analysis['products_dir'])} 个")
    print(f"      重复文件: {len(analysis['duplicates'])} 组")
    print(f"      待迁移文件: {len(analysis['potential_moves'])} 个")

    return analysis

def resolve_duplicates(analysis):
    """解决重复文件"""
    print("🔧 解决重复文件冲突...")

    resolved_count = 0

    for duplicate in analysis['duplicates']:
        root_file = duplicate['root_file']
        products_file = duplicate['products_file']

        print(f"\n   处理重复文件: {root_file['filename']}")
        print(f"      根目录: {root_file['size']} bytes")
        print(f"      products目录: {products_file['size']} bytes")

        # 比较文件大小，保留较大的文件
        if root_file['size'] > products_file['size']:
            # 根目录文件更大，替换products目录的文件
            try:
                shutil.copy2(root_file['path'], products_file['path'])
                print(f"      ✅ 用根目录文件替换products目录文件")
                resolved_count += 1
            except Exception as e:
                print(f"      ❌ 替换失败: {e}")

        elif products_file['size'] > root_file['size']:
            # products目录文件更大，保留products目录文件
            print(f"      ✅ 保留products目录文件（更大）")
            resolved_count += 1

        else:
            # 大小相同，保留products目录文件
            print(f"      ✅ 保留products目录文件（大小相同）")
            resolved_count += 1

    return resolved_count

def migrate_product_images(analysis):
    """将根目录的产品图片迁移到products目录"""
    print("🔄 迁移产品图片到products目录...")

    migrated_count = 0

    for move_item in analysis['potential_moves']:
        source_path = move_item['path']
        filename = move_item['filename']
        target_path = os.path.join(IMAGES_PRODUCTS, filename)

        # 检查目标是否已存在
        if os.path.exists(target_path):
            print(f"   ⚠️  跳过 {filename}：目标已存在")
            continue

        try:
            shutil.copy2(source_path, target_path)
            print(f"   ✅ 迁移: {filename}")
            migrated_count += 1

            # 验证迁移成功后删除原文件
            if os.path.exists(target_path) and os.path.getsize(target_path) == move_item['size']:
                os.remove(source_path)
                print(f"      🗑️  删除原文件")
            else:
                print(f"      ⚠️  迁移验证失败，保留原文件")

        except Exception as e:
            print(f"   ❌ 迁移失败 {filename}: {e}")

    return migrated_count

def create_image_catalog():
    """创建图片目录清单"""
    print("📋 创建图片目录清单...")

    catalog = {
        'products': {},
        'categories': {
            'shaped': [],
            'unshaped': [],
            'special': [],
            'lightweight': []
        },
        'naming_patterns': {}
    }

    # 扫描products目录
    for ext in ['*.png', '*.jpg', '*.jpeg']:
        for img_path in glob.glob(os.path.join(IMAGES_PRODUCTS, ext)):
            filename = os.path.basename(img_path)
            rel_path = f"images/products/{filename}"

            # 分析文件命名模式
            if 'official' in filename.lower():
                pattern = 'official'
            elif 'new' in filename.lower():
                pattern = 'new'
            elif 'real' in filename.lower():
                pattern = 'real'
            elif re.search(r'-\d+\.', filename):
                pattern = 'numbered'
            else:
                pattern = 'legacy'

            # 分类产品类型
            filename_lower = filename.lower()
            if any(keyword in filename_lower for keyword in ['lightweight', 'light']):
                category = 'lightweight'
            elif any(keyword in filename_lower for keyword in ['castable', 'plastic', 'spray', 'unshaped']):
                category = 'unshaped'
            elif any(keyword in filename_lower for keyword in ['special', 'corundum', 'magnesia', 'phosphate']):
                category = 'special'
            else:
                category = 'shaped'

            catalog['products'][filename] = {
                'path': rel_path,
                'category': category,
                'pattern': pattern,
                'size': os.path.getsize(img_path)
            }

            catalog['categories'][category].append(filename)

            if pattern not in catalog['naming_patterns']:
                catalog['naming_patterns'][pattern] = 0
            catalog['naming_patterns'][pattern] += 1

    print(f"   📊 目录统计:")
    for category, files in catalog['categories'].items():
        print(f"      {category}: {len(files)} 个文件")

    print(f"   🏷️  命名模式:")
    for pattern, count in catalog['naming_patterns'].items():
        print(f"      {pattern}: {count} 个文件")

    # 保存目录清单
    catalog_file = os.path.join(SCRIPTS_DIR, 'image_catalog.json')
    import json
    with open(catalog_file, 'w', encoding='utf-8') as f:
        json.dump(catalog, f, ensure_ascii=False, indent=2)

    print(f"   💾 目录清单保存到: {catalog_file}")

    return catalog

def standardize_naming():
    """标准化图片命名"""
    print("🏷️  分析命名标准化需求...")

    # 获取当前的命名模式
    naming_issues = []

    for ext in ['*.png', '*.jpg', '*.jpeg']:
        for img_path in glob.glob(os.path.join(IMAGES_PRODUCTS, ext)):
            filename = os.path.basename(img_path)

            # 检查命名一致性
            issues = []

            # 检查是否混合使用下划线和连字符
            if '_' in filename and '-' in filename:
                issues.append('mixed_separators')

            # 检查是否有空格
            if ' ' in filename:
                issues.append('contains_spaces')

            # 检查扩展名大小写
            if filename.endswith('.PNG') or filename.endswith('.JPG'):
                issues.append('uppercase_extension')

            if issues:
                naming_issues.append({
                    'filename': filename,
                    'path': img_path,
                    'issues': issues
                })

    if naming_issues:
        print(f"   ⚠️  发现 {len(naming_issues)} 个命名问题")
        for issue in naming_issues[:5]:
            print(f"      {issue['filename']}: {', '.join(issue['issues'])}")
        if len(naming_issues) > 5:
            print(f"      ... 还有 {len(naming_issues) - 5} 个问题")
    else:
        print(f"   ✅ 命名规范良好")

    return naming_issues

def main():
    """主函数"""
    print("=" * 80)
    print("🔧 整合分离的图片库系统")
    print("=" * 80)

    # 1. 分析现状
    analysis = analyze_image_distribution()

    # 2. 解决重复文件
    if analysis['duplicates']:
        resolved_count = resolve_duplicates(analysis)
        print(f"\n   ✅ 解决了 {resolved_count} 个重复文件冲突")

    # 3. 迁移产品图片
    if analysis['potential_moves']:
        migrated_count = migrate_product_images(analysis)
        print(f"\n   ✅ 迁移了 {migrated_count} 个产品图片")

    # 4. 创建图片目录
    catalog = create_image_catalog()

    # 5. 检查命名标准化
    naming_issues = standardize_naming()

    print(f"\n🎯 整合完成:")
    print(f"   ✅ 产品图片已统一到 images/products/ 目录")
    print(f"   📊 总产品图片: {len(catalog['products'])} 个")
    print(f"   🏷️  命名问题: {len(naming_issues)} 个")
    if naming_issues:
        print(f"   📝 建议手动修复命名问题以提高一致性")

    print(f"\n📝 后续建议:")
    print(f"   1. 清理根目录中剩余的无关图片")
    print(f"   2. 建立图片更新流程规范")
    print(f"   3. 定期检查图片一致性")

if __name__ == "__main__":
    main()