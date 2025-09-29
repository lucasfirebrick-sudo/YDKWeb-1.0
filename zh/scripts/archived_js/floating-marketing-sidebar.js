/**
 * 浮动营销侧边栏功能
 * Floating Marketing Sidebar Functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    const sidebar = document.getElementById('floatingMarketing');
    const toggle = document.getElementById('sidebarToggle');

    if (!sidebar || !toggle) return;

    // 侧边栏状态管理
    let isOpen = false;
    let autoHideTimer = null;

    // 切换侧边栏显示/隐藏
    function toggleSidebar() {
        isOpen = !isOpen;
        sidebar.classList.toggle('open', isOpen);

        // 更新切换按钮图标
        const chevron = toggle.querySelector('i');
        if (chevron) {
            chevron.className = isOpen ? 'fas fa-chevron-right' : 'fas fa-chevron-left';
        }

        // 如果打开，设置自动隐藏定时器
        if (isOpen) {
            setAutoHideTimer();
        } else {
            clearAutoHideTimer();
        }
    }

    // 设置自动隐藏定时器
    function setAutoHideTimer() {
        clearAutoHideTimer();
        autoHideTimer = setTimeout(() => {
            if (isOpen) {
                toggleSidebar();
            }
        }, 10000); // 10秒后自动隐藏
    }

    // 清除自动隐藏定时器
    function clearAutoHideTimer() {
        if (autoHideTimer) {
            clearTimeout(autoHideTimer);
            autoHideTimer = null;
        }
    }

    // 点击切换按钮
    toggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        toggleSidebar();
    });

    // 鼠标悬停时取消自动隐藏
    sidebar.addEventListener('mouseenter', clearAutoHideTimer);
    sidebar.addEventListener('mouseleave', function() {
        if (isOpen) {
            setAutoHideTimer();
        }
    });

    // 点击侧边栏外部时关闭
    document.addEventListener('click', function(e) {
        if (isOpen && !sidebar.contains(e.target)) {
            toggleSidebar();
        }
    });

    // 防止侧边栏内部点击事件冒泡
    sidebar.addEventListener('click', function(e) {
        e.stopPropagation();
    });

    // 滚动时显示/隐藏侧边栏
    let lastScrollY = window.scrollY;
    let scrollTimer = null;

    function handleScroll() {
        const currentScrollY = window.scrollY;

        // 向下滚动超过300px时显示侧边栏
        if (currentScrollY > 300) {
            sidebar.classList.add('visible');
        } else {
            sidebar.classList.remove('visible');
            if (isOpen) {
                toggleSidebar();
            }
        }

        // 滚动停止后设置自动隐藏定时器
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(() => {
            if (currentScrollY > 300 && !isOpen) {
                // 可以在这里添加提示用户注意侧边栏的动画
            }
        }, 1000);

        lastScrollY = currentScrollY;
    }

    window.addEventListener('scroll', handleScroll, { passive: true });

    // 初始化滚动状态
    handleScroll();

    // 产品推荐项点击追踪
    const recommendedProducts = sidebar.querySelectorAll('.product-item');
    recommendedProducts.forEach((item, index) => {
        item.addEventListener('click', function() {
            // 这里可以添加点击追踪统计
            console.log(`Recommended product ${index + 1} clicked`);
        });
    });

    // 联系方式按钮点击追踪
    const contactBtns = sidebar.querySelectorAll('.contact-btn');
    contactBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const type = this.classList.contains('phone-btn') ? 'phone' :
                        this.classList.contains('whatsapp-btn') ? 'whatsapp' : 'inquiry';
            console.log(`Contact method clicked: ${type}`);
        });
    });

    // 企业优势项悬停效果
    const highlightItems = sidebar.querySelectorAll('.highlight-item');
    highlightItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
        });
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });

    // 响应式处理
    function handleResize() {
        if (window.innerWidth < 768) {
            // 移动端时自动关闭侧边栏
            if (isOpen) {
                toggleSidebar();
            }
            sidebar.classList.add('mobile');
        } else {
            sidebar.classList.remove('mobile');
        }
    }

    window.addEventListener('resize', handleResize);
    handleResize(); // 初始化
});

// 全局函数：打开询价表单
function openInquiryForm() {
    // 这里可以集成现有的询价表单功能
    console.log('Opening inquiry form...');

    // 如果页面有现有的询价功能，调用它
    if (typeof showInquiryForm === 'function') {
        showInquiryForm();
    } else {
        // 否则显示简单的提示或跳转到联系页面
        alert('正在为您跳转到询价页面...');
        window.location.href = '../contact.html';
    }
}

// 全局函数：下载产品手册
function downloadCatalog() {
    console.log('Downloading product catalog...');

    // 这里可以触发实际的下载功能
    // 模拟下载过程
    const link = document.createElement('a');
    link.href = '../assets/product-catalog.pdf'; // 假设的PDF路径
    link.download = '元达科耐火材料产品手册.pdf';
    link.style.display = 'none';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // 如果文件不存在，显示提示信息
    setTimeout(() => {
        alert('产品手册下载功能即将上线，如需产品资料请联系我们的销售团队！');
    }, 100);
}

// 动画计数器效果
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');

    counters.forEach(counter => {
        const target = parseInt(counter.textContent.replace(/[^0-9]/g, ''));
        const duration = 2000; // 2秒动画
        const increment = target / (duration / 16); // 60fps
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }

            // 格式化数字显示
            let displayValue = Math.floor(current);
            if (counter.textContent.includes('+')) {
                displayValue += '+';
            } else if (counter.textContent.includes('%')) {
                displayValue += '%';
            }

            counter.textContent = displayValue;
        }, 16);
    });
}

// 当侧边栏首次打开时启动计数器动画
let countersAnimated = false;
document.addEventListener('DOMContentLoaded', function() {
    const sidebar = document.getElementById('floatingMarketing');
    if (sidebar) {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    if (sidebar.classList.contains('open') && !countersAnimated) {
                        setTimeout(animateCounters, 300);
                        countersAnimated = true;
                    }
                }
            });
        });

        observer.observe(sidebar, { attributes: true });
    }
});