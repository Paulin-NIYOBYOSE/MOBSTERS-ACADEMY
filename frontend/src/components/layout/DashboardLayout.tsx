import React from "react";
import {
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardNotifications } from "./DashboardNotifications";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Bell, Search, Menu } from "lucide-react";
import { UserMenu } from "@/components/UserMenu";
import { useAuth } from "@/contexts/AuthContext";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user } = useAuth();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background relative">
        {/* Fixed Sidebar */}
        <div className="fixed top-0 left-0 h-full z-30">
          <DashboardSidebar />
        </div>

        {/* Main Content Area with offset for fixed sidebar */}
        <div
          className={`flex-1 flex flex-col transition-all duration-300 ${
            collapsed ? "ml-16" : "lg:ml-64"
          }`}
          style={{
            width: collapsed ? "calc(100% - 4rem)" : "calc(100% - 16rem)",
          }}
        >
          {/* Fixed Header */}
          <header className="h-16 bg-background/95 backdrop-blur-md border-b border-border/50 flex items-center px-6 gap-4 sticky top-0 z-20">
            <SidebarTrigger className="p-2">
              <Menu className="w-4 h-4" />
            </SidebarTrigger>

            <div className="flex-1" />

            {/* Header Actions */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="relative hidden sm:flex"
              >
                <Search className="w-4 h-4" />
              </Button>

              <DashboardNotifications />

              <div className="hidden sm:block">
                <ThemeToggle />
              </div>
              <UserMenu />
            </div>
          </header>

          {/* Scrollable Content */}
          <main className="flex-1 overflow-y-auto h-[calc(100vh-4rem)] p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
