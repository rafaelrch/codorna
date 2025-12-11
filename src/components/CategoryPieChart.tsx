"use client"

import * as React from "react"
import { Label, Pie, PieChart, Cell } from "recharts"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { transactionService } from "@/services/transactionService"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { useAnimatedValue } from "@/hooks/useAnimatedValue"

interface CategoryPieChartProps {
  startDate?: string
  endDate?: string
}

// Cores específicas por categoria - Design System Codorna
const categoryColors: { [key: string]: string } = {
  'Casa': '#8B5CF6',
  'Mercado': '#10B981',
  'Farmácia': '#F59E0B',
  'Academia': '#EF4444',
  'Assinaturas': '#3B82F6',
  'Cartão': '#8B5CF6',
  'Transporte': '#06B6D4',
  'Educação': '#84CC16',
  'Lazer': '#F97316',
  'Contas Fixas': '#6B7280',
  'Impostos': '#DC2626',
  'Compra Online': '#7C3AED',
  'Shopping': '#EC4899',
  'Outros': '#9CA3AF',
}

// Cores fallback para categorias não mapeadas
const fallbackColors = [
  '#8B5CF6', // Roxo
  '#10B981', // Verde
  '#F59E0B', // Laranja
  '#EF4444', // Vermelho
  '#3B82F6', // Azul
  '#06B6D4', // Ciano
  '#84CC16', // Verde limão
]

// Componente customizado para o tooltip
function CustomTooltipContent({ active, payload, coordinate }: any) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div 
        className="rounded-lg border bg-background p-2 shadow-md pointer-events-none"
        style={{
          position: 'absolute',
          left: coordinate?.x ? `${coordinate.x + 10}px` : 'auto',
          top: coordinate?.y ? `${coordinate.y - 10}px` : 'auto',
          transform: 'translateY(-50%)',
          zIndex: 1000
        }}
      >
        <div className="grid gap-1">
          <div className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: data.fill }}
            />
            <div className="font-medium">{data.category}</div>
          </div>
          <div className="text-sm font-mono">
            {data.expenses.toLocaleString('pt-BR', { 
              style: 'currency', 
              currency: 'BRL', 
              minimumFractionDigits: 2 
            })}
          </div>
        </div>
      </div>
    );
  }
  return null;
}

export function CategoryPieChart({ startDate, endDate }: CategoryPieChartProps) {
  const [chartData, setChartData] = React.useState<Array<{ category: string; expenses: number; fill: string; percentage: number }>>([])
  const [allCategoriesData, setAllCategoriesData] = React.useState<Array<{ category: string; expenses: number; fill: string; percentage: number }>>([])
  const [totalExpensesAmount, setTotalExpensesAmount] = React.useState<number>(0)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const loadExpenseData = async () => {
      try {
        setLoading(true)
        
        // Carregar todas as categorias de saída
        const expenseCategories = await transactionService.getExpenseCategories()
        
        // Carregar transações de saída filtradas pelo período selecionado
        const transactions = await transactionService.getTransactions({
          startDate,
          endDate,
          type: 'saida'
        })

        // Calcular o total a partir de todas as transações de saída no período
        const totalAmount = transactions.reduce((sum, transaction) => sum + Number(transaction.valor), 0)
        setTotalExpensesAmount(totalAmount)

        // Group by category and calculate totals
        const categoryTotals = transactions.reduce((acc, transaction) => {
          const categoryName = transaction.categoria || 'Outros'
          acc[categoryName] = (acc[categoryName] || 0) + Number(transaction.valor)
          return acc
        }, {} as Record<string, number>)

        // Criar dados para todas as categorias (incluindo as com valor 0)
        const allData = expenseCategories.map((category, index) => {
          const value = categoryTotals[category.nome] || 0
          return {
            category: category.nome,
            expenses: value,
            fill: categoryColors[category.nome] || fallbackColors[index % fallbackColors.length],
            percentage: totalAmount > 0 ? (value / totalAmount) * 100 : 0
          }
        })

        // Adicionar categoria "Outros" se houver transações sem categoria
        if (categoryTotals['Outros'] && categoryTotals['Outros'] > 0) {
          allData.push({
            category: 'Outros',
            expenses: categoryTotals['Outros'],
            fill: categoryColors['Outros'] || fallbackColors[fallbackColors.length - 1],
            percentage: totalAmount > 0 ? (categoryTotals['Outros'] / totalAmount) * 100 : 0
          })
        }

        // Ordenar por valor (maior para menor)
        const sortedAllData = allData.sort((a, b) => b.expenses - a.expenses)

        // Dados para o gráfico (apenas categorias com valor > 0)
        const chartDataFiltered = sortedAllData.filter(item => item.expenses > 0)

        setChartData(chartDataFiltered)
        setAllCategoriesData(sortedAllData)
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

    loadExpenseData()
  }, [startDate, endDate, toast])

  // Animar o valor total de 0 até o valor correto (usando o total calculado de todas as transações)
  const animatedTotal = useAnimatedValue(totalExpensesAmount, { duration: 1500, startDelay: 200 })

  // Criar chartConfig dinamicamente baseado nas categorias
  const chartConfig = React.useMemo(() => {
    const config: ChartConfig = {
      expenses: {
        label: "Gastos",
      },
    }
    
    chartData.forEach((item) => {
      config[item.category.toLowerCase().replace(/\s+/g, '_')] = {
        label: item.category,
        color: item.fill,
      }
    })
    
    return config
  }, [chartData])

  if (loading) {
    return (
      <Card className="flex flex-col">
        <CardHeader className="items-start">
          <CardTitle className="text-xl font-semibold">Gastos por Categoria</CardTitle>
          <CardDescription className="text-sm">Carregando...</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            <div className="flex-1 flex justify-center">
              <Skeleton className="w-[250px] h-[250px] rounded-full" />
            </div>
            <div className="flex-1 lg:max-w-sm w-full space-y-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 flex-1">
                    <Skeleton className="w-4 h-4 rounded-full" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-3 w-12" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (allCategoriesData.length === 0) {
    return (
      <Card className="flex flex-col">
        <CardHeader className="items-start">
          <CardTitle className="text-xl font-semibold">Gastos por Categoria</CardTitle>
          <CardDescription className="text-sm">Nenhum gasto encontrado para este período</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-6">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-center text-muted-foreground min-h-[350px]">
            <p>Nenhuma transação de saída encontrada</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="flex flex-col rounded-xl sm:rounded-2xl lg:rounded-3xl">
      <CardContent className="flex-1 py-3 sm:py-4 lg:py-6">
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
          {/* Coluna Esquerda - Header e Gráfico */}
          <div className="flex-1 flex flex-col">
            <CardHeader className="items-center p-4 sm:p-6 pb-2 sm:pb-3">
              <CardTitle className="text-2xl sm:text-2xl font-semibold text-center lg:text-left">Gastos por Categoria</CardTitle>
              <CardDescription className="text-sm sm:text-sm text-center lg:text-left">
                {startDate && endDate 
                  ? transactionService.formatDateRangeAbbreviated(startDate, endDate)
                  : 'Período selecionado'}
              </CardDescription>
            </CardHeader>
            {/* Gráfico */}
            <div className="flex-1 flex justify-center lg:justify-start items-center w-full px-2 sm:px-4">
              <ChartContainer config={chartConfig} className="w-full h-auto max-w-[280px] sm:max-w-[320px] lg:max-w-[400px] aspect-square">
                <PieChart>
                  <ChartTooltip cursor={false} content={<CustomTooltipContent />} />
                  <Pie
                    data={chartData}
                    dataKey="expenses"
                    nameKey="category"
                    innerRadius="60%"
                    outerRadius="70%"
                    strokeWidth={4}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                    <Label
                      content={({ viewBox }) => {
                        if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                          return (
                            <text
                              x={viewBox.cx}
                              y={viewBox.cy}
                              textAnchor="middle"
                              dominantBaseline="middle"
                            >
                              <tspan
                                x={viewBox.cx}
                                y={viewBox.cy}
                                className="text-xl sm:text-2xl lg:text-3xl font-regular tracking-tighter"
                              >
                                {animatedTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 })}
                              </tspan>
                            </text>
                          )
                        }
                        return null
                      }}
                    />
                  </Pie>
                </PieChart>
              </ChartContainer>
            </div>
          </div>

          {/* Coluna Direita - Lista de Categorias */}
          <div className="flex-1 lg:max-w-sm w-full flex items-start justify-center">
            <style dangerouslySetInnerHTML={{__html: `
              .category-list-scrollbar::-webkit-scrollbar {
                width: 6px;
              }
              .category-list-scrollbar::-webkit-scrollbar-track {
                background: transparent;
              }
              .category-list-scrollbar::-webkit-scrollbar-thumb {
                background-color: #D1D5DB;
                border-radius: 3px;
              }
              .category-list-scrollbar::-webkit-scrollbar-thumb:hover {
                background-color: #9CA3AF;
              }
            `}} />
            <div 
              className="space-y-2 sm:space-y-3 overflow-y-auto pr-2 py-2 sm:py-4 w-full category-list-scrollbar max-h-[250px] sm:max-h-[300px] lg:max-h-[350px]"
              style={{
                scrollbarWidth: 'thin',
                scrollbarColor: '#D1D5DB transparent'
              }}
            >
              {allCategoriesData.map((item, index) => (
                <div 
                  key={item.category} 
                  className="flex items-center justify-between gap-2 sm:gap-4 text-xs sm:text-sm animate-transaction-fade-in"
                  style={{
                    animationDelay: `${index * 50}ms`,
                    animationFillMode: 'both'
                  }}
                >
                  <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                    <div 
                      className="w-3 h-3 sm:w-4 sm:h-4 rounded-full flex-shrink-0"
                      style={{ backgroundColor: item.fill }}
                    />
                    <span className={`font-regular truncate ${item.expenses === 0 ? 'text-muted-foreground/60' : 'text-foreground'}`}>
                      {item.category}
                    </span>
                  </div>
                  <div className="flex flex-col items-end gap-0.5 sm:gap-1 flex-shrink-0">
                    <span className={`text-sm sm:text-base font-semibold ${item.expenses === 0 ? 'text-muted-foreground/60' : 'text-foreground'}`}>
                      {item.expenses.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 })}
                    </span>
                    <span className={`text-xs sm:text-sm ${item.expenses === 0 ? 'text-muted-foreground/40' : 'text-muted-foreground'}`}>
                      {item.percentage.toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

