import React from 'react';
import { Layers, Grid3x3, ListCheck, BookOpen, Star, LayoutDashboard } from "lucide-react";

const Features = () => {
  const features = [
    {
      title: "Controle de Gastos",
      description: "Organize e categorize suas saídas para ter controle total sobre seus gastos.",
      icon: (
        <Layers size={24} className="text-black" />
      )
    },
    {
      title: "Dashboard Intuitivo",
      description: "Acompanhe sua situação financeira com gráficos e relatórios em tempo real.",
      icon: (
        <Grid3x3 size={24} className="text-black" />
      )
    },
    {
      title: "Metas Financeiras",
      description: "Defina e acompanhe suas metas financeiras com ferramentas inteligentes.",
      icon: (
        <LayoutDashboard size={24} className="text-black" />
      )
    },
    {
      title: "Relatórios Detalhados",
      description: "Gere relatórios completos sobre sua situação financeira.",
      icon: (
        <ListCheck size={24} className="text-black" />
      )
    }
  ];
  
  return (
    <section id="features" className="w-full py-12 md:py-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-7xl font-medium tracking-tighter">
          <span className='text-[#208251]'>Tudo que você precisa</span> para suas finanças
          </h2>
          <p className="text-muted-foreground text-lg">
            Soluções completas para organizar suas finanças pessoais e alcançar seus objetivos
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="rounded-xl border border-gray-200 bg-white  p-6 hover:border-gray-400 transition-easy-in-out  duration-300"
            >
              <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-medium tracking-tighter mb-3 text-black">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
