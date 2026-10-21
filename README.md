# Cuidar Psicologia — Landing Page (Vite puro, sem framework)

Mesma landing page, construída com **HTML, CSS e JavaScript padrão**,
usando o **Vite só como ferramenta de build/dev** — sem React, sem
nenhuma outra biblioteca de UI.

## O que o Vite adiciona em relação à versão 100% estática

- **Dev server com hot-reload** (`npm run dev`): qualquer alteração no
  HTML, CSS ou JS atualiza o navegador na hora.
- **Build otimizado** (`npm run build`): minifica CSS e JS e gera nomes de
  arquivo com hash (ex.: `main-a1b2c3.js`), o que permite cache agressivo
  e eterno nesses arquivos sem nunca entregar uma versão antiga por engano.
- Continua **sem framework**: não há `react`, `vue` nem nada parecido nas
  dependências — só o próprio Vite.

## Rodando localmente

```bash
npm install
npm run dev
```

Abre em `http://localhost:5173`.

## Build de produção

```bash
npm run build
npm run preview   # testa o build localmente
```

Os arquivos finais vão para `dist/`.

## Deploy na Vercel

O `vercel.json` já configura:

- Build com `npm run build`, saída em `dist`.
- URLs limpas (`cleanUrls`).
- **Cache eterno** (`immutable`, 1 ano) para tudo em `/assets/*` — CSS e JS
  com hash no nome, então um deploy novo nunca reaproveita cache velho.
- **`index.html` sempre revalidado** — o visitante sempre recebe a versão
  mais nova do site.

Para publicar:

1. Suba o projeto para um repositório Git.
2. Na Vercel, "New Project" → importe o repositório. O framework "Vite" é
   detectado automaticamente. Deploy.

Ou via CLI:

```bash
npm i -g vercel
vercel --prod
```

## Estrutura

```
index.html          # HTML da página inteira (convenção de entry point do Vite)
vite.config.js        # Config do build (nomes de arquivo com hash)
vercel.json             # Config de deploy e cache-control
src/main.js               # Importa o CSS + o pouco de JS necessário
src/style.css               # Todos os estilos
public/favicon.svg            # Ícone (copiado para a raiz do build)
```

## Como a interatividade funciona

Toda a interação do usuário é tratada em `src/main.js`, com
`addEventListener` e `classList` puros — sem truques de CSS (nada de
checkbox hack, `radio`+`label` ou `<details>`/`<summary>` fazendo o
trabalho por baixo dos panos):

- **Menu mobile**: `button` com `aria-expanded`, controlado por um
  listener de clique que adiciona/remove a classe `nav--open`.
- **Cards de "como funciona"**: `button`s normais; um listener de clique
  no container alterna a classe `step-card--active` entre eles.
- **Perguntas frequentes**: `button` + parágrafo; um listener de clique
  controla a classe `faq-row--open` e os atributos `aria-expanded`,
  mantendo só uma pergunta aberta por vez.
- **Formulário de newsletter**: `preventDefault` no `submit`, troca o
  formulário pela mensagem de sucesso.

O CSS só define a aparência de cada estado (`.nav--open`,
`.step-card--active`, `.faq-row--open`); quem decide quando aplicá-los é
sempre o JavaScript.

## Personalização rápida

- **Textos**: direto no `index.html`.
- **Cores**: variáveis CSS no topo do `src/style.css` (`:root`).
- **Imagens**: troque as URLs do Unsplash no `index.html` pelas fotos reais
  do consultório (pode colocar os arquivos em `public/` e apontar para
  `/minha-foto.jpg`).
- **WhatsApp**: troque `5511999999999` pelo número real nos links `wa.me`.
