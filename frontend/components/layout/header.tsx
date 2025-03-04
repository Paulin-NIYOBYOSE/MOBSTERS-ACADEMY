"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Menu, X } from "lucide-react";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/auth-provider";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleAuthAction = () => {
    if (user) {
      logout();
    } else {
      router.push("/signup");
    }
  };

  // Conditional navItems based on user authentication
  const navItems = user
    ? [...siteConfig.nav, ...siteConfig.authNav]
    : siteConfig.nav;

  return (
    <header className="fixed top-0 left-0 w-full bg-[#002419]/80 backdrop-blur-md text-white px-20 z-50 shadow-md transition-all duration-300">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          {/* Home link - Removed onClick */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#00DC82] rounded-full"></div>
            <span className="text-xl font-bold">{siteConfig.name}</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`hover:text-[#00DC82] transition-colors ${
                  pathname === item.href ? "text-[#00DC82]" : ""
                }`}
              >
                {item.title}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <Button
                onClick={handleAuthAction}
                className="bg-[#00DC82] hover:bg-[#00DC82]/90 text-[#002419]"
              >
                <LogOut className="mr-2" size={16} />
                Logout
              </Button>
            ) : (
              <Button
                onClick={handleAuthAction}
                className="bg-[#00DC82] hover:bg-[#00DC82]/90 text-[#002419]"
              >
                Join Now
              </Button>
            )}
          </div>

          <button
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>

        {isMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-[#00DC82]/20">
            <div className="flex flex-col gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`hover:text-[#00DC82] transition-colors ${
                    pathname === item.href ? "text-[#00DC82]" : ""
                  }`}
                  onClick={() => setIsMenuOpen(false)} // Close the menu on mobile after clicking
                >
                  {item.title}
                </Link>
              ))}
              {user ? (
                <Button
                  onClick={() => {
                    handleAuthAction();
                    setIsMenuOpen(false);
                  }}
                  className="bg-[#00DC82] hover:bg-[#00DC82]/90 text-[#002419]"
                >
                  Logout
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    handleAuthAction();
                    setIsMenuOpen(false);
                  }}
                  className="bg-[#00DC82] hover:bg-[#00DC82]/90 text-[#002419]"
                >
                  Join Now
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
