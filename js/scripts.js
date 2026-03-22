document.addEventListener('DOMContentLoaded', function() {
    
    // ======================================================
    // 1. SCROLL SUAVE COM OFFSET DINÂMICO DA NAVBAR
    // ======================================================
    const mainNav = document.getElementById('mainNav');

    document.querySelectorAll('a.nav-link[href^="#"], a.btn[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                // Calcula a altura real da navbar dinamicamente
                const navbarHeight = mainNav ? mainNav.offsetHeight : 70;

                window.scrollTo({
                    top: targetElement.offsetTop - navbarHeight, 
                    behavior: 'smooth' 
                });
                
                // Atualiza a URL sem recarregar a página
                if (history.pushState) {
                    history.pushState(null, null, targetId);
                } else {
                    window.location.hash = targetId; 
                }

                // Fecha o menu hamburguer no mobile
                const navbarCollapse = document.getElementById('navbarNav');
                if (navbarCollapse && navbarCollapse.classList.contains('show') && typeof bootstrap !== 'undefined') {
                    const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
                        toggle: false
                    });
                    bsCollapse.hide();
                }
            }
        });
    });

    // ======================================================
    // 2. ANIMAÇÃO DAS BARRAS DE HABILIDADE (IntersectionObserver)
    // ======================================================
    const skillsSection = document.getElementById('habilidades');
    
    if (skillsSection) {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    document.querySelectorAll('#habilidades .progress-bar').forEach(bar => {
                        const skillLevel = bar.getAttribute('aria-valuenow');
                        bar.style.width = skillLevel + '%';
                    });
                    // Para de observar após disparar: a animação ocorre apenas uma vez
                    observer.unobserve(skillsSection);
                }
            });
        }, {
            threshold: 0.3
        });

        observer.observe(skillsSection);
    }

    // ======================================================
    // 3. EFEITO MÁQUINA DE ESCREVER COM LOOP (digitar → apagar → repetir)
    // ======================================================
    const typewriterElement = document.querySelector('.typewriter');
    
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typingSpeed = 80;
    const deletingSpeed = 40;
    const pauseAfterType = 1800;
    const pauseAfterDelete = 400;

    function typeWriter() {
        if (!typewriterElement) return;

        const currentPhrases = window.typewriterPhrases || [
            'Desenvolvedor Flutter Mobile',
            'Especialista em BLoC & Provider',
            'Integrador de APIs REST',
            'Apaixonado por UX/UI Mobile',
        ];

        // Se bater no limite ao mudar idioma
        if (phraseIndex >= currentPhrases.length) phraseIndex = 0;

        const currentPhrase = currentPhrases[phraseIndex];

        if (!isDeleting) {
            // Digitando
            typewriterElement.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;

            if (charIndex === currentPhrase.length) {
                // Frase completa → pausa antes de apagar
                isDeleting = true;
                setTimeout(typeWriter, pauseAfterType);
                return;
            }
            setTimeout(typeWriter, typingSpeed);
        } else {
            // Apagando
            typewriterElement.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;

            if (charIndex === 0) {
                // Frase apagada → avança para a próxima frase
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % currentPhrases.length;
                setTimeout(typeWriter, pauseAfterDelete);
                return;
            }
            setTimeout(typeWriter, deletingSpeed);
        }
    }

    if (typewriterElement) {
        typewriterElement.style.borderRight = '2px solid';
        setTimeout(typeWriter, 600);
    }

    // ======================================================
    // 4. ANO DINÂMICO NO RODAPÉ
    // ======================================================
    const footerYear = document.getElementById('footer-year');
    if (footerYear) {
        footerYear.textContent = new Date().getFullYear();
    }

    // ======================================================
    // 5. TSPARTICLES (GRAVIDADE ZERO)
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
                    move: { enable: true, speed: 1.2, direction: "none", random: false, straight: false, outModes: { default: "bounce" } },
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
        }, {
            threshold: 0.15,
            rootMargin: "0px 0px -50px 0px"
        });
        fadeElements.forEach(el => fadeObserver.observe(el));
    }

    // ======================================================
    // 7. PREVIEWS ANIMADOS (GIF HOVER NO CARD)
    // ======================================================
    const projectCards = document.querySelectorAll('.projeto-card');
    projectCards.forEach(card => {
        const img = card.querySelector('.card-img-top');
        if (img) {
            const originalSrc = img.src;
            const gifSrc = originalSrc.replace(/\.(webp|png|jpg)$/, '.gif');
            
            // Sistema Inteligente de Pre-load: 
            // Só vai ativar o efeito de hover se o arquivo .gif existir de verdade na pasta img/
            const tempImg = new Image();
            tempImg.onload = () => {
                card.addEventListener('mouseenter', () => img.src = gifSrc);
                card.addEventListener('mouseleave', () => img.src = originalSrc);
            };
            // Ao setar o src, o navegador tenta baixar o gif em background.
            // Se falhar (erro 404, sem gif), o onload não dispara e nada "quebra".
            tempImg.src = gifSrc;
        }
    });

    // ======================================================
    // 8. CUSTOM MAGNETIC CURSOR
    // ======================================================
    const cursorDot = document.querySelector('[data-cursor-dot]');
    const cursorOutline = document.querySelector('[data-cursor-outline]');

    if (cursorDot && cursorOutline) {
        // Trackeia mouse globalmente
        window.addEventListener('mousemove', function (e) {
            const posX = e.clientX;
            const posY = e.clientY;

            // Ponto central obedece 1:1 ao pixel exato
            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;

            // Anel externo acompanha com delay dinâmico
            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 150, fill: "forwards" });
        });

        // Adiciona classe de "Aura/Zoom" ao passar em clicáveis
        const interactables = document.querySelectorAll('a, button, .projeto-card, input, textarea, .nav-link');
        interactables.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorOutline.classList.add('hover-active');
            });
            el.addEventListener('mouseleave', () => {
                cursorOutline.classList.remove('hover-active');
            });
        });
    }

    // ======================================================
    // 9. 3D HOVER TILT (FÍSICA NOS CARDS)
    // ======================================================
    const tiltCards = document.querySelectorAll('.projeto-card, .bento-item');
    
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            // Transição rápida para grudar no mouse perfeitamente
            card.style.transition = 'transform 0.1s ease-out';
            
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            // Intensidade do ângulo 3D
            const multiplier = 12; 
            
            const xRotation = (y / (rect.height / 2)) * -multiplier;
            const yRotation = (x / (rect.width / 2)) * multiplier;
            
            card.style.transform = `perspective(1000px) rotateX(${xRotation}deg) rotateY(${yRotation}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            // Transição mansa e fluída no momento que o mouse larga do elemento (Retorno ao eixo zero)
            card.style.transition = 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)';
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            
            // Se existir o evento hover natural, a classe hover do CSS cuidará depois...
            setTimeout(() => {
                card.style.transition = '';
            }, 600);
        });
    });

    // ======================================================
    // 10. SCROLL PARALLAX (PROFUNDIDADE 3D DA LENTE GLOBAL)
    // ======================================================
    
    // Normalização Dinâmica: Envelopa todo conteúdo das sections que usam classe "container" isoladamente.
    // Isso é Vital para que o `parentElement.getBoundingClientRect()` não crie Loop Infinito no Parallax.
    document.querySelectorAll('section.container').forEach(sec => {
        const wrapper = document.createElement('div');
        wrapper.className = 'container relative-z';
        while (sec.firstChild) {
            wrapper.appendChild(sec.firstChild);
        }
        sec.appendChild(wrapper);
        sec.classList.remove('container');
        sec.classList.add('w-100'); // Evitar recuos estranhos de padding
    });

    const parallaxSections = document.querySelectorAll('section .container');
    const particlesContainer = document.querySelector('#tsparticles');

    let lastKnownScrollPosition = 0;
    let ticking = false;

    window.addEventListener('scroll', () => {
        lastKnownScrollPosition = window.scrollY;

        if (!ticking) {
            window.requestAnimationFrame(() => {
                
                // Efeito Parallax em Multi-Camadas (Descola todas as seções)
                parallaxSections.forEach(sec => {
                    const rect = sec.parentElement.getBoundingClientRect();
                    // Quando a section pai cruza o topo da tela
                    if (rect.top <= 0 && rect.bottom > 0) {
                        const scrolledPast = Math.abs(rect.top);
                        // container interno fica p/ trás criando o parallax
                        sec.style.transform = `translateY(${scrolledPast * 0.4}px)`;
                        sec.style.opacity = 1 - (scrolledPast / (rect.height * 0.4));
                    } else if (rect.top > 0) {
                        sec.style.transform = `translateY(0px)`;
                        sec.style.opacity = 1;
                    }
                });
                
                // Fundo Global 
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
            e.preventDefault(); // Impede a recarga da página
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            const subject = encodeURIComponent(`Novo Contato do Portfólio (via Site): ${name}`);
            const body = encodeURIComponent(`Olá Miguel,\n\nMeu nome é ${name} (${email}).\n\n${message}`);
            
            // Abre o app de email padrão do recutador já com tudo preenchido para ele te enviar na hora!
            window.location.href = `mailto:miguelpagy@gmail.com?subject=${subject}&body=${body}`;
        });
    }

});
