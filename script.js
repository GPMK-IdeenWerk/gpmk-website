(function () {
  const SUPPORTED = ["de", "en"];

  function setLang(lang) {
    if (!SUPPORTED.includes(lang)) lang = "de";
    document.documentElement.lang = lang;
    document.querySelectorAll(".lang-toggle button").forEach(btn => {
      btn.setAttribute("aria-pressed", btn.dataset.lang === lang ? "true" : "false");
    });
    try { localStorage.setItem("gpmk-lang", lang); } catch (e) {}
  }

  document.querySelectorAll(".lang-toggle button").forEach(btn => {
    btn.addEventListener("click", () => setLang(btn.dataset.lang));
  });

  let initial = "de";
  try {
    const stored = localStorage.getItem("gpmk-lang");
    if (stored && SUPPORTED.includes(stored)) initial = stored;
    else if ((navigator.language || "").toLowerCase().startsWith("en")) initial = "en";
  } catch (e) {}
  setLang(initial);

  const header = document.getElementById("siteHeader");
  const watermarks = document.querySelectorAll(".watermark");

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let pending = false;
  function onScroll() {
    if (pending) return;
    pending = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;

      if (header) header.classList.toggle("is-scrolled", y > 8);

      if (watermarks.length && !prefersReducedMotion) {
        // Parallax: each watermark scrolls slower than its surrounding content,
        // so the green canvas feels like it keeps scrolling underneath.
        const offset = `translate3d(0, ${y * 0.45}px, 0)`;
        watermarks.forEach(w => { w.style.transform = offset; });
      }

      pending = false;
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();
