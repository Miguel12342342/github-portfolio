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
                        // Resgata o valor do valuenow salvo no wrapper
                        const skillLevel = bar.parentElement.getAttribute('aria-valuenow');
                        if(skillLevel) {
                            bar.style.width = skillLevel + '%';
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
    // 7. PREVIEWS ANIMADOS (GIF HOVER NO CARD)
    // ======================================================
    const projectCards = document.querySelectorAll('.projeto-card');
    projectCards.forEach(card => {
        const img = card.querySelector('.card-img');
        if (img) {
            const originalSrc = img.src;
            const gifSrc = originalSrc.replace(/\.(webp|png|jpg)$/, '.gif');
            const tempImg = new Image();
            tempImg.onload = () => {
                card.addEventListener('mouseenter', () => img.src = gifSrc);
                card.addEventListener('mouseleave', () => img.src = originalSrc);
            };
            tempImg.src = gifSrc;
        }
    });

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
    // 11. CONTACT FORM HANDLER (MAILTO NATIVO)
    // ======================================================
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            const subject = encodeURIComponent(`Novo Contato do Portfólio (via Site): ${name}`);
            const body = encodeURIComponent(`Olá Miguel,\n\nMeu nome é ${name} (${email}).\n\n${message}`);
            
            window.location.href = `mailto:miguelpagy@gmail.com?subject=${subject}&body=${body}`;
        });
    }

    // ======================================================
    // 12. TSPARTICLES LOAD NO FINAL P/ EVITAR BLOQUEIO
    // ======================================================
    if (typeof tsParticles !== 'undefined') {
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
