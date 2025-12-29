import React from 'react';

const DashboardPreview = () => {
  return (
    <section id="dashboard" className="w-full py-36 px-6 md:px-12">
      <div className="max-w-7xl mx-auto space-y-16">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-medium tracking-tighter">
          <span className='text-[#208251]'>Acompanhe suas finanças</span> com um dashboard intuitivo
          </h2>
          <p className="text-gray-600 text-lg">
            Visualize todos os seus gastos, entradas e metas financeiras em uma interface clara e organizada
          </p>
        </div>
        
        <div className="cosmic-glow relative rounded-3xl overflow-hidden backdrop-blur-sm bg-white shadow-[0_60px_30px_rgba(0,0,0,0.1)] border border-black/8">
          <div className="w-full rounded-xl bg-[#f5f5f5]/90 p-4">
            <img 
              src="/preview.png" 
              alt="Preview do Dashboard Codorna" 
              className="w-full h-auto rounded-xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardPreview;