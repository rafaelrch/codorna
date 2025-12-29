import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { PageHeader } from '@/components/PageHeader'
import AddGoalDialog from '@/components/AddGoalDialog'
import GoalCard from '@/components/GoalCard'
import { goalService } from '@/services/goalService'
import { useToast } from '@/hooks/use-toast'
import type { Goal } from '@/services/goalService'
import { AdjustmentsHorizontalIcon, ArrowTrendingUpIcon, CalendarIcon, CurrencyDollarIcon, TrophyIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline'

export default function Goals() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [loading, setLoading] = useState(true)
  const [showCompletedGoals, setShowCompletedGoals] = useState(false)
  const { toast } = useToast()

  const loadGoals = async () => {
    try {
      setLoading(true)
      const data = await goalService.getGoals()
      setGoals(data)
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar as metas.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadGoals()
  }, [])

  const handleGoalUpdate = () => {
    loadGoals()
  }

  const handleGoalDelete = () => {
    loadGoals()
  }

  // Separate active and completed goals
  const activeGoals = goals.filter(goal => {
    const progress = goalService.calculateProgress(goal.valor_atual, goal.valor)
    return progress < 100
  })

  const completedGoals = goals.filter(goal => {
    const progress = goalService.calculateProgress(goal.valor_atual, goal.valor)
    return progress >= 100
  })

  // Calculate statistics
  const stats = goals.reduce((acc, goal) => {
    const progress = goalService.calculateProgress(goal.valor_atual, goal.valor)
    const isCompleted = goalService.isGoalCompleted(goal.valor_atual, goal.valor)
    const isOverdue = goal.prazo ? goalService.isGoalOverdue(goal.prazo) : false

    acc.totalGoals++
    acc.totalTarget += goal.valor
    acc.totalCurrent += goal.valor_atual
    
    if (isCompleted) acc.completedGoals++
    if (isOverdue) acc.overdueGoals++

    return acc
  }, {
    totalGoals: 0,
    completedGoals: 0,
    overdueGoals: 0,
    totalTarget: 0,
    totalCurrent: 0,
  })

  const overallProgress = stats.totalTarget > 0 ? (stats.totalCurrent / stats.totalTarget) * 100 : 0

  return (
    <div className="min-h-screen bg-[#EBEBEB]">
      <PageHeader title="Metas">
        <AddGoalDialog onAddGoal={handleGoalUpdate} />
      </PageHeader>
      
      <div className="px-4 sm:px-6 py-4 sm:py-6">
        <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">


      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Metas</CardTitle>
            <AdjustmentsHorizontalIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalGoals}</div>
            <p className="text-xs text-muted-foreground">
              {stats.completedGoals} concluídas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progresso Geral</CardTitle>
            <ArrowTrendingUpIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallProgress.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              de todas as metas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Economizado</CardTitle>
            <CurrencyDollarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {goalService.formatCurrency(stats.totalCurrent)}
            </div>
            <p className="text-xs text-muted-foreground">
              de {goalService.formatCurrency(stats.totalTarget)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Metas Concluídas</CardTitle>
            <TrophyIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{completedGoals.length}</div>
            <p className="text-xs text-muted-foreground">
              objetivos alcançados
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Active Goals Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Metas Ativas</h2>
          <span className="text-sm text-muted-foreground">
            {activeGoals.length} {activeGoals.length === 1 ? 'meta' : 'metas'}
          </span>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <Card key={index}>
                <CardHeader>
                  <Skeleton className="h-5 sm:h-6 w-3/4" />
                  <Skeleton className="h-3 sm:h-4 w-1/2" />
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4">
                  <div className="space-y-2">
                    <Skeleton className="h-3 sm:h-4 w-full" />
                    <Skeleton className="h-2 w-full" />
                    <div className="flex justify-between">
                      <Skeleton className="h-3 sm:h-4 w-16 sm:w-20" />
                      <Skeleton className="h-3 sm:h-4 w-16 sm:w-20" />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Skeleton className="h-7 sm:h-8 flex-1" />
                    <Skeleton className="h-7 sm:h-8 flex-1" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : activeGoals.length === 0 ? (
          <Card className="text-center py-8 sm:py-12">
            <CardHeader>
              <AdjustmentsHorizontalIcon className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mx-auto mb-3 sm:mb-4" />
              <CardTitle className="text-lg sm:text-xl">
                {goals.length === 0 ? 'Nenhuma meta encontrada' : 'Todas as metas foram concluídas!'}
              </CardTitle>
              <CardDescription className="text-sm sm:text-base">
                {goals.length === 0 
                  ? 'Crie sua primeira meta financeira para começar a economizar'
                  : 'Parabéns! Crie novas metas para continuar crescendo financeiramente'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AddGoalDialog onAddGoal={handleGoalUpdate} />
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {activeGoals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onUpdate={handleGoalUpdate}
                onDelete={handleGoalDelete}
              />
            ))}
          </div>
        )}
      </div>

      {/* Completed Goals Section */}
      {completedGoals.length > 0 && (
        <div className="space-y-4">
          <Button
            variant="ghost"
            onClick={() => setShowCompletedGoals(!showCompletedGoals)}
            className="flex items-center gap-2 text-lg font-semibold p-0 h-auto hover:bg-transparent"
          >
            <TrophyIcon className="h-5 w-5 text-green-600" />
            Metas Concluídas ({completedGoals.length})
            {showCompletedGoals ? (
              <ChevronUpIcon className="h-4 w-4" />
            ) : (
              <ChevronDownIcon className="h-4 w-4" />
            )}
          </Button>
          
          {showCompletedGoals && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {completedGoals.map((goal) => (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  onUpdate={handleGoalUpdate}
                  onDelete={handleGoalDelete}
                />
              ))}
            </div>
          )}
        </div>
      )}
        </div>
      </div>
    </div>
  )
}