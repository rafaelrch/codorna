# Configurar Variáveis de Ambiente no Vercel

## Problema: Cards de usuários zerados em produção

Se os cards de usuários estão zerados mesmo tendo a `VITE_SUPABASE_SERVICE_ROLE_KEY` no `.env.local`, o problema é que **variáveis de ambiente locais não são usadas em produção**.

## Solução: Configurar no Vercel Dashboard

### Passo a Passo:

1. **Acesse o Vercel Dashboard:**
   - Vá para [vercel.com](https://vercel.com)
   - Faça login na sua conta
   - Selecione o projeto "codorna"

2. **Navegue até Settings:**
   - Clique em **Settings** no menu superior
   - Clique em **Environment Variables** no menu lateral

3. **Adicione a variável:**
   - Clique em **Add New**
   - **Key:** `VITE_SUPABASE_SERVICE_ROLE_KEY`
   - **Value:** Cole a service role key do Supabase
   - **Environment:** Selecione todas as opções (Production, Preview, Development)
   - Clique em **Save**

4. **Obter a Service Role Key:**
   - Acesse o Supabase Dashboard
   - Vá em **Settings** > **API**
   - Copie a **service_role key** (não a anon key!)
   - Ela começa com `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

5. **Fazer novo deploy:**
   - Após adicionar a variável, você precisa fazer um novo deploy
   - Vá em **Deployments**
   - Clique nos três pontos (...) do último deployment
   - Selecione **Redeploy**
   - Ou faça um novo commit e push

## Verificar se está funcionando

1. Após o redeploy, acesse o painel admin
2. Abra o console do navegador (F12)
3. Procure por logs que começam com `🔍 Admin Stats Debug:`
4. Verifique se `usingServiceRole: true` aparece nos logs
5. Se aparecer erros, verifique se a chave está correta

## Importante

⚠️ **NUNCA** commite a service role key no Git!
- Ela deve estar apenas no `.env.local` (local) e nas variáveis de ambiente do Vercel (produção)
- Adicione `.env.local` ao `.gitignore` (já deve estar lá)

## Troubleshooting

### Se ainda estiver zerado após configurar:

1. **Verifique se a variável foi adicionada:**
   - No Vercel Dashboard > Settings > Environment Variables
   - Confirme que `VITE_SUPABASE_SERVICE_ROLE_KEY` está listada

2. **Verifique se fez redeploy:**
   - Variáveis de ambiente só são aplicadas em novos deploys
   - Faça um redeploy após adicionar a variável

3. **Verifique os logs no console:**
   - Abra o console do navegador (F12)
   - Procure por erros relacionados a RLS ou autenticação
   - Verifique se `hasServiceRoleKey: true` aparece nos logs

4. **Verifique se a chave está correta:**
   - A service role key é diferente da anon key
   - Ela deve começar com `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - Copie exatamente como aparece no Supabase Dashboard

5. **Teste localmente primeiro:**
   - Adicione a variável no `.env.local`
   - Execute `npm run dev`
   - Verifique se funciona localmente
   - Se funcionar localmente mas não em produção, o problema é a configuração no Vercel


