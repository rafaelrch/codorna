# Configuração do Painel Admin

## Problema: Dados não aparecem no painel admin

Se você está vendo todos os valores como "0" no painel admin, o problema provavelmente é **RLS (Row Level Security)** bloqueando as consultas.

## Solução 1: Usar Service Role Key (Recomendado)

A service role key bypassa o RLS e permite que o painel admin acesse todos os dados.

### Passos:

1. **Obter a Service Role Key:**
   - Acesse o Supabase Dashboard
   - Vá em **Settings** > **API**
   - Copie a **service_role key** (não a anon key!)

2. **Adicionar ao arquivo .env.local:**
   ```env
   VITE_SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key-aqui
   ```

3. **Reiniciar o servidor de desenvolvimento:**
   ```bash
   npm run dev
   # ou
   bun dev
   ```

⚠️ **IMPORTANTE:** A service role key tem acesso total ao banco de dados. Nunca a exponha publicamente ou em repositórios Git!

## Solução 2: Configurar Políticas RLS (Alternativa)

Se você não quiser usar a service role key, pode configurar políticas RLS no Supabase que permitam leitura pública (não recomendado para produção).

### No Supabase SQL Editor, execute:

```sql
-- Permitir leitura pública na tabela users_total (apenas para admin)
ALTER TABLE users_total ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow admin read access" ON users_total
FOR SELECT USING (true);

-- Permitir leitura pública na tabela usuario_compra (apenas para admin)
ALTER TABLE usuario_compra ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow admin read access" ON usuario_compra
FOR SELECT USING (true);

-- Permitir leitura pública na tabela users_trial (apenas para admin)
ALTER TABLE users_trial ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow admin read access" ON users_trial
FOR SELECT USING (true);

-- Permitir leitura pública na tabela financeiro_registros (apenas para admin)
ALTER TABLE financeiro_registros ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow admin read access" ON financeiro_registros
FOR SELECT USING (true);

-- Permitir leitura pública na tabela metas (apenas para admin)
ALTER TABLE metas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow admin read access" ON metas
FOR SELECT USING (true);
```

⚠️ **ATENÇÃO:** Essas políticas permitem leitura pública de TODOS os dados. Use apenas se entender as implicações de segurança.

## Verificar se está funcionando

1. Abra o console do navegador (F12)
2. Acesse o painel admin
3. Verifique os logs no console:
   - Se aparecer "usingServiceRole: true", a service role key está sendo usada
   - Se aparecer erros de RLS, você precisa configurar uma das soluções acima

## Debug

O código agora mostra logs detalhados no console. Verifique:
- Se há erros de RLS
- Quantos registros foram encontrados em cada tabela
- Se a service role key está sendo usada


