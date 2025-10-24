import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Home,
  Users,
  BookOpen,
  Calendar,
  BarChart3,
  DollarSign,
  MessageSquare,
  Settings,
  LogOut,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { authService } from "@/services/authService";

interface DashboardSidebarProps {
  onQuickAction?: (action: string) => void;
}

const navigationItems = (
  hasRole: (r: string) => boolean
): { title: string; url: string; icon: any; roles: string[] }[] => {
  const items: { title: string; url: string; icon: any; roles: string[] }[] = [];

  // Admin section
  if (hasRole("admin")) {
    items.push(
      { title: "Dashboard", url: "/dashboard", icon: Home, roles: ["admin"] },
      { title: "Users", url: "/dashboard/users", icon: Users, roles: ["admin"] },
      { title: "Courses", url: "/dashboard/courses", icon: BookOpen, roles: ["admin"] },
      { title: "Live Sessions", url: "/dashboard/sessions", icon: Calendar, roles: ["admin"] },
      { title: "Signals", url: "/dashboard/signals", icon: BarChart3, roles: ["admin"] },
      { title: "Transactions", url: "/dashboard/transactions", icon: DollarSign, roles: ["admin"] },
      { title: "Messages", url: "/dashboard/messages", icon: MessageSquare, roles: ["admin"] }
    );
  }

  // Academy student section
  if (hasRole("academy_student")) {
    items.push(
      { title: "Overview", url: "/dashboard", icon: Home, roles: ["academy_student", "admin"] },
      { title: "Courses", url: "/dashboard/courses", icon: BookOpen, roles: ["academy_student", "admin"] },
      { title: "Live Sessions", url: "/dashboard/sessions", icon: Calendar, roles: ["academy_student", "admin"] },
      { title: "Assignments", url: "/dashboard/assignments", icon: MessageSquare, roles: ["academy_student", "admin"] },
      { title: "Trading Journal", url: "/dashboard/journal", icon: BarChart3, roles: ["academy_student", "admin"] }
    );
  }

  // Mentorship student section
  if (hasRole("mentorship_student")) {
    items.push(
      { title: "Overview", url: "/dashboard", icon: Home, roles: ["mentorship_student", "admin"] },
      { title: "Live Sessions", url: "/dashboard/sessions", icon: Calendar, roles: ["mentorship_student", "admin"] },
      { title: "Strategies", url: "/dashboard/strategies", icon: BookOpen, roles: ["mentorship_student", "admin"] },
      { title: "Premium Signals", url: "/dashboard/signals", icon: BarChart3, roles: ["mentorship_student", "admin"] },
      { title: "Challenges", url: "/dashboard/challenges", icon: Users, roles: ["mentorship_student", "admin"] }
    );
  }

  // Default: if no specific roles, show nothing (FreeDashboard is routed elsewhere)
  if (items.length === 0) {
    // Free/Community users: dashboard sections via sidebar
    items.push(
      { title: "Overview", url: "/dashboard", icon: Home, roles: [] },
      { title: "Free Courses", url: "/dashboard/courses", icon: BookOpen, roles: [] },
      { title: "Daily Signals", url: "/dashboard/signals", icon: BarChart3, roles: [] },
      { title: "Community", url: "/dashboard/community", icon: Users, roles: [] }
    );
  }

  return items;
};

const quickActions = [
  { title: "Manage Users", icon: Users, action: "users" },
  { title: "Add Course", icon: BookOpen, action: "courses" },
  { title: "Schedule Session", icon: Calendar, action: "sessions" },
  { title: "Create Signal", icon: BarChart3, action: "signals" },
];

export function DashboardSidebar({ onQuickAction }: DashboardSidebarProps) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const { user, hasRole } = useAuth();

  const isActive = (path: string) => {
    if (path === "/dashboard") return location.pathname === "/dashboard";
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };
  const getNavClassName = (path: string) =>
    cn(
      "w-full justify-start transition-colors",
      isActive(path)
        ? "bg-primary text-primary-foreground font-medium"
        : "hover:bg-muted/50"
    );

  const visibleItems = navigationItems(hasRole);

  // Determine dashboard theme colors based on user role
  const getDashboardTheme = () => {
    if (hasRole("admin")) {
      return {
        gradient: "from-purple-50/50 via-blue-50/30 to-purple-50/50 dark:from-slate-900/50 dark:via-slate-800/30 dark:to-slate-900/50",
        accent: "from-purple-500 to-blue-500",
        border: "border-purple-200/50 dark:border-slate-700/50",
        bg: "bg-white/80 dark:bg-slate-900/80",
        sidebarBg: "bg-gradient-to-b from-purple-50/50 via-blue-50/30 to-purple-50/50 dark:from-slate-900/90 dark:via-slate-800/90 dark:to-slate-900/90"
      };
    }
    if (hasRole("academy_student")) {
      return {
        gradient: "from-blue-50/50 via-purple-50/30 to-blue-50/50 dark:from-slate-900/50 dark:via-slate-800/30 dark:to-slate-900/50",
        accent: "from-blue-500 to-purple-500",
        border: "border-blue-200/50 dark:border-slate-700/50",
        bg: "bg-white/80 dark:bg-slate-900/80",
        sidebarBg: "bg-gradient-to-b from-blue-50/50 via-purple-50/30 to-blue-50/50 dark:from-slate-900/90 dark:via-slate-800/90 dark:to-slate-900/90"
      };
    }
    if (hasRole("mentorship_student")) {
      return {
        gradient: "from-green-50/50 via-teal-50/30 to-green-50/50 dark:from-slate-900/50 dark:via-slate-800/30 dark:to-slate-900/50",
        accent: "from-green-500 to-teal-500",
        border: "border-green-200/50 dark:border-slate-700/50",
        bg: "bg-white/80 dark:bg-slate-900/80",
        sidebarBg: "bg-gradient-to-b from-green-50/50 via-teal-50/30 to-green-50/50 dark:from-slate-900/90 dark:via-slate-800/90 dark:to-slate-900/90"
      };
    }
    // Free dashboard
    return {
      gradient: "from-green-50/50 via-emerald-50/30 to-green-50/50 dark:from-slate-900/50 dark:via-slate-800/30 dark:to-slate-900/50",
      accent: "from-green-500 to-emerald-500",
      border: "border-green-200/50 dark:border-slate-700/50",
      bg: "bg-white/80 dark:bg-slate-900/80",
      sidebarBg: "bg-gradient-to-b from-green-50/50 via-emerald-50/30 to-green-50/50 dark:from-slate-900/90 dark:via-slate-800/90 dark:to-slate-900/90"
    };
  };

  const theme = getDashboardTheme();

  return (
    <Sidebar
      className={cn(
        "transition-all duration-300 ease-in-out border-r backdrop-blur-md",
        theme.border,
        theme.sidebarBg,
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-br from-blue-500/5 to-purple-500/5 dark:from-slate-700/10 dark:to-slate-600/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-gradient-to-br from-purple-500/5 to-blue-500/5 dark:from-slate-600/10 dark:to-slate-700/10 rounded-full blur-xl"></div>
      </div>
      
      <SidebarContent className="relative p-4">
        {/* User Profile */}
        <div
          className={cn(
            "mb-6 p-4 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl",
            `bg-gradient-to-r ${theme.gradient} border ${theme.border}`,
            collapsed && "p-2"
          )}
        >
          {!collapsed ? (
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 bg-gradient-to-r ${theme.accent} rounded-full flex items-center justify-center shadow-lg`}>
                  <span className="text-white font-bold text-sm">
                    {user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">
                    {user?.name || "User"}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user?.email}
                  </p>
                </div>
              </div>
              {user?.roles?.length && (
                <div className="flex flex-wrap gap-1">
                  {user.roles.map((role, idx) => (
                    <Badge
                      key={idx}
                      variant="secondary"
                      className="text-xs px-2 py-0.5"
                    >
                      {role.replace("_student", "").replace("_", " ")}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className={`w-8 h-8 bg-gradient-to-r ${theme.accent} rounded-full flex items-center justify-center mx-auto shadow-lg`}>
              <span className="text-white font-bold text-xs">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </span>
            </div>
          )}
        </div>

        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className={cn(collapsed && "sr-only")}>
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {visibleItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={getNavClassName(item.url)}
                    >
                      <item.icon className="w-4 h-4 shrink-0" />
                      {!collapsed && (
                        <div className="flex items-center justify-between flex-1 min-w-0">
                          <span className="truncate">{item.title}</span>
                        </div>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Quick Actions */}
        {/* {!collapsed && (
          <SidebarGroup className="mt-6">
            <SidebarGroupLabel>Quick Actions</SidebarGroupLabel>
            <SidebarGroupContent>
              <div className="grid grid-cols-2 gap-2">
                {quickActions.map((action) => (
                  <Button
                    key={action.title}
                    variant="outline"
                    size="sm"
                    className="h-auto flex-col gap-1 p-3 text-xs"
                    onClick={() =>
                      onQuickAction && onQuickAction(action.action)
                    }
                  >
                    <action.icon className="w-4 h-4" />
                    <span className="truncate">{action.title}</span>
                  </Button>
                ))}
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        )} */}

        {/* Settings & Logout */}
        <div className={`mt-auto pt-4 border-t ${theme.border}`}>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton className="hover:bg-muted/50 transition-colors duration-200">
                <Settings className="w-4 h-4" />
                {!collapsed && <span>Settings</span>}
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={async () => {
                  await authService.logout();
                  window.location.href = "/";
                }}
                className="text-destructive hover:text-destructive hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors duration-200"
              >
                <LogOut className="w-4 h-4" />
                {!collapsed && <span>Logout</span>}
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
