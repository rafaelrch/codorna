import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Plus } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { transactionService, Transaction } from '@/services/transactionService';
import { useToast } from '@/hooks/use-toast';


export default function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [addTransactionOpen, setAddTransactionOpen] = useState(false);
  const [categories, setCategories] = useState<{id: number, nome: string, tipo: 'saida' | 'entrada'}[]>([]);
  const [formData, setFormData] = useState({
    descricao: '',
    tipo: 'saida' as 'entrada' | 'saida',
    categoria: '',
    data: new Date().toISOString().split('T')[0],
    valor: ''
  });
  // Definir datas padrão (últimos 30 dias)
  const getDefaultDates = () => {
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);
    
    return {
      start: thirtyDaysAgo.toISOString().split('T')[0],
      end: today.toISOString().split('T')[0]
    };
  };

  const defaultDates = getDefaultDates();
  const [startDate, setStartDate] = useState(defaultDates.start);
  const [endDate, setEndDate] = useState(defaultDates.end);
  const { toast } = useToast();

  // Carregar transações do Supabase
  const loadTransactions = async () => {
    try {
      setLoading(true);
      console.log('Carregando transações...', { startDate, endDate });
      
      // Buscar transações com filtros de data
      const data = await transactionService.getTransactions({
        startDate,
        endDate,
        category: '',
        type: undefined,
      });

      console.log('Transações carregadas:', data);
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

  // Carregar categorias
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await transactionService.getAllCategories();
        setCategories(data);
      } catch (error) {
        console.error('Erro ao carregar categorias:', error);
      }
    };
    loadCategories();
  }, []);

  // Recarregar transações quando as datas mudarem
  useEffect(() => {
    loadTransactions();
  }, [startDate, endDate]);


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
      console.error('Erro ao excluir transação:', error);
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

    try {
      const transactionData = {
        descricao: formData.descricao.trim(),
        tipo: formData.tipo,
        categoria: formData.categoria,
        data: formData.data,
        valor: parseFloat(formData.valor)
      };

      console.log('Creating transaction with data:', transactionData);
      
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
        data: new Date().toISOString().split('T')[0],
        valor: ''
      });
      
      setAddTransactionOpen(false);
      loadTransactions(); // Recarregar transações
    } catch (error: any) {
      console.error('Error creating transaction:', error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível adicionar a transação.",
        variant: "destructive",
      });
    }
  };

  const getFilteredCategories = (tipo: 'entrada' | 'saida') => {
    return categories.filter(cat => cat.tipo === tipo);
  };

  return (
    <div className="min-h-screen bg-[#EBEBEB]">
      <PageHeader title="Transações">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
            <span>De:</span>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-36 h-8 bg-[#F8F6F7] rounded-lg text-black"
            />
            <span>Até:</span>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-36 h-8 bg-[#F8F6F7] rounded-lg text-black"
            />
          </div>
          <Dialog open={addTransactionOpen} onOpenChange={setAddTransactionOpen}>
            <DialogTrigger asChild>
              <Button className="bg-black px-6 rounded-lg text-white">
                <Plus className="h-4 w-4 mr-2" />
                Fazer lançamento
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Nova Transação</DialogTitle>
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
                  <Input
                    type="date"
                    value={formData.data}
                    onChange={(e) => setFormData({...formData, data: e.target.value})}
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
                    Nome
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-black">
                    Descrição
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-black">
                    Categoria
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-black">
                    Tipo
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-black">
                    Valor
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-black">
                    Ações
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
                        <Skeleton className="h-4 w-24" />
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
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {transactionService.formatDateForDisplay(transaction.created_at)}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#878787]">
                        <div className="font-regular">{transaction.name}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#878787]">
                        <div className="font-regular">{transaction.descricao}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#878787]">
                        {transaction.categoria}
                      </td>
                      <td className="px-6 py-4">
                        <Badge 
                          variant={transaction.type === 'saida' ? 'destructive' : 'default'}
                          className={
                            transaction.type === 'saida' 
                              ? 'bg-destructive-light text-destructive hover:bg-destructive-light'
                              : 'bg-success-light text-success hover:bg-success-light'
                          }
                        >
                          {transaction.type === 'saida' ? 'Saída' : 'Entrada'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-regular text-[#000000] tracking-tighter">
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
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir a transação "{transaction.descricao}"?
                                <br />
                                <strong>Esta ação não pode ser desfeita.</strong>
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteTransaction(transaction.id, transaction.descricao)}
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