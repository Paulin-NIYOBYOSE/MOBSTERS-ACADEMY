import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  CheckCircle, 
  Clock, 
  Shield, 
  UserPlus,
  Settings,
  BarChart3,
  Loader2
} from 'lucide-react';
import { authService } from '@/services/authService';
import { useToast } from '@/hooks/use-toast';

interface RoleRequest {
  id: string;
  userId: string;
  program: string;
  status: string;
  createdAt: string;
  user?: {
    name: string;
    email: string;
  };
}

export const AdminDashboard: React.FC = () => {
  const [roleRequests, setRoleRequests] = useState<RoleRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const { toast } = useToast();

  useEffect(() => {
    loadRoleRequests();
    
    // Auto-refresh admin data every minute
    const interval = setInterval(() => {
      loadRoleRequests();
      setLastRefresh(new Date());
    }, 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const loadRoleRequests = async () => {
    try {
      const data = await authService.getPendingRoleRequests();
      setRoleRequests(data);
    } catch (error) {
      console.error('Failed to load role requests:', error);
      toast({
        title: 'Error',
        description: 'Failed to load role requests. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApproveRequest = async (requestId: string) => {
    setProcessingIds(prev => new Set(prev).add(requestId));
    
    try {
      await authService.approveRoleRequest(requestId);
      
      toast({
        title: 'Request Approved',
        description: 'The role request has been approved successfully.',
      });
      
      // Refresh the list
      await loadRoleRequests();
    } catch (error) {
      console.error('Failed to approve request:', error);
      toast({
        title: 'Error',
        description: 'Failed to approve request. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(requestId);
        return newSet;
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'approved':
        return <Badge variant="secondary"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>;
      case 'paid':
        return <Badge variant="default"><CheckCircle className="w-3 h-3 mr-1" />Paid</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getProgramBadge = (program: string) => {
    switch (program) {
      case 'academy':
        return <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">Academy</Badge>;
      case 'mentorship':
        return <Badge className="bg-gradient-to-r from-green-500 to-teal-500 text-white">Mentorship</Badge>;
      default:
        return <Badge variant="secondary">{program}</Badge>;
    }
  };

const pendingRequests = roleRequests.filter(req => req.status === 'pending');
  const allRequests = roleRequests;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gradient-to-br from-background via-background to-muted/30 min-h-full">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                <Shield className="w-10 h-10 text-primary" />
                Admin <span className="text-primary">Dashboard</span>
              </h1>
              <p className="text-muted-foreground text-lg">
                Manage user role requests and monitor academy operations.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  loadRoleRequests();
                  setLastRefresh(new Date());
                }}
                disabled={loading}
              >
                {loading ? 'Refreshing...' : 'Refresh'}
              </Button>
              <div className="text-sm text-muted-foreground">
                Last updated: {lastRefresh.toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{pendingRequests.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{allRequests.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Academy Students</CardTitle>
              <UserPlus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {allRequests.filter(req => req.program === 'academy' && req.status === 'approved').length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Mentorship Students</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {allRequests.filter(req => req.program === 'mentorship' && req.status === 'approved').length}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pending">Pending Approval ({pendingRequests.length})</TabsTrigger>
            <TabsTrigger value="all">All Requests ({allRequests.length})</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4">
            {pendingRequests.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <CheckCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Pending Requests</h3>
                  <p className="text-muted-foreground">All role requests have been processed.</p>
                </CardContent>
              </Card>
            ) : (
              pendingRequests.map((request) => (
                <Card key={request.id} className="border-l-4 border-l-primary">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">
                          {request.user?.name || 'Unknown User'}
                        </CardTitle>
                        <CardDescription>
                          {request.user?.email} • Applied {new Date(request.createdAt).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        {getProgramBadge(request.program)}
                        {getStatusBadge(request.status)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                    Request ID: {request.id.toString().slice(0, 8)}...
                      </div>
                      <Button 
                        onClick={() => handleApproveRequest(request.id)}
                        disabled={processingIds.has(request.id)}
                        variant="cta"
                      >
                        {processingIds.has(request.id) ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Approving...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Approve Access
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="all" className="space-y-4">
            {allRequests.map((request) => (
              <Card key={request.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">
                        {request.user?.name || 'Unknown User'}
                      </CardTitle>
                      <CardDescription>
                        {request.user?.email} • Applied {new Date(request.createdAt).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      {getProgramBadge(request.program)}
                      {getStatusBadge(request.status)}
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Admin Settings
                </CardTitle>
                <CardDescription>
                  Configure academy settings and preferences.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="w-4 h-4 mr-2" />
                    Manage Users
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="w-4 h-4 mr-2" />
                    System Configuration
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Analytics & Reports
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};