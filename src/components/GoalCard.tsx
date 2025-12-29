import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter 
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { DatePicker } from '@/components/ui/date-picker'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { 
  AdjustmentsHorizontalIcon,
  PlusIcon, 
  MinusIcon, 
  EllipsisVerticalIcon, 
  PencilIcon, 
  TrashIcon, 
  CalendarIcon,
  ArrowTrendingUpIcon 
} from '@heroicons/react/24/outline'
import { useToast } from '@/hooks/use-toast'
import { goalService } from '@/services/goalService'
import type { Goal } from '@/services/goalService'

interface GoalCardProps {
  goal: Goal
  onUpdate: () => void
  onDelete: () => void
}

export default function GoalCard({ goal, onUpdate, onDelete }: GoalCardProps) {
  const [addAmountOpen, setAddAmountOpen] = useState(false)
  const [removeAmountOpen, setRemoveAmountOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [amount, setAmount] = useState('')
  const shouldUpdateAfterAddRef = useRef(false)
  const shouldUpdateAfterRemoveRef = useRef(false)
  const shouldUpdateAfterEditRef = useRef(false)
  const shouldUpdateAfterDeleteRef = useRef(false)
  // Helper to convert DD/MM/YYYY to YYYY-MM-DD for date input
  const convertToDateInput = (dateStr: string): string => {
    if (!dateStr) return '';
    const ddmmyyyyMatch = dateStr.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (ddmmyyyyMatch) {
      const [, day, month, year] = ddmmyyyyMatch;
      return `${year}-${month}-${day}`;
    }
    return dateStr; // Return as is if not in DD/MM/YYYY format
  };

  // Helper para converter DD/MM/YYYY para Date
  const parseDateFromString = (dateStr: string): Date | undefined => {
    if (!dateStr || dateStr.trim() === '' || dateStr.toUpperCase() === 'EMPTY') return undefined;
    const ddmmyyyyMatch = dateStr.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (ddmmyyyyMatch) {
      const [, day, month, year] = ddmmyyyyMatch;
      return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    }
    const yyyymmddMatch = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (yyyymmddMatch) {
      const [, year, month, day] = yyyymmddMatch;
      return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    }
    return undefined;
  };

  const [editData, setEditData] = useState({
    nome: goal.nomeMeta,  // nomeMeta na tabela, mas mantemos "nome" no estado para compatibilidade
    valor: goal.valor.toString(),
    prazo: goal.prazo ? convertToDateInput(goal.prazo) : ''  // Converter DD/MM/YYYY para YYYY-MM-DD para o input
  })
  
  const [editDate, setEditDate] = useState<Date | undefined>(
    goal.prazo ? parseDateFromString(goal.prazo) : undefined
  )
  const { toast } = useToast()

  const progress = goalService.calculateProgress(goal.valor_atual, goal.valor)
  const isCompleted = goalService.isGoalCompleted(goal.valor_atual, goal.valor)
  const isOverdue = goal.prazo ? goalService.isGoalOverdue(goal.prazo) : false
  const daysRemaining = goal.prazo ? goalService.getDaysRemaining(goal.prazo) : null

  // Atualizar quando os dialogs fecharem completamente
  useEffect(() => {
    if (!addAmountOpen && shouldUpdateAfterAddRef.current) {
      shouldUpdateAfterAddRef.current = false
      onUpdate()
    }
  }, [addAmountOpen, onUpdate])

  useEffect(() => {
    if (!removeAmountOpen && shouldUpdateAfterRemoveRef.current) {
      shouldUpdateAfterRemoveRef.current = false
      onUpdate()
    }
  }, [removeAmountOpen, onUpdate])

  useEffect(() => {
    if (!editOpen && shouldUpdateAfterEditRef.current) {
      shouldUpdateAfterEditRef.current = false
      onUpdate()
    }
  }, [editOpen, onUpdate])

  useEffect(() => {
    if (!deleteOpen && shouldUpdateAfterDeleteRef.current) {
      shouldUpdateAfterDeleteRef.current = false
      onDelete()
    }
  }, [deleteOpen, onDelete])

  const handleAddAmount = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Erro",
        description: "Por favor, insira um valor válido.",
        variant: "destructive",
      })
      return
    }

    try {
      await goalService.addAmountToGoal(goal.id, parseFloat(amount))
      toast({
        title: "Sucesso",
        description: `R$ ${parseFloat(amount).toFixed(2)} adicionado à meta!`,
      })
      setAmount('')
      // Marcar que precisa atualizar quando o dialog fechar
      shouldUpdateAfterAddRef.current = true
      setAddAmountOpen(false)
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível adicionar o valor.",
        variant: "destructive",
      })
    }
  }

  const handleRemoveAmount = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Erro",
        description: "Por favor, insira um valor válido.",
        variant: "destructive",
      })
      return
    }

    try {
      await goalService.removeAmountFromGoal(goal.id, parseFloat(amount))
      toast({
        title: "Sucesso",
        description: `R$ ${parseFloat(amount).toFixed(2)} removido da meta!`,
      })
      setAmount('')
      // Marcar que precisa atualizar quando o dialog fechar
      shouldUpdateAfterRemoveRef.current = true
      setRemoveAmountOpen(false)
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível remover o valor.",
        variant: "destructive",
      })
    }
  }

  const handleEdit = async () => {
    if (!editData.nome.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, preencha o nome da meta.",
        variant: "destructive",
      })
      return
    }

    if (!editData.valor || parseFloat(editData.valor) <= 0) {
      toast({
        title: "Erro",
        description: "Por favor, insira um valor de meta válido.",
        variant: "destructive",
      })
      return
    }

    try {
      await goalService.updateGoal(goal.id, {
        nomeMeta: editData.nome.trim(),  // nomeMeta na tabela
        valor: parseFloat(editData.valor),
        prazo: editData.prazo || undefined,
      })
      toast({
        title: "Sucesso",
        description: "Meta atualizada com sucesso!",
      })
      // Marcar que precisa atualizar quando o dialog fechar
      shouldUpdateAfterEditRef.current = true
      setEditOpen(false)
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível atualizar a meta.",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async () => {
    try {
      await goalService.deleteGoal(goal.id)
      toast({
        title: "Sucesso",
        description: "Meta excluída com sucesso!",
      })
      // Marcar que precisa atualizar quando o dialog fechar
      shouldUpdateAfterDeleteRef.current = true
      setDeleteOpen(false)
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível excluir a meta.",
        variant: "destructive",
      })
    }
  }

  return (
    <>
      <Card className="relative">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="text-lg flex items-center gap-2">
                <AdjustmentsHorizontalIcon className="h-5 w-5" />
                {goal.nomeMeta}
              </CardTitle>
              {goal.prazo && goal.prazo.trim() !== '' && goal.prazo.toUpperCase() !== 'EMPTY' && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CalendarIcon className="h-4 w-4" />
                  <span className="font-medium">{goalService.formatDateForDisplay(goal.prazo)}</span>
                  {daysRemaining !== null && (
                    <Badge variant={isOverdue ? "destructive" : "secondary"} className="ml-1">
                      {isOverdue ? "Vencida" : daysRemaining > 0 ? `${daysRemaining} ${daysRemaining === 1 ? 'dia' : 'dias'}` : 'Hoje'}
                    </Badge>
                  )}
                </div>
              )}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <EllipsisVerticalIcon className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setEditOpen(true)}>
                  <PencilIcon className="h-4 w-4 mr-2" />
                  Editar
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setDeleteOpen(true)}
                  className="text-destructive"
                >
                  <TrashIcon className="h-4 w-4 mr-2" />
                  Excluir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progresso</span>
              <span className="font-medium">{progress.toFixed(1)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{goalService.formatCurrency(goal.valor_atual)}</span>
              <span>{goalService.formatCurrency(goal.valor)}</span>
            </div>
          </div>

          {isCompleted && (
            <Badge className="w-full justify-center bg-green-100 text-green-800 hover:bg-green-100">
              <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
              Meta Concluída!
            </Badge>
          )}

          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => setAddAmountOpen(true)}
              className="flex-1"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Adicionar
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => setRemoveAmountOpen(true)}
              className="flex-1"
            >
              <MinusIcon className="h-4 w-4 mr-1" />
              Remover
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Add Amount Dialog */}
      <Dialog open={addAmountOpen} onOpenChange={setAddAmountOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Adicionar Valor à Meta</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="add-amount">Valor a adicionar</Label>
              <Input
                id="add-amount"
                type="number"
                step="0.01"
                placeholder="100.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddAmountOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddAmount}>Adicionar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Remove Amount Dialog */}
      <Dialog open={removeAmountOpen} onOpenChange={setRemoveAmountOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Remover Valor da Meta</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="remove-amount">Valor a remover</Label>
              <Input
                id="remove-amount"
                type="number"
                step="0.01"
                placeholder="50.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRemoveAmountOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleRemoveAmount}>Remover</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Goal Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Meta</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Nome da Meta</Label>
              <Input
                id="edit-name"
                value={editData.nome}
                onChange={(e) => setEditData({ ...editData, nome: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-target">Valor da Meta</Label>
              <Input
                id="edit-target"
                type="number"
                step="0.01"
                value={editData.valor}
                onChange={(e) => setEditData({ ...editData, valor: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-deadline">Data Limite</Label>
              <DatePicker
                date={editDate}
                onSelect={(date) => {
                  setEditDate(date);
                  if (date) {
                    const day = String(date.getDate()).padStart(2, '0');
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const year = date.getFullYear();
                    setEditData({ ...editData, prazo: `${year}-${month}-${day}` });
                  } else {
                    setEditData({ ...editData, prazo: '' });
                  }
                }}
                placeholder="Selecione uma data"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEdit}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Excluir Meta</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Tem certeza que deseja excluir a meta "{goal.nomeMeta}"? Esta ação não pode ser desfeita.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}