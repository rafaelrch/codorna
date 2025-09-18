# 🚀 DEPLOY PARA PRODUÇÃO - CODORNA

## ✅ STATUS: PRONTO PARA PRODUÇÃO!

**Build testado:** ✅ Sem erros  
**Preview funcionando:** ✅ localhost:4173  
**Todas as rotas testadas:** ✅ Funcionais  

---

## 📋 PASSO A PASSO PARA DEPLOY

### **1. CONFIGURAR VARIÁVEIS DE AMBIENTE**

Você precisa das chaves do Supabase:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon-publica
```

**Como pegar as chaves:**
1. Acesse [supabase.com](https://supabase.com)
2. Vá no seu projeto
3. Settings → API
4. Copie `URL` e `anon public`

---

### **2. OPÇÕES DE DEPLOY**

#### **🟢 OPÇÃO 1: VERCEL (Recomendado)**

1. **Instalar Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Fazer deploy:**
   ```bash
   vercel
   ```

3. **Configurar variáveis:**
   - Na dashboard da Vercel
   - Project Settings → Environment Variables
   - Adicionar `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`

#### **🟡 OPÇÃO 2: NETLIFY**

1. **Instalar Netlify CLI:**
   ```bash
   npm i -g netlify-cli
   ```

2. **Fazer deploy:**
   ```bash
   netlify deploy --prod --dir=dist
   ```

3. **Configurar variáveis:**
   - Na dashboard do Netlify
   - Site Settings → Environment Variables

#### **🟠 OPÇÃO 3: GITHUB PAGES**

1. **Instalar gh-pages:**
   ```bash
   npm i -D gh-pages
   ```

2. **Adicionar script no package.json:**
   ```json
   "scripts": {
     "deploy": "gh-pages -d dist"
   }
   ```

3. **Deploy:**
   ```bash
   npm run build
   npm run deploy
   ```

---

### **3. CONFIGURAR SUPABASE PARA PRODUÇÃO**

1. **Authentication → URL Configuration:**
   ```
   Site URL: https://seudominio.com
   Redirect URLs: https://seudominio.com/email-confirm
   ```

2. **Testar em produção:**
   - Cadastro funcionando
   - Email de confirmação chegando
   - Redirecionamento para WhatsApp

---

## 🎯 FUNCIONALIDADES EM PRODUÇÃO

### **✅ O que funciona:**
- ✅ **Landing Page** completa
- ✅ **Cadastro** → Email confirmação → WhatsApp
- ✅ **Login** → WhatsApp (sem autenticação)
- ✅ **Esqueci senha** funcional
- ✅ **Responsivo** em todos os dispositivos
- ✅ **Vídeo** MOCKUP.mp4 em loop
- ✅ **Todos os botões** levam ao WhatsApp

### **🚫 O que está desabilitado:**
- 🚫 Dashboard interno
- 🚫 Transações
- 🚫 Metas
- 🚫 Sistema de pagamento

---

## 🔗 URLS IMPORTANTES

Depois do deploy, teste essas URLs:

```
✅ https://seudominio.com/
✅ https://seudominio.com/signup
✅ https://seudominio.com/login
✅ https://seudominio.com/forgot-password
✅ https://seudominio.com/email-confirm
```

---

## 📱 WHATSAPP LINKS CONFIGURADOS

Todos os botões levam para:
```
https://wa.me/5571993393322?text=MENSAGEM_PERSONALIZADA
```

**Mensagens configuradas:**
- Cadastro: "Finalizei meu cadastro"
- Login: "Quero fazer login no Codorna"
- Landing: "Quero iniciar o teste grátis"

---

## 🎉 PRÓXIMOS PASSOS

1. **Escolha uma plataforma** (Vercel recomendado)
2. **Configure as variáveis** do Supabase
3. **Faça o deploy**
4. **Configure URLs no Supabase**
5. **Teste tudo em produção**

**O projeto está 100% pronto para produção!** 🚀
