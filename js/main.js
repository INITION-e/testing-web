// ===================================
// Google Antigravity Clone - Main JavaScript
// ===================================

(function() {
    'use strict';

    // ===================================
    // Ring Particles for Hero Section
    // ===================================
    const initHeroParticles = () => {
        const container = document.getElementById('heroParticles');
        if (!container) return;

        const colors = [
            'rgba(66, 133, 244, 0.15)',
            'rgba(52, 168, 83, 0.12)',
            'rgba(251, 188, 4, 0.1)',
            'rgba(234, 67, 53, 0.1)'
        ];

        const createRing = () => {
            const ring = document.createElement('div');
            ring.classList.add('ring');
            const size = Math.random() * 60 + 20;
            const color = colors[Math.floor(Math.random() * colors.length)];
            const left = Math.random() * 100;
            const duration = Math.random() * 8 + 6;
            const delay = Math.random() * 5;

            ring.style.width = size + 'px';
            ring.style.height = size + 'px';
            ring.style.left = left + '%';
            ring.style.bottom = '-' + size + 'px';
            ring.style.borderColor = color;
            ring.style.animationDuration = duration + 's';
            ring.style.animationDelay = delay + 's';

            container.appendChild(ring);

            setTimeout(() => {
                ring.remove();
                createRing();
            }, (duration + delay) * 1000);
        };

        for (let i = 0; i < 15; i++) {
            createRing();
        }
    };

    // ===================================
    // Smooth Scroll for Navigation Links
    // ===================================
    const initSmoothScroll = () => {
        const links = document.querySelectorAll('a[href^="#"]');

        links.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');

                if (href === '#') {
                    e.preventDefault();
                    return;
                }

                const target = document.querySelector(href);

                if (target) {
                    e.preventDefault();
                    const headerOffset = 80;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    };

    // ===================================
    // Header Scroll Effect
    // ===================================
    const initHeaderScroll = () => {
        const header = document.querySelector('.header');

        const handleScroll = () => {
            const currentScroll = window.pageYOffset;

            if (currentScroll > 10) {
                header.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
            } else {
                header.style.boxShadow = 'none';
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
    };

    // ===================================
    // Intersection Observer for Animations
    // ===================================
    const initScrollAnimations = () => {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe feature cards
        const featureCards = document.querySelectorAll('.feature-card');
        featureCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'all 0.6s ease-out ' + (index * 0.1) + 's';
            observer.observe(card);
        });

        // Observe stat items
        const statItems = document.querySelectorAll('.stat-item');
        statItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(30px)';
            item.style.transition = 'all 0.6s ease-out ' + (index * 0.15) + 's';
            observer.observe(item);
        });

        // Observe video section
        const videoSection = document.querySelector('.video-container-wrapper');
        if (videoSection) {
            videoSection.style.opacity = '0';
            videoSection.style.transform = 'translateY(30px)';
            videoSection.style.transition = 'all 0.8s ease-out';
            observer.observe(videoSection);
        }
    };

    // ===================================
    // Counter Animation for Stats
    // ===================================
    const initCounterAnimation = () => {
        const counters = document.querySelectorAll('.stat-number');
        const speed = 200;

        const animateCounter = (counter) => {
            const target = counter.textContent;

            if (target === '\u221E') return;

            const isPercentage = target.includes('%');
            const isPlus = target.includes('+');
            const isMultiplier = target.includes('x');
            let numericValue;

            if (isMultiplier) {
                numericValue = parseFloat(target);
            } else if (isPercentage) {
                numericValue = parseFloat(target);
            } else if (target.includes('M')) {
                numericValue = parseFloat(target) * 1000;
            } else if (target.includes('K')) {
                numericValue = parseFloat(target);
            } else {
                numericValue = parseFloat(target);
            }

            const increment = numericValue / speed;
            let current = 0;

            const updateCounter = () => {
                current += increment;

                if (current < numericValue) {
                    if (target.includes('M')) {
                        counter.textContent = (current / 1000).toFixed(1) + 'M' + (isPlus ? '+' : '');
                    } else if (target.includes('K')) {
                        counter.textContent = Math.ceil(current) + 'K' + (isPlus ? '+' : '');
                    } else if (isPercentage) {
                        counter.textContent = current.toFixed(0) + '%';
                    } else if (isMultiplier) {
                        counter.textContent = current.toFixed(0) + 'x';
                    } else {
                        counter.textContent = Math.ceil(current);
                    }
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };

            updateCounter();
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                    entry.target.classList.add('animated');
                    animateCounter(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => observer.observe(counter));
    };

    // ===================================
    // FAQ Accordion Functionality
    // ===================================
    const initFAQ = () => {
        const faqItems = document.querySelectorAll('.faq-item');

        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');

            if (!question) return;

            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');

                // Close all other FAQ items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                        const otherQuestion = otherItem.querySelector('.faq-question');
                        if (otherQuestion) {
                            otherQuestion.setAttribute('aria-expanded', 'false');
                        }
                    }
                });

                // Toggle current item
                if (isActive) {
                    item.classList.remove('active');
                    question.setAttribute('aria-expanded', 'false');
                } else {
                    item.classList.add('active');
                    question.setAttribute('aria-expanded', 'true');
                }
            });

            // Keyboard accessibility
            question.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    question.click();
                }
            });
        });
    };

    // ===================================
    // Accessibility Enhancements
    // ===================================
    const enhanceAccessibility = () => {
        const videoPlayer = document.querySelector('#demoVideo');
        if (videoPlayer) {
            videoPlayer.setAttribute('tabindex', '0');
            videoPlayer.setAttribute('role', 'region');
            videoPlayer.setAttribute('aria-label', 'Antigravity AI demonstration video');
        }

        const nav = document.querySelector('.nav');
        if (nav) {
            nav.setAttribute('role', 'navigation');
            nav.setAttribute('aria-label', 'Main navigation');
        }
    };

    // ===================================
    // Initialize All Features
    // ===================================
    const init = () => {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }

        initHeroParticles();
        initSmoothScroll();
        initHeaderScroll();
        initScrollAnimations();
        initCounterAnimation();
        initFAQ();
        enhanceAccessibility();
    };

    init();

})();
