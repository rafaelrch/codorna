import { supabase } from '@/lib/supabase'
import type { User as SupabaseUser } from '@supabase/supabase-js'

export interface CreateGoalData {
  nomeMeta: string  // nomeMeta na tabela
  valor: number
  valor_atual?: number
  prazo?: string
}

export interface UpdateGoalData {
  nomeMeta?: string  // nomeMeta na tabela
  valor?: number
  valor_atual?: number
  prazo?: string
}

export interface Goal {
  id: number  // int4 (primary key)
  user_id?: string  // uuid
  email: string
  telefone?: string
  nomeMeta: string  // nomeMeta na tabela
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

    // Buscar usando user_id (coluna correta da tabela)
    const { data, error } = await supabase
      .from('metas')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
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
      user_id: user.id,  // user_id é obrigatório na tabela
      email: user.email,
      telefone: userPhone,
      nomeMeta: goal.nomeMeta,  // nomeMeta na tabela
      valor: goal.valor,
      valor_atual: goal.valor_atual || 0,
      prazo: goal.prazo ? this.formatDateForStorage(goal.prazo) : null  // Converter para DD/MM/YYYY
    }

    const { data, error } = await supabase
      .from('metas')
      .insert(goalData)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create goal: ${error.message}`)
    }

    return data
  }

  // Update a goal
  async updateGoal(id: number, updates: UpdateGoalData): Promise<Goal> {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      throw new Error('User not authenticated')
    }

    const updateData: any = {
      nomeMeta: updates.nomeMeta,  // nomeMeta na tabela
      valor: updates.valor,
      valor_atual: updates.valor_atual,
      prazo: updates.prazo ? this.formatDateForStorage(updates.prazo) : updates.prazo  // Converter para DD/MM/YYYY se fornecido
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
      .eq('user_id', user.id)  // Filtrar por user_id
      .select()
      .single()

    if (error) {
      throw new Error('Failed to update goal')
    }

    return data
  }

  // Delete a goal
  async deleteGoal(id: number): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      throw new Error('User not authenticated')
    }

    // Primeiro, buscar o nome da meta para identificar os registros relacionados
    const { data: goal, error: fetchError } = await supabase
      .from('metas')
      .select('nomeMeta')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (fetchError) {
      throw new Error('Failed to fetch goal')
    }

    // Excluir todos os registros financeiros relacionados (aportes e resgates)
    const descricaoMeta = `Meta: ${goal.nomeMeta}`
    
    const { error: deleteRecordsError } = await supabase
      .from('financeiro_registros')
      .delete()
      .eq('user_id', user.id)
      .eq('descricao', descricaoMeta)
      .in('categoria', ['Aporte de meta', 'Resgate de meta'])

    // Log do erro mas continua com a exclusão da meta mesmo se falhar
    if (deleteRecordsError) {
      console.error('Erro ao excluir registros financeiros relacionados:', deleteRecordsError)
    }

    // Excluir a meta
    const { error } = await supabase
      .from('metas')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)  // Filtrar por user_id

    if (error) {
      throw new Error('Failed to delete goal')
    }
  }

  // Add amount to goal (without affecting balance)
  async addAmountToGoal(id: number, amount: number): Promise<Goal> {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      throw new Error('User not authenticated')
    }

    const { data: goal, error: fetchError } = await supabase
      .from('metas')
      .select('valor_atual, valor, nomeMeta')
      .eq('id', id)
      .eq('user_id', user.id)  // Filtrar por user_id
      .single()

    if (fetchError) {
      throw new Error('Failed to fetch goal')
    }

    const clampedAmount = Math.max(amount, 0)
    const targetRemaining = Math.max(goal.valor - goal.valor_atual, 0)
    const amountToAdd = Math.min(clampedAmount, targetRemaining)
    const newAmount = goal.valor_atual + amountToAdd

    if (amountToAdd <= 0) {
      return this.updateGoal(id, { valor_atual: goal.valor_atual })
    }

    // Registrar transação de aporte no histórico
    try {
      await this.recordGoalTransaction(user, amountToAdd, goal.nomeMeta, 'saida', 'aporte', 'Aporte de meta')
    } catch (error) {
      // Se falhar ao registrar transação, ainda atualiza a meta mas loga o erro
      console.error('Erro ao registrar transação de aporte:', error)
    }

    return this.updateGoal(id, { valor_atual: newAmount })
  }

  // Remove amount from goal (without affecting balance)
  async removeAmountFromGoal(id: number, amount: number): Promise<Goal> {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      throw new Error('User not authenticated')
    }

    const { data: goal, error: fetchError } = await supabase
      .from('metas')
      .select('valor_atual, nomeMeta')
      .eq('id', id)
      .eq('user_id', user.id)  // Filtrar por user_id
      .single()

    if (fetchError) {
      throw new Error('Failed to fetch goal')
    }

    const clampedAmount = Math.max(amount, 0)
    const amountToRemove = Math.min(clampedAmount, goal.valor_atual)
    const newAmount = goal.valor_atual - amountToRemove

    // Registrar transação de resgate no histórico
    if (amountToRemove > 0) {
      try {
        await this.recordGoalTransaction(user, amountToRemove, goal.nomeMeta, 'entrada', 'resgate', 'Resgate de meta')
      } catch (error) {
        // Se falhar ao registrar transação, ainda atualiza a meta mas loga o erro
        console.error('Erro ao registrar transação de resgate:', error)
      }
    }

    return this.updateGoal(id, { valor_atual: newAmount })
  }

  private async recordGoalTransaction(
    user: SupabaseUser, 
    amount: number, 
    goalName: string, 
    tipo: 'saida' | 'entrada',
    metodo: string,
    categoria: string
  ) {
    if (!user.email) {
      throw new Error('Usuário sem e-mail associado')
    }

    let userPhone = ''
    const { data: userData, error: userError } = await supabase
      .from('users_total')
      .select('telefone')
      .eq('id', user.id)
      .single()

    if (!userError && userData) {
      userPhone = userData.telefone || ''
    } else {
      userPhone = user.user_metadata?.phone || user.user_metadata?.telefone || ''
    }

    const now = new Date().toISOString()
    // Formatar descrição como "Meta: {nome da meta}"
    const descricao = `Meta: ${goalName}`

    const { error } = await supabase
      .from('financeiro_registros')
      .insert({
        data_hora: now,
        responsavel: userPhone,
        user_id: user.id,
        categoria: categoria,
        tipo: tipo,
        valor: amount,
        descricao: descricao,
        criado_em: now,
        email: user.email,
        metodo: metodo
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

  // Helper function to parse date from DD/MM/YYYY format or ISO format
  private parseDate(dateString: string): Date | null {
    if (!dateString) return null
    
    // Try to parse DD/MM/YYYY format first
    const ddmmyyyyMatch = dateString.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (ddmmyyyyMatch) {
      const [, day, month, year] = ddmmyyyyMatch;
      return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    }
    
    // Try to parse YYYY-MM-DD format (from input type="date")
    const yyyymmddMatch = dateString.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (yyyymmddMatch) {
      const [, year, month, day] = yyyymmddMatch;
      return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    }
    
    // Try to parse as ISO date
    const isoDate = new Date(dateString);
    if (!isNaN(isoDate.getTime())) {
      return isoDate;
    }
    
    return null;
  }

  // Convert date to DD/MM/YYYY format for storage
  formatDateForStorage(dateString: string): string {
    if (!dateString) return '';
    
    // If already in DD/MM/YYYY format, return as is
    const ddmmyyyyMatch = dateString.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (ddmmyyyyMatch) {
      return dateString;
    }
    
    // Parse the date and convert to DD/MM/YYYY
    const date = this.parseDate(dateString);
    if (!date) return dateString; // Return original if can't parse
    
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
  }

  // Check if goal is overdue
  isGoalOverdue(deadline: string): boolean {
    if (!deadline) return false
    const deadlineDate = this.parseDate(deadline);
    if (!deadlineDate) return false;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    deadlineDate.setHours(0, 0, 0, 0);
    
    return deadlineDate < today;
  }

  // Get days remaining for goal
  getDaysRemaining(deadline: string): number {
    if (!deadline) return 0
    const deadlineDate = this.parseDate(deadline);
    if (!deadlineDate) return 0;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    deadlineDate.setHours(0, 0, 0, 0);
    
    const diffTime = deadlineDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
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
    if (!dateString) return '';
    
    // If already in DD/MM/YYYY format, return as is
    const ddmmyyyyMatch = dateString.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (ddmmyyyyMatch) {
      return dateString;
    }
    
    // Try to parse and format as DD/MM/YYYY
    const date = this.parseDate(dateString);
    if (!date) return dateString; // Return original if can't parse
    
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
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