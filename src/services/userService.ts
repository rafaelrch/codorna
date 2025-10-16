import { supabase } from '@/lib/supabase'

export interface UserData {
  id: string
  user_id: string
  nome: string
  email: string
  telefone: string
  trial_days: number
  trial_start_at: string
  trial_end_at: string
  status: string
  plan: string
  created_at: string
  updated_at: string
}

export interface CreateUserData {
  nome: string
  email: string
  telefone?: string
  plan: 'trial' | 'pro'
}

export interface UpdateUserData {
  nome?: string
  telefone?: string
  plan?: string
  status?: string
  trial_days?: number
  trial_start_at?: string
  trial_end_at?: string
}

class UserService {
  // Obter dados do usuário atual da tabela users_2
  async getCurrentUserData(): Promise<UserData | null> {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return null
    }

    const { data, error } = await supabase
      .from('users_2')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (error) {
      return null
    }

    return data
  }

  // Criar usuário na tabela users_2 (versão simplificada)
  async createUser(userId: string, userData: CreateUserData): Promise<UserData> {
    const now = new Date()
    const trialStartAt = now.toISOString()
    const trialEndAt = new Date(now.getTime() + (7 * 24 * 60 * 60 * 1000)).toISOString() // 7 dias depois

    // Dados corretos para a constraint users_2_status_check
    const insertData: any = {
      user_id: userId,
      nome: userData.nome,
      email: userData.email,
      telefone: userData.telefone || '',
      plan: userData.plan,
      status: userData.plan, // Usar o mesmo valor do plan (trial ou pro)
      trial_days: 7,
      trial_start_at: trialStartAt,
      trial_end_at: trialEndAt,
      created_at: now.toISOString(),
      updated_at: now.toISOString()
    }

    const { data, error } = await supabase
      .from('users_2')
      .insert(insertData)
      .select()
      .single()

    if (error) {
      throw new Error(`Falha ao criar usuário: ${error.message}`)
    }
    return data
  }

  // Atualizar dados do usuário na tabela users_2
  async updateUser(updates: UpdateUserData): Promise<UserData> {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      throw new Error('Usuário não autenticado')
    }

    // Preparar dados de atualização
    const updateData: any = { 
      ...updates,
      updated_at: new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('users_2')
      .update(updateData)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) {
      throw new Error('Falha ao atualizar usuário')
    }

    return data
  }

  // Verificar se usuário existe na tabela users_2
  async userExistsInUsers2(userId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('users_2')
      .select('id')
      .eq('user_id', userId)
      .single()

    return !error && !!data
  }

  // Sincronizar usuário do Supabase Auth para tabela users_2
  async syncUserFromAuth(plan: 'trial' | 'pro' = 'trial'): Promise<UserData | null> {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return null
    }

    // Verificar se já existe na tabela users_2
    const exists = await this.userExistsInUsers2(user.id)
    
    if (exists) {
      return this.getCurrentUserData()
    }

    // Se não existe, criar
    const userData = user.user_metadata || {}
    const createData: CreateUserData = {
      nome: `${userData.first_name || ''} ${userData.last_name || ''}`.trim() || user.email?.split('@')[0] || 'Usuário',
      email: user.email || '',
      telefone: userData.phone || userData.telefone || '',
      plan: plan
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
