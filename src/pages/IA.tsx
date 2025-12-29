import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useSidebar } from '@/components/ui/sidebar';
import { PanelLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HoverBorderGradient } from '@/components/ui/hover-border-gradient';

export default function IA() {
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed";

  const handleWhatsAppClick = () => {
    window.open('https://wa.me/5571983486204', '_blank');
  };

  return (
    <div className="min-h-screen bg-[#EBEBEB] flex flex-col">
      {/* Header com botão de toggle do sidebar */}
      <div className="bg-[#EBEBEB] px-4 sm:px-6 py-3 sm:py-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSidebar}
                className="h-8 w-8 sm:h-9 sm:w-9 text-gray-900 hover:bg-gray-200"
              >
                <PanelLeft className="h-4 w-4" />
                <span className="sr-only">
                  {isCollapsed ? "Expandir sidebar" : "Colapsar sidebar"}
                </span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              {isCollapsed ? "Expandir sidebar" : "Colapsar sidebar"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="flex justify-center text-center w-full max-w-md px-4">
          <HoverBorderGradient
            containerClassName="rounded-full transition-ease-in-out duration-500 hover:-translate-y-3 hover:shadow-[0_30px_30px_rgba(0,0,0,0.1)] w-full sm:w-auto"
            as="button"
            className="bg-white text-[#04b45c] flex items-center justify-center space-x-2 px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base w-full sm:w-auto"
            onClick={handleWhatsAppClick}
          >
            <WhatsAppIcon />
            <span className="whitespace-nowrap">Conversar com o Codorna</span>
          </HoverBorderGradient>
        </div>
      </div>
    </div>
  );
}

const WhatsAppIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={16}
      height={16}
      fill="currentColor"
      className="bi bi-whatsapp"
      viewBox="0 0 16 16"
    >
      <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z" />
    </svg>
  );
};
