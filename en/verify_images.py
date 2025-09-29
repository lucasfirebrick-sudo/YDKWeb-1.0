#!/usr/bin/env python3
"""
Script to verify that all image paths in the fixed HTML files point to existing images
"""

import os
import re
import glob

def verify_image_paths():
    # Get all HTML files
    products_dir = "D:/ai/新建文件夹/新建文件夹/7788-en/products/"
    images_dir = "D:/ai/新建文件夹/新建文件夹/7788-en/images/products/"
    html_files = glob.glob(os.path.join(products_dir, "*.html"))

    # Exclude backup files
    html_files = [f for f in html_files if not f.endswith("backup.html")]

    print(f"Verifying image paths in {len(html_files)} HTML files")

    # Pattern to find all image src attributes
    image_pattern = re.compile(r'src="\.\.\/images\/products\/([^"]+)"')

    missing_images = []
    total_images_checked = 0
    existing_images = 0

    for file_path in html_files:
        print(f"Checking: {os.path.basename(file_path)}")

        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()

            # Find all image paths
            image_matches = image_pattern.findall(content)
            file_missing = []

            for image_path in image_matches:
                total_images_checked += 1
                full_image_path = os.path.join(images_dir, image_path)

                if os.path.exists(full_image_path):
                    existing_images += 1
                else:
                    file_missing.append(image_path)
                    missing_images.append(f"{os.path.basename(file_path)}: {image_path}")

            if file_missing:
                print(f"  ✗ Missing {len(file_missing)} images:")
                for missing in file_missing:
                    print(f"    - {missing}")
            else:
                print(f"  ✓ All {len(image_matches)} images exist")

        except Exception as e:
            print(f"  ✗ Error checking {os.path.basename(file_path)}: {e}")

    print(f"\n=== Verification Summary ===")
    print(f"Total images checked: {total_images_checked}")
    print(f"Existing images: {existing_images}")
    print(f"Missing images: {len(missing_images)}")

    if missing_images:
        print(f"\n=== Missing Images ===")
        for missing in missing_images:
            print(f"  {missing}")
    else:
        print(f"\n✓ All image paths are valid!")

    print(f"\nSuccess rate: {(existing_images / total_images_checked * 100):.1f}%")

if __name__ == "__main__":
    verify_image_paths()