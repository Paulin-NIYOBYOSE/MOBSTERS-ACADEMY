import React from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { DashboardSidebar } from './DashboardSidebar';
import { DashboardNotifications } from './DashboardNotifications';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Bell, Search, Menu } from 'lucide-react';
import { UserMenu } from '@/components/UserMenu';
import { useAuth } from '@/contexts/AuthContext';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user } = useAuth();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <DashboardSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Top Header Bar */}
          <header className="h-16 bg-background/95 backdrop-blur-md border-b border-border/50 flex items-center px-6 gap-4 sticky top-0 z-40">
            <SidebarTrigger className="p-2">
              <Menu className="w-4 h-4" />
            </SidebarTrigger>
            
            <div className="flex-1" />
            
            {/* Header Actions */}
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="relative">
                <Search className="w-4 h-4" />
              </Button>
              
              <DashboardNotifications />
              
              <ThemeToggle />
              <UserMenu />
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}