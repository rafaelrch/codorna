# 🚀 Checklist de Deploy para Produção (Versão Gratuita)

## ✅ Preparação Atual - CONCLUÍDA

### **Sistema Configurado Para:**
- ✅ **Acesso gratuito** para todos os usuários
- ✅ **Plano Pro comentado** (não visível)
- ✅ **Plataforma interna COMPLETAMENTE desabilitada** (dashboard, transações, metas, conta)
- ✅ **Rotas internas comentadas** e redirecionam para landing page
- ✅ **Login redireciona para WhatsApp** (não usa dashboard)
- ✅ **Apenas landing page, cadastro e login funcionais**
- ✅ **Infraestrutura preservada** para ativação futura

---

## 📋 Checklist de Deploy

### **1. Variáveis de Ambiente**
- [ ] Copiar `env.example` para `.env.local`
- [ ] Configurar `VITE_SUPABASE_URL` com URL real
- [ ] Configurar `VITE_SUPABASE_ANON_KEY` com chave real
- [ ] Verificar se variáveis estão sendo carregadas

### **2. Supabase - Configuração**
- [ ] Confirmar tabelas criadas: `users`, `transacoes`, `metas`, `categorias`
- [ ] Verificar RLS policies ativas
- [ ] Testar autenticação (signup/login)
- [ ] Configurar redirect URLs para domínio de produção

### **3. Funcionalidades - Teste**
- [ ] Landing page carrega sem erros
- [ ] Cadastro de usuário funciona (vai para confirmação de email)
- [ ] Login redireciona para WhatsApp
- [ ] Confirmação de email funciona e leva ao WhatsApp
- [ ] Todos os botões da landing levam ao WhatsApp correto
- [ ] Rotas /dashboard, /transactions, /goals, /account redirecionam para home
- [ ] Nenhum usuário consegue acessar plataforma interna

### **4. Deploy - Plataforma**
- [ ] Build de produção sem erros: `npm run build`
- [ ] Testar build localmente: `npm run preview`
- [ ] Deploy na plataforma escolhida (Vercel/Netlify)
- [ ] Configurar variáveis de ambiente na plataforma
- [ ] Testar site em produção

### **5. Pós-Deploy**
- [ ] Testar cadastro em produção
- [ ] Testar todas as funcionalidades
- [ ] Verificar logs do Supabase
- [ ] Confirmar emails de confirmação funcionando

---

## 🔮 Para Ativação Futura da Plataforma Interna

### **Quando quiser ativar dashboard/plataforma:**

1. **Descomentar rotas** em `App.tsx` (dashboard, transactions, goals, account)
2. **Descomentar imports** dos componentes (Dashboard, Transactions, Goals, etc.)
3. **Remover redirecionamentos** das rotas internas
4. **Reativar ProtectedRoute** se necessário
5. **Descomentar Plano Pro** em `Pricing.tsx` se quiser monetizar
6. **Configurar Stripe LIVE** se quiser pagamentos
7. **Testar fluxo completo** da plataforma

---

## 🎯 Status Atual: **PRONTO PARA DEPLOY APENAS WHATSAPP**

**O projeto está configurado para:**
- ✅ **Landing page funcional** com informações do produto
- ✅ **Cadastro e login** que direcionam para WhatsApp
- ✅ **Plataforma interna completamente desabilitada**
- ✅ **Nenhum usuário consegue acessar dashboard**
- ✅ **Toda interação acontece via WhatsApp**
- ✅ **Infraestrutura preservada** para ativação futura da plataforma
