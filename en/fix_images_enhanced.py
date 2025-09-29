#!/usr/bin/env python3
"""
Enhanced script to fix remaining image path issues in English product detail pages
Handles all subdirectory references and pattern-based mappings
"""

import os
import re
import glob

def fix_remaining_image_paths():
    # Extended mappings for all remaining subdirectory patterns
    extensive_mappings = {
        # Main product subdirectories - handle all product-name/product-name-* patterns

        # Special/Unshaped product mappings
        "alumina-castable/alumina-castable-thumb.jpg": "alumina-castable-official-1.png",
        "alumina-castable/alumina-castable-application.jpg": "unshaped_high_alumina_castable.jpg",
        "alumina-castable/alumina-castable-testing.jpg": "alumina-castable-official-2.png",
        "alumina-castable/alumina-castable-production.jpg": "unshaped_corundum_castable.jpg",

        # Hollow sphere mappings
        "alumina-hollow-sphere-brick/alumina-hollow-sphere-brick-thumb.jpg": "alumina-hollow-sphere-brick-official-1.png",
        "alumina-hollow-sphere-brick/alumina-hollow-sphere-brick-application.jpg": "special_alumina_hollow_sphere_brick.jpg",
        "alumina-hollow-sphere-brick/alumina-hollow-sphere-brick-testing.jpg": "alumina-hollow-sphere-brick-official-2.png",
        "alumina-hollow-sphere-brick/alumina-hollow-sphere-brick-production.jpg": "alumina-hollow-sphere-brick-1.png",

        # Blast furnace ceramic cup
        "blast-furnace-ceramic-cup/blast-furnace-ceramic-cup-thumb.jpg": "blast-furnace-ceramic-cup-official-1.png",
        "blast-furnace-ceramic-cup/blast-furnace-ceramic-cup-application.jpg": "unshaped_blast_furnace_ceramic_cup.jpg",
        "blast-furnace-ceramic-cup/blast-furnace-ceramic-cup-testing.jpg": "blast-furnace-ceramic-cup-official-2.png",

        # Chrome corundum castable
        "chrome-corundum-castable/chrome-corundum-castable-thumb.jpg": "chrome-corundum-castable-official-1.png",
        "chrome-corundum-castable/chrome-corundum-castable-application.jpg": "unshaped_chrome_corundum_castable.jpg",

        # Corundum products
        "corundum-ball/corundum-ball-thumb.jpg": "corundum-ball-official-1.png",
        "corundum-ball/corundum-ball-application.jpg": "special_corundum_ball.jpg",
        "corundum-ball/corundum-ball-testing.jpg": "corundum-ball-official-2.png",
        "corundum-ball/corundum-ball-production.jpg": "special_regenerator_ball.jpg",

        "corundum-brick/corundum-brick-thumb.jpg": "corundum-brick-official-1.png",
        "corundum-brick/corundum-brick-application.jpg": "special_corundum_brick.jpg",
        "corundum-brick/corundum-brick-testing.jpg": "corundum-brick-official-2.png",

        "corundum-mullite/corundum-mullite-thumb.jpg": "corundum-mullite-official-1.png",
        "corundum-mullite/corundum-mullite-application.jpg": "special_corundum_mullite.jpg",
        "corundum-mullite/corundum-mullite-testing.jpg": "corundum-mullite-official-2.png",

        # Hot blast stove products
        "hot-blast-stove-checker-silica-brick/hot-blast-stove-checker-silica-brick-thumb.jpg": "hot-blast-stove-silica-brick-official-1.png",
        "hot-blast-stove-checker-silica-brick/hot-blast-stove-checker-silica-brick-application.jpg": "shaped_hot_blast_furnace_silica_brick.jpg",
        "hot-blast-stove-checker-silica-brick/hot-blast-stove-checker-silica-brick-testing.jpg": "hot-blast-stove-silica-brick-official-2.png",
        "hot-blast-stove-checker-silica-brick/hot-blast-stove-checker-silica-brick-production.jpg": "hot-blast-stove-silica-brick-official-3.png",

        "hot-blast-stove-clay-checker-brick/hot-blast-stove-clay-checker-brick-thumb.jpg": "heavy-clay-brick-official-1.png",
        "hot-blast-stove-clay-checker-brick/hot-blast-stove-clay-checker-brick-application.jpg": "shaped_clay_brick.jpg",
        "hot-blast-stove-clay-checker-brick/hot-blast-stove-clay-checker-brick-testing.jpg": "heavy-clay-brick-official-2.png",

        "hot-blast-stove-silica-brick/hot-blast-stove-silica-brick-thumb.jpg": "hot-blast-stove-silica-brick-official-1.png",
        "hot-blast-stove-silica-brick/hot-blast-stove-silica-brick-application.jpg": "shaped_hot_blast_furnace_silica_brick.jpg",
        "hot-blast-stove-silica-brick/hot-blast-stove-silica-brick-testing.jpg": "hot-blast-stove-silica-brick-official-2.png",
        "hot-blast-stove-silica-brick/hot-blast-stove-silica-brick-production.jpg": "hot-blast-stove-silica-brick-official-3.png",

        # Lightweight products
        "lightweight-castable/lightweight-castable-thumb.jpg": "lightweight-castable-official-1.png",
        "lightweight-castable/lightweight-castable-application.jpg": "unshaped_high_alumina_castable.jpg",

        "lightweight-clay-brick/lightweight-clay-brick-thumb.jpg": "lightweight-clay-brick-official-1.png",
        "lightweight-clay-brick/lightweight-clay-brick-application.jpg": "shaped_lightweight_clay_brick.jpg",
        "lightweight-clay-brick/lightweight-clay-brick-testing.jpg": "lightweight-clay-brick-official-2.png",
        "lightweight-clay-brick/lightweight-clay-brick-production.jpg": "lightweight-clay-brick-official-3.png",

        "lightweight-high-alumina-brick/lightweight-high-alumina-brick-thumb.jpg": "lightweight-high-alumina-brick-official-1.png",
        "lightweight-high-alumina-brick/lightweight-high-alumina-brick-application.jpg": "shaped_lightweight_high_alumina_brick.jpg",
        "lightweight-high-alumina-brick/lightweight-high-alumina-brick-testing.jpg": "lightweight-high-alumina-brick-official-2.png",
        "lightweight-high-alumina-brick/lightweight-high-alumina-brick-production.jpg": "shaped_high_alumina_light_brick.jpg",

        "lightweight-mullite-brick/lightweight-mullite-brick-thumb.jpg": "lightweight-mullite-brick-official-1.png",
        "lightweight-mullite-brick/lightweight-mullite-brick-application.jpg": "shaped_lightweight_mullite_brick.jpg",
        "lightweight-mullite-brick/lightweight-mullite-brick-testing.jpg": "lightweight-mullite-brick-official-2.png",
        "lightweight-mullite-brick/lightweight-mullite-brick-production.jpg": "shaped_mullite_light_brick.jpg",

        # Magnesia chrome
        "magnesia-chrome-brick/magnesia-chrome-brick-thumb.jpg": "magnesia-chrome-brick-official-1.png",
        "magnesia-chrome-brick/magnesia-chrome-brick-application.jpg": "special_magnesia_chrome_brick.jpg",
        "magnesia-chrome-brick/magnesia-chrome-brick-testing.jpg": "magnesia-chrome-brick-official-2.png",

        # Mullite brick
        "mullite-brick/mullite-brick-thumb.jpg": "mullite-brick-official-1.png",
        "mullite-brick/mullite-brick-application.jpg": "shaped_silica_mullite_brick.jpg",
        "mullite-brick/mullite-brick-testing.jpg": "mullite-brick-official-2.png",
        "mullite-brick/mullite-brick-production.jpg": "mullite-brick-official-3.png",

        # Phosphate products
        "phosphate-brick/phosphate-brick-thumb.jpg": "phosphate-brick-official-1.png",
        "phosphate-brick/phosphate-brick-application.jpg": "special_phosphate_brick.jpg",
        "phosphate-brick/phosphate-brick-testing.jpg": "phosphate-brick-1.png",

        "phosphate-wear-resistant-brick/phosphate-wear-resistant-brick-thumb.jpg": "phosphate-wear-resistant-brick-official-1.png",
        "phosphate-wear-resistant-brick/phosphate-wear-resistant-brick-application.jpg": "special_phosphate_wear_resistant_brick.jpg",
        "phosphate-wear-resistant-brick/phosphate-wear-resistant-brick-testing.jpg": "phosphate-wear-resistant-brick-official-2.png",

        # Plastic refractory
        "plastic-refractory/plastic-refractory-thumb.jpg": "plastic-refractory-official-1.png",
        "plastic-refractory/plastic-refractory-application.jpg": "plastic-refractory-official-2.png",
        "plastic-refractory/plastic-refractory-testing.jpg": "plastic-refractory-official-3.png",

        # Refractory castable
        "refractory-castable/refractory-castable-thumb.jpg": "unshaped_monolithic_refractory.jpg",
        "refractory-castable/refractory-castable-application.jpg": "unshaped_high_alumina_castable.jpg",
        "refractory-castable/refractory-castable-testing.jpg": "unshaped_corundum_castable.jpg",
        "refractory-castable/refractory-castable-production.jpg": "unshaped_steel_fiber_castable.jpg",

        # Silica products
        "silica-brick/silica-brick-thumb.jpg": "silica-brick-real.png",
        "silica-brick/silica-brick-application.jpg": "shaped_silica_brick.jpg",
        "general-silica-brick/general-silica-brick-thumb.jpg": "general-silica-brick-official-1.png",
        "general-silica-brick/general-silica-brick-application.jpg": "general-silica-brick-official-2.png",

        "silica-molybdenum-brick/silica-molybdenum-brick-thumb.jpg": "silica-molybdenum-brick-official-1.png",
        "silica-molybdenum-brick/silica-molybdenum-brick-application.jpg": "silica-molybdenum-brick-official-2.png",

        "standard-high-alumina-brick/standard-high-alumina-brick-thumb.jpg": "standard-high-alumina-brick-official-1.png",
        "standard-high-alumina-brick/standard-high-alumina-brick-application.jpg": "standard-high-alumina-brick-official-2.png",

        "standard-silica-brick/standard-silica-brick-thumb.jpg": "shaped_silica_brick.jpg",
        "standard-silica-brick/standard-silica-brick-application.jpg": "general-silica-brick-official-1.png",

        # Steel fiber castable
        "steel-fiber-castable/steel-fiber-castable-thumb.jpg": "steel-fiber-castable-official-1.png",
        "steel-fiber-castable/steel-fiber-castable-application.jpg": "unshaped_steel_fiber_castable.jpg",

        # Thermal insulation
        "thermal-insulation-brick/thermal-insulation-brick-thumb.jpg": "thermal-insulation-brick-official-1.png",
        "thermal-insulation-brick/thermal-insulation-brick-application.jpg": "thermal-insulation-brick-official-2.png",

        # Additional related product mappings
        "high-alumina-brick/high-alumina-brick-thumb.jpg": "high-alumina-brick-real.png",
    }

    # Pattern to match ALL subdirectory references
    subdirectory_pattern = re.compile(r'../images/products/([^/]+)/([^/"\']+)')

    # Get all HTML files
    products_dir = "D:/ai/新建文件夹/新建文件夹/7788-en/products/"
    html_files = glob.glob(os.path.join(products_dir, "*.html"))

    # Exclude the already fixed file and backup
    html_files = [f for f in html_files if not f.endswith("lightweight-silica-brick.html") and not f.endswith("backup.html")]

    print(f"Enhanced processing of {len(html_files)} HTML files")

    total_changes = 0

    for file_path in html_files:
        print(f"Processing: {os.path.basename(file_path)}")

        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()

            original_content = content
            file_changes = 0

            # Apply specific mappings first
            for old_path, new_path in extensive_mappings.items():
                old_full_path = f"../images/products/{old_path}"
                new_full_path = f"../images/products/{new_path}"
                if old_full_path in content:
                    content = content.replace(old_full_path, new_full_path)
                    file_changes += content.count(new_full_path) - original_content.count(new_full_path)

            # Find any remaining subdirectory references
            remaining_subdirs = subdirectory_pattern.findall(content)
            if remaining_subdirs:
                print(f"  Found {len(remaining_subdirs)} remaining subdirectory references:")
                for subdir, filename in remaining_subdirs:
                    print(f"    {subdir}/{filename}")

            # Check if any changes were made
            if content != original_content:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f"  ✓ Updated {os.path.basename(file_path)} with {file_changes} changes")
                total_changes += file_changes
            else:
                print(f"  - No changes needed for {os.path.basename(file_path)}")

        except Exception as e:
            print(f"  ✗ Error processing {os.path.basename(file_path)}: {e}")

    print(f"\nEnhanced image path fixing complete! Total changes: {total_changes}")

if __name__ == "__main__":
    fix_remaining_image_paths()