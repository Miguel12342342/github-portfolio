document.addEventListener('DOMContentLoaded', function() {
    
    // ======================================================
    // 1. MENU HAMBÚRGUER (Versão Customizada Mobile)
    // ======================================================
    const menuToggle = document.getElementById('menu-toggle');
    const navbarNav = document.getElementById('navbarNav');

    if (menuToggle && navbarNav) {
        menuToggle.addEventListener('click', () => {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !isExpanded);
            menuToggle.classList.toggle('is-active');
            navbarNav.classList.toggle('is-active');
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
        }, { threshold: 0.3 });
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
    const fadeElements = document.querySelectorAll('.fade-in-up');
    if (fadeElements.length > 0) {
        const fadeObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: "0px 0px -50px 0px" });
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
    // 10. SCROLL PARALLAX SYSTEM
    // ======================================================
    const parallaxSections = document.querySelectorAll('.padding-section');
    const particlesContainer = document.querySelector('#tsparticles');
    let lastKnownScrollPosition = 0;
    let ticking = false;

    window.addEventListener('scroll', () => {
        lastKnownScrollPosition = window.scrollY;
        
        if (!ticking) {
            window.requestAnimationFrame(() => {
                parallaxSections.forEach(sec => {
                    const rect = sec.getBoundingClientRect();
                    const innerWrapper = sec.querySelector('.wrapper');
                    
                    if(innerWrapper) {
                        if (rect.top <= 0 && rect.bottom > 0) {
                            const scrolledPast = Math.abs(rect.top);
                            const isProjetos = sec.id === 'projetos';
                            const isContato = sec.id === 'contato';
                            
                            if (!isContato) {
                                let currentOpacity = 1;
                                let currentTranslate = 0;

                                if (isProjetos) {
                                    currentTranslate = 0; // Fixa a seção na posição normal
                                    
                                    // Começa a sumir apenas quando a base da sessão chega perto do fim da tela (Contato aparecendo)
                                    const triggerPoint = Math.max(0, rect.height - window.innerHeight);
                                    
                                    if (scrolledPast > triggerPoint) {
                                        const amountPast = scrolledPast - triggerPoint;
                                        // Fade suave baseado na subida da próxima sessão
                                        currentOpacity = 1 - (amountPast / (window.innerHeight * 0.8));
                                    }
                                } else {
                                    currentTranslate = scrolledPast * 0.4;
                                    currentOpacity = 1 - (scrolledPast / (rect.height * 0.4));
                                }
                                
                                innerWrapper.style.transform = `translateY(${currentTranslate}px)`;
                                innerWrapper.style.opacity = Math.max(0, currentOpacity);
                            }
                        } else if (rect.top > 0) {
                            innerWrapper.style.transform = `translateY(0px)`;
                            innerWrapper.style.opacity = 1;
                        }
                    }
                });
                
                if (particlesContainer) {
                    particlesContainer.style.transform = `translateY(${lastKnownScrollPosition * 0.05}px)`;
                }
                ticking = false;
            });
            ticking = true;
        }
    });

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
    // 13. SCROLL PROGRESS BAR
    // ======================================================
    const scrollProgressBar = document.getElementById('scroll-progress');
    if (scrollProgressBar) {
        window.addEventListener('scroll', () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            scrollProgressBar.style.width = `${Math.min(pct, 100)}%`;
            scrollProgressBar.setAttribute('aria-valuenow', Math.round(pct));
        }, { passive: true });
    }

    // ======================================================
    // 14. BACK TO TOP BUTTON
    // ======================================================
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            backToTopBtn.classList.toggle('is-visible', window.scrollY > 300);
        }, { passive: true });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
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
    // 12. TSPARTICLES LOAD NO FINAL P/ EVITAR BLOQUEIO
    // Desabilitado em mobile: impacto de performance em dispositivos fracos
    // ======================================================
    const isMobile = window.matchMedia('(max-width: 640px)').matches;

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

});
