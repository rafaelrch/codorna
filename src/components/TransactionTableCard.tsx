"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { transactionService, Transaction } from "@/services/transactionService"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import {
  ShoppingBagIcon,
  HomeModernIcon,
  AcademicCapIcon,
  BuildingLibraryIcon,
  TruckIcon,
  BanknotesIcon,
  HeartIcon,
  GiftTopIcon,
  WalletIcon,
} from "@heroicons/react/24/solid"

interface TransactionTableCardProps {
  startDate?: string
  endDate?: string
}

// Paleta fixa para gerar cores determinísticas por categoria
const colorPalette = [
  "#0EA5E9",
  "#F97316",
  "#8B5CF6",
  "#10B981",
  "#FACC15",
  "#EC4899",
  "#6366F1",
  "#14B8A6",
  "#F59E0B",
  "#22C55E",
]

const getCategoryColor = (category?: string) => {
  if (!category) return "#94A3B8"
  const hash = category.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return colorPalette[hash % colorPalette.length]
}

// Ícones por categoria (fallback em WalletIcon)
const getCategoryIcon = (category?: string) => {
  if (!category) return WalletIcon
  const key = category.toLowerCase()
  if (key.includes("mercado") || key.includes("super") || key.includes("compra")) return ShoppingBagIcon
  if (key.includes("casa") || key.includes("aluguel") || key.includes("imóvel") || key.includes("aluguel")) return HomeModernIcon
  if (key.includes("educ") || key.includes("faculdade") || key.includes("curso")) return AcademicCapIcon
  if (key.includes("imposto") || key.includes("banco")) return BuildingLibraryIcon
  if (key.includes("transporte") || key.includes("uber") || key.includes("carro")) return TruckIcon
  if (key.includes("salário") || key.includes("entrada") || key.includes("renda")) return BanknotesIcon
  if (key.includes("saúde") || key.includes("hospital") || key.includes("médic") || key.includes("farm")) return HeartIcon
  if (key.includes("presente") || key.includes("gift")) return GiftTopIcon
  return WalletIcon
}

const formatCurrency = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })

const formatDate = (dateString: string) => {
  // Usar o método do transactionService para evitar problemas de timezone
  const fullDate = transactionService.formatDateForDisplay(dateString);
  // Converter para formato "DD de mmm" (ex: "09 de dez.")
  const [day, month, year] = fullDate.split('/');
  const monthNames = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
  const monthIndex = parseInt(month) - 1;
  return `${day} de ${monthNames[monthIndex]}.`;
}

export function TransactionTableCard({ startDate, endDate }: TransactionTableCardProps) {
  const gridCols = "grid grid-cols-[1.5fr,1fr,1fr,1fr,1fr] items-center"
  const gridColsMobile = "grid grid-cols-[1fr,auto] items-center gap-2"
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const data = await transactionService.getTransactions({ startDate, endDate })
        // Ordenar por data_hora descendente
        const sorted = data.sort(
          (a, b) => new Date(b.data_hora).getTime() - new Date(a.data_hora).getTime(),
        )
        setTransactions(sorted)
      } catch (error) {
        toast({
          title: "Erro",
          description: "Não foi possível carregar as transações.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [startDate, endDate, toast])

  const periodLabel = useMemo(() => {
    if (startDate && endDate) {
      return transactionService.formatDateRangeAbbreviated(startDate, endDate)
    }
    return "Período selecionado"
  }, [startDate, endDate])

  return (
    <Card className="h-full rounded-xl sm:rounded-2xl lg:rounded-3xl">
      <CardHeader className="items-start p-4 sm:p-6 pb-2 sm:pb-3">
        <CardTitle className="text-2xl sm:text-xl font-semibold">Transações</CardTitle>
        <CardDescription className="text-sm sm:text-sm">{periodLabel}</CardDescription>
      </CardHeader>
      <CardContent className="px-2 sm:px-4 pb-4 flex flex-col h-full">
        {loading ? (
          <div className="space-y-2">
            {/* Header skeleton - desktop */}
            <div className={`hidden md:grid ${gridCols} px-2 sm:px-5 py-2 sm:py-3 text-xs font-medium text-muted-foreground`}>
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-14" />
              <Skeleton className="h-4 w-14" />
              <Skeleton className="h-4 w-14" />
              <Skeleton className="h-4 w-16 justify-self-end" />
            </div>
            {Array.from({ length: 5 }).map((_, idx) => (
              <div key={idx} className={`hidden md:grid ${gridCols} gap-3 rounded-lg px-2 sm:px-5 py-2 sm:py-3`}>
                <div className="flex items-center gap-3">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-4 w-28" />
                </div>
                <Skeleton className="h-4 w-14" />
                <Skeleton className="h-4 w-14" />
                <Skeleton className="h-4 w-14" />
                <Skeleton className="h-4 w-16 justify-self-end" />
              </div>
            ))}
            {/* Mobile skeleton */}
            {Array.from({ length: 3 }).map((_, idx) => (
              <div key={`mobile-${idx}`} className={`md:hidden ${gridColsMobile} gap-2 rounded-lg px-2 py-3 border border-gray-200`}>
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-20 justify-self-end" />
              </div>
            ))}
          </div>
        ) : transactions.length === 0 ? (
          <div className="flex h-32 items-center justify-center text-xs sm:text-sm text-muted-foreground px-4">
            Nenhuma transação no período.
          </div>
        ) : (
          <div className="flex flex-col flex-1 min-h-0">
            {/* Header - fixo no topo - Desktop only */}
            <div className={`hidden md:grid ${gridCols} px-2 sm:px-5 py-2 sm:py-3 border-t border-black/7 text-xs sm:text-sm font-semibold text-black tracking-wide flex-shrink-0`}>
              <span>Descrição</span>
              <span>Data</span>
              <span>Tipo</span>
              <span>Método</span>
              <span className="justify-self-end">Valor</span>
            </div>
            {/* Rows - área scrollável */}
            <div className="flex-1 overflow-y-auto max-h-[400px] sm:max-h-[500px] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400">
              {/* Desktop view */}
              <div className="hidden md:block">
                {transactions.map((tx, index) => (
                  <div
                    key={tx.id}
                    className={`${gridCols} gap-3 px-2 sm:px-5 py-2 sm:py-3 border-t border-black/7 animate-transaction-fade-in`}
                    style={{
                      animationDelay: `${index * 50}ms`,
                      animationFillMode: 'both'
                    }}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="h-7 w-7 sm:h-8 sm:w-8 rounded-full flex items-center justify-center text-white flex-shrink-0"
                        style={{ backgroundColor: getCategoryColor(tx.categoria) }}
                      >
                        {(() => {
                          const Icon = getCategoryIcon(tx.categoria)
                          return <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        })()}
                      </div>
                      <p className="text-xs sm:text-sm font-regular text-muted-foreground truncate">{tx.descricao || tx.categoria}</p>
                    </div>
                    <span className="text-xs sm:text-sm font-regular text-muted-foreground whitespace-nowrap">{formatDate(tx.data_hora)}</span>
                    <span className="text-xs sm:text-sm font-regular text-muted-foreground whitespace-nowrap">
                      {tx.tipo === "entrada" ? "Entrada" : "Saída"}
                    </span>
                    <span className="text-xs sm:text-sm font-regular text-muted-foreground whitespace-nowrap">{tx.metodo || "-"}</span>
                    <p className="text-xs sm:text-sm font-regular justify-self-end text-muted-foreground whitespace-nowrap">
                      {formatCurrency(Number(tx.valor))}
                    </p>
                  </div>
                ))}
              </div>
              {/* Mobile view */}
              <div className="md:hidden space-y-2">
                {transactions.map((tx, index) => (
                  <div
                    key={tx.id}
                    className="px-3 py-3 border border-gray-200 rounded-lg animate-transaction-fade-in"
                    style={{
                      animationDelay: `${index * 50}ms`,
                      animationFillMode: 'both'
                    }}
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <div
                          className="h-8 w-8 rounded-full flex items-center justify-center text-white flex-shrink-0"
                          style={{ backgroundColor: getCategoryColor(tx.categoria) }}
                        >
                          {(() => {
                            const Icon = getCategoryIcon(tx.categoria)
                            return <Icon className="h-4 w-4" />
                          })()}
                        </div>
                        <p className="text-sm font-medium text-foreground truncate">{tx.descricao || tx.categoria}</p>
                      </div>
                      <p className="text-sm font-semibold text-foreground whitespace-nowrap">
                        {formatCurrency(Number(tx.valor))}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <span>{formatDate(tx.data_hora)}</span>
                      <span>•</span>
                      <span>{tx.tipo === "entrada" ? "Entrada" : "Saída"}</span>
                      {tx.metodo && (
                        <>
                          <span>•</span>
                          <span>{tx.metodo}</span>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

