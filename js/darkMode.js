document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.getElementById('darkModeToggle');
    const body = document.body;
    const icon = toggleButton.querySelector('i');

    // Função para aplicar o modo (incluindo o ícone)
    const applyMode = (isDark) => {
        if (isDark) {
            body.classList.add('dark-mode');
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun'); // Ícone de sol para indicar que pode voltar ao light
            localStorage.setItem('theme', 'dark');
        } else {
            body.classList.remove('dark-mode');
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon'); // Ícone de lua para indicar que pode ir para o dark
            localStorage.setItem('theme', 'light');
        }
    };

    // 1. Carregar a preferência do usuário (localStorage)
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        applyMode(true);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches && savedTheme === null) {
        // 2. Se não houver preferência salva, verificar o modo do sistema operacional
        applyMode(true);
    } else {
        applyMode(false); // Inicia no modo claro por padrão
    }

    // 3. Adicionar o listener para alternar
    toggleButton.addEventListener('click', () => {
        const isDark = body.classList.toggle('dark-mode');
        applyMode(isDark);
    });
});