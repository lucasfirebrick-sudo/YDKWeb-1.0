#!/usr/bin/env python3
"""
最终图片一致性检查工具
准确检查所有HTML文件中的图片引用和实际文件存在情况
生成完整的图片系统健康报告
"""

import os
import glob
import re
import json
from pathlib import Path

# 路径配置
PROJECT_ROOT = r"D:\ai\新建文件夹\新建文件夹\7788"
PRODUCTS_DIR = os.path.join(PROJECT_ROOT, "products")
IMAGES_ROOT = os.path.join(PROJECT_ROOT, "images")
SCRIPTS_DIR = os.path.join(PROJECT_ROOT, "scripts")

def scan_all_html_files():
    """扫描所有HTML文件"""
    html_files = []

    # 主要页面
    main_pages = ['products.html', 'index.html', 'about.html', 'contact.html', 'quality.html', 'applications.html']
    for page in main_pages:
        page_path = os.path.join(PROJECT_ROOT, page)
        if os.path.exists(page_path):
            html_files.append({
                'type': 'main_page',
                'file': page,
                'path': page_path
            })

    # 产品详情页
    for product_file in glob.glob(os.path.join(PRODUCTS_DIR, "*.html")):
        html_files.append({
            'type': 'product_page',
            'file': f"products/{os.path.basename(product_file)}",
            'path': product_file
        })

    return html_files

def extract_all_image_references(html_path):
    """提取HTML文件中的所有图片引用"""
    try:
        with open(html_path, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        return {'error': str(e), 'references': []}

    references = []

    # 1. img标签的src属性 (支持多行)
    img_pattern = r'<img[^>]*src\s*=\s*["\']([^"\']+)["\'][^>]*>'
    img_matches = re.findall(img_pattern, content, re.DOTALL | re.IGNORECASE)
    for match in img_matches:
        references.append({
            'type': 'img_src',
            'path': match.strip(),
            'tag': 'img'
        })

    # 2. data-images属性 (轮播图片)
    data_images_pattern = r'data-images\s*=\s*["\']([^"\']+)["\']'
    data_matches = re.findall(data_images_pattern, content, re.DOTALL | re.IGNORECASE)
    for match in data_matches:
        for img_path in match.split(','):
            img_path = img_path.strip()
            if img_path:
                references.append({
                    'type': 'data_images',
                    'path': img_path,
                    'tag': 'carousel'
                })

    # 3. CSS背景图片
    css_bg_pattern = r'background-image\s*:\s*url\s*\(\s*["\']?([^"\')\s]+)["\']?\s*\)'
    css_matches = re.findall(css_bg_pattern, content, re.DOTALL | re.IGNORECASE)
    for match in css_matches:
        references.append({
            'type': 'css_background',
            'path': match.strip(),
            'tag': 'css'
        })

    # 4. 内联样式背景图片
    inline_bg_pattern = r'style\s*=\s*["\'][^"\']*background-image\s*:\s*url\s*\(\s*["\']?([^"\')\s]+)["\']?\s*\)[^"\']*["\']'
    inline_matches = re.findall(inline_bg_pattern, content, re.DOTALL | re.IGNORECASE)
    for match in inline_matches:
        references.append({
            'type': 'inline_background',
            'path': match.strip(),
            'tag': 'style'
        })

    return {'error': None, 'references': references}

def check_file_existence(img_path, base_path):
    """检查图片文件是否存在"""
    # 处理相对路径
    if img_path.startswith('../'):
        # 从产品页面引用的相对路径
        full_path = os.path.join(os.path.dirname(base_path), img_path.replace('../', ''))
    elif img_path.startswith('./'):
        # 当前目录相对路径
        full_path = os.path.join(os.path.dirname(base_path), img_path[2:])
    elif not img_path.startswith('/') and not img_path.startswith('http'):
        # 相对路径（从当前文件位置）
        full_path = os.path.join(os.path.dirname(base_path), img_path)
    else:
        # 绝对路径或URL
        if img_path.startswith('http'):
            return {'exists': True, 'type': 'external_url', 'path': img_path}
        full_path = img_path

    # 标准化路径
    full_path = os.path.normpath(full_path)

    # 检查文件是否存在
    exists = os.path.exists(full_path)

    result = {
        'exists': exists,
        'type': 'local_file',
        'full_path': full_path,
        'path': img_path
    }

    if exists:
        result['size'] = os.path.getsize(full_path)

    return result

def analyze_image_consistency():
    """分析图片一致性"""
    print("🔍 开始最终图片一致性检查...")

    html_files = scan_all_html_files()
    print(f"📄 发现 {len(html_files)} 个HTML文件")

    analysis_results = {
        'html_files': {},
        'summary': {
            'total_files': len(html_files),
            'total_references': 0,
            'valid_references': 0,
            'invalid_references': 0,
            'external_references': 0
        },
        'issues': []
    }

    for html_file in html_files:
        file_key = html_file['file']
        print(f"   分析: {file_key}")

        # 提取图片引用
        extraction = extract_all_image_references(html_file['path'])

        if extraction['error']:
            analysis_results['html_files'][file_key] = {
                'error': extraction['error'],
                'status': 'read_error'
            }
            continue

        references = extraction['references']
        file_analysis = {
            'type': html_file['type'],
            'total_references': len(references),
            'valid_references': [],
            'invalid_references': [],
            'external_references': [],
            'status': 'analyzed'
        }

        # 检查每个图片引用
        for ref in references:
            check_result = check_file_existence(ref['path'], html_file['path'])

            ref_info = {
                'type': ref['type'],
                'tag': ref['tag'],
                'path': ref['path'],
                'exists': check_result['exists'],
                'full_path': check_result.get('full_path', ''),
                'size': check_result.get('size', 0)
            }

            if check_result['type'] == 'external_url':
                file_analysis['external_references'].append(ref_info)
                analysis_results['summary']['external_references'] += 1
            elif check_result['exists']:
                file_analysis['valid_references'].append(ref_info)
                analysis_results['summary']['valid_references'] += 1
            else:
                file_analysis['invalid_references'].append(ref_info)
                analysis_results['summary']['invalid_references'] += 1

                # 记录问题
                analysis_results['issues'].append({
                    'file': file_key,
                    'type': 'missing_image',
                    'reference_type': ref['type'],
                    'path': ref['path'],
                    'full_path': check_result.get('full_path', '')
                })

        analysis_results['summary']['total_references'] += len(references)
        analysis_results['html_files'][file_key] = file_analysis

    return analysis_results

def find_orphaned_images():
    """查找孤立的图片文件"""
    print("🔍 查找孤立的图片文件...")

    # 收集所有被引用的图片路径
    analysis = analyze_image_consistency()
    referenced_images = set()

    for file_key, file_data in analysis['html_files'].items():
        if file_data.get('status') == 'analyzed':
            for ref in file_data['valid_references']:
                full_path = os.path.normpath(ref['full_path'])
                referenced_images.add(full_path)

    # 扫描所有实际存在的图片文件
    all_images = set()
    for ext in ['*.png', '*.jpg', '*.jpeg', '*.gif', '*.svg', '*.webp']:
        for img_path in glob.glob(os.path.join(IMAGES_ROOT, "**", ext), recursive=True):
            all_images.add(os.path.normpath(img_path))

    # 查找孤立文件
    orphaned_images = all_images - referenced_images

    # 过滤掉一些特殊目录（如备份目录）
    filtered_orphaned = []
    for orphan in orphaned_images:
        rel_path = os.path.relpath(orphan, PROJECT_ROOT)
        if not any(skip in rel_path for skip in ['backup', 'temp', 'cache', '.git']):
            filtered_orphaned.append({
                'path': orphan,
                'relative_path': rel_path,
                'size': os.path.getsize(orphan)
            })

    return filtered_orphaned

def generate_final_report(analysis, orphaned_images):
    """生成最终报告"""
    print("\n" + "=" * 80)
    print("📊 最终图片一致性检查报告")
    print("=" * 80)

    # 总体统计
    summary = analysis['summary']
    total_refs = summary['total_references']
    valid_refs = summary['valid_references']
    invalid_refs = summary['invalid_references']
    external_refs = summary['external_references']

    success_rate = (valid_refs / total_refs * 100) if total_refs > 0 else 100

    print(f"\n📈 总体统计:")
    print(f"   HTML文件: {summary['total_files']} 个")
    print(f"   图片引用: {total_refs} 个")
    print(f"   ✅ 有效引用: {valid_refs} ({valid_refs/total_refs*100:.1f}%)")
    print(f"   ❌ 无效引用: {invalid_refs} ({invalid_refs/total_refs*100:.1f}%)")
    print(f"   🌐 外部引用: {external_refs} ({external_refs/total_refs*100:.1f}%)")
    print(f"   📊 成功率: {success_rate:.1f}%")

    # 按文件类型分析
    main_page_issues = 0
    product_page_issues = 0

    for file_key, file_data in analysis['html_files'].items():
        if file_data.get('status') == 'analyzed':
            invalid_count = len(file_data['invalid_references'])
            if file_data['type'] == 'main_page':
                main_page_issues += invalid_count
            else:
                product_page_issues += invalid_count

    print(f"\n📄 按页面类型统计:")
    print(f"   主页面问题: {main_page_issues} 个")
    print(f"   产品页面问题: {product_page_issues} 个")

    # 问题详情
    if analysis['issues']:
        print(f"\n❌ 无效引用详情 (前10个):")
        for i, issue in enumerate(analysis['issues'][:10], 1):
            print(f"   {i:2d}. {issue['file']}: {issue['path']}")
            print(f"       类型: {issue['reference_type']}")

        if len(analysis['issues']) > 10:
            print(f"   ... 还有 {len(analysis['issues']) - 10} 个问题")

    # 孤立文件报告
    if orphaned_images:
        total_orphaned_size = sum(img['size'] for img in orphaned_images)
        print(f"\n🗑️  孤立文件:")
        print(f"   文件数量: {len(orphaned_images)} 个")
        print(f"   总大小: {total_orphaned_size / 1024 / 1024:.1f} MB")

        if len(orphaned_images) <= 10:
            for orphan in orphaned_images:
                size_mb = orphan['size'] / 1024 / 1024
                print(f"   • {orphan['relative_path']} ({size_mb:.1f} MB)")
        else:
            for orphan in orphaned_images[:5]:
                size_mb = orphan['size'] / 1024 / 1024
                print(f"   • {orphan['relative_path']} ({size_mb:.1f} MB)")
            print(f"   ... 还有 {len(orphaned_images) - 5} 个孤立文件")

    # 健康评估
    print(f"\n🏥 系统健康评估:")
    if success_rate >= 95:
        print(f"   ✅ 优秀 - 图片系统非常健康")
    elif success_rate >= 85:
        print(f"   🟡 良好 - 有少量问题需要修复")
    elif success_rate >= 70:
        print(f"   🟠 一般 - 存在一些问题需要关注")
    else:
        print(f"   🔴 需要改进 - 图片系统需要大幅优化")

    # 保存详细报告
    final_report = {
        'timestamp': str(Path().absolute()),
        'summary': summary,
        'success_rate': success_rate,
        'analysis': analysis,
        'orphaned_images': orphaned_images,
        'health_status': 'excellent' if success_rate >= 95 else
                       'good' if success_rate >= 85 else
                       'fair' if success_rate >= 70 else 'needs_improvement'
    }

    report_file = os.path.join(SCRIPTS_DIR, 'final_image_consistency_report.json')
    with open(report_file, 'w', encoding='utf-8') as f:
        json.dump(final_report, f, ensure_ascii=False, indent=2)

    print(f"\n💾 详细报告保存到: {report_file}")

    return final_report

def main():
    """主函数"""
    print("=" * 80)
    print("🔍 最终图片一致性检查")
    print("=" * 80)

    # 1. 分析图片一致性
    analysis = analyze_image_consistency()

    # 2. 查找孤立文件
    orphaned_images = find_orphaned_images()

    # 3. 生成最终报告
    final_report = generate_final_report(analysis, orphaned_images)

    print(f"\n🎯 检查完成!")
    print(f"   图片引用成功率: {final_report['success_rate']:.1f}%")
    print(f"   系统健康状态: {final_report['health_status']}")

    if final_report['success_rate'] >= 95:
        print(f"\n🎉 恭喜！图片系统运行良好，可以正常使用！")
    else:
        print(f"\n📝 建议:")
        print(f"   1. 修复无效的图片引用")
        print(f"   2. 清理孤立的图片文件")
        print(f"   3. 建立图片管理规范")

if __name__ == "__main__":
    main()