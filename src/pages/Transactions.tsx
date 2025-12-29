import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
import { PageHeader } from '@/components/PageHeader';
import { transactionService, Transaction } from '@/services/transactionService';
import { useToast } from '@/hooks/use-toast';
import { DatePicker } from '@/components/ui/date-picker';


export default function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [addTransactionOpen, setAddTransactionOpen] = useState(false);
  const [categories, setCategories] = useState<{id: number, nome: string, tipo: 'saida' | 'entrada'}[]>([]);
  const formatDateLocal = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  const today = formatDateLocal(new Date());
  const [formData, setFormData] = useState({
    descricao: '',
    tipo: 'saida' as 'entrada' | 'saida',
    categoria: '',
    data: today,
    valor: '',
    metodo: '' as 'Débito' | 'Crédito' | 'Pix' | 'Dinheiro' | ''
  });
  // Definir datas padrão (sem filtro por padrão para mostrar todos os registros)
  const getDefaultDates = () => {
    return {
      start: '', // Sem filtro de data inicial
      end: '' // Sem filtro de data final
    };
  };

  const defaultDates = getDefaultDates();
  const [startDate, setStartDate] = useState(defaultDates.start);
  const [endDate, setEndDate] = useState(defaultDates.end);
  const [startDatePicker, setStartDatePicker] = useState<Date | undefined>(undefined);
  const [endDatePicker, setEndDatePicker] = useState<Date | undefined>(undefined);
  const [formDate, setFormDate] = useState<Date | undefined>(new Date());
  const [typeFilter, setTypeFilter] = useState<'entrada' | 'saida' | 'all'>('all');
  const { toast } = useToast();

  // Carregar transações do Supabase
  const loadTransactions = async () => {
    try {
      setLoading(true);
      // Buscar transações com filtros de data e tipo
      const data = await transactionService.getTransactions({
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        category: '',
        type: typeFilter !== 'all' ? typeFilter : undefined,
      });

      setTransactions(data);
    } catch (error) {
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

  // Carregar categorias
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await transactionService.getAllCategories();
        setCategories(data);
      } catch (error) {
      }
    };
    loadCategories();
  }, []);

  // Recarregar transações quando as datas ou o filtro de tipo mudarem
  useEffect(() => {
    loadTransactions();
  }, [startDate, endDate, typeFilter]);

  // Handler para quando o Dialog abrir/fechar
  const handleDialogOpenChange = (open: boolean) => {
    setAddTransactionOpen(open);
    
    // Quando abrir o popup, resetar o formulário com a data atual
    if (open) {
      const currentDate = new Date();
      const currentDateString = formatDateLocal(currentDate);
      
      setFormData({
        descricao: '',
        tipo: 'saida',
        categoria: '',
        data: currentDateString,
        valor: '',
        metodo: '' as ''
      });
      
      setFormDate(currentDate);
    }
  };

  // Sempre que abrir o modal, garantir que a data atual está pré-selecionada
  useEffect(() => {
    if (addTransactionOpen) {
      const currentDate = new Date();
      const currentDateString = formatDateLocal(currentDate);
      
      // Atualizar formData com a data atual se não estiver definida ou se for diferente
      if (formData.data !== currentDateString) {
        setFormData(prev => ({
          ...prev,
          data: currentDateString
        }));
      }
      
      // Atualizar formDate com a data atual
      setFormDate(currentDate);
    }
  }, [addTransactionOpen]);


  const handleDeleteTransaction = async (transactionId: number, transactionDetails: string) => {
    try {
      await transactionService.deleteTransaction(transactionId);
      toast({
        title: "Sucesso",
        description: `Transação "${transactionDetails}" foi excluída com sucesso!`,
      });
      // Recarregar transações
      loadTransactions();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível excluir a transação.",
        variant: "destructive",
      });
    }
  };


  const formatCurrency = (amount: number) => {
    return `R$ ${amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
  };

  const handleAddTransaction = async () => {
    if (!formData.descricao.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, preencha a descrição da transação.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.categoria) {
      toast({
        title: "Erro",
        description: "Por favor, selecione uma categoria.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.valor || parseFloat(formData.valor) <= 0) {
      toast({
        title: "Erro",
        description: "Por favor, insira um valor válido maior que zero.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.metodo) {
      toast({
        title: "Erro",
        description: "Por favor, selecione um método de pagamento.",
        variant: "destructive",
      });
      return;
    }

    try {
      const transactionData = {
        descricao: formData.descricao.trim(),
        tipo: formData.tipo,
        categoria: formData.categoria,
        data: formData.data,
        valor: parseFloat(formData.valor),
        metodo: formData.metodo
      };

      await transactionService.createTransaction(transactionData);
      
      toast({
        title: "Sucesso",
        description: "Transação adicionada com sucesso!",
      });
      
      // Reset form
      setFormData({
        descricao: '',
        tipo: 'saida',
        categoria: '',
        data: today,
        valor: '',
        metodo: '' as ''
      });
      setFormDate(new Date());

      setAddTransactionOpen(false);
      loadTransactions(); // Recarregar transações
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível adicionar a transação.",
        variant: "destructive",
      });
    }
  };

  const normalizeType = (value: string) =>
    value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();

  const getFilteredCategories = (tipo: 'entrada' | 'saida') => {
    const normalizedTipo = normalizeType(tipo);
    return categories.filter(cat => normalizeType(cat.tipo) === normalizedTipo);
  };

  // Verificar se há filtros ativos
  const hasActiveFilters = startDate || endDate || typeFilter !== 'all';

  // Função para limpar filtros
  const clearFilters = () => {
    setStartDate('');
    setEndDate('');
    setStartDatePicker(undefined);
    setEndDatePicker(undefined);
    setTypeFilter('all');
  };

  return (
    <div className="min-h-screen bg-[#EBEBEB]">
      <PageHeader title="Transações">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <span className="text-gray-500 whitespace-nowrap text-xs sm:text-sm">De:</span>
              <DatePicker
                date={startDatePicker}
                onSelect={(date) => {
                  setStartDatePicker(date);
                  setStartDate(date ? date.toISOString().split('T')[0] : '');
                }}
                placeholder="Data inicial"
                className="w-full sm:w-36"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-500 whitespace-nowrap text-xs sm:text-sm">Até:</span>
              <DatePicker
                date={endDatePicker}
                onSelect={(date) => {
                  setEndDatePicker(date);
                  setEndDate(date ? date.toISOString().split('T')[0] : '');
                }}
                placeholder="Data final"
                className="w-full sm:w-36"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-500 whitespace-nowrap text-xs sm:text-sm">Tipo:</span>
              <Select
                value={typeFilter}
                onValueChange={(value: 'entrada' | 'saida' | 'all') => setTypeFilter(value)}
              >
                <SelectTrigger className="w-full sm:w-36">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="entrada">Entrada</SelectItem>
                  <SelectItem value="saida">Saída</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {hasActiveFilters && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={clearFilters}
              className="h-8 sm:h-9 text-xs sm:text-sm"
            >
              Limpar filtros
            </Button>
          )}
          <Dialog open={addTransactionOpen} onOpenChange={handleDialogOpenChange}>
            <DialogTrigger asChild>
              <Button className="bg-[#1f8150] px-4 sm:px-6 rounded-lg text-white hover:bg-[#1a6b42] h-8 sm:h-9 text-xs sm:text-sm">
                <PlusIcon className="h-4 w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Fazer lançamento</span>
                <span className="sm:hidden">Novo</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-lg sm:text-xl">Nova Transação</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Descrição</label>
                  <Input
                    placeholder="Ex: Compra no mercado"
                    value={formData.descricao}
                    onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Tipo</label>
                  <Select 
                    value={formData.tipo} 
                    onValueChange={(value: 'entrada' | 'saida') => {
                      setFormData({...formData, tipo: value, categoria: ''});
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="saida">Saída</SelectItem>
                      <SelectItem value="entrada">Entrada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Categoria</label>
                  <Select 
                    value={formData.categoria} 
                    onValueChange={(value) => setFormData({...formData, categoria: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {getFilteredCategories(formData.tipo).map((category) => (
                        <SelectItem key={category.id} value={category.nome}>
                          {category.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Data</label>
                  <DatePicker
                    date={formDate}
                    onSelect={(date) => {
                      setFormDate(date);
                      setFormData({
                        ...formData,
                        data: date ? formatDateLocal(date) : today
                      });
                    }}
                    placeholder="Selecione uma data"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Valor</label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.valor}
                    onChange={(e) => setFormData({...formData, valor: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Método de Pagamento</label>
                  <Select 
                    value={formData.metodo} 
                    onValueChange={(value: 'Débito' | 'Crédito' | 'Pix' | 'Dinheiro') => setFormData({...formData, metodo: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o método de pagamento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Débito">Débito</SelectItem>
                      <SelectItem value="Crédito">Crédito</SelectItem>
                      <SelectItem value="Pix">Pix</SelectItem>
                      <SelectItem value="Dinheiro">Dinheiro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setAddTransactionOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button onClick={handleAddTransaction}>
                    Salvar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </PageHeader>
      
      <div className="px-4 sm:px-6 py-4 sm:py-6">
        <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">


      {/* Transactions Table */}
      <Card className="rounded-lg sm:rounded-xl overflow-hidden">
        <CardContent className="p-0">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="border-b bg-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-black whitespace-nowrap">
                      Data
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-black whitespace-nowrap">
                      Descrição
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-black whitespace-nowrap">
                      Categoria
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-black whitespace-nowrap">
                      Tipo
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-black whitespace-nowrap">
                      Método
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-black whitespace-nowrap">
                      Valor
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-black whitespace-nowrap">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y bg-[#F8F6F7]">
                  {loading ? (
                    Array.from({ length: 5 }).map((_, index) => (
                      <tr key={index} className="hover:bg-muted/20 transition-colors">
                        <td className="px-6 py-4">
                          <Skeleton className="h-4 w-20" />
                        </td>
                        <td className="px-6 py-4">
                          <Skeleton className="h-4 w-32" />
                        </td>
                        <td className="px-6 py-4">
                          <Skeleton className="h-4 w-20" />
                        </td>
                        <td className="px-6 py-4">
                          <Skeleton className="h-6 w-16 rounded-full" />
                        </td>
                        <td className="px-6 py-4">
                          <Skeleton className="h-4 w-20" />
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
                      <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                        Nenhuma transação encontrada.
                      </td>
                    </tr>
                  ) : (
                    transactions.map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-muted/20 transition-colors">
                        <td className="px-6 py-4 text-sm text-muted-foreground whitespace-nowrap">
                          {transactionService.formatDateForDisplay(transaction.data_hora)}
                        </td>
                        <td className="px-6 py-4 text-sm text-[#878787]">
                          <div className="font-regular">{transaction.descricao}</div>
                        </td>
                        <td className="px-6 py-4 text-sm text-[#878787] whitespace-nowrap">
                          {transaction.categoria}
                        </td>
                        <td className="px-6 py-4">
                          <Badge 
                            variant={transaction.tipo === 'saida' ? 'destructive' : 'default'}
                            className={
                              transaction.tipo === 'saida' 
                                ? 'bg-destructive-light text-destructive hover:bg-destructive-light'
                                : 'bg-success-light text-success hover:bg-success-light'
                            }
                          >
                            {transaction.tipo === 'saida' ? 'Saída' : 'Entrada'}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-sm text-[#878787] whitespace-nowrap">
                          {transaction.metodo || '-'}
                        </td>
                        <td className="px-6 py-4 text-right text-sm font-regular text-[#000000] tracking-tighter whitespace-nowrap">
                          {formatCurrency(transaction.valor)}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                              >
                                <TrashIcon className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="max-w-[90vw] sm:max-w-md">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="text-base sm:text-lg">Confirmar Exclusão</AlertDialogTitle>
                                <AlertDialogDescription className="text-sm">
                                  Tem certeza que deseja excluir a transação "{transaction.descricao}"?
                                  <br />
                                  <strong>Esta ação não pode ser desfeita.</strong>
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                                <AlertDialogCancel className="w-full sm:w-auto">Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteTransaction(transaction.id, transaction.descricao)}
                                  className="w-full sm:w-auto bg-destructive text-destructive-foreground hover:bg-destructive/90"
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
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-3 p-4">
            {loading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <Card key={index} className="p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-6 w-20" />
                    </div>
                    <Skeleton className="h-5 w-3/4" />
                    <div className="flex gap-2">
                      <Skeleton className="h-5 w-16 rounded-full" />
                      <Skeleton className="h-5 w-20" />
                    </div>
                  </div>
                </Card>
              ))
            ) : transactions.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground text-sm">
                Nenhuma transação encontrada.
              </div>
            ) : (
              transactions.map((transaction) => (
                <Card key={transaction.id} className="p-4 hover:bg-muted/5 transition-colors">
                  <div className="space-y-3">
                    {/* Header: Data e Valor */}
                    <div className="flex justify-between items-start">
                      <span className="text-xs text-muted-foreground">
                        {transactionService.formatDateForDisplay(transaction.data_hora)}
                      </span>
                      <span className="text-base font-semibold text-[#000000]">
                        {formatCurrency(transaction.valor)}
                      </span>
                    </div>
                    
                    {/* Descrição */}
                    <div className="font-medium text-sm text-[#878787] break-words">
                      {transaction.descricao}
                    </div>
                    
                    {/* Footer: Categoria, Tipo, Método e Ações */}
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge 
                        variant={transaction.tipo === 'saida' ? 'destructive' : 'default'}
                        className={`text-xs ${
                          transaction.tipo === 'saida' 
                            ? 'bg-destructive-light text-destructive hover:bg-destructive-light'
                            : 'bg-success-light text-success hover:bg-success-light'
                        }`}
                      >
                        {transaction.tipo === 'saida' ? 'Saída' : 'Entrada'}
                      </Badge>
                      <span className="text-xs text-[#878787]">•</span>
                      <span className="text-xs text-[#878787]">{transaction.categoria}</span>
                      {transaction.metodo && (
                        <>
                          <span className="text-xs text-[#878787]">•</span>
                          <span className="text-xs text-[#878787]">{transaction.metodo}</span>
                        </>
                      )}
                      <div className="ml-auto">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                            >
                              <TrashIcon className="h-3.5 w-3.5" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="max-w-[90vw] sm:max-w-md">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-base sm:text-lg">Confirmar Exclusão</AlertDialogTitle>
                              <AlertDialogDescription className="text-sm">
                                Tem certeza que deseja excluir a transação "{transaction.descricao}"?
                                <br />
                                <strong>Esta ação não pode ser desfeita.</strong>
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                              <AlertDialogCancel className="w-full sm:w-auto">Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteTransaction(transaction.id, transaction.descricao)}
                                className="w-full sm:w-auto bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
        </div>
      </div>
    </div>
  );
}