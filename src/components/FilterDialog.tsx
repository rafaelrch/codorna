import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter } from 'lucide-react';
import { transactionService } from '@/services/transactionService';

interface FilterState {
  type: string;
  category: string;
  minAmount: string;
  maxAmount: string;
}

interface FilterDialogProps {
  onApplyFilters: (filters: FilterState) => void;
  currentFilters: FilterState;
}

export default function FilterDialog({ onApplyFilters, currentFilters }: FilterDialogProps) {
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    type: currentFilters.type || 'all',
    category: currentFilters.category || 'all',
    minAmount: currentFilters.minAmount || '',
    maxAmount: currentFilters.maxAmount || '',
  });
  const [categories, setCategories] = useState<Array<{ id: number; name: string; type: string }>>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  // Verificar se há filtros ativos
  const hasActiveFilters = 
    currentFilters.type !== 'all' || 
    currentFilters.category !== 'all' || 
    currentFilters.minAmount !== '' || 
    currentFilters.maxAmount !== '';

  // Contar filtros ativos
  const activeFiltersCount = [
    currentFilters.type !== 'all',
    currentFilters.category !== 'all',
    currentFilters.minAmount !== '',
    currentFilters.maxAmount !== ''
  ].filter(Boolean).length;

  // Sincronizar filtros quando currentFilters mudar
  useEffect(() => {
    setFilters({
      type: currentFilters.type || 'all',
      category: currentFilters.category || 'all',
      minAmount: currentFilters.minAmount || '',
      maxAmount: currentFilters.maxAmount || '',
    });
  }, [currentFilters]);

  // Carregar categorias do Supabase
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoadingCategories(true);
        const data = await transactionService.getAllCategories();
        setCategories(data);
      } catch (error) {
        console.error('Erro ao carregar categorias:', error);
        // Fallback para categorias padrão
        setCategories([
          { id: 1, name: 'Casa', type: 'expense' },
          { id: 2, name: 'Mercado', type: 'expense' },
          { id: 3, name: 'Farmácia', type: 'expense' },
          { id: 4, name: 'Academia', type: 'expense' },
          { id: 5, name: 'Assinaturas', type: 'expense' },
          { id: 6, name: 'Cartão', type: 'expense' },
          { id: 7, name: 'Transporte', type: 'expense' },
          { id: 8, name: 'Educação', type: 'expense' },
          { id: 9, name: 'Lazer', type: 'expense' },
          { id: 10, name: 'Contas Fixas', type: 'expense' },
          { id: 11, name: 'Impostos', type: 'expense' },
          { id: 12, name: 'Compra Online', type: 'expense' },
          { id: 13, name: 'Shopping', type: 'expense' },
          { id: 14, name: 'Salário', type: 'income' },
          { id: 15, name: 'Freelance', type: 'income' },
          { id: 16, name: 'Investimentos', type: 'income' },
          { id: 17, name: 'Família', type: 'income' },
          { id: 18, name: 'Reembolsos', type: 'income' }
        ]);
      } finally {
        setLoadingCategories(false);
      }
    };

    loadCategories();
  }, []);

  const handleApplyFilters = () => {
    // Validar valores mínimos e máximos
    const minAmount = filters.minAmount ? parseFloat(filters.minAmount) : 0;
    const maxAmount = filters.maxAmount ? parseFloat(filters.maxAmount) : Infinity;
    
    if (filters.minAmount && filters.maxAmount && minAmount > maxAmount) {
      alert('O valor mínimo não pode ser maior que o valor máximo.');
      return;
    }
    
    if (filters.minAmount && minAmount < 0) {
      alert('O valor mínimo não pode ser negativo.');
      return;
    }
    
    if (filters.maxAmount && maxAmount < 0) {
      alert('O valor máximo não pode ser negativo.');
      return;
    }
    
    onApplyFilters(filters);
    setOpen(false);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      type: 'all',
      category: 'all',
      minAmount: '',
      maxAmount: '',
    };
    setFilters(clearedFilters);
    onApplyFilters(clearedFilters);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant={hasActiveFilters ? "default" : "outline"} 
          size="sm" 
          className="w-full sm:w-auto"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filtrar {hasActiveFilters && `(${activeFiltersCount})`}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md" aria-describedby="filter-description">
        <DialogHeader>
          <DialogTitle>Filtrar Lançamentos</DialogTitle>
        </DialogHeader>
        <div id="filter-description" className="sr-only">
          Configure os filtros para visualizar transações específicas por tipo, categoria e valor
        </div>
        <div className="space-y-4">
          {/* Tipo (Entrada/Saída) */}
          <div className="space-y-2">
            <Label htmlFor="type">Tipo</Label>
            <Select
              value={filters.type || undefined}
              onValueChange={(value) => setFilters({ ...filters, type: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="income">Entrada</SelectItem>
                <SelectItem value="expense">Saída</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Categoria */}
          <div className="space-y-2">
            <Label htmlFor="category">Categoria</Label>
            <Select
              value={filters.category || undefined}
              onValueChange={(value) => setFilters({ ...filters, category: value })}
              disabled={loadingCategories}
            >
              <SelectTrigger>
                <SelectValue placeholder={loadingCategories ? "Carregando..." : "Selecione a categoria"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as categorias</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={`category-${category.id}`} value={category.name}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Valor Mínimo */}
          <div className="space-y-2">
            <Label htmlFor="minAmount">Valor mínimo (R$)</Label>
            <Input
              id="minAmount"
              type="number"
              step="0.01"
              min="0"
              value={filters.minAmount}
              onChange={(e) => setFilters({ ...filters, minAmount: e.target.value })}
              placeholder="0,00"
            />
          </div>

          {/* Valor Máximo */}
          <div className="space-y-2">
            <Label htmlFor="maxAmount">Valor máximo (R$)</Label>
            <Input
              id="maxAmount"
              type="number"
              step="0.01"
              min="0"
              value={filters.maxAmount}
              onChange={(e) => setFilters({ ...filters, maxAmount: e.target.value })}
              placeholder="0,00"
            />
          </div>

          {/* Botões de Ação */}
          <div className="flex justify-between gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={handleClearFilters}>
                Limpar
              </Button>
              <Button onClick={handleApplyFilters}>Aplicar</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
