import React from 'react';
import { Button } from '@/components/ui/button';
// import { Link } from 'react-router-dom'; // Comentado - não usado mais

interface PricingProps {
  onOpenWaitlist: () => void;
}

const Pricing = ({ onOpenWaitlist }: PricingProps) => {
  const plans = [
    {
      name: "Trial",
      price: "Grátis",
      description: "Período de 7 dias grátis",
      features: [
        "Acesso a Inteligência Artificial no WhatsApp",
        "Controle de gastos via WhatsApp por texto, áudio e imagem",
        "Criação de Metas",
        "Acesso a plataforma com Gráficos Interativos para melhor análise",
        "Relatórios completos"
      ],
      buttonText: "Comece Agora",
      isPro: false,
      buttonLink: "https://wa.me/5571983486204?text=Ol%C3%A1%20Codorna!"
    },
    {
      name: "PRO",
      price: "R$ 19,90",
      description: "/mês",
      features: [
        "Tudo do trial ilimitado",
        "Acesso antecipado a novidades"
      ],
      buttonText: "Assinar agora",
      isPro: true,
      buttonLink: "https://pay.kirvano.com/75a61fc9-724d-42dc-9a97-b147a99e425e"
    }
  ];
  
  return (
    <section id="pricing" className="w-full py-20 px-6 md:px-12 bg-white">
      <div className="max-w-5xl mx-auto space-y-16">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-6xl font-medium tracking-tighter text-gray-900">
            Escolha seu <span className="text-[#208251]">plano</span>
          </h2>
        </div>
        
        <div className="flex flex-col md:flex-row justify-center gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <div 
              key={index}
              className={`p-6 md:p-8 rounded-3xl flex flex-col h-auto w-full max-w-sm mx-auto md:mx-0 transition-all duration-300 ${
                plan.isPro 
                  ? "bg-[#208251] text-white" 
                  : "bg-white border border-gray-200 text-gray-900"
              }`}
            >
              <div className="flex flex-col h-full">
                <div className="mb-6">
                  <h3 className={`text-lg font-regular mb-3 ${plan.isPro ? 'text-white' : 'text-gray-700'}`}>{plan.name}</h3>
                  <div className="mb-4">
                    <div className={`text-3xl md:text-5xl font-bold tracking-tighter ${plan.isPro ? 'text-white' : 'text-gray-900'}`}>{plan.price}</div>
                    <div className={`text-base mt-1 ${plan.isPro ? 'text-white/80' : 'text-gray-500'}`}>{plan.description}</div>
                  </div>
                  
                  <div className={`border-t mb-6 ${plan.isPro ? 'border-white/30' : 'border-gray-300'}`}></div>
                </div>
                
                <div className="flex-1 space-y-3 md:space-y-4 mb-6 md:mb-8">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className={`h-4 w-4 rounded-full flex items-center justify-center ${
                        plan.isPro ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-900'
                      }`}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5 12L10 17L19 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <span className={`text-sm ${plan.isPro ? 'text-white' : 'text-gray-700'}`}>{feature}</span>
                    </div>
                  ))}
                </div>
                
                <Button 
                  className={`w-full rounded-full font-regular py-4 md:py-6 transition-all duration-200 ${
                    plan.isPro 
                      ? "bg-white text-[#208251] hover:bg-gray-100" 
                      : "bg-[#208251] text-white hover:bg-[#208251]/90"
                  }`}
                  asChild
                >
                  <a href={plan.buttonLink} target="_blank" rel="noopener noreferrer">
                    {plan.buttonText}
                  </a>
                </Button>
              </div>
            </div>
          ))}
        </div>
        
      </div>
    </section>
  );
};

export default Pricing;
