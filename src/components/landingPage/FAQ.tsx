import React, { useState } from 'react';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: 'Como funciona a integração com WhatsApp?',
      answer:
        'É muito simples! Você envia uma mensagem com suas despesas ou receitas para o Codorna no WhatsApp, e nossa Inteligência Artificial processa e registra automaticamente. Pode ser por texto, áudio ou até mesmo enviando uma foto da nota fiscal. O sistema categoriza tudo automaticamente e atualiza seus dados em tempo real.',
    },
    {
      question: 'Posso enviar fotos ou áudio pelo WhatsApp?',
      answer:
        'Sim! Além de enviar mensagens de texto, você pode enviar áudios ou fotos de notas fiscais e recibos. Nossa IA é capaz de processar e extrair as informações automaticamente, tornando o registro ainda mais rápido e prático.',
    },
    {
      question: 'Meus dados financeiros estão seguros?',
      answer:
        'Absolutamente! O WhatsApp utiliza criptografia de ponta a ponta em todas as mensagens, garantindo que apenas você e o Codorna tenham acesso às suas informações. Seus dados são armazenados em servidores seguros com backups constantes. Não utilizamos seus dados financeiros para treinar modelos de IA e nunca compartilhamos suas informações com terceiros.',
    },
    {
      question: 'Preciso ter conhecimentos técnicos para usar o Codorna?',
      answer:
        'Não! O Codorna foi criado para ser usado por qualquer pessoa, mesmo sem experiência com finanças ou tecnologia. Basta enviar uma mensagem no WhatsApp como "gastei 50 reais no mercado" ou "recebi 2 mil de salário" e nosso assistente faz todo o resto automaticamente.',
    },
    {
      question: 'Quais funcionalidades estão disponíveis no dashboard?',
      answer:
        'No dashboard do Codorna você encontra visões completas da sua saúde financeira: gráficos de despesas por categoria, análise de receitas, acompanhamento de metas financeiras, histórico completo de transações, relatórios mensais e anuais, além de insights personalizados gerados pela nossa IA para ajudar você a economizar mais.',
    },
    {
      question: 'Posso criar metas financeiras e acompanhá-las?',
      answer:
        'Sim! O Codorna permite que você crie metas financeiras personalizadas, como economizar para uma viagem, pagar dívidas ou criar uma reserva de emergência. O sistema acompanha seu progresso automaticamente e envia atualizações regulares pelo WhatsApp sobre quanto falta para alcançar cada meta.',
    },
    {
      question: 'Como funciona o período de teste grátis?',
      answer:
        'Oferecemos um período de teste de 7 dias gratuitos para que você possa experimentar todas as funcionalidades do Codorna sem compromisso. Durante o teste, você tem acesso completo a todos os recursos premium. Não é necessário cartão de crédito para começar o teste.',
    },
  ];

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-80 px-6 md:px-12 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left Column - Header Section */}
          <div className="space-y-6">
            {/* Badge */}
            <div 
              className="inline-flex items-center gap-2 px-4 py-2"
              style={{ 
                borderRadius: '642px',
                backgroundColor: 'rgba(32, 130, 81, 0.1)'
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-[#208251]"
              >
                <path
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"
                  fill="currentColor"
                />
              </svg>
              <span className="text-sm font-medium text-[#208251]">
                Perguntas frequentes
              </span>
            </div>

            {/* Title */}
            <h2 
              className="text-5xl md:text-6xl lg:text-7xl text-gray-900 tracking-tight"
              style={{
                fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
                fontWeight: 400,
                letterSpacing: '-2.9px',
                lineHeight: '67px'
              }}
            >
              Perguntas{' '}
              <span className="text-[#208251]">frequentes</span>
            </h2>

            {/* Description */}
            <p 
              className="max-w-lg"
              style={{
                fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
                fontSize: '19px',
                color: 'var(--codorna-border-dark)',
                lineHeight: '24px',
                letterSpacing: '-0.6px'
              }}
            >
              Encontre respostas para as principais dúvidas sobre o Codorna. Se ainda tiver alguma pergunta, entre em contato conosco pelo WhatsApp—estamos sempre prontos para ajudar!
            </p>
          </div>

          {/* Right Column - FAQ Cards */}
          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={index}
                  className="bg-gray-50 rounded-xl overflow-hidden transition-ease-in-out duration-500"
                >
                  {/* Question Header */}
                  <button
                    onClick={() => toggleQuestion(index)}
                    className="w-full flex items-center justify-between px-6 py-5 text-left focus:outline-none"
                    style={{ borderRadius: '151px' }}
                  >
                    <span 
                      className="text-gray-900 pr-4 flex-1"
                      style={{
                        fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
                        fontWeight: 400,
                        fontSize: '20px',
                        letterSpacing: '-0.6px',
                        lineHeight: '35px'
                      }}
                    >
                      {faq.question}
                    </span>
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-[#208251] flex items-center justify-center transition-ease-in-out duration-500">
                        {isOpen ? (
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="text-white"
                          >
                            <path
                              d="M5 15l7-7 7 7"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        ) : (
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="text-white"
                          >
                            <path
                              d="M19 9l-7 7-7-7"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </div>
                    </div>
                  </button>

                  {/* Answer Content */}
                  <div
                    className={`overflow-hidden transition-ease-in-out duration-500 ${
                      isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="px-6 pb-6 pt-0">
                      <p 
                        className="text-base"
                        style={{
                          fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
                          color: 'rgba(166, 166, 166, 1)',
                          lineHeight: '20px',
                          letterSpacing: '-0.3px'
                        }}
                      >
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
