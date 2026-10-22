/* =========================================================
   CONFIGURAÇÃO DO SITE — edite só este arquivo
   ========================================================= */
window.ROMANNO_CONFIG = {
  // URL do webhook (n8n, Make, Formspree…). Recebe um POST em JSON com os dados do orçamento.
  // Enquanto estiver vazio, o formulário abre o e-mail do visitante já preenchido (fallback).
  webhookUrl: "",

  // E-mail que recebe os pedidos (usado no fallback e no rodapé)
  email: "contato@romanno.com.br",

  // WhatsApp só com números, com DDI e DDD. Ex.: "5531999999999". Vazio = esconde o botão.
  whatsapp: ""
};
