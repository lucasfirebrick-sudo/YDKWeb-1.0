#!/usr/bin/env python3
"""
Comprehensive Image Testing Script for 39 English Product Pages
Tests all image references and validates their existence
"""

import os
import re
from pathlib import Path
import json

def test_all_product_images():
    """Test all images in all product HTML files"""

    products_dir = Path("D:/ai/新建文件夹/新建文件夹/7788-en/products")
    images_dir = Path("D:/ai/新建文件夹/新建文件夹/7788-en/images")

    # Results tracking
    results = {
        "total_pages": 0,
        "total_images_tested": 0,
        "working_images": 0,
        "broken_images": 0,
        "pages_tested": [],
        "broken_image_details": [],
        "missing_files": [],
        "pattern_issues": []
    }

    # Get all HTML files
    html_files = list(products_dir.glob("*.html"))
    html_files = [f for f in html_files if not f.name.endswith("-backup.html")]

    results["total_pages"] = len(html_files)

    print(f"🔍 Testing {len(html_files)} product pages...")
    print("=" * 60)

    for html_file in sorted(html_files):
        print(f"\n📄 Testing: {html_file.name}")

        page_result = test_single_page(html_file, images_dir)
        results["pages_tested"].append(page_result)

        # Update totals
        results["total_images_tested"] += page_result["total_images"]
        results["working_images"] += page_result["working_images"]
        results["broken_images"] += page_result["broken_images"]

        # Collect broken image details
        if page_result["broken_image_paths"]:
            results["broken_image_details"].extend([
                f"{html_file.name}: {path}" for path in page_result["broken_image_paths"]
            ])

        # Collect missing files
        results["missing_files"].extend(page_result["missing_files"])

        # Check pattern consistency
        if page_result["total_images"] != 4:
            results["pattern_issues"].append(f"{html_file.name}: Expected 4 images, found {page_result['total_images']}")

        # Show progress
        status = "✅ PASS" if page_result["broken_images"] == 0 else f"❌ FAIL ({page_result['broken_images']} broken)"
        print(f"   {status} - {page_result['working_images']}/{page_result['total_images']} images working")

    return results

def test_single_page(html_file, images_dir):
    """Test all images in a single HTML page"""

    with open(html_file, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find all image references
    image_paths = set()

    # Main image src attributes
    src_matches = re.findall(r'src="([^"]+\.(?:jpg|jpeg|png|gif|webp))"', content, re.IGNORECASE)
    image_paths.update(src_matches)

    # Thumbnail data-image attributes
    data_image_matches = re.findall(r'data-image="([^"]+\.(?:jpg|jpeg|png|gif|webp))"', content, re.IGNORECASE)
    image_paths.update(data_image_matches)

    # Results for this page
    page_result = {
        "filename": html_file.name,
        "total_images": len(image_paths),
        "working_images": 0,
        "broken_images": 0,
        "image_paths": list(image_paths),
        "broken_image_paths": [],
        "missing_files": []
    }

    # Test each image path
    for img_path in image_paths:
        # Convert relative path to absolute
        if img_path.startswith('../images/'):
            img_path = img_path.replace('../images/', '')
        elif img_path.startswith('images/'):
            img_path = img_path.replace('images/', '')

        full_path = images_dir / img_path

        if full_path.exists():
            page_result["working_images"] += 1
        else:
            page_result["broken_images"] += 1
            page_result["broken_image_paths"].append(img_path)
            page_result["missing_files"].append(str(full_path))

    return page_result

def generate_detailed_report(results):
    """Generate a detailed testing report"""

    print("\n" + "=" * 80)
    print("🔬 COMPREHENSIVE IMAGE TESTING REPORT")
    print("=" * 80)

    # Overall Statistics
    print(f"\n📊 OVERALL STATISTICS:")
    print(f"   Total pages tested: {results['total_pages']}")
    print(f"   Total images tested: {results['total_images_tested']}")
    print(f"   Working images: {results['working_images']}")
    print(f"   Broken images: {results['broken_images']}")

    success_rate = (results['working_images'] / results['total_images_tested'] * 100) if results['total_images_tested'] > 0 else 0
    print(f"   Success rate: {success_rate:.1f}%")

    # Pages that need attention
    problem_pages = [page for page in results['pages_tested'] if page['broken_images'] > 0]
    print(f"\n⚠️  PAGES NEEDING ATTENTION: {len(problem_pages)}")

    if problem_pages:
        for page in problem_pages:
            print(f"   • {page['filename']}: {page['broken_images']} broken images")
    else:
        print("   🎉 All pages are working perfectly!")

    # Pattern consistency issues
    if results['pattern_issues']:
        print(f"\n📐 PATTERN CONSISTENCY ISSUES:")
        for issue in results['pattern_issues']:
            print(f"   • {issue}")
    else:
        print(f"\n📐 PATTERN CONSISTENCY: ✅ All pages have 4 images as expected")

    # Missing files summary
    if results['missing_files']:
        missing_unique = list(set(results['missing_files']))
        print(f"\n🔍 MISSING FILES ({len(missing_unique)}):")
        for missing in sorted(missing_unique):
            print(f"   • {missing}")

    # Detailed broken image list
    if results['broken_image_details']:
        print(f"\n💔 DETAILED BROKEN IMAGE LIST:")
        for broken in results['broken_image_details']:
            print(f"   • {broken}")

    return results

def check_placeholder_availability():
    """Check what placeholder files are available"""

    images_dir = Path("D:/ai/新建文件夹/新建文件夹/7788-en/images")
    placeholders_dir = images_dir / "placeholders"

    print(f"\n🖼️  PLACEHOLDER FILE CHECK:")
    print(f"   Placeholders directory: {placeholders_dir}")

    if placeholders_dir.exists():
        placeholder_files = list(placeholders_dir.glob("*.jpg"))
        print(f"   Available placeholders: {len(placeholder_files)}")
        for pf in sorted(placeholder_files):
            print(f"     • {pf.name}")
    else:
        print("   ⚠️  Placeholders directory not found")

    # Check for common placeholder patterns in main images dir
    common_placeholders = [
        "brick-placeholder.jpg",
        "castable-placeholder.jpg",
        "brick-related-1.jpg",
        "brick-related-2.jpg",
        "castable-related-1.jpg"
    ]

    print(f"\n   Common placeholders in main images directory:")
    for placeholder in common_placeholders:
        path = images_dir / placeholder
        status = "✅ EXISTS" if path.exists() else "❌ MISSING"
        print(f"     • {placeholder}: {status}")

if __name__ == "__main__":
    # Run comprehensive testing
    results = test_all_product_images()

    # Generate detailed report
    generate_detailed_report(results)

    # Check placeholder availability
    check_placeholder_availability()

    # Save results to JSON for further analysis
    output_file = Path("D:/ai/新建文件夹/新建文件夹/7788-en/image_test_results.json")
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(results, f, indent=2, ensure_ascii=False)

    print(f"\n💾 Results saved to: {output_file}")
    print("\n🏁 Testing completed!")