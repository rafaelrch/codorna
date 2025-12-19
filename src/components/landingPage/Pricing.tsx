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
        "Registro de despesas e receitas",
        "Registro de metas",
        "Pergunte o que quiser",
        "Dashboard detalhado para acompanhamento e relatórios",
        "Saldo do mês"
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
          {plans.map((plan, index) => {
            if (plan.isPro) {
              return (
                <div 
                  key={index}
                  className="rounded-[35px] flex flex-col min-h-[600px] w-full max-w-sm mx-auto md:mx-0 transition-all duration-300 bg-[#208251] text-white relative overflow-hidden shadow-[0_20px_120px_rgba(0,0,0,0.3)]"
                  style={{
                    background: '#208251',
                    backgroundImage: 'radial-gradient(circle at bottom right,rgba(107, 212, 133, 0.66), transparent 60%)'
                  }}
                >
                  {/* Primeira parte: Card quadrado com badge/preço e botão */}
                  <div className="mb-2 p-4 space-y-6 bg-white rounded-[35px] overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.4)]">
                    {/* Parte de cima: Card com background verde 10% opacidade */}
                    <div className="bg-[#D5E6DC] p-4 h-52 rounded-[31px] flex flex-col justify-between">
                      {/* Badge Mensal - Topo */}
                      <div className="bg-[#142923] border-2 border-[#208251] rounded-full px-8 py-1 flex items-center gap-2 w-fit">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#65DA7C]">
                          <path d="M12 2L2 7l10 5 10-5-10-5z" fill="currentColor"/>
                          <circle cx="12" cy="9" r="2" fill="currentColor" opacity="0.4"/>
                          <path d="M7 13l5 5 5-5M7 17l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                        </svg>
                        <span className="text-[#65DA7C] tracking-tighter text-sm font-medium">Mensal</span>
                      </div>
                      {/* Preço - Rodapé */}
                      <div className="flex items-end gap-1">
                        <div>
                          <span className="text-3xl md:text-3xl font-regular tracking-tighter text-[#000000]">R$</span>
                          <span className="text-4xl md:text-6xl font-bold tracking-tighter text-[#000000]">19</span>
                        </div>
                        
                        
                        <div className='flex flex-col items-start '>
                          <span className="text-lg md:text-lg font-medium tracking-tighter text-[#000000]">,90</span>
                          <span className="text-2xl tracking-tighter text-[#000000]">/mês</span>
                        </div>
                        
                      </div>
                    </div>
                    {/* Parte de baixo: Botão */}
                    <Button 
                      className="bg-[#208251] hover:bg-[#2A8E4D] text-white rounded-full px-20 py-7 text-lg font-normal tracking-tighter flex items-center gap-2 transition-ease-in-out duration-300 shadow-[inset_0_0_25px_#16e26d,inset_0_0_8px_white,0_7px_10px_rgba(0,0,0,0.3)]"
                      asChild
                    >
                      <a href={plan.buttonLink} target="_blank" rel="noopener noreferrer">
                        Garanta já
                      </a>
                    </Button>
                  </div>
                  
                  {/* Segunda parte: Features */}
                  <div className="flex-1 space-y-3 md:space-y-3 p-6">
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="h-5 w-5 flex items-center justify-center text-white flex-shrink-0">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5 12L10 17L19 8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                        <span className="tracking-tight font-regular text-md text-white">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            }
            
            // Card Trial (mantém o design original)
            return (
              <div 
                key={index}
                className="p-6 md:p-8 rounded-3xl flex flex-col min-h-[600px] w-full max-w-sm mx-auto md:mx-0 transition-all duration-300 bg-white border border-gray-200 text-gray-900"
              >
                <div className="flex flex-col h-full">
                  <div className="mb-6">
                    <h3 className="text-lg font-regular mb-3 text-gray-700">{plan.name}</h3>
                    <div className="mb-4">
                      <div className="text-3xl md:text-5xl font-bold tracking-tighter text-gray-900">{plan.price}</div>
                      <div className="text-base mt-1 text-gray-500">{plan.description}</div>
                    </div>
                    
                    <div className="border-t mb-6 border-gray-300"></div>
                  </div>
                  
                  <div className="flex-1 space-y-3 md:space-y-3 mb-6 md:mb-8">
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="h-4 w-4 rounded-full flex items-center justify-center bg-gray-200 text-[#438759]">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5 12L10 17L19 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                        <span className="text-sm tracking-tight font-regular text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Button 
                    className="w-full rounded-full font-regular py-5 md:py-7 transition-all duration-200 bg-[#208251] tracking-tighter font-regular text-white hover:bg-[#208251]/90"
                    asChild
                  >
                    <a href={plan.buttonLink} target="_blank" rel="noopener noreferrer">
                      {plan.buttonText}
                    </a>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
        
      </div>
    </section>
  );
};

export default Pricing;
