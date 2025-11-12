import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, TrendingUp } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AuthModal } from "@/components/auth/AuthModal";
import { UserMenu } from "@/components/UserMenu";
import { useAuth } from "@/contexts/AuthContext";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [isScrolled, setIsScrolled] = useState(false);

  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
    setIsMenuOpen(false);
  };

  const openAuthModal = (mode: "login" | "register") => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "glass-effect shadow-lg"
          : "bg-background/60 backdrop-blur-2xl border-b border-border/30"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-2 rounded-xl bg-gradient-primary shadow-md hover:shadow-lg transition-shadow">
              <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="font-display font-bold text-lg sm:text-xl text-foreground">
              Market{" "}
              <span className="gradient-text">
                Mobsters
              </span>
            </div>
          </div>

          {/* Desktop Navigation - Centered */}
          <nav className="hidden md:flex items-center justify-center flex-1">
            <div className="flex items-center gap-1 glass-effect rounded-full p-1.5 shadow-md">
              <button
                onClick={() => scrollToSection("programs")}
                className="px-4 py-2 text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-accent rounded-full transition-all duration-200"
              >
                Programs
              </button>
              <button
                onClick={() => scrollToSection("testimonials")}
                className="px-4 py-2 text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-accent rounded-full transition-all duration-200"
              >
                Reviews
              </button>
              <button
                onClick={() => scrollToSection("faq")}
                className="px-4 py-2 text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-accent rounded-full transition-all duration-200"
              >
                FAQ
              </button>
              <button
                onClick={() => scrollToSection("about")}
                className="px-4 py-2 text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-accent rounded-full transition-all duration-200"
              >
                About
              </button>
            </div>
          </nav>

          {/* Desktop Actions - Hidden on mobile */}
          <div className="hidden md:flex items-center gap-3">
            <div className="p-2 rounded-lg glass-effect hover:bg-accent/50 transition-all duration-200">
              <ThemeToggle />
            </div>

            {isAuthenticated ? (
              <UserMenu />
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openAuthModal("login")}
                  className="btn-modern border-border hover:border-primary/50 hover:bg-accent"
                >
                  Login
                </Button>
                <Button
                  size="sm"
                  onClick={() => openAuthModal("register")}
                  className="btn-modern bg-gradient-primary hover:shadow-glow text-white border-0"
                >
                  Get Started
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg glass-effect hover:bg-accent/50 transition-all duration-200"
          >
            {isMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-border/50">
            <nav className="flex flex-col gap-3 pt-4">
              {/* Navigation Links */}
              <div className="glass-effect rounded-xl p-2 shadow-md">
                <button
                  onClick={() => scrollToSection("programs")}
                  className="w-full text-left px-4 py-2.5 text-foreground/80 hover:text-foreground hover:bg-accent rounded-lg transition-all duration-200 font-medium"
                >
                  Programs
                </button>
                <button
                  onClick={() => scrollToSection("testimonials")}
                  className="w-full text-left px-4 py-2.5 text-foreground/80 hover:text-foreground hover:bg-accent rounded-lg transition-all duration-200 font-medium"
                >
                  Reviews
                </button>
                <button
                  onClick={() => scrollToSection("faq")}
                  className="w-full text-left px-4 py-2.5 text-foreground/80 hover:text-foreground hover:bg-accent rounded-lg transition-all duration-200 font-medium"
                >
                  FAQ
                </button>
                <button
                  onClick={() => scrollToSection("about")}
                  className="w-full text-left px-4 py-2.5 text-foreground/80 hover:text-foreground hover:bg-accent rounded-lg transition-all duration-200 font-medium"
                >
                  About
                </button>
              </div>

              {/* Theme Toggle */}
              <div className="flex justify-center">
                <div className="p-2 rounded-lg glass-effect hover:bg-accent/50 transition-all duration-200">
                  <ThemeToggle />
                </div>
              </div>

              {/* Authentication Buttons */}
              {isAuthenticated ? (
                <div className="flex justify-center">
                  <UserMenu />
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => {
                      openAuthModal("login");
                      setIsMenuOpen(false);
                    }}
                    className="w-full btn-modern border-border hover:border-primary/50 hover:bg-accent"
                  >
                    Login
                  </Button>
                  <Button
                    size="lg"
                    onClick={() => {
                      openAuthModal("register");
                      setIsMenuOpen(false);
                    }}
                    className="w-full btn-modern bg-gradient-primary hover:shadow-glow text-white border-0"
                  >
                    Get Started
                  </Button>
                </div>
              )}
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
