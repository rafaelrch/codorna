import React from 'react';

const Testimonials = () => {
  const testimonials = [
    {
      quote: "Consegui economizar 30% do meu salário usando o Codorna. O controle de gastos é incrível e me ajudou a alcançar minhas metas financeiras.",
      author: "Maria Silva",
      position: "Engenheira"
    },
    {
      quote: "Finalmente consegui organizar minhas finanças! O dashboard é muito intuitivo e os relatórios me ajudam a tomar melhores decisões.",
      author: "João Santos",
      position: "Designer"
    },
    {
      quote: "A família toda usa o Codorna agora. Conseguimos controlar nossos gastos e economizar para a viagem dos sonhos.",
      author: "Ana Costa",
      position: "Professora"
    }
  ];
  
  return (
    <section className="w-full py-20 px-6 md:px-12 bg-card relative overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 cosmic-grid opacity-20"></div>
      
      <div className="max-w-7xl mx-auto space-y-16 relative z-10">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-medium tracking-tighter text-foreground">
            Confiado por <span className='text-[#208251]'>milhares de usuários</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Veja como nossa plataforma transforma a vida financeira das pessoas
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="p-6 rounded-xl border border-border bg-background/80 backdrop-blur-sm hover:border-border/60 transition-all duration-300"
            >
              <div className="mb-6">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-black inline-block mr-1">★</span>
                ))}
              </div>
              <p className="text-lg mb-8 text-foreground/90 italic">"{testimonial.quote}"</p>
              <div>
                <h4 className="font-medium text-foreground">{testimonial.author}</h4>
                <p className="text-sm text-muted-foreground">{testimonial.position}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
