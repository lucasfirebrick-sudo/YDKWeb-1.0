#!/usr/bin/env python3
"""
清理重复和错误图片 - 解决产品图片混乱问题
基于诊断结果识别并清理重复图片，保留最佳质量版本
"""

import os
import glob
import re
import json
import shutil
from pathlib import Path
from collections import defaultdict
import hashlib

# 路径配置
PRODUCTS_DIR = r"D:\ai\新建文件夹\新建文件夹\7788\products"
IMAGES_DIR = r"D:\ai\新建文件夹\新建文件夹\7788\images\products"
SCRIPTS_DIR = r"D:\ai\新建文件夹\新建文件夹\7788\scripts"

def calculate_file_hash(file_path):
    """计算文件哈希值用于识别重复文件"""
    try:
        with open(file_path, 'rb') as f:
            return hashlib.md5(f.read()).hexdigest()
    except:
        return None

def get_image_priority_score(filename):
    """为图片文件分配优先级分数（分数越低优先级越高）"""
    filename_lower = filename.lower()

    # 官方图片优先级最高
    if 'official' in filename_lower:
        return 1

    # 新图片优先级较高
    if 'new' in filename_lower:
        return 2

    # 特定产品名称图片
    if any(name in filename_lower for name in ['brick', 'mullite', 'silica', 'clay', 'alumina']):
        return 3

    # 通用产品图片
    return 4

def analyze_duplicate_images():
    """分析重复图片"""
    print("🔍 分析图片目录中的重复文件...")

    # 获取所有图片文件
    image_files = []
    for ext in ['*.png', '*.jpg', '*.jpeg']:
        image_files.extend(glob.glob(os.path.join(IMAGES_DIR, ext)))

    print(f"📁 找到 {len(image_files)} 个图片文件")

    # 按哈希值分组
    hash_groups = defaultdict(list)
    file_sizes = {}

    for img_path in image_files:
        filename = os.path.basename(img_path)
        file_hash = calculate_file_hash(img_path)

        if file_hash:
            hash_groups[file_hash].append(img_path)
            file_sizes[img_path] = os.path.getsize(img_path)

    # 识别重复文件组
    duplicate_groups = {k: v for k, v in hash_groups.items() if len(v) > 1}

    print(f"🔄 发现 {len(duplicate_groups)} 组重复文件")

    return duplicate_groups, file_sizes

def identify_product_image_conflicts():
    """识别产品图片冲突"""
    print("🔍 分析产品图片配置冲突...")

    # 按产品ID分组图片
    product_images = defaultdict(list)

    image_files = glob.glob(os.path.join(IMAGES_DIR, "*"))

    for img_path in image_files:
        filename = os.path.basename(img_path)
        if filename.lower().endswith(('.png', '.jpg', '.jpeg')):
            # 提取产品ID
            product_id = None

            # 常见的产品ID模式
            patterns = [
                r'^([a-z-]+)-',  # product-name-xxx
                r'^([a-z_]+)[-_]',  # product_name_xxx
                r'^([a-z]+)-brick',  # xxx-brick
            ]

            for pattern in patterns:
                match = re.match(pattern, filename.lower())
                if match:
                    product_id = match.group(1)
                    break

            if product_id:
                product_images[product_id].append(img_path)

    # 识别有多个版本的产品
    conflicted_products = {k: v for k, v in product_images.items() if len(v) > 1}

    print(f"⚠️  发现 {len(conflicted_products)} 个产品有多个图片版本")

    return conflicted_products

def load_current_configurations():
    """加载当前的图片配置"""
    print("📖 加载当前产品页面的图片配置...")

    configurations = {}

    for html_file in glob.glob(os.path.join(PRODUCTS_DIR, "*.html")):
        product_id = Path(html_file).stem

        try:
            with open(html_file, 'r', encoding='utf-8') as f:
                content = f.read()

            # 提取data-images配置
            data_images_match = re.search(r'data-images="([^"]*)"', content)
            if data_images_match:
                images = [img.strip() for img in data_images_match.group(1).split(',') if img.strip()]
                # 转换为绝对路径
                abs_images = []
                for img in images:
                    if img.startswith('../images/products/'):
                        abs_path = os.path.join(IMAGES_DIR, img.replace('../images/products/', ''))
                        abs_images.append(abs_path)

                configurations[product_id] = abs_images

        except Exception as e:
            print(f"❌ 读取 {product_id} 配置失败: {e}")

    return configurations

def create_cleanup_plan(duplicate_groups, conflicted_products, current_configs, file_sizes):
    """创建清理计划"""
    print("📋 创建图片清理计划...")

    cleanup_plan = {
        'duplicate_removals': [],
        'conflict_resolutions': [],
        'orphaned_files': [],
        'config_updates': {}
    }

    # 处理重复文件
    for file_hash, file_list in duplicate_groups.items():
        if len(file_list) > 1:
            # 按优先级排序
            sorted_files = sorted(file_list, key=lambda x: (
                get_image_priority_score(os.path.basename(x)),
                -file_sizes[x],  # 文件大小倒序
                os.path.basename(x)  # 文件名字母序
            ))

            # 保留第一个，删除其他
            keep_file = sorted_files[0]
            remove_files = sorted_files[1:]

            cleanup_plan['duplicate_removals'].append({
                'keep': keep_file,
                'remove': remove_files,
                'reason': f'重复文件，保留最佳版本 (优先级: {get_image_priority_score(os.path.basename(keep_file))})'
            })

    # 处理产品图片冲突
    for product_id, image_list in conflicted_products.items():
        if len(image_list) > 3:  # 如果某个产品图片过多
            # 按优先级选择最佳的3张
            sorted_images = sorted(image_list, key=lambda x: (
                get_image_priority_score(os.path.basename(x)),
                -file_sizes[x],
                os.path.basename(x)
            ))

            keep_images = sorted_images[:3]
            remove_images = sorted_images[3:]

            if remove_images:
                cleanup_plan['conflict_resolutions'].append({
                    'product': product_id,
                    'keep': keep_images,
                    'remove': remove_images,
                    'reason': f'产品图片过多，保留最佳3张'
                })

    # 识别孤立文件（未被任何产品使用的图片）
    all_configured_images = set()
    for images in current_configs.values():
        all_configured_images.update(images)

    all_image_files = set(glob.glob(os.path.join(IMAGES_DIR, "*")))
    all_image_files = {f for f in all_image_files if f.lower().endswith(('.png', '.jpg', '.jpeg'))}

    orphaned_files = all_image_files - all_configured_images

    # 过滤掉可能有用的文件
    filtered_orphaned = []
    for orphan in orphaned_files:
        filename = os.path.basename(orphan).lower()
        # 保留可能有用的文件
        if not any(keyword in filename for keyword in ['official', 'new', 'placeholder']):
            if file_sizes[orphan] < 10000:  # 小于10KB的文件可能是损坏的
                filtered_orphaned.append(orphan)

    cleanup_plan['orphaned_files'] = filtered_orphaned

    return cleanup_plan

def execute_cleanup_plan(cleanup_plan):
    """执行清理计划"""
    print("🧹 开始执行图片清理...")

    removed_count = 0
    backup_dir = os.path.join(SCRIPTS_DIR, 'image_backup')

    # 创建备份目录
    os.makedirs(backup_dir, exist_ok=True)

    # 处理重复文件删除
    for item in cleanup_plan['duplicate_removals']:
        print(f"\n📄 处理重复文件组:")
        print(f"   保留: {os.path.basename(item['keep'])}")

        for remove_file in item['remove']:
            try:
                filename = os.path.basename(remove_file)
                # 备份到备份目录
                backup_path = os.path.join(backup_dir, f"duplicate_{filename}")
                shutil.copy2(remove_file, backup_path)

                # 删除原文件
                os.remove(remove_file)
                print(f"   ✅ 删除: {filename} (已备份)")
                removed_count += 1

            except Exception as e:
                print(f"   ❌ 删除失败 {filename}: {e}")

    # 处理产品冲突解决
    for item in cleanup_plan['conflict_resolutions']:
        print(f"\n🏷️  处理产品 {item['product']} 的图片冲突:")
        print(f"   保留 {len(item['keep'])} 张图片")

        for remove_file in item['remove']:
            try:
                filename = os.path.basename(remove_file)
                # 备份到备份目录
                backup_path = os.path.join(backup_dir, f"conflict_{filename}")
                shutil.copy2(remove_file, backup_path)

                # 删除原文件
                os.remove(remove_file)
                print(f"   ✅ 删除: {filename} (已备份)")
                removed_count += 1

            except Exception as e:
                print(f"   ❌ 删除失败 {filename}: {e}")

    # 处理孤立文件
    if cleanup_plan['orphaned_files']:
        print(f"\n🗑️  清理孤立文件:")
        for orphan_file in cleanup_plan['orphaned_files']:
            try:
                filename = os.path.basename(orphan_file)
                # 备份到备份目录
                backup_path = os.path.join(backup_dir, f"orphaned_{filename}")
                shutil.copy2(orphan_file, backup_path)

                # 删除原文件
                os.remove(orphan_file)
                print(f"   ✅ 删除: {filename} (已备份)")
                removed_count += 1

            except Exception as e:
                print(f"   ❌ 删除失败 {filename}: {e}")

    return removed_count

def update_product_configurations():
    """更新产品配置以反映图片清理结果"""
    print("🔄 更新产品配置...")

    updated_count = 0

    for html_file in glob.glob(os.path.join(PRODUCTS_DIR, "*.html")):
        product_id = Path(html_file).stem

        try:
            with open(html_file, 'r', encoding='utf-8') as f:
                content = f.read()

            # 获取该产品当前仍存在的图片
            pattern = os.path.join(IMAGES_DIR, f"{product_id}*")
            available_images = []

            for img_path in glob.glob(pattern):
                if img_path.lower().endswith(('.png', '.jpg', '.jpeg')):
                    filename = os.path.basename(img_path)
                    relative_path = f"../images/products/{filename}"
                    available_images.append(relative_path)

            # 按优先级排序
            available_images = sorted(available_images, key=lambda x:
                get_image_priority_score(os.path.basename(x)))

            if available_images:
                # 更新data-images配置
                new_data_images = ",".join(available_images)

                # 查找并替换data-images
                data_images_pattern = r'data-images="[^"]*"'
                new_content = re.sub(data_images_pattern, f'data-images="{new_data_images}"', content)

                # 更新主图片src
                main_image_pattern = r'(<img[^>]+class="main-image"[^>]+src=")[^"]*"'
                new_content = re.sub(main_image_pattern, f'\\1{available_images[0]}"', new_content)

                if new_content != content:
                    with open(html_file, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    print(f"   ✅ 更新 {product_id}: {len(available_images)} 张图片")
                    updated_count += 1

        except Exception as e:
            print(f"   ❌ 更新 {product_id} 失败: {e}")

    return updated_count

def run_cleanup():
    """运行完整的图片清理流程"""
    print("=" * 80)
    print("🧹 开始清理重复和错误图片")
    print("=" * 80)

    # 1. 分析重复图片
    duplicate_groups, file_sizes = analyze_duplicate_images()

    # 2. 识别产品图片冲突
    conflicted_products = identify_product_image_conflicts()

    # 3. 加载当前配置
    current_configs = load_current_configurations()

    # 4. 创建清理计划
    cleanup_plan = create_cleanup_plan(duplicate_groups, conflicted_products, current_configs, file_sizes)

    # 5. 显示清理计划
    print(f"\n📋 清理计划:")
    print(f"   🔄 重复文件组: {len(cleanup_plan['duplicate_removals'])}")
    print(f"   ⚠️  产品冲突: {len(cleanup_plan['conflict_resolutions'])}")
    print(f"   🗑️  孤立文件: {len(cleanup_plan['orphaned_files'])}")

    total_removals = 0
    for item in cleanup_plan['duplicate_removals']:
        total_removals += len(item['remove'])
    for item in cleanup_plan['conflict_resolutions']:
        total_removals += len(item['remove'])
    total_removals += len(cleanup_plan['orphaned_files'])

    print(f"\n预计删除文件: {total_removals} 个")

    # 6. 执行清理
    removed_count = execute_cleanup_plan(cleanup_plan)

    # 7. 更新配置
    updated_count = update_product_configurations()

    print(f"\n🎯 清理完成:")
    print(f"   删除文件: {removed_count} 个")
    print(f"   更新配置: {updated_count} 个产品")
    print(f"   备份位置: scripts/image_backup/")

    print(f"\n📝 建议:")
    print(f"   1. 检查清理结果")
    print(f"   2. 运行验证脚本")
    print(f"   3. 测试产品页面")

if __name__ == "__main__":
    run_cleanup()