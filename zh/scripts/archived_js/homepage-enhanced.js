// 主页增强功能 JavaScript
// Homepage Enhanced Features

document.addEventListener('DOMContentLoaded', function() {

    // 初始化所有增强功能
    initHeroSlider();
    initSmartProductSelector();
    initProductShowcase();
    initCustomerStories();
    initNewsTabs();
    initApplicationSwitcher();
    initDashboard();
    initScrollAnimations();
    initCounters();
    initMapInteractions();
    initTabSwitching();
    initProductFilters();

    // 英雄轮播图功能
    function initHeroSlider() {
        const heroSlider = document.querySelector('.hero-slider');
        const slides = document.querySelectorAll('.slide');
        const dots = document.querySelectorAll('.indicator');
        const prevBtn = document.querySelector('.hero-nav.prev');
        const nextBtn = document.querySelector('.hero-nav.next');

        if (!slides.length) return;

        let currentSlide = 0;
        const slideCount = slides.length;

        function showSlide(index) {
            // 移除所有active类
            slides.forEach(slide => slide.classList.remove('active'));
            dots.forEach(dot => dot.classList.remove('active'));

            // 添加active类到当前slide
            slides[index].classList.add('active');
            if (dots[index]) dots[index].classList.add('active');

            currentSlide = index;
        }

        function nextSlide() {
            const next = (currentSlide + 1) % slideCount;
            showSlide(next);
        }

        function prevSlide() {
            const prev = (currentSlide - 1 + slideCount) % slideCount;
            showSlide(prev);
        }

        // 绑定按钮事件
        if (nextBtn) nextBtn.addEventListener('click', nextSlide);
        if (prevBtn) prevBtn.addEventListener('click', prevSlide);

        // 绑定指示器事件
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => showSlide(index));
        });

        // 自动轮播
        let autoSlideInterval = setInterval(nextSlide, 5000);

        // 鼠标悬停时暂停自动轮播
        if (heroSlider) {
            heroSlider.addEventListener('mouseenter', () => {
                clearInterval(autoSlideInterval);
            });
            heroSlider.addEventListener('mouseleave', () => {
                clearInterval(autoSlideInterval);
                autoSlideInterval = setInterval(nextSlide, 5000);
            });
        }

        // 初始化第一张幻灯片
        showSlide(0);
    }

    // 智能产品选择器
    function initSmartProductSelector() {
        const wizard = document.getElementById('selectorWizard');
        if (!wizard) return;

        const steps = document.querySelectorAll('.step');
        const stepContents = document.querySelectorAll('.step-content');
        const prevBtn = document.getElementById('wizardPrev');
        const nextBtn = document.getElementById('wizardNext');
        const industryCards = document.querySelectorAll('.industry-card');
        const equipmentList = document.getElementById('equipmentList');
        const recommendations = document.getElementById('recommendations');

        let currentStep = 1;
        let selectedIndustry = '';
        let selectedEquipment = '';
        let selectedParams = {};

        // 设备数据
        const equipmentData = {
            steel: [
                { id: 'blast-furnace', name: '高炉', desc: '炼铁高炉炉缸、炉底' },
                { id: 'converter', name: '转炉', desc: '转炉炉壁、炉底' },
                { id: 'electric-furnace', name: '电炉', desc: '电弧炉炉壁、炉顶' },
                { id: 'ladle', name: '钢包', desc: '钢包永久层、工作层' }
            ],
            cement: [
                { id: 'rotary-kiln', name: '回转窑', desc: '水泥窑烧成带、过渡带' },
                { id: 'preheater', name: '预热器', desc: '悬浮预热器' },
                { id: 'calciner', name: '分解炉', desc: '分解炉内衬' },
                { id: 'cooler', name: '冷却机', desc: '篦式冷却机' }
            ],
            glass: [
                { id: 'melting-furnace', name: '熔制窑', desc: '玻璃窑炉膛' },
                { id: 'regenerator', name: '蓄热室', desc: '蓄热室格子砖' },
                { id: 'working-end', name: '工作池', desc: '池底、池壁' },
                { id: 'feeder', name: '供料道', desc: '供料道内衬' }
            ],
            petrochemical: [
                { id: 'cracking-furnace', name: '裂解炉', desc: '乙烯裂解炉' },
                { id: 'reactor', name: '反应器', desc: '催化反应器' },
                { id: 'heater', name: '加热炉', desc: '石化加热炉' },
                { id: 'flare', name: '火炬', desc: '火炬内衬' }
            ],
            power: [
                { id: 'boiler', name: '锅炉', desc: '电站锅炉' },
                { id: 'cfb-boiler', name: '流化床锅炉', desc: '循环流化床锅炉' },
                { id: 'incinerator', name: '焚烧炉', desc: '垃圾焚烧炉' },
                { id: 'waste-heat', name: '余热锅炉', desc: '余热回收锅炉' }
            ],
            other: [
                { id: 'custom', name: '定制应用', desc: '特殊工况定制' }
            ]
        };

        // 产品推荐数据
        const productRecommendations = {
            'blast-furnace': [
                { name: '高铝砖', match: 92, specs: ['Al₂O₃≥75%', '耐火度1790°C', '抗热震'], desc: '适用于高炉炉身，具有优异的抗侵蚀性能' },
                { name: '炭砖', match: 88, specs: ['导热系数低', '抗碱性', '长寿命'], desc: '高炉炉缸炉底专用，使用寿命长' }
            ],
            'converter': [
                { name: '镁碳砖', match: 95, specs: ['MgO≥85%', '抗渣性强', '热震稳定'], desc: '转炉工作层首选，抗钢渣侵蚀性能优异' },
                { name: '高铝砖', match: 85, specs: ['Al₂O₃≥75%', '耐火度高', '机械强度好'], desc: '转炉永久层使用，性价比高' }
            ]
        };

        function showStep(stepIndex) {
            // 更新步骤指示器
            steps.forEach((step, index) => {
                const stepNum = index + 1;
                step.classList.remove('active', 'completed');

                if (stepNum === stepIndex) {
                    step.classList.add('active');
                } else if (stepNum < stepIndex) {
                    step.classList.add('completed');
                }
            });

            // 更新内容区域
            stepContents.forEach((content, index) => {
                const stepNum = index + 1;
                content.classList.toggle('active', stepNum === stepIndex);
            });

            // 更新按钮状态
            if (prevBtn) {
                prevBtn.style.display = stepIndex > 1 ? 'inline-block' : 'none';
            }

            if (nextBtn) {
                if (stepIndex === 4) {
                    nextBtn.textContent = '获取推荐';
                    nextBtn.classList.add('get-recommendation');
                } else {
                    nextBtn.textContent = '下一步';
                    nextBtn.classList.remove('get-recommendation');
                }
            }

            currentStep = stepIndex;
        }

        // 生成设备列表
        function generateEquipmentList(industry) {
            if (!equipmentList || !equipmentData[industry]) return;

            equipmentList.innerHTML = '';
            equipmentData[industry].forEach(equipment => {
                const equipmentItem = document.createElement('div');
                equipmentItem.className = 'equipment-item';
                equipmentItem.setAttribute('data-equipment', equipment.id);
                equipmentItem.innerHTML = `
                    <h5>${equipment.name}</h5>
                    <p>${equipment.desc}</p>
                `;

                equipmentItem.addEventListener('click', function() {
                    document.querySelectorAll('.equipment-item').forEach(item =>
                        item.classList.remove('selected')
                    );
                    this.classList.add('selected');
                    selectedEquipment = equipment.id;
                });

                equipmentList.appendChild(equipmentItem);
            });
        }

        // 生成推荐结果
        function generateRecommendations() {
            if (!recommendations) return;

            const recs = productRecommendations[selectedEquipment] || [
                { name: '高铝砖', match: 85, specs: ['Al₂O₃≥75%', '耐火度1790°C'], desc: '通用型耐火砖，适用于多种工况' },
                { name: '保温砖', match: 80, specs: ['导热系数低', '节能环保'], desc: '保温层专用，具有良好的节能效果' }
            ];

            recommendations.innerHTML = '';
            recs.forEach(rec => {
                const recCard = document.createElement('div');
                recCard.className = 'recommendation-card';
                recCard.innerHTML = `
                    <div class="match-score">${rec.match}% 匹配</div>
                    <h4>${rec.name}</h4>
                    <p>${rec.desc}</p>
                    <div class="specs">
                        ${rec.specs.map(spec => `<span class="spec-tag">${spec}</span>`).join('')}
                    </div>
                    <div class="actions">
                        <a href="#" class="btn btn-primary btn-sm">查看详情</a>
                        <button class="btn btn-secondary btn-sm">添加询价</button>
                    </div>
                `;
                recommendations.appendChild(recCard);
            });
        }

        // 行业卡片点击事件
        industryCards.forEach(card => {
            card.addEventListener('click', function() {
                industryCards.forEach(c => c.classList.remove('selected'));
                this.classList.add('selected');
                selectedIndustry = this.getAttribute('data-industry');
                generateEquipmentList(selectedIndustry);
            });
        });

        // 导航按钮事件
        if (nextBtn) {
            nextBtn.addEventListener('click', function() {
                if (currentStep < 4) {
                    // 验证当前步骤
                    if (currentStep === 1 && !selectedIndustry) {
                        showToast('请先选择您的应用行业', 'error');
                        return;
                    }
                    if (currentStep === 2 && !selectedEquipment) {
                        showToast('请先选择具体设备类型', 'error');
                        return;
                    }

                    showStep(currentStep + 1);
                } else {
                    // 第4步：生成推荐
                    generateRecommendations();
                    showToast('AI推荐完成！', 'success');
                }
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', function() {
                if (currentStep > 1) {
                    showStep(currentStep - 1);
                }
            });
        }

        // 初始化
        showStep(1);
    }

    // 产品展示功能
    function initProductShowcase() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        const productCards = document.querySelectorAll('.product-card');

        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const filter = this.dataset.filter;

                // 更新按钮状态
                filterBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');

                // 过滤产品卡片
                productCards.forEach(card => {
                    if (filter === 'all' || card.dataset.category === filter) {
                        card.style.display = 'block';
                        card.style.animation = 'fadeInUp 0.5s ease';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });

        // 产品卡片悬停效果
        productCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-10px)';
            });

            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });
        });
    }

    // 客户案例轮播
    function initCustomerStories() {
        const storiesContainer = document.querySelector('.stories-container');
        const storyCards = document.querySelectorAll('.story-card');

        if (!storyCards.length) return;

        let currentStoryIndex = 0;

        function showNextStories() {
            currentStoryIndex = (currentStoryIndex + 1) % storyCards.length;

            storyCards.forEach((card, index) => {
                card.style.opacity = index === currentStoryIndex ? '1' : '0.7';
                card.style.transform = index === currentStoryIndex ? 'scale(1.05)' : 'scale(1)';
            });
        }

        // 每5秒切换一次
        if (storyCards.length > 1) {
            setInterval(showNextStories, 5000);
        }
    }

    // 新闻标签切换
    function initNewsTabs() {
        const tabBtns = document.querySelectorAll('.news-tab');
        const tabContents = document.querySelectorAll('.news-content');

        tabBtns.forEach((btn, index) => {
            btn.addEventListener('click', function() {
                // 移除所有active类
                tabBtns.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));

                // 添加active类
                this.classList.add('active');
                if (tabContents[index]) {
                    tabContents[index].classList.add('active');
                }
            });
        });
    }

    // 应用场景切换器
    function initApplicationSwitcher() {
        const appBtns = document.querySelectorAll('.app-btn');
        const appContents = document.querySelectorAll('.app-content');

        appBtns.forEach((btn, index) => {
            btn.addEventListener('click', function() {
                // 移除所有active类
                appBtns.forEach(b => b.classList.remove('active'));
                appContents.forEach(c => c.classList.remove('active'));

                // 添加active类
                this.classList.add('active');
                if (appContents[index]) {
                    appContents[index].classList.add('active');
                }
            });
        });
    }

    // 仪表板动画
    function initDashboard() {
        const counters = document.querySelectorAll('.dashboard-item h3');

        function animateCounters() {
            counters.forEach(counter => {
                const target = parseInt(counter.getAttribute('data-target') || counter.textContent);
                const increment = target / 100;
                let current = 0;

                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        counter.textContent = target.toLocaleString();
                        clearInterval(timer);
                    } else {
                        counter.textContent = Math.floor(current).toLocaleString();
                    }
                }, 20);
            });
        }

        // 当仪表板进入视窗时开始动画
        const dashboardObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    dashboardObserver.unobserve(entry.target);
                }
            });
        });

        const dashboard = document.querySelector('.live-dashboard');
        if (dashboard) {
            dashboardObserver.observe(dashboard);
        }
    }

    // 滚动动画增强
    function initScrollAnimations() {
        const animatedElements = document.querySelectorAll('.scroll-reveal');

        const scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');

                    // 添加延迟动画效果
                    const children = entry.target.querySelectorAll('.animate-item');
                    children.forEach((child, index) => {
                        setTimeout(() => {
                            child.classList.add('animated');
                        }, index * 200);
                    });
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        animatedElements.forEach(el => scrollObserver.observe(el));
    }

    // 智能提示功能
    function initSmartTooltips() {
        const tooltipElements = document.querySelectorAll('[data-tooltip]');

        tooltipElements.forEach(element => {
            let tooltip;

            element.addEventListener('mouseenter', function() {
                const text = this.getAttribute('data-tooltip');
                tooltip = document.createElement('div');
                tooltip.className = 'smart-tooltip';
                tooltip.textContent = text;
                document.body.appendChild(tooltip);

                // 定位tooltip
                const rect = this.getBoundingClientRect();
                tooltip.style.left = rect.left + rect.width / 2 - tooltip.offsetWidth / 2 + 'px';
                tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';

                setTimeout(() => tooltip.classList.add('visible'), 10);
            });

            element.addEventListener('mouseleave', function() {
                if (tooltip) {
                    tooltip.classList.remove('visible');
                    setTimeout(() => {
                        if (tooltip.parentNode) {
                            tooltip.parentNode.removeChild(tooltip);
                        }
                    }, 300);
                }
            });
        });
    }

    // 初始化智能提示
    initSmartTooltips();

    // 键盘导航支持
    document.addEventListener('keydown', function(e) {
        // ESC键关闭所有弹窗
        if (e.key === 'Escape') {
            const popups = document.querySelectorAll('.popup.active, .modal.active');
            popups.forEach(popup => popup.classList.remove('active'));
        }

        // 方向键导航产品选择器
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            const activeStep = document.querySelector('.selector-step.active');
            if (activeStep) {
                const options = activeStep.querySelectorAll('.option-card');
                const selected = activeStep.querySelector('.option-card.selected');
                const currentIndex = Array.from(options).indexOf(selected);

                let newIndex;
                if (e.key === 'ArrowRight') {
                    newIndex = (currentIndex + 1) % options.length;
                } else {
                    newIndex = (currentIndex - 1 + options.length) % options.length;
                }

                options.forEach(option => option.classList.remove('selected'));
                options[newIndex].classList.add('selected');
                options[newIndex].focus();
            }
        }
    });

    // 性能优化：防抖动处理
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // 窗口大小改变时重新计算布局
    window.addEventListener('resize', debounce(() => {
        // 重新计算轮播图布局
        const slides = document.querySelectorAll('.hero-slide');
        slides.forEach(slide => {
            // 触发重新渲染
            slide.style.height = 'auto';
            const height = slide.offsetHeight;
            slide.style.height = height + 'px';
        });
    }, 250));

    // 数字计数器动画
    function initCounters() {
        const counters = document.querySelectorAll('.stat-number[data-count]');

        const observerOptions = {
            threshold: 0.5,
            rootMargin: '0px 0px -50px 0px'
        };

        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.getAttribute('data-count'));

                    if (!counter.classList.contains('counted')) {
                        counter.classList.add('counted');
                        animateCounter(counter, target);
                    }
                }
            });
        }, observerOptions);

        counters.forEach(counter => counterObserver.observe(counter));
    }

    function animateCounter(element, target) {
        let current = 0;
        const increment = target / 50;
        const duration = 2000; // 2秒
        const startTime = performance.now();

        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            current = target * progress;
            element.textContent = Math.floor(current).toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target.toLocaleString();
            }
        }

        requestAnimationFrame(updateCounter);
    }

    // 地图交互功能
    function initMapInteractions() {
        const mapPoints = document.querySelectorAll('.map-point');

        mapPoints.forEach(point => {
            point.addEventListener('mouseenter', function() {
                const tooltip = this.querySelector('.point-tooltip');
                if (tooltip) {
                    tooltip.style.opacity = '1';
                }
            });

            point.addEventListener('mouseleave', function() {
                const tooltip = this.querySelector('.point-tooltip');
                if (tooltip) {
                    tooltip.style.opacity = '0';
                }
            });

            point.addEventListener('click', function() {
                const country = this.getAttribute('data-country');
                // 这里可以添加更多交互功能
            });
        });
    }

    // Tab切换功能
    function initTabSwitching() {
        // 新闻资讯tabs
        const newsTabs = document.querySelectorAll('.tab-btn');
        const newsContents = document.querySelectorAll('.tab-content');

        newsTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                const targetTab = this.getAttribute('data-tab');

                // 移除所有active类
                newsTabs.forEach(t => t.classList.remove('active'));
                newsContents.forEach(c => c.classList.remove('active'));

                // 添加active类到当前选中的
                this.classList.add('active');
                const targetContent = document.querySelector(`[data-tab="${targetTab}"].tab-content`);
                if (targetContent) {
                    targetContent.classList.add('active');
                }
            });
        });

        // 应用领域切换
        const industryBtns = document.querySelectorAll('.industry-btn');
        const contentPanels = document.querySelectorAll('.content-panel');

        industryBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const targetIndustry = this.getAttribute('data-industry');

                // 移除所有active类
                industryBtns.forEach(b => b.classList.remove('active'));
                contentPanels.forEach(p => p.classList.remove('active'));

                // 添加active类到当前选中的
                this.classList.add('active');
                const targetPanel = document.querySelector(`[data-industry="${targetIndustry}"].content-panel`);
                if (targetPanel) {
                    targetPanel.classList.add('active');
                }
            });
        });
    }

    // 增强的产品卡片交互
    function initProductCardInteractions() {
        const productCards = document.querySelectorAll('.product-card-enhanced');

        productCards.forEach(card => {
            const addToInquiryBtn = card.querySelector('.add-to-inquiry');

            if (addToInquiryBtn) {
                addToInquiryBtn.addEventListener('click', function() {
                    const productId = this.getAttribute('data-product');
                    const productName = card.querySelector('h3').textContent;

                    // 添加到询价列表
                    addToInquiryList(productId, productName);

                    // 显示成功提示
                    showToast(`${productName} 已添加到询价列表`);

                    // 按钮状态变化
                    this.innerHTML = '<i class="fas fa-check"></i>';
                    this.classList.add('added');

                    setTimeout(() => {
                        this.innerHTML = '<i class="fas fa-plus"></i>';
                        this.classList.remove('added');
                    }, 2000);
                });
            }
        });
    }

    // 智能在线服务功能
    function initOnlineServices() {
        // AI智能客服
        window.openChatBot = function() {
            showToast('智能客服功能即将上线');
        };

        // 在线报价系统
        window.openPriceCalculator = function() {
            showToast('报价系统功能即将上线');
        };

        // 产品智能搜索
        window.openSmartSearch = function() {
            showToast('智能搜索功能即将上线');
        };

        // 技术资料下载
        window.openDownloadCenter = function() {
            showToast('下载中心功能即将上线');
        };
    }

    // 添加到询价列表功能
    function addToInquiryList(productId, productName) {
        let inquiryList = JSON.parse(localStorage.getItem('inquiryList') || '[]');

        // 检查是否已存在
        if (!inquiryList.find(item => item.id === productId)) {
            inquiryList.push({
                id: productId,
                name: productName,
                addedAt: new Date().toISOString()
            });

            localStorage.setItem('inquiryList', JSON.stringify(inquiryList));
            updateInquiryWidget();
        }
    }

    // 更新询价组件
    function updateInquiryWidget() {
        const inquiryList = JSON.parse(localStorage.getItem('inquiryList') || '[]');
        const inquiryCount = document.querySelector('.inquiry-count');

        if (inquiryCount) {
            inquiryCount.textContent = inquiryList.length;
            inquiryCount.style.display = inquiryList.length > 0 ? 'block' : 'none';
        }
    }

    // 提示消息功能
    function showToast(message, type = 'success') {
        // 创建提示元素
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;

        // 添加样式
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#4caf50' : '#2196f3'};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;

        document.body.appendChild(toast);

        // 显示动画
        setTimeout(() => {
            toast.style.transform = 'translateX(0)';
        }, 100);

        // 自动隐藏
        setTimeout(() => {
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }

    // 产品过滤功能
    function initProductFilters() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        const productCards = document.querySelectorAll('.product-card-enhanced');

        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const filter = this.getAttribute('data-filter');

                // 移除所有active类
                filterBtns.forEach(b => b.classList.remove('active'));
                // 添加active类到当前按钮
                this.classList.add('active');

                // 过滤产品
                productCards.forEach(card => {
                    const category = card.getAttribute('data-category');

                    if (filter === 'all' || category === filter) {
                        card.style.display = 'flex';
                        card.style.animation = 'fadeInUp 0.5s ease forwards';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    // 初始化所有新功能
    initProductCardInteractions();
    initOnlineServices();
    updateInquiryWidget();

});