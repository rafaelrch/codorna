import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useSidebar } from '@/components/ui/sidebar';
import { PanelLeft } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  children?: ReactNode;
}

export function PageHeader({ title, subtitle, children }: PageHeaderProps) {
  const { toggleSidebar } = useSidebar();

  return (
    <div className="bg-[#EBEBEB] px-4 sm:px-6 pt-6 sm:pt-10 pb-4 sm:pb-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleSidebar}
                  className="h-8 w-8 sm:h-9 sm:w-9 text-gray-900 hover:bg-gray-200 flex-shrink-0"
                >
                  <PanelLeft className="h-4 w-4" />
                  <span className="sr-only">
                    Abrir menu
                  </span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                Abrir menu
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 truncate">{title}</h1>
            {subtitle && (
              <p className="text-sm sm:text-base text-gray-600 mt-1">{subtitle}</p>
            )}
          </div>
        </div>
        {children && (
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 flex-shrink-0">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}
