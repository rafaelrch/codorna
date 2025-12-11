import { useEffect, useMemo, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { PageHeader } from '@/components/PageHeader'
import { historyService, type HistoryEvent, type HistoryEventType } from '@/services/historyService'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import {
  ArrowDownCircleIcon,
  ArrowUpCircleIcon,
  ClockIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline'
import { ArrowDownCircle, ArrowUpCircle, Clock } from 'lucide-react'
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
    icon: ClockIcon,
    badgeVariant: 'outline',
    colorClass: 'text-foreground',
  },
  income: {
    label: 'Entradas',
    icon: ArrowDownCircleIcon,
    badgeVariant: 'default',
    colorClass: 'text-emerald-600',
  },
  expense: {
    label: 'Saídas',
    icon: ArrowUpCircleIcon,
    badgeVariant: 'destructive',
    colorClass: 'text-red-600',
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
  const day = date.getUTCDate()
  const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
  const month = monthNames[date.getUTCMonth()]
  const year = date.getUTCFullYear()
  return `${day} ${month} ${year}`
}

const getBadgeConfig = (type: HistoryEventType) => {
  switch (type) {
    case 'income':
      return {
        label: 'Entrada',
        icon: ArrowDownCircle,
        bgColor: 'bg-green-50',
        textColor: 'text-green-600',
        iconColor: 'text-green-600',
      }
    case 'expense':
      return {
        label: 'Saída',
        icon: ArrowUpCircle,
        bgColor: 'bg-red-50',
        textColor: 'text-red-600',
        iconColor: 'text-red-600',
      }
    default:
      return {
        label: 'Outro',
        icon: Clock,
        bgColor: 'bg-gray-50',
        textColor: 'text-gray-600',
        iconColor: 'text-gray-600',
      }
  }
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
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3 w-32" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-6 w-20 rounded-md" />
              </div>
              <Skeleton className="h-5 w-20" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  const renderEmptyState = () => (
    <Card className="shadow-sm">
      <CardContent className="p-10 text-center space-y-3 text-muted-foreground">
        <ClockIcon className="mx-auto h-10 w-10" />
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
        const badgeConfig = getBadgeConfig(event.type)
        const BadgeIcon = badgeConfig.icon
        const categoria = event.metadata?.categoria || ''

        return (
          <Card key={event.id} className="shadow-sm">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between gap-4">
                {/* Left side: Date, Title, Subtitle, Badge */}
                <div className="flex-1 min-w-0">
                  {/* Date with calendar icon */}
                  <div className="flex items-center gap-1.5 mb-2">
                    <CalendarIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                    <span className="text-xs sm:text-sm text-muted-foreground">
                      {formatDate(event.created_at)}
                    </span>
                  </div>
                  
                  {/* Title (description) */}
                  <h3 className="text-base sm:text-lg font-semibold text-foreground break-words mb-1">
                    {event.description}
                  </h3>
                  
                  {/* Subtitle (categoria) */}
                  {categoria && (
                    <p className="text-xs sm:text-sm text-muted-foreground break-words mb-2">
                      {categoria}
                    </p>
                  )}
                  
                  {/* Badge with icon */}
                  <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md ${badgeConfig.bgColor}`}>
                    <BadgeIcon className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${badgeConfig.iconColor}`} />
                    <span className={`text-xs sm:text-sm font-medium ${badgeConfig.textColor}`}>
                      {badgeConfig.label}
                    </span>
                  </div>
                </div>

                {/* Right side: Value */}
                {event.amount !== undefined && (
                  <div className="flex-shrink-0">
                    <span className="text-base sm:text-lg font-semibold text-foreground whitespace-nowrap">
                      {formatCurrency(event.amount)}
                    </span>
                  </div>
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

      <div className="px-4 sm:px-6 py-4 sm:py-6">
        <div className="max-w-5xl mx-auto space-y-4 sm:space-y-6">
          {/* Filters - Centered */}
          <div className="flex justify-center">
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as HistoryEventType | 'all')}>
              <TabsList className="inline-flex h-10 items-center justify-center rounded-full bg-[#e5e5e5] p-1 gap-0 w-full sm:w-auto">
                {(Object.keys(EVENT_TYPE_CONFIG) as Array<HistoryEventType | 'all'>).map((type) => {
                  const config = EVENT_TYPE_CONFIG[type]
                  const Icon = config.icon
                  return (
                    <TabsTrigger 
                      key={type} 
                      value={type} 
                      className="group inline-flex items-center justify-center gap-1.5 sm:gap-2 whitespace-nowrap rounded-full px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-[#1a1a1a] data-[state=active]:shadow-[0_1px_2px_rgba(0,0,0,0.1)] data-[state=inactive]:text-[#666666] data-[state=inactive]:bg-transparent hover:data-[state=inactive]:text-[#1a1a1a] focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 flex-1 sm:flex-none"
                    >
                      <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 stroke-current" />
                      <span>{config.label}</span>
                    </TabsTrigger>
                  )
                })}
              </TabsList>
              {(Object.keys(EVENT_TYPE_CONFIG) as Array<HistoryEventType | 'all'>).map((type) => (
                <TabsContent key={type} value={type} />
              ))}
            </Tabs>
          </div>

          {loading ? renderSkeleton() : filteredHistory.length === 0 ? renderEmptyState() : renderHistoryList()}
        </div>
      </div>
    </div>
  )
}






