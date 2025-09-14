import { useState } from 'react'
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
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { 
  Target, 
  Plus, 
  Minus, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Calendar,
  TrendingUp 
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { goalService } from '@/services/goalService'
import type { Goal } from '@/lib/supabase'

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
  const [editData, setEditData] = useState({
    name: goal.name,
    target_amount: goal.target_amount.toString(),
    deadline: goal.deadline || ''
  })
  const { toast } = useToast()

  const progress = goalService.calculateProgress(goal.current_amount, goal.target_amount)
  const isCompleted = goalService.isGoalCompleted(goal.current_amount, goal.target_amount)
  const isOverdue = goal.deadline ? goalService.isGoalOverdue(goal.deadline) : false
  const daysRemaining = goal.deadline ? goalService.getDaysRemaining(goal.deadline) : null

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
      setAddAmountOpen(false)
      onUpdate()
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
      setRemoveAmountOpen(false)
      onUpdate()
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível remover o valor.",
        variant: "destructive",
      })
    }
  }

  const handleEdit = async () => {
    if (!editData.name.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, preencha o nome da meta.",
        variant: "destructive",
      })
      return
    }

    if (!editData.target_amount || parseFloat(editData.target_amount) <= 0) {
      toast({
        title: "Erro",
        description: "Por favor, insira um valor de meta válido.",
        variant: "destructive",
      })
      return
    }

    try {
      await goalService.updateGoal(goal.id, {
        name: editData.name.trim(),
        target_amount: parseFloat(editData.target_amount),
        deadline: editData.deadline || undefined,
      })
      toast({
        title: "Sucesso",
        description: "Meta atualizada com sucesso!",
      })
      setEditOpen(false)
      onUpdate()
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
      setDeleteOpen(false)
      onDelete()
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
                <Target className="h-5 w-5" />
                {goal.name}
              </CardTitle>
              {goal.deadline && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  {goalService.formatDateForDisplay(goal.deadline)}
                  {daysRemaining !== null && (
                    <Badge variant={isOverdue ? "destructive" : "secondary"} className="ml-2">
                      {isOverdue ? "Vencida" : `${daysRemaining} dias`}
                    </Badge>
                  )}
                </div>
              )}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setEditOpen(true)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setDeleteOpen(true)}
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
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
              <span>{goalService.formatCurrency(goal.current_amount)}</span>
              <span>{goalService.formatCurrency(goal.target_amount)}</span>
            </div>
          </div>

          {isCompleted && (
            <Badge className="w-full justify-center bg-green-100 text-green-800 hover:bg-green-100">
              <TrendingUp className="h-4 w-4 mr-1" />
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
              <Plus className="h-4 w-4 mr-1" />
              Adicionar
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => setRemoveAmountOpen(true)}
              className="flex-1"
            >
              <Minus className="h-4 w-4 mr-1" />
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
                value={editData.name}
                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-target">Valor da Meta</Label>
              <Input
                id="edit-target"
                type="number"
                step="0.01"
                value={editData.target_amount}
                onChange={(e) => setEditData({ ...editData, target_amount: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-deadline">Data Limite</Label>
              <Input
                id="edit-deadline"
                type="date"
                value={editData.deadline}
                onChange={(e) => setEditData({ ...editData, deadline: e.target.value })}
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
            Tem certeza que deseja excluir a meta "{goal.name}"? Esta ação não pode ser desfeita.
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
