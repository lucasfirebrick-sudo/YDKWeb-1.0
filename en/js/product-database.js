/**
 * Product Technical Database System - English Version
 * Manages technical specifications, documentation and information for each product
 */

class ProductDatabase {
    constructor() {
        this.products = this.initializeProductData();
    }

    /**
     * Initialize complete 39-product database
     * Built based on actual image resource analysis results
     */
    initializeProductData() {
        return {
            // Shaped Refractory Materials - Alumina Series
            'high-alumina-brick': {
                name: 'High Alumina Brick', englishName: 'High Alumina Brick', category: 'shaped', subcategory: 'alumina-series',
                specifications: {
                    'Al2O3': { value: '≥65', unit: '%', label: 'Al₂O₃ Content' },
                    'refractoriness': { value: '≥1750', unit: '℃', label: 'Refractoriness' },
                    'apparentPorosity': { value: '≤23', unit: '%', label: 'Apparent Porosity' },
                    'coldCrushingStrength': { value: '≥45', unit: 'MPa', label: 'Cold Crushing Strength' }
                },
                features: [
                    'High refractoriness, can reach above 1750℃',
                    'Excellent thermal shock resistance, withstands frequent temperature changes',
                    'Strong chemical stability, good resistance to acidic and neutral slag corrosion'
                ],
                applications: [
                    'Steel Industry: Furnace lining materials for blast furnaces, converters, electric furnaces',
                    'Cement Industry: Refractory linings for cement rotary kilns, preheaters',
                    'Glass Industry: Glass melting furnaces, regenerators and other high-temperature equipment'
                ],
                documents: {
                    technicalSpec: {
                        available: true,
                        filename: 'high-alumina-brick-tech-spec.pdf',
                        description: 'High Alumina Brick Technical Specification Sheet'
                    }
                }
            },

            'shaped-high-alumina-brick': {
                name: 'Shaped High Alumina Brick', englishName: 'Shaped High Alumina Brick', category: 'shaped', subcategory: 'alumina-series',
                specifications: {
                    'Al2O3': { value: '≥75', unit: '%', label: 'Al₂O₃ Content' },
                    'refractoriness': { value: '≥1790', unit: '℃', label: 'Refractoriness' }
                },
                features: [
                    'High-strength shaped products',
                    'Precise dimensional control',
                    'Excellent high-temperature performance'
                ],
                applications: [
                    'Critical high-temperature zones',
                    'Precision furnace body structures',
                    'Special shape requirements'
                ],
                documents: {
                    technicalSpec: {
                        available: true,
                        filename: 'shaped-high-alumina-brick-tech-spec.pdf',
                        description: 'Shaped High Alumina Brick Technical Specification Sheet'
                    }
                }
            },

            'lightweight-high-alumina-brick': {
                name: 'Lightweight High Alumina Brick', englishName: 'Lightweight High Alumina Brick', category: 'shaped', subcategory: 'alumina-series',
                specifications: {
                    'Al2O3': { value: '≥60', unit: '%', label: 'Al₂O₃ Content' },
                    'bulkDensity': { value: '≤1.3', unit: 'g/cm³', label: 'Bulk Density' }
                },
                features: [
                    'Lightweight insulation',
                    'Low thermal conductivity',
                    'Significant energy-saving effect'
                ],
                applications: [
                    'Furnace insulation layers',
                    'Energy-saving retrofits',
                    'Lightweight load structures'
                ],
                documents: {
                    technicalSpec: {
                        available: false,
                        filename: 'lightweight-high-alumina-brick-tech-spec.pdf',
                        description: 'Lightweight High Alumina Brick Technical Specification Sheet'
                    }
                }
            },

            'alumina-hollow-sphere-brick': {
                name: 'Alumina Hollow Sphere Brick', englishName: 'Alumina Hollow Sphere Brick', category: 'special', subcategory: 'alumina-series',
                specifications: {
                    'Al2O3': { value: '≥99', unit: '%', label: 'Al₂O₃ Content' },
                    'refractoriness': { value: '≥1800', unit: '℃', label: 'Refractoriness' }
                },
                features: [
                    'Ultra-high purity',
                    'Lightweight and high strength',
                    'Excellent insulation performance'
                ],
                applications: [
                    'High-temperature precision equipment',
                    'Special high-temperature environments',
                    'Ultra-high temperature insulation'
                ],
                documents: {
                    technicalSpec: {
                        available: false,
                        filename: 'alumina-hollow-sphere-brick-tech-spec.pdf',
                        description: 'Alumina Hollow Sphere Brick Technical Specification Sheet'
                    }
                }
            },

            // Clay Series
            'clay-brick': {
                name: 'Clay Brick', englishName: 'Clay Brick', category: 'shaped', subcategory: 'clay-series',
                specifications: {
                    'Al2O3': { value: '30-48', unit: '%', label: 'Al₂O₃ Content' },
                    'refractoriness': { value: '≥1670', unit: '℃', label: 'Refractoriness' }
                },
                features: [
                    'Economical and practical, low cost',
                    'Good chemical stability, resistance to acidic slag corrosion',
                    'Low thermal conductivity, good insulation performance'
                ],
                applications: [
                    'Steel Industry: Heating furnaces, sintering machines and other equipment',
                    'Building Materials: Cement rotary kilns, lime kilns',
                    'Chemical Industry: Various industrial furnaces'
                ],
                documents: {
                    technicalSpec: {
                        available: true,
                        filename: 'clay-brick-tech-spec.pdf',
                        description: 'Clay Brick Technical Specification Sheet'
                    }
                }
            },

            'shaped-clay-brick': {
                name: 'Shaped Clay Brick', englishName: 'Shaped Clay Brick', category: 'shaped', subcategory: 'clay-series',
                specifications: {
                    'Al2O3': { value: '35-45', unit: '%', label: 'Al₂O₃ Content' },
                    'refractoriness': { value: '≥1680', unit: '℃', label: 'Refractoriness' }
                },
                features: [
                    'Standardized shapes',
                    'Precise dimensions',
                    'Economical and practical'
                ],
                applications: [
                    'Standard furnace body structures',
                    'Regular high-temperature applications',
                    'Maintenance and replacement'
                ],
                documents: {
                    technicalSpec: {
                        available: false,
                        filename: 'shaped-clay-brick-tech-spec.pdf',
                        description: 'Shaped Clay Brick Technical Specification Sheet'
                    }
                }
            },

            'lightweight-clay-brick': {
                name: 'Lightweight Clay Brick', englishName: 'Lightweight Clay Brick', category: 'shaped', subcategory: 'clay-series',
                specifications: {
                    'Al2O3': { value: '35-42', unit: '%', label: 'Al₂O₃ Content' },
                    'bulkDensity': { value: '≤1.5', unit: 'g/cm³', label: 'Bulk Density' }
                },
                features: [
                    'Lightweight and economical',
                    'Thermal insulation',
                    'Easy construction'
                ],
                applications: [
                    'Insulation layer applications',
                    'Lightweight load areas',
                    'Energy-saving retrofits'
                ],
                documents: {
                    technicalSpec: {
                        available: false,
                        filename: 'lightweight-clay-brick-tech-spec.pdf',
                        description: 'Lightweight Clay Brick Technical Specification Sheet'
                    }
                }
            },

            // Silica Series
            'silica-brick': {
                name: 'Silica Brick', englishName: 'Silica Brick', category: 'shaped', subcategory: 'silica-series',
                specifications: {
                    'SiO2': { value: '≥94', unit: '%', label: 'SiO₂ Content' },
                    'refractoriness': { value: '≥1690', unit: '℃', label: 'Refractoriness' }
                },
                features: [
                    'Excellent high-temperature strength',
                    'Strong resistance to acidic slag corrosion',
                    'Small coefficient of linear expansion'
                ],
                applications: [
                    'Steel Industry: Coke ovens, glass furnaces',
                    'Non-ferrous Metals: Copper smelting furnaces',
                    'Building Materials: Ceramic kilns'
                ],
                documents: {
                    technicalSpec: {
                        available: true,
                        filename: 'silica-brick-tech-spec.pdf',
                        description: 'Silica Brick Technical Specification Sheet'
                    }
                }
            },

            'shaped-silica-brick': {
                name: 'Shaped Silica Brick', englishName: 'Shaped Silica Brick', category: 'shaped', subcategory: 'silica-series',
                specifications: {
                    'SiO2': { value: '≥96', unit: '%', label: 'SiO₂ Content' },
                    'refractoriness': { value: '≥1700', unit: '℃', label: 'Refractoriness' }
                },
                features: [
                    'Precision molding',
                    'High purity silica',
                    'Excellent high-temperature performance'
                ],
                applications: [
                    'Coke oven tops',
                    'Glass furnace critical areas',
                    'Special shape requirements'
                ],
                documents: {
                    technicalSpec: {
                        available: false,
                        filename: 'shaped-silica-brick-tech-spec.pdf',
                        description: 'Shaped Silica Brick Technical Specification Sheet'
                    }
                }
            },

            'hot-blast-furnace-silica-brick': {
                name: 'Hot Blast Furnace Silica Brick', englishName: 'Hot Blast Furnace Silica Brick', category: 'shaped', subcategory: 'silica-series',
                specifications: {
                    'SiO2': { value: '≥95', unit: '%', label: 'SiO₂ Content' },
                    'refractoriness': { value: '≥1710', unit: '℃', label: 'Refractoriness' }
                },
                features: [
                    'Specifically designed for hot blast furnaces',
                    'Volume stable at high temperatures',
                    'Long service life'
                ],
                applications: [
                    'Blast furnace hot blast stoves',
                    'High-temperature combustion equipment',
                    'Steel smelting systems'
                ],
                documents: {
                    technicalSpec: {
                        available: false,
                        filename: 'hot-blast-furnace-silica-brick-tech-spec.pdf',
                        description: 'Hot Blast Furnace Silica Brick Technical Specification Sheet'
                    }
                }
            }
        };
    }

    // Method to get product by ID
    getProduct(productId) {
        return this.products[productId] || null;
    }

    // Method to get all products in a category
    getProductsByCategory(category) {
        return Object.keys(this.products)
            .filter(key => this.products[key].category === category)
            .reduce((obj, key) => {
                obj[key] = this.products[key];
                return obj;
            }, {});
    }

    // Method to get all products in a subcategory
    getProductsBySubcategory(subcategory) {
        return Object.keys(this.products)
            .filter(key => this.products[key].subcategory === subcategory)
            .reduce((obj, key) => {
                obj[key] = this.products[key];
                return obj;
            }, {});
    }

    // Method to search products by name
    searchProducts(searchTerm) {
        const term = searchTerm.toLowerCase();
        return Object.keys(this.products)
            .filter(key => {
                const product = this.products[key];
                return product.name.toLowerCase().includes(term) ||
                       product.englishName.toLowerCase().includes(term);
            })
            .reduce((obj, key) => {
                obj[key] = this.products[key];
                return obj;
            }, {});
    }
}

// Initialize global product database instance
window.productDatabase = new ProductDatabase();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProductDatabase;
}