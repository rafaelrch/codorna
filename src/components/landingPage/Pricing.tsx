import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Link } from 'react-router-dom';

const Pricing = () => {
  const plans = [
    {
      name: "Básico",
      price: "Grátis",
      description: "Perfeito para começar a organizar suas finanças pessoais",
      features: [
        "Até 50 transações/mês",
        "Controle básico de gastos",
        "Relatórios simples",
        "Suporte por email",
        "1 conta bancária"
      ],
      buttonText: "Começar grátis",
      buttonVariant: "outline",
      popular: false
    },
    {
      name: "Premium",
      price: "R$ 19,90",
      period: "por mês",
      description: "Ideal para quem quer controle total das finanças",
      features: [
        "Transações ilimitadas",
        "Dashboard avançado",
        "Múltiplas contas bancárias",
        "Metas financeiras",
        "Relatórios detalhados",
        "Suporte prioritário",
        "Backup automático"
      ],
      buttonText: "Teste 14 dias grátis",
      buttonVariant: "default",
      popular: true
    }
  ];
  
  return (
    <section id="pricing" className="w-full py-20 px-6 md:px-12 bg-background">
      <div className="max-w-7xl mx-auto space-y-16">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-medium tracking-tighter text-foreground">
            Planos transparentes para cada necessidade
          </h2>
          <p className="text-muted-foreground text-lg">
            Escolha o plano ideal para organizar suas finanças pessoais
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <div 
              key={index}
              className={`p-6 rounded-xl border flex flex-col h-full ${
                plan.popular 
                  ? "border-black/50 cosmic-glow" 
                  : "border-border cosmic-gradient bg-card"
              } transition-all duration-300 relative`}
              style={plan.popular ? { backgroundColor: '#208251' } : {}}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#0F422C] text-white text-sm rounded-full font-medium">
                  Most Popular
                </div>
              )}
              
              <div className="mb-auto">
                <h3 className={`text-2xl font-medium tracking-tighter mb-1 ${plan.popular ? 'text-white' : 'text-foreground'}`}>{plan.name}</h3>
                
                <div className="mb-4">
                  <div className={`text-3xl font-bold tracking-tighter ${plan.popular ? 'text-white' : 'text-foreground'}`}>{plan.price}</div>
                  {plan.period && <div className={`text-sm ${plan.popular ? 'text-white/80' : 'text-muted-foreground'}`}>{plan.period}</div>}
                </div>
                
                <p className={`mb-6 ${plan.popular ? 'text-white/80' : 'text-muted-foreground'}`}>{plan.description}</p>
                
                <div className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className={`h-5 w-5 rounded-full flex items-center justify-center ${plan.popular ? 'bg-white/20 text-white' : 'bg-gray-200 text-black'}`}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5 12L10 17L19 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <span className={`text-sm ${plan.popular ? 'text-white' : 'text-foreground'}`}>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              
            </div>
          ))}
        </div>
        
        <div className="text-center text-muted-foreground">
          Tem dúvidas? <a href="#" className="text-black hover:underline">Fale com nossa equipe</a>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
