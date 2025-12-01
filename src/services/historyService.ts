import { supabase } from '@/lib/supabase'

export type HistoryEventType =
  | 'income'
  | 'expense'
  | 'goal_created'
  | 'goal_contribution'
  | 'goal_withdraw'

export interface HistoryEvent {
  id: string
  type: HistoryEventType
  title: string
  description: string
  amount?: number
  created_at: string
  metadata?: Record<string, any>
}

class HistoryService {
  async getHistory(): Promise<HistoryEvent[]> {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user || !user.email) {
      throw new Error('Usuário não autenticado')
    }

    const [transactionsResult, goalsResult] = await Promise.all([
      supabase
        .from('financeiro_registros')
        .select('id, tipo, valor, descricao, criado_em, categoria')
        .eq('email', user.email)
        .order('criado_em', { ascending: false }),
      supabase
        .from('metas')
        .select('id, nome, created_at, valor')
        .eq('email', user.email),
    ])

    const transactionsEvents: HistoryEvent[] = (transactionsResult.data || []).map((transaction) => {
      let type: HistoryEventType = transaction.tipo === 'entrada' ? 'income' : 'expense'
      let title = transaction.tipo === 'entrada' ? 'Entrada de dinheiro' : 'Saída de dinheiro'

      if (transaction.categoria === 'Metas') {
        if (transaction.tipo === 'saida') {
          type = 'goal_contribution'
          title = 'Aporte em meta'
        } else {
          type = 'goal_withdraw'
          title = 'Resgate de meta'
        }
      }

      return {
        id: `transaction-${transaction.id}`,
        type,
        title,
        description: transaction.descricao || 'Sem descrição',
        amount: Number(transaction.valor),
        created_at: transaction.criado_em,
        metadata: {
          categoria: transaction.categoria,
        },
      }
    })

    const goalEvents: HistoryEvent[] = (goalsResult.data || []).map((goal) => ({
      id: `goal-${goal.id}`,
      type: 'goal_created',
      title: 'Meta criada',
      description: `Meta "${goal.nome}" no valor de R$ ${Number(goal.valor).toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      amount: Number(goal.valor),
      created_at: goal.created_at,
      metadata: {
        goalId: goal.id,
        goalName: goal.nome,
      },
    }))

    return [...transactionsEvents, ...goalEvents].sort((a, b) => {
      const dateA = new Date(a.created_at).getTime()
      const dateB = new Date(b.created_at).getTime()
      return dateB - dateA
    })
  }
}

export const historyService = new HistoryService()






