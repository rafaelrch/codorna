import { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';

interface FinancialCardProps {
  title: string;
  value: string;
  type: 'income' | 'expense' | 'balance';
  loading?: boolean;
  className?: string;
}

const cardConfig = {
  income: {
    icon: TrendingUp,
    iconColor: 'text-success',
    bgColor: 'bg-success-light',
  },
  expense: {
    icon: TrendingDown,
    iconColor: 'text-destructive',
    bgColor: 'bg-destructive-light',
  },
  balance: {
    icon: Wallet,
    iconColor: 'text-muted-foreground',
    bgColor: 'bg-muted',
  },
};

export function FinancialCard({ title, value, type, loading = false, className }: FinancialCardProps) {
  const { icon: Icon, iconColor, bgColor } = cardConfig[type];

  return (
    <Card className={cn("transition-all", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-md font-regular text-[#727272] tracking-tighter">{title}</p>
            {loading ? (
              <Skeleton className="h-8 w-32" />
            ) : (
              <p className="text-2xl font-bold text-card-foreground tracking-tighter">{value}</p>
            )}
          </div>
          <div className={cn("p-2 rounded-lg", bgColor)}>
            <Icon className={cn("h-5 w-5", iconColor)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}