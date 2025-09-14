import { supabase } from '@/lib/supabase'
import type { Transaction, CategoryOutput, CategoryInput } from '@/lib/supabase'

export interface TransactionFilters {
  startDate?: string
  endDate?: string
  category?: string
  type?: 'income' | 'expense'
}

export interface CreateTransactionData {
  name: string
  description?: string | null
  category_id: number
  type: 'income' | 'expense'
  amount: number
}

class TransactionService {
  // Get all transactions for the current user
  async getTransactions(filters: TransactionFilters = {}): Promise<Transaction[]> {
    let query = supabase
      .from('transactions')
      .select(`
        *,
        category_output:category_output_id(id, name),
        category_input:category_input_id(id, name)
      `)
      .order('created_at', { ascending: false })

    // Apply filters
    if (filters.type) {
      query = query.eq('type', filters.type)
    }

    if (filters.startDate) {
      query = query.gte('created_at', filters.startDate + 'T00:00:00')
    }

    if (filters.endDate) {
      query = query.lte('created_at', filters.endDate + 'T23:59:59')
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching transactions:', error)
      throw new Error('Failed to fetch transactions')
    }

    // Filter by category name if provided
    if (filters.category && data) {
      return data.filter(transaction => {
        const categoryName = transaction.type === 'expense' 
          ? transaction.category_output?.name 
          : transaction.category_input?.name
        return categoryName === filters.category
      })
    }

    return data || []
  }

  // Create a new transaction
  async createTransaction(transaction: CreateTransactionData): Promise<Transaction> {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      throw new Error('User not authenticated')
    }

    // Prepare transaction data with correct category field
    const transactionData = {
      name: transaction.name,
      description: transaction.description,
      type: transaction.type,
      amount: transaction.amount,
      user_id: user.id,
      // Set the appropriate category field based on transaction type
      category_output_id: transaction.type === 'expense' ? transaction.category_id : null,
      category_input_id: transaction.type === 'income' ? transaction.category_id : null
    }

    const { data, error } = await supabase
      .from('transactions')
      .insert(transactionData)
      .select(`
        *,
        category_output:category_output_id(id, name),
        category_input:category_input_id(id, name)
      `)
      .single()

    if (error) {
      console.error('Error creating transaction:', error)
      throw new Error('Failed to create transaction')
    }

    return data
  }

  // Update a transaction
  async updateTransaction(id: string, updates: Partial<CreateTransactionData>): Promise<Transaction> {
    // Prepare update data with correct category fields
    const updateData: any = {
      name: updates.name,
      description: updates.description,
      type: updates.type,
      amount: updates.amount
    }

    // Handle category updates
    if (updates.category_id && updates.type) {
      if (updates.type === 'expense') {
        updateData.category_output_id = updates.category_id
        updateData.category_input_id = null
      } else {
        updateData.category_input_id = updates.category_id
        updateData.category_output_id = null
      }
    }

    const { data, error } = await supabase
      .from('transactions')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        category_output:category_output_id(id, name),
        category_input:category_input_id(id, name)
      `)
      .single()

    if (error) {
      console.error('Error updating transaction:', error)
      throw new Error('Failed to update transaction')
    }

    return data
  }

  // Delete a transaction
  async deleteTransaction(id: string): Promise<void> {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting transaction:', error)
      throw new Error('Failed to delete transaction')
    }
  }

  // Get expense categories
  async getExpenseCategories(): Promise<CategoryOutput[]> {
    const { data, error } = await supabase
      .from('categories_output')
      .select('*')
      .order('name')

    if (error) {
      console.error('Error fetching expense categories:', error)
      throw new Error('Failed to fetch expense categories')
    }

    return data || []
  }

  // Get income categories
  async getIncomeCategories(): Promise<CategoryInput[]> {
    const { data, error } = await supabase
      .from('categories_input')
      .select('*')
      .order('name')

    if (error) {
      console.error('Error fetching income categories:', error)
      throw new Error('Failed to fetch income categories')
    }

    return data || []
  }

  // Get all categories (both income and expense)
  async getAllCategories(): Promise<Array<{id: number, name: string, type: 'income' | 'expense'}>> {
    const [expenseCategories, incomeCategories] = await Promise.all([
      this.getExpenseCategories(),
      this.getIncomeCategories()
    ])

    return [
      ...expenseCategories.map(cat => ({ ...cat, type: 'expense' as const })),
      ...incomeCategories.map(cat => ({ ...cat, type: 'income' as const }))
    ]
  }

  // Get transaction statistics
  async getTransactionStats(startDate?: string, endDate?: string) {
    let query = supabase
      .from('transactions')
      .select('type, amount')

    if (startDate) {
      query = query.gte('created_at', startDate + 'T00:00:00')
    }

    if (endDate) {
      query = query.lte('created_at', endDate + 'T23:59:59')
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching transaction stats:', error)
      throw new Error('Failed to fetch transaction stats')
    }

    const stats = data?.reduce((acc, transaction) => {
      if (transaction.type === 'income') {
        acc.totalIncome += Number(transaction.amount)
      } else {
        acc.totalExpense += Number(transaction.amount)
      }
      return acc
    }, { totalIncome: 0, totalExpense: 0 })

    return {
      totalIncome: stats?.totalIncome || 0,
      totalExpense: stats?.totalExpense || 0,
      balance: (stats?.totalIncome || 0) - (stats?.totalExpense || 0)
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