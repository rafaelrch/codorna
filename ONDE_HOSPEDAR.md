# 🏠 Onde Hospedar o Site? (Você só tem o domínio)

## Situação Atual

Você tem:
- ✅ Domínio comprado na Hostinger
- ✅ Código do projeto pronto
- ✅ Build feito (pasta `dist` criada)
- ❓ **Onde hospedar o site?**

---

## 🎯 Opções de Hospedagem (Recomendadas)

### Opção 1: Vercel (GRATUITO - Mais Fácil) ⭐ RECOMENDADO

**Vantagens:**
- ✅ Totalmente gratuito
- ✅ Deploy automático via Git
- ✅ Configuração de variáveis de ambiente fácil
- ✅ SSL automático
- ✅ CDN global (site rápido)

**Como fazer:**

1. **Criar conta no Vercel:**
   - Acesse [vercel.com](https://vercel.com)
   - Faça login com GitHub (recomendado)

2. **Conectar o repositório:**
   - Clique em "Add New Project"
   - Conecte seu repositório Git (GitHub, GitLab, etc.)
   - Selecione o projeto "codorna"

3. **Configurar o build:**
   - Framework Preset: **Vite**
   - Build Command: `npm run build` (já vem preenchido)
   - Output Directory: `dist` (já vem preenchido)
   - Install Command: `npm install`

4. **Adicionar variáveis de ambiente:**
   - Vá em **Settings** → **Environment Variables**
   - Adicione:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`
     - `VITE_SUPABASE_SERVICE_ROLE_KEY`
   - Selecione todas as opções (Production, Preview, Development)

5. **Fazer deploy:**
   - Clique em **Deploy**
   - Aguarde o build terminar

6. **Configurar domínio:**
   - Vá em **Settings** → **Domains**
   - Adicione seu domínio (ex: `codorna.com.br`)
   - Siga as instruções para configurar DNS na Hostinger

**Custo:** GRATUITO

---

### Opção 2: Netlify (GRATUITO)

**Vantagens:**
- ✅ Totalmente gratuito
- ✅ Deploy automático via Git
- ✅ Configuração de variáveis fácil

**Como fazer:**

1. Acesse [netlify.com](https://netlify.com)
2. Faça login com GitHub
3. Conecte o repositório
4. Configure variáveis de ambiente em **Site Settings** → **Environment Variables**
5. Adicione o domínio em **Domain Settings**

**Custo:** GRATUITO

---

### Opção 3: Hostinger (PAGO - Você já tem o domínio)

**Vantagens:**
- ✅ Você já tem o domínio lá
- ✅ Tudo em um lugar

**Desvantagens:**
- ❌ Precisa contratar hospedagem (não é só o domínio)
- ❌ Upload manual dos arquivos
- ❌ Mais trabalhoso

**Como fazer:**

1. **Contratar hospedagem na Hostinger:**
   - Acesse o painel da Hostinger
   - Contrate um plano de hospedagem (se ainda não tiver)
   - Geralmente vem junto com o domínio

2. **Fazer upload dos arquivos:**
   - Use File Manager ou FTP
   - Faça upload de todos os arquivos da pasta `dist`
   - Coloque na pasta `public_html` ou `www`

3. **Configurar variáveis:**
   - Como já fizemos o build com `.env.production`, as variáveis já estão no código
   - Não precisa configurar nada adicional

**Custo:** ~R$ 10-30/mês (dependendo do plano)

---

### Opção 4: GitHub Pages (GRATUITO - Limitado)

**Vantagens:**
- ✅ Gratuito
- ✅ Integrado com GitHub

**Desvantagens:**
- ❌ Não suporta variáveis de ambiente dinâmicas
- ❌ Limitado para SPAs (Single Page Apps)
- ❌ Precisa de configuração extra

**Custo:** GRATUITO

---

## 🎯 Qual Escolher?

### Se você quer facilidade e gratuidade:
→ **Vercel** ⭐ (Recomendado)

### Se você já tem hospedagem na Hostinger:
→ **Hostinger** (use o que já tem)

### Se você quer outra opção gratuita:
→ **Netlify**

---

## 🚀 Solução Rápida: Vercel (Recomendado)

### Passo a Passo Completo:

1. **Criar conta no Vercel:**
   ```
   https://vercel.com
   ```
   - Faça login com GitHub (mais fácil)

2. **Conectar repositório:**
   - Clique em "Add New Project"
   - Selecione seu repositório "codorna"
   - Configure:
     - Framework: Vite
     - Build Command: `npm run build`
     - Output Directory: `dist`

3. **Adicionar variáveis de ambiente:**
   - Settings → Environment Variables
   - Adicione as 3 variáveis do Supabase
   - Selecione todas as opções

4. **Fazer deploy:**
   - Clique em Deploy
   - Aguarde terminar

5. **Configurar domínio:**
   - Settings → Domains
   - Adicione seu domínio da Hostinger
   - Copie os registros DNS que o Vercel fornecer
   - Configure na Hostinger (DNS Zone)

6. **Pronto!**
   - Seu site estará no ar com o domínio configurado

---

## 📋 Configurar DNS na Hostinger

Depois de fazer deploy no Vercel/Netlify:

1. **Acesse o painel da Hostinger**
2. **Vá em "DNS Zone" ou "Gerenciar DNS"**
3. **Adicione os registros que o Vercel/Netlify fornecer:**
   - Tipo: `A` ou `CNAME`
   - Nome: `@` ou `www`
   - Valor: IP ou domínio fornecido pelo Vercel/Netlify

4. **Aguarde propagação (pode levar até 24h, geralmente 1-2h)**

---

## ❓ Ainda não sabe onde está hospedado?

### Verificar onde o site está:

1. **Acesse seu domínio no navegador**
2. **Abra o console (F12)**
3. **Procure por:**
   - Headers HTTP (Network tab)
   - Informações do servidor
   - Ou me diga qual é o domínio que eu ajudo a descobrir

### Perguntas para descobrir:

- Você faz upload manual dos arquivos?
  - Sim → Provavelmente Hostinger ou outro hosting
  - Não → Provavelmente Vercel/Netlify/GitHub Pages

- Você conectou o repositório Git a alguma plataforma?
  - Sim → Vercel/Netlify
  - Não → Hostinger ou outro

---

## 🆘 Precisa de Ajuda?

Me diga:
1. Você já tem o site no ar? Qual é o domínio?
2. Você faz upload manual ou usa Git?
3. Qual opção você prefere? (Vercel, Hostinger, etc.)




