# Onde Configurar Variáveis de Ambiente?

## Diferença entre Vercel e Hostinger

### **Vercel** (Deploy Automático)
- Plataforma de deploy automático conectada ao Git
- Faz build e deploy automaticamente quando você faz push
- Variáveis de ambiente são configuradas no **Dashboard da Vercel**
- **Recomendado para aplicações React/Vite**

### **Hostinger** (Hospedagem Tradicional)
- Serviço de hospedagem (shared hosting ou VPS)
- Você faz upload dos arquivos manualmente ou via FTP
- Variáveis de ambiente podem ser configuradas via:
  - Arquivo `.env` na raiz do projeto (se suportar)
  - Painel de controle da Hostinger
  - Arquivo de configuração do servidor

## Como Descobrir Qual Você Está Usando?

1. **Se você conectou o repositório Git a uma plataforma:**
   - ✅ **Vercel** - Configure no Vercel Dashboard
   - ✅ **Netlify** - Configure no Netlify Dashboard
   - ✅ **GitHub Pages** - Use arquivo `.env.production` ou configure no GitHub Secrets

2. **Se você faz upload manual dos arquivos:**
   - ✅ **Hostinger** - Configure no painel ou crie arquivo `.env`
   - ✅ **Outro hosting** - Siga as instruções do seu provedor

---

## 📋 Opção 1: Configurar no VERCEL (Recomendado)

Se você está usando Vercel para deploy automático:

### Passo a Passo:

1. **Acesse o Vercel Dashboard:**
   - Vá para [vercel.com](https://vercel.com)
   - Faça login
   - Selecione o projeto "codorna"

2. **Navegue até Settings:**
   - Clique em **Settings** no menu superior
   - Clique em **Environment Variables** no menu lateral

3. **Adicione a variável:**
   - Clique em **Add New**
   - **Key:** `VITE_SUPABASE_SERVICE_ROLE_KEY`
   - **Value:** Cole a service role key do Supabase
   - **Environment:** Selecione todas (Production, Preview, Development)
   - Clique em **Save**

4. **Fazer redeploy:**
   - Vá em **Deployments**
   - Clique nos três pontos (...) do último deployment
   - Selecione **Redeploy**

---

## 📋 Opção 2: Configurar na HOSTINGER

Se você está usando Hostinger para hospedagem:

### Método A: Via Arquivo .env (Recomendado)

1. **Crie o arquivo `.env` na raiz do projeto:**
   ```env
   VITE_SUPABASE_URL=https://seu-projeto.supabase.co
   VITE_SUPABASE_ANON_KEY=sua-anon-key
   VITE_SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key
   ```

2. **Faça upload do arquivo `.env` para a raiz do projeto na Hostinger:**
   - Via FTP (FileZilla, etc.)
   - Ou via File Manager no painel da Hostinger
   - O arquivo deve estar na mesma pasta que `index.html`

3. **Importante:**
   - ⚠️ O arquivo `.env` precisa estar na raiz do projeto **ANTES** do build
   - Se você já fez o build, precisa fazer um novo build com o `.env` presente
   - Ou configure as variáveis no processo de build

### Método B: Via Painel de Controle da Hostinger

1. **Acesse o painel de controle da Hostinger**
2. **Procure por "Variáveis de Ambiente" ou "Environment Variables"**
3. **Adicione:**
   - `VITE_SUPABASE_SERVICE_ROLE_KEY` = sua service role key
4. **Salve e reinicie o servidor (se necessário)**

### Método C: Configurar no Build (Mais Seguro)

Se a Hostinger não suporta variáveis de ambiente diretamente:

1. **Crie um arquivo `.env.production` localmente:**
   ```env
   VITE_SUPABASE_URL=https://seu-projeto.supabase.co
   VITE_SUPABASE_ANON_KEY=sua-anon-key
   VITE_SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key
   ```

2. **Faça o build localmente:**
   ```bash
   npm run build
   ```

3. **Faça upload da pasta `dist` para a Hostinger:**
   - ⚠️ **ATENÇÃO:** As variáveis serão "embutidas" no código JavaScript
   - Isso significa que a service role key ficará visível no código
   - **NÃO é recomendado para service role key!**

---

## 🔍 Como Verificar Qual Plataforma Você Está Usando?

### Verificar se está no Vercel:

1. Acesse o domínio do seu site
2. Abra o console do navegador (F12)
3. Procure por headers HTTP como `x-vercel-*` ou `server: Vercel`
4. Ou verifique se você tem uma conta no Vercel conectada ao seu repositório Git

### Verificar se está na Hostinger:

1. Acesse o painel de controle da Hostinger
2. Verifique se você faz upload manual dos arquivos
3. Ou verifique o domínio no painel da Hostinger

---

## ⚠️ IMPORTANTE: Segurança

### Service Role Key é Sensível!

A `VITE_SUPABASE_SERVICE_ROLE_KEY` tem acesso total ao banco de dados. 

**⚠️ NUNCA:**
- ❌ Commite no Git
- ❌ Exponha publicamente
- ❌ Coloque em arquivos `.env` que serão enviados para o repositório

**✅ SEMPRE:**
- ✅ Use apenas em variáveis de ambiente do servidor
- ✅ Configure no painel da plataforma (Vercel, Hostinger, etc.)
- ✅ Mantenha no `.gitignore`

---

## 🎯 Resumo Rápido

| Plataforma | Onde Configurar |
|------------|----------------|
| **Vercel** | Dashboard → Settings → Environment Variables |
| **Netlify** | Dashboard → Site Settings → Environment Variables |
| **Hostinger** | Painel de Controle → Variáveis de Ambiente OU arquivo `.env` na raiz |
| **GitHub Pages** | GitHub Secrets (mas não funciona para variáveis do cliente) |

---

## 🆘 Ainda com Dúvidas?

1. **Verifique o console do navegador (F12):**
   - Procure por logs que começam com `🔍 Admin Stats Debug:`
   - Verifique se `usingServiceRole: true` aparece

2. **Verifique se a variável está sendo carregada:**
   - No código, adicione um log temporário:
   ```javascript
   console.log('Service Role Key presente?', !!import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY)
   ```

3. **Teste localmente primeiro:**
   - Adicione no `.env.local`
   - Execute `npm run dev`
   - Se funcionar localmente mas não em produção, o problema é a configuração na plataforma


