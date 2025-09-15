import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, TrendingUp } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { AuthModal } from '@/components/auth/AuthModal';
import { UserMenu } from '@/components/UserMenu';
import { useAuth } from '@/contexts/AuthContext';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  
  const { isAuthenticated } = useAuth();

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  const openAuthModal = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
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
            
            <div className="flex items-center gap-2">
              <ThemeToggle />
              
              {isAuthenticated ? (
                <UserMenu />
              ) : (
                <>
                  <Button 
                    variant="outline-primary" 
                    size="sm"
                    onClick={() => openAuthModal('login')}
                  >
                    Login
                  </Button>
                  <Button 
                    variant="hero" 
                    size="sm"
                    onClick={() => openAuthModal('register')}
                  >
                    Get Started
                  </Button>
                </>
              )}
            </div>
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
              <div className="flex items-center gap-2 mt-4">
                <ThemeToggle />
                
                {isAuthenticated ? (
                  <UserMenu />
                ) : (
                  <div className="flex flex-col gap-2 flex-1">
                    <Button 
                      variant="outline-primary" 
                      size="sm"
                      onClick={() => openAuthModal('login')}
                    >
                      Login
                    </Button>
                    <Button 
                      variant="hero" 
                      size="sm"
                      onClick={() => openAuthModal('register')}
                    >
                      Get Started
                    </Button>
                  </div>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
      
      <AuthModal 
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
      />
    </header>
  );
};