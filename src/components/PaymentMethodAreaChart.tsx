"use client"

import { useState, useEffect } from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { transactionService } from "@/services/transactionService"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"

function PaymentTooltip({ active, payload, label }: any) {
  if (!active || !payload || !payload.length) return null

  const formatCurrency = (value: number) =>
    value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })

  // Função para obter o label formatado do chartConfig
  const getLabel = (name: string) => {
    const config = chartConfig[name as keyof typeof chartConfig]
    return config?.label || name
  }

  return (
    <div className="rounded-lg border bg-background p-3 shadow-md space-y-2">
      <div className="space-y-1">
        {payload.map((item: any) => (
          <div key={item.name} className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-muted-foreground">{getLabel(item.name)}</span>
            </div>
            <span className="text-sm font-semibold">
              {formatCurrency(Number(item.value || 0))}
            </span>
          </div>
        ))}
      </div>
      <div className="text-xs text-muted-foreground pt-1 border-t">
        {label}
      </div>
    </div>
  )
}

interface PaymentMethodAreaChartProps {
  startDate?: string
  endDate?: string
}

const chartConfig = {
  Crédito: {
    label: "Crédito",
    color: "hsl(24.6, 95%, 53.1%)", // Laranja #F97316
  },
  Débito: {
    label: "Débito",
    color: "hsl(217.2, 91.2%, 59.8%)", // Azul claro #60A5FA
  },
  Pix: {
    label: "Pix",
    color: "hsl(45.4, 93.4%, 47.5%)", // Amarelo #FBBF24
  },
  Dinheiro: {
    label: "Dinheiro",
    color: "hsl(142.1, 70%, 50%)", // Verde médio #22C55E
  },
  aporte: {
    label: "Aporte",
    color: "hsl(142.1, 76.2%, 36.3%)", // Verde #208251
  },
  resgate: {
    label: "Resgate",
    color: "hsl(0, 84.2%, 60.2%)", // Vermelho #EF4444
  },
} satisfies ChartConfig

export function PaymentMethodAreaChart({ startDate, endDate }: PaymentMethodAreaChartProps) {
  const [chartData, setChartData] = useState<Array<{ date: string; Crédito: number; Débito: number; Pix: number; Dinheiro: number; aporte: number; resgate: number }>>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const loadPaymentMethodData = async () => {
      try {
        setLoading(true)
        
        // Carregar transações de saída e entrada (para incluir resgates)
        const [saidaTransactions, entradaTransactions] = await Promise.all([
          transactionService.getTransactions({
            startDate,
            endDate,
            type: 'saida'
          }),
          transactionService.getTransactions({
            startDate,
            endDate,
            type: 'entrada'
          })
        ])
        
        // Combinar transações, mas apenas incluir resgates das entradas
        const transactions = [
          ...saidaTransactions,
          ...entradaTransactions.filter(t => t.metodo === 'resgate')
        ]

        // Agrupar por data e método de pagamento
        const groupedByDate: Record<string, { Crédito: number; Débito: number; Pix: number; Dinheiro: number; aporte: number; resgate: number; dateObj: Date }> = {}

        transactions.forEach((transaction) => {
          // Extrair a data diretamente do timestamp sem conversão de timezone
          const dateMatch = transaction.data_hora.match(/^(\d{4})-(\d{2})-(\d{2})/);
          const dateKey = dateMatch ? dateMatch[0] : transaction.data_hora.split('T')[0]; // YYYY-MM-DD para ordenação
          
          // Criar Date object usando UTC para evitar problemas de timezone
          const [year, month, day] = dateKey.split('-');
          const dateObj = new Date(Date.UTC(parseInt(year), parseInt(month) - 1, parseInt(day)));
          
          if (!groupedByDate[dateKey]) {
            groupedByDate[dateKey] = { Crédito: 0, Débito: 0, Pix: 0, Dinheiro: 0, aporte: 0, resgate: 0, dateObj }
          }

          const method = transaction.metodo || 'Débito'
          if (method === 'Crédito' || method === 'Débito' || method === 'Pix' || method === 'Dinheiro' || method === 'aporte' || method === 'resgate') {
            groupedByDate[dateKey][method] += Number(transaction.valor)
          }
        })

        // Função auxiliar para formatar data sem problemas de timezone
        const formatDateForChart = (dateString: string) => {
          const formatted = transactionService.formatDateForDisplay(dateString);
          const [day, month, year] = formatted.split('/');
          const monthNames = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
          const monthIndex = parseInt(month) - 1;
          return `${day} de ${monthNames[monthIndex]}.`;
        };

        // Converter para array e ordenar por data
        const dataArray = Object.entries(groupedByDate)
          .map(([dateKey, values]) => ({
            date: formatDateForChart(dateKey),
            Crédito: values.Crédito,
            Débito: values.Débito,
            Pix: values.Pix,
            Dinheiro: values.Dinheiro,
            aporte: values.aporte,
            resgate: values.resgate,
            dateObj: values.dateObj
          }))
          .sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime())
          .map(({ dateObj, ...rest }) => rest)

        setChartData(dataArray)
      } catch (error) {
        toast({
          title: "Erro",
          description: "Não foi possível carregar os dados do gráfico.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadPaymentMethodData()
  }, [startDate, endDate, toast])

  if (loading) {
    return (
      <Card>
        <CardHeader className="items-start">
          <CardTitle className="text-xl font-semibold">Gastos por Método de Pagamento</CardTitle>
          <CardDescription className="text-sm">Carregando...</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[200px] w-full" />
        </CardContent>
      </Card>
    )
  }

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader className="items-start">
          <CardTitle className="text-xl font-semibold">Gastos por Método de Pagamento</CardTitle>
          <CardDescription className="text-sm">Nenhum gasto encontrado para este período</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center text-muted-foreground h-[200px]">
            <p>Nenhuma transação de saída encontrada</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="rounded-xl sm:rounded-2xl lg:rounded-3xl">
      <CardHeader className="items-start p-4 sm:p-6 pb-2 sm:pb-3">
        <CardTitle className="text-xl sm:text-xl font-semibold">Gastos por Método de Pagamento</CardTitle>
        <CardDescription className="text-sm sm:text-sm">
          {startDate && endDate 
            ? transactionService.formatDateRangeAbbreviated(startDate, endDate)
            : 'Período selecionado'}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-0">
        <ChartContainer config={chartConfig} className="w-full h-[200px] sm:h-[250px] lg:h-[300px]">
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 8,
              right: 8,
              top: 8,
              bottom: 8,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              hide={true}
            />
            <ChartTooltip
              cursor={false}
              content={<PaymentTooltip />}
            />
            <Area
              dataKey="Crédito"
              type="linear"
              fill="#F97316"
              fillOpacity={0.2}
              stroke="#F97316"
            />
            <Area
              dataKey="Débito"
              type="linear"
              fill="#60A5FA"
              fillOpacity={0.2}
              stroke="#60A5FA"
            />
            <Area
              dataKey="Pix"
              type="linear"
              fill="#FBBF24"
              fillOpacity={0.2}
              stroke="#FBBF24"
            />
            <Area
              dataKey="Dinheiro"
              type="linear"
              fill="#22C55E"
              fillOpacity={0.2}
              stroke="#22C55E"
            />
            <Area
              dataKey="aporte"
              type="linear"
              fill="#208251"
              fillOpacity={0.2}
              stroke="#208251"
            />
            <Area
              dataKey="resgate"
              type="linear"
              fill="#EF4444"
              fillOpacity={0.2}
              stroke="#EF4444"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      {/* Legenda */}
      <div className="px-4 sm:px-6 pb-4 sm:pb-6 flex flex-wrap items-center justify-center gap-3 sm:gap-6">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#F97316' }} />
          <span className="text-xs sm:text-sm text-muted-foreground">Crédito</span>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#60A5FA' }} />
          <span className="text-xs sm:text-sm text-muted-foreground">Débito</span>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#FBBF24' }} />
          <span className="text-xs sm:text-sm text-muted-foreground">Pix</span>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#22C55E' }} />
          <span className="text-xs sm:text-sm text-muted-foreground">Dinheiro</span>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#208251' }} />
          <span className="text-xs sm:text-sm text-muted-foreground">Aporte</span>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#EF4444' }} />
          <span className="text-xs sm:text-sm text-muted-foreground">Resgate</span>
        </div>
      </div>
    </Card>
  )
}

