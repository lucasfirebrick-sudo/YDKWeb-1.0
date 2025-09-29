#!/usr/bin/env python3
"""
修复products.html中的图片引用问题
基于冲突分析结果，自动替换错误的图片路径
"""

import os
import json
import re
import shutil
from pathlib import Path

# 路径配置
PROJECT_ROOT = r"D:\ai\新建文件夹\新建文件夹\7788"
SCRIPTS_DIR = os.path.join(PROJECT_ROOT, "scripts")
PRODUCTS_HTML = os.path.join(PROJECT_ROOT, "products.html")

def load_conflict_analysis():
    """加载冲突分析结果"""
    report_file = os.path.join(SCRIPTS_DIR, 'complete_image_conflict_report.json')

    try:
        with open(report_file, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"❌ 无法加载分析报告: {e}")
        return None

def restore_missing_images_from_backup():
    """从备份恢复缺失的图片"""
    print("🔄 从备份恢复缺失的图片...")

    analysis_data = load_conflict_analysis()
    if not analysis_data:
        return []

    recommendations = analysis_data['recommendations']['path_replacements']
    restored_files = []

    for missing_path, replacement_info in recommendations.items():
        source_path = os.path.join(PROJECT_ROOT, replacement_info['replacement'].replace('/', '\\'))

        # 如果替换建议来自backup目录，先恢复图片
        if 'scripts/image_backup/' in replacement_info['replacement']:
            # 目标路径在products目录
            target_filename = os.path.basename(missing_path)
            target_path = os.path.join(PROJECT_ROOT, "images", "products", target_filename)

            if os.path.exists(source_path) and not os.path.exists(target_path):
                try:
                    shutil.copy2(source_path, target_path)
                    print(f"   ✅ 恢复: {target_filename}")
                    restored_files.append(target_filename)
                except Exception as e:
                    print(f"   ❌ 恢复失败 {target_filename}: {e}")

    return restored_files

def create_path_mapping():
    """创建路径映射表"""
    print("📋 创建图片路径映射表...")

    analysis_data = load_conflict_analysis()
    if not analysis_data:
        return {}

    path_mapping = {}
    recommendations = analysis_data['recommendations']['path_replacements']

    for missing_path, replacement_info in recommendations.items():
        original_path = missing_path

        # 优先使用products目录中的图片
        if 'scripts/image_backup/' in replacement_info['replacement']:
            # 如果是从备份恢复的，映射到products目录
            filename = os.path.basename(missing_path)
            new_path = f"images/products/{filename}"
        else:
            # 直接使用推荐的路径
            new_path = replacement_info['replacement']

        path_mapping[original_path] = new_path
        print(f"   {original_path} → {new_path}")

    # 添加一些手动映射（基于分析发现的常见模式）
    additional_mappings = {
        'images/products/high-alumina-brick-real.png': 'images/products/standard-high-alumina-brick-official-1.png',
        'images/products/silica-brick-real.png': 'images/products/general-silica-brick-official-1.png',
        'images/products/sintered-mullite-brick-real.png': 'images/products/mullite-brick-official-1.png',
    }

    for original, replacement in additional_mappings.items():
        if original not in path_mapping:
            # 检查替换文件是否存在
            replacement_full_path = os.path.join(PROJECT_ROOT, replacement.replace('/', '\\'))
            if os.path.exists(replacement_full_path):
                path_mapping[original] = replacement
                print(f"   {original} → {replacement} (手动映射)")

    return path_mapping

def fix_products_html_images():
    """修复products.html中的图片路径"""
    print("🔧 修复products.html中的图片路径...")

    # 先恢复缺失的图片
    restored_files = restore_missing_images_from_backup()

    # 创建路径映射
    path_mapping = create_path_mapping()

    if not path_mapping:
        print("❌ 没有找到有效的路径映射")
        return False

    # 读取products.html
    try:
        with open(PRODUCTS_HTML, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        print(f"❌ 读取products.html失败: {e}")
        return False

    original_content = content
    fixed_count = 0

    # 执行路径替换
    for original_path, new_path in path_mapping.items():
        # 验证新路径的文件是否存在
        new_path_full = os.path.join(PROJECT_ROOT, new_path.replace('/', '\\'))
        if os.path.exists(new_path_full):
            if original_path in content:
                content = content.replace(original_path, new_path)
                fixed_count += 1
                print(f"   ✅ 修复: {original_path} → {new_path}")
            else:
                print(f"   ℹ️  路径未找到: {original_path}")
        else:
            print(f"   ⚠️  目标文件不存在: {new_path}")

    # 写回文件
    if content != original_content:
        # 创建备份
        backup_path = PRODUCTS_HTML + '.backup'
        shutil.copy2(PRODUCTS_HTML, backup_path)
        print(f"   📄 备份创建: {backup_path}")

        try:
            with open(PRODUCTS_HTML, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"   ✅ products.html已更新，修复了 {fixed_count} 个图片路径")
            return True
        except Exception as e:
            print(f"   ❌ 写入products.html失败: {e}")
            return False
    else:
        print("   ℹ️  没有需要修复的路径")
        return False

def verify_fixes():
    """验证修复结果"""
    print("🔍 验证修复结果...")

    try:
        with open(PRODUCTS_HTML, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        print(f"❌ 读取products.html失败: {e}")
        return

    # 查找所有图片引用
    img_pattern = r'<img[^>]+src=["\']([^"\']+)["\'][^>]*>'
    img_matches = re.findall(img_pattern, content)

    total_images = len(img_matches)
    valid_images = 0
    invalid_images = []

    for img_path in img_matches:
        if img_path.startswith('images/'):
            full_path = os.path.join(PROJECT_ROOT, img_path.replace('/', '\\'))
            if os.path.exists(full_path):
                valid_images += 1
            else:
                invalid_images.append(img_path)

    print(f"   📊 图片引用统计:")
    print(f"      总图片引用: {total_images}")
    print(f"      有效引用: {valid_images}")
    print(f"      无效引用: {len(invalid_images)}")

    if invalid_images:
        print(f"   ❌ 仍然无效的图片路径:")
        for i, invalid_path in enumerate(invalid_images[:10], 1):
            print(f"      {i:2d}. {invalid_path}")
        if len(invalid_images) > 10:
            print(f"      ... 还有 {len(invalid_images) - 10} 个无效路径")
    else:
        print(f"   ✅ 所有图片路径都已修复！")

    success_rate = (valid_images / total_images * 100) if total_images > 0 else 0
    print(f"   📈 修复成功率: {success_rate:.1f}%")

def main():
    """主函数"""
    print("=" * 80)
    print("🔧 修复products.html中的图片引用")
    print("=" * 80)

    # 执行修复
    success = fix_products_html_images()

    if success:
        # 验证修复结果
        verify_fixes()

        print(f"\n🎯 修复完成:")
        print(f"   ✅ products.html图片路径已修复")
        print(f"   📄 原文件已备份为 products.html.backup")
        print(f"   🔍 建议在浏览器中测试页面")
    else:
        print(f"\n❌ 修复失败，请检查错误信息")

if __name__ == "__main__":
    main()