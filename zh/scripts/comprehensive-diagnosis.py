#!/usr/bin/env python3
"""
全面诊断脚本 - 彻底检查所有39个产品详情页的图片轮播功能
分析每个页面的具体问题，包括路径匹配、文件存在性、配置状态等
"""

import os
import glob
import re
import json
from pathlib import Path
from collections import defaultdict

# 路径配置
PRODUCTS_DIR = r"D:\ai\新建文件夹\新建文件夹\7788\products"
IMAGES_DIR = r"D:\ai\新建文件夹\新建文件夹\7788\images\products"

class ProductPageDiagnostic:
    def __init__(self):
        self.results = {}
        self.summary = {
            'total_pages': 0,
            'fully_working': 0,
            'display_issues': 0,
            'config_errors': 0,
            'no_images': 0,
            'duplicate_issues': 0
        }

    def analyze_single_product(self, html_file):
        """深度分析单个产品页面"""
        product_id = Path(html_file).stem
        result = {
            'product_id': product_id,
            'status': 'unknown',
            'issues': [],
            'details': {},
            'recommendations': []
        }

        try:
            # 读取HTML文件
            with open(html_file, 'r', encoding='utf-8') as f:
                content = f.read()

            # 检查基本配置
            has_multi_gallery_js = 'multi-image-gallery.js' in content
            has_data_product_id = f'data-product-id="{product_id}"' in content

            # 提取图片配置
            data_images_match = re.search(r'data-images="([^"]*)"', content)
            main_image_match = re.search(r'<img[^>]+src="([^"]*)"[^>]+class="main-image"', content)

            # 分析配置状态
            if data_images_match:
                configured_images = [img.strip() for img in data_images_match.group(1).split(',') if img.strip()]
                result['details']['configured_images_count'] = len(configured_images)
                result['details']['configured_images'] = configured_images
            else:
                configured_images = []
                result['details']['configured_images_count'] = 0
                result['issues'].append('缺少data-images配置')

            if main_image_match:
                main_image_src = main_image_match.group(1)
                result['details']['main_image_src'] = main_image_src
            else:
                result['issues'].append('未找到主图片配置')

            # 检查实际存在的图片文件
            actual_images = self.get_actual_images(product_id)
            result['details']['actual_images_count'] = len(actual_images)
            result['details']['actual_images'] = actual_images

            # 检查图片文件存在性
            missing_images = []
            if configured_images:
                for img_path in configured_images:
                    # 将相对路径转换为绝对路径
                    if img_path.startswith('../images/products/'):
                        filename = img_path.replace('../images/products/', '')
                        full_path = os.path.join(IMAGES_DIR, filename)
                        if not os.path.exists(full_path):
                            missing_images.append(filename)

            result['details']['missing_images'] = missing_images
            result['details']['missing_count'] = len(missing_images)

            # 检查是否有占位符相关内容
            has_placeholder = '产品图片更新中' in content or 'image-status' in content
            result['details']['has_placeholder'] = has_placeholder

            # 诊断具体问题
            self.diagnose_issues(result, configured_images, actual_images, missing_images, has_placeholder)

            # 生成修复建议
            self.generate_recommendations(result)

        except Exception as e:
            result['status'] = 'error'
            result['issues'].append(f'文件读取错误: {str(e)}')

        return result

    def get_actual_images(self, product_id):
        """获取产品实际存在的图片文件"""
        pattern = os.path.join(IMAGES_DIR, f"{product_id}*")
        image_files = glob.glob(pattern)

        valid_images = []
        for img_path in image_files:
            filename = os.path.basename(img_path)
            if filename.lower().endswith(('.png', '.jpg', '.jpeg')):
                valid_images.append(filename)

        # 按优先级排序
        def sort_key(filename):
            if 'official' in filename:
                return (0, filename)
            elif 'new' in filename:
                return (1, filename)
            else:
                return (2, filename)

        return sorted(valid_images, key=sort_key)

    def diagnose_issues(self, result, configured_images, actual_images, missing_images, has_placeholder):
        """诊断具体问题类型"""

        if not actual_images:
            result['status'] = 'no_images'
            result['issues'].append('没有找到任何图片文件')
            return

        if len(actual_images) == 1:
            if configured_images and len(configured_images) == 1 and not missing_images:
                result['status'] = 'single_image_ok'
            elif not configured_images:
                result['status'] = 'single_image_missing_config'
                result['issues'].append('单图产品缺少图片配置')
            else:
                result['status'] = 'single_image_error'
                result['issues'].append('单图产品配置异常')
        else:
            # 多图产品
            if not configured_images:
                result['status'] = 'multi_image_missing_config'
                result['issues'].append('多图产品完全缺少配置')
            elif missing_images:
                result['status'] = 'multi_image_partial_missing'
                result['issues'].append(f'配置的图片中有{len(missing_images)}个文件不存在')
            elif len(configured_images) != len(actual_images):
                result['status'] = 'multi_image_count_mismatch'
                result['issues'].append(f'配置图片数({len(configured_images)})与实际图片数({len(actual_images)})不匹配')
            elif has_placeholder:
                result['status'] = 'display_issue'
                result['issues'].append('有图片配置但显示占位符（可能是JavaScript初始化问题）')
            else:
                result['status'] = 'multi_image_ok'

        # 检查重复图片
        if actual_images:
            # 检查是否有重复的图片（不同命名但内容相似）
            base_names = set()
            for img in actual_images:
                base_name = re.sub(r'-(official|new|\d+)\.(png|jpg|jpeg)$', '', img, flags=re.IGNORECASE)
                if base_name in base_names:
                    result['issues'].append('可能存在重复图片')
                    break
                base_names.add(base_name)

    def generate_recommendations(self, result):
        """生成修复建议"""
        status = result['status']

        if status == 'no_images':
            result['recommendations'].append('为该产品添加图片或配置合适的占位符')

        elif status == 'single_image_missing_config':
            result['recommendations'].append('添加data-images配置指向唯一的图片文件')

        elif status == 'multi_image_missing_config':
            result['recommendations'].append('为多图产品添加完整的data-images配置')
            result['recommendations'].append('确保引用multi-image-gallery.js组件')

        elif status == 'multi_image_partial_missing':
            result['recommendations'].append('移除配置中不存在的图片路径')
            result['recommendations'].append('重新扫描并添加所有实际存在的图片')

        elif status == 'multi_image_count_mismatch':
            result['recommendations'].append('更新data-images配置以包含所有实际图片')

        elif status == 'display_issue':
            result['recommendations'].append('检查JavaScript轮播组件是否正确初始化')
            result['recommendations'].append('验证图片路径是否正确')
            result['recommendations'].append('清除浏览器缓存后重新测试')

        # 通用建议
        if result['details'].get('missing_count', 0) > 0:
            result['recommendations'].append('修复缺失的图片文件路径')

    def run_comprehensive_analysis(self):
        """运行全面分析"""
        print("=" * 80)
        print("🔍 开始全面诊断所有39个产品详情页")
        print("=" * 80)

        # 获取所有产品HTML文件
        html_files = glob.glob(os.path.join(PRODUCTS_DIR, "*.html"))
        self.summary['total_pages'] = len(html_files)

        print(f"\n📊 找到 {len(html_files)} 个产品页面，开始逐一分析...")

        for i, html_file in enumerate(sorted(html_files), 1):
            product_id = Path(html_file).stem
            print(f"\n[{i:2d}/{len(html_files)}] 分析: {product_id}")

            result = self.analyze_single_product(html_file)
            self.results[product_id] = result

            # 更新统计
            status = result['status']
            if status in ['single_image_ok', 'multi_image_ok']:
                self.summary['fully_working'] += 1
                print(f"  ✅ 状态: {status}")
            elif status == 'display_issue':
                self.summary['display_issues'] += 1
                print(f"  ⚠️  状态: {status}")
                print(f"      问题: {', '.join(result['issues'])}")
            elif status == 'no_images':
                self.summary['no_images'] += 1
                print(f"  📭 状态: {status}")
            elif 'config' in status or 'error' in status:
                self.summary['config_errors'] += 1
                print(f"  ❌ 状态: {status}")
                print(f"      问题: {', '.join(result['issues'])}")

        # 生成详细报告
        self.generate_detailed_report()

    def generate_detailed_report(self):
        """生成详细的诊断报告"""
        print("\n" + "=" * 80)
        print("📋 全面诊断报告")
        print("=" * 80)

        # 总体统计
        total = self.summary['total_pages']
        print(f"\n📊 总体统计:")
        print(f"   总页面数: {total}")
        print(f"   ✅ 完全正常: {self.summary['fully_working']} ({self.summary['fully_working']/total*100:.1f}%)")
        print(f"   ⚠️  显示异常: {self.summary['display_issues']} ({self.summary['display_issues']/total*100:.1f}%)")
        print(f"   ❌ 配置错误: {self.summary['config_errors']} ({self.summary['config_errors']/total*100:.1f}%)")
        print(f"   📭 无图片: {self.summary['no_images']} ({self.summary['no_images']/total*100:.1f}%)")

        # 按问题类型分组
        self.print_issues_by_category()

        # 高优先级修复列表
        self.print_priority_fixes()

        # 保存详细结果到JSON文件
        self.save_results_to_file()

    def print_issues_by_category(self):
        """按问题类型打印详细信息"""

        # 显示异常的产品（高优先级）
        display_issues = [r for r in self.results.values() if r['status'] == 'display_issue']
        if display_issues:
            print(f"\n🚨 显示异常的产品 ({len(display_issues)}个) - 高优先级修复:")
            for result in display_issues:
                print(f"   • {result['product_id']}")
                print(f"     实际图片: {result['details']['actual_images_count']}张")
                print(f"     配置图片: {result['details']['configured_images_count']}张")
                print(f"     问题: {', '.join(result['issues'])}")

        # 配置错误的产品
        config_errors = [r for r in self.results.values() if 'config' in r['status'] or 'error' in r['status']]
        if config_errors:
            print(f"\n⚙️ 配置错误的产品 ({len(config_errors)}个):")
            for result in config_errors:
                print(f"   • {result['product_id']}: {result['status']}")
                if result['issues']:
                    print(f"     问题: {', '.join(result['issues'])}")

        # 完全正常的产品
        working_products = [r for r in self.results.values() if r['status'] in ['single_image_ok', 'multi_image_ok']]
        if working_products:
            print(f"\n✅ 正常工作的产品 ({len(working_products)}个):")
            for result in working_products[:10]:  # 只显示前10个
                img_count = result['details']['actual_images_count']
                print(f"   • {result['product_id']}: {img_count}张图片")
            if len(working_products) > 10:
                print(f"   ... 还有 {len(working_products) - 10} 个正常产品")

    def print_priority_fixes(self):
        """打印优先修复建议"""
        print(f"\n🔧 修复优先级建议:")

        print(f"\n🚨 第一优先级 - 显示异常修复:")
        display_issues = [r for r in self.results.values() if r['status'] == 'display_issue']
        for result in display_issues:
            print(f"   • {result['product_id']}.html")
            for rec in result['recommendations']:
                print(f"     - {rec}")

        print(f"\n⚙️ 第二优先级 - 配置修复:")
        config_issues = [r for r in self.results.values() if 'missing_config' in r['status']]
        if config_issues:
            for result in config_issues[:5]:  # 只显示前5个
                print(f"   • {result['product_id']}.html: {result['status']}")

        print(f"\n🧹 第三优先级 - 清理优化:")
        print(f"   • 移除重复图片文件")
        print(f"   • 统一图片命名规范")
        print(f"   • 优化图片加载顺序")

    def save_results_to_file(self):
        """保存详细结果到文件"""
        output_file = os.path.join(os.path.dirname(PRODUCTS_DIR), 'scripts', 'diagnostic_results.json')

        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump({
                'summary': self.summary,
                'results': self.results,
                'generated_at': None  # 可以添加时间戳
            }, f, ensure_ascii=False, indent=2)

        print(f"\n💾 详细结果已保存到: {output_file}")

if __name__ == "__main__":
    diagnostic = ProductPageDiagnostic()
    diagnostic.run_comprehensive_analysis()