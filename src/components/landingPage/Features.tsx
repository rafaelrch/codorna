import React from 'react';

const Features = () => {
  const images = [
    {
      src: "/FEATURES-1.png",
      alt: "Feature 1"
    },
    {
      src: "/FEATURES-2.png",
      alt: "Feature 2"
    },
    {
      src: "/FEATURES-3.png",
      alt: "Feature 3"
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
        
        <div className="grid grid-cols-1 md:grid-cols-3 max-w-7xl mx-auto ">
          {images.map((image, index) => (
            <div
              key={index}
              className="rounded-xl overflow-hidden"
            >
              <img 
                src={image.src} 
                alt={image.alt}
                className="w-full h-auto object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
