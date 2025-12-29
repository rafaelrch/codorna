import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { transactionService } from '@/services/transactionService';
import { useToast } from '@/hooks/use-toast';

interface ChartData {
  name: string;
  value: number;
  percentage: number;
  color: string;
}

// Cores para métodos de pagamento
const methodColors: { [key: string]: string } = {
  'Débito': '#10B981', // Verde
  'Crédito': '#3B82F6', // Azul
  'Pix': '#8B5CF6', // Roxo
  'Dinheiro': '#22C55E', // Verde médio
  'Não informado': '#9CA3AF', // Cinza
};

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

interface PaymentMethodChartProps {
  startDate?: string;
  endDate?: string;
}

export function PaymentMethodChart({ startDate, endDate }: PaymentMethodChartProps) {
  const [data, setData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadPaymentMethodData = async () => {
      try {
        setLoading(true);
        
        // Buscar gastos agrupados por método de pagamento
        const methodTotals = await transactionService.getExpensesByPaymentMethod(startDate, endDate);

        const totalAmount = Object.values(methodTotals).reduce((sum, value) => sum + value, 0);

        // Criar dados para o gráfico (apenas métodos com valor > 0 ou todos se total for 0)
        const chartData: ChartData[] = Object.entries(methodTotals)
          .filter(([_, value]) => value > 0 || totalAmount === 0)
          .map(([method, value]) => ({
            name: method,
            value,
            percentage: totalAmount > 0 ? (value / totalAmount) * 100 : 0,
            color: methodColors[method] || '#9CA3AF'
          }))
          .sort((a, b) => b.value - a.value);

        setData(chartData);
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

    loadPaymentMethodData();
  }, [startDate, endDate, toast]);

  const totalAmount = data.reduce((sum, item) => sum + item.value, 0);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-80 flex items-center justify-center">
          <Skeleton className="w-60 h-60 rounded-full" />
        </div>
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Skeleton className="w-3 h-3 rounded-full" />
                <Skeleton className="h-4 w-20" />
              </div>
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>
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
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Chart Section */}
      <div className="flex-1 ">
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
      
      {/* Legend Section */}
      <div className="flex-1 lg:max-w-sm">
        <div className="space-y-2 max-h-80 overflow-y-auto pr-4 [scrollbar-color:theme(colors.gray.400)_transparent] [scrollbar-width:thin]">
          {data.map((entry) => (
            <div key={entry.name} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-muted-foreground">
                  {entry.name}
                </span>
              </div>
              <div className="text-right">
                <div className="font-medium">
                  R$ {entry.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <div className="text-xs text-muted-foreground">
                  {entry.percentage.toFixed(1)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}




