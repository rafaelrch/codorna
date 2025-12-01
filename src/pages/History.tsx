import { useEffect, useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PageHeader } from '@/components/PageHeader'
import { historyService, type HistoryEvent, type HistoryEventType } from '@/services/historyService'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import {
  ArrowDownCircle,
  ArrowUpCircle,
  PiggyBank,
  Target,
  CalendarClock,
} from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface EventTypeConfig {
  label: string
  icon: React.ComponentType<{ className?: string }>
  badgeVariant: 'default' | 'secondary' | 'destructive' | 'outline'
  colorClass: string
}

const EVENT_TYPE_CONFIG: Record<HistoryEventType | 'all', EventTypeConfig> = {
  all: {
    label: 'Tudo',
    icon: CalendarClock,
    badgeVariant: 'outline',
    colorClass: 'text-foreground',
  },
  income: {
    label: 'Entradas',
    icon: ArrowDownCircle,
    badgeVariant: 'default',
    colorClass: 'text-emerald-600',
  },
  expense: {
    label: 'Saídas',
    icon: ArrowUpCircle,
    badgeVariant: 'destructive',
    colorClass: 'text-red-600',
  },
  goal_created: {
    label: 'Metas criadas',
    icon: Target,
    badgeVariant: 'secondary',
    colorClass: 'text-blue-600',
  },
  goal_contribution: {
    label: 'Aportes em metas',
    icon: PiggyBank,
    badgeVariant: 'default',
    colorClass: 'text-amber-600',
  },
  goal_withdraw: {
    label: 'Resgates de metas',
    icon: PiggyBank,
    badgeVariant: 'outline',
    colorClass: 'text-teal-600',
  },
}

const formatCurrency = (value?: number) => {
  if (value === undefined) return ''
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function History() {
  const [history, setHistory] = useState<HistoryEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<HistoryEventType | 'all'>('all')

  useEffect(() => {
    const loadHistory = async () => {
      try {
        setLoading(true)
        const data = await historyService.getHistory()
        setHistory(data)
      } catch (error) {
        console.error('Erro ao carregar histórico:', error)
      } finally {
        setLoading(false)
      }
    }

    loadHistory()
  }, [])

  const filteredHistory = useMemo(() => {
    if (activeTab === 'all') return history
    return history.filter((event) => event.type === activeTab)
  }, [history, activeTab])

  const renderSkeleton = () => (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, index) => (
        <Card key={index} className="shadow-sm">
          <CardContent className="p-6 space-y-3">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-4 w-1/3" />
          </CardContent>
        </Card>
      ))}
    </div>
  )

  const renderEmptyState = () => (
    <Card className="shadow-sm">
      <CardContent className="p-10 text-center space-y-3 text-muted-foreground">
        <CalendarClock className="mx-auto h-10 w-10" />
        <div className="text-lg font-medium">Nenhuma atividade encontrada</div>
        <p className="text-sm">
          As ações realizadas na plataforma aparecerão aqui em ordem cronológica.
        </p>
      </CardContent>
    </Card>
  )

  const renderHistoryList = () => (
    <div className="space-y-4">
      {filteredHistory.map((event) => {
        const config = EVENT_TYPE_CONFIG[event.type]
        const Icon = config.icon

        return (
          <Card key={event.id} className="shadow-sm">
            <CardContent className="p-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <span className={`p-2 rounded-full bg-muted ${config.colorClass}`}>
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm text-muted-foreground">{formatDate(event.created_at)}</p>
                    <h3 className="text-lg font-semibold text-foreground">{event.title}</h3>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground max-w-2xl">
                  {event.description}
                </p>
              </div>

              <div className="flex flex-col gap-2 items-start md:items-end">
                <Badge variant={config.badgeVariant}>{config.label}</Badge>
                {event.amount !== undefined && (
                  <span className="text-base font-semibold">
                    {formatCurrency(event.amount)}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )

  return (
    <div className="min-h-screen bg-[#EBEBEB]">
      <PageHeader title="Histórico" subtitle="Acompanhe todas as suas ações na plataforma" />

      <div className="px-6 py-6">
        <div className="max-w-5xl mx-auto space-y-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Filtrar atividades</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as HistoryEventType | 'all')}>
                <TabsList className="flex flex-wrap gap-2">
                  {(Object.keys(EVENT_TYPE_CONFIG) as Array<HistoryEventType | 'all'>).map((type) => {
                    const config = EVENT_TYPE_CONFIG[type]
                    const Icon = config.icon
                    return (
                      <TabsTrigger key={type} value={type} className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        {config.label}
                      </TabsTrigger>
                    )
                  })}
                </TabsList>
                {(Object.keys(EVENT_TYPE_CONFIG) as Array<HistoryEventType | 'all'>).map((type) => (
                  <TabsContent key={type} value={type} />
                ))}
              </Tabs>
            </CardContent>
          </Card>

          {loading ? renderSkeleton() : filteredHistory.length === 0 ? renderEmptyState() : renderHistoryList()}
        </div>
      </div>
    </div>
  )
}






