import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useSidebar } from '@/components/ui/sidebar';
import { PanelLeft, MessageCircle } from 'lucide-react';

export default function Support() {
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed";

  const handleWhatsAppClick = () => {
    window.open(
      'https://wa.me/5571999682356?text=Ol%C3%A1%2C%20equipe%20de%20Suporte!%20Estou%20com%20um%20problema%20no%20Codorna!',
      '_blank'
    );
  };

  return (
    <div className="min-h-screen bg-[#EBEBEB] flex flex-col justify-center p-4">
      <Card className="max-w-2xl bg-[#F8F6F7] rounded-2xl mx-auto w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleSidebar}
                    className="h-8 w-8 text-gray-900 hover:bg-gray-200"
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
            Suporte
          </CardTitle>
          <CardDescription>
            Entre em contato com nossa equipe de suporte
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="h-20 w-20 rounded-full bg-[#D1F2E8] flex items-center justify-center">
                <MessageCircle className="h-10 w-10 text-[#1f8150]" />
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-gray-900">
                Precisa de Ajuda?
              </h3>
              <p className="text-gray-600">
                Nossa equipe de suporte está pronta para ajudar você. 
                Clique no botão abaixo para falar conosco no WhatsApp.
              </p>
            </div>

            <Button
              onClick={handleWhatsAppClick}
              className="w-full bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:from-[#20BA5A] hover:to-[#0E7A6E] text-white"
              size="lg"
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              Falar com Suporte no WhatsApp
            </Button>

            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Horário de atendimento: Segunda a Sexta, 9h às 18h
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


