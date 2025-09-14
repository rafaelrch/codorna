import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Trash2 } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import AddTransactionDialog from '@/components/AddTransactionDialog';
import FilterDialog from '@/components/FilterDialog';
import { transactionService } from '@/services/transactionService';
import { Transaction } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

// Remove interface local, usar a do Supabase

// Remover dados mock - agora usaremos dados reais do Supabase

interface FilterState {
  type: string;
  category: string;
  minAmount: string;
  maxAmount: string;
}



export default function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('2025-09-01');
  const [endDate, setEndDate] = useState('2025-09-30');
  const [filters, setFilters] = useState<FilterState>({
    type: 'all',
    category: 'all',
    minAmount: '',
    maxAmount: '',
  });
  const { toast } = useToast();

  // Carregar transações do Supabase
  const loadTransactions = async () => {
    try {
      setLoading(true);
      
      // Buscar transações com filtros de data
      let data = await transactionService.getTransactions({
        startDate,
        endDate,
        category: filters.category === 'all' ? '' : filters.category,
        type: filters.type === 'all' ? undefined : filters.type as 'income' | 'expense' | undefined,
      });

      // Aplicar filtros de valor no frontend
      if (filters.minAmount || filters.maxAmount) {
        const minAmount = filters.minAmount ? parseFloat(filters.minAmount) : 0;
        const maxAmount = filters.maxAmount ? parseFloat(filters.maxAmount) : Infinity;
        
        data = data.filter(transaction => {
          const amount = transaction.amount;
          return amount >= minAmount && amount <= maxAmount;
        });
      }

      setTransactions(data);
    } catch (error) {
      console.error('Erro ao carregar transações:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as transações. Verifique sua conexão.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Carregar transações ao montar o componente
  useEffect(() => {
    loadTransactions();
  }, []);

  const handleTransactionAdded = () => {
    // Apenas recarregar as transações quando uma nova for adicionada
    loadTransactions();
  };

  const handleDeleteTransaction = async (transactionId: string, transactionName: string) => {
    try {
      await transactionService.deleteTransaction(transactionId);
      toast({
        title: "Sucesso",
        description: `Transação "${transactionName}" foi excluída com sucesso!`,
      });
      // Recarregar transações
      loadTransactions();
    } catch (error) {
      console.error('Erro ao excluir transação:', error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir a transação.",
        variant: "destructive",
      });
    }
  };

  const applyFilters = async (newFilters: FilterState) => {
    setFilters(newFilters);
    await loadTransactions();
  };


  const formatCurrency = (amount: number) => {
    return `R$ ${amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
  };

  return (
    <div className="min-h-screen bg-[#EBEBEB]">
      <PageHeader title="Lançamentos">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-10">
          <div className="flex flex-wrap items-center gap-4">
            <FilterDialog 
              onApplyFilters={applyFilters} 
              currentFilters={filters}
            />
            
            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
              <span>De</span>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  loadTransactions();
                }}
                className="w-36 h-8 bg-[#F8F6F7] rounded-lg text-black"
              />
              <span>Até</span>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  loadTransactions();
                }}
                className="w-36 h-8 bg-[#F8F6F7] rounded-lg text-black"
              />
            </div>
          </div>
          
          <AddTransactionDialog onAddTransaction={handleTransactionAdded} />
        </div>
      </PageHeader>
      
      <div className="px-6 py-6">
        <div className="max-w-7xl mx-auto space-y-6">

      {/* Transactions Table */}
      <Card className="rounded-xl overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-white ">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-black">
                    Data
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-black">
                    Descrição
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-black">
                    Categoria
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-black">
                    Entrada/Saída
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-black">
                    Valor
                  </th>

                </tr>
              </thead>
              <tbody className="divide-y bg-[#F8F6F7]">
                {loading ? (
                  // Skeleton loading state
                  Array.from({ length: 5 }).map((_, index) => (
                    <tr key={index} className="hover:bg-muted/20 transition-colors">
                      <td className="px-6 py-4">
                        <Skeleton className="h-4 w-20" />
                      </td>
                      <td className="px-6 py-4">
                        <Skeleton className="h-4 w-32" />
                      </td>
                      <td className="px-6 py-4">
                        <Skeleton className="h-4 w-24" />
                      </td>
                      <td className="px-6 py-4">
                        <Skeleton className="h-6 w-16 rounded-full" />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Skeleton className="h-4 w-20 ml-auto" />
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Skeleton className="h-8 w-8 rounded mx-auto" />
                      </td>
                    </tr>
                  ))
                ) : transactions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                      Nenhuma transação encontrada.
                    </td>
                  </tr>
                ) : (
                  transactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {transactionService.formatDateForDisplay(transaction.created_at)}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#878787]">
                        <div>
                          <div className="font-regular">{transaction.name}</div>
                          {transaction.description && (
                            <div className="text-xs text-[#878787]">{transaction.description}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#878787]">
                        {transaction.type === 'expense' 
                          ? transaction.category_output?.name 
                          : transaction.category_input?.name
                        }
                      </td>
                      <td className="px-6 py-4">
                        <Badge 
                          variant={transaction.type === 'expense' ? 'destructive' : 'default'}
                          className={
                            transaction.type === 'expense' 
                              ? 'bg-destructive-light text-destructive hover:bg-destructive-light'
                              : 'bg-success-light text-success hover:bg-success-light'
                          }
                        >
                          {transaction.type === 'expense' ? 'Saída' : 'Entrada'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-regular text-[#000000] tracking-tighter
">
                        {formatCurrency(transaction.amount)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir a transação "{transaction.name}"?
                                <br />
                                <strong>Esta ação não pode ser desfeita.</strong>
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteTransaction(transaction.id, transaction.name)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
        </div>
      </div>
    </div>
  );
}