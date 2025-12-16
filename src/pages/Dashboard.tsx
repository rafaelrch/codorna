import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FinancialCard } from '@/components/FinancialCard';
import { FinancialGoals } from '@/components/FinancialGoals';
import { CategoryPieChart } from '@/components/CategoryPieChart';
import { PaymentMethodAreaChart } from '@/components/PaymentMethodAreaChart';
import { TransactionTableCard } from '@/components/TransactionTableCard';
import { ChevronLeftIcon, ChevronRightIcon, CalendarIcon } from '@heroicons/react/24/outline';
import { transactionService } from '@/services/transactionService';
import { useToast } from '@/hooks/use-toast';
import { DatePicker } from '@/components/ui/date-picker';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useSidebar } from '@/components/ui/sidebar';
import { PanelLeft } from 'lucide-react';

const timeframes = ['Semana', 'Mês', 'Ano'];

// Função auxiliar para formatar data sem problemas de timezone
const formatDateLocal = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function Dashboard() {
  // Função para obter o primeiro dia do mês atual
  const getFirstDayOfMonth = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  };

  // Função para obter o dia atual
  const getToday = () => {
    return new Date();
  };

  const [selectedTimeframe, setSelectedTimeframe] = useState('Mês');
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Inicializar datas baseado no timeframe padrão (Mês)
  const initializeDates = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const lastDay = new Date(year, month + 1, 0).getDate();
    return {
      startDate: new Date(year, month, 1),
      endDate: new Date(year, month, lastDay)
    };
  };
  
  const initialDates = initializeDates();
  const [customStartDate, setCustomStartDate] = useState<Date | undefined>(initialDates.startDate);
  const [customEndDate, setCustomEndDate] = useState<Date | undefined>(initialDates.endDate);
  const [stats, setStats] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Calculate date range based on selected timeframe or custom dates
  const getDateRange = () => {
    // Se "Semana" estiver selecionado, sempre usar últimos 7 dias (ignorar datas customizadas)
    if (selectedTimeframe === 'Semana') {
      const now = new Date();
      const sevenDaysAgo = new Date(now);
      sevenDaysAgo.setDate(now.getDate() - 6); // 6 dias atrás + hoje = 7 dias
      
      return {
        startDate: formatDateLocal(sevenDaysAgo),
        endDate: formatDateLocal(now)
      };
    }

    // Se houver datas customizadas, usar elas (prioridade)
    if (customStartDate && customEndDate) {
      return {
        startDate: formatDateLocal(customStartDate),
        endDate: formatDateLocal(customEndDate)
      };
    }

    // Caso contrário, calcular baseado no timeframe e currentDate
    if (selectedTimeframe === 'Ano') {
      const year = currentDate.getFullYear();
      const startDate = `${year}-01-01`;
      const endDate = `${year}-12-31`;
      return { startDate, endDate };
    }

    if (selectedTimeframe === 'Mês') {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      const lastDay = new Date(year, month, 0).getDate();
      const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
      const endDate = `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
      return { startDate, endDate };
    }

    // Fallback: primeiro dia do mês atual até hoje
    const now = new Date();
    const startDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
    const endDate = formatDateLocal(now);

    return { startDate, endDate };
  };

  const loadStats = async () => {
    try {
      setLoading(true);
      const { startDate, endDate } = getDateRange();
      const data = await transactionService.getTransactionStats(startDate, endDate);
      setStats(data);
    } catch (error) {
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
  }, [selectedTimeframe, currentDate, customStartDate, customEndDate]);

  const handleTimeframeChange = (timeframe: string) => {
    setSelectedTimeframe(timeframe);
    
    if (timeframe === 'Semana') {
      // Para semana, não precisamos atualizar datas customizadas (serão ignoradas)
      return;
    }
    
    // Para Mês ou Ano, atualizar currentDate e limpar datas customizadas
    const now = new Date();
    setCurrentDate(now);
    
    if (timeframe === 'Ano') {
      // Para ano, definir primeiro e último dia do ano atual
      const year = now.getFullYear();
      setCustomStartDate(new Date(year, 0, 1));
      setCustomEndDate(new Date(year, 11, 31));
    } else if (timeframe === 'Mês') {
      // Para mês, definir primeiro e último dia do mês atual
      const year = now.getFullYear();
      const month = now.getMonth();
      const lastDay = new Date(year, month + 1, 0).getDate();
      setCustomStartDate(new Date(year, month, 1));
      setCustomEndDate(new Date(year, month, lastDay));
    }
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    
    switch (selectedTimeframe) {
      case 'Semana':
        newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
        break;
      case 'Ano':
        newDate.setFullYear(currentDate.getFullYear() + (direction === 'next' ? 1 : -1));
        // Atualizar datas customizadas para o novo ano
        const year = newDate.getFullYear();
        setCustomStartDate(new Date(year, 0, 1));
        setCustomEndDate(new Date(year, 11, 31));
        break;
      default: // Mês
        newDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1));
        // Atualizar datas customizadas para o novo mês
        const newYear = newDate.getFullYear();
        const newMonth = newDate.getMonth();
        const lastDay = new Date(newYear, newMonth + 1, 0).getDate();
        setCustomStartDate(new Date(newYear, newMonth, 1));
        setCustomEndDate(new Date(newYear, newMonth, lastDay));
        break;
    }
    
    setCurrentDate(newDate);
  };

  const getDisplayTitle = () => {
    switch (selectedTimeframe) {
      case 'Semana':
        return 'Últimos 7 dias';
      case 'Ano':
        return currentDate.getFullYear().toString();
      default: // Mês
        const monthName = currentDate.toLocaleDateString('pt-BR', { month: 'long' });
        return monthName.charAt(0).toUpperCase() + monthName.slice(1);
    }
  };

  // Função para formatar data sem problemas de timezone
  const formatDateForDisplay = (dateString: string): string => {
    // Extrair a data diretamente do timestamp sem conversão de timezone
    const dateMatch = dateString.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (dateMatch) {
      const [, year, month, day] = dateMatch;
      // Formatar como DD/MM/YYYY
      return `${day}/${month}/${year}`;
    }
    
    // Fallback para o método anterior se o formato não corresponder
    const date = new Date(dateString);
    // Usar UTC para evitar problemas de timezone
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = date.getUTCFullYear();
    return `${day}/${month}/${year}`;
  };

  // Função para converter string de data para Date object sem problemas de timezone
  const parseDateString = (dateString: string): Date => {
    const dateMatch = dateString.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (dateMatch) {
      const [, year, month, day] = dateMatch;
      // Criar data usando UTC para evitar problemas de timezone
      return new Date(Date.UTC(parseInt(year), parseInt(month) - 1, parseInt(day)));
    }
    return new Date(dateString);
  };

  const getDisplayDateRange = () => {
    const { startDate, endDate } = getDateRange();
    return {
      start: formatDateForDisplay(startDate),
      end: formatDateForDisplay(endDate),
      startDateObj: parseDateString(startDate),
      endDateObj: parseDateString(endDate)
    };
  };

  const dateRange = getDisplayDateRange();
  const chartDateRange = getDateRange();

  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <div className="flex flex-col min-h-screen bg-[#EBEBEB]">
      {/* PRIMEIRA DIVISÃO - Header Controls */}
      <div className="bg-[#EBEBEB] px-4 sm:px-6 py-3 sm:py-4 flex-shrink-0">
        <div className="flex flex-col gap-3 sm:gap-4 max-w-7xl mx-auto">
          {/* Navigation com mês e Timeframe selector - Mesma linha em mobile */}
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            {/* Sidebar toggle e navegação do mês */}
            <div className="flex items-center gap-1 sm:gap-4 flex-shrink-0">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleSidebar}
                      className="h-8 w-8 sm:h-9 sm:w-9 text-gray-900 hover:bg-gray-200 flex-shrink-0"
                    >
                      <PanelLeft className="h-4 w-4" />
                      <span className="sr-only">
                        {isCollapsed ? "Expandir sidebar" : "Colapsar sidebar"}
                      </span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    {isCollapsed ? "Expandir sidebar" : "Colapsar sidebar"}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              {selectedTimeframe !== 'Semana' && (
                <>
                  <Button variant="ghost" size="sm" onClick={() => navigateDate('prev')} className="h-8 w-8 p-0">
                    <ChevronLeftIcon className="h-4 w-4" />
                  </Button>
                  <h1 className="text-sm sm:text-base font-semibold text-gray-900 whitespace-nowrap">{getDisplayTitle()}</h1>
                  <Button variant="ghost" size="sm" onClick={() => navigateDate('next')} className="h-8 w-8 p-0">
                    <ChevronRightIcon className="h-4 w-4" />
                  </Button>
                </>
              )}
              {selectedTimeframe === 'Semana' && (
                <h1 className="text-sm sm:text-base font-semibold text-gray-900 whitespace-nowrap">{getDisplayTitle()}</h1>
              )}
            </div>
            
            {/* Timeframe selector - Na mesma linha em mobile */}
            <div className="flex justify-center sm:justify-start flex-shrink-0">
              <div className="flex bg-[#D9D9D9] rounded-lg p-1">
                {timeframes.map((timeframe) => (
                  <Button
                    key={timeframe}
                    variant="ghost"
                    size="sm"
                    className={`h-8 px-2 sm:px-6 text-xs sm:text-sm font-medium transition-all duration-200 ${
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
          </div>
          
          {/* Date range - Segunda linha em mobile */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
              
            {/* Date range display */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 flex-shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-gray-500 whitespace-nowrap">De</span>
                <DatePicker
                  date={customStartDate || dateRange.startDateObj}
                  onSelect={(date) => {
                    if (date) {
                      setCustomStartDate(date);
                    } else {
                      // Se limpar a data, recalcular baseado no timeframe
                      setCustomStartDate(undefined);
                      if (selectedTimeframe === 'Ano') {
                        const year = currentDate.getFullYear();
                        setCustomStartDate(new Date(year, 0, 1));
                      } else if (selectedTimeframe === 'Mês') {
                        const year = currentDate.getFullYear();
                        const month = currentDate.getMonth();
                        setCustomStartDate(new Date(year, month, 1));
                      }
                    }
                  }}
                  placeholder="Data inicial"
                  className="w-full sm:w-36"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-gray-500 whitespace-nowrap">Até</span>
                <DatePicker
                  date={customEndDate || dateRange.endDateObj}
                  onSelect={(date) => {
                    if (date) {
                      setCustomEndDate(date);
                    } else {
                      // Se limpar a data, recalcular baseado no timeframe
                      setCustomEndDate(undefined);
                      if (selectedTimeframe === 'Ano') {
                        const year = currentDate.getFullYear();
                        setCustomEndDate(new Date(year, 11, 31));
                      } else if (selectedTimeframe === 'Mês') {
                        const year = currentDate.getFullYear();
                        const month = currentDate.getMonth();
                        const lastDay = new Date(year, month + 1, 0).getDate();
                        setCustomEndDate(new Date(year, month, lastDay));
                      }
                    }
                  }}
                  placeholder="Data final"
                  className="w-full sm:w-36"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SEGUNDA DIVISÃO - Dashboard Content */}
      <div className="px-4 sm:px-6 lg:px-9 py-4 sm:py-6 lg:py-9 mx-2 sm:mx-4 lg:mx-6 bg-white rounded-lg sm:rounded-xl flex-1 mb-4 sm:mb-6">
        <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
          {/* Dashboard Title */}
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Dashboard</h2>

          {/* Financial Cards - 3 cards com space-between */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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

          {/* Chart and Goals Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Category Pie Chart */}
            <div className="lg:col-span-2">
              <CategoryPieChart 
                startDate={chartDateRange.startDate} 
                endDate={chartDateRange.endDate} 
              />
            </div>

            {/* Goals Section */}
            <div className="lg:col-span-1 space-y-4 sm:space-y-6">
              {/* Payment Method Chart */}
              <PaymentMethodAreaChart 
                startDate={chartDateRange.startDate} 
                endDate={chartDateRange.endDate} 
              />
            </div>
          </div>

          {/* Transactions list + Goals */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="lg:col-span-2">
              <TransactionTableCard 
                startDate={chartDateRange.startDate}
                endDate={chartDateRange.endDate}
              />
            </div>
            <div className="lg:col-span-1">
              <FinancialGoals />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}