// =============================================
// INITION — Main JavaScript (Antigravity-inspired)
// =============================================

(function () {
    'use strict';

    // --- Ring Particle System (Canvas 2D) ---
    function initParticles() {
        const canvas = document.getElementById('heroCanvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];
        let mouse = { x: 0, y: 0 };
        let animId;

        function resize() {
            const rect = canvas.parentElement.getBoundingClientRect();
            width = canvas.width = rect.width;
            height = canvas.height = rect.height;
        }

        function createParticles() {
            particles = [];
            const count = Math.floor(Math.min(width, height) * 0.15);
            const cx = width / 2;
            const cy = height / 2;
            const baseRadius = Math.min(width, height) * 0.35;

            for (let i = 0; i < count; i++) {
                const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.4;
                const r = baseRadius * 0.7 + Math.random() * baseRadius * 0.6;
                particles.push({
                    x: cx + Math.cos(angle) * r,
                    y: cy + Math.sin(angle) * r,
                    baseX: cx + Math.cos(angle) * r,
                    baseY: cy + Math.sin(angle) * r,
                    size: 1.5 + Math.random() * 2,
                    alpha: 0.15 + Math.random() * 0.4,
                    speed: 0.3 + Math.random() * 0.5,
                    angle: angle,
                    phase: Math.random() * Math.PI * 2,
                    radius: r,
                    baseRadius: baseRadius,
                    cx: cx,
                    cy: cy
                });
            }
        }

        function draw(t) {
            ctx.clearRect(0, 0, width, height);
            const time = t * 0.001;

            // Draw ring outline (faint)
            const cx = width / 2;
            const cy = height / 2;
            const ringR = Math.min(width, height) * 0.32;
            ctx.beginPath();
            ctx.arc(cx, cy, ringR, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(0, 137, 123, 0.06)';
            ctx.lineWidth = 1;
            ctx.stroke();

            // Draw particles
            for (const p of particles) {
                const drift = Math.sin(time * p.speed + p.phase) * 12;
                const driftY = Math.cos(time * p.speed * 0.7 + p.phase) * 8;

                p.x = p.baseX + drift;
                p.y = p.baseY + driftY;

                // Subtle mouse repulsion
                const dx = p.x - mouse.x;
                const dy = p.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    const force = (120 - dist) / 120;
                    p.x += dx * force * 0.15;
                    p.y += dy * force * 0.15;
                }

                const pulsAlpha = p.alpha + Math.sin(time * 2 + p.phase) * 0.1;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(0, 137, 123, ${Math.max(0.05, pulsAlpha)})`;
                ctx.fill();
            }

            animId = requestAnimationFrame(draw);
        }

        canvas.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        });

        window.addEventListener('resize', () => {
            resize();
            createParticles();
        });

        resize();
        createParticles();
        animId = requestAnimationFrame(draw);
    }

    // --- Header scroll effect ---
    function initHeader() {
        const header = document.getElementById('header');
        if (!header) return;

        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    header.classList.toggle('scrolled', window.scrollY > 10);
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    // --- Hamburger menu ---
    function initMobileMenu() {
        const hamburger = document.getElementById('hamburger');
        const mobileMenu = document.getElementById('mobileMenu');
        if (!hamburger || !mobileMenu) return;

        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });

        // Close on link click
        mobileMenu.querySelectorAll('.mobile-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // --- Smooth scroll ---
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                const target = document.querySelector(link.getAttribute('href'));
                if (target) {
                    e.preventDefault();
                    const offset = 80;
                    const top = target.getBoundingClientRect().top + window.scrollY - offset;
                    window.scrollTo({ top, behavior: 'smooth' });
                }
            });
        });
    }

    // --- Typing effect ---
    function initTypingEffect() {
        const el = document.getElementById('typingText');
        if (!el) return;

        const fullText = el.textContent;
        el.textContent = '';
        let started = false;

        const cursor = document.createElement('span');
        cursor.className = 'typing-cursor';
        el.appendChild(cursor);

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !started) {
                started = true;
                observer.disconnect();
                let i = 0;
                const speed = 30;

                function type() {
                    if (i < fullText.length) {
                        el.insertBefore(document.createTextNode(fullText[i]), cursor);
                        i++;
                        setTimeout(type, speed);
                    }
                }
                type();
            }
        }, { threshold: 0.3 });

        observer.observe(el);
    }

    // --- Intersection Observer for reveal animations ---
    function initRevealAnimations() {
        const revealElements = document.querySelectorAll('.section-header, .tech-steps, .benefits-grid, .about-grid, .faq-list, .tech-badges');

        revealElements.forEach(el => {
            el.classList.add('reveal');
        });

        const staggerElements = document.querySelectorAll('.tech-steps, .benefits-grid, .about-stats');
        staggerElements.forEach(el => {
            el.classList.add('reveal-stagger');
        });

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1, rootMargin: '-30px' });

        document.querySelectorAll('.reveal, .reveal-stagger').forEach(el => {
            observer.observe(el);
        });
    }

    // --- Counter animation for stats ---
    function initCounters() {
        const statValues = document.querySelectorAll('.stat-value[data-target]');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.dataset.animated) {
                    entry.target.dataset.animated = 'true';
                    const target = parseInt(entry.target.dataset.target);
                    const suffix = entry.target.dataset.suffix || '';
                    const duration = 1500;
                    const start = performance.now();

                    function update(now) {
                        const elapsed = now - start;
                        const progress = Math.min(elapsed / duration, 1);
                        const ease = 1 - Math.pow(1 - progress, 3);
                        const current = Math.round(target * ease);
                        entry.target.textContent = current + suffix;

                        if (progress < 1) {
                            requestAnimationFrame(update);
                        }
                    }

                    requestAnimationFrame(update);
                }
            });
        }, { threshold: 0.5 });

        statValues.forEach(el => observer.observe(el));
    }

    // --- FAQ Accordion ---
    function initFAQ() {
        document.querySelectorAll('.faq-question').forEach(btn => {
            btn.addEventListener('click', () => {
                const item = btn.closest('.faq-item');
                const wasActive = item.classList.contains('active');

                // Close all
                document.querySelectorAll('.faq-item').forEach(i => {
                    i.classList.remove('active');
                    i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
                });

                // Toggle current
                if (!wasActive) {
                    item.classList.add('active');
                    btn.setAttribute('aria-expanded', 'true');
                }
            });

            // Keyboard support
            btn.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    btn.click();
                }
            });
        });
    }

    // --- Initialize ---
    function init() {
        initParticles();
        initHeader();
        initMobileMenu();
        initSmoothScroll();
        initTypingEffect();
        initRevealAnimations();
        initCounters();
        initFAQ();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
