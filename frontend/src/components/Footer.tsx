import React from "react";
import {
  TrendingUp,
  Mail,
  MessageSquare,
  Instagram,
  Youtube,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-8 h-8 text-primary" />
              <div className="font-bold text-2xl text-foreground">
                Mobsters <span className="text-primary">Forex</span>
              </div>
            </div>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Transform your financial future with professional forex trading
              education. Join thousands of successful traders who have mastered
              the markets with our comprehensive academy program.
            </p>
            <div className="flex gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-primary/10 hover:text-primary"
              >
                <Instagram className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-primary/10 hover:text-primary"
              >
                <Youtube className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-primary/10 hover:text-primary"
              >
                <MessageSquare className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-primary/10 hover:text-primary"
              >
                <Mail className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Programs */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-primary">
              Programs
            </h3>
            <ul className="space-y-3 text-muted-foreground">
              <li>
                <a
                  href="#programs"
                  className="hover:text-primary transition-colors"
                >
                  6-Month Academy
                </a>
              </li>
              <li>
                <a
                  href="#programs"
                  className="hover:text-primary transition-colors"
                >
                  Monthly Mentorship
                </a>
              </li>
              <li>
                <a
                  href="#programs"
                  className="hover:text-primary transition-colors"
                >
                  Free Community
                </a>
              </li>
              <li>
                <a
                  href="#programs"
                  className="hover:text-primary transition-colors"
                >
                  Trading Signals
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-primary">Support</h3>
            <ul className="space-y-3 text-muted-foreground">
              <li>
                <a href="#faq" className="hover:text-primary transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <a
                  href="mailto:support@mobstersforex.com"
                  className="hover:text-primary transition-colors"
                >
                  Contact Support
                </a>
              </li>
              <li>
                <a
                  href="#refund"
                  className="hover:text-primary transition-colors"
                >
                  Refund Policy
                </a>
              </li>
              <li>
                <a
                  href="#terms"
                  className="hover:text-primary transition-colors"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="#privacy"
                  className="hover:text-primary transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-muted-foreground">
              © {currentYear} Mobsters Forex Academy. All rights reserved.
            </div>
            <div className="flex flex-wrap gap-6 text-sm">
              <a
                href="#terms"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Terms & Conditions
              </a>
              <a
                href="#privacy"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#cookies"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Cookie Policy
              </a>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-muted-foreground/70 text-sm">
              ⚠️ Risk Warning: Trading forex involves substantial risk and may
              not be suitable for all investors. Past performance is not
              indicative of future results. Please trade responsibly.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
