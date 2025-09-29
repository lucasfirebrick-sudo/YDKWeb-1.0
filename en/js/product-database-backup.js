/**
 * 产品技术资料数据库系统
 * 管理每个产品的技术规格、资料文档等信息
 */

class ProductDatabase {
    constructor() {
        this.products = this.initializeProductData();
    }

    /**
     * 初始化完整的39产品数据库
     * 基于实际图片资源分析结果构建
     */
    initializeProductData() {
        return {
            // 定形耐火材料 - 高铝系列
            'high-alumina-brick': {
                name: '高铝砖', englishName: 'High Alumina Brick', category: 'shaped', subcategory: 'alumina-series',
                specifications: {
                    'Al2O3': { value: '≥65', unit: '%', label: 'Al₂O₃含量' },
                    'refractoriness': { value: '≥1750', unit: '℃', label: '耐火度' },
                    'apparentPorosity': { value: '≤23', unit: '%', label: '显气孔率' },
                    'coldCrushingStrength': { value: '≥45', unit: 'MPa', label: '常温耐压强度' }
                },
                features: ['高耐火度，耐火度可达1750℃以上', '抗热震性能优异，能承受频繁的温度变化', '化学稳定性强，对酸性和中性渣抗侵蚀能力好'],
                applications: ['钢铁工业：高炉、转炉、电炉等设备的炉衬材料', '水泥工业：水泥回转窑、预热器等设备的耐火衬里', '玻璃工业：玻璃熔窑、蓄热室等高温设备'],
                documents: { technicalSpec: { available: true, filename: 'high-alumina-brick-tech-spec.pdf', description: '高铝砖技术规格表' } }
            },

            'shaped-high-alumina-brick': {
                name: '定形高铝砖', englishName: 'Shaped High Alumina Brick', category: 'shaped', subcategory: 'alumina-series',
                specifications: { 'Al2O3': { value: '≥75', unit: '%', label: 'Al₂O₃含量' }, 'refractoriness': { value: '≥1790', unit: '℃', label: '耐火度' } },
                features: ['高强度定形产品', '精确尺寸控制', '优异的高温性能'],
                applications: ['关键高温部位', '精密炉体结构', '特殊形状需求'],
                documents: { technicalSpec: { available: true, filename: 'shaped-high-alumina-brick-tech-spec.pdf', description: '定形高铝砖技术规格表' } }
            },

            'lightweight-high-alumina-brick': {
                name: '轻质高铝砖', englishName: 'Lightweight High Alumina Brick', category: 'shaped', subcategory: 'alumina-series',
                specifications: { 'Al2O3': { value: '≥60', unit: '%', label: 'Al₂O₃含量' }, 'bulkDensity': { value: '≤1.3', unit: 'g/cm³', label: '体积密度' } },
                features: ['轻质保温', '导热系数低', '节能效果显著'],
                applications: ['炉体保温层', '节能改造', '轻载结构'],
                documents: { technicalSpec: { available: false, filename: 'lightweight-high-alumina-brick-tech-spec.pdf', description: '轻质高铝砖技术规格表' } }
            },

            'alumina-hollow-sphere-brick': {
                name: '氧化铝空心球砖', englishName: 'Alumina Hollow Sphere Brick', category: 'special', subcategory: 'alumina-series',
                specifications: { 'Al2O3': { value: '≥99', unit: '%', label: 'Al₂O₃含量' }, 'refractoriness': { value: '≥1800', unit: '℃', label: '耐火度' } },
                features: ['超高纯度', '轻质高强', '优异保温性能'],
                applications: ['高温精密设备', '特殊高温环境', '超高温保温'],
                documents: { technicalSpec: { available: false, filename: 'alumina-hollow-sphere-brick-tech-spec.pdf', description: '氧化铝空心球砖技术规格表' } }
            },

            // 粘土系列
            'clay-brick': {
                name: '粘土砖', englishName: 'Clay Brick', category: 'shaped', subcategory: 'clay-series',
                specifications: { 'Al2O3': { value: '30-48', unit: '%', label: 'Al₂O₃含量' }, 'refractoriness': { value: '≥1670', unit: '℃', label: '耐火度' } },
                features: ['经济实用，成本低廉', '化学稳定性好，抗酸性渣侵蚀', '导热系数低，保温性能好'],
                applications: ['钢铁工业：加热炉、烧结机等设备', '建材工业：水泥回转窑、石灰窑', '化工工业：各类工业炉窑'],
                documents: { technicalSpec: { available: true, filename: 'clay-brick-tech-spec.pdf', description: '粘土砖技术规格表' } }
            },

            'shaped-clay-brick': {
                name: '定形粘土砖', englishName: 'Shaped Clay Brick', category: 'shaped', subcategory: 'clay-series',
                specifications: { 'Al2O3': { value: '35-45', unit: '%', label: 'Al₂O₃含量' }, 'refractoriness': { value: '≥1680', unit: '℃', label: '耐火度' } },
                features: ['标准化形状', '精确尺寸', '经济实用'],
                applications: ['标准炉体结构', '常规高温应用', '维修更换'],
                documents: { technicalSpec: { available: false, filename: 'shaped-clay-brick-tech-spec.pdf', description: '定形粘土砖技术规格表' } }
            },

            'lightweight-clay-brick': {
                name: '轻质粘土砖', englishName: 'Lightweight Clay Brick', category: 'shaped', subcategory: 'clay-series',
                specifications: { 'Al2O3': { value: '35-42', unit: '%', label: 'Al₂O₃含量' }, 'bulkDensity': { value: '≤1.5', unit: 'g/cm³', label: '体积密度' } },
                features: ['轻质经济', '保温隔热', '施工便利'],
                applications: ['保温层应用', '轻载部位', '节能改造'],
                documents: { technicalSpec: { available: false, filename: 'lightweight-clay-brick-tech-spec.pdf', description: '轻质粘土砖技术规格表' } }
            },

            // 硅质系列
            'silica-brick': {
                name: '硅砖', englishName: 'Silica Brick', category: 'shaped', subcategory: 'silica-series',
                specifications: { 'SiO2': { value: '≥94', unit: '%', label: 'SiO₂含量' }, 'refractoriness': { value: '≥1690', unit: '℃', label: '耐火度' } },
                features: ['高温强度优异', '抗酸性渣侵蚀能力强', '线膨胀系数小'],
                applications: ['钢铁工业：焦炉、玻璃窑炉', '有色金属：铜熔炼炉', '建材工业：陶瓷窑炉'],
                documents: { technicalSpec: { available: true, filename: 'silica-brick-tech-spec.pdf', description: '硅砖技术规格表' } }
            },

            'shaped-silica-brick': {
                name: '定形硅砖', englishName: 'Shaped Silica Brick', category: 'shaped', subcategory: 'silica-series',
                specifications: { 'SiO2': { value: '≥96', unit: '%', label: 'SiO₂含量' }, 'refractoriness': { value: '≥1700', unit: '℃', label: '耐火度' } },
                features: ['精密成型', '高纯度硅质', '优异高温性能'],
                applications: ['焦炉炉顶', '玻璃窑关键部位', '特殊形状需求'],
                documents: { technicalSpec: { available: false, filename: 'shaped-silica-brick-tech-spec.pdf', description: '定形硅砖技术规格表' } }
            },

            'hot-blast-furnace-silica-brick': {
                name: '热风炉硅砖', englishName: 'Hot Blast Furnace Silica Brick', category: 'shaped', subcategory: 'silica-series',
                specifications: { 'SiO2': { value: '≥95', unit: '%', label: 'SiO₂含量' }, 'refractoriness': { value: '≥1710', unit: '℃', label: '耐火度' } },
                features: ['专用于热风炉', '高温下体积稳定', '长期使用寿命'],
                applications: ['高炉热风炉', '高温燃烧设备', '钢铁冶炼系统'],
                documents: { technicalSpec: { available: false, filename: 'hot-blast-furnace-silica-brick-tech-spec.pdf', description: '热风炉硅砖技术规格表' } }
            },

            // 莫来石系列
            'sintered-mullite-brick': {
                name: '烧结莫来石砖', englishName: 'Sintered Mullite Brick', category: 'shaped', subcategory: 'mullite-series',
                specifications: { 'Al2O3': { value: '60-75', unit: '%', label: 'Al₂O₃含量' }, 'refractoriness': { value: '≥1790', unit: '℃', label: '耐火度' } },
                features: ['高温性能卓越', '抗热震性能优异', '化学稳定性优良'],
                applications: ['钢铁工业：高炉、热风炉', '石化工业：催化裂化装置', '陶瓷工业：高温窑炉'],
                documents: { technicalSpec: { available: false, filename: 'sintered-mullite-brick-tech-spec.pdf', description: '烧结莫来石砖技术规格表' } }
            },

            'shaped-mullite-brick': {
                name: '定形莫来石砖', englishName: 'Shaped Mullite Brick', category: 'shaped', subcategory: 'mullite-series',
                specifications: { 'Al2O3': { value: '65-70', unit: '%', label: 'Al₂O₃含量' }, 'refractoriness': { value: '≥1800', unit: '℃', label: '耐火度' } },
                features: ['精密成型', '莫来石结构', '卓越性能'],
                applications: ['高端工业炉', '精密设备', '关键高温部位'],
                documents: { technicalSpec: { available: false, filename: 'shaped-mullite-brick-tech-spec.pdf', description: '定形莫来石砖技术规格表' } }
            },

            'mullite-brick': {
                name: '莫来石砖', englishName: 'Mullite Brick', category: 'shaped', subcategory: 'mullite-series',
                specifications: {
                    'Al2O3': { value: '≥65', unit: '%', label: 'Al₂O₃含量' },
                    'refractoriness': { value: '≥1750', unit: '℃', label: '耐火度' },
                    'apparentPorosity': { value: '≤23', unit: '%', label: '显气孔率' },
                    'coldCrushingStrength': { value: '≥45', unit: 'MPa', label: '常温耐压强度' }
                },
                features: ['采用优质铝矾土为原料，具有耐火度高、抗热震性好、化学稳定性强等特点', '广泛应用于钢铁、水泥等高温工业', '莫来石结构稳定，使用寿命长'],
                applications: ['钢铁工业：高炉、热风炉、转炉等', '水泥工业：回转窑、预热器等', '石化工业：催化裂化装置等'],
                documents: { technicalSpec: { available: true, filename: 'mullite-brick-tech-spec.pdf', description: '莫来石砖技术规格表' } }
            },

            'lightweight-mullite-brick': {
                name: '轻质莫来石砖', englishName: 'Lightweight Mullite Brick', category: 'shaped', subcategory: 'mullite-series',
                specifications: { 'Al2O3': { value: '60-65', unit: '%', label: 'Al₂O₃含量' }, 'bulkDensity': { value: '≤1.2', unit: 'g/cm³', label: '体积密度' } },
                features: ['轻质高温砖', '优异保温性', '莫来石轻质结构'],
                applications: ['高温保温层', '轻载高温部位', '节能设备'],
                documents: { technicalSpec: { available: false, filename: 'lightweight-mullite-brick-tech-spec.pdf', description: '轻质莫来石砖技术规格表' } }
            },

            'mullite-light-brick': {
                name: '莫来石轻质砖', englishName: 'Mullite Light Brick', category: 'shaped', subcategory: 'mullite-series',
                specifications: { 'Al2O3': { value: '55-60', unit: '%', label: 'Al₂O₃含量' }, 'bulkDensity': { value: '≤1.0', unit: 'g/cm³', label: '体积密度' } },
                features: ['超轻质量', '莫来石基质', '保温隔热'],
                applications: ['保温背衬', '轻质炉衬', '隔热层'],
                documents: { technicalSpec: { available: false, filename: 'mullite-light-brick-tech-spec.pdf', description: '莫来石轻质砖技术规格表' } }
            },

            'silica-mullite-brick': {
                name: '硅莫来石砖', englishName: 'Silica Mullite Brick', category: 'shaped', subcategory: 'mullite-series',
                specifications: { 'Al2O3': { value: '50-60', unit: '%', label: 'Al₂O₃含量' }, 'SiO2': { value: '35-45', unit: '%', label: 'SiO₂含量' } },
                features: ['硅莫来石结构', '热稳定性好', '抗侵蚀能力强'],
                applications: ['玻璃窑炉', '陶瓷窑炉', '高温设备'],
                documents: { technicalSpec: { available: false, filename: 'silica-mullite-brick-tech-spec.pdf', description: '硅莫来石砖技术规格表' } }
            },

            // 组合砖系列
            'combination-brick': {
                name: '组合砖', englishName: 'Combination Brick', category: 'shaped', subcategory: 'combination-series',
                specifications: { 'Al2O3': { value: '45-55', unit: '%', label: 'Al₂O₃含量' }, 'refractoriness': { value: '≥1730', unit: '℃', label: '耐火度' } },
                features: ['多材质组合', '性能互补', '应用灵活'],
                applications: ['复合炉衬', '过渡部位', '特殊工况'],
                documents: { technicalSpec: { available: false, filename: 'combination-brick-tech-spec.pdf', description: '组合砖技术规格表' } }
            },

            'shaped-combination-brick': {
                name: '定形组合砖', englishName: 'Shaped Combination Brick', category: 'shaped', subcategory: 'combination-series',
                specifications: { 'refractoriness': { value: '≥1720', unit: '℃', label: '耐火度' }, 'thermalShock': { value: '≥20', unit: '次', label: '热震稳定性' } },
                features: ['定制化形状', '组合材质', '优化性能'],
                applications: ['特殊结构', '定制应用', '复杂形状'],
                documents: { technicalSpec: { available: false, filename: 'shaped-combination-brick-tech-spec.pdf', description: '定形组合砖技术规格表' } }
            },

            // 新增补充产品系列
            'general-silica-brick': {
                name: '一般硅砖', englishName: 'General Silica Brick', category: 'shaped', subcategory: 'silica-series',
                specifications: { 'SiO2': { value: '≥94', unit: '%', label: 'SiO₂含量' }, 'refractoriness': { value: '≥1690', unit: '℃', label: '耐火度' } },
                features: ['经济实用的硅质耐火材料', '良好的抗酸性渣侵蚀能力', '适用于多种工业窑炉'],
                applications: ['建材工业：陶瓷窑炉', '有色金属：铜熔炼炉', '化工工业：各类反应炉'],
                documents: { technicalSpec: { available: false, filename: 'general-silica-brick-tech-spec.pdf', description: '一般硅砖技术规格表' } }
            },

            'standard-silica-brick': {
                name: '标准硅砖', englishName: 'Standard Silica Brick', category: 'shaped', subcategory: 'silica-series',
                specifications: { 'SiO2': { value: '≥96', unit: '%', label: 'SiO₂含量' }, 'refractoriness': { value: '≥1700', unit: '℃', label: '耐火度' } },
                features: ['标准化生产，质量稳定', '高温强度优异', '线膨胀系数小'],
                applications: ['钢铁工业：焦炉、玻璃窑炉', '建材工业：陶瓷烧成设备', '化工工业：高温反应器'],
                documents: { technicalSpec: { available: false, filename: 'standard-silica-brick-tech-spec.pdf', description: '标准硅砖技术规格表' } }
            },

            'semi-silica-brick': {
                name: '半硅砖', englishName: 'Semi-Silica Brick', category: 'shaped', subcategory: 'silica-series',
                specifications: { 'SiO2': { value: '65-85', unit: '%', label: 'SiO₂含量' }, 'refractoriness': { value: '≥1650', unit: '℃', label: '耐火度' } },
                features: ['兼具硅砖和黏土砖的优点', '成本较低，性能良好', '适应性强'],
                applications: ['钢铁工业：加热炉、均热炉', '建材工业：水泥窑炉', '有色金属：熔炼设备'],
                documents: { technicalSpec: { available: false, filename: 'semi-silica-brick-tech-spec.pdf', description: '半硅砖技术规格表' } }
            },

            'coke-oven-brick': {
                name: '焦炉砖', englishName: 'Coke Oven Brick', category: 'shaped', subcategory: 'silica-series',
                specifications: { 'SiO2': { value: '≥95', unit: '%', label: 'SiO₂含量' }, 'refractoriness': { value: '≥1710', unit: '℃', label: '耐火度' } },
                features: ['专用于焦炉建设', '抗煤气侵蚀能力强', '长期使用稳定'],
                applications: ['钢铁工业：焦炉炭化室', '焦化工业：焦炉蓄热室', '相关高温煤气设备'],
                documents: { technicalSpec: { available: false, filename: 'coke-oven-brick-tech-spec.pdf', description: '焦炉砖技术规格表' } }
            },

            'heavy-clay-brick': {
                name: '重质黏土砖', englishName: 'Heavy Clay Brick', category: 'shaped', subcategory: 'clay-series',
                specifications: { 'Al2O3': { value: '30-42', unit: '%', label: 'Al₂O₃含量' }, 'refractoriness': { value: '≥1670', unit: '℃', label: '耐火度' } },
                features: ['体积密度高，强度大', '抗侵蚀性能好', '经济实用'],
                applications: ['钢铁工业：高炉、转炉', '建材工业：水泥窑', '化工工业：各类工业炉'],
                documents: { technicalSpec: { available: false, filename: 'heavy-clay-brick-tech-spec.pdf', description: '重质黏土砖技术规格表' } }
            },

            'standard-high-alumina-brick': {
                name: '标准高铝砖', englishName: 'Standard High Alumina Brick', category: 'shaped', subcategory: 'alumina-series',
                specifications: { 'Al2O3': { value: '≥75', unit: '%', label: 'Al₂O₃含量' }, 'refractoriness': { value: '≥1790', unit: '℃', label: '耐火度' } },
                features: ['标准化生产的高铝砖', '耐火度高，强度大', '质量稳定可靠'],
                applications: ['钢铁工业：高炉、热风炉', '水泥工业：回转窑', '玻璃工业：熔窑关键部位'],
                documents: { technicalSpec: { available: false, filename: 'standard-high-alumina-brick-tech-spec.pdf', description: '标准高铝砖技术规格表' } }
            },

            'hot-blast-stove-checker-silica-brick': {
                name: '热风炉格子硅砖', englishName: 'Hot Blast Stove Checker Silica Brick', category: 'shaped', subcategory: 'silica-series',
                specifications: { 'SiO2': { value: '≥96', unit: '%', label: 'SiO₂含量' }, 'refractoriness': { value: '≥1720', unit: '℃', label: '耐火度' } },
                features: ['专用于热风炉格子砖', '高温体积稳定', '传热性能优异'],
                applications: ['钢铁工业：高炉热风炉格子', '相关高温蓄热设备', '热交换系统'],
                documents: { technicalSpec: { available: false, filename: 'hot-blast-stove-checker-silica-brick-tech-spec.pdf', description: '热风炉格子硅砖技术规格表' } }
            },

            'hot-blast-stove-clay-checker-brick': {
                name: '热风炉黏土格子砖', englishName: 'Hot Blast Stove Clay Checker Brick', category: 'shaped', subcategory: 'clay-series',
                specifications: { 'Al2O3': { value: '35-45', unit: '%', label: 'Al₂O₃含量' }, 'refractoriness': { value: '≥1680', unit: '℃', label: '耐火度' } },
                features: ['专用于热风炉黏土格子', '成本较低', '热震稳定性好'],
                applications: ['钢铁工业：高炉热风炉', '热风炉蓄热室', '相关蓄热设备'],
                documents: { technicalSpec: { available: false, filename: 'hot-blast-stove-clay-checker-brick-tech-spec.pdf', description: '热风炉黏土格子砖技术规格表' } }
            },

            'lightweight-silica-brick': {
                name: '轻质硅砖', englishName: 'Lightweight Silica Brick', category: 'lightweight', subcategory: 'silica-series',
                specifications: { 'SiO2': { value: '≥90', unit: '%', label: 'SiO₂含量' }, 'bulkDensity': { value: '≤1.2', unit: 'g/cm³', label: '体积密度' } },
                features: ['轻质保温性能优异', '导热系数低', '节能效果显著'],
                applications: ['保温炉衬', '隔热层应用', '节能改造项目'],
                documents: { technicalSpec: { available: false, filename: 'lightweight-silica-brick-tech-spec.pdf', description: '轻质硅砖技术规格表' } }
            },

            'insulating-brick': {
                name: '隔热砖', englishName: 'Insulating Brick', category: 'lightweight', subcategory: 'insulating-series',
                specifications: { 'bulkDensity': { value: '≤1.0', unit: 'g/cm³', label: '体积密度' }, 'thermalConductivity': { value: '≤0.5', unit: 'W/m·K', label: '导热系数' } },
                features: ['优异的隔热保温性能', '轻质节能', '施工便利'],
                applications: ['炉体保温层', '管道保温', '工业节能改造'],
                documents: { technicalSpec: { available: false, filename: 'insulating-brick-tech-spec.pdf', description: '隔热砖技术规格表' } }
            },

            'insulating-material': {
                name: '保温材料', englishName: 'Insulating Material', category: 'lightweight', subcategory: 'insulating-series',
                specifications: { 'thermalConductivity': { value: '≤0.3', unit: 'W/m·K', label: '导热系数' }, 'serviceTemperature': { value: '≤1200', unit: '℃', label: '使用温度' } },
                features: ['多种保温材料选择', '适应不同温度需求', '安装便利'],
                applications: ['工业炉保温', '高温管道保温', '设备隔热'],
                documents: { technicalSpec: { available: false, filename: 'insulating-material-tech-spec.pdf', description: '保温材料技术规格表' } }
            },

            'wear-resistant-ceramic': {
                name: '耐磨陶瓷', englishName: 'Wear Resistant Ceramic', category: 'special', subcategory: 'ceramic-series',
                specifications: { 'hardness': { value: '≥85', unit: 'HRA', label: '硬度' }, 'wearResistance': { value: '优异', unit: '', label: '耐磨性' } },
                features: ['超高耐磨性能', '化学稳定性好', '使用寿命长'],
                applications: ['矿物加工设备', '钢铁工业：输送设备', '电力工业：制粉系统'],
                documents: { technicalSpec: { available: false, filename: 'wear-resistant-ceramic-tech-spec.pdf', description: '耐磨陶瓷技术规格表' } }
            },

            // 不定形耐火材料 - 浇注料系列
            'alumina-castable': {
                name: '高铝浇注料', englishName: 'High Alumina Castable', category: 'unshaped', subcategory: 'castable',
                specifications: { 'Al2O3': { value: '≥70', unit: '%', label: 'Al₂O₃含量' }, 'refractoriness': { value: '≥1780', unit: '℃', label: '耐火度' } },
                features: ['流动性好，施工方便', '高温强度优异', '抗侵蚀性能好'],
                applications: ['钢铁工业：包钢包、中间包', '水泥工业：回转窑', '石化工业：加热炉'],
                documents: { technicalSpec: { available: true, filename: 'alumina-castable-tech-spec.pdf', description: '高铝浇注料技术规格表' } }
            },

            // 特种耐火材料
            'corundum-ball': {
                name: '刚玉球', englishName: 'Corundum Ball', category: 'special', subcategory: 'corundum-series',
                specifications: { 'Al2O3': { value: '≥99', unit: '%', label: 'Al₂O₃含量' }, 'bulkDensity': { value: '≥3.85', unit: 'g/cm³', label: '体积密度' } },
                features: ['超高纯度', '高密度', '优异耐磨性'],
                applications: ['研磨介质', '高温球磨', '特殊工艺'],
                documents: { technicalSpec: { available: false, filename: 'corundum-ball-tech-spec.pdf', description: '刚玉球技术规格表' } }
            },

            'ceramic-honeycomb-regenerator': {
                name: '陶瓷蜂窝蓄热体', englishName: 'Ceramic Honeycomb Regenerator', category: 'special', subcategory: 'regenerator-series',
                specifications: { 'workingTemp': { value: '≤1400', unit: '℃', label: '使用温度' }, 'thermalShock': { value: '≥50', unit: '次', label: '热震稳定性' } },
                features: ['蜂窝结构', '高比表面积', '优异蓄热性能'],
                applications: ['蓄热燃烧系统', '热交换设备', '节能装置'],
                documents: { technicalSpec: { available: false, filename: 'ceramic-honeycomb-regenerator-tech-spec.pdf', description: '陶瓷蜂窝蓄热体技术规格表' } }
            },

            // 保温材料系列
            'insulating-material': {
                name: '保温材料', englishName: 'Insulating Material', category: 'insulating', subcategory: 'general',
                specifications: { 'maxTemp': { value: '≤1200', unit: '℃', label: '最高使用温度' }, 'thermalConductivity': { value: '≤0.3', unit: 'W/m·K', label: '导热系数' } },
                features: ['导热系数极低', '轻质高效', '节能环保'],
                applications: ['炉体保温', '管道保温', '设备隔热'],
                documents: { technicalSpec: { available: false, filename: 'insulating-material-tech-spec.pdf', description: '保温材料技术规格表' } }
            },

            'thermal-insulation-brick': {
                name: '隔热砖', englishName: 'Thermal Insulation Brick', category: 'insulating', subcategory: 'brick',
                specifications: { 'maxTemp': { value: '≤1000', unit: '℃', label: '最高使用温度' }, 'bulkDensity': { value: '≤0.8', unit: 'g/cm³', label: '体积密度' } },
                features: ['轻质隔热', '导热系数低', '施工方便'],
                applications: ['工业炉保温', '管道隔热', '建筑保温'],
                documents: { technicalSpec: { available: false, filename: 'thermal-insulation-brick-tech-spec.pdf', description: '隔热砖技术规格表' } }
            },

            'wear-resistant-ceramic': {
                name: '耐磨陶瓷', englishName: 'Wear Resistant Ceramic', category: 'special', subcategory: 'ceramic',
                specifications: { 'hardness': { value: '≥85', unit: 'HRA', label: '洛氏硬度' }, 'density': { value: '≥3.6', unit: 'g/cm³', label: '密度' } },
                features: ['超高硬度', '耐磨损', '长使用寿命'],
                applications: ['磨损设备衬里', '输送系统', '耐磨部件'],
                documents: { technicalSpec: { available: false, filename: 'wear-resistant-ceramic-tech-spec.pdf', description: '耐磨陶瓷技术规格表' } }
            }
        };
    }

    /**
     * 获取产品信息
     */
    getProduct(productId) {
        return this.products[productId] || null;
    }

    /**
     * 获取产品技术规格
     */
    getProductSpecifications(productId) {
        const product = this.getProduct(productId);
        return product ? product.specifications : null;
    }

    /**
     * 获取产品可用文档列表
     */
    getAvailableDocuments(productId) {
        const product = this.getProduct(productId);
        if (!product || !product.documents) return [];

        return Object.entries(product.documents)
            .filter(([key, doc]) => doc.available)
            .map(([key, doc]) => ({
                key,
                filename: doc.filename,
                description: doc.description
            }));
    }

    /**
     * 检查文档是否可用
     */
    isDocumentAvailable(productId, documentType) {
        const product = this.getProduct(productId);
        if (!product || !product.documents || !product.documents[documentType]) {
            return false;
        }
        return product.documents[documentType].available;
    }

    /**
     * 获取产品特点
     */
    getProductFeatures(productId) {
        const product = this.getProduct(productId);
        return product ? product.features : [];
    }

    /**
     * 获取产品应用领域
     */
    getProductApplications(productId) {
        const product = this.getProduct(productId);
        return product ? product.applications : [];
    }

    /**
     * 获取所有产品列表
     */
    getAllProducts() {
        return Object.keys(this.products).map(id => ({
            id,
            name: this.products[id].name,
            englishName: this.products[id].englishName,
            category: this.products[id].category
        }));
    }

    /**
     * 按类别获取产品
     */
    getProductsByCategory(category) {
        return Object.entries(this.products)
            .filter(([id, product]) => product.category === category)
            .map(([id, product]) => ({
                id,
                name: product.name,
                englishName: product.englishName
            }));
    }

    /**
     * 根据中文名称获取产品
     */
    getProductByChineseName(chineseName) {
        const entries = Object.entries(this.products);
        for (const [id, product] of entries) {
            if (product.name === chineseName) {
                return { id, ...product };
            }
        }
        return null;
    }

    /**
     * 搜索产品
     */
    searchProducts(keyword) {
        const results = [];
        const lowerKeyword = keyword.toLowerCase();

        Object.entries(this.products).forEach(([id, product]) => {
            if (product.name.toLowerCase().includes(lowerKeyword) ||
                product.englishName.toLowerCase().includes(lowerKeyword)) {
                results.push({
                    id,
                    name: product.name,
                    englishName: product.englishName,
                    category: product.category
                });
            }
        });

        return results;
    }
}

// 全局实例化
window.ProductDatabase = new ProductDatabase();

// 暴露常用方法
window.getProductInfo = (productId) => window.ProductDatabase.getProduct(productId);
window.getProductByName = (chineseName) => window.ProductDatabase.getProductByChineseName(chineseName);
window.getProductSpecs = (productId) => window.ProductDatabase.getProductSpecifications(productId);
window.getAvailableDocs = (productId) => window.ProductDatabase.getAvailableDocuments(productId);
window.isDocAvailable = (productId, docType) => window.ProductDatabase.isDocumentAvailable(productId, docType);