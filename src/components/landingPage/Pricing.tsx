import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface PricingProps {
  onOpenWaitlist: () => void;
}

const Pricing = ({ onOpenWaitlist }: PricingProps) => {
  const plans = [
    {
      name: "Gratuito",
      price: "Grátis",
      description: "Para sempre",
      features: [
        "Acesso completo à plataforma",
        "IA no WhatsApp",
        "Todas as funcionalidades",
        "Suporte da comunidade"
      ],
      buttonText: "Comece Agora",
      isPro: false
    },
    {
      name: "PRO",
      price: "R$ 19,00",
      description: "/mês",
      features: [
        "Acesso completo à plataforma",
        "IA no WhatsApp",
        "Acesso antecipado a novas funcionalidades",
        "Suporte prioritário"
      ],
      buttonText: "Assinar agora",
      isPro: true
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
        
        <div className="flex justify-center max-w-3xl mx-auto">
          {plans.map((plan, index) => (
            <div 
              key={index}
              className={`p-8 rounded-3xl flex flex-col h-[480px] w-full max-w-sm transition-all duration-300 relative ${
                plan.isPro 
                  ? "bg-[#208251] text-white" 
                  : "bg-white border border-gray-200 text-gray-900"
              }`}
            >
              {/* Banner Beta */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-11 py-1 bg-[#208251] text-white text-sm rounded-full font-medium">
                Beta
              </div>
              <div className="flex flex-col h-full">
                <div className="mb-6">
                  <h3 className={`text-lg font-regular mb-3 ${plan.isPro ? 'text-white' : 'text-gray-700'}`}>{plan.name}</h3>
                  <div className="mb-4">
                    <div className={`text-5xl font-bold tracking-tighter ${plan.isPro ? 'text-white' : 'text-gray-900'}`}>{plan.price}</div>
                    <div className={`text-sm mt-1 ${plan.isPro ? 'text-white/80' : 'text-gray-500'}`}>{plan.description}</div>
                  </div>
                  
                  <div className={`border-t mb-6 ${plan.isPro ? 'border-white/30' : 'border-gray-300'}`}></div>
                </div>
                
                <div className="flex-1 space-y-4 mb-8">
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
                
                {plan.isPro ? (
                  <Button 
                    className="w-full rounded-full font-regular py-6 transition-all duration-200 bg-white text-[#208251] hover:bg-gray-100"
                    asChild
                  >
                    <a href="https://pay.kirvano.com/0601b095-cab7-4769-9ea6-0b498f96a32b" target="_blank" rel="noopener noreferrer">
                      {plan.buttonText}
                    </a>
                  </Button>
                ) : (
                  <Button 
                    className="w-full rounded-full font-regular py-6 transition-all duration-200 bg-[#208251] text-white hover:bg-[#208251]/90"
                    asChild
                  >
                    <Link to="/signup">{plan.buttonText}</Link>
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
        
      </div>
    </section>
  );
};

export default Pricing;
