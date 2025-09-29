#!/usr/bin/env python3
"""
完整的图片系统冲突分析 - 彻底解决多图片库冲突问题
分析所有HTML文件的图片引用，建立完整的路径映射表
"""

import os
import glob
import re
import json
from pathlib import Path
from collections import defaultdict

# 路径配置
PROJECT_ROOT = r"D:\ai\新建文件夹\新建文件夹\7788"
IMAGES_ROOT = os.path.join(PROJECT_ROOT, "images")
PRODUCTS_DIR = os.path.join(PROJECT_ROOT, "products")
SCRIPTS_DIR = os.path.join(PROJECT_ROOT, "scripts")

def scan_all_images():
    """扫描所有图片文件"""
    print("🔍 扫描所有图片文件...")

    image_libraries = {
        'images_root': {},
        'images_products': {},
        'backup_images': {}
    }

    # 扫描根目录images/
    for ext in ['*.png', '*.jpg', '*.jpeg']:
        for img_path in glob.glob(os.path.join(IMAGES_ROOT, ext)):
            filename = os.path.basename(img_path)
            rel_path = os.path.relpath(img_path, PROJECT_ROOT).replace('\\', '/')
            image_libraries['images_root'][filename] = {
                'path': rel_path,
                'size': os.path.getsize(img_path),
                'exists': True
            }

    # 扫描images/products/
    products_img_dir = os.path.join(IMAGES_ROOT, "products")
    if os.path.exists(products_img_dir):
        for ext in ['*.png', '*.jpg', '*.jpeg']:
            for img_path in glob.glob(os.path.join(products_img_dir, ext)):
                filename = os.path.basename(img_path)
                rel_path = os.path.relpath(img_path, PROJECT_ROOT).replace('\\', '/')
                image_libraries['images_products'][filename] = {
                    'path': rel_path,
                    'size': os.path.getsize(img_path),
                    'exists': True
                }

    # 扫描备份目录
    backup_dir = os.path.join(SCRIPTS_DIR, "image_backup")
    if os.path.exists(backup_dir):
        for ext in ['*.png', '*.jpg', '*.jpeg']:
            for img_path in glob.glob(os.path.join(backup_dir, ext)):
                filename = os.path.basename(img_path)
                rel_path = os.path.relpath(img_path, PROJECT_ROOT).replace('\\', '/')
                image_libraries['backup_images'][filename] = {
                    'path': rel_path,
                    'size': os.path.getsize(img_path),
                    'exists': True
                }

    print(f"   📁 根目录图片: {len(image_libraries['images_root'])} 个")
    print(f"   📁 products目录图片: {len(image_libraries['images_products'])} 个")
    print(f"   📁 备份目录图片: {len(image_libraries['backup_images'])} 个")

    return image_libraries

def scan_html_image_references():
    """扫描所有HTML文件中的图片引用"""
    print("🔍 扫描HTML文件中的图片引用...")

    html_references = {}

    # 扫描主要HTML文件
    html_files = [
        'products.html',
        'index.html',
        'about.html',
        'contact.html',
        'quality.html',
        'applications.html'
    ]

    for html_file in html_files:
        html_path = os.path.join(PROJECT_ROOT, html_file)
        if os.path.exists(html_path):
            html_references[html_file] = analyze_html_images(html_path)

    # 扫描产品详情页
    product_files = glob.glob(os.path.join(PRODUCTS_DIR, "*.html"))
    for product_file in product_files:
        filename = os.path.basename(product_file)
        html_references[f"products/{filename}"] = analyze_html_images(product_file)

    return html_references

def analyze_html_images(html_path):
    """分析单个HTML文件的图片引用"""
    try:
        with open(html_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # 查找所有img标签
        img_pattern = r'<img[^>]+src=["\']([^"\']+)["\'][^>]*>'
        img_matches = re.findall(img_pattern, content)

        # 查找CSS中的背景图片
        css_bg_pattern = r'background-image:\s*url\(["\']?([^"\')\s]+)["\']?\)'
        css_matches = re.findall(css_bg_pattern, content)

        # 查找data-images属性
        data_images_pattern = r'data-images=["\']([^"\']+)["\']'
        data_matches = re.findall(data_images_pattern, content)

        references = {
            'img_src': img_matches,
            'css_backgrounds': css_matches,
            'data_images': []
        }

        # 处理data-images（可能包含多个图片）
        for data_imgs in data_matches:
            images = [img.strip() for img in data_imgs.split(',') if img.strip()]
            references['data_images'].extend(images)

        return references

    except Exception as e:
        print(f"   ❌ 读取 {html_path} 失败: {e}")
        return {'img_src': [], 'css_backgrounds': [], 'data_images': []}

def analyze_conflicts(image_libraries, html_references):
    """分析图片冲突和缺失"""
    print("🔍 分析图片冲突和缺失...")

    analysis = {
        'missing_images': [],
        'conflicting_paths': [],
        'correct_mappings': {},
        'orphaned_images': []
    }

    # 收集所有被引用的图片路径
    all_referenced_paths = set()

    for html_file, refs in html_references.items():
        for img_list in refs.values():
            for img_path in img_list:
                if img_path.startswith('images/'):
                    all_referenced_paths.add(img_path)

    print(f"   📊 发现 {len(all_referenced_paths)} 个不同的图片引用")

    # 分析每个引用的图片
    for ref_path in all_referenced_paths:
        filename = os.path.basename(ref_path)
        full_path = os.path.join(PROJECT_ROOT, ref_path.replace('/', '\\'))

        if os.path.exists(full_path):
            # 图片存在，记录正确映射
            analysis['correct_mappings'][ref_path] = ref_path
        else:
            # 图片不存在，查找可能的替代品
            analysis['missing_images'].append({
                'referenced_path': ref_path,
                'filename': filename,
                'potential_matches': find_potential_matches(filename, image_libraries)
            })

    # 查找孤立的图片（存在但未被引用）
    all_existing_images = set()

    for lib_name, lib_images in image_libraries.items():
        for img_name, img_info in lib_images.items():
            all_existing_images.add(img_info['path'])

    referenced_paths_set = set(analysis['correct_mappings'].keys())
    orphaned = all_existing_images - referenced_paths_set

    for orphan in orphaned:
        if 'images/' in orphan:  # 只关注images目录下的图片
            analysis['orphaned_images'].append(orphan)

    return analysis

def find_potential_matches(missing_filename, image_libraries):
    """查找可能的图片匹配"""
    potential_matches = []

    # 提取产品名称用于模糊匹配
    missing_base = missing_filename.lower().replace('.png', '').replace('.jpg', '').replace('.jpeg', '')
    missing_parts = re.split(r'[-_]', missing_base)

    # 在所有图片库中查找匹配
    for lib_name, lib_images in image_libraries.items():
        for img_name, img_info in lib_images.items():
            img_base = img_name.lower().replace('.png', '').replace('.jpg', '').replace('.jpeg', '')
            img_parts = re.split(r'[-_]', img_base)

            # 计算匹配度
            common_parts = set(missing_parts) & set(img_parts)
            if len(common_parts) >= 2 or (len(common_parts) >= 1 and len(missing_parts) <= 2):
                potential_matches.append({
                    'library': lib_name,
                    'filename': img_name,
                    'path': img_info['path'],
                    'confidence': len(common_parts) / max(len(missing_parts), len(img_parts)),
                    'size': img_info['size']
                })

    # 按置信度排序
    potential_matches.sort(key=lambda x: x['confidence'], reverse=True)
    return potential_matches[:5]  # 返回前5个最佳匹配

def generate_fix_recommendations(analysis):
    """生成修复建议"""
    print("💡 生成修复建议...")

    recommendations = {
        'path_replacements': {},
        'image_migrations': [],
        'cleanup_suggestions': []
    }

    # 为缺失的图片生成路径替换建议
    for missing in analysis['missing_images']:
        ref_path = missing['referenced_path']
        potential_matches = missing['potential_matches']

        if potential_matches:
            best_match = potential_matches[0]
            if best_match['confidence'] > 0.4:  # 置信度阈值
                recommendations['path_replacements'][ref_path] = {
                    'original': ref_path,
                    'replacement': best_match['path'],
                    'confidence': best_match['confidence'],
                    'reason': f"从{best_match['library']}找到最佳匹配"
                }

    # 建议图片迁移（从根目录移动到products目录）
    for lib_name, lib_images in analysis.get('image_libraries', {}).items():
        if lib_name == 'images_root':
            for img_name, img_info in lib_images.items():
                if any(keyword in img_name.lower() for keyword in
                      ['brick', 'alumina', 'clay', 'silica', 'mullite', 'castable']):
                    recommendations['image_migrations'].append({
                        'source': img_info['path'],
                        'target': f"images/products/{img_name}",
                        'reason': "产品图片应统一放在products目录"
                    })

    return recommendations

def generate_comprehensive_report(image_libraries, html_references, analysis, recommendations):
    """生成综合报告"""
    print("📊 生成综合分析报告...")

    # 统计数据
    total_images = sum(len(lib) for lib in image_libraries.values())
    total_references = sum(
        len(refs['img_src']) + len(refs['css_backgrounds']) + len(refs['data_images'])
        for refs in html_references.values()
    )
    missing_count = len(analysis['missing_images'])
    orphaned_count = len(analysis['orphaned_images'])

    print("=" * 80)
    print("📋 图片系统冲突分析报告")
    print("=" * 80)

    print(f"\n📊 总体统计:")
    print(f"   图片库文件总数: {total_images}")
    print(f"   HTML引用总数: {total_references}")
    print(f"   缺失图片数量: {missing_count}")
    print(f"   孤立图片数量: {orphaned_count}")
    print(f"   可修复引用: {len(recommendations['path_replacements'])}")

    print(f"\n🏗️ 图片库分布:")
    for lib_name, lib_images in image_libraries.items():
        print(f"   {lib_name}: {len(lib_images)} 个文件")

    print(f"\n❌ 缺失图片详情 (前10个):")
    for i, missing in enumerate(analysis['missing_images'][:10], 1):
        ref_path = missing['referenced_path']
        potential = missing['potential_matches']
        print(f"   {i:2d}. {ref_path}")
        if potential:
            best = potential[0]
            print(f"       → 建议替换为: {best['path']} (置信度: {best['confidence']:.2f})")
        else:
            print(f"       → 无合适替代品")

    if len(analysis['missing_images']) > 10:
        print(f"   ... 还有 {len(analysis['missing_images']) - 10} 个缺失图片")

    print(f"\n✅ 可自动修复的路径 (前10个):")
    count = 0
    for original, replacement in recommendations['path_replacements'].items():
        if count >= 10:
            break
        print(f"   {count+1:2d}. {original}")
        print(f"       → {replacement['replacement']} (置信度: {replacement['confidence']:.2f})")
        count += 1

    if len(recommendations['path_replacements']) > 10:
        print(f"   ... 还有 {len(recommendations['path_replacements']) - 10} 个可修复路径")

    print(f"\n🔧 修复优先级建议:")
    print(f"   🚨 立即修复: products.html 中的图片引用 ({missing_count} 个)")
    print(f"   ⚙️ 中期整理: 图片库统一迁移 ({len(recommendations['image_migrations'])} 个)")
    print(f"   🧹 长期维护: 清理孤立图片 ({orphaned_count} 个)")

    # 保存详细报告
    report_data = {
        'timestamp': str(Path().absolute()),
        'statistics': {
            'total_images': total_images,
            'total_references': total_references,
            'missing_count': missing_count,
            'orphaned_count': orphaned_count
        },
        'image_libraries': image_libraries,
        'html_references': html_references,
        'analysis': analysis,
        'recommendations': recommendations
    }

    report_file = os.path.join(SCRIPTS_DIR, 'complete_image_conflict_report.json')
    with open(report_file, 'w', encoding='utf-8') as f:
        json.dump(report_data, f, ensure_ascii=False, indent=2)

    print(f"\n💾 详细报告已保存到: {report_file}")

    return report_data

def main():
    """主函数"""
    print("=" * 80)
    print("🔍 完整图片系统冲突分析")
    print("=" * 80)

    # 扫描图片库
    image_libraries = scan_all_images()

    # 扫描HTML引用
    html_references = scan_html_image_references()

    # 分析冲突
    analysis = analyze_conflicts(image_libraries, html_references)

    # 生成修复建议
    recommendations = generate_fix_recommendations(analysis)

    # 生成综合报告
    report_data = generate_comprehensive_report(
        image_libraries, html_references, analysis, recommendations
    )

    return report_data

if __name__ == "__main__":
    main()