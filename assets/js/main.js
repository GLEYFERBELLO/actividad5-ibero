(function () {
    const root = document.documentElement;

    // Theme (persist)
    const savedTheme = localStorage.getItem("sd_theme");
    if (savedTheme === "light" || savedTheme === "dark") {
        root.setAttribute("data-theme", savedTheme);
    } else {
        root.setAttribute("data-theme", "dark");
    }

    const themeBtn = document.querySelector("[data-sd-theme-btn]");
    const themeLabel = document.querySelector("[data-sd-theme-label]");

    function setTheme(next) {
        root.setAttribute("data-theme", next);
        localStorage.setItem("sd_theme", next);
        if (themeLabel) themeLabel.textContent = next === "light" ? "Claro" : "Oscuro";
        if (themeBtn) themeBtn.setAttribute("aria-pressed", String(next === "light"));
    }

    if (themeBtn) {
        themeBtn.addEventListener("click", () => {
            const current = root.getAttribute("data-theme");
            setTheme(current === "light" ? "dark" : "light");
        });
    }

    // Active nav link based on current page
    const path = (location.pathname.split("/").pop() || "index.html").toLowerCase();
    document.querySelectorAll("[data-sd-nav]").forEach((a) => {
        const href = (a.getAttribute("href") || "").toLowerCase();
        if (href === path) a.classList.add("sd-nav-active");
    });

    // Smooth scroll for hash links
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
        a.addEventListener("click", (e) => {
            const id = a.getAttribute("href");
            const el = document.querySelector(id);
            if (!el) return;
            e.preventDefault();
            el.scrollIntoView({ behavior: "smooth", block: "start" });
        });
    });

    // Bootstrap validation
    const forms = document.querySelectorAll(".needs-validation");
    Array.from(forms).forEach((form) => {
        form.addEventListener("submit", (event) => {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            } else {
                // Si el formulario es válido, mostrar mensaje de éxito
                const formMessage = document.getElementById("form-message");
                if (formMessage) {
                    formMessage.classList.remove("d-none");
                    formMessage.classList.add("show");
                    
                    // Desplazar al mensaje
                    setTimeout(() => {
                        formMessage.scrollIntoView({ behavior: "smooth", block: "center" });
                    }, 100);
                    
                    // Reiniciar formulario después de 5 segundos
                    setTimeout(() => {
                        form.reset();
                        form.classList.remove("was-validated");
                        formMessage.classList.remove("show");
                        formMessage.classList.add("d-none");
                    }, 5000);
                }
            }
            form.classList.add("was-validated");
        }, false);
    });

    // Copy helper (for contact page)
    document.querySelectorAll("[data-sd-copy]").forEach((btn) => {
        btn.addEventListener("click", async () => {
            const text = btn.getAttribute("data-sd-copy") || "";
            const originalText = btn.textContent;
            try {
                await navigator.clipboard.writeText(text);
                btn.textContent = "Copiado ✅";
                setTimeout(() => (btn.textContent = originalText), 1200);
            } catch {
                alert("No se pudo copiar. Copia manualmente: " + text);
            }
        });
    });

    // Set theme label on load
    const t = root.getAttribute("data-theme");
    if (themeLabel) themeLabel.textContent = t === "light" ? "Claro" : "Oscuro";

    // Manejo del envío del formulario con Netlify
    const form = document.querySelector('form[name="contacto"]');
    if (form) {
        // Verificar parámetros de URL para mensaje de éxito
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('success') === 'true') {
            const formMessage = document.getElementById("form-message");
            if (formMessage) {
                formMessage.classList.remove("d-none");
                formMessage.classList.add("show");
                
                // Desplazar al mensaje
                setTimeout(() => {
                    formMessage.scrollIntoView({ behavior: "smooth", block: "center" });
                }, 100);
                
                // Limpiar parámetros de URL
                window.history.replaceState({}, document.title, window.location.pathname);
            }
        }
    }
})();