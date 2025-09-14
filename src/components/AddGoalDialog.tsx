import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Plus } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { goalService } from '@/services/goalService'
import type { Goal } from '@/lib/supabase'

interface AddGoalDialogProps {
  onAddGoal: () => void
}

export default function AddGoalDialog({ onAddGoal }: AddGoalDialogProps) {
  const [open, setOpen] = useState(false)
  const { toast } = useToast()
  const form = useForm({
    defaultValues: {
      name: '',
      target_amount: '',
      current_amount: '',
      deadline: '',
    }
  })

  const onSubmit = async (data: any) => {
    if (!data.name.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, preencha o nome da meta.",
        variant: "destructive",
      })
      return
    }

    if (!data.target_amount || parseFloat(data.target_amount) <= 0) {
      toast({
        title: "Erro",
        description: "Por favor, insira um valor de meta válido maior que zero.",
        variant: "destructive",
      })
      return
    }

    try {
      const goalData = {
        name: data.name.trim(),
        target_amount: parseFloat(data.target_amount),
        current_amount: data.current_amount ? parseFloat(data.current_amount) : 0,
        deadline: data.deadline || undefined,
      }

      await goalService.createGoal(goalData)
      
      toast({
        title: "Sucesso",
        description: "Meta criada com sucesso!",
      })
      
      form.reset({
        name: '',
        target_amount: '',
        current_amount: '',
        deadline: '',
      })
      
      setOpen(false)
      onAddGoal()
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível criar a meta.",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-black text-primary-foreground w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Nova Meta
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nova Meta</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da Meta</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Viagem para Europa" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="target_amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor da Meta</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.01" 
                      placeholder="5000.00" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="current_amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor Atual (opcional)</FormLabel>
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
              name="deadline"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data Limite (opcional)</FormLabel>
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
              <Button type="submit" className='bg-black hover:bg-black/90'>Criar Meta</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
