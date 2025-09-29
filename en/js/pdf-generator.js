/**
 * 专业PDF技术资料生成器
 * 基于产品数据库生成真实的技术规格PDF文档
 */

class PDFGenerator {
    constructor() {
        this.companyInfo = {
            name: '河南元达科耐火材料有限公司',
            englishName: 'Henan Yuandake Refractory Materials Co., Ltd.',
            address: '河南省新密市来集镇',
            phone: '+86 371 86541085',
            email: 'info@yuandake-refractory.com',
            website: 'www.yuandake-refractory.com',
            logo: '../images/company/logo.png'
        };
    }

    /**
     * 生成产品技术规格PDF
     */
    async generateTechnicalSpecPDF(productId) {
        try {
            console.log('开始生成PDF:', productId);
            const productData = window.ProductDatabase.getProduct(productId);
            if (!productData) {
                throw new Error('产品数据不存在');
            }

            console.log('产品数据获取成功:', productData.name);
            const pdfContent = this.generateTechnicalSpecContent(productData);

            console.log('PDF内容生成成功，开始下载...');
            await this.downloadPDF(pdfContent, `${productData.name}-技术规格表.pdf`);
            this.showDownloadSuccess(`${productData.name}技术规格表`);
        } catch (error) {
            console.error('PDF生成失败:', error);
            this.showDownloadError(error.message);
        }
    }

    /**
     * 生成产品说明书PDF
     */
    async generateDataSheetPDF(productId) {
        try {
            console.log('开始生成产品说明书PDF:', productId);
            const productData = window.ProductDatabase.getProduct(productId);
            if (!productData) {
                throw new Error('产品数据不存在');
            }

            console.log('产品数据获取成功:', productData.name);
            const pdfContent = this.generateDataSheetContent(productData);

            console.log('PDF内容生成成功，开始下载...');
            await this.downloadPDF(pdfContent, `${productData.name}-产品说明书.pdf`);
            this.showDownloadSuccess(`${productData.name}产品说明书`);
        } catch (error) {
            console.error('PDF生成失败:', error);
            this.showDownloadError(error.message);
        }
    }

    /**
     * 生成技术规格表内容
     */
    generateTechnicalSpecContent(productData) {
        const currentDate = new Date().toLocaleDateString('zh-CN');

        let htmlContent = `
        <!DOCTYPE html>
        <html lang="zh-CN">
        <head>
            <meta charset="UTF-8">
            <title>${productData.name} - 技术规格表</title>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body {
                    font-family: 'SimSun', serif;
                    font-size: 14px;
                    line-height: 1.6;
                    color: #333;
                    padding: 40px;
                    background: white;
                }
                .header {
                    text-align: center;
                    margin-bottom: 40px;
                    padding-bottom: 20px;
                    border-bottom: 3px solid #007bff;
                }
                .company-name {
                    font-size: 24px;
                    font-weight: bold;
                    color: #007bff;
                    margin-bottom: 5px;
                }
                .company-name-en {
                    font-size: 16px;
                    color: #666;
                    margin-bottom: 20px;
                }
                .document-title {
                    font-size: 20px;
                    font-weight: bold;
                    color: #333;
                }
                .product-info {
                    background: #f8f9fa;
                    padding: 20px;
                    border-radius: 8px;
                    margin-bottom: 30px;
                }
                .product-name {
                    font-size: 22px;
                    font-weight: bold;
                    color: #007bff;
                    margin-bottom: 10px;
                }
                .product-name-en {
                    font-size: 16px;
                    color: #666;
                    margin-bottom: 15px;
                }
                .specs-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 30px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                }
                .specs-table th,
                .specs-table td {
                    padding: 12px 15px;
                    text-align: left;
                    border: 1px solid #ddd;
                }
                .specs-table th {
                    background-color: #007bff;
                    color: white;
                    font-weight: bold;
                    text-align: center;
                }
                .specs-table tr:nth-child(even) {
                    background-color: #f8f9fa;
                }
                .specs-table tr:hover {
                    background-color: #e3f2fd;
                }
                .features-section {
                    margin-bottom: 30px;
                }
                .section-title {
                    font-size: 18px;
                    font-weight: bold;
                    color: #007bff;
                    margin-bottom: 15px;
                    padding-bottom: 5px;
                    border-bottom: 2px solid #007bff;
                }
                .features-list {
                    list-style: none;
                    padding-left: 0;
                }
                .features-list li {
                    padding: 8px 0;
                    padding-left: 20px;
                    position: relative;
                }
                .features-list li::before {
                    content: "▶";
                    color: #007bff;
                    position: absolute;
                    left: 0;
                }
                .applications-list {
                    list-style: none;
                    padding-left: 0;
                }
                .applications-list li {
                    padding: 8px 0;
                    padding-left: 20px;
                    position: relative;
                }
                .applications-list li::before {
                    content: "●";
                    color: #28a745;
                    position: absolute;
                    left: 0;
                }
                .footer {
                    margin-top: 50px;
                    padding-top: 20px;
                    border-top: 2px solid #007bff;
                    text-align: center;
                    color: #666;
                    font-size: 12px;
                }
                .contact-info {
                    margin-top: 15px;
                }
                .date-info {
                    position: absolute;
                    top: 40px;
                    right: 40px;
                    font-size: 12px;
                    color: #666;
                }
                .watermark {
                    position: fixed;
                    bottom: 100px;
                    right: 50px;
                    font-size: 10px;
                    color: #ccc;
                    transform: rotate(-45deg);
                    opacity: 0.3;
                }
            </style>
        </head>
        <body>
            <div class="date-info">生成日期: ${currentDate}</div>

            <div class="header">
                <div class="company-name">${this.companyInfo.name}</div>
                <div class="company-name-en">${this.companyInfo.englishName}</div>
                <div class="document-title">产品技术规格表</div>
            </div>

            <div class="product-info">
                <div class="product-name">${productData.name}</div>
                <div class="product-name-en">${productData.englishName}</div>
                <div>产品类别: ${this.getCategoryName(productData.category)}</div>
            </div>

            <div class="specs-section">
                <div class="section-title">技术规格参数</div>
                <table class="specs-table">
                    <thead>
                        <tr>
                            <th style="width: 40%">技术指标</th>
                            <th style="width: 30%">数值</th>
                            <th style="width: 30%">单位</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        // 添加技术规格
        Object.entries(productData.specifications).forEach(([key, spec]) => {
            htmlContent += `
                        <tr>
                            <td>${spec.label}</td>
                            <td style="text-align: center; font-weight: bold;">${spec.value}</td>
                            <td style="text-align: center;">${spec.unit}</td>
                        </tr>
            `;
        });

        htmlContent += `
                    </tbody>
                </table>
            </div>

            <div class="features-section">
                <div class="section-title">产品特点</div>
                <ul class="features-list">
        `;

        productData.features.forEach(feature => {
            htmlContent += `<li>${feature}</li>`;
        });

        htmlContent += `
                </ul>
            </div>

            <div class="features-section">
                <div class="section-title">应用领域</div>
                <ul class="applications-list">
        `;

        productData.applications.forEach(application => {
            htmlContent += `<li>${application}</li>`;
        });

        htmlContent += `
                </ul>
            </div>

            <div class="footer">
                <div class="contact-info">
                    <div>联系电话: ${this.companyInfo.phone} | 邮箱: ${this.companyInfo.email}</div>
                    <div>公司地址: ${this.companyInfo.address} | 网站: ${this.companyInfo.website}</div>
                </div>
                <div style="margin-top: 15px; font-size: 10px;">
                    本技术规格表由河南元达科耐火材料有限公司提供，仅供参考，最终规格以实际产品为准。
                </div>
            </div>

            <div class="watermark">YDK REFRACTORY</div>
        </body>
        </html>
        `;

        return htmlContent;
    }

    /**
     * 生成产品说明书内容
     */
    generateDataSheetContent(productData) {
        const currentDate = new Date().toLocaleDateString('zh-CN');

        let htmlContent = `
        <!DOCTYPE html>
        <html lang="zh-CN">
        <head>
            <meta charset="UTF-8">
            <title>${productData.name} - 产品说明书</title>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body {
                    font-family: 'SimSun', serif;
                    font-size: 14px;
                    line-height: 1.8;
                    color: #333;
                    padding: 40px;
                    background: white;
                }
                .header {
                    text-align: center;
                    margin-bottom: 40px;
                    padding: 30px;
                    background: linear-gradient(135deg, #007bff, #0056b3);
                    color: white;
                    border-radius: 10px;
                }
                .company-name {
                    font-size: 26px;
                    font-weight: bold;
                    margin-bottom: 10px;
                }
                .document-title {
                    font-size: 22px;
                    margin-top: 15px;
                }
                .product-overview {
                    background: #f8f9fa;
                    padding: 25px;
                    border-radius: 10px;
                    margin-bottom: 30px;
                    border-left: 5px solid #007bff;
                }
                .product-name {
                    font-size: 24px;
                    font-weight: bold;
                    color: #007bff;
                    margin-bottom: 10px;
                }
                .section {
                    margin-bottom: 35px;
                }
                .section-title {
                    font-size: 20px;
                    font-weight: bold;
                    color: #007bff;
                    margin-bottom: 20px;
                    padding: 10px 0;
                    border-bottom: 3px solid #007bff;
                    position: relative;
                }
                .section-title::after {
                    content: '';
                    position: absolute;
                    bottom: -3px;
                    left: 0;
                    width: 50px;
                    height: 3px;
                    background: #ffc107;
                }
                .content-box {
                    background: white;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                }
                .specs-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 15px 0;
                }
                .specs-table th,
                .specs-table td {
                    padding: 15px;
                    text-align: left;
                    border: 1px solid #ddd;
                }
                .specs-table th {
                    background: linear-gradient(135deg, #007bff, #0056b3);
                    color: white;
                    font-weight: bold;
                    text-align: center;
                }
                .features-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 15px;
                    margin-top: 15px;
                }
                .feature-item {
                    background: #e3f2fd;
                    padding: 15px;
                    border-radius: 8px;
                    border-left: 4px solid #2196f3;
                }
                .applications-grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 12px;
                    margin-top: 15px;
                }
                .app-item {
                    background: #f1f8e9;
                    padding: 15px;
                    border-radius: 8px;
                    border-left: 4px solid #4caf50;
                }
                .footer {
                    margin-top: 50px;
                    padding: 25px;
                    background: #f8f9fa;
                    border-radius: 10px;
                    text-align: center;
                    border-top: 3px solid #007bff;
                }
                .date-stamp {
                    position: absolute;
                    top: 40px;
                    right: 40px;
                    background: #ffc107;
                    color: #333;
                    padding: 8px 15px;
                    border-radius: 20px;
                    font-size: 12px;
                    font-weight: bold;
                }
                @media print {
                    .date-stamp {
                        background: #333;
                        color: white;
                    }
                }
            </style>
        </head>
        <body>
            <div class="date-stamp">生成: ${currentDate}</div>

            <div class="header">
                <div class="company-name">${this.companyInfo.name}</div>
                <div class="company-name">${this.companyInfo.englishName}</div>
                <div class="document-title">产品说明书</div>
            </div>

            <div class="product-overview">
                <div class="product-name">${productData.name}</div>
                <div style="font-size: 16px; color: #666; margin-bottom: 15px;">${productData.englishName}</div>
                <div style="font-size: 16px;">
                    <strong>产品类别:</strong> ${this.getCategoryName(productData.category)} |
                    <strong>产品系列:</strong> ${this.getSubcategoryName(productData.subcategory)}
                </div>
            </div>
        `;

        // 产品概述
        htmlContent += `
            <div class="section">
                <div class="section-title">产品概述</div>
                <div class="content-box">
                    <p>${productData.name}是河南元达科耐火材料有限公司精心研发生产的高品质耐火材料产品。采用优质原料，先进工艺制造，具有优异的耐火性能和使用寿命，广泛应用于各类高温工业设备。</p>
                </div>
            </div>
        `;

        // 技术规格
        htmlContent += `
            <div class="section">
                <div class="section-title">技术规格</div>
                <div class="content-box">
                    <table class="specs-table">
                        <thead>
                            <tr>
                                <th>技术指标</th>
                                <th>数值</th>
                                <th>单位</th>
                            </tr>
                        </thead>
                        <tbody>
        `;

        Object.entries(productData.specifications).forEach(([key, spec]) => {
            htmlContent += `
                            <tr>
                                <td>${spec.label}</td>
                                <td style="text-align: center; font-weight: bold; color: #007bff;">${spec.value}</td>
                                <td style="text-align: center;">${spec.unit}</td>
                            </tr>
            `;
        });

        htmlContent += `
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        // 产品特点
        htmlContent += `
            <div class="section">
                <div class="section-title">产品特点</div>
                <div class="content-box">
                    <div class="features-grid">
        `;

        productData.features.forEach((feature, index) => {
            htmlContent += `
                        <div class="feature-item">
                            <strong>特点${index + 1}:</strong> ${feature}
                        </div>
            `;
        });

        htmlContent += `
                    </div>
                </div>
            </div>
        `;

        // 应用领域
        htmlContent += `
            <div class="section">
                <div class="section-title">应用领域</div>
                <div class="content-box">
                    <div class="applications-grid">
        `;

        productData.applications.forEach(application => {
            htmlContent += `<div class="app-item">${application}</div>`;
        });

        htmlContent += `
                    </div>
                </div>
            </div>
        `;

        // 质量保证
        htmlContent += `
            <div class="section">
                <div class="section-title">质量保证</div>
                <div class="content-box">
                    <p>河南元达科耐火材料有限公司严格按照国家标准和行业标准生产，所有产品均经过严格的质量检测，确保产品质量稳定可靠。我们提供完善的售前咨询、售中服务和售后支持，为客户提供全方位的技术解决方案。</p>
                </div>
            </div>
        `;

        htmlContent += `
            <div class="footer">
                <div style="font-size: 16px; font-weight: bold; margin-bottom: 15px;">联系我们</div>
                <div>
                    <strong>电话:</strong> ${this.companyInfo.phone} |
                    <strong>邮箱:</strong> ${this.companyInfo.email}
                </div>
                <div style="margin-top: 10px;">
                    <strong>地址:</strong> ${this.companyInfo.address} |
                    <strong>网站:</strong> ${this.companyInfo.website}
                </div>
                <div style="margin-top: 20px; font-size: 12px; color: #666;">
                    本产品说明书由河南元达科耐火材料有限公司提供，版权所有，未经许可不得复制或传播。
                </div>
            </div>
        </body>
        </html>
        `;

        return htmlContent;
    }

    /**
     * 下载PDF文件 - 使用jsPDF生成真正的PDF
     */
    async downloadPDF(htmlContent, filename) {
        try {
            // 检查jsPDF是否加载
            if (typeof window.jsPDF === 'undefined') {
                throw new Error('jsPDF库未加载');
            }

            // 创建临时容器来渲染HTML
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = htmlContent;
            tempDiv.style.cssText = `
                position: absolute;
                top: -9999px;
                left: -9999px;
                width: 800px;
                background: white;
                padding: 40px;
                font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif;
            `;
            document.body.appendChild(tempDiv);

            // 使用html2canvas转换为图片
            const canvas = await html2canvas(tempDiv, {
                scale: 2,
                useCORS: true,
                allowTaint: true,
                backgroundColor: '#ffffff',
                width: 800,
                height: tempDiv.scrollHeight + 80
            });

            // 移除临时容器
            document.body.removeChild(tempDiv);

            // 创建PDF
            const { jsPDF } = window.jsPDF;
            const pdf = new jsPDF('p', 'mm', 'a4');

            // 计算图片尺寸
            const imgWidth = 210; // A4宽度 mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            // 如果内容太长，需要分页
            let heightLeft = imgHeight;
            let position = 0;

            // 添加第一页
            pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= 297; // A4高度 mm

            // 添加额外页面
            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= 297;
            }

            // 下载PDF
            pdf.save(filename);

        } catch (error) {
            console.error('PDF生成失败，使用备用方案:', error);
            // 备用方案：下载HTML文件
            const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
            const url = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.download = filename.replace('.pdf', '.html');
            link.style.display = 'none';

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            setTimeout(() => URL.revokeObjectURL(url), 1000);
        }
    }

    /**
     * 获取类别名称
     */
    getCategoryName(category) {
        const categoryMap = {
            'shaped': '定形耐火材料',
            'unshaped': '不定形耐火材料',
            'special': '特种耐火材料'
        };
        return categoryMap[category] || category;
    }

    /**
     * 获取子类别名称
     */
    getSubcategoryName(subcategory) {
        const subcategoryMap = {
            'alumina-series': '高铝系列',
            'clay-series': '粘土系列',
            'silica-series': '硅质系列',
            'mullite-series': '莫来石系列',
            'castable': '浇注料系列',
            'ramming': '捣打料系列'
        };
        return subcategoryMap[subcategory] || subcategory;
    }

    /**
     * 显示下载成功消息
     */
    showDownloadSuccess(documentName) {
        this.showNotification(`${documentName} 下载成功！`, 'success');
    }

    /**
     * 显示下载错误消息
     */
    showDownloadError(message) {
        this.showNotification(`下载失败：${message}`, 'error');
    }

    /**
     * 显示文档不可用消息
     */
    showUnavailableMessage(productName, docType = '技术资料') {
        this.showNotification(`${productName}的${docType}暂未提供，请联系我们获取最新资料`, 'warning', 5000);
    }

    /**
     * 显示通知
     */
    showNotification(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');

        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };

        const colors = {
            success: '#28a745',
            error: '#dc3545',
            warning: '#ffc107',
            info: '#17a2b8'
        };

        notification.innerHTML = `
            <div style="
                position: fixed;
                top: 20px;
                right: 20px;
                background: ${colors[type]};
                color: white;
                padding: 16px 24px;
                border-radius: 8px;
                z-index: 10000;
                box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                max-width: 400px;
                animation: slideInRight 0.3s ease;
            ">
                <i class="${icons[type]}" style="margin-right: 8px;"></i>
                ${message}
            </div>
        `;

        // 添加动画样式
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOutRight {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(notification);

        // 自动消失
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, duration);
    }
}

// 全局实例化
window.PDFGenerator = new PDFGenerator();

// 暴露全局方法
window.generateTechnicalPDF = (productId) => {
    window.PDFGenerator.generateTechnicalSpecPDF(productId);
};

window.generateProductDataSheet = (productId) => {
    window.PDFGenerator.generateDataSheetPDF(productId);
};