document.addEventListener('DOMContentLoaded', function() {
    
    // ======================================================
    // 1. SCROLL SUAVE OTIMIZADO (COM ATUALIZAÇÃO DE URL)
    // ======================================================
    // Seleciona links da navegação e botões que apontam para IDs na mesma página
    document.querySelectorAll('a.nav-link[href^="#"], a.btn[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            
            e.preventDefault(); // Impede o salto instantâneo padrão
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                // 1. Rola para a seção com animação suave, compensando a altura da navbar (70px)
                window.scrollTo({
                    // O valor 70 é a compensação da altura da barra de navegação fixa
                    top: targetElement.offsetTop - 70, 
                    behavior: 'smooth' 
                });
                
                // 2. ATUALIZA A URL logo após a rolagem começar, sem recarregar a página
                if (history.pushState) {
                    history.pushState(null, null, targetId);
                } else {
                    window.location.hash = targetId; 
                }

                // 3. Fecha o menu hamburguer (apenas se o Bootstrap estiver carregado e o menu estiver aberto)
                const navbarCollapse = document.getElementById('navbarNav');
                // Verifica se o menu está aberto E se o objeto 'bootstrap' existe globalmente
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
    //    Esta é a forma mais eficiente de animar ao entrar na tela.
    // ======================================================
    const skillsSection = document.getElementById('habilidades');
    
    if (skillsSection) {
        // Cria o observador
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Se a seção estiver visível, aciona a animação
                    document.querySelectorAll('#habilidades .progress-bar').forEach(bar => {
                        const skillLevel = bar.getAttribute('aria-valuenow');
                        bar.style.width = skillLevel + '%';
                    });
                    // Para de observar depois de disparar, para que a animação só ocorra uma vez
                    observer.unobserve(skillsSection);
                }
            });
        }, {
            threshold: 0.5 // Dispara quando 50% da seção estiver visível
        });

        // Inicia a observação
        observer.observe(skillsSection);
    }
// ======================================================
    // 3. EFEITO MÁQUINA DE ESCREVER (TYPEWRITER EFFECT)
    // ======================================================
    const typewriterElement = document.querySelector('.typewriter');
    // Texto que será digitado
    const textToType = 'Desenvolvedor Flutter Junior/Pleno'; 
    let charIndex = 0; // Índice do caractere atual
    const typingSpeed = 100; // Velocidade de digitação (milissegundos por caractere)

    function typeWriter() {
        if (charIndex < textToType.length) {
            // Adiciona o próximo caractere ao elemento
            typewriterElement.textContent += textToType.charAt(charIndex);
            charIndex++;
            // Agenda a próxima chamada recursiva
            setTimeout(typeWriter, typingSpeed);
        }
    }

    // Adiciona o cursor piscante (opcional, mas recomendado para o efeito)
    if (typewriterElement) {
        // Adiciona um cursor visualmente discreto no CSS
        typewriterElement.style.borderRight = '2px solid'; 
        // Inicia a animação após um pequeno atraso (para dar tempo do usuário ver)
        setTimeout(typeWriter, 500); 
    }
    
    // Opcional: Para fazer o cursor piscar (melhor no CSS)
    // No CSS, adicione:
    // .typewriter { animation: blink-caret 0.75s step-end infinite; }
    // @keyframes blink-caret { from, to { border-color: transparent } 50% { border-color: inherit; } }
}); 
// Este é o final do seu document.addEventListener('DOMContentLoaded', function() { ... });


