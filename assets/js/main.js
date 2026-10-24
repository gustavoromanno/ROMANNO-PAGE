document.documentElement.classList.add("js");

document.addEventListener("DOMContentLoaded", function () {
  var cfg = window.ROMANNO_CONFIG || {};

  // menu mobile
  var nav = document.querySelector(".nav");
  var toggle = document.querySelector(".menu-toggle");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.querySelectorAll(".menu a").forEach(function (a) {
      a.addEventListener("click", function () { nav.classList.remove("open"); toggle.setAttribute("aria-expanded", "false"); });
    });
  }

  // contatos vindos do config
  document.querySelectorAll("[data-email]").forEach(function (el) {
    if (!cfg.email) { el.closest("li") ? el.closest("li").remove() : el.remove(); return; }
    el.href = "mailto:" + cfg.email; if (!el.textContent.trim()) el.textContent = cfg.email;
  });
  document.querySelectorAll("[data-whatsapp]").forEach(function (el) {
    var txt = el.getAttribute("data-wa-text");
    if (!cfg.whatsapp) {
      if (txt) return; // botão com fallback: mantém o href original (ex.: orcamento.html)
      el.closest("li") ? el.closest("li").remove() : el.remove(); return;
    }
    el.href = "https://wa.me/" + cfg.whatsapp + (txt ? "?text=" + encodeURIComponent(txt) : "");
    el.target = "_blank"; el.rel = "noopener";
  });
  document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });

  // reveal ao rolar
  var els = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) { els.forEach(function (e) { e.classList.add("in"); }); return; }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add("in"); io.unobserve(x.target); } });
  }, { threshold: .12, rootMargin: "0px 0px -40px 0px" });
  els.forEach(function (e) { io.observe(e); });
});
