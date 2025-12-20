import React from 'react';

interface Testimonial {
  name: string;
  image: string;
  joinDate: string;
  feedback: string;
  rating: number; // 1-5
}

const Testimonials = () => {
  const testimonials: Testimonial[] = [
    {
      name: "Maria Silva",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
      joinDate: "15/01/2025",
      feedback: "Consegui economizar 30% do meu salário usando o Codorna. O controle de gastos é incrível e me ajudou a alcançar minhas metas financeiras.",
      rating: 5
    },
    {
      name: "João Santos",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
      joinDate: "03/12/2025",
      feedback: "Finalmente consegui organizar minhas finanças! O dashboard é muito intuitivo e os relatórios me ajudam a tomar melhores decisões.",
      rating: 5
    },
    {
      name: "Ana Costa",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
      joinDate: "22/11/2025",
      feedback: "A família toda usa o Codorna agora. Conseguimos controlar nossos gastos e economizar para a viagem dos sonhos.",
      rating: 5
    },
    {
      name: "Pedro Oliveira",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
      joinDate: "08/10/2025",
      feedback: "A melhor ferramenta de gestão financeira que já usei. Simples, eficiente e me ajuda a manter o controle total.",
      rating: 5
    },
    {
      name: "Carla Mendes",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop",
      joinDate: "17/09/2025",
      feedback: "O Codorna transformou minha relação com o dinheiro. Agora tenho clareza total sobre meus gastos e consigo planejar melhor.",
      rating: 5
    }
  ];

  return (
    <section className="w-full py-20 bg-white relative overflow-hidden">
      {/* Círculos decorativos com blur */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="relative w-full h-full max-w-4xl mx-auto">
          {/* Círculo 1 - Verde claro */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#16e26d] rounded-full blur-3xl opacity-15 animate-float-1"></div>
          
          {/* Círculo 2 - Verde médio */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-[#208251] rounded-full blur-3xl opacity-15 animate-float-2"></div>
          
          {/* Círculo 3 - Verde escuro */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#1a6941] rounded-full blur-3xl opacity-10 animate-float-3"></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-12 relative z-10">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-medium tracking-tighter text-gray-900">
            Confiado por <span className='text-[#208251]'>milhares de usuários</span>
          </h2>
          <p className="text-gray-600 text-lg">
            Veja como nossa plataforma transforma a vida financeira das pessoas
          </p>
        </div>
      </div>

      {/* Carrossel de Depoimentos - Largura total da tela */}
      <div className="w-full  relative my-16">
        {/* Gradiente esquerdo */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none" />
        
        {/* Gradiente direito */}
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none" />
        
        <div className="flex gap-3 md:gap-6 animate-scroll-left">
          {/* Duplicar items para criar loop infinito */}
          {[...testimonials, ...testimonials, ...testimonials].map((testimonial, index) => (
            <div
              key={index}
              className="p-1.5 md:p-3 flex-shrink-0 w-[200px] md:w-[340px] rounded-[25px] md:rounded-[40px] overflow-hidden bg-white shadow-[0_50px_40px_rgba(0,0,0,0.05)] transition-shadow duration-300"
            >
              {/* Imagem */}
              <div className="relative w-full h-48 md:h-72 overflow-hidden rounded-[20px] md:rounded-[37px]">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-full h-full object-cover"
                />
                
              </div>

              {/* Conteúdo */}
              <div className="p-2.5 md:p-4 space-y-1 md:space-y-2">
                {/* Nome e verificação */}
                <div className="flex items-center gap-1 md:gap-2">
                  <h3 className="text-sm md:text-xl font-bold text-gray-900">{testimonial.name}</h3>
                  <img
                    src="/selo-verificado.png"
                    alt="Verificado"
                    className="w-2 h-2 md:w-3 md:h-3"
                  />
                </div>

                {/* Data que entrou */}
                <p className="text-[10px] md:text-sm text-gray-500">{testimonial.joinDate}</p>

                {/* Feedback */}
                <p className="text-[11px] md:text-base text-gray-500 tracking-tight leading-relaxed">{testimonial.feedback}</p>

                {/* Estrelas */}
                <div className="flex items-center gap-0.5 md:gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      width="14"
                      height="14"
                      className="md:w-5 md:h-5"
                      viewBox="0 0 24 24"
                      fill={i < testimonial.rating ? "#FFD700" : "#E5E7EB"}
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                    </svg>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
