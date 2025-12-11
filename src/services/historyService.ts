import { supabase } from '@/lib/supabase'

export type HistoryEventType =
  | 'income'
  | 'expense'

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

    const { data: transactionsData, error } = await supabase
      .from('financeiro_registros')
      .select('id, tipo, valor, descricao, criado_em, categoria')
      .eq('email', user.email)
      .neq('categoria', 'Metas') // Excluir transações relacionadas a metas
      .order('criado_em', { ascending: false })

    if (error) {
      throw new Error(`Failed to fetch transactions: ${error.message}`)
    }

    const transactionsEvents: HistoryEvent[] = (transactionsData || []).map((transaction) => {
      const type: HistoryEventType = transaction.tipo === 'entrada' ? 'income' : 'expense'
      const title = transaction.tipo === 'entrada' ? 'Entrada de dinheiro' : 'Saída de dinheiro'

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

    return transactionsEvents.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime()
      const dateB = new Date(b.created_at).getTime()
      return dateB - dateA
    })
  }
}

export const historyService = new HistoryService()






