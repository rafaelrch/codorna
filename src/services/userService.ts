import { supabase } from '@/lib/supabase'

export interface UserData {
  id: string
  user_id: string
  first_name: string
  last_name: string
  name: string
  email: string
  telefone: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface CreateUserData {
  first_name: string
  last_name: string
  email: string
  telefone?: string
}

export interface UpdateUserData {
  first_name?: string
  last_name?: string
  telefone?: string
  is_active?: boolean
}

class UserService {
  // Obter dados do usuário atual da tabela DADOS
  async getCurrentUserData(): Promise<UserData | null> {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return null
    }

    const { data, error } = await supabase
      .from('dados')
      .select('*')
      .eq('user_id', user.id)
      .eq('type', 'user')
      .single()

    if (error) {
      console.error('Erro ao buscar dados do usuário:', error)
      return null
    }

    return data
  }

  // Criar usuário na tabela DADOS
  async createUser(userId: string, userData: CreateUserData): Promise<UserData> {
    const { data, error } = await supabase
      .from('dados')
      .insert({
        user_id: userId,
        type: 'user',
        first_name: userData.first_name,
        last_name: userData.last_name,
        name: `${userData.first_name} ${userData.last_name}`,
        email: userData.email,
        telefone: userData.telefone || '',
        is_active: true,
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('Erro ao criar usuário na tabela DADOS:', error)
      throw new Error('Falha ao criar usuário')
    }

    return data
  }

  // Atualizar dados do usuário na tabela DADOS
  async updateUser(updates: UpdateUserData): Promise<UserData> {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      throw new Error('Usuário não autenticado')
    }

    // Preparar dados de atualização
    const updateData: any = { ...updates }
    
    // Se atualizar nome ou sobrenome, atualizar também o campo name
    if (updates.first_name || updates.last_name) {
      const currentData = await this.getCurrentUserData()
      if (currentData) {
        const newFirstName = updates.first_name || currentData.first_name
        const newLastName = updates.last_name || currentData.last_name
        updateData.name = `${newFirstName} ${newLastName}`
      }
    }

    const { data, error } = await supabase
      .from('dados')
      .update(updateData)
      .eq('user_id', user.id)
      .eq('type', 'user')
      .select()
      .single()

    if (error) {
      console.error('Erro ao atualizar usuário:', error)
      throw new Error('Falha ao atualizar usuário')
    }

    return data
  }

  // Verificar se usuário existe na tabela DADOS
  async userExistsInDados(userId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('dados')
      .select('id')
      .eq('user_id', userId)
      .eq('type', 'user')
      .single()

    return !error && !!data
  }

  // Sincronizar usuário do Supabase Auth para tabela DADOS
  async syncUserFromAuth(): Promise<UserData | null> {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return null
    }

    // Verificar se já existe na tabela DADOS
    const exists = await this.userExistsInDados(user.id)
    
    if (exists) {
      return this.getCurrentUserData()
    }

    // Se não existe, criar
    const userData = user.user_metadata || {}
    const createData: CreateUserData = {
      first_name: userData.first_name || '',
      last_name: userData.last_name || '',
      email: user.email || '',
      telefone: userData.phone || ''
    }

    return this.createUser(user.id, createData)
  }

  // Obter estatísticas do usuário
  async getUserStats() {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      throw new Error('Usuário não autenticado')
    }

    // Contar transações
    const { count: transactionCount } = await supabase
      .from('dados')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('type', 'transaction')

    // Contar metas
    const { count: goalCount } = await supabase
      .from('dados')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('type', 'goal')

    // Calcular total de transações
    const { data: transactions } = await supabase
      .from('dados')
      .select('amount, subtype')
      .eq('user_id', user.id)
      .eq('type', 'transaction')

    const totalIncome = transactions
      ?.filter(t => t.subtype === 'income')
      .reduce((sum, t) => sum + Number(t.amount), 0) || 0

    const totalExpense = transactions
      ?.filter(t => t.subtype === 'expense')
      .reduce((sum, t) => sum + Number(t.amount), 0) || 0

    return {
      transactionCount: transactionCount || 0,
      goalCount: goalCount || 0,
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense
    }
  }

  // Formatar data para exibição
  formatDateForDisplay(dateString: string): string {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  // Formatar moeda
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount)
  }
}

export const userService = new UserService()
