import React from 'react';
import { Button } from '@/components/ui/button';

interface AdvisorSectionProps {
  onOpenWaitlist: () => void;
}

const AdvisorSection = ({ onOpenWaitlist }: AdvisorSectionProps) => {
  const scrollToPricing = () => {
    const pricingSection = document.getElementById('pricing');
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Dados para os 4 carrosséis
  const carouselData = [
    [
      "Paguei 50 reais de gasolina",
      "Recebi 3 mil reais de salário",
      "Gastei 200 reais no mercado",
      "Registrei entrada de 500 reais",
      "Paguei conta de luz de 120 reais",
      "Recebi freela de 800 reais",
      "Gastei 80 reais com restaurante",
      "Registrei despesa de 150 reais",
    ],
    [
      "Quanto gastei esse mês?",
      "Me mostre minhas entradas",
      "Quais foram meus gastos hoje?",
      "Como está meu saldo atual?",
      "Quanto recebi essa semana?",
      "Me dê o resumo do mês",
      "Quais são minhas despesas?",
      "Mostre minhas transações",
    ],
    [
      "Relatório do mês",
      "Relatório da semana",
      "Relatório do dia",
      "Relatório do ano",
      "Gráfico de gastos mensais",
      "Análise financeira da semana",
      "Resumo financeiro do mês",
      "Estatísticas do ano",
    ],
    [
      "Criar meta de 5 mil reais",
      "Aportar 200 reais na meta",
      "Como criar uma meta?",
      "Adicionar 500 reais na reserva",
      "Quero criar meta de viagem",
      "Aportar na meta de emergência",
      "Criar meta de investimento",
      "Dicas para economizar dinheiro",
      "Como melhorar minhas finanças?",
      "Me ajude a poupar mais",
      "Dicas de educação financeira",
      "Como organizar meu dinheiro?",
    ],
  ];

  return (
    <section className="w-full py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-12">
        {/* Título e Subtítulo */}
        <div className="text-center space-y-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-medium tracking-tighter text-gray-900">
            Interaja com o <span className="text-[#208251]">Codorna 24h</span> por dia
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Pergunte o que quiser e como quiser sobre as suas finanças. Veja alguns exemplos abaixo.
          </p>
        </div>
      </div>

      {/* 4 Carrosséis - Largura total da tela */}
      <div className="w-full space-y-8 mt-12">
        {carouselData.map((items, carouselIndex) => {
          const isReverse = carouselIndex % 2 === 1; // Alterna direção: 0=direita, 1=esquerda
          
          return (
            <div key={carouselIndex} className="w-full overflow-hidden relative">
              {/* Gradiente esquerdo */}
              <div className="absolute left-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none" />
              
              {/* Gradiente direito */}
              <div className="absolute right-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none" />
              
              <div className={`flex gap-4 ${isReverse ? 'animate-scroll-reverse' : 'animate-scroll-forward'}`}>
                {/* Duplicar items para criar loop infinito */}
                {[...items, ...items, ...items].map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    className="group flex-shrink-0 px-4 py-2.5 md:px-7 md:py-5 rounded-full border-2 border-[#208251] bg-white hover:bg-[#208251] duration-500 transition-colors whitespace-nowrap"
                  >
                    <span className="text-[#208251] group-hover:text-white text-sm md:text-lg font-normal tracking-tighter transition-colors duration-500">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Botão de Assinar */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-center pt-12">
        <Button
          onClick={scrollToPricing}
          className="bg-[#208251] hover:bg-[#1a6941] text-white rounded-full px-20 py-7 text-lg font-normal tracking-tighter flex items-center gap-2 transition-ease-in-out duration-300 shadow-[inset_0_0_25px_#16e26d,inset_0_0_8px_white,0_20px_20px_rgba(0,0,0,0.2)]"
        >
          QUERO ASSINAR
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="ml-1"
          >
            <path
              d="M5 12H19M19 12L12 5M19 12L12 19"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Button>
      </div>
    </section>
  );
};

export default AdvisorSection;

