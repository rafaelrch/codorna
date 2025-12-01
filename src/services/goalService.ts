import { supabase } from '@/lib/supabase'
import type { User as SupabaseUser } from '@supabase/supabase-js'

export interface CreateGoalData {
  nome: string
  valor: number
  valor_atual?: number
  prazo?: string
}

export interface UpdateGoalData {
  nome?: string
  valor?: number
  valor_atual?: number
  prazo?: string
}

export interface Goal {
  id: string  // uuid
  email: string
  telefone?: string
  nome: string
  valor: number
  valor_atual: number
  prazo?: string  // date
  created_at: string  // timestamptz
  updated_at: string  // timestamptz
}

class GoalService {
  // Get all goals for the current user from metas table
  async getGoals(): Promise<Goal[]> {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      throw new Error('User not authenticated')
    }

    const { data, error } = await supabase
      .from('metas')
      .select('*')
      .eq('email', user.email)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching goals:', error)
      throw new Error(`Failed to fetch goals: ${error.message}`)
    }

    return data || []
  }

  // Create a new goal in metas table
  async createGoal(goal: CreateGoalData): Promise<Goal> {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      throw new Error('User not authenticated')
    }

    // Obter telefone do usuário dos metadados de autenticação
    let userPhone = user.user_metadata?.phone || user.user_metadata?.telefone || ''

    const goalData = {
      email: user.email,
      telefone: userPhone,
      nome: goal.nome,
      valor: goal.valor,
      valor_atual: goal.valor_atual || 0,
      prazo: goal.prazo || null
    }

    const { data, error } = await supabase
      .from('metas')
      .insert(goalData)
      .select()
      .single()

    if (error) {
      console.error('Error creating goal:', error)
      console.error('Goal data that failed:', goalData)
      throw new Error(`Failed to create goal: ${error.message}`)
    }

    return data
  }

  // Update a goal
  async updateGoal(id: string, updates: UpdateGoalData): Promise<Goal> {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      throw new Error('User not authenticated')
    }

    const updateData: any = {
      nome: updates.nome,
      valor: updates.valor,
      valor_atual: updates.valor_atual,
      prazo: updates.prazo
    }

    // Remove undefined values
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key]
      }
    })

    const { data, error } = await supabase
      .from('metas')
      .update(updateData)
      .eq('id', id)
      .eq('email', user.email)
      .select()
      .single()

    if (error) {
      console.error('Error updating goal:', error)
      throw new Error('Failed to update goal')
    }

    return data
  }

  // Delete a goal
  async deleteGoal(id: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      throw new Error('User not authenticated')
    }

    const { error } = await supabase
      .from('metas')
      .delete()
      .eq('id', id)
      .eq('email', user.email)

    if (error) {
      console.error('Error deleting goal:', error)
      throw new Error('Failed to delete goal')
    }
  }

  // Add amount to goal (also registers deduction from balance)
  async addAmountToGoal(id: string, amount: number): Promise<Goal> {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      throw new Error('User not authenticated')
    }

    const { data: goal, error: fetchError } = await supabase
      .from('metas')
      .select('valor_atual, valor, nome')
      .eq('id', id)
      .eq('email', user.email)
      .single()

    if (fetchError) {
      console.error('Error fetching goal:', fetchError)
      throw new Error('Failed to fetch goal')
    }

    const clampedAmount = Math.max(amount, 0)
    const targetRemaining = Math.max(goal.valor - goal.valor_atual, 0)
    const amountToAdd = Math.min(clampedAmount, targetRemaining)
    const newAmount = goal.valor_atual + amountToAdd

    if (amountToAdd <= 0) {
      return this.updateGoal(id, { valor_atual: goal.valor_atual })
    }

    const updatedGoal = await this.updateGoal(id, { valor_atual: newAmount })

    try {
      await this.recordGoalTransaction(user, amountToAdd, goal.nome, 'saida')
    } catch (transactionError) {
      console.error('Error registering goal deduction:', transactionError)
      // Attempt to revert goal update to previous value
      try {
        await this.updateGoal(id, { valor_atual: goal.valor_atual })
      } catch (rollbackError) {
        console.error('Failed to rollback goal value after transaction error:', rollbackError)
      }
      throw new Error('Não foi possível registrar a movimentação financeira da meta.')
    }

    return updatedGoal
  }

  // Remove amount from goal (credits balance back)
  async removeAmountFromGoal(id: string, amount: number): Promise<Goal> {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      throw new Error('User not authenticated')
    }

    const { data: goal, error: fetchError } = await supabase
      .from('metas')
      .select('valor_atual, nome')
      .eq('id', id)
      .eq('email', user.email)
      .single()

    if (fetchError) {
      console.error('Error fetching goal:', fetchError)
      throw new Error('Failed to fetch goal')
    }

    const clampedAmount = Math.max(amount, 0)
    const amountToRemove = Math.min(clampedAmount, goal.valor_atual)
    const newAmount = goal.valor_atual - amountToRemove

    const updatedGoal = await this.updateGoal(id, { valor_atual: newAmount })

    if (amountToRemove > 0) {
      try {
        await this.recordGoalTransaction(user, amountToRemove, goal.nome, 'entrada')
      } catch (transactionError) {
        console.error('Error registering goal refund:', transactionError)
        // Attempt to rollback goal value
        try {
          await this.updateGoal(id, { valor_atual: goal.valor_atual })
        } catch (rollbackError) {
          console.error('Failed to rollback goal after refund error:', rollbackError)
        }
        throw new Error('Não foi possível registrar a movimentação financeira da meta.')
      }
    }

    return updatedGoal
  }

  private async recordGoalTransaction(user: SupabaseUser, amount: number, goalName: string, tipo: 'saida' | 'entrada') {
    if (!user.email) {
      throw new Error('Usuário sem e-mail associado')
    }

    let userPhone = ''
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('phone')
      .eq('id', user.id)
      .single()

    if (!userError && userData) {
      userPhone = userData.phone || ''
    } else {
      userPhone = user.user_metadata?.phone || user.user_metadata?.telefone || ''
    }

    const now = new Date().toISOString()
    const descricao = tipo === 'saida'
      ? `Reserva para meta: ${goalName}`
      : `Resgate da meta: ${goalName}`

    const { error } = await supabase
      .from('financeiro_registros')
      .insert({
        data_hora: now,
        responsavel: userPhone,
        categoria: 'Metas',
        tipo,
        valor: amount,
        descricao,
        criado_em: now,
        email: user.email
      })

    if (error) {
      throw error
    }
  }

  // Calculate goal progress percentage
  calculateProgress(current: number, target: number): number {
    if (target <= 0) return 0
    return Math.min(100, (current / target) * 100)
  }

  // Check if goal is completed
  isGoalCompleted(current: number, target: number): boolean {
    return current >= target
  }

  // Check if goal is overdue
  isGoalOverdue(deadline: string): boolean {
    if (!deadline) return false
    return new Date(deadline) < new Date()
  }

  // Get days remaining for goal
  getDaysRemaining(deadline: string): number {
    if (!deadline) return 0
    const today = new Date()
    const deadlineDate = new Date(deadline)
    const diffTime = deadlineDate.getTime() - today.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  // Format currency
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount)
  }

  // Format date for display
  formatDateForDisplay(dateString: string): string {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  // Get goal statistics
  async getGoalStats(): Promise<{
    totalGoals: number
    completedGoals: number
    totalTargetAmount: number
    totalCurrentAmount: number
    averageProgress: number
  }> {
    const goals = await this.getGoals()
    
    const totalGoals = goals.length
    const completedGoals = goals.filter(goal => this.isGoalCompleted(goal.valor_atual, goal.valor)).length
    const totalTargetAmount = goals.reduce((sum, goal) => sum + goal.valor, 0)
    const totalCurrentAmount = goals.reduce((sum, goal) => sum + goal.valor_atual, 0)
    const averageProgress = totalGoals > 0 ? goals.reduce((sum, goal) => sum + this.calculateProgress(goal.valor_atual, goal.valor), 0) / totalGoals : 0

    return {
      totalGoals,
      completedGoals,
      totalTargetAmount,
      totalCurrentAmount,
      averageProgress
    }
  }
}

export const goalService = new GoalService()