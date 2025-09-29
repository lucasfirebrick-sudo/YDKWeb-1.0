/**
 * 交互式应用案例页面功能
 * Interactive Applications Page Functionality
 */

class ApplicationsEnhanced {
    constructor() {
        this.countryPanel = document.getElementById('countryPanel');
        this.countryName = document.getElementById('countryName');
        this.panelContent = document.getElementById('panelContent');
        this.panelClose = document.getElementById('panelClose');

        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.galleryItems = document.querySelectorAll('.gallery-item');
        this.loadMoreBtn = document.getElementById('loadMoreBtn');

        this.countryCards = document.querySelectorAll('.country-card');
        this.statsNumbers = document.querySelectorAll('.stats-number');

        this.currentFilter = 'all';
        this.visibleItems = 6; // 初始显示的项目数
        this.itemsPerLoad = 3; // 每次加载更多的项目数

        this.countryData = {
            china: {
                name: '中国',
                flag: '🇨🇳',
                projects: 500,
                industries: ['钢铁', '水泥', '玻璃', '电力'],
                majorProjects: [
                    '宝钢集团高炉项目',
                    '华能国际电厂',
                    '海螺水泥回转窑',
                    '福耀玻璃熔炉'
                ],
                description: '作为我们最重要的本土市场，中国项目涵盖了所有主要工业领域，累计完成500多个重要项目。'
            },
            usa: {
                name: '美国',
                flag: '🇺🇸',
                projects: 150,
                industries: ['钢铁', '石化', '电力'],
                majorProjects: [
                    '印第安纳州钢铁厂',
                    '德克萨斯石化装置',
                    '加州电力公司',
                    '俄亥俄州高炉项目'
                ],
                description: '在美国市场，我们为多家知名企业提供高品质耐火材料，建立了良好的合作关系。'
            },
            japan: {
                name: '日本',
                flag: '🇯🇵',
                projects: 120,
                industries: ['钢铁', '水泥', '玻璃'],
                majorProjects: [
                    '新日铁转炉项目',
                    '太平洋水泥厂',
                    '旭硝子熔炉',
                    'JFE钢铁高炉'
                ],
                description: '与日本多家大型工业企业保持长期合作，产品质量获得高度认可。'
            },
            korea: {
                name: '韩国',
                flag: '🇰🇷',
                projects: 100,
                industries: ['钢铁', '水泥', '石化'],
                majorProjects: [
                    '浦项钢铁高炉',
                    '双龙水泥厂',
                    'LG化学装置',
                    '现代制铁项目'
                ],
                description: '在韩国市场深耕多年，为当地重要工业项目提供专业耐火材料解决方案。'
            },
            germany: {
                name: '德国',
                flag: '🇩🇪',
                projects: 80,
                industries: ['钢铁', '玻璃', '水泥'],
                majorProjects: [
                    '蒂森克虏伯钢厂',
                    '肖特玻璃集团',
                    '海德堡水泥',
                    '萨尔茨吉特钢铁'
                ],
                description: '进入欧洲高端市场，为德国精密制造业提供优质耐火材料产品。'
            },
            india: {
                name: '印度',
                flag: '🇮🇳',
                projects: 200,
                industries: ['钢铁', '水泥', '玻璃', '石化'],
                majorProjects: [
                    '塔塔钢铁项目',
                    '拉法基水泥厂',
                    '信实石化装置',
                    'UltraTech水泥'
                ],
                description: '印度是我们重要的海外市场，随着当地工业化进程，合作项目持续增长。'
            }
        };

        this.init();
    }

    init() {
        this.bindEvents();
        this.initializeGallery();
        this.animateStats();
    }

    bindEvents() {
        // 国家卡片点击事件
        this.countryCards.forEach(card => {
            card.addEventListener('click', () => {
                const country = card.dataset.country;
                this.showCountryInfo(country);
            });
        });

        // 关闭面板事件
        if (this.panelClose) {
            this.panelClose.addEventListener('click', () => {
                this.hideCountryInfo();
            });
        }

        // 行业筛选事件
        this.filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const industry = button.dataset.industry;
                this.filterByIndustry(industry, button);
            });
        });

        // 加载更多事件
        if (this.loadMoreBtn) {
            this.loadMoreBtn.addEventListener('click', () => {
                this.loadMoreItems();
            });
        }

        // 点击画廊项目事件
        this.galleryItems.forEach(item => {
            item.addEventListener('click', () => {
                this.showProjectDetails(item);
            });
        });

        // ESC键关闭面板
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.countryPanel.style.display === 'block') {
                this.hideCountryInfo();
            }
        });
    }

    showCountryInfo(countryCode) {
        const countryInfo = this.countryData[countryCode];
        if (!countryInfo) return;

        this.countryName.textContent = `${countryInfo.flag} ${countryInfo.name}`;

        this.panelContent.innerHTML = `
            <div class="country-stats">
                <div class="stat-item">
                    <div class="stat-number">${countryInfo.projects}</div>
                    <div class="stat-label">完成项目</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">${countryInfo.industries.length}</div>
                    <div class="stat-label">覆盖行业</div>
                </div>
            </div>

            <div class="country-description">
                <p>${countryInfo.description}</p>
            </div>

            <div class="major-industries">
                <h4>主要应用行业</h4>
                <div class="industry-tags">
                    ${countryInfo.industries.map(industry =>
                        `<span class="industry-tag">${industry}</span>`
                    ).join('')}
                </div>
            </div>

            <div class="major-projects">
                <h4>代表性项目</h4>
                <ul class="project-list">
                    ${countryInfo.majorProjects.map(project =>
                        `<li><i class="fas fa-check-circle"></i> ${project}</li>`
                    ).join('')}
                </ul>
            </div>

            <div class="contact-info">
                <a href="contact.html" class="btn-primary btn-sm">
                    <i class="fas fa-envelope"></i> 了解更多合作机会
                </a>
            </div>
        `;

        this.countryPanel.style.display = 'block';

        // 添加动画效果
        setTimeout(() => {
            this.countryPanel.style.opacity = '1';
            this.countryPanel.style.transform = 'translateX(0)';
        }, 10);
    }

    hideCountryInfo() {
        this.countryPanel.style.opacity = '0';
        this.countryPanel.style.transform = 'translateX(100%)';

        setTimeout(() => {
            this.countryPanel.style.display = 'none';
        }, 300);
    }

    filterByIndustry(industry, activeButton) {
        // 更新按钮状态
        this.filterButtons.forEach(btn => btn.classList.remove('active'));
        activeButton.classList.add('active');

        this.currentFilter = industry;

        // 筛选画廊项目
        this.galleryItems.forEach(item => {
            const itemIndustry = item.dataset.industry;
            const shouldShow = industry === 'all' || itemIndustry === industry;

            if (shouldShow) {
                item.style.display = 'block';
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, 10);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });

        // 重置可见项目数
        this.visibleItems = 6;
        this.updateLoadMoreButton();
    }

    initializeGallery() {
        // 初始只显示前几个项目
        this.galleryItems.forEach((item, index) => {
            if (index >= this.visibleItems) {
                item.style.display = 'none';
            }
        });

        this.updateLoadMoreButton();
    }

    loadMoreItems() {
        const filteredItems = Array.from(this.galleryItems).filter(item => {
            const itemIndustry = item.dataset.industry;
            return this.currentFilter === 'all' || itemIndustry === this.currentFilter;
        });

        const currentlyVisible = filteredItems.filter(item =>
            item.style.display !== 'none'
        ).length;

        const itemsToShow = filteredItems.slice(currentlyVisible, currentlyVisible + this.itemsPerLoad);

        itemsToShow.forEach(item => {
            item.style.display = 'block';
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';

            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, 100);
        });

        this.visibleItems += this.itemsPerLoad;
        this.updateLoadMoreButton();
    }

    updateLoadMoreButton() {
        const filteredItems = Array.from(this.galleryItems).filter(item => {
            const itemIndustry = item.dataset.industry;
            return this.currentFilter === 'all' || itemIndustry === this.currentFilter;
        });

        const visibleItems = filteredItems.filter(item =>
            item.style.display !== 'none'
        ).length;

        if (visibleItems >= filteredItems.length) {
            this.loadMoreBtn.style.display = 'none';
        } else {
            this.loadMoreBtn.style.display = 'inline-flex';
        }
    }

    showProjectDetails(item) {
        const title = item.querySelector('.item-info h4').textContent;
        const description = item.querySelector('.item-info p').textContent;
        const location = item.querySelector('.item-location').textContent;
        const image = item.querySelector('img').src;

        // 创建项目详情弹窗
        const modal = document.createElement('div');
        modal.className = 'project-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${title}</h3>
                    <button class="modal-close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="project-image">
                        <img src="${image}" alt="${title}">
                    </div>
                    <div class="project-info">
                        <div class="project-location">
                            <i class="fas fa-map-marker-alt"></i>
                            ${location}
                        </div>
                        <p class="project-description">${description}</p>
                        <div class="project-details">
                            <h4>项目详情</h4>
                            <ul>
                                <li>项目状态：已完成</li>
                                <li>合作时间：2019-2023</li>
                                <li>产品类型：耐火砖、浇注料</li>
                                <li>服务范围：产品供应、技术支持、现场指导</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <a href="contact.html" class="btn-primary">
                        <i class="fas fa-phone"></i> 咨询类似项目
                    </a>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // 绑定关闭事件
        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });

        // 添加样式
        Object.assign(modal.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            background: 'rgba(0, 0, 0, 0.8)',
            zIndex: '10000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem'
        });
    }

    animateStats() {
        // 使用 Intersection Observer 来触发统计数字动画
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateNumber(entry.target);
                }
            });
        }, { threshold: 0.5 });

        this.statsNumbers.forEach(number => {
            observer.observe(number);
        });
    }

    animateNumber(element) {
        const target = parseInt(element.dataset.target);
        const duration = 2000; // 2秒
        const increment = target / (duration / 16); // 60fps
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.round(current);
        }, 16);
    }

    // 简化的世界地图功能（可以后续集成真实的SVG地图）
    initSimpleWorldMap() {
        const mapContainer = document.querySelector('.world-map');

        // 创建简化的交互式区域
        const regions = [
            { name: '北美', x: 20, y: 30, countries: ['usa'] },
            { name: '东亚', x: 75, y: 35, countries: ['china', 'japan', 'korea'] },
            { name: '欧洲', x: 50, y: 25, countries: ['germany'] },
            { name: '南亚', x: 65, y: 50, countries: ['india'] }
        ];

        regions.forEach(region => {
            const regionDiv = document.createElement('div');
            regionDiv.className = 'map-region';
            regionDiv.style.cssText = `
                position: absolute;
                left: ${region.x}%;
                top: ${region.y}%;
                width: 60px;
                height: 60px;
                background: var(--primary-color);
                border-radius: 50%;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-weight: bold;
                font-size: 0.8rem;
                text-align: center;
                transition: all 0.3s ease;
                transform: translate(-50%, -50%);
            `;
            regionDiv.textContent = region.countries.length;
            regionDiv.title = `${region.name} - ${region.countries.length} 个合作国家`;

            regionDiv.addEventListener('click', () => {
                // 显示第一个国家的信息
                if (region.countries.length > 0) {
                    this.showCountryInfo(region.countries[0]);
                }
            });

            regionDiv.addEventListener('mouseenter', () => {
                regionDiv.style.transform = 'translate(-50%, -50%) scale(1.2)';
                regionDiv.style.boxShadow = '0 4px 20px rgba(197, 55, 55, 0.4)';
            });

            regionDiv.addEventListener('mouseleave', () => {
                regionDiv.style.transform = 'translate(-50%, -50%) scale(1)';
                regionDiv.style.boxShadow = 'none';
            });

            mapContainer.appendChild(regionDiv);
        });

        // 隐藏占位符
        const placeholder = mapContainer.querySelector('.map-placeholder');
        if (placeholder) {
            placeholder.style.display = 'none';
        }
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    window.applicationsEnhanced = new ApplicationsEnhanced();

    // 延迟初始化地图
    setTimeout(() => {
        window.applicationsEnhanced.initSimpleWorldMap();
    }, 1000);
});

// 暴露到全局
window.ApplicationsEnhanced = ApplicationsEnhanced;