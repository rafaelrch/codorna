# 🚀 Como Configurar Variáveis de Ambiente (Passo a Passo)

## Se você NÃO encontrou o projeto no Vercel

Você provavelmente está usando **Hostinger** ou outra hospedagem. Siga estes passos:

---

## ✅ Solução Rápida (5 minutos)

### 1. Obter as Chaves do Supabase

1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá em **Settings** (⚙️) → **API**
4. Copie estas informações:
   - **Project URL** (ex: `https://xxxxx.supabase.co`)
   - **anon public** key (começa com `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)
   - **service_role** key (também começa com `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

### 2. Criar Arquivo de Variáveis

Na raiz do projeto, crie um arquivo chamado `.env.production`:

```env
VITE_SUPABASE_URL=https://seu-projeto-id.supabase.co
VITE_SUPABASE_ANON_KEY=sua-anon-key-aqui
VITE_SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key-aqui
```

**Substitua** `seu-projeto-id`, `sua-anon-key-aqui` e `sua-service-role-key-aqui` pelos valores reais que você copiou.

### 3. Fazer o Build

No terminal, execute:

```bash
npm run build
```

Isso vai criar uma pasta `dist` com os arquivos prontos.

### 4. Fazer Upload para a Hostinger

1. Acesse o painel da Hostinger
2. Vá em **File Manager** ou use FTP (FileZilla)
3. Navegue até a pasta do seu site (geralmente `public_html` ou `www`)
4. **Delete os arquivos antigos** (ou faça backup)
5. **Faça upload de TODOS os arquivos** da pasta `dist`
   - Selecione todos os arquivos dentro de `dist`
   - Faça upload para a raiz do seu domínio

### 5. Testar

1. Acesse seu site
2. Vá para `/admin/login`
3. Faça login com:
   - Email: `codornaco@gmail.com`
   - Senha: `Prosperidade@8`
4. Verifique se os cards de usuários não estão mais zerados

---

## 🔒 Alternativa Mais Segura (Recomendado)

Se você não quer expor a service role key no código JavaScript, use esta alternativa:

### 1. Configurar Políticas RLS no Supabase

1. Acesse o Supabase Dashboard
2. Vá em **SQL Editor**
3. Cole e execute este código:

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

4. Clique em **Run** para executar

### 2. Criar `.env.production` SEM a service role key

```env
VITE_SUPABASE_URL=https://seu-projeto-id.supabase.co
VITE_SUPABASE_ANON_KEY=sua-anon-key-aqui
```

**NÃO** adicione a `VITE_SUPABASE_SERVICE_ROLE_KEY` neste caso.

### 3. Fazer Build e Upload

Siga os passos 3 e 4 da solução rápida acima.

---

## 🐛 Problemas Comuns

### "Ainda está zerado após fazer tudo"

1. **Verifique o console do navegador (F12):**
   - Procure por erros em vermelho
   - Procure por logs que começam com `🔍 Admin Stats Debug:`

2. **Verifique se o build foi feito corretamente:**
   - Certifique-se de que o arquivo `.env.production` existe na raiz
   - Execute `npm run build` novamente
   - Verifique se a pasta `dist` foi criada

3. **Verifique se fez upload corretamente:**
   - Todos os arquivos da pasta `dist` devem estar na raiz do domínio
   - O arquivo `index.html` deve estar na raiz

### "Não consigo acessar o painel admin"

1. Verifique se você está acessando `/admin/login`
2. Use as credenciais corretas:
   - Email: `codornaco@gmail.com`
   - Senha: `Prosperidade@8`

### "Erro de RLS no console"

Se aparecer erros de RLS (Row Level Security):
- Use a **Alternativa Mais Segura** acima (configurar políticas RLS)
- Ou certifique-se de que a service role key está correta no `.env.production`

---

## 📝 Checklist Final

Antes de considerar que está tudo pronto:

- [ ] Arquivo `.env.production` criado na raiz do projeto
- [ ] Variáveis preenchidas com valores reais do Supabase
- [ ] Build executado (`npm run build`)
- [ ] Pasta `dist` criada com sucesso
- [ ] Arquivos da pasta `dist` enviados para a Hostinger
- [ ] Site acessível e funcionando
- [ ] Painel admin acessível em `/admin/login`
- [ ] Cards de usuários mostrando valores (não mais zerados)

---

## 💡 Dica Extra

Depois de configurar, você pode remover o arquivo `.env.production` localmente (ele já foi usado no build). Mas mantenha as chaves anotadas em um lugar seguro!

---

## 🆘 Ainda Precisa de Ajuda?

Me diga:
1. Qual erro aparece no console do navegador?
2. Os cards ainda estão zerados?
3. Conseguiu fazer o build e upload?




