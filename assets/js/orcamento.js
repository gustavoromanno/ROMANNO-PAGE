document.addEventListener("DOMContentLoaded", function () {
  var cfg = window.ROMANNO_CONFIG || {};
  var form = document.getElementById("quoteForm");
  if (!form) return;
  var steps = form.querySelectorAll(".form-step");
  var bars = document.querySelectorAll(".progress [data-p]");
  var current = 1;

  function values(name) {
    return Array.prototype.map.call(form.querySelectorAll('[name="' + name + '"]:checked'), function (i) { return i.value; });
  }
  function val(id) { var el = document.getElementById(id); return el ? el.value.trim() : ""; }
  function err(step, msg) { var e = form.querySelector('[data-err="' + step + '"]'); if (e) e.textContent = msg || ""; }
  function mark(id, bad) { var f = document.getElementById(id).closest(".field"); if (f) f.classList.toggle("invalid", bad); }

  function go(n) {
    current = n;
    steps.forEach(function (s) { s.classList.toggle("active", +s.dataset.step === n); });
    bars.forEach(function (b) {
      var p = +b.dataset.p;
      b.classList.toggle("active", p === n);
      b.classList.toggle("done", p < n);
    });
    if (n === 3) renderSummary();
    var top = document.querySelector(".form-shell").getBoundingClientRect().top + window.scrollY - 100;
    if (window.scrollY > top) window.scrollTo({ top: top, behavior: "smooth" });
    var first = form.querySelector('.form-step.active input:not([type=hidden]), .form-step.active textarea');
    if (first && n > 1) first.focus({ preventScroll: true });
  }

  function validate(n) {
    if (n === 1) {
      if (!values("servicos").length) { err(1, "Escolha pelo menos um serviço."); return false; }
      err(1); return true;
    }
    if (n === 2) {
      var d = val("descricao"), ok = d.length >= 15;
      mark("descricao", !ok);
      if (!ok) { err(2, "Descreva o projeto em pelo menos uma frase."); return false; }
      var ref = val("referencia");
      if (ref && !/^https?:\/\/\S+\.\S+/.test(ref)) { mark("referencia", true); err(2, "O site de referência precisa começar com http:// ou https://"); return false; }
      mark("referencia", false); err(2); return true;
    }
    if (n === 3) {
      var bad = [];
      if (val("nome").length < 2) bad.push("nome");
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val("email"))) bad.push("email");
      if (val("whatsapp").replace(/\D/g, "").length < 10) bad.push("whatsapp");
      ["nome", "email", "whatsapp"].forEach(function (id) { mark(id, bad.indexOf(id) > -1); });
      if (bad.length) { err(3, "Confira os campos destacados."); return false; }
      if (!document.getElementById("lgpd").checked) { err(3, "Marque a autorização de uso dos dados para enviar."); return false; }
      err(3); return true;
    }
    return true;
  }

  function renderSummary() {
    var rows = [
      ["Serviços", values("servicos").join(", ") || "—"],
      ["Prazo", val("prazo")],
      ["Investimento", values("investimento")[0] || "Não informado"]
    ];
    document.getElementById("summary").innerHTML = rows.map(function (r) {
      return "<div><span>" + r[0] + "</span><strong>" + r[1].replace(/</g, "&lt;") + "</strong></div>";
    }).join("");
  }

  // máscara simples de telefone BR
  var wa = document.getElementById("whatsapp");
  wa.addEventListener("input", function () {
    var d = wa.value.replace(/\D/g, "").slice(0, 11), o = d;
    if (d.length > 2) o = "(" + d.slice(0, 2) + ") " + d.slice(2);
    if (d.length > 7) o = "(" + d.slice(0, 2) + ") " + d.slice(2, d.length - 4) + "-" + d.slice(-4);
    wa.value = o;
  });

  // "Nada ainda" desmarca os outros e vice-versa
  form.querySelectorAll('[name="ja_tem"]').forEach(function (c) {
    c.addEventListener("change", function () {
      if (!c.checked) return;
      form.querySelectorAll('[name="ja_tem"]').forEach(function (o) {
        if (o !== c && (c.value === "Nada ainda" || o.value === "Nada ainda")) o.checked = false;
      });
    });
  });

  form.querySelectorAll("[data-next]").forEach(function (b) { b.addEventListener("click", function () { if (validate(current)) go(current + 1); }); });
  form.querySelectorAll("[data-prev]").forEach(function (b) { b.addEventListener("click", function () { go(current - 1); }); });
  form.querySelectorAll("input,textarea").forEach(function (el) {
    el.addEventListener("input", function () { var f = el.closest(".field"); if (f) f.classList.remove("invalid"); });
  });

  function protocol() {
    var d = new Date(), p = function (n) { return String(n).padStart(2, "0"); };
    return "RMN-" + d.getFullYear() + p(d.getMonth() + 1) + p(d.getDate()) + "-" + Math.random().toString(36).slice(2, 6).toUpperCase();
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!validate(3)) return;
    if (form.querySelector('[name="_hp"]').value) return; // bot

    var prot = protocol();
    var data = {
      protocolo: prot,
      enviado_em: new Date().toISOString(),
      servicos: values("servicos"),
      ja_tem: values("ja_tem"),
      descricao: val("descricao"),
      prazo: val("prazo"),
      referencia: val("referencia"),
      investimento: values("investimento")[0] || "",
      nome: val("nome"),
      empresa: val("empresa"),
      email: val("email"),
      whatsapp: val("whatsapp"),
      contato_pref: val("contato_pref"),
      origem: location.href
    };

    var btn = document.getElementById("sendBtn");
    function done(msg) {
      document.getElementById("protocol").textContent = prot;
      if (msg) document.getElementById("successMsg").textContent = msg;
      go(4);
    }

    if (cfg.webhookUrl) {
      btn.disabled = true; btn.firstChild.textContent = "Enviando… ";
      fetch(cfg.webhookUrl, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) })
        .then(function (r) { if (!r.ok) throw new Error(r.status); done(); })
        .catch(function () {
          btn.disabled = false; btn.firstChild.textContent = "Enviar pedido ";
          err(3, "Não foi possível enviar agora. Tente de novo ou fale pelo WhatsApp/e-mail ao lado.");
        });
      return;
    }

    // fallback sem webhook: abre o e-mail já preenchido
    var body = [
      "Protocolo: " + prot,
      "Serviços: " + data.servicos.join(", "),
      "Já tem: " + (data.ja_tem.join(", ") || "-"),
      "Prazo: " + data.prazo,
      "Investimento: " + (data.investimento || "-"),
      "Referência: " + (data.referencia || "-"),
      "", "Descrição:", data.descricao, "",
      "Nome: " + data.nome, "Empresa: " + (data.empresa || "-"),
      "E-mail: " + data.email, "WhatsApp: " + data.whatsapp, "Prefere: " + data.contato_pref
    ].join("\n");
    window.location.href = "mailto:" + (cfg.email || "") + "?subject=" + encodeURIComponent("Orçamento " + prot + " — " + data.nome) + "&body=" + encodeURIComponent(body);
    done("Abrimos o seu e-mail com o pedido preenchido. É só enviar. Protocolo:");
  });
});
