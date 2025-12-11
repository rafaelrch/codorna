import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import Logo from './Logo';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { Squares2X2Icon, CreditCardIcon } from '@heroicons/react/24/outline';
import { SparklesIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Link } from 'react-router-dom';

interface HeaderProps {
  onOpenWaitlist: () => void;
}

const Header = ({ onOpenWaitlist }: HeaderProps) => {
  const [activePage, setActivePage] = useState('features');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const handleNavClick = (page: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setActivePage(page);
    const element = document.getElementById(page);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };


  return (
    <div className="sticky top-0 z-50 pt-8 px-4">
      <header className="w-full max-w-7xl mx-auto py-3 px-6 md:px-8 flex items-center justify-between">
        <div className="p-3">
          <Logo />
        </div>
        
        {/* Mobile menu button */}
        <button 
          className="md:hidden p-3 rounded-2xl text-muted-foreground hover:text-foreground"
          onClick={toggleMobileMenu}
        >
          {mobileMenuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
        </button>
        
        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center absolute left-1/2 transform -translate-x-1/2">
          <div className="rounded-full px-1 py-1 backdrop-blur-md bg-background/70 border border-border">
            <ToggleGroup type="single" value={activePage} onValueChange={(value) => value && setActivePage(value)}>
              <ToggleGroupItem 
                value="features"
                className={cn(
                  "px-4 py-2 rounded-full transition-colors relative",
                  activePage === 'features' ? 'text-accent-foreground bg-accent' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                )}
                onClick={handleNavClick('features')}
              >
                <SparklesIcon className="h-4 w-4 inline-block mr-1.5" /> Features
              </ToggleGroupItem>
              <ToggleGroupItem 
                value="dashboard" 
                className={cn(
                  "px-4 py-2 rounded-full transition-colors relative",
                  activePage === 'dashboard' ? 'text-accent-foreground bg-accent' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                )}
                onClick={handleNavClick('dashboard')}
              >
                <Squares2X2Icon className="h-4 w-4 inline-block mr-1.5" /> Dashboard
              </ToggleGroupItem>
              <ToggleGroupItem 
                value="pricing" 
                className={cn(
                  "px-4 py-2 rounded-full transition-colors relative",
                  activePage === 'pricing' ? 'text-accent-foreground bg-accent' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                )}
                onClick={handleNavClick('pricing')}
              >
                <CreditCardIcon className="h-4 w-4 inline-block mr-1.5" /> Planos
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </nav>
        
        {/* Mobile navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-20 left-4 right-4 bg-background/95 backdrop-blur-md py-4 px-6 border border-border rounded-2xl shadow-lg z-50">
            <div className="flex flex-col gap-4">
              <a 
                href="#features" 
                className={`px-3 py-2 text-sm rounded-md transition-colors ${
                  activePage === 'features' ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
                onClick={handleNavClick('features')}
              >
                <SparklesIcon className="h-4 w-4 inline-block mr-1.5" /> Features
              </a>
              <a 
                href="#dashboard" 
                className={`px-3 py-2 text-sm rounded-md transition-colors ${
                  activePage === 'dashboard' ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
                onClick={handleNavClick('dashboard')}
              >
                <Squares2X2Icon className="h-4 w-4 inline-block mr-1.5" /> Dashboard
              </a>
              <a 
                href="#pricing"
                className={`px-3 py-2 text-sm rounded-md transition-colors ${
                  activePage === 'pricing' ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
                onClick={handleNavClick('pricing')}
              >
                <CreditCardIcon className="h-4 w-4 inline-block mr-1.5" /> Planos
              </a>
              
              {/* Mobile buttons */}
              <div className="flex flex-col gap-2 pt-4 border-t border-gray-200">
                <Button 
                  variant="outline" 
                  className="w-full rounded-full border-gray-300 hover:bg-gray-50"
                  asChild
                >
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>Entrar</Link>
                </Button>
                <Button 
                  className="w-full bg-[#208251] text-white hover:bg-[#208251]/90 transition-ease-in-out duration-300 rounded-full"
                  asChild
                >
                  <a href="https://wa.me/5571983486204?text=Ol%C3%A1%20Codorna!!" target="_blank" rel="noopener noreferrer" onClick={() => setMobileMenuOpen(false)}>Cadastrar</a>
                </Button>
              </div>
            </div>
          </div>
        )}
        
        <div className="hidden md:flex items-center gap-3">
          <Button 
            variant="outline" 
            className="rounded-full border-gray-300 hover:bg-gray-50"
            asChild
          >
            <Link to="/login">Entrar</Link>
          </Button>
          <Button 
            className="bg-[#208251] text-white hover:bg-[#208251]/90 transition-ease-in-out duration-300 rounded-full"
            asChild
          >
            <a href="https://wa.me/5571983486204?text=Ol%C3%A1%20Codorna!!" target="_blank" rel="noopener noreferrer">Cadastrar</a>
          </Button>
        </div>
      </header>
    </div>
  );
};

export default Header;