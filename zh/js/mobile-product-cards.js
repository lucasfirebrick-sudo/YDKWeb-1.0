/**
 * 移动端产品卡片交互
 * Mobile Product Card Interactions
 *
 * 功能:在移动设备上点击产品卡片显示overlay,再次点击或点击关闭按钮隐藏
 */

(function() {
    'use strict';

    // 检测是否为移动设备
    function isMobileDevice() {
        return window.innerWidth <= 768 ||
               ('ontouchstart' in window) ||
               (navigator.maxTouchPoints > 0);
    }

    // 初始化移动端产品卡片交互
    function initMobileProductCards() {
        if (!isMobileDevice()) {
            return; // 非移动设备不执行
        }

        const productCards = document.querySelectorAll('.product-card');

        if (productCards.length === 0) {
            return;
        }

        // 为每个产品卡片添加点击事件
        productCards.forEach(card => {
            card.addEventListener('click', function(e) {
                const overlay = this.querySelector('.hover-overlay');

                // 如果点击的是overlay内的按钮或链接,不阻止默认行为
                if (e.target.closest('.overlay-actions')) {
                    return;
                }

                // 检查是否点击了关闭按钮区域(右上角)
                const rect = overlay.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const clickY = e.clientY - rect.top;

                if (clickX > rect.width - 50 && clickY < 50) {
                    // 点击了关闭按钮区域
                    this.classList.remove('mobile-active');
                    e.preventDefault();
                    e.stopPropagation();
                    return;
                }

                // 切换激活状态
                const isActive = this.classList.contains('mobile-active');

                // 关闭所有其他卡片
                document.querySelectorAll('.product-card.mobile-active').forEach(c => {
                    if (c !== this) {
                        c.classList.remove('mobile-active');
                    }
                });

                // 切换当前卡片状态
                if (!isActive) {
                    this.classList.add('mobile-active');
                    e.preventDefault();
                    e.stopPropagation();
                } else {
                    this.classList.remove('mobile-active');
                }
            });

            // 阻止overlay内的事件冒泡
            const overlay = card.querySelector('.hover-overlay');
            if (overlay) {
                overlay.addEventListener('click', function(e) {
                    // 允许按钮点击
                    if (e.target.closest('.overlay-actions')) {
                        return;
                    }
                    e.stopPropagation();
                });
            }
        });

        // 点击页面其他地方关闭所有overlay
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.product-card')) {
                document.querySelectorAll('.product-card.mobile-active').forEach(card => {
                    card.classList.remove('mobile-active');
                });
            }
        });

        // 滚动时关闭overlay(可选,提升性能)
        let scrollTimeout;
        window.addEventListener('scroll', function() {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(function() {
                // 滚动停止后不关闭,用户可能想查看不同位置的产品
                // 如需自动关闭,取消下面注释
                // document.querySelectorAll('.product-card.mobile-active').forEach(card => {
                //     card.classList.remove('mobile-active');
                // });
            }, 150);
        }, { passive: true });
    }

    // 窗口大小改变时重新初始化
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            // 如果从桌面变为移动,重新初始化
            // 如果从移动变为桌面,移除所有激活状态
            if (!isMobileDevice()) {
                document.querySelectorAll('.product-card.mobile-active').forEach(card => {
                    card.classList.remove('mobile-active');
                });
            }
        }, 250);
    });

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMobileProductCards);
    } else {
        initMobileProductCards();
    }

    // 导出函数供外部使用(可选)
    window.initMobileProductCards = initMobileProductCards;

})();
