import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
// Removed unused import
import { Link } from 'react-router-dom';
import { DottedSurface } from '@/components/ui/dotted-surface';

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
    <section className="relative w-full py-12 md:py-20 px-6 md:px-12 overflow-hidden">
      {/* Dotted Surface Background */}
      <div className="absolute inset-0 overflow-hidden">
        <DottedSurface className="absolute inset-0" />
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[600px]">
          {/* Coluna Esquerda - Conteúdo */}
            <div className={`space-y-6 transition-all duration-700 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tighter text-balance text-foreground flex items-center flex-wrap gap-2 ">
                <span className='text-[#208251]'>Controle</span> seus <span className="text-foreground">gastos</span> sem{' '}
                <img 
                  src="/icon3dV2.png" 
                  alt="Prancheta" 
                  className="inline-block h-12 md:h-16 lg:h-20 w-auto object-contain "
                  style={{ transform: 'rotate(-7deg)' }}
                />{' '}
                complicações
              </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl text-balance">
              Registre e acompanhe seus gastos sem planilhas ou apps.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Button 
                className="bg-[#208251] hover:bg-[#2A8E4D] text-white rounded-full px-20 py-7 text-lg font-normal tracking-tighter flex items-center gap-2 transition-ease-in-out duration-300 shadow-[inset_0_0_25px_#16e26d,inset_0_0_8px_white]"
                asChild
              >
                <a href="https://wa.me/5571983486204?text=Ol%C3%A1%20Codorna!!" target="_blank" rel="noopener noreferrer">Começar Gratuitamente</a>
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