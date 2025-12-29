import { supabase } from '@/lib/supabase'

export interface TransactionFilters {
  startDate?: string
  endDate?: string
  category?: string
  type?: 'saida' | 'entrada'
}

export interface CreateTransactionData {
  descricao: string
  tipo: 'entrada' | 'saida'
  categoria: string
  data: string
  valor: number
  metodo: 'Débito' | 'Crédito' | 'Pix' | 'Dinheiro'
}


export interface Transaction {
  id: number
  data_hora: string
  responsavel: string
  categoria: string
  tipo: 'entrada' | 'saida'
  valor: number
  descricao: string
  criado_em: string
  email: string
  metodo?: 'Débito' | 'Crédito' | 'Pix' | 'Dinheiro' | null
}

class TransactionService {
  // Get all transactions for the current user
  async getTransactions(filters: TransactionFilters = {}): Promise<Transaction[]> {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      throw new Error('User not authenticated')
    }

    let query = supabase
      .from('financeiro_registros')
      .select('*')
      .eq('user_id', user.id)
      .order('criado_em', { ascending: false })

    // Apply filters
    if (filters.type) {
      query = query.eq('tipo', filters.type)
    }

    if (filters.startDate) {
      // Adicionar hora 00:00:00 para garantir que pegue desde o início do dia
      const startDateTime = `${filters.startDate}T00:00:00`;
      query = query.gte('data_hora', startDateTime)
    }

    if (filters.endDate) {
      // Adicionar hora 23:59:59 para garantir que pegue até o final do dia
      const endDateTime = `${filters.endDate}T23:59:59`;
      query = query.lte('data_hora', endDateTime)
    }

    const { data, error } = await query

    if (error) {
      throw new Error('Failed to fetch transactions')
    }

    // Filter by category if provided
    if (filters.category && data) {
      const filtered = data.filter(transaction => 
        transaction.categoria === filters.category
      )
      return filtered
    }
    return data || []
  }

  // Create a new transaction
  async createTransaction(transaction: CreateTransactionData): Promise<Transaction> {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      throw new Error('User not authenticated')
    }

    // Buscar telefone do usuário na tabela users_total
    const { data: userData, error: userError } = await supabase
      .from('users_total')
      .select('telefone')
      .eq('id', user.id)
      .single()

    const userPhone =
      (!userError && userData?.telefone) ||
      user.user_metadata?.phone ||
      user.user_metadata?.telefone ||
      ''

    // Salvar na tabela financeiro_registros
    const financeiroRegistroData = {
      data_hora: `${transaction.data}T00:00:00`, // Data escolhida pelo usuário (inicio do dia)
      responsavel: userPhone, // Número de telefone do usuário
      user_id: user.id,
      categoria: transaction.categoria,
      tipo: transaction.tipo,
      valor: transaction.valor,
      descricao: transaction.descricao,
      criado_em: new Date().toISOString(), // Timestamp atual (quando o registro foi inserido no banco)
      email: user.email,
      metodo: transaction.metodo
    }

    const { data, error } = await supabase
      .from('financeiro_registros')
      .insert(financeiroRegistroData)
      .select()
      .single()

    if (error) {
      throw new Error('Failed to create transaction')
    }

    return data
  }



  // Delete a transaction
  async deleteTransaction(id: number): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      throw new Error('User not authenticated')
    }

    const { error } = await supabase
      .from('financeiro_registros')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) {
      throw new Error('Failed to delete transaction')
    }
  }

  // Get categories from categorias table
  async getExpenseCategories(): Promise<Array<{id: number, nome: string}>> {
    const { data, error } = await supabase
      .from('categorias')
      .select('id, nome')
      .eq('tipo', 'saida')
      .order('nome')

    if (error) {
      return []
    }

    return data || []
  }

  // Get income categories
  async getIncomeCategories(): Promise<Array<{id: number, nome: string}>> {
    const { data, error } = await supabase
      .from('categorias')
      .select('id, nome')
      .eq('tipo', 'entrada')
      .order('nome')

    if (error) {
      return []
    }

    return data || []
  }

  // Get all categories (both income and expense)
  async getAllCategories(): Promise<Array<{id: number, nome: string, tipo: 'saida' | 'entrada'}>> {
    const { data, error } = await supabase
      .from('categorias')
      .select('id, nome, tipo')
      .order('tipo, nome')

    if (error) {
      return []
    }
    return data || [];
  }

  // Get transaction statistics
  async getTransactionStats(startDate?: string, endDate?: string) {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      throw new Error('User not authenticated')
    }

    let query = supabase
      .from('financeiro_registros')
      .select('valor, tipo, data_hora')
      .eq('user_id', user.id)

    if (startDate) {
      // Adicionar hora 00:00:00 para garantir que pegue desde o início do dia
      const startDateTime = `${startDate}T00:00:00`;
      query = query.gte('data_hora', startDateTime)
    }

    if (endDate) {
      // Adicionar hora 23:59:59 para garantir que pegue até o final do dia
      const endDateTime = `${endDate}T23:59:59`;
      query = query.lte('data_hora', endDateTime)
    }

    const { data, error } = await query

    if (error) {
      throw new Error('Failed to fetch transaction stats')
    }

    const stats = data?.reduce((acc, transaction) => {
      if (transaction.tipo === 'entrada') {
        acc.totalIncome += Number(transaction.valor)
      } else {
        acc.totalExpense += Number(transaction.valor)
      }
      return acc
    }, { totalIncome: 0, totalExpense: 0 })

    return {
      totalIncome: stats?.totalIncome || 0,
      totalExpense: stats?.totalExpense || 0,
      balance: (stats?.totalIncome || 0) - (stats?.totalExpense || 0)
    }
  }

  // Get monthly statistics
  async getMonthlyStats(year: number, month: number) {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      throw new Error('User not authenticated')
    }

    const startDate = `${year}-${month.toString().padStart(2, '0')}-01`
    const endDate = `${year}-${month.toString().padStart(2, '0')}-31`

    const { data, error } = await supabase
      .from('financeiro_registros')
      .select('valor, tipo, categoria')
      .eq('user_id', user.id)
      .gte('criado_em', startDate)
      .lte('criado_em', endDate)

    if (error) {
      throw new Error('Failed to fetch monthly stats')
    }

    const stats = data?.reduce((acc, transaction) => {
      if (transaction.tipo === 'entrada') {
        acc.totalIncome += Number(transaction.valor)
        acc.incomeByCategory[transaction.categoria] = (acc.incomeByCategory[transaction.categoria] || 0) + Number(transaction.valor)
      } else {
        acc.totalExpense += Number(transaction.valor)
        acc.expenseByCategory[transaction.categoria] = (acc.expenseByCategory[transaction.categoria] || 0) + Number(transaction.valor)
      }
      return acc
    }, { 
      totalIncome: 0, 
      totalExpense: 0, 
      incomeByCategory: {} as Record<string, number>,
      expenseByCategory: {} as Record<string, number>
    })

    return {
      totalIncome: stats?.totalIncome || 0,
      totalExpense: stats?.totalExpense || 0,
      balance: (stats?.totalIncome || 0) - (stats?.totalExpense || 0),
      incomeByCategory: stats?.incomeByCategory || {},
      expenseByCategory: stats?.expenseByCategory || {}
    }
  }

  // Get expenses grouped by payment method
  async getExpensesByPaymentMethod(startDate?: string, endDate?: string) {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      throw new Error('User not authenticated')
    }

    let query = supabase
      .from('financeiro_registros')
      .select('valor, metodo')
      .eq('user_id', user.id)
      .eq('tipo', 'saida')

    if (startDate) {
      // Adicionar hora 00:00:00 para garantir que pegue desde o início do dia
      const startDateTime = `${startDate}T00:00:00`;
      query = query.gte('data_hora', startDateTime)
    }

    if (endDate) {
      // Adicionar hora 23:59:59 para garantir que pegue até o final do dia
      const endDateTime = `${endDate}T23:59:59`;
      query = query.lte('data_hora', endDateTime)
    }

    const { data, error } = await query

    if (error) {
      throw new Error('Failed to fetch expenses by payment method')
    }

    // Group by payment method
    const methodTotals = data?.reduce((acc, transaction) => {
      const method = transaction.metodo || 'Não informado'
      acc[method] = (acc[method] || 0) + Number(transaction.valor)
      return acc
    }, {} as Record<string, number>)

    // Return data for all methods (Débito, Crédito, Pix, Dinheiro) even if zero
    return {
      'Débito': methodTotals?.['Débito'] || 0,
      'Crédito': methodTotals?.['Crédito'] || 0,
      'Pix': methodTotals?.['Pix'] || 0,
      'Dinheiro': methodTotals?.['Dinheiro'] || 0,
      'Não informado': methodTotals?.['Não informado'] || 0
    }
  }

  // Format date for display (sem problemas de timezone)
  formatDateForDisplay(dateString: string): string {
    // Extrair a data diretamente do timestamp sem conversão de timezone
    // Formato esperado: "2025-12-10 00:00:00+00" ou "2025-12-10T00:00:00+00:00" ou "2025-12-10"
    const dateMatch = dateString.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (dateMatch) {
      const [, year, month, day] = dateMatch;
      // Formatar como DD/MM/YYYY
      return `${day}/${month}/${year}`;
    }
    
    // Fallback para o método anterior se o formato não corresponder
    const date = new Date(dateString);
    // Usar UTC para evitar problemas de timezone
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = date.getUTCFullYear();
    return `${day}/${month}/${year}`;
  }

  // Format date range for display
  formatDateRangeForDisplay(startDate: string, endDate: string): string {
    return `${this.formatDateForDisplay(startDate)} - ${this.formatDateForDisplay(endDate)}`;
  }

  // Format date range in abbreviated format (e.g., "1 Dez - 10 Dez, 2025")
  formatDateRangeAbbreviated(startDate: string, endDate: string): string {
    // Extrair datas diretamente do timestamp sem conversão de timezone
    const startMatch = startDate.match(/^(\d{4})-(\d{2})-(\d{2})/);
    const endMatch = endDate.match(/^(\d{4})-(\d{2})-(\d{2})/);
    
    if (startMatch && endMatch) {
      const [, startYear, startMonth, startDay] = startMatch;
      const [, endYear, endMonth, endDay] = endMatch;
      
      const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
      const startMonthIndex = parseInt(startMonth) - 1;
      const endMonthIndex = parseInt(endMonth) - 1;
      
      const startDayNum = parseInt(startDay);
      const endDayNum = parseInt(endDay);
      const startMonthName = monthNames[startMonthIndex];
      const endMonthName = monthNames[endMonthIndex];
      
      // Se for o mesmo ano, mostrar apenas no final
      if (startYear === endYear) {
        // Se for o mesmo mês, mostrar apenas uma vez
        if (startMonth === endMonth) {
          return `${startDayNum} - ${endDayNum} ${startMonthName}, ${startYear}`;
        } else {
          return `${startDayNum} ${startMonthName} - ${endDayNum} ${endMonthName}, ${startYear}`;
        }
      } else {
        return `${startDayNum} ${startMonthName}, ${startYear} - ${endDayNum} ${endMonthName}, ${endYear}`;
      }
    }
    
    // Fallback para o formato padrão
    return this.formatDateRangeForDisplay(startDate, endDate);
  }

  // Format currency
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount)
  }
}

export const transactionService = new TransactionService()