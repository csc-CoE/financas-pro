# 💰 FinançasPRO

Sistema completo de controle financeiro pessoal — roda 100% no navegador, sem backend, usando `localStorage`.

## ✨ Funcionalidades

- **Dashboard** com KPIs, gráfico de fluxo mensal e gastos por categoria
- **Transações** — adicionar, editar, filtrar e excluir entradas/saídas
- **Comprovantes** — upload de comprovantes PIX (imagens e PDFs)
- **Contas** — gerenciar contas bancárias e carteiras com saldo calculado
- **Consultor IA** — chatbot com Claude (Anthropic) especializado em saúde financeira
- **Navegação por mês** para visualizar histórico
- Layout responsivo (desktop e mobile)

## 🚀 Publicar no GitHub Pages

### 1. Criar repositório

```bash
git init
git add .
git commit -m "feat: FinançasPRO initial commit"
git remote add origin https://github.com/SEU_USUARIO/financas-pro.git
git push -u origin main
```

### 2. Ativar GitHub Pages

1. Vá em **Settings** → **Pages**
2. Em **Source**, selecione `Deploy from a branch`
3. Branch: `main` / Folder: `/ (root)`
4. Clique em **Save**
5. Acesse em: `https://SEU_USUARIO.github.io/financas-pro`

## 🤖 Configurar o Chatbot IA

1. Acesse [console.anthropic.com](https://console.anthropic.com)
2. Crie uma API Key
3. No app, clique em **⚙ Configurar API** na página do Consultor IA
4. Cole sua chave (começa com `sk-ant-...`)
5. A chave fica salva **apenas no seu navegador** (localStorage)

> ⚠️ Nunca compartilhe sua API key publicamente.

## 🗂 Estrutura

```
financas-pro/
├── index.html              # Dashboard
├── css/
│   └── style.css           # Design system completo
├── js/
│   ├── storage.js          # Camada de dados (localStorage)
│   └── dashboard.js        # Lógica do dashboard + charts
└── pages/
    ├── transacoes.html     # CRUD de transações
    ├── comprovantes.html   # Upload e galeria de comprovantes
    ├── contas.html         # Gerenciar contas bancárias
    └── chatbot.html        # Consultor IA com Anthropic Claude
```

## 💾 Dados

Todos os dados ficam no `localStorage` do navegador. Para fazer backup, exporte via DevTools → Application → Local Storage.

## 🛠 Tecnologias

- HTML5 + CSS3 + JavaScript puro (sem framework)
- Chart.js para gráficos
- API Anthropic Claude (chatbot)
- Google Fonts (Syne + DM Sans)
