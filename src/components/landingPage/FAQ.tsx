import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const FAQ = () => {
  const faqs = [
    {
      question: 'Como funciona o Codorna?',
      answer:
        'O Codorna é uma plataforma de gestão financeira pessoal que permite registrar suas transações, criar metas financeiras e visualizar relatórios detalhados sobre seus gastos. Com uma interface intuitiva, você tem controle total das suas finanças em um só lugar.',
    },
    {
      question: 'O Codorna é gratuito?',
      answer:
        'Sim! Oferecemos um plano gratuito com recursos essenciais para começar a organizar suas finanças. Para recursos avançados como relatórios detalhados, metas ilimitadas e suporte prioritário, oferecemos planos pagos a partir de R$ 9,90/mês.',
    },
    {
      question: 'Meus dados estão seguros?',
      answer:
        'Absolutamente! Utilizamos criptografia de ponta a ponta e armazenamento seguro na nuvem. Seus dados financeiros são protegidos com os mais altos padrões de segurança, e nunca compartilhamos suas informações com terceiros.',
    },
    {
      question: 'Posso cancelar minha assinatura a qualquer momento?',
      answer:
        'Sim, você pode cancelar sua assinatura a qualquer momento sem multas ou taxas adicionais. Mesmo após o cancelamento, você ainda terá acesso aos recursos premium até o final do período pago.',
    },
    {
      question: 'Posso usar o Codorna em diferentes dispositivos?',
      answer:
        'Sim! O Codorna funciona em qualquer dispositivo com acesso à internet. Seus dados são sincronizados automaticamente, permitindo que você acesse suas finanças pelo computador, tablet ou smartphone.',
    },
    {
      question: 'Como faço para começar a usar?',
      answer:
        'É muito simples! Basta criar uma conta gratuita, adicionar suas primeiras transações e começar a acompanhar seus gastos. Nosso tutorial interativo te guiará pelos principais recursos da plataforma.',
    },
    {
      question: 'Vocês oferecem suporte ao cliente?',
      answer:
        'Sim! Oferecemos suporte por e-mail para todos os usuários. Assinantes dos planos pagos têm acesso a suporte prioritário com tempo de resposta mais rápido e atendimento personalizado.',
    },
    {
      question: 'Posso importar minhas transações bancárias?',
      answer:
        'No momento, a importação de transações está em desenvolvimento. Por enquanto, você pode adicionar suas transações manualmente de forma rápida e fácil. Em breve, teremos integração com os principais bancos brasileiros.',
    },
  ];

  return (
    <section id="faq" className="py-20 px-4 bg-muted/30">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Perguntas Frequentes
          </h2>
          <p className="text-muted-foreground text-lg">
            Tire suas dúvidas sobre o Codorna
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="bg-background border rounded-lg px-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <AccordionTrigger className="text-left font-semibold text-lg hover:no-underline py-6">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-6 pt-2 leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQ;

