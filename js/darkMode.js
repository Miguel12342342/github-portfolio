document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.getElementById('darkModeToggle');
    const body = document.body;
    const icon = toggleButton.querySelector('i');

    // Aplica o modo (dark ou light) e salva a preferência
    const applyMode = (isDark) => {
        if (isDark) {
            body.classList.add('dark-mode');
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
            localStorage.setItem('theme', 'dark');
        } else {
            body.classList.remove('dark-mode');
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
            localStorage.setItem('theme', 'light');
        }
    };

    // Carrega a preferência salva, com sistema operacional como fallback
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme) {
        // Respeita o que o usuário salvou explicitamente
        applyMode(savedTheme === 'dark');
    } else {
        // Primeira visita: respeita a preferência do sistema operacional
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        applyMode(prefersDark);
    }

    // Alterna o modo ao clicar no botão
    toggleButton.addEventListener('click', () => {
        const isDark = body.classList.toggle('dark-mode');
        applyMode(isDark);
    });
});