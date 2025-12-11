import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { transactionService } from '@/services/transactionService';
import { useToast } from '@/hooks/use-toast';

interface ChartData {
  name: string;
  value: number;
  percentage: number;
  color: string;
}

// Cores específicas por categoria - Design System Codorna
const categoryColors: { [key: string]: string } = {
  'Casa': '#8B5CF6',
  'Mercado': '#10B981',
  'Farmácia': '#F59E0B',
  'Academia': '#EF4444',
  'Assinaturas': '#3B82F6',
  'Cartão': '#8B5CF6',
  'Transporte': '#06B6D4',
  'Educação': '#84CC16',
  'Lazer': '#F97316',
  'Contas Fixas': '#6B7280',
  'Impostos': '#DC2626',
  'Compra Online': '#7C3AED',
  'Shopping': '#EC4899',
  'Outros': '#9CA3AF',
};

// Cores fallback para categorias não mapeadas
const chartColors = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
  'hsl(var(--chart-6))',
  'hsl(var(--chart-7))',
];

function CustomTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-card p-3 border rounded-lg">
        <p className="font-medium">{data.name}</p>
        <p className="text-sm text-muted-foreground">
          R$ {data.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </p>
        <p className="text-sm text-muted-foreground">
          {data.percentage}%
        </p>
      </div>
    );
  }
  return null;
}

interface CategoryLegendProps {
  data: ChartData[];
  loading: boolean;
}

function CategoryLegend({ data, loading }: CategoryLegendProps) {
  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Skeleton className="w-3 h-3 rounded-full" />
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="text-right space-y-1">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-3 w-12" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        <p>Nenhuma transação de saída encontrada para este período.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2 max-h-80 overflow-y-auto pr-4 [scrollbar-color:theme(colors.gray.400)_transparent] [scrollbar-width:thin]">
      {data.map((entry) => (
        <div key={entry.name} className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className={`${entry.value === 0 ? 'text-muted-foreground/60' : 'text-muted-foreground'}`}>
              {entry.name}
            </span>
          </div>
          <div className="text-right">
            <div className={`font-medium ${entry.value === 0 ? 'text-muted-foreground/60' : ''}`}>
              R$ {entry.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <div className={`text-xs ${entry.value === 0 ? 'text-muted-foreground/40' : 'text-muted-foreground'}`}>
              {entry.percentage.toFixed(1)}%
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

interface ExpenseChartProps {
  startDate?: string;
  endDate?: string;
}

export function ExpenseChart({ startDate, endDate }: ExpenseChartProps) {
  const [data, setData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadExpenseData = async () => {
      try {
        setLoading(true);
        
        // Carregar todas as categorias de saída
        const expenseCategories = await transactionService.getExpenseCategories();
        
        // Carregar transações de saída
        const transactions = await transactionService.getTransactions({
          startDate,
          endDate,
          type: 'saida'
        });

        // Group by category and calculate totals
        const categoryTotals = transactions.reduce((acc, transaction) => {
          const categoryName = transaction.categoria || 'Outros';
          acc[categoryName] = (acc[categoryName] || 0) + Number(transaction.valor);
          return acc;
        }, {} as Record<string, number>);

        const totalAmount = Object.values(categoryTotals).reduce((sum, value) => sum + value, 0);

        // Criar dados para todas as categorias, incluindo as com valor zero
        const allCategoriesData: ChartData[] = expenseCategories.map((category, index) => {
          const value = categoryTotals[category.nome] || 0;
          return {
            name: category.nome,
            value,
            percentage: totalAmount > 0 ? (value / totalAmount) * 100 : 0,
            color: categoryColors[category.nome] || chartColors[index % chartColors.length]
          };
        });

        // Adicionar categoria "Outros" se houver transações sem categoria
        if (categoryTotals['Outros'] && categoryTotals['Outros'] > 0) {
          allCategoriesData.push({
            name: 'Outros',
            value: categoryTotals['Outros'],
            percentage: totalAmount > 0 ? (categoryTotals['Outros'] / totalAmount) * 100 : 0,
            color: categoryColors['Outros'] || chartColors[chartColors.length - 1]
          });
        }

        // Ordenar por valor (maior para menor) e manter todas as categorias
        const sortedData = allCategoriesData.sort((a, b) => b.value - a.value);

        setData(sortedData);
      } catch (error) {
        toast({
          title: "Erro",
          description: "Não foi possível carregar os dados do gráfico.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadExpenseData();
  }, [startDate, endDate, toast]);

  const totalAmount = data.reduce((sum, item) => sum + item.value, 0);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-80 flex items-center justify-center">
          <Skeleton className="w-60 h-60 rounded-full" />
        </div>
        <CategoryLegend data={[]} loading={true} />
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 ">
      {/* Chart Section */}
      <div className="flex-1">
        <div className="h-80 flex items-center justify-center ">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              {totalAmount > 0 && (
                <text
                  x="50%"
                  y="50%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-foreground text-xl font-bold"
                >
                  R$ {totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </text>
              )}
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Category List Section */}
      <div className="flex-1 lg:max-w-sm">
        <CategoryLegend data={data} loading={loading} />
      </div>
    </div>
  );
}