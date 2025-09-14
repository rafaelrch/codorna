import { ReactNode } from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';

interface PageHeaderProps {
  title: string;
  children?: ReactNode;
}

export function PageHeader({ title, children }: PageHeaderProps) {
  return (
    <div className="bg-[#EBEBEB] px-6 pt-10 pb--5">
      
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="lg:hidden" />
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        </div>
        {children && (
          <div className="flex items-center gap-4">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}
