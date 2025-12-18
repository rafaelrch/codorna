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

    const metadataIsPro = user.user_metadata?.subscription_type === 'pro' || user.user_metadata?.is_pro === true

    let userData: UserData | null = null
    const { data: users2Data, error: users2Error } = await supabase
      .from('users_2')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (!users2Error && users2Data) {
      userData = users2Data as UserData
    }

    if (userData) {
      if (userData.plan === 'pro' || userData.status === 'pro') {
        return { hasAccess: true, isPro: true, trialExpired: false }
      }

      if (userData.plan === 'trial' || userData.status === 'trial') {
        const now = new Date()
        const trialEndAt = userData.trial_end_at ? new Date(userData.trial_end_at) : null
        const trialExpired = trialEndAt ? now > trialEndAt : true

        if (metadataIsPro) {
          return { hasAccess: true, isPro: true, trialExpired: false }
        }

        return {
          hasAccess: !trialExpired,
          isPro: false,
          trialExpired
        }
      }
    }

    if (metadataIsPro) {
      return { hasAccess: true, isPro: true, trialExpired: false }
    }

    const { data: proData, error: proError } = await supabase
      .from('users_pro')
      .select('user_id')
      .eq('user_id', user.id)
      .single()

    if (!proError && proData) {
      return { hasAccess: true, isPro: true, trialExpired: false }
    }

    return { hasAccess: false, isPro: false, trialExpired: true }
  }

  /**
   * Nova verificação de acesso considerando:
   * - Tabela users_trial: checa trial_end_at (formato dd/mm/aaaa) e expiração.
   * - Tabela usuario_compra: checa status (APPROVED libera, outros redirecionam para renovação).
   * - Tabela users_total: retorna o id para ser usado na plataforma.
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

    const metadataIsPro =
      user.user_metadata?.subscription_type === 'pro' ||
      user.user_metadata?.is_pro === true

    const normalizeStatus = (status: unknown) =>
      typeof status === 'string' ? status.trim().toUpperCase() : ''

    const isApprovedPurchaseStatus = (status: unknown) => {
      const s = normalizeStatus(status)
      // Aceitar variações comuns (case/whitespace) e possíveis status equivalentes
      return (
        s === 'APPROVED' ||
        s === 'APROVADO' ||
        s === 'PAID' ||
        s === 'ACTIVE' ||
        s.startsWith('APPROV') // APPROVED/APROVADO/etc
      )
    }

    const isBlockedPurchaseStatus = (status: unknown) => {
      const s = normalizeStatus(status)
      return (
        s === 'CANCELLED' ||
        s === 'CANCELED' ||
        s === 'CANCELADO' ||
        s === 'REFUNDED' ||
        s === 'REEMBOLSADO' ||
        s === 'CHARGEDBACK' ||
        s === 'REJECTED' ||
        s === 'RECUSADO' ||
        s === 'EXPIRED' ||
        s === 'EXPIRADO'
      )
    }

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

    // Verificar compra aprovada
    try {
      const { data: compraData, error: compraError } = await supabase
        .from('usuario_compra')
        .select('status')
        .eq('auth_id', user.id)
        .maybeSingle()

      // Se não houver erro e houver dados
      if (!compraError && compraData) {
        if (isApprovedPurchaseStatus(compraData.status)) {
          debugAccess('allowed: usuario_compra approved', { userId: user.id, status: compraData.status })
          return { redirectTo: null, userTotalId }
        }

        // Se a compra existe e está explicitamente bloqueada, redirecionar
        if (isBlockedPurchaseStatus(compraData.status)) {
          debugAccess('blocked: usuario_compra status blocked', { userId: user.id, status: compraData.status })
          return { redirectTo: '/trial-expired', userTotalId }
        }
        // Caso a compra exista mas esteja pendente/indefinida, não bloquear aqui:
        // segue para outras fontes de PRO (metadata/users_2/users_pro) e trial.
        debugAccess('purchase present but not decisive', { userId: user.id, status: compraData.status })
      }
    } catch (error: any) {
      // Erro silencioso - usuário pode não ter registro na tabela
    }

    // Outras fontes de PRO (não dependem de usuario_compra)
    if (metadataIsPro) {
      debugAccess('allowed: metadata pro', { userId: user.id })
      return { redirectTo: null, userTotalId }
    }

    try {
      const { data: users2Data, error: users2Error } = await supabase
        .from('users_2')
        .select('plan,status')
        .eq('user_id', user.id)
        .maybeSingle()

      if (!users2Error && users2Data) {
        const plan = normalizeStatus(users2Data.plan)
        const status = normalizeStatus(users2Data.status)
        if (plan === 'PRO' || status === 'PRO') {
          debugAccess('allowed: users_2 pro', { userId: user.id, plan: users2Data.plan, status: users2Data.status })
          return { redirectTo: null, userTotalId }
        }
      }
    } catch (error: any) {
      // Erro silencioso
    }

    try {
      const { data: proData, error: proError } = await supabase
        .from('users_pro')
        .select('user_id')
        .eq('user_id', user.id)
        .maybeSingle()

      if (!proError && proData) {
        debugAccess('allowed: users_pro', { userId: user.id })
        return { redirectTo: null, userTotalId }
      }
    } catch (error: any) {
      // Erro silencioso
    }

    // Verificar trial
    try {
      const { data: trialData } = await supabase
        .from('users_trial')
        .select('trial_end_at')
        .eq('id', user.id)
        .single()

      if (trialData?.trial_end_at) {
        const trialEnd = new Date(trialData.trial_end_at)
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const trialEndFormatted = trialEnd.toLocaleDateString('pt-BR')
        const isExpired = trialEnd < today
        
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

    // Caso não esteja em nenhuma tabela específica, permitir acesso padrão
    debugAccess('allowed: default fallback', { userId: user.id })
    return { redirectTo: null, userTotalId }
  }
}

export const userService = new UserService()
