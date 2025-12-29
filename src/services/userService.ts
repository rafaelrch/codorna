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

  // Verificar se o usuário tem acesso (PRO ou trial válido)
  async hasAccess(): Promise<{ hasAccess: boolean; isPro: boolean; trialExpired: boolean }> {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { hasAccess: false, isPro: false, trialExpired: true }
    }

    const normalizeStatus = (status: unknown) =>
      typeof status === 'string' ? status.trim().toUpperCase() : ''

    const isApprovedPurchaseStatus = (status: unknown) => {
      const s = normalizeStatus(status)
      return (
        s === 'APPROVED' ||
        s === 'APROVADO' ||
        s === 'PAID' ||
        s === 'ACTIVE' ||
        s.startsWith('APPROV')
      )
    }

    const metadataIsPro =
      user.user_metadata?.subscription_type === 'pro' ||
      user.user_metadata?.is_pro === true

    try {
      const { data: compraData, error: compraError } = await supabase
        .from('usuario_compra')
        .select('status')
        .eq('auth_id', user.id)
        .maybeSingle()

      if (!compraError && compraData && isApprovedPurchaseStatus(compraData.status)) {
        return { hasAccess: true, isPro: true, trialExpired: false }
      }
    } catch {
      // ignore
    }

    if (metadataIsPro) {
      return { hasAccess: true, isPro: true, trialExpired: false }
    }

    try {
      const { data: trialData } = await supabase
        .from('users_trial')
        .select('trial_end_at')
        .eq('id', user.id)
        .maybeSingle()

      if (trialData?.trial_end_at) {
        const now = new Date()
        const trialEndAt = new Date(trialData.trial_end_at)
        const trialExpired = now > trialEndAt
        return { hasAccess: !trialExpired, isPro: false, trialExpired }
      }
    } catch {
      // ignore
    }

    // Mantém o comportamento atual do projeto (fallback libera)
    return { hasAccess: true, isPro: false, trialExpired: false }
  }

  /**
   * Verificação de acesso seguindo a lógica:
   * 1. Verificar na tabela users_total se o usuário é PRO ou trial
   * 2. Se for PRO:
   *    - Verificar na tabela usuario_compra se o status é "APPROVED"
   *    - Se APPROVED: liberar acesso
   *    - Se "DELAYED": redirecionar para /subscription (assinatura pendente)
   * 3. Se for trial:
   *    - Verificar na tabela users_trial se o trial_end_at ultrapassou a data atual
   *    - Se ultrapassou: redirecionar para /trial-expired
   *    - Se não ultrapassou: liberar acesso
   */
  async evaluateAccessStatus(): Promise<{
    redirectTo: string | null
    userTotalId?: string
    trialEndFormatted?: string
  }> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { redirectTo: '/login' }
    }

    const shouldDebugAccess =
      (typeof import.meta !== 'undefined' && (import.meta as any)?.env?.DEV) ||
      ((import.meta as any)?.env?.VITE_DEBUG_ACCESS === 'true')

    const debugAccess = (...args: any[]) => {
      if (shouldDebugAccess) {
        // eslint-disable-next-line no-console
        console.info('[access]', ...args)
      }
    }

    const normalizeStatus = (status: unknown) =>
      typeof status === 'string' ? status.trim().toUpperCase() : ''

    // Buscar id na users_total para uso na aplicação
    let userTotalId: string | undefined
    try {
      const { data: totalData } = await supabase
        .from('users_total')
        .select('id')
        .eq('id', user.id)
        .single()
      
      if (totalData?.id) {
        userTotalId = totalData.id
      }
    } catch (error: any) {
      // Erro silencioso
    }

    // Determinar se o usuário é PRO ou trial
    // Prioridade: verificar primeiro se existe em usuario_compra (PRO)
    let userPlan: 'pro' | 'trial' | null = null

    // Verificar se existe em usuario_compra (PRO)
    try {
      const { data: compraData } = await supabase
        .from('usuario_compra')
        .select('id')
        .eq('auth_id', user.id)
        .maybeSingle()
      
      if (compraData) {
        userPlan = 'pro'
      }
    } catch (error: any) {
      // Erro silencioso
    }

    // Se não encontrou em usuario_compra, verificar se existe em users_trial (trial)
    if (!userPlan) {
      try {
        const { data: trialData } = await supabase
          .from('users_trial')
          .select('id')
          .eq('id', user.id)
          .maybeSingle()
        
        if (trialData) {
          userPlan = 'trial'
        }
      } catch (error: any) {
        // Erro silencioso
      }
    }

    // Se for PRO, verificar status na tabela usuario_compra
    if (userPlan === 'pro') {
      try {
        const { data: compraData, error: compraError } = await supabase
          .from('usuario_compra')
          .select('status')
          .eq('auth_id', user.id)
          .maybeSingle()

        if (!compraError && compraData) {
          const status = normalizeStatus(compraData.status)
          
          if (status === 'APPROVED') {
            debugAccess('allowed: PRO user with APPROVED status', { userId: user.id, status: compraData.status })
            return { redirectTo: null, userTotalId }
          }
          
          if (status === 'DELAYED') {
            debugAccess('blocked: PRO user with DELAYED status', { userId: user.id, status: compraData.status })
            return { redirectTo: '/subscription-pending', userTotalId }
          }
        }
      } catch (error: any) {
        // Erro silencioso
      }
    }

    // Se for trial, verificar se o trial expirou
    if (userPlan === 'trial') {
      try {
        const { data: trialData } = await supabase
          .from('users_trial')
          .select('trial_end_at')
          .eq('id', user.id)
          .maybeSingle()

        if (trialData?.trial_end_at) {
          const trialEnd = new Date(trialData.trial_end_at)
          const now = new Date()
          const trialEndFormatted = trialEnd.toLocaleDateString('pt-BR')
          const isExpired = trialEnd < now
          
          if (isExpired) {
            debugAccess('blocked: trial expired', { userId: user.id, trial_end_at: trialData.trial_end_at })
            return { redirectTo: '/trial-expired', userTotalId, trialEndFormatted }
          } else {
            debugAccess('allowed: trial active', { userId: user.id, trial_end_at: trialData.trial_end_at })
            return { redirectTo: null, userTotalId, trialEndFormatted }
          }
        }
      } catch (error: any) {
        // Erro silencioso
      }
    }

    // Se não conseguiu determinar o plano ou não encontrou dados, permitir acesso padrão
    debugAccess('allowed: default fallback', { userId: user.id, userPlan })
    return { redirectTo: null, userTotalId }
  }
}

export const userService = new UserService()
