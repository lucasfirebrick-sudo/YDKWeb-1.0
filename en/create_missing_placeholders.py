#!/usr/bin/env python3
"""
Create Missing Placeholder Files Script
Creates all required placeholder files that are missing for the product pages
"""

import os
import shutil
from pathlib import Path

def create_missing_placeholders():
    """Create all missing placeholder files"""

    images_dir = Path("D:/ai/新建文件夹/新建文件夹/7788-en/images")
    products_dir = images_dir / "products"
    placeholder_dir = products_dir / "placeholder"

    # Ensure placeholder directory exists
    placeholder_dir.mkdir(parents=True, exist_ok=True)

    # Use existing brick-main-placeholder.jpg as template
    template_main = placeholder_dir / "brick-main-placeholder.jpg"
    template_thumb = placeholder_dir / "brick-thumb-1.jpg"

    # List of missing placeholder files needed
    missing_placeholders = [
        "related-product-1.jpg",
        "related-product-2.jpg",
        "related-product-3.jpg",
        "related-product-4.jpg",
        "brick-related-1.jpg",
        "brick-related-2.jpg",
        "castable-related-1.jpg",
        "castable-related-2.jpg",
    ]

    print(f"📁 Creating missing placeholder files...")
    print(f"   Source template: {template_main}")
    print(f"   Target directory: {placeholder_dir}")

    for placeholder in missing_placeholders:
        target_path = placeholder_dir / placeholder

        if not target_path.exists():
            if template_main.exists():
                shutil.copy2(template_main, target_path)
                print(f"   ✅ Created: {placeholder}")
            else:
                print(f"   ❌ Template not found: {template_main}")
        else:
            print(f"   ✓ Already exists: {placeholder}")

    # Also create additional needed placeholders
    additional_placeholders = [
        ("brick-main-placeholder.jpg", template_main),
        ("castable-main-placeholder.jpg", template_main),
        ("ceramic-main-placeholder.jpg", template_main),
    ]

    for placeholder_name, source_template in additional_placeholders:
        target_path = placeholder_dir / placeholder_name

        if not target_path.exists() and source_template.exists():
            shutil.copy2(source_template, target_path)
            print(f"   ✅ Created: {placeholder_name}")

    print(f"\n🎉 Placeholder creation completed!")

    # List all placeholder files
    print(f"\n📋 Available placeholder files:")
    placeholder_files = list(placeholder_dir.glob("*.jpg"))
    for pf in sorted(placeholder_files):
        print(f"   • {pf.name}")

if __name__ == "__main__":
    create_missing_placeholders()