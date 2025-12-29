import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { AdjustmentsHorizontalIcon, PlusIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/outline';
import { goalService } from '@/services/goalService';
import { useToast } from '@/hooks/use-toast';
import type { Goal } from '@/services/goalService';
import { useNavigate } from 'react-router-dom';
import { useAnimatedValue } from '@/hooks/useAnimatedValue';

// Componente para cada meta individual com animação
function GoalCard({ goal, index }: { goal: Goal; index: number }) {
  const progress = Math.min((goal.valor_atual / goal.valor) * 100, 100);
  
  // Animar valor_atual e progress
  const animatedValue = useAnimatedValue(goal.valor_atual, { duration: 2000, startDelay: index * 100 });
  const animatedProgress = useAnimatedValue(progress, { duration: 2000, startDelay: index * 100 });

  const formatCurrency = (amount: number) => {
    return `R$ ${amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
  };

  // Formatar data no formato "Até 25 Dez 2025"
  const formatDateForGoal = (dateString: string): string => {
    if (!dateString) return '';
    
    // Se já está no formato DD/MM/YYYY, converter
    const dateMatch = dateString.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (dateMatch) {
      const [, day, month, year] = dateMatch;
      const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
      const monthIndex = parseInt(month) - 1;
      return `Até ${parseInt(day)} ${monthNames[monthIndex]} ${year}`;
    }
    
    // Se for formato YYYY-MM-DD
    const isoMatch = dateString.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (isoMatch) {
      const [, year, month, day] = isoMatch;
      const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
      const monthIndex = parseInt(month) - 1;
      return `Até ${parseInt(day)} ${monthNames[monthIndex]} ${year}`;
    }
    
    return dateString;
  };

  return (
    <div className="bg-white border rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-5">
      {/* Header com título e tag de data */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-0 mb-3 sm:mb-4">
        <div className="flex-1 min-w-0">
          {/* Título da meta */}
          <h4 className="text-base sm:text-lg lg:text-xl font-medium text-black break-words">{goal.nomeMeta}</h4>
          {/* Porcentagem de progresso */}
          <p className="text-xs sm:text-sm text-[#929292] font-regular">Progresso de {animatedProgress.toFixed(0)}%</p>
        </div>
        {/* Tag de data */}
        {goal.prazo && (
          <span className="px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-[#d6e7df]/30 text-[#218150] text-[10px] sm:text-xs font-medium whitespace-nowrap self-start sm:self-auto sm:ml-4">
            {formatDateForGoal(goal.prazo)}
          </span>
        )}
      </div>
      
      {/* Valores */}
      <div className="mb-3 sm:mb-4">
        <span className="text-lg sm:text-xl font-medium tracking-tight text-black break-words">{formatCurrency(animatedValue)}</span>
        <span className="text-xs sm:text-sm text-[#929292] tracking-tight ml-1">de {formatCurrency(goal.valor)}</span>
      </div>
      
      {/* Barra de progresso customizada */}
      <div className="relative h-3">
        {/* Fundo da barra */}
        <div className="absolute inset-0 h-2 w-full bg-gray-200 rounded-full"></div>
        {/* Barra preenchida - sem transição CSS para seguir a animação JavaScript */}
        <div 
          className="absolute inset-y-0 left-0 h-2 bg-[#2cbb7f] rounded-full"
          style={{ width: `${animatedProgress}%` }}
        ></div>
        {/* Thumb/Circle centralizado na posição do progresso */}
        {animatedProgress > 0 && (
          <div 
            className="absolute top-1/2 w-5 h-5 bg-[#343434] rounded-full flex items-center justify-center z-10"
            style={{ 
              left: `calc(${animatedProgress}% - 10px)`, 
              top: '50%',
              transform: 'translateY(-50%)'
            }}
          >
            <div className="w-2 h-2 bg-[#2cbb7f] rounded-full"></div>
          </div>
        )}
      </div>
    </div>
  );
}

export function FinancialGoals() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const loadGoals = async () => {
      try {
        setLoading(true);
        const data = await goalService.getGoals();
        // Filter active goals (not completed) and show only first 3 for dashboard
        const activeGoals = data.filter(goal => {
          const progress = goalService.calculateProgress(goal.valor_atual, goal.valor);
          return progress < 100;
        });
        setGoals(activeGoals.slice(0, 3));
      } catch (error) {
        toast({
          title: "Erro",
          description: "Não foi possível carregar as metas.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadGoals();
  }, [toast]);


  const handleViewAllGoals = () => {
    navigate('/goals');
  };

  return (
    <Card className="rounded-xl sm:rounded-2xl lg:rounded-3xl">
      <CardHeader className="items-start p-4 sm:p-6 pb-2 sm:pb-3">
        <CardTitle className="text-xl sm:text-xl font-semibold">Metas</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6">
        {loading ? (
          // Loading skeleton
          Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="bg-white border rounded-xl p-5">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <Skeleton className="h-6 w-32 mb-2" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-6 w-24 rounded-full ml-4" />
              </div>
              <div className="mb-4">
                <Skeleton className="h-6 w-32 inline-block" />
                <Skeleton className="h-4 w-24 inline-block ml-2" />
              </div>
              <Skeleton className="h-3 w-full rounded-full" />
            </div>
          ))
        ) : goals.length === 0 ? (
          <div className="text-center py-8">
            <AdjustmentsHorizontalIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">Nenhuma meta ativa</p>
            <Button onClick={handleViewAllGoals}>
              <PlusIcon className="h-4 w-4 mr-2" />
              Criar nova meta
            </Button>
          </div>
        ) : (
          goals.map((goal, index) => (
            <GoalCard key={goal.id} goal={goal} index={index} />
          ))
        )}
        
        {goals.length > 0 && (
          <div className="text-center pt-2">
            <button 
              onClick={handleViewAllGoals}
              className="text-sm text-gray-700 hover:text-gray-900 font-medium transition-colors"
            >
              Ver todas as metas
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}