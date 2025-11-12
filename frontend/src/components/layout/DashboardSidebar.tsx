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
  const items: { title: string; url: string; icon: any; roles: string[] }[] =
    [];

  // Admin section
  if (hasRole("admin")) {
    items.push(
      { title: "Dashboard", url: "/dashboard", icon: Home, roles: ["admin"] },
      {
        title: "Users",
        url: "/dashboard/users",
        icon: Users,
        roles: ["admin"],
      },
      {
        title: "Courses",
        url: "/dashboard/courses",
        icon: BookOpen,
        roles: ["admin"],
      },
      {
        title: "Live Sessions",
        url: "/dashboard/sessions",
        icon: Calendar,
        roles: ["admin"],
      },
      {
        title: "Trading Journal",
        url: "/dashboard/journal",
        icon: BarChart3,
        roles: ["admin"],
      },
      {
        title: "Transactions",
        url: "/dashboard/transactions",
        icon: DollarSign,
        roles: ["admin"],
      },
      {
        title: "Messages",
        url: "/dashboard/messages",
        icon: MessageSquare,
        roles: ["admin"],
      }
    );
  }

  // Academy student section
  if (hasRole("academy_student")) {
    items.push(
      {
        title: "Overview",
        url: "/dashboard",
        icon: Home,
        roles: ["academy_student", "admin"],
      },
      {
        title: "Courses",
        url: "/dashboard/courses",
        icon: BookOpen,
        roles: ["academy_student", "admin"],
      },
      {
        title: "Live Sessions",
        url: "/dashboard/sessions",
        icon: Calendar,
        roles: ["academy_student", "admin"],
      },
      {
        title: "Assignments",
        url: "/dashboard/assignments",
        icon: MessageSquare,
        roles: ["academy_student", "admin"],
      },
      {
        title: "Trading Journal",
        url: "/dashboard/journal",
        icon: BarChart3,
        roles: ["academy_student", "admin"],
      }
    );
  }

  // Mentorship student section
  if (hasRole("mentorship_student")) {
    items.push(
      {
        title: "Overview",
        url: "/dashboard",
        icon: Home,
        roles: ["mentorship_student", "admin"],
      },
      {
        title: "Live Sessions",
        url: "/dashboard/sessions",
        icon: Calendar,
        roles: ["mentorship_student", "admin"],
      },
      {
        title: "Strategies",
        url: "/dashboard/strategies",
        icon: BookOpen,
        roles: ["mentorship_student", "admin"],
      },
      {
        title: "Challenges",
        url: "/dashboard/challenges",
        icon: Users,
        roles: ["mentorship_student", "admin"],
      },
      {
        title: "Trading Journal",
        url: "/dashboard/journal",
        icon: BarChart3,
        roles: ["mentorship_student", "admin"],
      }
    );
  }

  // Default: if no specific roles, show nothing (FreeDashboard is routed elsewhere)
  if (items.length === 0) {
    // Free/Community users: dashboard sections via sidebar
    items.push(
      { title: "Overview", url: "/dashboard", icon: Home, roles: [] },
      {
        title: "Free Courses",
        url: "/dashboard/courses",
        icon: BookOpen,
        roles: [],
      },
      {
        title: "Community",
        url: "/dashboard/community",
        icon: Users,
        roles: [],
      }
    );
  }

  return items;
};

const quickActions = [
  { title: "Manage Users", icon: Users, action: "users" },
  { title: "Add Course", icon: BookOpen, action: "courses" },
  { title: "Schedule Session", icon: Calendar, action: "sessions" },
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
      "w-full justify-start transition-all duration-200 rounded-lg",
      isActive(path)
        ? "bg-gradient-primary text-white font-semibold shadow-md hover:shadow-lg"
        : "hover:bg-accent/50 text-foreground/80 hover:text-foreground"
    );

  const visibleItems = navigationItems(hasRole);

  // Determine dashboard theme colors based on user role - consistent green theme across all dashboards
  const getDashboardTheme = () => {
    return {
      gradient: "from-green-50/30 via-emerald-50/20 to-green-50/30 dark:from-slate-900/30 dark:via-slate-800/20 dark:to-slate-900/30",
      accent: "from-primary to-primary-light",
      border: "border-green-200/50 dark:border-slate-700/50",
      bg: "bg-white/80 dark:bg-slate-800/80",
      sidebarBg: "bg-gradient-to-b from-green-50/50 via-emerald-50/30 to-green-50/50 dark:from-slate-900/50 dark:via-slate-800/30 dark:to-slate-900/50",
    };
  };

  const theme = getDashboardTheme();

  return (
    <Sidebar
      className={cn(
        "transition-all duration-300 ease-in-out border-r glass-effect",
        theme.border,
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-green-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl"></div>
      </div>

      <SidebarContent className={cn("relative p-4", theme.sidebarBg)}>
        {/* User Profile */}
        <div
          className={cn(
            "mb-6 p-4 rounded-xl glass-card shadow-md transition-all duration-300 hover:shadow-lg hover-lift",
            collapsed && "p-2"
          )}
        >
          {!collapsed ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center shadow-md">
                  <span className="text-white font-bold text-sm">
                    {user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-display font-semibold text-sm truncate text-foreground">
                    {user?.name || "User"}
                  </p>
                  <p className="caption truncate">{user?.email}</p>
                </div>
              </div>
              {user?.roles?.length && (
                <div className="flex flex-wrap gap-1.5">
                  {user.roles.map((role, idx) => (
                    <Badge
                      key={idx}
                      className="bg-primary/10 text-primary border-primary/20 text-xs px-2 py-0.5 font-medium"
                    >
                      {role.replace("_student", "").replace("_", " ")}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center mx-auto shadow-md">
              <span className="text-white font-bold text-xs">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </span>
            </div>
          )}
        </div>

        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {visibleItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={getNavClassName(item.url)}
                    >
                      <item.icon className="w-5 h-5 shrink-0" />
                      {!collapsed && (
                        <div className="flex items-center justify-between flex-1 min-w-0">
                          <span className="truncate body-sm font-medium">
                            {item.title}
                          </span>
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
          <SidebarMenu className="space-y-1">
            <SidebarMenuItem>
              <SidebarMenuButton className="hover:bg-accent/50 transition-all duration-200 rounded-lg">
                <Settings className="w-5 h-5" />
                {!collapsed && (
                  <span className="body-sm font-medium">Settings</span>
                )}
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={async () => {
                  await authService.logout();
                  window.location.href = "/";
                }}
                className="text-destructive hover:text-destructive hover:bg-destructive/10 transition-all duration-200 rounded-lg"
              >
                <LogOut className="w-5 h-5" />
                {!collapsed && (
                  <span className="body-sm font-medium">Logout</span>
                )}
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
