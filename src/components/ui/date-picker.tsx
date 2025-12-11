import * as React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  date?: Date;
  onSelect?: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function DatePicker({
  date,
  onSelect,
  placeholder = "Selecione uma data",
  disabled = false,
  className,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [currentMonth, setCurrentMonth] = React.useState(date || new Date());
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(date);

  // Sincronizar quando a prop date mudar externamente
  React.useEffect(() => {
    setSelectedDate(date);
    if (date) {
      setCurrentMonth(date);
    }
  }, [date]);

  // Nomes dos meses em português
  const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  // Dias da semana
  const weekDays = ["D", "S", "T", "Q", "Q", "S", "S"];

  // Obter primeiro dia do mês e número de dias
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek, year, month };
  };

  // Navegar para o mês anterior
  const goToPreviousMonth = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  // Navegar para o próximo mês
  const goToNextMonth = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  // Verificar se uma data é hoje
  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentMonth.getMonth() === today.getMonth() &&
      currentMonth.getFullYear() === today.getFullYear()
    );
  };

  // Verificar se uma data está selecionada
  const isSelected = (day: number) => {
    if (!selectedDate) return false;
    return (
      day === selectedDate.getDate() &&
      currentMonth.getMonth() === selectedDate.getMonth() &&
      currentMonth.getFullYear() === selectedDate.getFullYear()
    );
  };

  // Selecionar um dia
  const handleDayClick = (day: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    setSelectedDate(newDate);
    onSelect?.(newDate);
    setOpen(false);
  };

  // Formatar data para exibição no input
  const formatDisplayDate = (date: Date | undefined): string => {
    if (!date) return "";
    return format(date, "dd/MM/yyyy", { locale: ptBR });
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);
  const days = [];

  // Dias do mês anterior (para preencher a primeira semana)
  const prevMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 0);
  const daysInPrevMonth = prevMonth.getDate();
  
  for (let i = startingDayOfWeek - 1; i >= 0; i--) {
    days.push({ day: daysInPrevMonth - i, isCurrentMonth: false });
  }

  // Dias do mês atual
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({ day: i, isCurrentMonth: true });
  }

  // Dias do próximo mês (para completar a grade)
  const totalCells = 42; // 6 semanas x 7 dias
  const remainingDays = totalCells - days.length;
  for (let i = 1; i <= remainingDays; i++) {
    days.push({ day: i, isCurrentMonth: false });
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-full justify-start text-left font-normal bg-[#F8F6F7] border rounded-lg",
            !selectedDate && "text-muted-foreground",
            selectedDate && "font-medium text-black",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 text-black" />
          {selectedDate ? formatDisplayDate(selectedDate) : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-[400px] p-6 z-[9999] bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-black/7 pointer-events-auto"
        align="start"
        side="bottom"
        sideOffset={8}
        onOpenAutoFocus={(e) => e.preventDefault()}
        onInteractOutside={(e) => {
          const target = e.target as HTMLElement;
          // Não fechar quando clicar dentro do Dialog
          if (target.closest('[role="dialog"]')) {
            e.preventDefault();
          }
        }}
        onClick={(e) => {
          // Garantir que os cliques dentro do calendário funcionem
          e.stopPropagation();
        }}
        onPointerDown={(e) => {
          // Garantir que os eventos de pointer funcionem
          e.stopPropagation();
        }}
        style={{ zIndex: 9999 }}
      >
        {/* Cabeçalho */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-[#1a1a1a]">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={goToPreviousMonth}
              onMouseDown={(e) => e.stopPropagation()}
              className="p-1 text-[#666666] hover:text-black transition-colors cursor-pointer"
              type="button"
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </button>
            <button
              onClick={goToNextMonth}
              onMouseDown={(e) => e.stopPropagation()}
              className="p-1 text-[#666666] hover:text-black transition-colors cursor-pointer"
              type="button"
            >
              <ChevronRightIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Labels dos dias da semana */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map((day, index) => (
            <div
              key={index}
              className="text-xs font-medium text-[#999999] uppercase text-center py-2"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Grid do calendário */}
        <div className="grid grid-cols-7 gap-1 ">
          {days.map(({ day, isCurrentMonth }, index) => {
            const isSelectedDay = isCurrentMonth && isSelected(day);
            const isTodayDay = isCurrentMonth && isToday(day);

            return (
              <button
                key={index}
                onClick={(e) => {
                  if (isCurrentMonth) {
                    handleDayClick(day, e);
                  }
                }}
                onMouseDown={(e) => {
                  e.stopPropagation();
                  if (!isCurrentMonth) {
                    e.preventDefault();
                  }
                }}
                disabled={!isCurrentMonth}
                className={cn(
                  "w-10 h-10 flex rounded-[40%] items-center justify-center text-sm transition-all duration-200 ease-in-out",
                  !isCurrentMonth && "text-[#e0e0e0] cursor-default pointer-events-none",
                  isCurrentMonth && !isSelectedDay && "text-[#333333] hover:bg-[#f5f5f5] hover:rounded-[40%] cursor-pointer active:scale-95",
                  isSelectedDay && "bg-[#218150] text-white rounded-[40%] font-medium shadow-[0_15px_20px_rgba(0,0,0,0.2)]",
                  isTodayDay && !isSelectedDay && "font-semibold "
                )}
                type="button"
              >
                {day}
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}

