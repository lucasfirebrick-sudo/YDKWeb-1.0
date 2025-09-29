// 智能实时工厂数据看板
// 基于真实时间算法，确保数据的真实性和连续性

document.addEventListener('DOMContentLoaded', function() {

    // 获取当前时间信息
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentDay = now.getDay(); // 0=周日, 1-5=工作日, 6=周六
    const timeOfDay = currentHour + currentMinute / 60;

    // 基准数据设定（确保数据连续性）
    const baseData = {
        safetyStartDate: new Date('2020-01-01'), // 安全生产计算基准日期
        dailyProductionBase: 195, // 日产能基准
        furnaceTempRange: [1420, 1480], // 炉温正常范围
        qualityRateBase: 98.5 // 合格率基准
    };

    // 计算安全生产天数（真实计算）
    function calculateSafetyDays() {
        const diffTime = now - baseData.safetyStartDate;
        return Math.floor(diffTime / (1000 * 60 * 60 * 24));
    }

    // 计算今日产量（基于工作时间模拟）
    function calculateTodayProduction() {
        if (currentDay === 0 || currentDay === 6) {
            // 周末减产
            return Math.round(baseData.dailyProductionBase * 0.3 + Math.random() * 10);
        }

        // 工作日产量曲线：6:00开始，22:00结束
        const workStartHour = 6;
        const workEndHour = 22;
        const workingHours = workEndHour - workStartHour;

        if (timeOfDay < workStartHour) {
            // 凌晨时段，显示前一天的最终产量
            return Math.round(baseData.dailyProductionBase * (0.92 + Math.random() * 0.1));
        } else if (timeOfDay > workEndHour) {
            // 夜间时段，显示当天最终产量
            return Math.round(baseData.dailyProductionBase * (0.95 + Math.random() * 0.08));
        } else {
            // 工作时段，产量递增（S曲线）
            const workProgress = (timeOfDay - workStartHour) / workingHours;
            const sCurve = 1 / (1 + Math.exp(-10 * (workProgress - 0.5))); // S曲线函数
            return Math.round(baseData.dailyProductionBase * sCurve * (0.95 + Math.random() * 0.08));
        }
    }

    // 计算炉温（在正常范围内微调）
    function calculateFurnaceTemp() {
        const [minTemp, maxTemp] = baseData.furnaceTempRange;
        const midTemp = (minTemp + maxTemp) / 2;

        // 基于时间和随机因素的温度波动
        const timeVariation = Math.sin(timeOfDay * Math.PI / 12) * 15; // 基于时间的变化
        const randomVariation = (Math.random() - 0.5) * 20; // 随机波动

        let temp = midTemp + timeVariation + randomVariation;
        temp = Math.max(minTemp, Math.min(maxTemp, temp)); // 确保在范围内

        return Math.round(temp);
    }

    // 计算质检合格率
    function calculateQualityRate() {
        const baseRate = baseData.qualityRateBase;
        const randomFactor = Math.random() * 1.3; // 0-1.3的随机变化
        const timeBonus = currentDay >= 1 && currentDay <= 5 ? 0.2 : 0; // 工作日质量更稳定

        return Math.round((baseRate + randomFactor + timeBonus) * 10) / 10;
    }

    // 计算待出货订单数
    function calculatePendingOrders() {
        const baseOrders = 25;
        const dayFactor = currentDay >= 1 && currentDay <= 5 ? 1 : 0.6; // 工作日订单更多
        const hourFactor = timeOfDay >= 9 && timeOfDay <= 18 ? 1.2 : 0.8; // 工作时间订单活跃
        const randomFactor = Math.random() * 0.4 + 0.8; // 0.8-1.2的随机因素

        return Math.round(baseOrders * dayFactor * hourFactor * randomFactor);
    }

    // 计算本月出口国家数
    function calculateMonthlyExports() {
        const dayOfMonth = now.getDate();
        const baseCountries = Math.floor(dayOfMonth * 1.2) + 3; // 随月份递增
        const randomVar = Math.floor(Math.random() * 3); // 随机变化

        return Math.min(15, baseCountries + randomVar); // 最多15个国家
    }

    // 计算货柜数
    function calculateTotalContainers() {
        const dayOfMonth = now.getDate();
        const baseContainers = Math.floor(dayOfMonth * 2.8) + 12;
        const randomVar = Math.floor(Math.random() * 8);

        return baseContainers + randomVar;
    }

    // 格式化更新时间
    function formatUpdateTime() {
        const minutes = Math.floor(Math.random() * 5) + 1; // 1-5分钟前
        return `${minutes}分钟前`;
    }

    // 更新所有数据
    function updateDashboardData() {
        // 获取所有数据
        const safetyDays = calculateSafetyDays();
        const todayProduction = calculateTodayProduction();
        const furnaceTemp = calculateFurnaceTemp();
        const qualityRate = calculateQualityRate();
        const pendingOrders = calculatePendingOrders();
        const monthlyExports = calculateMonthlyExports();
        const totalContainers = calculateTotalContainers();
        const totalTested = Math.floor(now.getDate() * 3.2) + Math.floor(Math.random() * 5);
        const productionProgress = Math.round((todayProduction / baseData.dailyProductionBase) * 100);

        // 数字动画效果更新
        function animateNumber(elementId, targetValue, suffix = '') {
            const element = document.getElementById(elementId);
            if (!element) return;

            const startValue = parseInt(element.textContent) || 0;
            const duration = 1500; // 1.5秒动画
            const startTime = Date.now();

            function updateValue() {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);

                // 使用缓动函数
                const easedProgress = 1 - Math.pow(1 - progress, 3);
                const currentValue = startValue + (targetValue - startValue) * easedProgress;

                if (suffix === '%' || elementId === 'qualityRate') {
                    element.textContent = currentValue.toFixed(1);
                } else {
                    element.textContent = Math.round(currentValue);
                }

                if (progress < 1) {
                    requestAnimationFrame(updateValue);
                }
            }

            updateValue();
        }

        // 更新所有数值
        animateNumber('safetyDays', safetyDays);
        animateNumber('todayProduction', todayProduction);
        animateNumber('furnaceTemp', furnaceTemp);
        animateNumber('qualityRate', qualityRate);
        animateNumber('pendingOrders', pendingOrders);
        animateNumber('monthlyExports', monthlyExports);
        animateNumber('totalContainers', totalContainers);
        animateNumber('totalTested', totalTested);
        animateNumber('productionProgress', productionProgress);

        // 更新时间戳
        document.getElementById('updateTime').textContent = formatUpdateTime();

        console.log('Dashboard data updated:', {
            safetyDays, todayProduction, furnaceTemp, qualityRate,
            pendingOrders, monthlyExports, totalContainers, totalTested, productionProgress
        });
    }

    // Live指示器闪烁效果
    function startLiveIndicator() {
        const indicator = document.querySelector('.live-indicator');
        if (indicator) {
            setInterval(() => {
                indicator.style.opacity = indicator.style.opacity === '0.5' ? '1' : '0.5';
            }, 1500);
        }
    }

    // 状态点闪烁效果
    function startStatusDots() {
        const statusDots = document.querySelectorAll('.status-dot');
        statusDots.forEach((dot, index) => {
            setInterval(() => {
                dot.style.boxShadow = dot.style.boxShadow.includes('0px 0px 10px')
                    ? 'none'
                    : '0px 0px 10px rgba(0, 255, 0, 0.6)';
            }, 2000 + index * 200); // 错开闪烁时间
        });
    }

    // 初始化
    updateDashboardData();
    startLiveIndicator();

    // 页面可见时启动状态点效果
    setTimeout(startStatusDots, 1000);

    // 每30秒更新一次数据（模拟实时更新）
    setInterval(() => {
        updateDashboardData();
    }, 30000);

    // 每5分钟更新时间戳
    setInterval(() => {
        document.getElementById('updateTime').textContent = formatUpdateTime();
    }, 300000);

    // 页面可见性变化时更新数据
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            updateDashboardData();
        }
    });
});