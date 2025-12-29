# Codorna - Plataforma Financeira Pessoal

Uma plataforma completa para controle financeiro pessoal, desenvolvida com React, TypeScript e Tailwind CSS.

## 🚀 Funcionalidades

### 📊 Dashboard Financeiro
- **Visão Geral**: Cards com entrada, saída e saldo atual
- **Gráfico de Categorias**: Visualização interativa de gastos por categoria usando gráfico de pizza
- **Navegação Temporal**: Controles para alternar entre semana, mês e ano
- **Filtros de Data**: Seleção personalizada de períodos

### 💰 Gestão de Transações
- **Lançamentos**: Tabela completa com todas as transações
- **Filtros Avançados**: Por data, categoria e tipo (entrada/saída)
- **Adicionar Transação**: Interface para novos lançamentos
- **Categorização**: Organização automática por categorias

### 🎯 Metas Financeiras
- **Definição de Objetivos**: Criação de metas personalizadas
- **Progresso Visual**: Barras de progresso com percentual
- **Categorias**: Organização por tipo (reserva, lazer, educação, etc.)
- **Prazos**: Controle de deadlines para cada meta

### 👤 Gestão de Conta
- **Perfil do Usuário**: Edição de dados pessoais
- **Configurações**: Personalização da conta
- **Informações de Contato**: Nome, email e telefone

### 🆘 Suporte
- **WhatsApp**: Contato direto via WhatsApp
- **Email**: Sistema de contato por email
- **Interface Limpa**: Acesso fácil aos canais de suporte

## 🎨 Design System

### Paleta de Cores
- **Primária**: Tons de cinza escuro para interface clean
- **Sucesso**: Verde para entradas e metas alcançadas  
- **Erro**: Vermelho para saídas e alertas
- **Gráficos**: 7 cores distintas para categorias

### Componentes
- **Cards Financeiros**: Componentes reutilizáveis para métricas
- **Gráficos Interativos**: Recharts para visualizações
- **Sidebar Responsiva**: Navegação adaptável
- **Tabelas**: Layout otimizado para dados financeiros

## 📱 Responsividade

A plataforma é totalmente responsiva, adaptando-se perfeitamente a:
- **Desktop**: Layout completo com sidebar expandida
- **Tablet**: Adaptação inteligente dos componentes
- **Mobile**: Interface otimizada para telas pequenas

## 🛠️ Tecnologias Utilizadas

- **React 18** - Framework principal
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização utilitária
- **Shadcn/UI** - Componentes de interface
- **Recharts** - Gráficos interativos
- **React Router** - Roteamento de páginas
- **Lucide React** - Ícones
- **Vite** - Build tool

## 🏗️ Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── ui/             # Componentes base do Shadcn
│   ├── AppSidebar.tsx  # Navegação lateral
│   ├── Layout.tsx      # Layout principal
│   ├── FinancialCard.tsx # Cards de métricas
│   ├── ExpenseChart.tsx  # Gráfico de categorias
│   └── FinancialGoals.tsx # Metas financeiras
├── pages/              # Páginas da aplicação
│   ├── Dashboard.tsx   # Página principal
│   ├── Transactions.tsx # Gestão de transações
│   ├── Account.tsx     # Perfil do usuário
│   ├── Support.tsx     # Suporte ao cliente
│   └── NotFound.tsx    # Página 404
├── hooks/              # React hooks customizados
├── lib/                # Utilitários e helpers
└── main.tsx            # Ponto de entrada
```

## 🚀 Como Executar

1. **Clone o repositório**
   ```bash
   git clone <repository-url>
   cd codorna-financial
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Execute em desenvolvimento**
   ```bash
   npm run dev
   ```

4. **Acesse a aplicação**
   ```
   http://localhost:8080
   ```

## 📈 Próximas Funcionalidades

- [ ] **Integração com Supabase**: Autenticação e banco de dados
- [ ] **Relatórios Avançados**: Exportação PDF e Excel  
- [ ] **Notificações**: Alertas para metas e lembretes
- [ ] **Categorias Personalizadas**: Criação de categorias próprias
- [ ] **Modo Escuro**: Alternância entre temas
- [ ] **Importação de Dados**: Upload de extratos bancários

## 🔒 Segurança e Privacidade

A plataforma Codorna foi desenvolvida com foco em:
- **Dados Locais**: Processamento local para maior privacidade
- **Criptografia**: Proteção de informações sensíveis
- **Compliance**: Adequação à LGPD

## 📞 Suporte

Para dúvidas ou sugestões:
- **WhatsApp**: Acesse através da página de suporte
- **Email**: suporte@codorna.com
- **GitHub**: Abra uma issue neste repositório

---

Desenvolvido com ❤️ pela equipe Codorna
