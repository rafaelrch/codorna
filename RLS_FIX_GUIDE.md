# Guia para Corrigir RLS na Tabela `usuario_compra`

## Problema Identificado
A tabela `usuario_compra` está retornando 0 registros mesmo quando o usuário existe, indicando que as políticas RLS (Row Level Security) estão bloqueando o acesso.

## Solução: Criar/Atualizar Políticas RLS

### Passo 1: Acessar o Supabase Dashboard
1. Vá para o seu projeto no Supabase
2. Navegue até **Authentication** > **Policies** ou **Table Editor** > `usuario_compra` > **Policies**

### Passo 2: Verificar se RLS está Habilitado
1. Na tabela `usuario_compra`, verifique se **Row Level Security** está ativado
2. Se estiver ativado mas sem políticas, nenhum dado será retornado

### Passo 3: Criar Política de Leitura

Execute este SQL no **SQL Editor** do Supabase:

```sql
-- Política para permitir que usuários leiam seus próprios registros
CREATE POLICY "Users can read their own purchase data"
ON usuario_compra
FOR SELECT
TO authenticated
USING (auth_id = auth.uid());
```

**OU** se preferir permitir leitura por email também:

```sql
-- Política para permitir leitura por auth_id OU email
CREATE POLICY "Users can read their own purchase data"
ON usuario_compra
FOR SELECT
TO authenticated
USING (
  auth_id = auth.uid() 
  OR email = (SELECT email FROM auth.users WHERE id = auth.uid())
);
```

### Passo 4: Verificar Políticas Existentes

Se já existem políticas, verifique se estão corretas:

```sql
-- Ver todas as políticas da tabela usuario_compra
SELECT * FROM pg_policies 
WHERE tablename = 'usuario_compra';
```

### Passo 5: Testar

Após criar a política, recarregue a página e verifique os logs no console.

## Alternativa: Desabilitar RLS (NÃO RECOMENDADO para produção)

Se precisar de acesso temporário para testes:

```sql
-- ⚠️ ATENÇÃO: Isso desabilita RLS completamente
ALTER TABLE usuario_compra DISABLE ROW LEVEL SECURITY;
```

**⚠️ IMPORTANTE:** Reative o RLS após os testes e crie as políticas adequadas.

## Verificação Rápida

Execute no SQL Editor para verificar se há dados:

```sql
-- Ver se há registros na tabela
SELECT COUNT(*) FROM usuario_compra;

-- Ver registros do usuário atual (se autenticado)
SELECT * FROM usuario_compra 
WHERE auth_id = auth.uid();
```

