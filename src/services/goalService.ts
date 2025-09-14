import { supabase } from '@/lib/supabase'
import type { Goal } from '@/lib/supabase'

export interface CreateGoalData {
  name: string
  target_amount: number
  current_amount?: number
  deadline?: string
}

export interface UpdateGoalData {
  name?: string
  target_amount?: number
  current_amount?: number
  deadline?: string
}

class GoalService {
  // Get all goals for the current user
  async getGoals(): Promise<Goal[]> {
    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching goals:', error)
      throw new Error('Failed to fetch goals')
    }

    return data || []
  }

  // Create a new goal
  async createGoal(goal: CreateGoalData): Promise<Goal> {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      throw new Error('User not authenticated')
    }

    const { data, error } = await supabase
      .from('goals')
      .insert({
        ...goal,
        user_id: user.id,
        current_amount: goal.current_amount || 0
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating goal:', error)
      throw new Error('Failed to create goal')
    }

    return data
  }

  // Update a goal
  async updateGoal(id: string, updates: UpdateGoalData): Promise<Goal> {
    const { data, error } = await supabase
      .from('goals')
      .update(updates)
      .eq('id', id)
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
    const { error } = await supabase
      .from('goals')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting goal:', error)
      throw new Error('Failed to delete goal')
    }
  }

  // Add amount to goal
  async addAmountToGoal(id: string, amount: number): Promise<Goal> {
    // First get the current goal
    const { data: goal, error: fetchError } = await supabase
      .from('goals')
      .select('current_amount')
      .eq('id', id)
      .single()

    if (fetchError) {
      console.error('Error fetching goal:', fetchError)
      throw new Error('Failed to fetch goal')
    }

    const newAmount = Number(goal.current_amount) + amount

    return this.updateGoal(id, { current_amount: newAmount })
  }

  // Remove amount from goal
  async removeAmountFromGoal(id: string, amount: number): Promise<Goal> {
    // First get the current goal
    const { data: goal, error: fetchError } = await supabase
      .from('goals')
      .select('current_amount')
      .eq('id', id)
      .single()

    if (fetchError) {
      console.error('Error fetching goal:', fetchError)
      throw new Error('Failed to fetch goal')
    }

    const newAmount = Math.max(0, Number(goal.current_amount) - amount)

    return this.updateGoal(id, { current_amount: newAmount })
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
}

export const goalService = new GoalService()
