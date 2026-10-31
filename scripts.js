function bindThemeSwitcher() {
    const htmlElement = document.documentElement;
    const themeToggle = document.getElementById("themeToggle");
    const themeIcon = document.getElementById("themeIcon");
    const themeLogo = document.getElementById("themeLogo");

    // 1. System preference or load saved theme
    const savedTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    const currentTheme = savedTheme || (systemPrefersDark ? "dark" : "light");
    htmlElement.setAttribute("data-bs-theme", currentTheme);
    updateThemeAssets(currentTheme);

    // 2. Switcher
    themeToggle.addEventListener("click", (e) => {
        e.preventDefault();
        const newTheme = htmlElement.getAttribute("data-bs-theme") === "dark" ? "light" : "dark";
        
        htmlElement.setAttribute("data-bs-theme", newTheme);
        localStorage.setItem("theme", newTheme);
        updateThemeAssets(newTheme);
    });

    function updateThemeAssets(theme) {
        if (theme === "dark") {
            themeIcon.className = "fas fa-sun text-warning fs-5";
            if (themeLogo) themeLogo.src = "images/logo_black_250x90.png";
        } else {
            themeIcon.className = "fas fa-moon text-dark fs-5";
            if (themeLogo) themeLogo.src = "images/logo_white_250x90.png";
        }
    }
}