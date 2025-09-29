#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
综合产品页面审计工具
全方位检查39个产品页面的所有功能和问题
"""

import os
import re
import json
from bs4 import BeautifulSoup
from datetime import datetime

def main():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    products_dir = os.path.join(base_dir, 'products')
    images_dir = os.path.join(base_dir, 'images', 'products')

    print("🔍 开始全方位产品页面审计...")
    print(f"📅 审计时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("="*80)

    # 获取所有产品页面
    product_files = [f for f in os.listdir(products_dir) if f.endswith('.html')]

    print(f"📋 发现 {len(product_files)} 个产品页面")

    # 存储所有审计结果
    audit_results = {}

    # 逐个产品进行全面审计
    for i, filename in enumerate(sorted(product_files), 1):
        product_id = filename.replace('.html', '')
        print(f"\n[{i:2d}/{len(product_files)}] 🔍 审计产品: {product_id}")

        result = comprehensive_product_audit(product_id, products_dir, images_dir)
        audit_results[product_id] = result

        # 显示简要结果
        print_brief_result(product_id, result)

    # 生成详细报告
    generate_comprehensive_report(audit_results, base_dir)

    # 生成问题修复清单
    generate_fix_plan(audit_results, base_dir)

def comprehensive_product_audit(product_id, products_dir, images_dir):
    """对单个产品进行全面审计"""
    result = {
        'product_id': product_id,
        'audit_time': datetime.now().isoformat(),
        'file_exists': False,
        'html_structure': {},
        'image_analysis': {},
        'javascript_check': {},
        'carousel_analysis': {},
        'quote_function': {},
        'css_references': {},
        'issues': [],
        'severity': 'unknown',
        'fix_priority': 0
    }

    filepath = os.path.join(products_dir, f'{product_id}.html')

    # 检查文件是否存在
    if not os.path.exists(filepath):
        result['issues'].append({'type': 'critical', 'message': '产品文件不存在'})
        result['severity'] = 'critical'
        return result

    result['file_exists'] = True

    # 读取文件内容
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 解析HTML
    soup = BeautifulSoup(content, 'html.parser')

    # 1. HTML结构检查
    result['html_structure'] = check_html_structure(soup, content)

    # 2. 图片分析
    result['image_analysis'] = analyze_images(soup, content, images_dir)

    # 3. JavaScript检查
    result['javascript_check'] = check_javascript_references(content)

    # 4. 轮播功能分析
    result['carousel_analysis'] = analyze_carousel_config(soup, content, images_dir)

    # 5. 获取报价功能检查
    result['quote_function'] = check_quote_function(soup, content, product_id)

    # 6. CSS引用检查
    result['css_references'] = check_css_references(content)

    # 7. 综合问题分析
    result['issues'] = compile_issues(result)

    # 8. 确定严重程度和修复优先级
    result['severity'], result['fix_priority'] = assess_severity(result)

    return result

def check_html_structure(soup, content):
    """检查HTML结构完整性"""
    structure = {
        'has_main_image': False,
        'has_product_title': False,
        'has_product_info': False,
        'has_tabs_section': False,
        'has_cta_buttons': False,
        'unclosed_tags': [],
        'nested_issues': []
    }

    # 检查主要元素
    structure['has_main_image'] = bool(soup.find('img', class_='main-image'))
    structure['has_product_title'] = bool(soup.find('h1', class_='product-title'))
    structure['has_product_info'] = bool(soup.find('div', class_='product-info'))
    structure['has_tabs_section'] = bool(soup.find('section', class_='product-details-tabs-section'))
    structure['has_cta_buttons'] = bool(soup.find('div', class_='cta-section'))

    # 检查未闭合标签
    img_tags = re.findall(r'<img[^>]*(?<!/)>', content)
    for tag in img_tags:
        if not tag.endswith('/>') and '/>' not in tag:
            structure['unclosed_tags'].append(tag[:50] + '...' if len(tag) > 50 else tag)

    return structure

def analyze_images(soup, content, images_dir):
    """分析图片配置和文件存在性"""
    analysis = {
        'main_image_src': '',
        'data_images_config': '',
        'total_images_found': 0,
        'existing_images': [],
        'missing_images': [],
        'duplicate_images': [],
        'placeholder_issues': []
    }

    # 获取主图片
    main_img = soup.find('img', class_='main-image')
    if main_img:
        analysis['main_image_src'] = main_img.get('src', '')
        analysis['data_images_config'] = main_img.get('data-images', '')

    # 解析data-images中的图片
    if analysis['data_images_config']:
        images = [img.strip().replace('../images/products/', '')
                 for img in analysis['data_images_config'].split(',') if img.strip()]

        analysis['total_images_found'] = len(images)

        # 检查图片文件是否存在
        for img in images:
            img_path = os.path.join(images_dir, img)
            if os.path.exists(img_path):
                analysis['existing_images'].append(img)
            else:
                analysis['missing_images'].append(img)

        # 检查重复图片
        seen = set()
        for img in images:
            if img in seen:
                analysis['duplicate_images'].append(img)
            seen.add(img)

    # 检查placeholder问题
    if 'placeholder.jpg' in analysis['data_images_config']:
        analysis['placeholder_issues'].append('data-images包含placeholder.jpg')

    return analysis

def check_javascript_references(content):
    """检查JavaScript引用完整性"""
    js_check = {
        'required_scripts': [
            'multi-image-gallery.js',
            'product-database.js',
            'modal-components.js',
            'placeholder-randomizer.js'
        ],
        'found_scripts': [],
        'missing_scripts': [],
        'duplicate_scripts': []
    }

    # 查找所有script标签
    script_matches = re.findall(r'<script[^>]*src="([^"]*)"[^>]*>', content)

    for script_src in script_matches:
        script_name = script_src.split('/')[-1]
        js_check['found_scripts'].append(script_name)

    # 检查必需脚本
    for required in js_check['required_scripts']:
        if required not in js_check['found_scripts']:
            js_check['missing_scripts'].append(required)

    # 检查重复脚本
    seen = set()
    for script in js_check['found_scripts']:
        if script in seen:
            js_check['duplicate_scripts'].append(script)
        seen.add(script)

    return js_check

def analyze_carousel_config(soup, content, images_dir):
    """分析轮播配置和功能"""
    carousel = {
        'has_data_images': False,
        'images_count': 0,
        'should_have_carousel': False,
        'has_carousel_class': False,
        'has_thumbnails_container': False,
        'config_issues': []
    }

    main_img = soup.find('img', class_='main-image')
    if main_img:
        data_images = main_img.get('data-images', '')
        carousel['has_data_images'] = bool(data_images)

        if data_images:
            images = [img.strip() for img in data_images.split(',') if img.strip()]
            carousel['images_count'] = len(images)
            carousel['should_have_carousel'] = carousel['images_count'] > 1

        # 检查是否有data-placeholder属性
        if main_img.get('data-placeholder') == 'true':
            carousel['config_issues'].append('配置为占位符产品')

    # 检查轮播相关元素
    carousel['has_carousel_class'] = 'multi-image-gallery' in content
    carousel['has_thumbnails_container'] = bool(soup.find('div', class_='image-thumbnails-container'))

    # 检查配置问题
    if carousel['images_count'] == 1 and carousel['has_carousel_class']:
        carousel['config_issues'].append('单图片不应启用轮播')

    if carousel['images_count'] > 1 and not carousel['has_carousel_class']:
        carousel['config_issues'].append('多图片应启用轮播')

    return carousel

def check_quote_function(soup, content, product_id):
    """检查获取报价功能"""
    quote = {
        'has_quote_button': False,
        'button_onclick': '',
        'product_id_correct': False,
        'has_modal_script': False,
        'potential_image_issues': []
    }

    # 查找获取报价按钮
    quote_buttons = soup.find_all('button', string=re.compile(r'获取报价|报价'))
    if quote_buttons:
        quote['has_quote_button'] = True
        for btn in quote_buttons:
            onclick = btn.get('onclick', '')
            quote['button_onclick'] = onclick

            # 检查product_id是否正确
            if product_id in onclick:
                quote['product_id_correct'] = True

    # 检查modal脚本
    quote['has_modal_script'] = 'modal-components.js' in content

    # 检查可能的图片问题（路径相关）
    if '../images/' in content and quote['has_quote_button']:
        # 获取报价功能可能使用图片路径，检查路径一致性
        main_img = soup.find('img', class_='main-image')
        if main_img:
            img_src = main_img.get('src', '')
            if img_src.startswith('../images/'):
                quote['potential_image_issues'].append('图片路径可能影响报价显示')

    return quote

def check_css_references(content):
    """检查CSS引用"""
    css_check = {
        'required_css': [
            'multi-image-gallery.css',
            'product-detail-modern.css',
            'product-placeholder.css'
        ],
        'found_css': [],
        'missing_css': []
    }

    # 查找CSS引用
    css_matches = re.findall(r'<link[^>]*href="([^"]*\.css)"[^>]*>', content)

    for css_href in css_matches:
        css_name = css_href.split('/')[-1].split('?')[0]  # 去除版本号
        css_check['found_css'].append(css_name)

    # 检查必需CSS
    for required in css_check['required_css']:
        if required not in css_check['found_css']:
            css_check['missing_css'].append(required)

    return css_check

def compile_issues(result):
    """编译所有发现的问题"""
    issues = []

    # HTML结构问题
    html = result['html_structure']
    if not html['has_main_image']:
        issues.append({'type': 'critical', 'category': 'html', 'message': '缺少主图片元素'})
    if html['unclosed_tags']:
        issues.append({'type': 'warning', 'category': 'html', 'message': f'发现{len(html["unclosed_tags"])}个未闭合的img标签'})

    # 图片问题
    img = result['image_analysis']
    if img['missing_images']:
        issues.append({'type': 'critical', 'category': 'images', 'message': f'缺失图片文件: {", ".join(img["missing_images"])}'})
    if img['placeholder_issues']:
        issues.append({'type': 'warning', 'category': 'images', 'message': '轮播配置包含placeholder.jpg'})
    if img['duplicate_images']:
        issues.append({'type': 'info', 'category': 'images', 'message': f'重复图片: {", ".join(img["duplicate_images"])}'})

    # JavaScript问题
    js = result['javascript_check']
    if js['missing_scripts']:
        issues.append({'type': 'critical', 'category': 'javascript', 'message': f'缺少JS文件: {", ".join(js["missing_scripts"])}'})

    # 轮播问题
    carousel = result['carousel_analysis']
    if carousel['config_issues']:
        for issue in carousel['config_issues']:
            issues.append({'type': 'warning', 'category': 'carousel', 'message': issue})

    # 报价功能问题
    quote = result['quote_function']
    if not quote['has_quote_button']:
        issues.append({'type': 'warning', 'category': 'quote', 'message': '缺少获取报价按钮'})
    elif not quote['product_id_correct']:
        issues.append({'type': 'critical', 'category': 'quote', 'message': '报价按钮product_id不正确'})
    if quote['potential_image_issues']:
        issues.append({'type': 'warning', 'category': 'quote', 'message': '报价功能可能存在图片显示问题'})

    return issues

def assess_severity(result):
    """评估问题严重程度和修复优先级"""
    critical_count = len([i for i in result['issues'] if i['type'] == 'critical'])
    warning_count = len([i for i in result['issues'] if i['type'] == 'warning'])

    if critical_count > 0:
        severity = 'critical'
        priority = 1
    elif warning_count > 2:
        severity = 'high'
        priority = 2
    elif warning_count > 0:
        severity = 'medium'
        priority = 3
    else:
        severity = 'low'
        priority = 4

    return severity, priority

def print_brief_result(product_id, result):
    """打印简要审计结果"""
    severity_icons = {
        'critical': '🔴',
        'high': '🟠',
        'medium': '🟡',
        'low': '🟢',
        'unknown': '⚪'
    }

    icon = severity_icons.get(result['severity'], '⚪')
    issue_count = len(result['issues'])

    print(f"   {icon} {result['severity'].upper()} - {issue_count}个问题")

    # 显示最严重的问题
    critical_issues = [i for i in result['issues'] if i['type'] == 'critical']
    if critical_issues:
        print(f"      🚨 关键问题: {critical_issues[0]['message']}")

def generate_comprehensive_report(audit_results, base_dir):
    """生成详细审计报告"""
    report_path = os.path.join(base_dir, 'audit-report.json')

    # 统计信息
    total_products = len(audit_results)
    critical_products = len([r for r in audit_results.values() if r['severity'] == 'critical'])
    high_products = len([r for r in audit_results.values() if r['severity'] == 'high'])

    summary = {
        'audit_summary': {
            'total_products': total_products,
            'critical_issues': critical_products,
            'high_priority': high_products,
            'audit_time': datetime.now().isoformat()
        },
        'detailed_results': audit_results
    }

    with open(report_path, 'w', encoding='utf-8') as f:
        json.dump(summary, f, ensure_ascii=False, indent=2)

    print(f"\n📄 详细报告已保存到: {report_path}")

def generate_fix_plan(audit_results, base_dir):
    """生成修复计划"""
    fix_plan_path = os.path.join(base_dir, 'fix-plan.md')

    # 按优先级分组
    priority_groups = {1: [], 2: [], 3: [], 4: []}
    for product_id, result in audit_results.items():
        priority_groups[result['fix_priority']].append((product_id, result))

    with open(fix_plan_path, 'w', encoding='utf-8') as f:
        f.write("# 产品页面修复计划\n\n")
        f.write(f"生成时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n")

        priority_names = {1: '🔴 关键优先级', 2: '🟠 高优先级', 3: '🟡 中优先级', 4: '🟢 低优先级'}

        for priority in [1, 2, 3, 4]:
            products = priority_groups[priority]
            if products:
                f.write(f"## {priority_names[priority]} ({len(products)}个产品)\n\n")

                for product_id, result in products:
                    f.write(f"### {product_id}\n")
                    f.write(f"- 严重程度: {result['severity']}\n")
                    f.write(f"- 问题数量: {len(result['issues'])}\n")
                    f.write("- 问题清单:\n")

                    for issue in result['issues']:
                        f.write(f"  - **{issue['type'].upper()}** [{issue['category']}]: {issue['message']}\n")

                    f.write("\n")

        # 修复建议
        f.write("## 修复建议\n\n")
        f.write("1. **立即处理关键问题**: 影响核心功能的产品\n")
        f.write("2. **批量修复配置问题**: JavaScript引用、图片路径等\n")
        f.write("3. **测试验证**: 每修复一个产品立即测试\n")
        f.write("4. **质量保证**: 确保修复不引入新问题\n")

    print(f"📋 修复计划已保存到: {fix_plan_path}")

if __name__ == '__main__':
    main()