document.addEventListener('DOMContentLoaded', function() {
    
    // ======================================================
    // 1. SCROLL SUAVE PARA LINKS DE NAVEGAÇÃO
    // ======================================================
    // Seleciona todos os links na navegação que apontam para uma seção (ID com #)
    document.querySelectorAll('a.nav-link[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault(); // Impede o comportamento de salto padrão
            
            // Pega o ID da seção (ex: #sobre, #habilidades)
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70, // Rola para o topo do elemento menos 70px (para compensar a altura da navbar fixa)
                    behavior: 'smooth' // Ativa o scroll suave
                });
            }
        });
    });

    // ======================================================
    // 2. ANIMAÇÃO DAS BARRAS DE HABILIDADE (AO ROLAR)
    // ======================================================
    const skillsSection = document.getElementById('habilidades');
    const progressBars = document.querySelectorAll('.progress-bar');
    let hasAnimated = false; // Flag para garantir que anime apenas uma vez

    // Função para verificar se o elemento está visível na tela
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    // Função que aplica a animação
    function animateSkills() {
        // Verifica se a seção de habilidades está visível E se ainda não animou
        if (isElementInViewport(skillsSection) && !hasAnimated) {
            
            progressBars.forEach(bar => {
                const width = bar.getAttribute('aria-valuenow') + '%';
                
                // Aplica a transição CSS, fazendo a barra "crescer"
                bar.style.width = width;
                
                // Opcional: Adiciona uma classe de animação ou hover (se houver)
            });

            hasAnimated = true; // Marca como animado para não repetir
            
            // Opcional: Remove o listener depois de animar para otimizar
            window.removeEventListener('scroll', animateSkills); 
        }
    }

    // Adiciona o listener de scroll para verificar quando a seção entra na tela
    window.addEventListener('scroll', animateSkills);
    
    // Chama a função uma vez no carregamento caso o usuário já esteja na seção
    animateSkills(); 

});