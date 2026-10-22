# ROMANNO — site institucional / portfólio

Site estático (HTML, CSS e JS puro). Não precisa de build.

## Estrutura
- `index.html` — home (serviços, cases, processo, diferenciais, FAQ)
- `orcamento.html` — formulário de orçamento em 3 etapas
- `assets/js/config.js` — **edite aqui**: webhook, e-mail e WhatsApp
- `assets/js/hero3d.js` — animação 3D do hero (Three.js local em `assets/vendor`)
- `assets/css/style.css` — design system com a paleta do manual de marca

## Rodar localmente
```bash
python3 -m http.server 8000
# abrir http://localhost:8000
```

## Publicar no GitHub Pages
1. Suba estes arquivos na raiz do repositório (branch `main`).
2. Settings → Pages → Source: *Deploy from a branch* → `main` / `(root)`.
3. Em *Custom domain*, confirme `romanno.com.br` (já está no arquivo `CNAME`).
4. Marque *Enforce HTTPS* depois que o certificado sair.

## DNS na Hostinger (domínio raiz)
| Tipo  | Nome | Valor                  |
|-------|------|------------------------|
| A     | @    | 185.199.108.153        |
| A     | @    | 185.199.109.153        |
| A     | @    | 185.199.110.153        |
| A     | @    | 185.199.111.153        |
| CNAME | www  | SEU-USUARIO.github.io  |

Remova registros A/AAAA antigos do `@` que apontem para a hospedagem da Hostinger.

## Formulário → n8n
Crie no n8n um fluxo com **Webhook (POST)** → e-mail / Google Sheets / WhatsApp.
Cole a URL de produção em `config.js` → `webhookUrl`. No nó Webhook, habilite CORS
(*Allowed Origins* = seu domínio). Sem webhook, o formulário abre o e-mail do visitante já preenchido.

## Pendências
- Número de WhatsApp em `config.js`
- Prints reais dos projetos nos cases (hoje são ilustrações em HTML/CSS)
