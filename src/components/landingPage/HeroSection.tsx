import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader } from 'lucide-react';

interface HeroSectionProps {
  onOpenWaitlist: () => void;
}

const HeroSection = ({ onOpenWaitlist }: HeroSectionProps) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <section className="relative w-full py-12 md:py-20 px-6 md:px-12 overflow-hidden bg-background">
      {/* Cosmic particle effect (background dots) */}
      <div className="absolute inset-0 cosmic-grid opacity-30"></div>
    
      
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[600px]">
          {/* Coluna Esquerda - Conteúdo */}
            <div className={`space-y-6 transition-all duration-700 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              
              
              <h1 className="text-4xl md:text-6xl lg:text-6xl font-medium tracking-tighter text-balance text-foreground">
                <span className='text-[#208251]'>Controle</span> seus <span className="text-foreground">gastos</span> sem complicações
              </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl text-balance">
              Registre e acompanhe seus gastos sem planilhas ou apps.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Button 
                className="bg-black rounded-full text-white hover:bg-[#208251] hover:text-white text-base h-12 px-8 transition-ease-in-out duration-300 min-h-[48px]"
                onClick={onOpenWaitlist}
              >
                Entrar na fila de espera
              </Button>
            </div>
          </div>
          
          {/* Coluna Direita - Vídeo */}
          <div className={`flex justify-center transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
            <div className="relative rounded-xl overflow-hidden shadow-2xl max-w-xs w-full">
              <video 
                autoPlay 
                loop 
                muted 
                playsInline
                className="w-full h-auto rounded-xl"
              >
                <source src="/MOCKUP.mp4" type="video/mp4" />
                Seu navegador não suporta vídeos.
              </video>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection;