# Solução: Configurar Variáveis de Ambiente SEM Vercel

## Se você não encontrou o projeto no Vercel

Isso significa que provavelmente você está usando **Hostinger** ou outra plataforma de hospedagem. Vamos configurar as variáveis de ambiente diretamente!

---

## 🎯 Solução Mais Simples: Build Local com Variáveis

Como você provavelmente está fazendo upload manual dos arquivos para a Hostinger, vamos fazer o build localmente com as variáveis já configuradas.

### Passo a Passo:

1. **Crie o arquivo `.env.production` na raiz do projeto:**

   ```bash
   # Na raiz do projeto, crie o arquivo .env.production
   ```

   Conteúdo do arquivo:
   ```env
   VITE_SUPABASE_URL=https://seu-projeto.supabase.co
   VITE_SUPABASE_ANON_KEY=sua-anon-key
   VITE_SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key
   ```

2. **Obter as chaves do Supabase:**
   - Acesse o Supabase Dashboard
   - Vá em **Settings** > **API**
   - Copie:
     - **Project URL** → `VITE_SUPABASE_URL`
     - **anon public key** → `VITE_SUPABASE_ANON_KEY`
     - **service_role key** → `VITE_SUPABASE_SERVICE_ROLE_KEY`

3. **Fazer o build:**
   ```bash
   npm run build
   ```
   
   Isso vai criar a pasta `dist` com os arquivos prontos para produção.

4. **Fazer upload da pasta `dist` para a Hostinger:**
   - Acesse o painel da Hostinger
   - Vá em File Manager ou use FTP
   - Faça upload de **todos os arquivos** da pasta `dist` para a raiz do seu domínio
   - (Normalmente é a pasta `public_html` ou `www`)

---

## ⚠️ IMPORTANTE: Segurança da Service Role Key

**ATENÇÃO:** Com este método, a service role key será "embutida" no código JavaScript. Isso significa que qualquer pessoa pode ver a chave no código fonte do navegador.

### Alternativa Mais Segura: Usar apenas Anon Key + Políticas RLS

Se você não quer expor a service role key, podemos configurar políticas RLS no Supabase que permitam leitura pública apenas para as tabelas do admin.

### Configurar Políticas RLS no Supabase:

1. **Acesse o Supabase Dashboard**
2. **Vá em SQL Editor**
3. **Execute este código SQL:**

```sql
-- Permitir leitura pública na tabela users_total
ALTER TABLE users_total ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access" ON users_total;
CREATE POLICY "Allow public read access" ON users_total
FOR SELECT USING (true);

-- Permitir leitura pública na tabela usuario_compra
ALTER TABLE usuario_compra ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access" ON usuario_compra;
CREATE POLICY "Allow public read access" ON usuario_compra
FOR SELECT USING (true);

-- Permitir leitura pública na tabela users_trial
ALTER TABLE users_trial ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access" ON users_trial;
CREATE POLICY "Allow public read access" ON users_trial
FOR SELECT USING (true);

-- Permitir leitura pública na tabela financeiro_registros
ALTER TABLE financeiro_registros ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access" ON financeiro_registros;
CREATE POLICY "Allow public read access" ON financeiro_registros
FOR SELECT USING (true);

-- Permitir leitura pública na tabela metas
ALTER TABLE metas ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access" ON metas;
CREATE POLICY "Allow public read access" ON metas
FOR SELECT USING (true);
```

4. **Depois disso, você pode usar apenas a anon key:**
   - Crie `.env.production` apenas com:
   ```env
   VITE_SUPABASE_URL=https://seu-projeto.supabase.co
   VITE_SUPABASE_ANON_KEY=sua-anon-key
   ```
   - **NÃO** adicione a service role key
   - Faça o build e upload normalmente

---

## 🔍 Como Descobrir Onde Está Hospedado?

### Método 1: Verificar o Domínio

1. Qual é o domínio do seu site? (ex: `codorna.com.br`, `codornaco.com`)
2. Acesse o site e abra o console do navegador (F12)
3. Procure por headers HTTP ou informações do servidor

### Método 2: Verificar o Painel de Controle

1. Você tem acesso a um painel de controle?
   - **Hostinger** → hPanel
   - **Vercel** → vercel.com/dashboard
   - **Netlify** → app.netlify.com
   - **Outro** → verifique seu email de cadastro

### Método 3: Verificar Como Você Faz Upload

- **Upload manual via FTP/File Manager?** → Hostinger ou hospedagem tradicional
- **Push no Git e deploy automático?** → Vercel, Netlify, ou GitHub Pages
- **Build local e upload?** → Hostinger ou hospedagem tradicional

---

## 📋 Resumo das Opções

| Situação | Solução |
|----------|---------|
| **Não encontrou no Vercel** | Use build local com `.env.production` |
| **Usa Hostinger** | Build local + upload da pasta `dist` |
| **Quer mais segurança** | Configure políticas RLS no Supabase |
| **Não quer expor service role key** | Use apenas anon key + políticas RLS |

---

## 🚀 Passos Rápidos (Recomendado)

1. **Crie `.env.production` na raiz:**
   ```env
   VITE_SUPABASE_URL=https://seu-projeto.supabase.co
   VITE_SUPABASE_ANON_KEY=sua-anon-key
   VITE_SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key
   ```

2. **Execute:**
   ```bash
   npm run build
   ```

3. **Faça upload da pasta `dist` para a Hostinger**

4. **Teste o painel admin**

---

## 🆘 Precisa de Ajuda?

Se ainda tiver dúvidas:
1. Me diga qual é o domínio do seu site
2. Me diga como você faz o upload dos arquivos
3. Verifique o console do navegador (F12) para ver erros




