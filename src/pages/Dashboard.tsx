import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { FinancialCard } from '@/components/FinancialCard';
import { ExpenseChart } from '@/components/ExpenseChart';
import { FinancialGoals } from '@/components/FinancialGoals';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { transactionService } from '@/services/transactionService';
import { useToast } from '@/hooks/use-toast';

const timeframes = ['Semana', 'Mês', 'Ano'];

export default function Dashboard() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('Mês');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [stats, setStats] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Calculate date range based on selected timeframe
  const getDateRange = () => {
    const now = new Date(currentDate);
    let startDate, endDate;

    switch (selectedTimeframe) {
      case 'Semana':
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        startDate = startOfWeek.toISOString().split('T')[0];
        endDate = endOfWeek.toISOString().split('T')[0];
        break;
      case 'Ano':
        startDate = `${now.getFullYear()}-01-01`;
        endDate = `${now.getFullYear()}-12-31`;
        break;
      default: // Mês
        startDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
        endDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${lastDay}`;
        break;
    }

    return { startDate, endDate };
  };

  const loadStats = async () => {
    try {
      setLoading(true);
      const { startDate, endDate } = getDateRange();
      const data = await transactionService.getTransactionStats(startDate, endDate);
      setStats(data);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as estatísticas.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, [selectedTimeframe, currentDate]);

  const handleTimeframeChange = (timeframe: string) => {
    setSelectedTimeframe(timeframe);
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    
    switch (selectedTimeframe) {
      case 'Semana':
        newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
        break;
      case 'Ano':
        newDate.setFullYear(currentDate.getFullYear() + (direction === 'next' ? 1 : -1));
        break;
      default: // Mês
        newDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1));
        break;
    }
    
    setCurrentDate(newDate);
  };

  const getDisplayTitle = () => {
    switch (selectedTimeframe) {
      case 'Semana':
        return `Semana de ${currentDate.toLocaleDateString('pt-BR')}`;
      case 'Ano':
        return currentDate.getFullYear().toString();
      default: // Mês
        return currentDate.toLocaleDateString('pt-BR', { month: 'long' });
    }
  };

  const getDisplayDateRange = () => {
    const { startDate, endDate } = getDateRange();
    return {
      start: new Date(startDate).toLocaleDateString('pt-BR'),
      end: new Date(endDate).toLocaleDateString('pt-BR')
    };
  };

  const dateRange = getDisplayDateRange();

  return (
    <div className="min-h-screen bg-[#EBEBEB]">
      {/* PRIMEIRA DIVISÃO - Header Controls */}
      <div className="bg-[#EBEBEB]] px-6 py-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 max-w-7xl mx-auto">
          {/* Navigation com mês */}
          <div className="flex items-center gap-4">
            <SidebarTrigger className="lg:hidden" />
            <Button variant="ghost" size="sm" onClick={() => navigateDate('prev')}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-sm font-semibold text-gray-900">{getDisplayTitle()}</h1>
            <Button variant="ghost" size="sm" onClick={() => navigateDate('next')}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Timeframe selector - centralizado em mobile, alinhado à esquerda em desktop */}
          <div className="flex justify-center lg:justify-start">
            <div className="flex bg-[#D9D9D9] rounded-lg p-1">
              {timeframes.map((timeframe) => (
                <Button
                  key={timeframe}
                  variant="ghost"
                  size="sm"
                  className={`h-8 px-6 font-medium transition-all duration-200 ${
                    selectedTimeframe === timeframe 
                      ? "bg-[#F8F6F7] text-black hover:bg-[#F8F6F7] hover:text-black" 
                      : "text-gray-600 hover:text-gray-900 hover:bg-[#D9D9D9]"
                  }`}
                  onClick={() => handleTimeframeChange(timeframe)}
                >
                  {timeframe}
                </Button>
              ))}
            </div>
          </div>
            
          {/* Date range display */}
          <div className="flex items-center justify-center lg:justify-start gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <span className="text-gray-500">De</span>
              <div className="flex items-center gap-2 bg-[#F8F6F7] border rounded-lg px-3 py-2">
                <Calendar className="h-4 w-4 text-black" />
                <span className="font-medium text-black">{dateRange.start}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-gray-500">Até</span>
              <div className="flex items-center gap-2 bg-[#F8F6F7] border rounded-lg px-3 py-2">
                <Calendar className="h-4 w-4 text-black" />
                <span className="font-medium text-black">{dateRange.end}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SEGUNDA DIVISÃO - Dashboard Content */}
      <div className="px-9 py-9 mx-6 bg-white rounded-xl">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Dashboard Title */}
          <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>

          {/* Financial Cards - 3 cards com space-between */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FinancialCard
              title="Saldo"
              value={transactionService.formatCurrency(stats.balance)}
              type="balance"
              loading={loading}
            />
            <FinancialCard
              title="Entradas"
              value={transactionService.formatCurrency(stats.totalIncome)}
              type="income"
              loading={loading}
            />
            <FinancialCard
              title="Saídas"
              value={transactionService.formatCurrency(stats.totalExpense)}
              type="expense"
              loading={loading}
            />
          </div>

          {/* Chart and Category List Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Expense Chart */}
            <div className="lg:col-span-2">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Gastos por categoria</CardTitle>
                </CardHeader>
                <CardContent >
                  <ExpenseChart 
                    startDate={getDateRange().startDate} 
                    endDate={getDateRange().endDate} 
                  />
                </CardContent>
              </Card>
            </div>

            {/* Goals Section */}
            <div className="lg:col-span-1">
              <FinancialGoals />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}