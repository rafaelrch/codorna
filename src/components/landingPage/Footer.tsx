import React from 'react';
import Logo from './Logo';

const Footer = () => {
  return (
    <footer className="w-full py-16 px-6 md:px-12 border-t border-border bg-card flex flex-col justify-center items-center">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center space-y-6">
          <Logo />
          <div className="flex items-center gap-4">
            <a  href="https://www.instagram.com/usecodorna/" target="_blank" className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="currentColor" strokeWidth="2"/>
                <path d="m16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" stroke="currentColor" strokeWidth="2"/>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </a>
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row justify-center items-center text-muted-foreground text-sm">
          <div>© 2026 Codorna. Todos os direitos reservados.</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
