#!/usr/bin/env python3
"""
产品图片智能复制脚本
从新的图片目录复制图片到项目中，避免与现有图片冲突
"""

import os
import shutil
import re
from pathlib import Path

# 路径配置
NEW_IMAGES_BASE = r"C:\Users\Administrator\Desktop\web\（提取图片）义德隆企业简介\产品"
TARGET_IMAGES_DIR = r"D:\ai\新建文件夹\新建文件夹\7788\images\products"

# 产品名称映射表（中文 -> 英文产品ID）
PRODUCT_MAPPING = {
    # 定型耐火制品
    "黏土砖": "heavy-clay-brick",
    "高铝砖": "standard-high-alumina-brick",
    "半硅砖": "semi-silica-brick",
    "硅砖": "general-silica-brick",
    "一般硅砖": "standard-silica-brick",
    "焦炉用硅砖": "coke-oven-brick",
    "热风炉用硅砖": "hot-blast-stove-silica-brick",
    "热风炉用格子硅砖": "hot-blast-stove-checker-silica-brick",
    "热风炉用黏土格子硅砖": "hot-blast-stove-clay-checker-brick",
    "烧结莫来石砖": "mullite-brick",
    "硅莫砖": "silica-molybdenum-brick",
    "轻质高铝砖": "lightweight-high-alumina-brick",
    "轻质莫来石砖": "lightweight-mullite-brick",
    "轻质黏土砖": "lightweight-clay-brick",
    "轻质粘土砖": "lightweight-clay-brick",
    "高铝聚轻砖": "alumina-hollow-sphere-brick",
    "莫来石聚轻砖": "lightweight-mullite-brick",
    "组合砖": "phosphate-brick",

    # 不定型耐火材料
    "不定型耐材料": "refractory-spray-coating",
    "不定型耐火材料": "plastic-refractory",
    "刚玉质耐火浇注料": "alumina-castable",
    "高铝系列耐火浇注料": "lightweight-castable",
    "钢纤维耐磨浇注料": "steel-fiber-castable",
    "铬刚玉浇注料": "chrome-corundum-castable",
    "刚玉碳化硅质耐火浇注料（预制件）": "refractory-castable",
    "高炉陶瓷杯用耐火材料": "blast-furnace-ceramic-cup",
    "高炉、热风炉系统耐火喷涂料": "refractory-spray-coating",

    # 特种耐火制品
    "刚玉砖": "corundum-brick",
    "刚玉耐火球": "corundum-ball",
    "刚玉莫来石": "corundum-mullite",
    "氧化铝空心球砖": "alumina-hollow-sphere-brick",
    "磷酸盐砖": "phosphate-brick",
    "磷酸盐耐磨砖": "phosphate-wear-resistant-brick",
    "镁铬砖": "magnesia-chrome-brick",
    "耐磨陶瓷": "wear-resistant-ceramic",

    # 轻质保温制品
    "陶瓷蜂窝蓄热体": "thermal-insulation-brick",
}

def clean_filename(filename):
    """清理文件名，移除特殊字符"""
    # 移除或替换特殊字符
    cleaned = re.sub(r'[^\w\-_.]', '', filename)
    return cleaned

def copy_product_images():
    """复制产品图片到目标目录"""
    copied_count = 0

    # 确保目标目录存在
    os.makedirs(TARGET_IMAGES_DIR, exist_ok=True)

    # 遍历所有分类目录
    categories = [
        "01-定型耐火制品_shaped",
        "02-不定型耐火材料_unshaped",
        "03-特种耐火制品_special",
        "04-轻质保温制品_lightweight"
    ]

    for category in categories:
        category_path = os.path.join(NEW_IMAGES_BASE, category)
        if not os.path.exists(category_path):
            print(f"分类目录不存在: {category}")
            continue

        print(f"\n处理分类: {category}")

        # 遍历每个产品子目录
        for product_dir in os.listdir(category_path):
            product_path = os.path.join(category_path, product_dir)
            if not os.path.isdir(product_path):
                continue

            # 查找对应的英文产品ID
            english_product_id = PRODUCT_MAPPING.get(product_dir)
            if not english_product_id:
                print(f"  未找到映射: {product_dir}")
                continue

            print(f"  处理产品: {product_dir} -> {english_product_id}")

            # 获取该产品目录下的所有图片
            image_files = []
            for file in os.listdir(product_path):
                if file.lower().endswith(('.png', '.jpg', '.jpeg')):
                    image_files.append(file)

            if not image_files:
                print(f"    无图片文件")
                continue

            # 复制图片（最多3张）
            for i, image_file in enumerate(image_files[:3]):
                source_path = os.path.join(product_path, image_file)

                # 生成新的文件名
                file_ext = Path(image_file).suffix.lower()
                new_filename = f"{english_product_id}-official-{i+1}{file_ext}"
                target_path = os.path.join(TARGET_IMAGES_DIR, new_filename)

                # 检查是否已存在
                if os.path.exists(target_path):
                    print(f"    跳过已存在: {new_filename}")
                    continue

                try:
                    shutil.copy2(source_path, target_path)
                    print(f"    复制: {image_file} -> {new_filename}")
                    copied_count += 1
                except Exception as e:
                    print(f"    复制失败: {image_file} - {e}")

    print(f"\n总共复制了 {copied_count} 张图片")

def generate_image_mapping():
    """生成产品图片映射表"""
    print("\n=== 生成图片映射表 ===")

    mapping = {}

    # 扫描目标目录中的所有图片
    for filename in os.listdir(TARGET_IMAGES_DIR):
        if not filename.lower().endswith(('.png', '.jpg', '.jpeg')):
            continue

        # 提取产品ID
        for product_id in PRODUCT_MAPPING.values():
            if filename.startswith(product_id):
                if product_id not in mapping:
                    mapping[product_id] = []
                mapping[product_id].append(filename)
                break

    # 输出映射结果
    print("\n产品图片映射结果:")
    for product_id, images in sorted(mapping.items()):
        print(f"{product_id}: {len(images)}张图片")
        for img in images:
            print(f"  - {img}")

    return mapping

if __name__ == "__main__":
    print("开始复制产品图片...")
    copy_product_images()

    print("\n生成图片映射...")
    generate_image_mapping()

    print("\n复制完成！")