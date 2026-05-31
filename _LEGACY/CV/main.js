document.addEventListener("DOMContentLoaded", () => {
  // Crear el botón con icono SVG
  const themeToggle = document.createElement("button");
  themeToggle.id = "theme-toggle";
  themeToggle.classList.add("theme-toggle");
  themeToggle.setAttribute("aria-label", "Cambiar tema entre claro y oscuro");
  
  // Icono SVG para el botón
  themeToggle.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="5"></circle>
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"></path>
    </svg>
  `;

  document.body.appendChild(themeToggle);

  // Cargar preferencia del tema
  const loadTheme = () => {
    const savedTheme = localStorage.getItem("theme");
    const systemPrefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
    
    // Prioridad: localStorage > preferencia del sistema > dark por defecto
    if (savedTheme === "light" || (!savedTheme && systemPrefersLight)) {
      document.body.classList.add("light");
    }
  };

  loadTheme();

  // Cambiar tema al hacer clic
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light");
    
    themeToggle.style.transform = "scale(0.9)";
    setTimeout(() => {
      themeToggle.style.transform = "scale(1)";
    }, 100);

    // Guardar preferencia
    const isLight = document.body.classList.contains("light");
    localStorage.setItem("theme", isLight ? "light" : "dark");
    
    // Cambiar el icono según el tema (opcional)
    updateThemeIcon(isLight);
  });

  function updateThemeIcon(isLight) {
    const icon = themeToggle.querySelector("svg");
    if (isLight) {
      // Icono para tema claro (luna)
      icon.innerHTML = `
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      `;
    } else {
      // Icono para tema oscuro (sol)
      icon.innerHTML = `
        <circle cx="12" cy="12" r="5"></circle>
        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"></path>
      `;
    }
  }
  
  window.matchMedia("(prefers-color-scheme: light)").addEventListener("change", e => {
    if (!localStorage.getItem("theme")) { 
      document.body.classList.toggle("light", e.matches);
    }
  });
});