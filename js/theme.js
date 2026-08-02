// ========================================
// THEME TOGGLE - DARK/LIGHT MODE
// ========================================

(function() {
    const toggleBtn = document.getElementById('themeToggle');
    const body = document.body;
    const icon = toggleBtn?.querySelector('i');
    
    // Check saved preference
    const savedTheme = localStorage.getItem('yuki-theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
        if (icon) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        }
    }
    
    toggleBtn?.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        const isDark = body.classList.contains('dark-mode');
        
        if (icon) {
            if (isDark) {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            } else {
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
            }
        }
        
        localStorage.setItem('yuki-theme', isDark ? 'dark' : 'light');
    });
})();
