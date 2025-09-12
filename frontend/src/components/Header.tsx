import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, TrendingUp } from 'lucide-react';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/50 shadow-soft">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <TrendingUp className="w-8 h-8 text-primary" />
            <div className="font-bold text-xl text-foreground">
              Mobsters <span className="text-primary">Forex</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <button 
              onClick={() => scrollToSection('programs')}
              className="text-foreground hover:text-primary transition-colors"
            >
              Programs
            </button>
            <button 
              onClick={() => scrollToSection('testimonials')}
              className="text-foreground hover:text-primary transition-colors"
            >
              Reviews
            </button>
            <button 
              onClick={() => scrollToSection('faq')}
              className="text-foreground hover:text-primary transition-colors"
            >
              FAQ
            </button>
            <Button variant="outline-primary" size="sm">
              Login
            </Button>
            <Button variant="hero" size="sm">
              Get Started
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-foreground"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-border/50">
            <nav className="flex flex-col gap-4 pt-4">
              <button 
                onClick={() => scrollToSection('programs')}
                className="text-left text-foreground hover:text-primary transition-colors"
              >
                Programs
              </button>
              <button 
                onClick={() => scrollToSection('testimonials')}
                className="text-left text-foreground hover:text-primary transition-colors"
              >
                Reviews
              </button>
              <button 
                onClick={() => scrollToSection('faq')}
                className="text-left text-foreground hover:text-primary transition-colors"
              >
                FAQ
              </button>
              <div className="flex flex-col gap-2 mt-4">
                <Button variant="outline-primary" size="sm">
                  Login
                </Button>
                <Button variant="hero" size="sm">
                  Get Started
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};