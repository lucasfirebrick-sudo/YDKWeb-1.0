/**
 * About Page JavaScript
 * 关于我们页面特定功能的JavaScript代码
 */

class AboutPage {
    constructor() {
        this.timeline = document.querySelector('.company-timeline');
        this.teamSection = document.querySelector('.team-section');
        this.valuesSection = document.querySelector('.company-values');
        this.achievementCounters = document.querySelectorAll('.achievement-counter');
        this.tabContainer = document.querySelector('.about-tabs');
        this.tabContents = document.querySelectorAll('.tab-content');

        this.isCountersAnimated = false;
        this.activeTab = 0;

        this.init();
    }

    init() {
        this.initTabs();
        this.initTimeline();
        this.initTeamSection();
        this.initAchievementCounters();
        this.initScrollAnimations();
        this.bindEvents();
        this.trackPageView();
    }

    initTabs() {
        if (!this.tabContainer) return;

        const tabButtons = this.tabContainer.querySelectorAll('.tab-btn');

        tabButtons.forEach((btn, index) => {
            btn.addEventListener('click', () => this.switchTab(index));
        });

        // Initialize first tab as active
        this.switchTab(0);
    }

    switchTab(index) {
        if (index === this.activeTab) return;

        const tabButtons = this.tabContainer.querySelectorAll('.tab-btn');

        // Remove active classes
        tabButtons.forEach(btn => btn.classList.remove('active'));
        this.tabContents.forEach(content => content.classList.remove('active'));

        // Add active classes
        tabButtons[index].classList.add('active');
        this.tabContents[index].classList.add('active');

        // Update active tab
        this.activeTab = index;

        // Animate tab content
        this.animateTabContent(this.tabContents[index]);

        // Track tab switch
        const tabName = tabButtons[index].textContent.trim();
        this.trackEvent('About Page', 'Tab Switch', tabName);
    }

    animateTabContent(content) {
        // Fade in animation
        content.style.opacity = '0';
        content.style.transform = 'translateY(20px)';

        setTimeout(() => {
            content.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            content.style.opacity = '1';
            content.style.transform = 'translateY(0)';
        }, 50);
    }

    initTimeline() {
        if (!this.timeline) return;

        const timelineItems = this.timeline.querySelectorAll('.timeline-item');

        // Set up intersection observer for timeline animation
        this.timelineObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                    this.animateTimelineItem(entry.target);
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: '0px 0px -50px 0px'
        });

        timelineItems.forEach((item, index) => {
            // Add staggered delay
            item.style.setProperty('--animation-delay', `${index * 0.2}s`);
            this.timelineObserver.observe(item);

            // Add click handler for expandable content
            const expandBtn = item.querySelector('.expand-btn');
            if (expandBtn) {
                expandBtn.addEventListener('click', () => this.toggleTimelineItem(item));
            }
        });

        // Add timeline progress indicator
        this.initTimelineProgress();
    }

    animateTimelineItem(item) {
        const content = item.querySelector('.timeline-content');
        const marker = item.querySelector('.timeline-marker');

        if (content && marker) {
            // Animate marker
            marker.style.transform = 'scale(1.2)';
            setTimeout(() => {
                marker.style.transform = 'scale(1)';
            }, 300);

            // Animate content
            content.style.opacity = '0';
            content.style.transform = 'translateX(-30px)';

            setTimeout(() => {
                content.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                content.style.opacity = '1';
                content.style.transform = 'translateX(0)';
            }, 200);
        }
    }

    toggleTimelineItem(item) {
        const expandableContent = item.querySelector('.timeline-expandable');
        const expandBtn = item.querySelector('.expand-btn');

        if (!expandableContent || !expandBtn) return;

        const isExpanded = item.classList.contains('expanded');

        if (isExpanded) {
            item.classList.remove('expanded');
            expandableContent.style.maxHeight = '0px';
            expandBtn.textContent = '展开详情';
        } else {
            item.classList.add('expanded');
            expandableContent.style.maxHeight = expandableContent.scrollHeight + 'px';
            expandBtn.textContent = '收起详情';
        }

        // Track timeline interaction
        const year = item.querySelector('.timeline-year')?.textContent || 'Unknown';
        this.trackEvent('About Page', 'Timeline Toggle', `${year} - ${isExpanded ? 'Collapse' : 'Expand'}`);
    }

    initTimelineProgress() {
        const progressLine = document.createElement('div');
        progressLine.className = 'timeline-progress';
        this.timeline.appendChild(progressLine);

        window.addEventListener('scroll', () => {
            this.updateTimelineProgress(progressLine);
        });
    }

    updateTimelineProgress(progressLine) {
        const timelineRect = this.timeline.getBoundingClientRect();
        const timelineTop = timelineRect.top + window.pageYOffset;
        const timelineHeight = this.timeline.offsetHeight;
        const scrollTop = window.pageYOffset;
        const windowHeight = window.innerHeight;

        // Calculate progress
        const progress = Math.max(0, Math.min(1,
            (scrollTop + windowHeight - timelineTop) / timelineHeight
        ));

        progressLine.style.height = `${progress * 100}%`;
    }

    initTeamSection() {
        if (!this.teamSection) return;

        const teamMembers = this.teamSection.querySelectorAll('.team-member');

        teamMembers.forEach(member => {
            // Add hover effects
            member.addEventListener('mouseenter', () => this.onTeamMemberHover(member));
            member.addEventListener('mouseleave', () => this.onTeamMemberLeave(member));

            // Add click handler for member details
            member.addEventListener('click', () => this.showTeamMemberDetails(member));

            // Social links tracking
            const socialLinks = member.querySelectorAll('.social-link');
            socialLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const platform = this.getSocialPlatform(link.href);
                    const memberName = member.querySelector('.member-name')?.textContent || 'Unknown';
                    this.trackEvent('Team', 'Social Link Click', `${memberName} - ${platform}`);
                });
            });
        });

        // Initialize team member carousel if mobile
        this.initTeamCarousel();
    }

    onTeamMemberHover(member) {
        const photo = member.querySelector('.member-photo');
        const info = member.querySelector('.member-info');

        if (photo) {
            photo.style.transform = 'scale(1.05)';
        }

        if (info) {
            info.style.transform = 'translateY(-5px)';
        }

        // Show additional info
        const additionalInfo = member.querySelector('.member-additional');
        if (additionalInfo) {
            additionalInfo.style.opacity = '1';
            additionalInfo.style.transform = 'translateY(0)';
        }
    }

    onTeamMemberLeave(member) {
        const photo = member.querySelector('.member-photo');
        const info = member.querySelector('.member-info');

        if (photo) {
            photo.style.transform = 'scale(1)';
        }

        if (info) {
            info.style.transform = 'translateY(0)';
        }

        // Hide additional info
        const additionalInfo = member.querySelector('.member-additional');
        if (additionalInfo) {
            additionalInfo.style.opacity = '0';
            additionalInfo.style.transform = 'translateY(10px)';
        }
    }

    showTeamMemberDetails(member) {
        const memberName = member.querySelector('.member-name')?.textContent || 'Unknown';
        const memberRole = member.querySelector('.member-role')?.textContent || '';
        const memberBio = member.getAttribute('data-bio') || '';

        // Create and show modal
        this.showMemberModal(memberName, memberRole, memberBio);

        // Track member click
        this.trackEvent('Team', 'Member Click', memberName);
    }

    showMemberModal(name, role, bio) {
        // Create modal if it doesn't exist
        let modal = document.querySelector('#teamMemberModal');

        if (!modal) {
            modal = this.createTeamMemberModal();
            document.body.appendChild(modal);
        }

        // Update modal content
        modal.querySelector('.modal-member-name').textContent = name;
        modal.querySelector('.modal-member-role').textContent = role;
        modal.querySelector('.modal-member-bio').textContent = bio;

        // Show modal
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Close modal handlers
        const closeBtn = modal.querySelector('.modal-close');
        const overlay = modal.querySelector('.modal-overlay');

        const closeModal = () => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        };

        closeBtn.onclick = closeModal;
        overlay.onclick = closeModal;

        // ESC key to close
        const handleKeydown = (e) => {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', handleKeydown);
            }
        };
        document.addEventListener('keydown', handleKeydown);
    }

    createTeamMemberModal() {
        const modal = document.createElement('div');
        modal.id = 'teamMemberModal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <button class="modal-close">&times;</button>
                <div class="modal-body">
                    <h3 class="modal-member-name"></h3>
                    <p class="modal-member-role"></p>
                    <p class="modal-member-bio"></p>
                </div>
            </div>
        `;
        return modal;
    }

    initTeamCarousel() {
        if (window.innerWidth >= 768) return; // Only for mobile

        const teamGrid = this.teamSection.querySelector('.team-grid');
        if (!teamGrid) return;

        // Convert grid to carousel for mobile
        teamGrid.classList.add('team-carousel');

        // Add navigation
        const navContainer = document.createElement('div');
        navContainer.className = 'team-nav';
        navContainer.innerHTML = `
            <button class="team-nav-btn prev"><i class="fas fa-chevron-left"></i></button>
            <button class="team-nav-btn next"><i class="fas fa-chevron-right"></i></button>
        `;

        this.teamSection.appendChild(navContainer);

        // Initialize carousel behavior
        this.setupTeamCarouselNavigation(teamGrid);
    }

    setupTeamCarouselNavigation(carousel) {
        const prevBtn = this.teamSection.querySelector('.team-nav-btn.prev');
        const nextBtn = this.teamSection.querySelector('.team-nav-btn.next');
        const members = carousel.querySelectorAll('.team-member');

        let currentIndex = 0;

        const updateCarousel = () => {
            const memberWidth = members[0].offsetWidth + 20; // Including gap
            carousel.style.transform = `translateX(-${currentIndex * memberWidth}px)`;
        };

        prevBtn.addEventListener('click', () => {
            currentIndex = Math.max(0, currentIndex - 1);
            updateCarousel();
        });

        nextBtn.addEventListener('click', () => {
            currentIndex = Math.min(members.length - 1, currentIndex + 1);
            updateCarousel();
        });

        // Touch support
        this.addTeamCarouselTouchSupport(carousel, updateCarousel, () => currentIndex, (index) => {
            currentIndex = Math.max(0, Math.min(members.length - 1, index));
        });
    }

    addTeamCarouselTouchSupport(carousel, updateCallback, getCurrentIndex, setCurrentIndex) {
        let startX = null;
        let currentX = null;

        carousel.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });

        carousel.addEventListener('touchmove', (e) => {
            if (!startX) return;
            currentX = e.touches[0].clientX;
        });

        carousel.addEventListener('touchend', () => {
            if (!startX || !currentX) return;

            const diffX = startX - currentX;
            const threshold = 50;

            if (Math.abs(diffX) > threshold) {
                const currentIndex = getCurrentIndex();
                if (diffX > 0) {
                    setCurrentIndex(currentIndex + 1);
                } else {
                    setCurrentIndex(currentIndex - 1);
                }
                updateCallback();
            }

            startX = null;
            currentX = null;
        });
    }

    initAchievementCounters() {
        if (this.achievementCounters.length === 0) return;

        this.counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.isCountersAnimated) {
                    this.animateAchievementCounters();
                    this.isCountersAnimated = true;
                }
            });
        }, { threshold: 0.5 });

        // Observe the achievement section
        const achievementSection = document.querySelector('.achievements-section');
        if (achievementSection) {
            this.counterObserver.observe(achievementSection);
        }
    }

    animateAchievementCounters() {
        this.achievementCounters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count')) || 0;
            const suffix = counter.getAttribute('data-suffix') || '';
            const duration = 2500;
            const increment = target / (duration / 16);
            let current = 0;

            const updateCounter = () => {
                current += increment;

                if (current < target) {
                    counter.textContent = Math.floor(current).toLocaleString() + suffix;
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target.toLocaleString() + suffix;
                }
            };

            // Add staggered delay
            const delay = Array.from(this.achievementCounters).indexOf(counter) * 200;
            setTimeout(updateCounter, delay);
        });
    }

    initScrollAnimations() {
        const animatedElements = document.querySelectorAll('[data-animate]');

        this.scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                }
            });
        }, {
            threshold: 0.2,
            rootMargin: '0px 0px -50px 0px'
        });

        animatedElements.forEach(element => {
            this.scrollObserver.observe(element);
        });
    }

    animateElement(element) {
        const animationType = element.getAttribute('data-animate');

        element.style.opacity = '0';

        switch (animationType) {
            case 'fade-up':
                element.style.transform = 'translateY(30px)';
                break;
            case 'fade-left':
                element.style.transform = 'translateX(-30px)';
                break;
            case 'fade-right':
                element.style.transform = 'translateX(30px)';
                break;
            case 'scale-up':
                element.style.transform = 'scale(0.9)';
                break;
        }

        element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';

        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0) translateX(0) scale(1)';
        }, 100);

        this.scrollObserver.unobserve(element);
    }

    bindEvents() {
        // Company values interaction
        const valueCards = document.querySelectorAll('.value-card');
        valueCards.forEach(card => {
            card.addEventListener('click', () => {
                const valueName = card.querySelector('.value-title')?.textContent || 'Unknown';
                this.trackEvent('About Page', 'Value Click', valueName);
            });
        });

        // Milestone clicks
        const milestones = document.querySelectorAll('.milestone-item');
        milestones.forEach(milestone => {
            milestone.addEventListener('click', () => {
                const year = milestone.querySelector('.milestone-year')?.textContent || 'Unknown';
                this.trackEvent('About Page', 'Milestone Click', year);
            });
        });

        // Awards/certifications clicks
        const awards = document.querySelectorAll('.award-item');
        awards.forEach(award => {
            award.addEventListener('click', () => {
                const awardName = award.querySelector('.award-name')?.textContent || 'Unknown';
                this.trackEvent('About Page', 'Award Click', awardName);
            });
        });

        // Contact CTA in about page
        const contactCTA = document.querySelector('.about-contact-cta');
        if (contactCTA) {
            contactCTA.addEventListener('click', () => {
                this.trackEvent('About Page', 'Contact CTA Click', 'About Page CTA');
            });
        }
    }

    getSocialPlatform(url) {
        if (url.includes('linkedin.com')) return 'LinkedIn';
        if (url.includes('twitter.com') || url.includes('x.com')) return 'Twitter';
        if (url.includes('facebook.com')) return 'Facebook';
        if (url.includes('instagram.com')) return 'Instagram';
        if (url.includes('youtube.com')) return 'YouTube';
        if (url.includes('weibo.com')) return 'Weibo';
        return 'Other';
    }

    trackPageView() {
        this.trackEvent('Page View', 'About Page', window.location.pathname);

        // Track reading progress
        this.trackReadingProgress();
    }

    trackReadingProgress() {
        const milestones = [25, 50, 75, 100];
        const trackedMilestones = new Set();

        window.addEventListener('scroll', () => {
            const scrollPercent = Math.round(
                (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
            );

            milestones.forEach(milestone => {
                if (scrollPercent >= milestone && !trackedMilestones.has(milestone)) {
                    trackedMilestones.add(milestone);
                    this.trackEvent('Reading Progress', 'About Page', `${milestone}%`);
                }
            });
        });
    }

    trackEvent(category, action, label) {
        // Google Analytics tracking
        if (typeof gtag !== 'undefined') {
            gtag('event', action, {
                event_category: category,
                event_label: label
            });
        }

        console.log('Event tracked:', { category, action, label });
    }

    // Public methods
    switchToTab(index) {
        this.switchTab(index);
    }

    scrollToTimeline() {
        if (this.timeline) {
            this.timeline.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    scrollToTeam() {
        if (this.teamSection) {
            this.teamSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    // Cleanup method
    destroy() {
        if (this.timelineObserver) {
            this.timelineObserver.disconnect();
        }

        if (this.counterObserver) {
            this.counterObserver.disconnect();
        }

        if (this.scrollObserver) {
            this.scrollObserver.disconnect();
        }
    }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.aboutPage = new AboutPage();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AboutPage;
}