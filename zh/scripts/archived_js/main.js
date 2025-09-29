// 主JavaScript文件 - 统一入口点
(function() {
    'use strict';

    // 应用配置
    const APP_CONFIG = {
        debug: false,
        version: '2.0.0',
        baseUrl: window.location.origin,
        apiTimeout: 5000
    };

    // 主应用对象
    const YuandakeApp = {
        modules: {},
        initialized: false,

        // 初始化应用
        init() {
            if (this.initialized) return;

            console.log('🚀 初始化元达科网站...');

            // 初始化核心模块
            this.initializeModules();

            // 设置全局事件监听
            this.setupGlobalEvents();

            // 标记为已初始化
            this.initialized = true;

            console.log('✅ 网站初始化完成');
        },

        // 初始化模块
        initializeModules() {
            const coreModules = [
                'Navigation',
                'ScrollAnimations',
                'LazyLoading',
                'ContactForms'
            ];

            coreModules.forEach(moduleName => {
                if (this.modules[moduleName] && typeof this.modules[moduleName].init === 'function') {
                    try {
                        this.modules[moduleName].init();
                        console.log(`📦 模块 ${moduleName} 已加载`);
                    } catch (error) {
                        console.error(`❌ 模块 ${moduleName} 加载失败:`, error);
                    }
                }
            });
        },

        // 设置全局事件
        setupGlobalEvents() {
            // 页面加载完成事件
            window.addEventListener('load', () => {
                document.body.classList.add('loaded');
            });

            // 页面可见性变化
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    console.log('页面切换到后台');
                } else {
                    console.log('页面回到前台');
                }
            });

            // 错误处理
            window.addEventListener('error', (event) => {
                if (APP_CONFIG.debug) {
                    console.error('全局错误:', event.error);
                }
            });
        },

        // 注册模块
        registerModule(name, module) {
            this.modules[name] = module;
        },

        // 获取模块
        getModule(name) {
            return this.modules[name];
        }
    };

    // 导航模块
    YuandakeApp.registerModule('Navigation', {
        init() {
            this.setupMobileMenu();
            this.setupDropdowns();
            this.setupSmoothScrolling();
        },

        setupMobileMenu() {
            const hamburger = document.querySelector('.hamburger');
            const navMenu = document.querySelector('.nav-menu');

            if (!hamburger || !navMenu) return;

            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
            });

            // 点击菜单项关闭移动端菜单
            const navLinks = document.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                });
            });
        },

        setupDropdowns() {
            const dropdowns = document.querySelectorAll('.dropdown');

            dropdowns.forEach(dropdown => {
                const menu = dropdown.querySelector('.dropdown-menu');

                dropdown.addEventListener('mouseenter', () => {
                    menu.style.display = 'block';
                });

                dropdown.addEventListener('mouseleave', () => {
                    menu.style.display = 'none';
                });
            });
        },

        setupSmoothScrolling() {
            const links = document.querySelectorAll('a[href^="#"]');

            links.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const targetId = link.getAttribute('href');
                    const targetElement = document.querySelector(targetId);

                    if (targetElement) {
                        targetElement.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                });
            });
        }
    });

    // 滚动动画模块
    YuandakeApp.registerModule('ScrollAnimations', {
        observer: null,

        init() {
            this.setupIntersectionObserver();
            this.observeElements();
        },

        setupIntersectionObserver() {
            const options = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };

            this.observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('revealed');

                        // 如果是统计数字，启动计数动画
                        if (entry.target.classList.contains('stat-number')) {
                            this.animateNumber(entry.target);
                        }
                    }
                });
            }, options);
        },

        observeElements() {
            const elements = document.querySelectorAll('.scroll-reveal, .stat-number');
            elements.forEach(el => this.observer.observe(el));
        },

        animateNumber(element) {
            const target = parseInt(element.textContent) || 0;
            const duration = 2000;
            const startTime = performance.now();

            const updateNumber = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);

                const current = Math.floor(target * this.easeOutCubic(progress));
                element.textContent = current;

                if (progress < 1) {
                    requestAnimationFrame(updateNumber);
                }
            };

            requestAnimationFrame(updateNumber);
        },

        easeOutCubic(t) {
            return 1 - Math.pow(1 - t, 3);
        }
    });

    // 懒加载模块
    YuandakeApp.registerModule('LazyLoading', {
        imageObserver: null,

        init() {
            this.setupImageLazyLoading();
        },

        setupImageLazyLoading() {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;

                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.classList.remove('lazy');
                            img.classList.add('loaded');
                            imageObserver.unobserve(img);
                        }
                    }
                });
            });

            const lazyImages = document.querySelectorAll('img[data-src]');
            lazyImages.forEach(img => imageObserver.observe(img));
        }
    });

    // 联系表单模块
    YuandakeApp.registerModule('ContactForms', {
        init() {
            this.setupFormValidation();
            this.setupFormSubmission();
        },

        setupFormValidation() {
            const forms = document.querySelectorAll('.contact-form, .inquiry-form');

            forms.forEach(form => {
                const inputs = form.querySelectorAll('input, textarea, select');

                inputs.forEach(input => {
                    input.addEventListener('blur', () => {
                        this.validateField(input);
                    });

                    input.addEventListener('input', () => {
                        if (input.classList.contains('error')) {
                            this.validateField(input);
                        }
                    });
                });
            });
        },

        validateField(field) {
            const value = field.value.trim();
            let isValid = true;
            let errorMessage = '';

            // 必填字段验证
            if (field.hasAttribute('required') && !value) {
                isValid = false;
                errorMessage = '此字段为必填项';
            }

            // 邮箱验证
            if (field.type === 'email' && value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    isValid = false;
                    errorMessage = '请输入有效的邮箱地址';
                }
            }

            // 电话验证
            if (field.type === 'tel' && value) {
                const phoneRegex = /^[\d\s\-\+\(\)]+$/;
                if (!phoneRegex.test(value)) {
                    isValid = false;
                    errorMessage = '请输入有效的电话号码';
                }
            }

            this.showFieldError(field, isValid ? '' : errorMessage);
            return isValid;
        },

        showFieldError(field, message) {
            field.classList.toggle('error', !!message);

            let errorElement = field.parentNode.querySelector('.field-error');
            if (!errorElement) {
                errorElement = document.createElement('div');
                errorElement.className = 'field-error';
                field.parentNode.appendChild(errorElement);
            }

            errorElement.textContent = message;
            errorElement.style.display = message ? 'block' : 'none';
        },

        setupFormSubmission() {
            const forms = document.querySelectorAll('.contact-form, .inquiry-form');

            forms.forEach(form => {
                form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.handleFormSubmit(form);
                });
            });
        },

        async handleFormSubmit(form) {
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;

            // 验证所有字段
            const inputs = form.querySelectorAll('input, textarea, select');
            let isFormValid = true;

            inputs.forEach(input => {
                if (!this.validateField(input)) {
                    isFormValid = false;
                }
            });

            if (!isFormValid) {
                this.showMessage(form, '请修正表单中的错误', 'error');
                return;
            }

            // 显示提交状态
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="loading"></span> 提交中...';

            try {
                // 模拟表单提交
                await this.simulateFormSubmission(new FormData(form));

                this.showMessage(form, '提交成功！我们会尽快与您联系。', 'success');
                form.reset();

            } catch (error) {
                this.showMessage(form, '提交失败，请稍后重试。', 'error');
                console.error('表单提交错误:', error);
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        },

        async simulateFormSubmission(formData) {
            // 模拟网络请求
            return new Promise((resolve) => {
                setTimeout(() => {
                    console.log('表单数据:', Object.fromEntries(formData));
                    resolve();
                }, 1500);
            });
        },

        showMessage(form, message, type) {
            let messageElement = form.querySelector('.form-message');
            if (!messageElement) {
                messageElement = document.createElement('div');
                messageElement.className = 'form-message';
                form.insertBefore(messageElement, form.firstChild);
            }

            messageElement.className = `form-message alert alert-${type}`;
            messageElement.textContent = message;
            messageElement.style.display = 'block';

            // 3秒后自动隐藏成功消息
            if (type === 'success') {
                setTimeout(() => {
                    messageElement.style.display = 'none';
                }, 3000);
            }
        }
    });

    // 暴露到全局
    window.YuandakeApp = YuandakeApp;

    // DOM加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => YuandakeApp.init());
    } else {
        YuandakeApp.init();
    }

})();