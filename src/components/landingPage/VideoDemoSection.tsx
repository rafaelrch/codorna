import React from 'react';

const VideoDemoSection = () => {
  return (
    <section id="video-demo" className="w-full py-20 md:py-32 px-6 md:px-12 bg-white">
      <div className="max-w-7xl mx-auto space-y-24">
        {/* Primeira Seção: Registre tudo no WhatsApp */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Texto à Esquerda */}
          <div className="space-y-6">
            <h2 
              className="text-5xl md:text-6xl lg:text-6xl font-medium tracking-tight"
              style={{
                fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
                fontWeight: 400,
                letterSpacing: '-2.9px',
                lineHeight: '67px'
              }}
            >
              Registre tudo no <span className="text-[#208251] font-semibold tracking-tighter">WhatsApp</span>
            </h2>
            <p 
              className="text-lg text-gray-600 leading-relaxed max-w-lg"
              style={{
                fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
                fontSize: '19px',
                color: 'var(--codorna-border-dark)',
                lineHeight: '24px',
                letterSpacing: '-0.6px'
              }}
            >
              Envie uma mensagem e nosso assistente lança tudo automaticamente.
            </p>
            <ul className="space-y-4 max-w-lg">
              <li className="flex items-start gap-3">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-[#208251] flex-shrink-0 mt-0.5"
                >
                  <path
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span 
                  className="text-gray-600"
                  style={{
                    fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
                    letterSpacing: '-0.3px'
                  }}
                >
                  Texto ou áudio, você escolhe
                </span>
              </li>
              <li className="flex items-start gap-3">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-[#208251] flex-shrink-0 mt-0.5"
                >
                  <path
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span 
                  className="text-gray-600"
                  style={{
                    fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
                    letterSpacing: '-0.3px'
                  }}
                >
                  Categorização inteligente
                </span>
              </li>
              <li className="flex items-start gap-3">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-[#208251] flex-shrink-0 mt-0.5"
                >
                  <path
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span 
                  className="text-gray-600"
                  style={{
                    fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
                    letterSpacing: '-0.3px'
                  }}
                >
                  Rápido, prático e sem complicação
                </span>
              </li>
            </ul>
          </div>

          {/* Card à Direita */}
          <div className="relative rounded-[40px] overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.15)] max-w-sm mx-auto lg:max-w-md">
            <div className="relative w-full aspect-[9/16] bg-gray-200/10  rounded-3xl overflow-hidden p-4">
              <video 
                autoPlay 
                loop 
                muted 
                playsInline
                preload="auto"
                className="w-full h-full object-cover rounded-[25px]"
              >
                <source src="/testeTela2.mp4" type="video/mp4" />
                Seu navegador não suporta vídeos.
              </video>
            </div>
          </div>
        </div>

        {/* Segunda Seção: Painel Profissional */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Card à Esquerda */}
          <div className="relative p-2 rounded-3xl overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.15)] lg:order-1 order-2">
            <div className="relative w-full aspect-video bg-[#208251] shadow-lg rounded-3xl ">
              <video 
                autoPlay 
                loop 
                muted 
                playsInline
                preload="auto"
                className="w-full h-full object-cover rounded-2xl"
              >
                <source src="/testePreviewCodorna.mp4" type="video/mp4" />
                Seu navegador não suporta vídeos.
              </video>
            </div>
          </div>

          {/* Texto à Direita */}
          <div className="space-y-6 lg:order-2 order-1">
            <h2 
              className="text-5xl md:text-5xl lg:text-6xl font-medium tracking-tight"
              style={{
                fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
                fontWeight: 400,
                letterSpacing: '-2.9px',
                lineHeight: '67px'
              }}
            >
              <span className="text-[#208251] font-semibold tracking-tighter">Painel</span> Profissional
            </h2>
            <p 
              className="text-lg text-gray-600 leading-relaxed max-w-lg"
              style={{
                fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
                fontSize: '19px',
                color: 'var(--codorna-border-dark)',
                lineHeight: '24px',
                letterSpacing: '-0.6px'
              }}
            >
              Sem perder tempo com cadastros — seu assessor faz tudo por você no WhatsApp.
            </p>
            <ul className="space-y-4 max-w-lg">
              <li className="flex items-start gap-3">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-[#208251] flex-shrink-0 mt-0.5"
                >
                  <path
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span 
                  className="text-gray-600"
                  style={{
                    fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
                    letterSpacing: '-0.3px'
                  }}
                >
                  Gráficos de fluxo de caixa
                </span>
              </li>
              <li className="flex items-start gap-3">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-[#208251] flex-shrink-0 mt-0.5"
                >
                  <path
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span 
                  className="text-gray-600"
                  style={{
                    fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
                    letterSpacing: '-0.3px'
                  }}
                >
                  Organização automática
                </span>
              </li>
              <li className="flex items-start gap-3">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-[#208251] flex-shrink-0 mt-0.5"
                >
                  <path
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span 
                  className="text-gray-600"
                  style={{
                    fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
                    letterSpacing: '-0.3px'
                  }}
                >
                  Prático e acessível
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoDemoSection;

