import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Bell, 
  X, 
  TrendingUp, 
  Users, 
  BookOpen, 
  Award,
  AlertCircle,
  CheckCircle,
  Calendar,
  MessageCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  icon: React.ComponentType<any>;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'info',
    title: 'New Live Session',
    message: 'Advanced Risk Management session starts in 30 minutes',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    icon: Calendar,
    action: {
      label: 'Join Session',
      onClick: () => console.log('Join session')
    }
  },
  {
    id: '2',
    type: 'success',
    title: 'Signal Update',
    message: 'EUR/USD signal reached take profit target (+85 pips)',
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    icon: TrendingUp
  },
  {
    id: '3',
    type: 'warning',
    title: 'Assignment Due',
    message: 'Week 4 Trading Journal due tomorrow at 11:59 PM',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    icon: BookOpen,
    action: {
      label: 'View Assignment',
      onClick: () => console.log('View assignment')
    }
  },
  {
    id: '4',
    type: 'info',
    title: 'New Message',
    message: 'Your mentor replied to your question about position sizing',
    timestamp: new Date(Date.now() - 60 * 60 * 1000),
    icon: MessageCircle,
    action: {
      label: 'Read Message',
      onClick: () => console.log('Read message')
    }
  }
];

export function DashboardNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const { hasRole } = useAuth();

  useEffect(() => {
    // Filter notifications based on user role
    const filteredNotifications = mockNotifications.filter(notification => {
      if (hasRole('admin')) return true;
      if (hasRole('mentorship_student')) return true;
      if (hasRole('academy_student')) return notification.type !== 'error';
      return notification.type === 'info' || notification.type === 'success';
    });

    setNotifications(filteredNotifications);
  }, [hasRole]);

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'success':
        return CheckCircle;
      case 'warning':
        return AlertCircle;
      case 'error':
        return AlertCircle;
      default:
        return Bell;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'text-green-500';
      case 'warning':
        return 'text-yellow-500';
      case 'error':
        return 'text-red-500';
      default:
        return 'text-blue-500';
    }
  };

  const unreadCount = notifications.length;

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        className="relative"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-1 -right-1 w-5 h-5 p-0 text-xs flex items-center justify-center"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </Badge>
        )}
      </Button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-96 z-50">
          <Card className="border-0 shadow-2xl bg-background/95 backdrop-blur-md">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Notifications</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-muted-foreground">
                  <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No new notifications</p>
                </div>
              ) : (
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notification) => {
                    const IconComponent = notification.icon;
                    const TypeIcon = getTypeIcon(notification.type);
                    
                    return (
                      <div
                        key={notification.id}
                        className="p-4 border-b border-border/50 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <div className={cn(
                            'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
                            notification.type === 'success' && 'bg-green-500/10',
                            notification.type === 'warning' && 'bg-yellow-500/10',
                            notification.type === 'error' && 'bg-red-500/10',
                            notification.type === 'info' && 'bg-blue-500/10'
                          )}>
                            <IconComponent className={cn('w-4 h-4', getTypeColor(notification.type))} />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-semibold text-sm truncate">
                                {notification.title}
                              </h4>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="w-6 h-6 p-0 flex-shrink-0"
                                onClick={() => removeNotification(notification.id)}
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {notification.message}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-muted-foreground">
                                {notification.timestamp.toLocaleTimeString()}
                              </span>
                              {notification.action && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-7 text-xs"
                                  onClick={notification.action.onClick}
                                >
                                  {notification.action.label}
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              
              {notifications.length > 0 && (
                <div className="p-4 border-t border-border/50">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => setNotifications([])}
                  >
                    Clear All
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}