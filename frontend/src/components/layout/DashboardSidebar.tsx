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

const navigationItems = [
  {
    title: "Dashboard",
    url: "/admin/overview",
    icon: Home,
    roles: ["admin"],
  },
  {
    title: "Users",
    url: "/admin/users",
    icon: Users,
    roles: ["admin"],
  },
  {
    title: "Courses",
    url: "/admin/courses",
    icon: BookOpen,
    roles: ["admin"],
  },
  {
    title: "Live Sessions",
    url: "/admin/sessions",
    icon: Calendar,
    roles: ["admin"],
  },
  {
    title: "Signals",
    url: "/admin/signals",
    icon: BarChart3,
    roles: ["admin"],
  },
  {
    title: "Transactions",
    url: "/admin/transactions",
    icon: DollarSign,
    roles: ["admin"],
  },
  {
    title: "Messages",
    url: "/admin/messages",
    icon: MessageSquare,
    roles: ["admin"],
  },
];

const quickActions = [
  { title: "Manage Users", icon: Users, action: "users" },
  { title: "Add Course", icon: BookOpen, action: "courses" },
  { title: "Schedule Session", icon: Calendar, action: "sessions" },
  { title: "Create Signal", icon: BarChart3, action: "signals" },
];

export function DashboardSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const { user, hasRole } = useAuth();

  const isActive = (path: string) => location.pathname === path;
  const getNavClassName = (path: string) =>
    cn(
      "w-full justify-start transition-colors",
      isActive(path)
        ? "bg-primary text-primary-foreground font-medium"
        : "hover:bg-muted/50"
    );

  const visibleItems = navigationItems.filter((item) =>
    item.roles.some((role) => hasRole(role))
  );

  return (
    <Sidebar
      className={cn(
        "transition-all duration-300 ease-in-out border-r border-border/50 bg-background/95 backdrop-blur-md",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <SidebarContent className="p-4">
        {/* User Profile */}
        <div
          className={cn(
            "mb-6 p-4 rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20",
            collapsed && "p-2"
          )}
        >
          {!collapsed ? (
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-primary to-primary/80 rounded-full flex items-center justify-center">
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
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-primary/80 rounded-full flex items-center justify-center mx-auto">
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

        {/* Settings & Logout */}
        <div className="mt-auto pt-4 border-t border-border/50">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton>
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
                className="text-destructive hover:text-destructive"
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
