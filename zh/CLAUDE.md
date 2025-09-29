# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Chinese corporate website for 河南元达科耐火材料有限公司 (Henan Yuandake Refractory Materials Co., Ltd.), a refractory materials manufacturer. Static HTML/CSS/JS website with Node.js build tools and Python automation scripts.

## Development Commands

### Essential Commands
- `npm run dev` - Start development server on port 8080
- `npm run build` - Build optimized production version (CSS/JS minification + image optimization)
- `node build.js` - Custom build script with Chinese reporting
- `npm run validate` - Validate HTML structure
- `npm test` - Run validation tests

### Build Components
- `npm run build:css` - Concatenate and minify CSS files
- `npm run build:js` - Concatenate and minify JS files
- `npm run optimize:images` - Optimize image assets
- `npm run watch` - Watch for changes and auto-rebuild

### Prerequisites
Node.js >=16.0.0 and npm >=8.0.0

## Architecture Overview

### Core Structure
```
├── index.html, about.html, products.html, quality.html, contact.html
├── css/style.css          # Unified 400KB+ stylesheet
├── js/
│   ├── script.js          # Core functionality, navigation, animations
│   └── hero-carousel.js   # Homepage carousel
├── products/              # 17 individual product pages
├── applications/          # 16 industry application pages
├── data/                  # Product data and schemas
├── templates/             # Mustache templates for product generation
└── generated/             # Auto-generated optimized pages
```

### Key Features
- **Multi-level Navigation**: Complex dropdown menus with product categories and applications
- **Product Management**: 65+ product pages with automated generation system
- **Responsive Design**: Mobile-first with hamburger menu
- **Chinese Content**: UTF-8 encoded simplified Chinese throughout
- **Build System**: Custom minification and optimization

## Development Standards

### CRITICAL - Historical Issues Prevention
This project previously suffered from development chaos. **MUST AVOID**:
- Creating temporary fix scripts (batch-*.js, fix-*.js, cleanup-*.js)
- Manual copy-paste of navigation code between files
- Multiple image naming conventions simultaneously
- onerror fallback for primary image display

### Required Workflow
1. Run quality checks: `python check_missing_images.py` (if available)
2. Modify source files directly, never create patches
3. Use unified navigation from navigation-template.html
4. Follow image naming: `images/products/[english-name].jpg`
5. Test across all affected pages

## Python Automation System

The project includes extensive Python scripts for content management:

### Product Data Management
- `extract_product_data.py` - Extract structured data from existing pages
- `generate_product_pages.py` - Generate optimized pages using Mustache templates
- `validate_generated_pages.py` - Quality validation and SEO checks

### Data Files
- `data/products-extracted-data.json` - Structured product database
- `data/product-schema.json` - JSON schema for product data
- `products_parameters.csv` - Technical specifications
- `templates/product-detail.html` - Main Mustache template

### Key Python Libraries
- BeautifulSoup4 for HTML parsing
- Pystache for Mustache templating
- JSON Schema validation

## Content Architecture

### Navigation Structure
- 首页 (Home), 产品中心 (Products), 应用领域 (Applications)
- 质量控制 (Quality), 关于我们 (About), 联系我们 (Contact)
- Product categories: 耐火砖, 隔热保温制品, 耐火喷涂料
- Application industries: 钢铁工业, 水泥工业, 玻璃工业, 石化工业

### Technical Implementation
- **Technology**: Vanilla HTML/CSS/JS, no frameworks
- **Styling**: BEM-style CSS classes, CSS custom properties
- **JavaScript**: IntersectionObserver for animations, form validation
- **Assets**: Font Awesome (CDN), Google Fonts (CDN)
- **Data**: JSON-based product database with automated page generation

### Performance Optimizations
- File size reduction: 37.7% average compression (67KB → 39KB)
- Code deduplication through templating
- Apache optimization with gzip compression
- Long-term caching with version parameters

## Important Notes

- **Language**: All content in simplified Chinese, requires UTF-8 handling
- **Deployment**: Can deploy as static files or use build process
- **Images**: Centralized in `/images/` with optimization scripts
- **SEO**: Structured data, meta tags, breadcrumb navigation
- **Mobile**: Responsive design with touch-friendly interactions