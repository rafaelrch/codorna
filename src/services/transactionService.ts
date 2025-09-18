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
}


export interface Transaction {
  id: number
  email: string
  name: string
  telefone: string
  type: 'entrada' | 'saida'
  descricao: string
  valor: number
  categoria: string
  created_at: string
}

class TransactionService {
  // Get all transactions for the current user
  async getTransactions(filters: TransactionFilters = {}): Promise<Transaction[]> {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      throw new Error('User not authenticated')
    }

    console.log('Buscando transações para usuário:', user.email, 'com filtros:', filters);

    let query = supabase
      .from('transacoes')
      .select('*')
      .eq('email', user.email)
      .order('created_at', { ascending: false })

    // Apply filters
    if (filters.type) {
      console.log('Aplicando filtro de tipo:', filters.type);
      query = query.eq('type', filters.type)
    }

    if (filters.startDate) {
      console.log('Aplicando filtro de data início:', filters.startDate);
      query = query.gte('created_at', filters.startDate)
    }

    if (filters.endDate) {
      console.log('Aplicando filtro de data fim:', filters.endDate);
      query = query.lte('created_at', filters.endDate)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching transactions:', error)
      throw new Error('Failed to fetch transactions')
    }

    console.log('Transações encontradas no banco:', data);

    // Filter by category if provided
    if (filters.category && data) {
      const filtered = data.filter(transaction => 
        transaction.categoria === filters.category
      )
      console.log('Transações após filtro de categoria:', filtered);
      return filtered
    }

    console.log('Retornando transações:', data || []);
    return data || []
  }

  // Create a new transaction
  async createTransaction(transaction: CreateTransactionData): Promise<Transaction> {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      throw new Error('User not authenticated')
    }

    // Buscar dados do usuário na tabela users
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('first_name, last_name, phone')
      .eq('id', user.id)
      .single()

    let userName = 'Usuário'
    let userPhone = ''

    if (userError) {
      console.error('Error fetching user data:', userError)
      // Se não conseguir buscar da tabela users, usar dados do auth
      userName = user.user_metadata?.full_name || 
                `${user.user_metadata?.first_name || ''} ${user.user_metadata?.last_name || ''}`.trim() ||
                user.email?.split('@')[0] || 'Usuário'
      userPhone = user.user_metadata?.phone || user.user_metadata?.telefone || ''
    } else {
      // Usar dados da tabela users
      userName = `${userData.first_name || ''} ${userData.last_name || ''}`.trim() || 
                user.email?.split('@')[0] || 'Usuário'
      userPhone = userData.phone || ''
    }

    const transactionData = {
      email: user.email,
      name: userName,
      telefone: userPhone,
      type: transaction.tipo,
      descricao: transaction.descricao,
      valor: transaction.valor,
      categoria: transaction.categoria,
      created_at: transaction.data
    }

    const { data, error } = await supabase
      .from('transacoes')
      .insert(transactionData)
      .select()
      .single()

    if (error) {
      console.error('Error creating transaction:', error)
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
      .from('transacoes')
      .delete()
      .eq('id', id)
      .eq('email', user.email)

    if (error) {
      console.error('Error deleting transaction:', error)
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
      console.error('Error fetching expense categories:', error)
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
      console.error('Error fetching income categories:', error)
      return []
    }

    return data || []
  }

  // Get all categories (both income and expense)
  async getAllCategories(): Promise<Array<{id: number, nome: string, tipo: 'saida' | 'entrada'}>> {
    console.log('Buscando todas as categorias...');
    
    const { data, error } = await supabase
      .from('categorias')
      .select('id, nome, tipo')
      .order('tipo, nome')

    if (error) {
      console.error('Error fetching all categories:', error)
      return []
    }

    console.log('Todas as categorias:', data);
    return data || [];
  }

  // Get transaction statistics
  async getTransactionStats(startDate?: string, endDate?: string) {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      throw new Error('User not authenticated')
    }

    let query = supabase
      .from('transacoes')
      .select('valor, type, created_at')
      .eq('email', user.email)

    if (startDate) {
      query = query.gte('created_at', startDate)
    }

    if (endDate) {
      query = query.lte('created_at', endDate)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching transaction stats:', error)
      throw new Error('Failed to fetch transaction stats')
    }

    const stats = data?.reduce((acc, transaction) => {
      if (transaction.type === 'entrada') {
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
      .from('transacoes')
      .select('valor, type, categoria')
      .eq('email', user.email)
      .gte('created_at', startDate)
      .lte('created_at', endDate)

    if (error) {
      console.error('Error fetching monthly stats:', error)
      throw new Error('Failed to fetch monthly stats')
    }

    const stats = data?.reduce((acc, transaction) => {
      if (transaction.type === 'entrada') {
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

  // Format date for display
  formatDateForDisplay(dateString: string): string {
    return new Date(dateString).toLocaleDateString('pt-BR')
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