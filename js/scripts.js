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
    
    const phrases = [
        'Desenvolvedor Flutter Junior/Pleno',
        'Especialista em BLoC & Provider',
        'Integrador de APIs REST',
        'Apaixonado por UX/UI Mobile',
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typingSpeed = 80;
    const deletingSpeed = 40;
    const pauseAfterType = 1800;
    const pauseAfterDelete = 400;

    function typeWriter() {
        if (!typewriterElement) return;

        const currentPhrase = phrases[phraseIndex];

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
                phraseIndex = (phraseIndex + 1) % phrases.length;
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
});
