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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-1000 ${
        isScrolled
          ? "bg-white/30 dark:bg-slate-900/30 backdrop-blur-3xl border-b border-green-300/20 dark:border-slate-600/20 shadow-lg"
          : "bg-white/5 dark:bg-slate-900/5 backdrop-blur-3xl border-b border-green-200/5 dark:border-slate-700/5 shadow-none"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div className="font-bold text-xl text-gray-900 dark:text-white">
              Mobsters{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-500">
                Forex
              </span>
            </div>
          </div>

          {/* Desktop Navigation - Centered */}
          <nav className="hidden md:flex items-center justify-center flex-1">
            <div className="flex items-center gap-1 bg-green-50/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-full p-2 border-2 border-green-300/80 dark:border-slate-600/80 shadow-xl">
              <button
                onClick={() => scrollToSection("programs")}
                className="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white hover:bg-green-100/90 dark:hover:bg-slate-700/90 rounded-full transition-all duration-200 hover:shadow-lg"
              >
                Programs
              </button>
              <button
                onClick={() => scrollToSection("testimonials")}
                className="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white hover:bg-green-100/90 dark:hover:bg-slate-700/90 rounded-full transition-all duration-200 hover:shadow-lg"
              >
                Reviews
              </button>
              <button
                onClick={() => scrollToSection("faq")}
                className="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white hover:bg-green-100/90 dark:hover:bg-slate-700/90 rounded-full transition-all duration-200 hover:shadow-lg"
              >
                FAQ
              </button>
              <button
                onClick={() => scrollToSection("about")}
                className="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white hover:bg-green-100/90 dark:hover:bg-slate-700/90 rounded-full transition-all duration-200 hover:shadow-lg"
              >
                About
              </button>
            </div>
          </nav>

          {/* Desktop Actions - Hidden on mobile */}
          <div className="hidden md:flex items-center gap-3">
            <div className="p-2 rounded-xl bg-green-100/80 dark:bg-slate-800/80 backdrop-blur-sm border border-green-300/80 dark:border-slate-600/80 hover:bg-green-200/80 dark:hover:bg-slate-700/80 transition-all duration-200">
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
                  className="border-green-300 dark:border-slate-500 text-gray-700 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white hover:bg-green-50 dark:hover:bg-slate-700/60 hover:border-green-400 dark:hover:border-slate-400 backdrop-blur-sm"
                >
                  Login
                </Button>
                <Button
                  size="sm"
                  onClick={() => openAuthModal("register")}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 border-0"
                >
                  Get Started
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-green-100/80 dark:bg-slate-800/80 backdrop-blur-sm border border-green-300/80 dark:border-slate-600/80 text-gray-700 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white hover:bg-green-200/80 dark:hover:bg-slate-700/80 transition-all duration-200"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-green-200/80 dark:border-slate-600/80">
            <nav className="flex flex-col gap-4 pt-4">
              {/* Navigation Links */}
              <div className="bg-green-50/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-2 border-2 border-green-300/80 dark:border-slate-600/80 shadow-xl">
                <button
                  onClick={() => scrollToSection("programs")}
                  className="w-full text-left px-4 py-3 text-gray-700 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white hover:bg-green-100/80 dark:hover:bg-slate-700/80 rounded-xl transition-all duration-200 font-medium"
                >
                  Programs
                </button>
                <button
                  onClick={() => scrollToSection("testimonials")}
                  className="w-full text-left px-4 py-3 text-gray-700 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white hover:bg-green-100/80 dark:hover:bg-slate-700/80 rounded-xl transition-all duration-200 font-medium"
                >
                  Reviews
                </button>
                <button
                  onClick={() => scrollToSection("faq")}
                  className="w-full text-left px-4 py-3 text-gray-700 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white hover:bg-green-100/80 dark:hover:bg-slate-700/80 rounded-xl transition-all duration-200 font-medium"
                >
                  FAQ
                </button>
                <button
                  onClick={() => scrollToSection("about")}
                  className="w-full text-left px-4 py-3 text-gray-700 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white hover:bg-green-100/80 dark:hover:bg-slate-700/80 rounded-xl transition-all duration-200 font-medium"
                >
                  About
                </button>
              </div>

              {/* Theme Toggle */}
              <div className="flex justify-center">
                <div className="p-3 rounded-xl bg-green-100/80 dark:bg-slate-800/80 backdrop-blur-sm border border-green-300/80 dark:border-slate-600/80 hover:bg-green-200/80 dark:hover:bg-slate-700/80 transition-all duration-200">
                  <ThemeToggle />
                </div>
              </div>

              {/* Authentication Buttons */}
              {isAuthenticated ? (
                <div className="flex justify-center">
                  <UserMenu />
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => {
                      openAuthModal("login");
                      setIsMenuOpen(false);
                    }}
                    className="w-full border-green-300 dark:border-slate-500 text-gray-700 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white hover:bg-green-50 dark:hover:bg-slate-700/60 hover:border-green-400 dark:hover:border-slate-400 backdrop-blur-sm"
                  >
                    Login
                  </Button>
                  <Button
                    size="lg"
                    onClick={() => {
                      openAuthModal("register");
                      setIsMenuOpen(false);
                    }}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 border-0"
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
