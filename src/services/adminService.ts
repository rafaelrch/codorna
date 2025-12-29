import { supabase } from '@/lib/supabase'
import { createClient } from '@supabase/supabase-js'

// Criar cliente admin com service role key se disponível (bypassa RLS)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseServiceRoleKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY

// Log para debug (apenas em desenvolvimento)
if (import.meta.env.DEV) {
  console.log('Admin Service Config:', {
    hasUrl: !!supabaseUrl,
    hasServiceRoleKey: !!supabaseServiceRoleKey,
    serviceRoleKeyLength: supabaseServiceRoleKey?.length || 0,
    url: supabaseUrl
  })
}

// Se tiver service role key, usar ela. Caso contrário, usar a anon key (pode ter problemas com RLS)
const adminSupabase = (supabaseServiceRoleKey && supabaseUrl)
  ? createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : supabase

export interface AdminStats {
  totalUsers: number
  proUsers: number
  trialActive: number
  trialExpired: number
  totalTransactions: number
  totalIncome: number
  totalExpenses: number
  totalGoals: number
  goalsCompleted: number
  goalsInProgress: number
  totalGoalsValue: number
  totalGoalsCurrentValue: number
  transactionsByMonth: Array<{ month: string; income: number; expenses: number }>
  usersByPlan: Array<{ name: string; value: number }>
  transactionsByCategory: Array<{ name: string; value: number }>
  recentUsers: Array<{ id: string; nome: string; email: string; created_at: string }>
}

class AdminService {
  async getAdminStats(): Promise<AdminStats> {
    // Verificar se está usando service role key
    const isUsingServiceRole = !!supabaseServiceRoleKey
    if (!isUsingServiceRole) {
      console.warn('⚠️ VITE_SUPABASE_SERVICE_ROLE_KEY não encontrada. As queries podem ser bloqueadas por RLS.')
      console.warn('Configure a variável de ambiente na plataforma de deploy (Vercel, Netlify, etc.)')
    }

    // Total de usuários
    const { count: totalUsersCount, error: totalUsersError } = await adminSupabase
      .from('users_total')
      .select('*', { count: 'exact', head: true })
    
    if (totalUsersError) {
      console.error('❌ Erro ao buscar total de usuários:', totalUsersError)
      // Se for erro de RLS e não estiver usando service role, avisar
      if (totalUsersError.code === 'PGRST301' || totalUsersError.message?.includes('RLS') || totalUsersError.message?.includes('permission denied')) {
        console.error('🔒 Erro de RLS detectado. Configure VITE_SUPABASE_SERVICE_ROLE_KEY na plataforma de deploy.')
      }
    }

    // Usuários PRO (status APPROVED na usuario_compra)
    const { data: proUsersData, error: proUsersError } = await adminSupabase
      .from('usuario_compra')
      .select('id, status, auth_id')
      .eq('status', 'APPROVED')
    
    if (proUsersError) {
      console.error('❌ Erro ao buscar usuários PRO:', proUsersError)
      if (proUsersError.code === 'PGRST301' || proUsersError.message?.includes('RLS') || proUsersError.message?.includes('permission denied')) {
        console.error('🔒 Erro de RLS detectado. Configure VITE_SUPABASE_SERVICE_ROLE_KEY na plataforma de deploy.')
      }
    }

    // Usuários com trial
    const { data: trialData, error: trialError } = await adminSupabase
      .from('users_trial')
      .select('id, trial_end_at')
    
    if (trialError) {
      console.error('❌ Erro ao buscar dados de trial:', trialError)
      if (trialError.code === 'PGRST301' || trialError.message?.includes('RLS') || trialError.message?.includes('permission denied')) {
        console.error('🔒 Erro de RLS detectado. Configure VITE_SUPABASE_SERVICE_ROLE_KEY na plataforma de deploy.')
      }
    }

    // Calcular trial ativo e expirado
    const now = new Date()
    let trialActive = 0
    let trialExpired = 0

    if (trialData) {
      trialData.forEach(trial => {
        if (trial.trial_end_at) {
          const trialEnd = new Date(trial.trial_end_at)
          if (trialEnd > now) {
            trialActive++
          } else {
            trialExpired++
          }
        }
      })
    }

    // Transações
    const { data: transactionsData, error: transactionsError } = await adminSupabase
      .from('financeiro_registros')
      .select('*')
    
    if (transactionsError) {
      console.error('Erro ao buscar transações:', transactionsError)
    }

    let totalIncome = 0
    let totalExpenses = 0
    const transactionsByMonth: { [key: string]: { income: number; expenses: number } } = {}
    const transactionsByCategory: { [key: string]: number } = {}

    if (transactionsData) {
      transactionsData.forEach(transaction => {
        const value = Number(transaction.valor) || 0
        
        if (transaction.tipo === 'entrada') {
          totalIncome += value
        } else if (transaction.tipo === 'saida') {
          totalExpenses += value
        }

        // Agrupar por mês
        if (transaction.data_hora) {
          const date = new Date(transaction.data_hora)
          const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
          
          if (!transactionsByMonth[monthKey]) {
            transactionsByMonth[monthKey] = { income: 0, expenses: 0 }
          }
          
          if (transaction.tipo === 'entrada') {
            transactionsByMonth[monthKey].income += value
          } else if (transaction.tipo === 'saida') {
            transactionsByMonth[monthKey].expenses += value
          }
        }

        // Agrupar por categoria
        if (transaction.categoria) {
          const category = transaction.categoria
          transactionsByCategory[category] = (transactionsByCategory[category] || 0) + value
        }
      })
    }

    // Converter transactionsByMonth para array
    const transactionsByMonthArray = Object.entries(transactionsByMonth)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, data]) => ({
        month: new Date(month + '-01').toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }),
        income: data.income,
        expenses: data.expenses
      }))

    // Converter transactionsByCategory para array
    const transactionsByCategoryArray = Object.entries(transactionsByCategory)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10) // Top 10 categorias

    // Usuários por plano
    const usersByPlan = [
      { name: 'PRO', value: proUsersData?.length || 0 },
      { name: 'Trial Ativo', value: trialActive },
      { name: 'Trial Expirado', value: trialExpired }
    ]

    // Metas
    const { data: goalsData, error: goalsError } = await adminSupabase
      .from('metas')
      .select('*')
    
    if (goalsError) {
      console.error('Erro ao buscar metas:', goalsError)
    }

    let totalGoals = 0
    let goalsCompleted = 0
    let goalsInProgress = 0
    let totalGoalsValue = 0
    let totalGoalsCurrentValue = 0

    if (goalsData) {
      totalGoals = goalsData.length
      goalsData.forEach(goal => {
        const valor = Number(goal.valor) || 0
        const valorAtual = Number(goal.valor_atual) || 0
        totalGoalsValue += valor
        totalGoalsCurrentValue += valorAtual
        
        const progress = valor > 0 ? (valorAtual / valor) * 100 : 0
        if (progress >= 100) {
          goalsCompleted++
        } else {
          goalsInProgress++
        }
      })
    }

    // Usuários recentes
    const { data: recentUsersData, error: recentUsersError } = await adminSupabase
      .from('users_total')
      .select('id, nome, email, created_at')
      .order('created_at', { ascending: false })
      .limit(10)
    
    if (recentUsersError) {
      console.error('Erro ao buscar usuários recentes:', recentUsersError)
    }

    // Verificar se há erros de RLS
    const hasRlsErrors = totalUsersError || proUsersError || trialError || transactionsError || goalsError || recentUsersError
    
    // Log detalhado para debug
    console.log('🔍 Admin Stats Debug:', {
      totalUsersCount,
      proUsersCount: proUsersData?.length || 0,
      trialDataCount: trialData?.length || 0,
      transactionsCount: transactionsData?.length || 0,
      goalsCount: goalsData?.length || 0,
      recentUsersCount: recentUsersData?.length || 0,
      usingServiceRole: !!supabaseServiceRoleKey,
      hasServiceRoleKey: !!supabaseServiceRoleKey,
      errors: {
        totalUsersError: totalUsersError ? {
          message: totalUsersError.message,
          code: totalUsersError.code,
          details: totalUsersError.details,
          hint: totalUsersError.hint
        } : null,
        proUsersError: proUsersError ? {
          message: proUsersError.message,
          code: proUsersError.code,
          details: proUsersError.details,
          hint: proUsersError.hint
        } : null,
        trialError: trialError ? {
          message: trialError.message,
          code: trialError.code,
          details: trialError.details,
          hint: trialError.hint
        } : null,
        transactionsError: transactionsError ? {
          message: transactionsError.message,
          code: transactionsError.code
        } : null,
        goalsError: goalsError ? {
          message: goalsError.message,
          code: goalsError.code
        } : null,
        recentUsersError: recentUsersError ? {
          message: recentUsersError.message,
          code: recentUsersError.code
        } : null
      }
    })
    
    if (hasRlsErrors && !supabaseServiceRoleKey) {
      console.warn('⚠️ ATENÇÃO: Erros de RLS detectados. Para o painel admin funcionar corretamente, adicione VITE_SUPABASE_SERVICE_ROLE_KEY nas variáveis de ambiente da plataforma de deploy (Vercel, Netlify, etc.)')
    } else if (hasRlsErrors && supabaseServiceRoleKey) {
      console.warn('⚠️ ATENÇÃO: Service Role Key configurada mas ainda há erros. Verifique se a chave está correta e se tem permissões adequadas.')
    }

    return {
      totalUsers: totalUsersCount || 0,
      proUsers: proUsersData?.length || 0,
      trialActive,
      trialExpired,
      totalTransactions: transactionsData?.length || 0,
      totalIncome,
      totalExpenses,
      totalGoals,
      goalsCompleted,
      goalsInProgress,
      totalGoalsValue,
      totalGoalsCurrentValue,
      transactionsByMonth: transactionsByMonthArray,
      usersByPlan,
      transactionsByCategory: transactionsByCategoryArray,
      recentUsers: recentUsersData || []
    }
  }
}

export const adminService = new AdminService()

