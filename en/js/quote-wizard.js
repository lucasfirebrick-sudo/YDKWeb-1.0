/* ========== Multi-step Quote Wizard JavaScript Component ========== */

class QuoteWizard {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 3;
        this.selectedProduct = null;
        this.quoteNumber = null;
        this.init();
    }

    // Product Image Mapping
    getProductImage(productName) {
        const imageMap = {
            // Shaped Refractory Materials
            'Clay Brick': 'images/images/products/clay-brick-real.png',
            'Lightweight Clay Brick': 'images/images/products/lightweight-clay-brick-1.png',
            'High Alumina Brick': 'images/images/products/high-alumina-brick-1.png',
            'Lightweight High Alumina Brick': 'images/images/products/lightweight-high-alumina-brick-1.png',
            'Silica Brick': 'images/images/products/silica-brick-1.png',
            'Lightweight Silica Brick': 'images/images/products/lightweight-silica-brick-1.png',
            'Mullite Brick': 'images/images/products/mullite-brick-1.png',
            'Lightweight Mullite Brick': 'images/images/products/lightweight-mullite-brick-1.png',
            'Corundum Brick': 'images/images/products/corundum-brick-1.png',
            'Magnesia Chrome Brick': 'images/images/products/magnesia-chrome-brick-1.png',
            'Alumina Hollow Sphere Brick': 'images/images/products/alumina-hollow-sphere-brick-1.png',
            'Combination Brick': 'images/images/products/combination-brick-1.png',

            // Unshaped Refractory Materials
            'High Alumina Castable': 'images/images/products/high-alumina-castable-1.png',
            'Corundum Castable': 'images/images/products/alumina-castable-1.png',
            'Chrome Corundum Castable': 'images/images/products/chrome-corundum-castable-1.png',
            'Steel Fiber Castable': 'images/images/products/steel-fiber-castable-1.png',
            'Low Cement Castable': 'images/images/products/low-cement-castable-1.png',
            'Self-flowing Castable': 'images/images/products/self-flowing-castable-1.png',
            'Lightweight Castable': 'images/images/products/lightweight-castable-1.png',
            'Plastic Refractory': 'images/images/products/plastic-refractory-1.png',
            'Ramming Mass': 'images/images/products/ramming-mass-1.png',
            'Spraying Mass': 'images/images/products/spraying-mass-1.png',

            // Special Refractory Materials
            'Corundum Ball': 'images/images/products/corundum-ball-1.png',
            'Blast Furnace Ceramic Cup': 'images/images/products/blast-furnace-ceramic-cup-1.png',
            'Coke Oven Brick': 'images/images/products/coke-oven-brick-1.png',
            'Glass Furnace Brick': 'images/images/products/glass-furnace-brick-1.png'
        };
        return imageMap[productName] || 'images/images/products/clay-brick-real.png';
    }

    // Product Specifications Mapping
    getProductSpecs(productName) {
        const specsMap = {
            // Shaped Refractory Materials
            'Clay Brick': {
                'Al₂O₃ Content': '30-40%',
                'Refractoriness': '≥1690°C',
                'Bulk Density': '2.0-2.2 g/cm³',
                'Cold Crushing Strength': '≥20 MPa'
            },
            'Lightweight Clay Brick': {
                'Al₂O₃ Content': '30-40%',
                'Bulk Density': '≤1.0 g/cm³',
                'Refractoriness': '≥1650°C',
                'Thermal Conductivity': '≤0.55 W/(m·K)'
            },
            'High Alumina Brick': {
                'Al₂O₃ Content': '≥75%',
                'Refractoriness': '≥1790°C',
                'Bulk Density': '2.3-2.6 g/cm³',
                'Cold Crushing Strength': '≥60 MPa'
            },
            'Lightweight High Alumina Brick': {
                'Al₂O₃ Content': '≥75%',
                'Bulk Density': '0.4-1.3 g/cm³',
                'Refractoriness': '≥1790°C',
                'Cold Crushing Strength': '≥1.0 MPa'
            },
            'Silica Brick': {
                'SiO₂ Content': '≥96%',
                'Refractoriness': '≥1690°C',
                'Bulk Density': '1.8-1.95 g/cm³',
                'Cold Crushing Strength': '≥20 MPa'
            },
            'Mullite Brick': {
                'Al₂O₃ Content': '70-80%',
                'Refractoriness': '≥1850°C',
                'Bulk Density': '2.5-2.8 g/cm³',
                'Thermal Shock Resistance': 'Excellent'
            },
            'Corundum Brick': {
                'Al₂O₃ Content': '≥90%',
                'Refractoriness': '≥1900°C',
                'Bulk Density': '3.0-3.3 g/cm³',
                'High Temperature Strength': 'Excellent'
            },

            // Unshaped Refractory Materials
            'High Alumina Castable': {
                'Al₂O₃ Content': '50-80%',
                'Service Temperature': '1350-1650°C',
                'Cold Crushing Strength': '≥40 MPa',
                'Application Method': 'Casting'
            },
            'Corundum Castable': {
                'Al₂O₃ Content': '≥90%',
                'Service Temperature': '≤1700°C',
                'Cold Crushing Strength': '≥80 MPa',
                'Abrasion Resistance': 'Excellent'
            },
            'Chrome Corundum Castable': {
                'Al₂O₃+Cr₂O₃': '≥90%',
                'Service Temperature': '≤1800°C',
                'Slag Resistance': 'Strong',
                'Spalling Resistance': 'Excellent'
            },
            'Steel Fiber Castable': {
                'Steel Fiber Content': '2-5%',
                'Impact Resistance': 'Excellent',
                'Toughness': 'Strong',
                'Spalling Resistance': 'Excellent'
            },
            'Lightweight Castable': {
                'Bulk Density': '0.4-1.8 g/cm³',
                'Thermal Conductivity': 'Low',
                'Insulation Performance': 'Excellent',
                'Service Temperature': '≤1400°C'
            },
            'Plastic Refractory': {
                'Plasticity': 'Excellent',
                'Application Method': 'Ramming',
                'Bonding Strength': 'High',
                'Refractoriness': '≥1650°C'
            }
        };
        return specsMap[productName] || {
            'Material': 'Premium Refractory Material',
            'Refractoriness': 'Excellent High Temperature Performance',
            'Quality': 'Reliable Quality',
            'Application': 'Industrial Furnaces'
        };
    }

    // Initialize component
    init() {
        this.createModal();
        this.bindEvents();
    }

    // Create modal HTML
    createModal() {
        const modalHTML = `
        <div id="quote-wizard-modal" class="quote-modal">
            <div class="quote-wizard">
                <div class="wizard-header">
                    <button class="wizard-close" onclick="closeQuoteWizard()">&times;</button>
                    <h2 class="wizard-title">Get Product Quote</h2>
                    <p class="wizard-subtitle">Please fill in the following information and we will provide you with a professional quote</p>
                </div>

                <div class="step-indicator">
                    <div class="step active" data-step="1">
                        <div class="step-number">1</div>
                        <div class="step-label">Product Config</div>
                    </div>
                    <div class="step-line"></div>
                    <div class="step" data-step="2">
                        <div class="step-number">2</div>
                        <div class="step-label">Customer Info</div>
                    </div>
                    <div class="step-line"></div>
                    <div class="step" data-step="3">
                        <div class="step-number">3</div>
                        <div class="step-label">Submit Success</div>
                    </div>
                </div>

                <div class="wizard-content">
                    <!-- Step 1: Product Configuration -->
                    <div id="step-1" class="step-content active">
                        <div class="product-summary">
                            <h3 id="selected-product-name">Select Product</h3>
                            <div style="display: flex; gap: 20px; margin-top: 15px;">
                                <img id="selected-product-image" src="" alt="Product Image"
                                     style="width: 120px; height: 90px; object-fit: cover; border-radius: 6px; display: none;">
                                <div id="product-specs" style="flex: 1;"></div>
                            </div>
                        </div>

                        <div class="form-group">
                            <label>Required Quantity <span class="required">*</span></label>
                            <div class="quantity-input">
                                <button type="button" class="quantity-btn" onclick="adjustQuantity(-1)">-</button>
                                <span class="quantity-value" id="quantity-display">1</span>
                                <button type="button" class="quantity-btn" onclick="adjustQuantity(1)">+</button>
                            </div>
                            <input type="hidden" id="quantity-input" value="1">
                        </div>

                        <div class="form-group">
                            <label>Application Industry</label>
                            <select id="industry-select">
                                <option value="">Please select application industry (optional)</option>
                                <option value="Steel & Metallurgy">Steel & Metallurgy</option>
                                <option value="Non-ferrous Metals">Non-ferrous Metals</option>
                                <option value="Building Materials & Cement">Building Materials & Cement</option>
                                <option value="Petrochemical">Petrochemical</option>
                                <option value="Power & Energy">Power & Energy</option>
                                <option value="Glass & Ceramics">Glass & Ceramics</option>
                                <option value="Others">Others</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label>Remarks</label>
                            <textarea id="remarks-input" rows="3" placeholder="Please describe your specific requirements, technical specifications, etc..."></textarea>
                        </div>
                    </div>

                    <!-- Step 2: Customer Information -->
                    <div id="step-2" class="step-content">
                        <div class="form-row">
                            <div class="form-group">
                                <label>Name <span class="required">*</span></label>
                                <input type="text" id="customer-name" placeholder="Please enter your name">
                            </div>
                            <div class="form-group">
                                <label>Email <span class="required">*</span></label>
                                <input type="email" id="customer-email" placeholder="Please enter your email">
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label>Company Name</label>
                                <input type="text" id="customer-company" placeholder="Please enter company name (optional)">
                            </div>
                            <div class="form-group">
                                <label>Phone Number</label>
                                <input type="tel" id="customer-phone" placeholder="Please enter phone number (optional)">
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label>Country/Region</label>
                                <select id="customer-country">
                                    <option value="">Please select country/region</option>
                                    <option value="China">China</option>
                                    <option value="India">India</option>
                                    <option value="United States">United States</option>
                                    <option value="Indonesia">Indonesia</option>
                                    <option value="Brazil">Brazil</option>
                                    <option value="Pakistan">Pakistan</option>
                                    <option value="Nigeria">Nigeria</option>
                                    <option value="Bangladesh">Bangladesh</option>
                                    <option value="Russia">Russia</option>
                                    <option value="Mexico">Mexico</option>
                                    <option value="Japan">Japan</option>
                                    <option value="Philippines">Philippines</option>
                                    <option value="Ethiopia">Ethiopia</option>
                                    <option value="Vietnam">Vietnam</option>
                                    <option value="Egypt">Egypt</option>
                                    <option value="Germany">Germany</option>
                                    <option value="Turkey">Turkey</option>
                                    <option value="Iran">Iran</option>
                                    <option value="Thailand">Thailand</option>
                                    <option value="United Kingdom">United Kingdom</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>City</label>
                                <input type="text" id="customer-city" placeholder="Please enter your city (optional)">
                            </div>
                        </div>
                    </div>

                    <!-- Step 3: Success Page -->
                    <div id="step-3" class="step-content">
                        <div class="success-content">
                            <div class="success-icon">✓</div>
                            <h3 class="success-title">Quote Request Submitted Successfully!</h3>
                            <p class="success-message">
                                Thank you for your inquiry! We have received your requirements,<br>
                                Our professional sales team will contact you within 24 hours.
                            </p>
                            <div class="quote-number">
                                <strong>Quote Number: <span id="quote-ref-number">QT2024001</span></strong>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="wizard-navigation">
                    <button type="button" class="btn btn-secondary" id="prev-btn" onclick="prevStep()" style="display: none;">
                        Previous
                    </button>
                    <div style="flex: 1;"></div>
                    <button type="button" class="btn btn-primary" id="next-btn" onclick="nextStep()">
                        Next
                    </button>
                </div>
            </div>
        </div>`;

        // Add modal to page
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    // Bind events
    bindEvents() {
        // ESC key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen()) {
                this.close();
            }
        });

        // Click overlay to close
        const modal = document.getElementById('quote-wizard-modal');
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.close();
            }
        });
    }

    // Open wizard
    open(productName = '') {
        this.selectedProduct = productName;
        this.currentStep = 1;
        this.updateProductDisplay();
        this.updateStepDisplay();

        const modal = document.getElementById('quote-wizard-modal');
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    // Close wizard
    close() {
        const modal = document.getElementById('quote-wizard-modal');
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
        this.resetForm();
    }

    // Check if open
    isOpen() {
        const modal = document.getElementById('quote-wizard-modal');
        return modal && modal.classList.contains('show');
    }

    // Update product display
    updateProductDisplay() {
        const nameEl = document.getElementById('selected-product-name');
        const imageEl = document.getElementById('selected-product-image');
        const specsEl = document.getElementById('product-specs');

        if (this.selectedProduct) {
            nameEl.textContent = this.selectedProduct;

            // Set product image
            const imagePath = this.getProductImage(this.selectedProduct);
            imageEl.src = imagePath;
            imageEl.style.display = 'block';

            // Set product specifications
            const specs = this.getProductSpecs(this.selectedProduct);
            let specsHTML = '<div style="font-size: 0.9em; color: #666;">';
            for (const [key, value] of Object.entries(specs)) {
                specsHTML += `<div style="margin-bottom: 5px;"><strong>${key}:</strong> ${value}</div>`;
            }
            specsHTML += '</div>';
            specsEl.innerHTML = specsHTML;
        }
    }

    // Next step
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

    // Previous step
    prevStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.updateStepDisplay();
        }
    }

    // Validate current step
    validateCurrentStep() {
        if (this.currentStep === 1) {
            const quantity = document.getElementById('quantity-input').value;
            if (!quantity || quantity < 1) {
                alert('Please set the required quantity');
                return false;
            }
        } else if (this.currentStep === 2) {
            const name = document.getElementById('customer-name').value.trim();
            const email = document.getElementById('customer-email').value.trim();

            if (!name) {
                alert('Please enter your name');
                return false;
            }
            if (!email) {
                alert('Please enter your email');
                return false;
            }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                alert('Please enter a valid email address');
                return false;
            }
        }
        return true;
    }

    // Update step display
    updateStepDisplay() {
        // Update step indicator
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
            nextBtn.textContent = 'Complete';
            nextBtn.className = 'btn btn-success';
            nextBtn.onclick = () => this.completeQuote();
            nextBtn.style.display = 'block';
        } else {
            prevBtn.style.display = this.currentStep > 1 ? 'block' : 'none';

            if (this.currentStep === this.totalSteps - 1) {
                nextBtn.textContent = 'Submit Request';
                nextBtn.className = 'btn btn-success';
                nextBtn.onclick = () => this.nextStep();
            } else {
                nextBtn.textContent = 'Next';
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
        console.log('Quote request submitted:', {
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