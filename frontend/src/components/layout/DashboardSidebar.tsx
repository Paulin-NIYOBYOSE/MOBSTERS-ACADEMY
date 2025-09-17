import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Home,
  BookOpen,
  Crown,
  Shield,
  Users,
  Settings,
  TrendingUp,
  Calendar,
  Award,
  BarChart3,
  LogOut
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

const navigationItems = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: Home,
    roles: ['community_student', 'academy_student', 'mentorship_student', 'admin']
  },
  {
    title: 'Academy',
    url: '/academy',
    icon: BookOpen,
    roles: ['academy_student', 'admin'],
    badge: 'Premium'
  },
  {
    title: 'Mentorship',
    url: '/mentorship',
    icon: Crown,
    roles: ['mentorship_student', 'admin'],
    badge: 'Elite'
  },
  {
    title: 'Admin Panel',
    url: '/admin',
    icon: Shield,
    roles: ['admin'],
    badge: 'Admin'
  }
];

const quickActions = [
  { title: 'Live Sessions', icon: Calendar, action: 'sessions' },
  { title: 'Trading Signals', icon: TrendingUp, action: 'signals' },
  { title: 'Performance', icon: BarChart3, action: 'performance' },
  { title: 'Leaderboard', icon: Award, action: 'leaderboard' }
];

export function DashboardSidebar() {
  const { state, isMobile } = useSidebar();
  const collapsed = state === 'collapsed';
  const location = useLocation();
  const { user, hasRole, logout } = useAuth();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;

  const getNavClassName = (path: string) => {
    return cn(
      'w-full justify-start transition-colors',
      isActive(path) 
        ? 'bg-primary text-primary-foreground font-medium' 
        : 'hover:bg-muted/50'
    );
  };

  const visibleItems = navigationItems.filter(item => 
    item.roles.some(role => hasRole(role) || (role === 'community_student' && !user?.roles?.length))
  );

  return (
    <Sidebar className={cn(
      'transition-all duration-300 ease-in-out border-r border-border/50 bg-background/95 backdrop-blur-md',
      collapsed ? 'w-16' : 'w-64'
    )}>
      <SidebarContent className="p-4">
        {/* User Profile Section */}
        <div className={cn(
          'mb-6 p-4 rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20',
          collapsed && 'p-2'
        )}>
          {!collapsed ? (
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-primary to-primary/80 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{user?.name || 'User'}</p>
                  <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                </div>
              </div>
              {user?.roles && user.roles.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {user.roles.map((role, index) => (
                    <Badge key={index} variant="secondary" className="text-xs px-2 py-0.5">
                      {role.replace('_student', '').replace('_', ' ')}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-primary/80 rounded-full flex items-center justify-center mx-auto">
              <span className="text-white font-bold text-xs">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
          )}
        </div>

        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className={cn(collapsed && 'sr-only')}>
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {visibleItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavClassName(item.url)}>
                      <item.icon className="w-4 h-4 shrink-0" />
                      {!collapsed && (
                        <div className="flex items-center justify-between flex-1 min-w-0">
                          <span className="truncate">{item.title}</span>
                          {item.badge && (
                            <Badge variant="outline" className="text-xs ml-2 shrink-0">
                              {item.badge}
                            </Badge>
                          )}
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
        {!collapsed && (
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
                  >
                    <action.icon className="w-4 h-4" />
                    <span className="truncate">{action.title}</span>
                  </Button>
                ))}
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

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
              <SidebarMenuButton onClick={logout} className="text-destructive hover:text-destructive">
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