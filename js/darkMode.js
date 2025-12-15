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

        if (savedTheme === 'light') {
            // Se o usuário explicitamente salvou 'light', respeite.
            applyMode(false);
        } else {
            // Se o tema salvo for 'dark', ou se for nulo (primeira visita),
            // aplique o Dark Mode por padrão.
            applyMode(true);
            
            // Opcional: Se for a primeira visita, salve 'dark' como padrão para futuras visitas
            if (savedTheme === null) {
                localStorage.setItem('theme', 'dark');
            }
        }
        // ... (O resto do código para o toggleButton.addEventListener permanece o mesmo)

    // 3. Adicionar o listener para alternar
    toggleButton.addEventListener('click', () => {
        const isDark = body.classList.toggle('dark-mode');
        applyMode(isDark);
    });
});