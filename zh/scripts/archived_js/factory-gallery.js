// 工厂画廊交互功能
document.addEventListener('DOMContentLoaded', function() {
    const galleryMain = document.querySelector('.gallery-main img');
    const thumbItems = document.querySelectorAll('.thumb-item');

    if (galleryMain && thumbItems.length > 0) {
        // 缩略图点击切换主图
        thumbItems.forEach((thumb, index) => {
            thumb.addEventListener('click', function() {
                // 移除所有活动状态
                thumbItems.forEach(item => item.classList.remove('active'));

                // 设置当前项为活动状态
                this.classList.add('active');

                // 获取缩略图的图片
                const thumbImg = this.querySelector('img');
                if (thumbImg) {
                    // 更新主图
                    galleryMain.src = thumbImg.src;
                    galleryMain.alt = thumbImg.alt;

                    // 添加过渡动画
                    galleryMain.style.opacity = '0.7';
                    setTimeout(() => {
                        galleryMain.style.opacity = '1';
                    }, 200);
                }
            });

            // 添加悬停效果
            thumb.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.05)';
                this.style.boxShadow = '0 8px 20px rgba(197, 55, 55, 0.2)';
            });

            thumb.addEventListener('mouseleave', function() {
                if (!this.classList.contains('active')) {
                    this.style.transform = 'scale(1)';
                    this.style.boxShadow = 'none';
                }
            });
        });
    }

    // 服务项目悬停动画
    const serviceItems = document.querySelectorAll('.service-item');
    serviceItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            const icon = this.querySelector('i');
            if (icon) {
                icon.style.transform = 'scale(1.2) rotate(5deg)';
                icon.style.color = 'var(--secondary-color)';
            }
        });

        item.addEventListener('mouseleave', function() {
            const icon = this.querySelector('i');
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
                icon.style.color = 'var(--primary-color)';
            }
        });
    });

    // 工厂信息项的入场动画
    const infoItems = document.querySelectorAll('.info-item');
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.animation = `fadeInUp 0.6s ease-out forwards`;
                    entry.target.style.opacity = '1';
                }, index * 100);
            }
        });
    }, observerOptions);

    infoItems.forEach(item => {
        item.style.opacity = '0';
        observer.observe(item);
    });
});