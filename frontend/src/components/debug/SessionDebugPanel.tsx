import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertCircle, CheckCircle, Clock, User, Wifi } from 'lucide-react';

interface DebugLog {
  timestamp: string;
  level: 'info' | 'warn' | 'error';
  component: string;
  message: string;
  data?: any;
}

export const SessionDebugPanel: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [logs, setLogs] = useState<DebugLog[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Override console methods to capture logs
    const originalConsoleLog = console.log;
    const originalConsoleError = console.error;
    const originalConsoleWarn = console.warn;

    const addLog = (level: 'info' | 'warn' | 'error', args: any[]) => {
      const message = args.join(' ');
      
      // Only capture session-related logs
      if (message.includes('[LiveSessionRoom]') || 
          message.includes('[SessionJoin]') || 
          message.includes('[LiveSessionService]') ||
          message.includes('[AuthService]')) {
        
        const log: DebugLog = {
          timestamp: new Date().toLocaleTimeString(),
          level,
          component: message.match(/\[(.*?)\]/)?.[1] || 'Unknown',
          message: message.replace(/\[.*?\]\s*/, ''),
          data: args.length > 1 ? args.slice(1) : undefined
        };
        
        setLogs(prev => [...prev.slice(-49), log]); // Keep last 50 logs
      }
    };

    console.log = (...args) => {
      originalConsoleLog(...args);
      addLog('info', args);
    };

    console.error = (...args) => {
      originalConsoleError(...args);
      addLog('error', args);
    };

    console.warn = (...args) => {
      originalConsoleWarn(...args);
      addLog('warn', args);
    };

    return () => {
      console.log = originalConsoleLog;
      console.error = originalConsoleError;
      console.warn = originalConsoleWarn;
    };
  }, []);

  const clearLogs = () => setLogs([]);

  const getStatusIcon = (level: string) => {
    switch (level) {
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'warn':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return <CheckCircle className="w-4 h-4 text-green-500" />;
    }
  };

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsVisible(true)}
          variant="outline"
          size="sm"
          className="bg-gray-900 text-white border-gray-600 hover:bg-gray-800"
        >
          🐛 Debug
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 h-96 z-50">
      <Card className="h-full bg-gray-900 text-white border-gray-600">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">Session Debug Panel</CardTitle>
            <div className="flex items-center space-x-2">
              <Button onClick={clearLogs} variant="ghost" size="sm">
                Clear
              </Button>
              <Button onClick={() => setIsVisible(false)} variant="ghost" size="sm">
                ✕
              </Button>
            </div>
          </div>
          
          {/* Status indicators */}
          <div className="flex items-center space-x-4 text-xs">
            <div className="flex items-center space-x-1">
              <User className="w-3 h-3" />
              <Badge variant={isAuthenticated ? "default" : "destructive"} className="text-xs">
                {isAuthenticated ? 'Auth OK' : 'No Auth'}
              </Badge>
            </div>
            <div className="flex items-center space-x-1">
              <Wifi className="w-3 h-3" />
              <Badge variant="outline" className="text-xs">
                Online
              </Badge>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-2 h-full">
          <ScrollArea className="h-72">
            <div className="space-y-1">
              {logs.length === 0 ? (
                <p className="text-gray-400 text-xs">No session logs yet...</p>
              ) : (
                logs.map((log, index) => (
                  <div key={index} className="flex items-start space-x-2 p-1 rounded text-xs">
                    {getStatusIcon(log.level)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-400">{log.timestamp}</span>
                        <Badge variant="outline" className="text-xs">
                          {log.component}
                        </Badge>
                      </div>
                      <p className="text-gray-200 break-words">{log.message}</p>
                      {log.data && (
                        <pre className="text-xs text-gray-400 mt-1 overflow-hidden">
                          {JSON.stringify(log.data, null, 2).slice(0, 200)}
                        </pre>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default SessionDebugPanel;
