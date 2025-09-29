/* ========== 多步骤报价向导 JavaScript 组件 ========== */

class QuoteWizard {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 3;
        this.selectedProduct = null;
        this.quoteNumber = null;
        this.init();
    }

    // 产品图片映射
    getProductImage(productName) {
        const imageMap = {
            // 定形耐火材料
            '粘土砖': 'images/products/clay-brick-real.png',
            '轻质粘土砖': 'images/products/lightweight-clay-brick-1.png',
            '高铝砖': 'images/products/high-alumina-brick-1.png',
            '轻质高铝砖': 'images/products/lightweight-high-alumina-brick-1.png',
            '硅砖': 'images/products/silica-brick-1.png',
            '轻质硅砖': 'images/products/lightweight-silica-brick-1.png',
            '莫来石砖': 'images/products/mullite-brick-1.png',
            '轻质莫来石砖': 'images/products/lightweight-mullite-brick-1.png',
            '刚玉砖': 'images/products/corundum-brick-1.png',
            '镁铬砖': 'images/products/magnesia-chrome-brick-1.png',
            '氧化铝空心球砖': 'images/products/alumina-hollow-sphere-brick-1.png',
            '组合砖': 'images/products/combination-brick-1.png',

            // 不定形耐火材料
            '高铝浇注料': 'images/products/high-alumina-castable-1.png',
            '刚玉浇注料': 'images/products/alumina-castable-1.png',
            '铬刚玉浇注料': 'images/products/chrome-corundum-castable-1.png',
            '钢纤维浇注料': 'images/products/steel-fiber-castable-1.png',
            '低水泥浇注料': 'images/products/low-cement-castable-1.png',
            '自流浇注料': 'images/products/self-flowing-castable-1.png',
            '轻质浇注料': 'images/products/lightweight-castable-1.png',
            '可塑料': 'images/products/plastic-refractory-1.png',
            '捣打料': 'images/products/ramming-mass-1.png',
            '喷涂料': 'images/products/spraying-mass-1.png',

            // 特种耐火材料
            '刚玉球': 'images/products/corundum-ball-1.png',
            '高炉陶瓷杯': 'images/products/blast-furnace-ceramic-cup-1.png',
            '焦炉砖': 'images/products/coke-oven-brick-1.png',
            '玻璃窑用砖': 'images/products/glass-furnace-brick-1.png'
        };
        return imageMap[productName] || 'images/products/clay-brick-real.png';
    }

    // 产品规格映射
    getProductSpecs(productName) {
        const specsMap = {
            // 定形耐火材料
            '粘土砖': {
                'Al₂O₃含量': '30-40%',
                '耐火度': '≥1690°C',
                '体积密度': '2.0-2.2 g/cm³',
                '抗压强度': '≥20 MPa'
            },
            '轻质粘土砖': {
                'Al₂O₃含量': '30-40%',
                '体积密度': '≤1.0 g/cm³',
                '耐火度': '≥1650°C',
                '导热系数': '≤0.55 W/(m·K)'
            },
            '高铝砖': {
                'Al₂O₃含量': '≥75%',
                '耐火度': '≥1790°C',
                '体积密度': '2.3-2.6 g/cm³',
                '抗压强度': '≥60 MPa'
            },
            '轻质高铝砖': {
                'Al₂O₃含量': '≥75%',
                '体积密度': '0.4-1.3 g/cm³',
                '耐火度': '≥1790°C',
                '抗压强度': '≥1.0 MPa'
            },
            '硅砖': {
                'SiO₂含量': '≥96%',
                '耐火度': '≥1690°C',
                '体积密度': '1.8-1.95 g/cm³',
                '抗压强度': '≥20 MPa'
            },
            '莫来石砖': {
                'Al₂O₃含量': '70-80%',
                '耐火度': '≥1850°C',
                '体积密度': '2.5-2.8 g/cm³',
                '抗热震性': '优异'
            },
            '刚玉砖': {
                'Al₂O₃含量': '≥90%',
                '耐火度': '≥1900°C',
                '体积密度': '3.0-3.3 g/cm³',
                '高温强度': '优异'
            },

            // 不定形耐火材料
            '高铝浇注料': {
                'Al₂O₃含量': '50-80%',
                '使用温度': '1350-1650°C',
                '抗压强度': '≥40 MPa',
                '施工方式': '浇注成型'
            },
            '刚玉浇注料': {
                'Al₂O₃含量': '≥90%',
                '使用温度': '≤1700°C',
                '抗压强度': '≥80 MPa',
                '耐磨性': '优异'
            },
            '铬刚玉浇注料': {
                'Al₂O₃+Cr₂O₃': '≥90%',
                '使用温度': '≤1800°C',
                '抗渣性': '强',
                '抗剥落性': '优异'
            },
            '钢纤维浇注料': {
                '钢纤维含量': '2-5%',
                '抗冲击性': '优异',
                '韧性': '强',
                '抗剥落性': '优异'
            },
            '轻质浇注料': {
                '体积密度': '0.4-1.8 g/cm³',
                '导热系数': '低',
                '保温性能': '优异',
                '使用温度': '≤1400°C'
            },
            '可塑料': {
                '可塑性': '优异',
                '施工方式': '捣打',
                '结合强度': '高',
                '耐火度': '≥1650°C'
            }
        };
        return specsMap[productName] || {
            '材质': '优质耐火材料',
            '耐火度': '高温性能优异',
            '品质': '质量可靠',
            '应用': '工业窑炉'
        };
    }

    // 初始化组件
    init() {
        this.createModal();
        this.bindEvents();
    }

    // 创建模态框HTML
    createModal() {
        const modalHTML = `
        <div id="quote-wizard-modal" class="quote-modal">
            <div class="quote-wizard">
                <div class="wizard-header">
                    <button class="wizard-close" onclick="closeQuoteWizard()">&times;</button>
                    <h2 class="wizard-title">获取产品报价</h2>
                    <p class="wizard-subtitle">请填写以下信息，我们将为您提供专业报价</p>
                </div>

                <div class="step-indicator">
                    <div class="step active" data-step="1">
                        <div class="step-number">1</div>
                        <div class="step-label">产品配置</div>
                    </div>
                    <div class="step-line"></div>
                    <div class="step" data-step="2">
                        <div class="step-number">2</div>
                        <div class="step-label">客户信息</div>
                    </div>
                    <div class="step-line"></div>
                    <div class="step" data-step="3">
                        <div class="step-number">3</div>
                        <div class="step-label">提交成功</div>
                    </div>
                </div>

                <div class="wizard-content">
                    <!-- 第一步：产品配置 -->
                    <div id="step-1" class="step-content active">
                        <div class="product-summary">
                            <h3 id="selected-product-name">选择产品</h3>
                            <div style="display: flex; gap: 20px; margin-top: 15px;">
                                <img id="selected-product-image" src="" alt="产品图片"
                                     style="width: 120px; height: 90px; object-fit: cover; border-radius: 6px; display: none;">
                                <div id="product-specs" style="flex: 1;"></div>
                            </div>
                        </div>

                        <div class="form-group">
                            <label>需求数量 <span class="required">*</span></label>
                            <div class="quantity-input">
                                <button type="button" class="quantity-btn" onclick="adjustQuantity(-1)">-</button>
                                <span class="quantity-value" id="quantity-display">1</span>
                                <button type="button" class="quantity-btn" onclick="adjustQuantity(1)">+</button>
                            </div>
                            <input type="hidden" id="quantity-input" value="1">
                        </div>

                        <div class="form-group">
                            <label>应用行业</label>
                            <select id="industry-select">
                                <option value="">请选择应用行业（可选）</option>
                                <option value="钢铁冶金">钢铁冶金</option>
                                <option value="有色金属">有色金属</option>
                                <option value="建材水泥">建材水泥</option>
                                <option value="石化化工">石化化工</option>
                                <option value="电力能源">电力能源</option>
                                <option value="玻璃陶瓷">玻璃陶瓷</option>
                                <option value="其他">其他</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label>备注说明</label>
                            <textarea id="remarks-input" rows="3" placeholder="请描述您的具体需求、技术要求等..."></textarea>
                        </div>
                    </div>

                    <!-- 第二步：客户信息 -->
                    <div id="step-2" class="step-content">
                        <div class="form-row">
                            <div class="form-group">
                                <label>姓名 <span class="required">*</span></label>
                                <input type="text" id="customer-name" placeholder="请输入您的姓名">
                            </div>
                            <div class="form-group">
                                <label>邮箱 <span class="required">*</span></label>
                                <input type="email" id="customer-email" placeholder="请输入您的邮箱">
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label>公司名称</label>
                                <input type="text" id="customer-company" placeholder="请输入公司名称（可选）">
                            </div>
                            <div class="form-group">
                                <label>联系电话</label>
                                <input type="tel" id="customer-phone" placeholder="请输入联系电话（可选）">
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label>国家/地区</label>
                                <select id="customer-country">
                                    <option value="">请选择国家/地区</option>
                                    <option value="China">中国 China</option>
                                    <option value="India">印度 India</option>
                                    <option value="United States">美国 United States</option>
                                    <option value="Indonesia">印度尼西亚 Indonesia</option>
                                    <option value="Brazil">巴西 Brazil</option>
                                    <option value="Pakistan">巴基斯坦 Pakistan</option>
                                    <option value="Nigeria">尼日利亚 Nigeria</option>
                                    <option value="Bangladesh">孟加拉国 Bangladesh</option>
                                    <option value="Russia">俄罗斯 Russia</option>
                                    <option value="Mexico">墨西哥 Mexico</option>
                                    <option value="Japan">日本 Japan</option>
                                    <option value="Philippines">菲律宾 Philippines</option>
                                    <option value="Ethiopia">埃塞俄比亚 Ethiopia</option>
                                    <option value="Vietnam">越南 Vietnam</option>
                                    <option value="Egypt">埃及 Egypt</option>
                                    <option value="Germany">德国 Germany</option>
                                    <option value="Turkey">土耳其 Turkey</option>
                                    <option value="Iran">伊朗 Iran</option>
                                    <option value="Thailand">泰国 Thailand</option>
                                    <option value="United Kingdom">英国 United Kingdom</option>
                                    <option value="Other">其他 Other</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>城市</label>
                                <input type="text" id="customer-city" placeholder="请输入所在城市（可选）">
                            </div>
                        </div>
                    </div>

                    <!-- 第三步：成功页面 -->
                    <div id="step-3" class="step-content">
                        <div class="success-content">
                            <div class="success-icon">✓</div>
                            <h3 class="success-title">报价申请提交成功！</h3>
                            <p class="success-message">
                                感谢您的询价申请！我们已收到您的需求信息，<br>
                                专业销售团队将在24小时内与您联系。
                            </p>
                            <div class="quote-number">
                                <strong>询价编号：<span id="quote-ref-number">QT2024001</span></strong>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="wizard-navigation">
                    <button type="button" class="btn btn-secondary" id="prev-btn" onclick="prevStep()" style="display: none;">
                        上一步
                    </button>
                    <div style="flex: 1;"></div>
                    <button type="button" class="btn btn-primary" id="next-btn" onclick="nextStep()">
                        下一步
                    </button>
                </div>
            </div>
        </div>`;

        // 将模态框添加到页面
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    // 绑定事件
    bindEvents() {
        // ESC键关闭
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen()) {
                this.close();
            }
        });

        // 点击遮罩关闭
        const modal = document.getElementById('quote-wizard-modal');
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.close();
            }
        });
    }

    // 打开向导
    open(productName = '') {
        this.selectedProduct = productName;
        this.currentStep = 1;
        this.updateProductDisplay();
        this.updateStepDisplay();

        const modal = document.getElementById('quote-wizard-modal');
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    // 关闭向导
    close() {
        const modal = document.getElementById('quote-wizard-modal');
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
        this.resetForm();
    }

    // 检查是否打开
    isOpen() {
        const modal = document.getElementById('quote-wizard-modal');
        return modal && modal.classList.contains('show');
    }

    // 更新产品显示
    updateProductDisplay() {
        const nameEl = document.getElementById('selected-product-name');
        const imageEl = document.getElementById('selected-product-image');
        const specsEl = document.getElementById('product-specs');

        if (this.selectedProduct) {
            nameEl.textContent = this.selectedProduct;

            // 设置产品图片
            const imagePath = this.getProductImage(this.selectedProduct);
            imageEl.src = imagePath;
            imageEl.style.display = 'block';

            // 设置产品规格
            const specs = this.getProductSpecs(this.selectedProduct);
            let specsHTML = '<div style="font-size: 0.9em; color: #666;">';
            for (const [key, value] of Object.entries(specs)) {
                specsHTML += `<div style="margin-bottom: 5px;"><strong>${key}:</strong> ${value}</div>`;
            }
            specsHTML += '</div>';
            specsEl.innerHTML = specsHTML;
        }
    }

    // 下一步
    nextStep() {
        if (this.currentStep < this.totalSteps) {
            if (this.validateCurrentStep()) {
                this.currentStep++;
                if (this.currentStep === this.totalSteps) {
                    this.submitQuote();
                }
                this.updateStepDisplay();
            }
        }
    }

    // 上一步
    prevStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.updateStepDisplay();
        }
    }

    // 验证当前步骤
    validateCurrentStep() {
        if (this.currentStep === 1) {
            const quantity = document.getElementById('quantity-input').value;
            if (!quantity || quantity < 1) {
                alert('请设置需求数量');
                return false;
            }
        } else if (this.currentStep === 2) {
            const name = document.getElementById('customer-name').value.trim();
            const email = document.getElementById('customer-email').value.trim();

            if (!name) {
                alert('请填写姓名');
                return false;
            }
            if (!email) {
                alert('请填写邮箱');
                return false;
            }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                alert('请输入有效的邮箱地址');
                return false;
            }
        }
        return true;
    }

    // 更新步骤显示
    updateStepDisplay() {
        // 更新步骤指示器
        const steps = document.querySelectorAll('.step');
        steps.forEach((step, index) => {
            const stepNum = index + 1;
            step.classList.remove('active', 'completed');

            if (stepNum < this.currentStep) {
                step.classList.add('completed');
            } else if (stepNum === this.currentStep) {
                step.classList.add('active');
            }
        });

        // 更新步骤内容
        const contents = document.querySelectorAll('.step-content');
        contents.forEach((content, index) => {
            content.classList.remove('active');
            if (index + 1 === this.currentStep) {
                content.classList.add('active');
            }
        });

        // 更新导航按钮
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');

        // 在第3步（成功页面）时，隐藏"上一步"按钮
        if (this.currentStep === this.totalSteps) {
            prevBtn.style.display = 'none';
            nextBtn.textContent = '完成';
            nextBtn.className = 'btn btn-success';
            nextBtn.onclick = () => this.completeQuote();
            nextBtn.style.display = 'block';
        } else {
            prevBtn.style.display = this.currentStep > 1 ? 'block' : 'none';

            if (this.currentStep === this.totalSteps - 1) {
                nextBtn.textContent = '提交申请';
                nextBtn.className = 'btn btn-success';
                nextBtn.onclick = () => this.nextStep();
            } else {
                nextBtn.textContent = '下一步';
                nextBtn.className = 'btn btn-primary';
                nextBtn.onclick = () => this.nextStep();
            }
            nextBtn.style.display = 'block';
        }
    }

    // 提交报价
    submitQuote() {
        this.quoteNumber = 'QT' + Date.now().toString().slice(-8);
        document.getElementById('quote-ref-number').textContent = this.quoteNumber;

        // 这里可以添加实际的表单提交逻辑
        console.log('报价申请已提交:', {
            product: this.selectedProduct,
            quantity: document.getElementById('quantity-input').value,
            industry: document.getElementById('industry-select').value,
            remarks: document.getElementById('remarks-input').value,
            name: document.getElementById('customer-name').value,
            email: document.getElementById('customer-email').value,
            company: document.getElementById('customer-company').value,
            phone: document.getElementById('customer-phone').value,
            country: document.getElementById('customer-country').value,
            city: document.getElementById('customer-city').value,
            quoteNumber: this.quoteNumber
        });
    }

    // 重置表单
    resetForm() {
        this.currentStep = 1;
        this.selectedProduct = null;
        this.quoteNumber = null;

        // 重置所有输入
        document.getElementById('quantity-input').value = '1';
        document.getElementById('quantity-display').textContent = '1';
        document.getElementById('industry-select').value = '';
        document.getElementById('remarks-input').value = '';
        document.getElementById('customer-name').value = '';
        document.getElementById('customer-email').value = '';
        document.getElementById('customer-company').value = '';
        document.getElementById('customer-phone').value = '';
        document.getElementById('customer-country').value = '';
        document.getElementById('customer-city').value = '';

        this.updateStepDisplay();
    }

    // 完成向导并关闭
    completeQuote() {
        this.close();
        // 重置为第一步，为下次使用做准备
        this.currentStep = 1;
        this.updateStepDisplay();
    }
}

// 数量调整函数
function adjustQuantity(delta) {
    const quantityDisplay = document.getElementById('quantity-display');
    const quantityInput = document.getElementById('quantity-input');
    let current = parseInt(quantityInput.value) || 1;
    current = Math.max(1, current + delta);
    quantityDisplay.textContent = current;
    quantityInput.value = current;
}

// 全局向导实例
let quoteWizard;

// 全局函数 - 兼容现有调用
function openQuoteWizard(productName) {
    if (!quoteWizard) {
        quoteWizard = new QuoteWizard();
    }
    quoteWizard.open(productName);
}

function closeQuoteWizard() {
    if (quoteWizard) {
        quoteWizard.close();
    }
}

function nextStep() {
    if (quoteWizard) {
        quoteWizard.nextStep();
    }
}

function prevStep() {
    if (quoteWizard) {
        quoteWizard.prevStep();
    }
}

// 兼容现有按钮调用的函数名
function openGetQuote(productName) {
    openQuoteWizard(productName);
}

function openInquiryModal(productId) {
    openQuoteWizard(productId);
}

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    quoteWizard = new QuoteWizard();
});