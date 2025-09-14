import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { transactionService } from '@/services/transactionService';
import { Transaction } from '@/lib/supabase';

interface AddTransactionDialogProps {
  onAddTransaction: () => void;
}

export default function AddTransactionDialog({ onAddTransaction }: AddTransactionDialogProps) {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<{id: number, name: string, type: 'income' | 'expense'}[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const { toast } = useToast();
  const form = useForm({
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      name: '',
      description: '',
      category_id: '',
      type: 'expense' as 'income' | 'expense',
      amount: '',
    }
  });

  // Carregar categorias do Supabase
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoadingCategories(true);
        const data = await transactionService.getAllCategories();
        setCategories(data);
      } catch (error) {
        console.error('Erro ao carregar categorias:', error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar as categorias.",
          variant: "destructive",
        });
      } finally {
        setLoadingCategories(false);
      }
    };

    loadCategories();
  }, [toast]);

  const onSubmit = async (data: any) => {
    if (!data.name.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, preencha o nome da transação.",
        variant: "destructive",
      });
      return;
    }

    if (!data.category_id) {
      toast({
        title: "Erro",
        description: "Por favor, selecione uma categoria.",
        variant: "destructive",
      });
      return;
    }

    if (!data.amount || parseFloat(data.amount) <= 0) {
      toast({
        title: "Erro",
        description: "Por favor, insira um valor válido maior que zero.",
        variant: "destructive",
      });
      return;
    }

    try {
      const transactionData = {
        name: data.name.trim(),
        description: data.description?.trim() || null,
        category_id: parseInt(data.category_id),
        type: data.type,
        amount: parseFloat(data.amount),
      };

      await transactionService.createTransaction(transactionData);
      
      toast({
        title: "Sucesso",
        description: "Lançamento adicionado com sucesso!",
      });
      
      form.reset({
        date: new Date().toISOString().split('T')[0],
        name: '',
        description: '',
        category_id: '',
        type: 'expense',
        amount: '',
      });
      
      setOpen(false);
      
      // Notify parent to reload transactions
      onAddTransaction();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível adicionar o lançamento.",
        variant: "destructive",
      });
    }
  };

  // Get categories based on selected type
  const getFilteredCategories = (type: 'income' | 'expense') => {
    return categories.filter(cat => cat.type === type);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-black px-8 rounded-lg text-primary-foreground w-full sm:w-auto">
          <Plus className="h-4 w-4" />
          Fazer lançamento
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Novo Lançamento</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da Transação</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Compra no mercado" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição (opcional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Detalhes adicionais" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.01" 
                      placeholder="0.00" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo</FormLabel>
                  <Select onValueChange={(value) => {
                    field.onChange(value);
                    // Reset category when type changes
                    form.setValue('category_id', '');
                  }} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="expense">Saída</SelectItem>
                      <SelectItem value="income">Entrada</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {loadingCategories ? (
                        <SelectItem value="" disabled>Carregando...</SelectItem>
                      ) : (
                        getFilteredCategories(form.watch('type')).map((category) => (
                          <SelectItem key={category.id} value={category.id.toString()}>
                            {category.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">Salvar</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}