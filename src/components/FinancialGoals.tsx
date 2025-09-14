import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Target, Plus, TrendingUp } from 'lucide-react';
import { goalService } from '@/services/goalService';
import { useToast } from '@/hooks/use-toast';
import type { Goal } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';

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
          const progress = goalService.calculateProgress(goal.current_amount, goal.target_amount);
          return progress < 100;
        });
        setGoals(activeGoals.slice(0, 3));
      } catch (error) {
        console.error('Erro ao carregar metas:', error);
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

  const formatCurrency = (amount: number) => {
    return `R$ ${amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
  };

  const calculateProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const handleViewAllGoals = () => {
    navigate('/goals');
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Target className="h-5 w-5" />
          Metas
        </CardTitle>
        <Button variant="outline" size="sm" onClick={handleViewAllGoals}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Meta
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          // Loading skeleton
          Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="space-y-2 p-4 border rounded-lg">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <div className="text-right space-y-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
              <div className="space-y-2">
                <Skeleton className="h-2 w-full" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          ))
        ) : goals.length === 0 ? (
          <div className="text-center py-8">
            <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">Nenhuma meta ativa</p>
            <Button onClick={handleViewAllGoals}>
              <Plus className="h-4 w-4 mr-2" />
              Criar nova meta
            </Button>
          </div>
        ) : (
          goals.map((goal) => {
            const progress = calculateProgress(goal.current_amount, goal.target_amount);
            const isCompleted = progress >= 100;
            
            return (
              <div key={goal.id} className="space-y-2 p-4 border rounded-lg hover:bg-muted/20 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h4 className="font-medium text-card-foreground">{goal.name}</h4>
                    <p className="text-sm text-muted-foreground">Meta financeira</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {formatCurrency(goal.current_amount)} / {formatCurrency(goal.target_amount)}
                    </p>
                    {goal.deadline && (
                      <p className="text-xs text-muted-foreground">
                        até {goalService.formatDateForDisplay(goal.deadline)}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Progress 
                    value={progress} 
                    className="h-2"
                  />
                  <div className="flex justify-between items-center">
                    <span className={`text-sm font-medium ${
                      isCompleted ? 'text-success' : 'text-muted-foreground'
                    }`}>
                      {progress.toFixed(0)}% concluída
                    </span>
                    {isCompleted && (
                      <div className="flex items-center gap-1 text-success text-sm">
                        <TrendingUp className="h-3 w-3" />
                        Meta atingida!
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
        
        {goals.length > 0 && (
          <Button 
            variant="ghost" 
            className="w-full" 
            onClick={handleViewAllGoals}
          >
            Ver todas as metas
          </Button>
        )}
      </CardContent>
    </Card>
  );
}