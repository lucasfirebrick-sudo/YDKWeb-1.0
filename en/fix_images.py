#!/usr/bin/env python3
"""
Script to systematically fix image path issues in English product detail pages
Following the successful pattern established with lightweight-silica-brick.html
"""

import os
import re
import glob

def fix_image_paths():
    # Define the mappings
    high_priority_mappings = {
        "high-alumina-brick-main.jpg": "high-alumina-brick-real.png",
        "clay-brick-main.jpg": "clay-brick-real.png",
        "silica-brick-main.jpg": "silica-brick-real.png",
        "general-silica-brick-main.jpg": "general-silica-brick-official-1.png",
        "hot-blast-stove-silica-brick-main.jpg": "hot-blast-stove-silica-brick-official-1.png"
    }

    # Pattern-based mappings for subdirectory structure removal
    pattern_mappings = {
        # High Alumina Brick patterns
        "high-alumina-brick/high-alumina-brick-application.jpg": "shaped_high_alumina_brick.jpg",
        "high-alumina-brick/high-alumina-brick-testing.jpg": "standard-high-alumina-brick-official-1.png",
        "high-alumina-brick/high-alumina-brick-production.jpg": "standard-high-alumina-brick-official-2.png",

        # Clay Brick patterns
        "clay-brick/clay-brick-application.jpg": "shaped_clay_brick.jpg",
        "clay-brick/clay-brick-specifications.jpg": "heavy-clay-brick-official-1.png",
        "clay-brick/clay-brick-quality.jpg": "heavy-clay-brick-official-2.png",

        # Silica Brick patterns
        "silica-brick/silica-brick-thumb.jpg": "silica-brick-real.png",
        "general-silica-brick/general-silica-brick-thumb.jpg": "general-silica-brick-official-1.png",

        # Lightweight patterns
        "lightweight-high-alumina-brick/lightweight-high-alumina-brick-thumb.jpg": "lightweight-high-alumina-brick-official-1.png",
        "insulating-brick/insulating-brick-thumb.jpg": "insulating-fire-brick.jpg",
        "refractory-castable/refractory-castable-thumb.jpg": "unshaped_monolithic_refractory.jpg",
    }

    # Get all HTML files
    products_dir = "D:/ai/新建文件夹/新建文件夹/7788-en/products/"
    html_files = glob.glob(os.path.join(products_dir, "*.html"))

    # Exclude the already fixed file
    html_files = [f for f in html_files if not f.endswith("lightweight-silica-brick.html")]

    print(f"Found {len(html_files)} HTML files to process")

    for file_path in html_files:
        print(f"Processing: {os.path.basename(file_path)}")

        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()

            original_content = content

            # Apply high priority mappings
            for old_path, new_path in high_priority_mappings.items():
                content = content.replace(f"../images/products/{old_path}", f"../images/products/{new_path}")

            # Apply pattern mappings
            for old_path, new_path in pattern_mappings.items():
                content = content.replace(f"../images/products/{old_path}", f"../images/products/{new_path}")

            # Check if any changes were made
            if content != original_content:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f"  ✓ Updated {os.path.basename(file_path)}")
            else:
                print(f"  - No changes needed for {os.path.basename(file_path)}")

        except Exception as e:
            print(f"  ✗ Error processing {os.path.basename(file_path)}: {e}")

if __name__ == "__main__":
    fix_image_paths()
    print("Image path fixing complete!")