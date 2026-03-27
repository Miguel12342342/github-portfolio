document.addEventListener('DOMContentLoaded', function() {

    // Definido aqui para ser acessível em todos os sections abaixo
    const isMobile = window.matchMedia('(max-width: 640px)').matches;

    // ======================================================
    // 1. MENU HAMBÚRGUER (Versão Customizada Mobile)
    // ======================================================
    const menuToggle = document.getElementById('menu-toggle');
    const navbarNav  = document.getElementById('navbarNav');

    if (menuToggle && navbarNav) {
        menuToggle.addEventListener('click', () => {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !isExpanded);
            menuToggle.classList.toggle('is-active');
            navbarNav.classList.toggle('is-active');
        });

        // Fecha ao tocar fora do menu no mobile
        document.addEventListener('click', e => {
            if (
                navbarNav.classList.contains('is-active') &&
                !navbarNav.contains(e.target) &&
                !menuToggle.contains(e.target)
            ) {
                navbarNav.classList.remove('is-active');
                menuToggle.classList.remove('is-active');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // ======================================================
    // 2. SCROLL SUAVE COM OFFSET DINÂMICO DA NAVBAR
    // ======================================================
    const mainNav = document.querySelector('.site-header');

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                e.preventDefault();
                const navbarHeight = mainNav ? mainNav.offsetHeight : 80;

                window.scrollTo({
                    top: targetElement.offsetTop - navbarHeight, 
                    behavior: 'smooth' 
                });
                
                // Trato estado da URL de forma limpa
                if (history.pushState) {
                    history.pushState(null, null, targetId);
                } else {
                    window.location.hash = targetId; 
                }

                // Fechar menu no mobile ao clicar num link interno
                if (navbarNav && navbarNav.classList.contains('is-active')) {
                    navbarNav.classList.remove('is-active');
                    menuToggle.classList.remove('is-active');
                    menuToggle.setAttribute('aria-expanded', 'false');
                }
            }
        });
    });

    // ======================================================
    // 3. ANIMAÇÃO DAS BARRAS DE HABILIDADE (IntersectionObserver)
    // ======================================================
    const skillsSection = document.getElementById('habilidades');
    if (skillsSection) {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    document.querySelectorAll('#habilidades .progress-bar').forEach(bar => {
                        const skillLevel = parseInt(bar.parentElement.getAttribute('aria-valuenow'));
                        if (skillLevel) {
                            bar.style.transform = `scaleX(${skillLevel / 100})`;
                            const percentEl = bar.closest('.skill-item')?.querySelector('.skill-percent');
                            if (percentEl) {
                                let current = 0;
                                const intervalMs = Math.round(1500 / skillLevel);
                                const timer = setInterval(() => {
                                    current = Math.min(current + 1, skillLevel);
                                    percentEl.textContent = `${current}%`;
                                    if (current >= skillLevel) clearInterval(timer);
                                }, intervalMs);
                            }
                        }
                    });
                    observer.unobserve(skillsSection);
                }
            });
        }, { threshold: isMobile ? 0.1 : 0.25 });
        observer.observe(skillsSection);
    }

    // ======================================================
    // 4. EFEITO MÁQUINA DE ESCREVER COM LOOP
    // ======================================================
    const typewriterElement = document.querySelector('.typewriter');
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    function typeWriter() {
        if (!typewriterElement) return;
        const currentPhrases = window.typewriterPhrases || [
            'Desenvolvedor Flutter Mobile',
            'Especialista em BLoC & Provider',
            'Integrador de APIs REST',
            'Apaixonado por UX/UI Mobile',
        ];

        if (phraseIndex >= currentPhrases.length) phraseIndex = 0;
        const currentPhrase = currentPhrases[phraseIndex];

        if (!isDeleting) {
            typewriterElement.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            if (charIndex === currentPhrase.length) {
                isDeleting = true;
                setTimeout(typeWriter, 1800);
                return;
            }
            setTimeout(typeWriter, 80);
        } else {
            typewriterElement.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            if (charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % currentPhrases.length;
                setTimeout(typeWriter, 400);
                return;
            }
            setTimeout(typeWriter, 40);
        }
    }

    if (typewriterElement) {
        setTimeout(typeWriter, 600);
    }

    // ======================================================
    // 5. ANO DINÂMICO DO FOOTER
    // ======================================================
    const footerYear = document.getElementById('footer-year');
    if (footerYear) footerYear.textContent = new Date().getFullYear();

    // ======================================================
    // 6. SCROLL ANIMATIONS (FADE-IN-UP)
    // ======================================================

    // ── Passo 1: corrige opacity composta no hero ─────────────────────────
    // hero-text tem fade-in-up E seus filhos também.
    // CSS multiplica opacity pai × filho → filhos invisíveis até pai completar.
    // Fix: forçar o container visível sem animação antes de qualquer outra coisa.
    const heroContainer = document.querySelector('.hero-text.fade-in-up');
    if (heroContainer) {
        heroContainer.style.transition = 'none';
        heroContainer.classList.add('is-visible');
        // Limpa o inline style depois de um frame para não suprimir transições futuras
        requestAnimationFrame(() => { heroContainer.style.transition = ''; });
    }

    // ── Passo 2: stagger por grupo de irmãos ─────────────────────────────
    // Intervalo adaptativo: grupos grandes (≥5, ex: hero children) usam 55ms
    // para uma cascata rápida; grupos menores (cards, halves) usam 90ms para
    // tornar cada elemento claramente distinto.
    const fadeElements = document.querySelectorAll('.fade-in-up:not(.is-visible)');

    if (fadeElements.length > 0) {
        const seenParents = new Set();

        fadeElements.forEach(el => {
            const parent = el.parentElement;
            if (seenParents.has(parent)) return;
            seenParents.add(parent);

            const siblings = [...parent.querySelectorAll(':scope > .fade-in-up:not(.is-visible)')];
            if (siblings.length > 1) {
                const interval = siblings.length >= 5 ? 55 : 90;
                siblings.forEach((sib, idx) => {
                    sib.style.transitionDelay = `${idx * interval}ms`;
                });
            }
        });

        // ── Passo 3: observer com will-change gerenciado ──────────────────
        // will-change adicionado ANTES da animação e removido DEPOIS.
        // Evita ter todas as layers GPU vivas permanentemente (bug anterior).
        // rootMargin em % escala com o viewport; threshold baixo = responsivo.
        const fadeObserver = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;

                const el = entry.target;
                el.style.willChange = 'opacity, transform';
                el.classList.add('is-visible');
                obs.unobserve(el);

                // Libera a layer GPU logo que a transição termina
                el.addEventListener('transitionend', () => {
                    el.style.willChange = 'auto';
                }, { once: true });
            });
        }, {
            threshold: 0.08,
            rootMargin: '0px 0px -8% 0px'
        });

        fadeElements.forEach(el => fadeObserver.observe(el));
    }

    // ======================================================
    // 8. CUSTOM MAGNETIC CURSOR (Pointer Fine)
    // ======================================================
    const cursorDot = document.querySelector('[data-cursor-dot]');
    const cursorOutline = document.querySelector('[data-cursor-outline]');

    if (cursorDot && cursorOutline && window.matchMedia("(pointer: fine)").matches) {
        window.addEventListener('mousemove', function (e) {
            cursorDot.style.left = `${e.clientX}px`;
            cursorDot.style.top = `${e.clientY}px`;

            cursorOutline.animate({
                left: `${e.clientX}px`,
                top: `${e.clientY}px`
            }, { duration: 150, fill: "forwards" });
        });

        const interactables = document.querySelectorAll('a, button, .projeto-card, input, textarea');
        interactables.forEach(el => {
            el.addEventListener('mouseenter', () => cursorOutline.classList.add('hover-active'));
            el.addEventListener('mouseleave', () => cursorOutline.classList.remove('hover-active'));
        });
    }

    // ======================================================
    // 9. 3D HOVER TILT NO CARD PROJETOS
    // ======================================================
    const tiltCards = document.querySelectorAll('.projeto-card');
    if (window.matchMedia("(pointer: fine)").matches) {
        tiltCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                card.style.transition = 'transform 0.1s ease-out';
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                const multiplier = 12; 
                const xRotation = (y / (rect.height / 2)) * -multiplier;
                const yRotation = (x / (rect.width / 2)) * multiplier;
                card.style.transform = `perspective(1000px) rotateX(${xRotation}deg) rotateY(${yRotation}deg) scale3d(1.02, 1.02, 1.02)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transition = 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)';
                card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
                setTimeout(() => card.style.transition = '', 600);
            });
        });
    }

    // ======================================================
    // 10. SCROLL MANAGER — parallax, progress bar, back-to-top
    //     Um único listener + RAF para evitar múltiplos triggers
    //     por frame. passive:true nunca bloqueou scroll no iOS/Android.
    // ======================================================
    const parallaxSections   = document.querySelectorAll('.padding-section');
    const particlesContainer = document.querySelector('#tsparticles');
    const scrollProgressBar  = document.getElementById('scroll-progress');
    const backToTopBtn       = document.getElementById('back-to-top');
    let lastKnownScrollPosition = 0;
    let ticking = false;

    window.addEventListener('scroll', () => {
        lastKnownScrollPosition = window.scrollY;

        if (!ticking) {
            window.requestAnimationFrame(() => {

                // ── Progress bar ──────────────────────────────────────
                if (scrollProgressBar) {
                    const docH = document.documentElement.scrollHeight - window.innerHeight;
                    const pct  = docH > 0 ? (lastKnownScrollPosition / docH) * 100 : 0;
                    scrollProgressBar.style.width = `${Math.min(pct, 100)}%`;
                    scrollProgressBar.setAttribute('aria-valuenow', Math.round(pct));
                }

                // ── Back to top visibility ────────────────────────────
                if (backToTopBtn) {
                    backToTopBtn.classList.toggle('is-visible', lastKnownScrollPosition > 300);
                }

                // ── Parallax (desktop apenas) ─────────────────────────
                // Em mobile o viewport é pequeno demais: o fade de opacity
                // tornava conteúdo ilegível antes de sair da tela.
                if (!isMobile) {
                    parallaxSections.forEach(sec => {
                        const rect        = sec.getBoundingClientRect();
                        const innerWrapper = sec.querySelector('.wrapper');
                        if (!innerWrapper) return;

                        if (rect.top <= 0 && rect.bottom > 0) {
                            const scrolledPast = Math.abs(rect.top);
                            const isProjetos   = sec.id === 'projetos';
                            const isContato    = sec.id === 'contato';

                            if (!isContato) {
                                let opacity   = 1;
                                let translate = 0;

                                if (isProjetos) {
                                    // Fade somente quando a seção seguinte começa a entrar
                                    const triggerPoint = Math.max(0, rect.height - window.innerHeight);
                                    if (scrolledPast > triggerPoint) {
                                        opacity = 1 - ((scrolledPast - triggerPoint) / (window.innerHeight * 0.8));
                                    }
                                } else {
                                    translate = scrolledPast * 0.4;
                                    // 0.6 em vez de 0.4: fade menos agressivo, conteúdo legível por mais tempo
                                    opacity = 1 - (scrolledPast / (rect.height * 0.6));
                                }

                                innerWrapper.style.transform = `translateY(${translate}px)`;
                                innerWrapper.style.opacity   = String(Math.max(0, Math.min(1, opacity)));
                            }
                        } else if (rect.top > 0) {
                            // Seção voltou para baixo do viewport: reset
                            innerWrapper.style.transform = 'translateY(0px)';
                            innerWrapper.style.opacity   = '1';
                        }
                    });

                    if (particlesContainer) {
                        particlesContainer.style.transform =
                            `translateY(${lastKnownScrollPosition * 0.05}px)`;
                    }
                }

                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true }); // passive:true — libera o thread de scroll no iOS/Android

    // Back to top — apenas o click (visibilidade gerenciada acima)
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ======================================================
    // 11. CONTACT FORM HANDLER (FORMSPREE)
    // SETUP: crie uma conta gratuita em https://formspree.io,
    //        crie um form e substitua YOUR_FORMSPREE_ID pelo ID gerado.
    // ======================================================
    const FORMSPREE_ID = 'YOUR_FORMSPREE_ID';

    const contactForm = document.getElementById('contactForm');
    const formFeedback = document.getElementById('form-feedback');

    function showFeedback(type) {
        const lang = localStorage.getItem('lang') || 'pt';
        const t = window.formMessages || {
            pt: { success: 'Mensagem enviada! Em breve entrarei em contato.', error: 'Erro ao enviar. Tente novamente ou envie direto para miguelpagy@gmail.com.' },
            en: { success: "Message sent! I'll get back to you soon.", error: 'Error sending. Try again or reach me directly at miguelpagy@gmail.com.' }
        };
        formFeedback.textContent = t[lang][type];
        formFeedback.className = `form-feedback ${type}`;
        setTimeout(() => { formFeedback.className = 'form-feedback'; }, 6000);
    }

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            submitBtn.disabled = true;

            const data = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                message: document.getElementById('message').value
            };

            if (FORMSPREE_ID === 'YOUR_FORMSPREE_ID') {
                // Fallback: abre cliente de email enquanto FORMSPREE_ID não está configurado
                const subject = encodeURIComponent(`Contato do Portfólio: ${data.name}`);
                const body = encodeURIComponent(`Olá Miguel,\n\nMeu nome é ${data.name} (${data.email}).\n\n${data.message}`);
                window.location.href = `mailto:miguelpagy@gmail.com?subject=${subject}&body=${body}`;
                submitBtn.disabled = false;
                return;
            }

            fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify(data)
            })
            .then(res => {
                if (res.ok) {
                    contactForm.reset();
                    showFeedback('success');
                } else {
                    showFeedback('error');
                }
            })
            .catch(() => showFeedback('error'))
            .finally(() => { submitBtn.disabled = false; });
        });
    }

    // ======================================================
    // 15. SCROLL-SPY NAVBAR (IntersectionObserver)
    // ======================================================
    const allSections = document.querySelectorAll('section[id]');
    const allNavLinks = document.querySelectorAll('.nav-links li a[href^="#"]');

    if (allSections.length && allNavLinks.length) {
        const spyObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const activeId = entry.target.getAttribute('id');
                    allNavLinks.forEach(link => {
                        const isActive = link.getAttribute('href') === `#${activeId}`;
                        link.classList.toggle('active', isActive);
                        if (isActive) {
                            link.setAttribute('aria-current', 'page');
                        } else {
                            link.removeAttribute('aria-current');
                        }
                    });
                }
            });
        }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });

        allSections.forEach(section => spyObserver.observe(section));
    }

    // ======================================================
    // 16. COPY EMAIL TO CLIPBOARD
    // ======================================================
    document.querySelectorAll('.contact-item[data-copy]').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const text = this.dataset.copy;
            navigator.clipboard.writeText(text).then(() => {
                this.classList.add('copied');
                setTimeout(() => this.classList.remove('copied'), 2200);
            }).catch(() => {
                window.location.href = `mailto:${text}`;
            });
        });
    });

    // ======================================================
    // 17. COMMAND PALETTE (Ctrl/Cmd + K)
    // ======================================================
    const cmdOverlay  = document.getElementById('cmd-overlay');
    const cmdInput    = document.getElementById('cmd-input');
    const cmdItemEls  = document.querySelectorAll('.cmd-item');
    let cmdSelectedIdx = -1;

    function openCmd() {
        if (!cmdOverlay) return;
        cmdOverlay.classList.add('is-open');
        cmdOverlay.setAttribute('aria-hidden', 'false');
        if (cmdInput) {
            cmdInput.value = '';
            cmdItemEls.forEach(i => i.classList.remove('is-hidden', 'is-selected'));
        }
        cmdSelectedIdx = -1;
        setTimeout(() => cmdInput?.focus(), 50);
    }

    function closeCmd() {
        if (!cmdOverlay) return;
        cmdOverlay.classList.remove('is-open');
        cmdOverlay.setAttribute('aria-hidden', 'true');
    }

    function execCmd(item) {
        const href = item.dataset.href;
        if (!href) return;
        closeCmd();
        const target = document.querySelector(href);
        if (target) {
            const offset = mainNav ? mainNav.offsetHeight : 80;
            window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
            if (history.pushState) history.pushState(null, null, href);
        }
    }

    if (cmdOverlay && cmdInput) {
        document.addEventListener('keydown', e => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                cmdOverlay.classList.contains('is-open') ? closeCmd() : openCmd();
            }
            if (e.key === 'Escape' && cmdOverlay.classList.contains('is-open')) closeCmd();
        });

        cmdOverlay.addEventListener('click', e => { if (e.target === cmdOverlay) closeCmd(); });

        cmdInput.addEventListener('input', () => {
            const q = cmdInput.value.toLowerCase().trim();
            cmdSelectedIdx = -1;
            cmdItemEls.forEach(item => {
                item.classList.toggle('is-hidden', q.length > 0 && !item.textContent.toLowerCase().includes(q));
                item.classList.remove('is-selected');
            });
        });

        cmdInput.addEventListener('keydown', e => {
            const visible = [...cmdItemEls].filter(i => !i.classList.contains('is-hidden'));
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                cmdSelectedIdx = Math.min(cmdSelectedIdx + 1, visible.length - 1);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                cmdSelectedIdx = Math.max(cmdSelectedIdx - 1, 0);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                const target = cmdSelectedIdx >= 0 ? visible[cmdSelectedIdx] : visible[0];
                if (target) execCmd(target);
                return;
            }
            visible.forEach((item, i) => item.classList.toggle('is-selected', i === cmdSelectedIdx));
            if (cmdSelectedIdx >= 0) visible[cmdSelectedIdx]?.scrollIntoView({ block: 'nearest' });
        });

        cmdItemEls.forEach(item => item.addEventListener('click', () => execCmd(item)));
    }

    const cmdHintBtn = document.getElementById('cmdPaletteHint');
    if (cmdHintBtn) cmdHintBtn.addEventListener('click', openCmd);

    // ======================================================
    // 18. GITHUB LIVE STATS
    // ======================================================
    const GITHUB_USER = 'Miguel12342342';
    const GH_CACHE_KEY = 'gh_stats_v1';
    const GH_CACHE_TTL = 30 * 60 * 1000; // 30 min

    function animateStatCounter(el, target) {
        let current = 0;
        const steps = Math.min(target, 60);
        const stepVal = Math.ceil(target / steps);
        const intervalMs = Math.floor(900 / steps);
        const timer = setInterval(() => {
            current = Math.min(current + stepVal, target);
            el.textContent = current;
            if (current >= target) clearInterval(timer);
        }, intervalMs);
    }

    function renderGitHubStats(data) {
        const lang = localStorage.getItem('lang') || 'pt';
        const rtf = new Intl.RelativeTimeFormat(lang, { numeric: 'auto' });
        const daysAgo = Math.floor((Date.now() - new Date(data.lastPush)) / 86400000);

        const reposEl     = document.getElementById('stat-repos');
        const starsEl     = document.getElementById('stat-stars');
        const followersEl = document.getElementById('stat-followers');
        const activityEl  = document.getElementById('stat-activity');

        if (reposEl)     animateStatCounter(reposEl, data.repos);
        if (starsEl)     animateStatCounter(starsEl, data.stars);
        if (followersEl) animateStatCounter(followersEl, data.followers);
        if (activityEl)  activityEl.textContent = rtf.format(-daysAgo, 'day');
    }

    async function loadGitHubStats() {
        const cached = sessionStorage.getItem(GH_CACHE_KEY);
        if (cached) {
            try {
                const { data, ts } = JSON.parse(cached);
                if (Date.now() - ts < GH_CACHE_TTL) { renderGitHubStats(data); return; }
            } catch (_) { /* stale cache */ }
        }

        try {
            const [userRes, reposRes] = await Promise.all([
                fetch(`https://api.github.com/users/${GITHUB_USER}`),
                fetch(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=pushed`)
            ]);
            if (!userRes.ok || !reposRes.ok) return;

            const [user, repos] = await Promise.all([userRes.json(), reposRes.json()]);

            const data = {
                repos:     user.public_repos,
                stars:     repos.reduce((s, r) => s + r.stargazers_count, 0),
                followers: user.followers,
                lastPush:  repos[0]?.pushed_at ?? user.updated_at
            };

            sessionStorage.setItem(GH_CACHE_KEY, JSON.stringify({ data, ts: Date.now() }));
            renderGitHubStats(data);
        } catch (_) { /* API unavailable — stays as placeholder */ }
    }

    if (document.getElementById('stat-repos')) loadGitHubStats();

    // ======================================================
    // 19. PHONE MOCKUP CAROUSEL + 3D TILT
    // ======================================================
    const phoneSlides  = document.querySelectorAll('.phone-slide');
    const phoneDotEls  = document.querySelectorAll('.phone-dot');
    const phoneFrameEl = document.querySelector('.phone-frame');
    let phoneIdx = 0;
    let phoneTick;

    function goToPhoneSlide(idx) {
        phoneSlides[phoneIdx].classList.remove('active');
        phoneDotEls[phoneIdx].classList.remove('active');
        phoneIdx = idx;
        phoneSlides[phoneIdx].classList.add('active');
        phoneDotEls[phoneIdx].classList.add('active');
    }

    if (phoneSlides.length) {
        phoneTick = setInterval(() => goToPhoneSlide((phoneIdx + 1) % phoneSlides.length), 3200);

        phoneDotEls.forEach((dot, i) => dot.addEventListener('click', () => {
            clearInterval(phoneTick);
            goToPhoneSlide(i);
            phoneTick = setInterval(() => goToPhoneSlide((phoneIdx + 1) % phoneSlides.length), 3200);
        }));

        if (phoneFrameEl) {
            phoneFrameEl.addEventListener('mouseenter', () => clearInterval(phoneTick));
            phoneFrameEl.addEventListener('mouseleave', () => {
                phoneFrameEl.style.transform = 'perspective(900px) rotateY(0deg) rotateX(0deg) scale(1)';
                phoneTick = setInterval(() => goToPhoneSlide((phoneIdx + 1) % phoneSlides.length), 3200);
            });
            phoneFrameEl.addEventListener('mousemove', e => {
                const r = phoneFrameEl.getBoundingClientRect();
                const x = (e.clientX - r.left - r.width  / 2) / (r.width  / 2);
                const y = (e.clientY - r.top  - r.height / 2) / (r.height / 2);
                phoneFrameEl.style.transform =
                    `perspective(900px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) scale(1.03)`;
            });
        }
    }

    // ======================================================
    // 12. TSPARTICLES LOAD NO FINAL P/ EVITAR BLOQUEIO
    // Desabilitado em mobile: impacto de performance em dispositivos fracos
    // ======================================================
    if (!isMobile && typeof tsParticles !== 'undefined') {
        tsParticles.load({
            id: "tsparticles",
            options: {
                fullScreen: { enable: false },
                particles: {
                    number: { value: 60, density: { enable: true } },
                    color: { value: ["#4dd0e1", "#007bff", "#bb86fc"] },
                    links: { enable: true, color: "#888888", distance: 150, opacity: 0.2, width: 1 },
                    move: { enable: true, speed: 1.2, direction: "none", outModes: { default: "bounce" } },
                    size: { value: { min: 1, max: 3 } },
                    opacity: { value: { min: 0.1, max: 0.5 } }
                },
                interactivity: {
                    detectsOn: "window",
                    events: { onHover: { enable: true, mode: "grab" } },
                    modes: { grab: { distance: 140, links: { opacity: 0.5 } } }
                },
                detectRetina: true
            }
        });
    }

    // ======================================================
    // 20. CODE SHOWCASE — tabs + syntax highlight + copy
    // ======================================================
    const codeShowcase = document.querySelector('.code-showcase');

    if (codeShowcase && typeof hljs !== 'undefined') {
        // Highlight all code blocks once on load
        codeShowcase.querySelectorAll('pre code').forEach(block => {
            hljs.highlightElement(block);
        });

        // Tab switching
        const codeTabs   = codeShowcase.querySelectorAll('.code-tab');
        const codePanels = codeShowcase.querySelectorAll('.code-panel');

        codeTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const target = tab.dataset.tab;

                codeTabs.forEach(t => {
                    t.classList.remove('is-active');
                    t.setAttribute('aria-selected', 'false');
                });
                codePanels.forEach(p => p.classList.remove('is-active'));

                tab.classList.add('is-active');
                tab.setAttribute('aria-selected', 'true');
                codeShowcase.querySelector(`.code-panel[data-panel="${target}"]`)
                    ?.classList.add('is-active');
            });
        });

        // Copy button — reads textContent (strips hljs spans, gets raw Dart)
        codeShowcase.querySelectorAll('.code-copy-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const codeEl = btn.closest('.code-panel').querySelector('code');
                const text   = codeEl ? codeEl.textContent : '';

                navigator.clipboard.writeText(text).then(() => {
                    btn.classList.add('copied');
                    btn.querySelector('i').className = 'fas fa-check';
                    setTimeout(() => {
                        btn.classList.remove('copied');
                        btn.querySelector('i').className = 'fas fa-copy';
                    }, 2000);
                }).catch(() => {});
            });
        });
    }

});
