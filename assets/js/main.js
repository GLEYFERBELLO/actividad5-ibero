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

  // Bootstrap validation + redirección para contacto
  const forms = document.querySelectorAll(".needs-validation");
  Array.from(forms).forEach((form) => {
    form.addEventListener(
      "submit",
      (event) => {
        // ✅ SIEMPRE frenamos el submit normal para evitar GET con querystring
        event.preventDefault();
        event.stopPropagation();

        form.classList.add("was-validated");

        // Si no es válido, no hace nada más
        if (!form.checkValidity()) return;

        // ✅ Caso especial: contacto -> gracias.html (SIN Netlify Forms)
        if (form.id === "contactForm") {
          const formMessage = document.getElementById("form-message");
          if (formMessage) {
            formMessage.classList.remove("d-none");
            requestAnimationFrame(() => {
              formMessage.scrollIntoView({ behavior: "smooth", block: "center" });
            });
          }

          const btn = document.getElementById("btnSubmit");
          if (btn) {
            btn.disabled = true;
            btn.innerHTML = '<i class="bi bi-hourglass-split"></i> Enviando…';
          }

          // Redirige
          setTimeout(() => {
            window.location.href = "gracias.html";
          }, 400);

          return;
        }
   },
      false
    );
  });
})();
