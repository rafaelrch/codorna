import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { DatePicker } from '@/components/ui/date-picker'
import { PlusIcon } from '@heroicons/react/24/outline'
import { useToast } from '@/hooks/use-toast'
import { goalService } from '@/services/goalService'

interface AddGoalDialogProps {
  onAddGoal: () => void
}

export default function AddGoalDialog({ onAddGoal }: AddGoalDialogProps) {
  const [open, setOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const { toast } = useToast()
  const form = useForm({
    defaultValues: {
      nome: '',
      valor: '',
      valor_atual: '',
      prazo: '',
    }
  })

  const onSubmit = async (data: any) => {
    if (!data.nome.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, preencha o nome da meta.",
        variant: "destructive",
      })
      return
    }

    if (!data.valor || parseFloat(data.valor) <= 0) {
      toast({
        title: "Erro",
        description: "Por favor, insira um valor de meta válido maior que zero.",
        variant: "destructive",
      })
      return
    }

    try {
      // Converter Date para string DD/MM/YYYY se houver data selecionada
      let prazoString: string | undefined = undefined;
      if (selectedDate) {
        const day = String(selectedDate.getDate()).padStart(2, '0');
        const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
        const year = selectedDate.getFullYear();
        prazoString = `${day}/${month}/${year}`;
      }

      const goalData = {
        nomeMeta: data.nome.trim(),  // nomeMeta na tabela
        valor: parseFloat(data.valor),
        valor_atual: data.valor_atual ? parseFloat(data.valor_atual) : 0,
        prazo: prazoString || undefined,
      }

      console.log('Creating goal with data:', goalData)
      await goalService.createGoal(goalData)
      
      toast({
        title: "Sucesso",
        description: "Meta criada com sucesso!",
      })
      
      form.reset({
        nome: '',
        valor: '',
        valor_atual: '',
        prazo: '',
      })
      setSelectedDate(undefined)
      
      setOpen(false)
      onAddGoal()
    } catch (error: any) {
      console.error('Error creating goal:', error)
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
        <Button className="bg-[#1f8150] text-white hover:bg-[#1a6b42] w-full sm:w-auto">
          <PlusIcon className="h-4 w-4 mr-2" />
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
              name="nome"
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
              name="valor"
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
              name="valor_atual"
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
              name="prazo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data Limite (opcional)</FormLabel>
                  <FormControl>
                    <DatePicker
                      date={selectedDate}
                      onSelect={(date) => {
                        setSelectedDate(date);
                        // Manter compatibilidade com o form
                        if (date) {
                          const day = String(date.getDate()).padStart(2, '0');
                          const month = String(date.getMonth() + 1).padStart(2, '0');
                          const year = date.getFullYear();
                          field.onChange(`${year}-${month}-${day}`);
                        } else {
                          field.onChange('');
                        }
                      }}
                      placeholder="Selecione uma data"
                    />
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