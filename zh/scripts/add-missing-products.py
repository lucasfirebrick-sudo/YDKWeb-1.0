#!/usr/bin/env python3
"""
添加缺失的产品数据库条目
"""

import os
import re

DATABASE_FILE = r"D:\ai\新建文件夹\新建文件夹\7788\js\product-database.js"

# 需要添加的产品条目
MISSING_PRODUCTS = {
    'general-silica-brick': {
        'name': '一般硅砖',
        'englishName': 'General Silica Brick',
        'category': 'shaped',
        'subcategory': 'silica-series',
        'specs': {
            'SiO2': '≥94%',
            'refractoriness': '≥1690℃'
        },
        'features': ['经济实用的硅质耐火材料', '良好的抗酸性渣侵蚀能力', '适用于多种工业窑炉'],
        'applications': ['建材工业：陶瓷窑炉', '有色金属：铜熔炼炉', '化工工业：各类反应炉']
    },

    'standard-silica-brick': {
        'name': '标准硅砖',
        'englishName': 'Standard Silica Brick',
        'category': 'shaped',
        'subcategory': 'silica-series',
        'specs': {
            'SiO2': '≥96%',
            'refractoriness': '≥1700℃'
        },
        'features': ['标准化生产，质量稳定', '高温强度优异', '线膨胀系数小'],
        'applications': ['钢铁工业：焦炉、玻璃窑炉', '建材工业：陶瓷烧成设备', '化工工业：高温反应器']
    },

    'semi-silica-brick': {
        'name': '半硅砖',
        'englishName': 'Semi-Silica Brick',
        'category': 'shaped',
        'subcategory': 'silica-series',
        'specs': {
            'SiO2': '65-85%',
            'refractoriness': '≥1650℃'
        },
        'features': ['兼具硅砖和黏土砖的优点', '成本较低，性能良好', '适应性强'],
        'applications': ['钢铁工业：加热炉、均热炉', '建材工业：水泥窑炉', '有色金属：熔炼设备']
    },

    'coke-oven-brick': {
        'name': '焦炉砖',
        'englishName': 'Coke Oven Brick',
        'category': 'shaped',
        'subcategory': 'silica-series',
        'specs': {
            'SiO2': '≥95%',
            'refractoriness': '≥1710℃'
        },
        'features': ['专用于焦炉建设', '抗煤气侵蚀能力强', '长期使用稳定'],
        'applications': ['钢铁工业：焦炉炭化室', '焦化工业：焦炉蓄热室', '相关高温煤气设备']
    },

    'heavy-clay-brick': {
        'name': '重质黏土砖',
        'englishName': 'Heavy Clay Brick',
        'category': 'shaped',
        'subcategory': 'clay-series',
        'specs': {
            'Al2O3': '30-42%',
            'refractoriness': '≥1670℃'
        },
        'features': ['体积密度高，强度大', '抗侵蚀性能好', '经济实用'],
        'applications': ['钢铁工业：高炉、转炉', '建材工业：水泥窑', '化工工业：各类工业炉']
    },

    'standard-high-alumina-brick': {
        'name': '标准高铝砖',
        'englishName': 'Standard High Alumina Brick',
        'category': 'shaped',
        'subcategory': 'alumina-series',
        'specs': {
            'Al2O3': '≥75%',
            'refractoriness': '≥1790℃'
        },
        'features': ['标准化生产的高铝砖', '耐火度高，强度大', '质量稳定可靠'],
        'applications': ['钢铁工业：高炉、热风炉', '水泥工业：回转窑', '玻璃工业：熔窑关键部位']
    },

    'hot-blast-stove-checker-silica-brick': {
        'name': '热风炉格子硅砖',
        'englishName': 'Hot Blast Stove Checker Silica Brick',
        'category': 'shaped',
        'subcategory': 'silica-series',
        'specs': {
            'SiO2': '≥96%',
            'refractoriness': '≥1720℃'
        },
        'features': ['专用于热风炉格子砖', '高温体积稳定', '传热性能优异'],
        'applications': ['钢铁工业：高炉热风炉格子', '相关高温蓄热设备', '热交换系统']
    },

    'hot-blast-stove-clay-checker-brick': {
        'name': '热风炉黏土格子砖',
        'englishName': 'Hot Blast Stove Clay Checker Brick',
        'category': 'shaped',
        'subcategory': 'clay-series',
        'specs': {
            'Al2O3': '35-45%',
            'refractoriness': '≥1680℃'
        },
        'features': ['专用于热风炉黏土格子', '成本较低', '热震稳定性好'],
        'applications': ['钢铁工业：高炉热风炉', '热风炉蓄热室', '相关蓄热设备']
    },

    'lightweight-silica-brick': {
        'name': '轻质硅砖',
        'englishName': 'Lightweight Silica Brick',
        'category': 'lightweight',
        'subcategory': 'silica-series',
        'specs': {
            'SiO2': '≥90%',
            'bulkDensity': '≤1.2 g/cm³'
        },
        'features': ['轻质保温性能优异', '导热系数低', '节能效果显著'],
        'applications': ['保温炉衬', '隔热层应用', '节能改造项目']
    },

    'insulating-brick': {
        'name': '隔热砖',
        'englishName': 'Insulating Brick',
        'category': 'lightweight',
        'subcategory': 'insulating-series',
        'specs': {
            'bulkDensity': '≤1.0 g/cm³',
            'thermalConductivity': '≤0.5 W/m·K'
        },
        'features': ['优异的隔热保温性能', '轻质节能', '施工便利'],
        'applications': ['炉体保温层', '管道保温', '工业节能改造']
    },

    'insulating-material': {
        'name': '保温材料',
        'englishName': 'Insulating Material',
        'category': 'lightweight',
        'subcategory': 'insulating-series',
        'specs': {
            'thermalConductivity': '≤0.3 W/m·K',
            'serviceTemperature': '≤1200℃'
        },
        'features': ['多种保温材料选择', '适应不同温度需求', '安装便利'],
        'applications': ['工业炉保温', '高温管道保温', '设备隔热']
    },

    'wear-resistant-ceramic': {
        'name': '耐磨陶瓷',
        'englishName': 'Wear Resistant Ceramic',
        'category': 'special',
        'subcategory': 'ceramic-series',
        'specs': {
            'hardness': '≥85 HRA',
            'wearResistance': '优异'
        },
        'features': ['超高耐磨性能', '化学稳定性好', '使用寿命长'],
        'applications': ['矿物加工设备', '钢铁工业：输送设备', '电力工业：制粉系统']
    }
}

def add_missing_products():
    """添加缺失的产品条目"""

    with open(DATABASE_FILE, 'r', encoding='utf-8') as f:
        content = f.read()

    # 为每个缺失的产品生成条目
    for product_id, data in MISSING_PRODUCTS.items():
        # 检查是否已存在
        if f"'{product_id}':" in content:
            print(f"产品 {product_id} 已存在，跳过")
            continue

        # 生成产品条目
        specs_str = ", ".join([
            f"'{key}': {{ value: '{value}', unit: '{value.split()[-1]}', label: '{key}' }}"
            for key, value in data['specs'].items()
        ])

        features_str = "', '".join(data['features'])
        applications_str = "', '".join(data['applications'])

        product_entry = f"""
            '{product_id}': {{
                name: '{data['name']}', englishName: '{data['englishName']}', category: '{data['category']}', subcategory: '{data['subcategory']}',
                specifications: {{ {specs_str} }},
                features: ['{features_str}'],
                applications: ['{applications_str}'],
                documents: {{ technicalSpec: {{ available: false, filename: '{product_id}-tech-spec.pdf', description: '{data['name']}技术规格表' }} }}
            }},"""

        print(f"准备添加产品: {product_id} - {data['name']}")

        # 找到合适的位置插入
        if data['category'] == 'shaped':
            if 'silica-series' in data['subcategory']:
                # 在硅质系列最后添加
                pattern = r"(// 莫来石系列)"
                content = re.sub(pattern, product_entry + r"\n\n            \1", content)
            elif 'clay-series' in data['subcategory']:
                # 在粘土系列最后添加
                pattern = r"(// 硅质系列)"
                content = re.sub(pattern, product_entry + r"\n\n            \1", content)
            elif 'alumina-series' in data['subcategory']:
                # 在高铝系列最后添加
                pattern = r"(// 粘土系列)"
                content = re.sub(pattern, product_entry + r"\n\n            \1", content)
        elif data['category'] == 'lightweight':
            # 在轻质系列最后添加
            pattern = r"(// 特种耐火材料)"
            content = re.sub(pattern, product_entry + r"\n\n            \1", content)
        elif data['category'] == 'special':
            # 在特种系列最后添加
            pattern = r"(\s*}\s*;\s*$)"
            content = re.sub(pattern, product_entry + r"\n        \1", content)

    # 写回文件
    with open(DATABASE_FILE, 'w', encoding='utf-8') as f:
        f.write(content)

    print("所有缺失产品已添加到数据库")

if __name__ == "__main__":
    add_missing_products()