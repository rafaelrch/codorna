import { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon, WalletIcon } from '@heroicons/react/24/outline';
import { useAnimatedValue } from '@/hooks/useAnimatedValue';

interface FinancialCardProps {
  title: string;
  value: string;
  type: 'income' | 'expense' | 'balance';
  loading?: boolean;
  className?: string;
}

const cardConfig = {
  income: {
    icon: ArrowTrendingUpIcon,
    iconColor: 'text-success',
    bgColor: 'bg-success-light',
  },
  expense: {
    icon: ArrowTrendingDownIcon,
    iconColor: 'text-destructive',
    bgColor: 'bg-destructive-light',
  },
  balance: {
    icon: WalletIcon,
    iconColor: 'text-muted-foreground',
    bgColor: 'bg-muted',
  },
};

export function FinancialCard({ title, value, type, loading = false, className }: FinancialCardProps) {
  const { icon: Icon, iconColor, bgColor } = cardConfig[type];

  // Extrair valor numérico da string (ex: "R$ 2.538,41" -> 2538.41)
  const extractNumber = (valueStr: string): number => {
    // Remove "R$", espaços e converte vírgula para ponto
    const cleaned = valueStr.replace(/R\$\s?/g, '').replace(/\./g, '').replace(',', '.');
    return parseFloat(cleaned) || 0;
  };

  // Formatar número para exibição
  const formatCurrency = (num: number): string => {
    return `R$ ${num.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const targetValue = extractNumber(value);
  const animatedValue = useAnimatedValue(targetValue, { duration: 1500, startDelay: 100 });
  const displayValue = loading ? value : formatCurrency(animatedValue);

  return (
    <Card className={cn("rounded-xl sm:rounded-2xl lg:rounded-3xl transition-all relative overflow-hidden", type === 'balance' && "bg-[#1f8150] shadow-[0_25px_20px_rgba(0,0,0,0.2)]", className)}>
      {type === 'balance' && (
        <div 
          className="absolute top-0 left-0 w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at top left, rgba(74, 222, 128, 0.5), rgba(31, 129, 80, 0.8) 50%, transparent 80%)'
          }}
        />
      )}
      <CardContent className={cn("p-4 sm:p-6 lg:p-8 relative min-h-[120px] sm:min-h-[10px]", type === 'balance' && "text-white")}>
        <div className="flex items-center justify-between h-full">
          <div className="space-y-1 flex-1 min-w-0">
            <p className={cn("text-base sm:text-base font-regular tracking-tighter", type === 'balance' ? "text-white/80" : "text-[#727272]")}>{title}</p>
            {loading ? (
              <Skeleton className={cn("h-10 sm:h-10 w-40 sm:w-40 mt-1", type === 'balance' && "bg-white/20")} />
            ) : (
              <p className={cn("text-3xl sm:text-3xl lg:text-4xl font-bold tracking-tighter break-words", type === 'balance' ? "text-white" : "text-card-foreground")}>{displayValue}</p>
            )}
          </div>
          <div className={cn("p-2 sm:p-2 rounded-lg flex-shrink-0 ml-2 self-center", type === 'balance' ? "bg-white/20" : bgColor)}>
            <Icon className={cn("h-7 w-7 sm:h-6 sm:w-6 lg:h-7 lg:w-7", type === 'balance' ? "text-white" : iconColor)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}