import { supabase } from '@/lib/supabase'
import { createClient } from '@supabase/supabase-js'

// Criar cliente admin com service role key se disponível (bypassa RLS)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseServiceRoleKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY

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
    // Total de usuários
    const { count: totalUsersCount, error: totalUsersError } = await adminSupabase
      .from('users_total')
      .select('*', { count: 'exact', head: true })
    
    if (totalUsersError) {
      console.error('Erro ao buscar total de usuários:', totalUsersError)
    }

    // Usuários PRO (status APPROVED na usuario_compra)
    const { data: proUsersData, error: proUsersError } = await adminSupabase
      .from('usuario_compra')
      .select('id, status, auth_id')
      .eq('status', 'APPROVED')
    
    if (proUsersError) {
      console.error('Erro ao buscar usuários PRO:', proUsersError)
    }

    // Usuários com trial
    const { data: trialData, error: trialError } = await adminSupabase
      .from('users_trial')
      .select('id, trial_end_at')
    
    if (trialError) {
      console.error('Erro ao buscar dados de trial:', trialError)
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
    
    if (hasRlsErrors && !supabaseServiceRoleKey) {
      console.warn('⚠️ ATENÇÃO: Erros de RLS detectados. Para o painel admin funcionar corretamente, adicione VITE_SUPABASE_SERVICE_ROLE_KEY no arquivo .env')
      console.warn('Erros encontrados:', {
        totalUsersError: totalUsersError?.message,
        proUsersError: proUsersError?.message,
        trialError: trialError?.message,
        transactionsError: transactionsError?.message,
        goalsError: goalsError?.message,
        recentUsersError: recentUsersError?.message
      })
    }

    // Log dos dados para debug
    console.log('Admin Stats Debug:', {
      totalUsersCount,
      proUsersCount: proUsersData?.length || 0,
      trialDataCount: trialData?.length || 0,
      transactionsCount: transactionsData?.length || 0,
      goalsCount: goalsData?.length || 0,
      recentUsersCount: recentUsersData?.length || 0,
      usingServiceRole: !!supabaseServiceRoleKey,
      errors: {
        totalUsersError: totalUsersError?.message,
        proUsersError: proUsersError?.message,
        trialError: trialError?.message,
        transactionsError: transactionsError?.message,
        goalsError: goalsError?.message,
        recentUsersError: recentUsersError?.message
      }
    })

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

