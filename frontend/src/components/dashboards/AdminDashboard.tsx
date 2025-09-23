import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Users,
  CheckCircle,
  Clock,
  BookOpen,
  Plus,
  Edit,
  Trash2,
  Upload,
  Video,
  BarChart3,
  Loader2,
  DollarSign,
  GraduationCap,
} from "lucide-react";
import { authService } from "@/services/authService";
import { useToast } from "@/hooks/use-toast";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

interface RoleRequest {
  id: number;
  userId: number;
  program: string;
  status: string;
  createdAt: string;
  user: { name: string; email: string };
}

interface Course {
  id: number;
  title: string;
  content: string;
  roleAccess: string[];
  createdAt: string;
  completion?: number;
}

interface LiveSession {
  id: number;
  title: string;
  description: string;
  date: string;
  roleAccess: string[];
  createdAt: string;
}

interface Signal {
  id: number;
  title: string;
  content: string;
  roleAccess: string[];
  createdAt: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  plan: string;
  status: string;
  subscriptionEnd?: string;
}

interface OverviewStats {
  totalStudents: number;
  activeMentorships: number;
  revenueThisMonth: number;
  expiringSoon: User[];
}

export const AdminDashboard: React.FC = () => {
  const [roleRequests, setRoleRequests] = useState<RoleRequest[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [sessions, setSessions] = useState<LiveSession[]>([]);
  const [signals, setSignals] = useState<Signal[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [overviewStats, setOverviewStats] = useState<OverviewStats>({
    totalStudents: 0,
    activeMentorships: 0,
    revenueThisMonth: 0,
    expiringSoon: [],
  });
  const [loading, setLoading] = useState(true);
  const [contentLoading, setContentLoading] = useState(false);
  const [processingIds, setProcessingIds] = useState<Set<number>>(new Set());
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [contentModalOpen, setContentModalOpen] = useState(false);
  const [contentType, setContentType] = useState<
    "course" | "session" | "signal"
  >("course");
  const [editingContent, setEditingContent] = useState<
    Course | LiveSession | Signal | null
  >(null);
  const [contentForm, setContentForm] = useState({
    title: "",
    content: "",
    description: "",
    date: "",
    roleAccess: ["community_student"] as string[],
  });
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const { toast } = useToast();

  useEffect(() => {
    loadData();
    const interval = setInterval(() => {
      loadData();
      setLastRefresh(new Date());
    }, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      const [
        requestsData,
        coursesData,
        sessionsData,
        signalsData,
        usersData,
        statsData,
      ] = await Promise.all([
        authService.getPendingRoleRequests(),
        authService.getCourses(),
        authService.getLiveSessions(),
        authService.getSignals(),
        authService.getUsers(),
        authService.getOverviewStats(),
      ]);
      setRoleRequests(requestsData);
      setCourses(coursesData);
      setSessions(sessionsData);
      setSignals(signalsData);
      setUsers(usersData);
      setOverviewStats(statsData);
    } catch (error) {
      console.error("Failed to load admin data:", error);
      toast({
        title: "Error",
        description: "Failed to load data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApproveRequest = async (requestId: number) => {
    setProcessingIds((prev) => new Set(prev).add(requestId));
    try {
      await authService.approveRoleRequest(requestId);
      toast({
        title: "Request Approved",
        description: "The role request has been approved successfully.",
      });
      await loadData();
    } catch (error) {
      console.error("Failed to approve request:", error);
      toast({
        title: "Error",
        description: "Failed to approve request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(requestId);
        return newSet;
      });
    }
  };

  const handleContentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setContentLoading(true);

    try {
      if (contentType === "course") {
        if (editingContent) {
          await authService.updateCourse((editingContent as Course).id, {
            title: contentForm.title,
            content: contentForm.content,
            roleAccess: contentForm.roleAccess,
          });
          toast({
            title: "Course Updated",
            description: "The course has been updated successfully.",
          });
        } else {
          await authService.createCourse({
            title: contentForm.title,
            content: contentForm.content,
            roleAccess: contentForm.roleAccess,
          });
          toast({
            title: "Course Created",
            description: "The course has been created successfully.",
          });
        }
      } else if (contentType === "session") {
        if (editingContent) {
          await authService.updateLiveSession(
            (editingContent as LiveSession).id,
            {
              title: contentForm.title,
              description: contentForm.description,
              date: contentForm.date,
              roleAccess: contentForm.roleAccess,
            }
          );
          toast({
            title: "Session Updated",
            description: "The session has been updated successfully.",
          });
        } else {
          await authService.createLiveSession({
            title: contentForm.title,
            description: contentForm.description,
            date: contentForm.date,
            roleAccess: contentForm.roleAccess,
          });
          toast({
            title: "Session Created",
            description: "The session has been created successfully.",
          });
        }
      } else if (contentType === "signal") {
        if (editingContent) {
          await authService.updateSignal((editingContent as Signal).id, {
            title: contentForm.title,
            content: contentForm.content,
            roleAccess: contentForm.roleAccess,
          });
          toast({
            title: "Signal Updated",
            description: "The signal has been updated successfully.",
          });
        } else {
          await authService.createSignal({
            title: contentForm.title,
            content: contentForm.content,
            roleAccess: contentForm.roleAccess,
          });
          toast({
            title: "Signal Created",
            description: "The signal has been created successfully.",
          });
        }
      }

      setContentModalOpen(false);
      setEditingContent(null);
      setContentForm({
        title: "",
        content: "",
        description: "",
        date: "",
        roleAccess: ["community_student"],
      });
      await loadData();
    } catch (error) {
      console.error("Content operation failed:", error);
      toast({
        title: "Error",
        description: "Failed to save content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setContentLoading(false);
    }
  };

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setContentLoading(true);

    try {
      if (editingUser) {
        await authService.updateUser(editingUser.id, {
          plan: editingUser.plan,
          status: editingUser.status,
        });
        toast({
          title: "User Updated",
          description: "The user has been updated successfully.",
        });
      }
      setUserModalOpen(false);
      setEditingUser(null);
      await loadData();
    } catch (error) {
      console.error("User operation failed:", error);
      toast({
        title: "Error",
        description: "Failed to update user. Please try again.",
        variant: "destructive",
      });
    } finally {
      setContentLoading(false);
    }
  };

  const handleExtendSubscription = async (userId: number) => {
    try {
      await authService.extendSubscription(userId);
      toast({
        title: "Subscription Extended",
        description: "The subscription has been extended successfully.",
      });
      await loadData();
    } catch (error) {
      console.error("Failed to extend subscription:", error);
      toast({
        title: "Error",
        description: "Failed to extend subscription. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCancelSubscription = async (userId: number) => {
    if (!confirm("Are you sure you want to cancel this subscription?")) return;
    try {
      await authService.cancelSubscription(userId);
      toast({
        title: "Subscription Cancelled",
        description: "The subscription has been cancelled successfully.",
      });
      await loadData();
    } catch (error) {
      console.error("Failed to cancel subscription:", error);
      toast({
        title: "Error",
        description: "Failed to cancel subscription. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case "approved":
        return (
          <Badge variant="secondary">
            <CheckCircle className="w-3 h-3 mr-1" />
            Approved
          </Badge>
        );
      case "paid":
        return (
          <Badge variant="default">
            <CheckCircle className="w-3 h-3 mr-1" />
            Paid
          </Badge>
        );
      case "active":
        return (
          <Badge variant="default">
            <CheckCircle className="w-3 h-3 mr-1" />
            Active
          </Badge>
        );
      case "expired":
        return (
          <Badge variant="destructive">
            <Clock className="w-3 h-3 mr-1" />
            Expired
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getProgramBadge = (program: string) => {
    switch (program) {
      case "academy":
        return (
          <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
            Academy
          </Badge>
        );
      case "mentorship":
        return (
          <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            Mentorship
          </Badge>
        );
      default:
        return <Badge variant="secondary">{program}</Badge>;
    }
  };

  const getAccessLevelBadge = (roleAccess: string[]) => {
    return roleAccess.map((level) => (
      <Badge
        key={level}
        className={
          level === "academy_student"
            ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
            : level === "mentorship_student"
            ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
            : "bg-gray-200 text-gray-800"
        }
      >
        {level.replace("_student", "")}
      </Badge>
    ));
  };

  const handleEditContent = (
    content: Course | LiveSession | Signal,
    type: "course" | "session" | "signal"
  ) => {
    setEditingContent(content);
    setContentType(type);
    setContentForm({
      title: content.title,
      content: (content as Course | Signal).content || "",
      description: (content as LiveSession).description || "",
      date: (content as LiveSession).date || "",
      roleAccess: content.roleAccess,
    });
    setContentModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setUserModalOpen(true);
  };

  const handleDeleteContent = async (
    id: number,
    type: "course" | "session" | "signal"
  ) => {
    if (!confirm(`Are you sure you want to delete this ${type}?`)) return;
    try {
      if (type === "course") await authService.deleteCourse(id);
      else if (type === "session") await authService.deleteLiveSession(id);
      else await authService.deleteSignal(id);
      toast({
        title: `${type.charAt(0).toUpperCase() + type.slice(1)} Deleted`,
        description: `The ${type} has been deleted successfully.`,
      });
      await loadData();
    } catch (error) {
      console.error(`Failed to delete ${type}:`, error);
      toast({
        title: "Error",
        description: `Failed to delete ${type}. Please try again.`,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const chartData = courses.map((course) => ({
    name: course.title,
    completion: course.completion || 0,
  }));

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground text-lg">
            Manage role requests and content for Mobsters Forex Academy.
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="sessions">Live Sessions</TabsTrigger>
            <TabsTrigger value="signals">Signals</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Students
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {overviewStats.totalStudents}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Active Mentorships
                  </CardTitle>
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {overviewStats.activeMentorships}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Revenue This Month
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${overviewStats.revenueThisMonth.toFixed(2)}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Expiring Mentorships
                  </CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {overviewStats.expiringSoon.length}
                  </div>
                </CardContent>
              </Card>
            </div>
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Beginner Course Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={chartData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="completion" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Expiring Mentorships Soon</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Subscription End</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {overviewStats.expiringSoon.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.subscriptionEnd}</TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleExtendSubscription(user.id)}
                          >
                            Extend
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Users / Students</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{getProgramBadge(user.plan)}</TableCell>
                        <TableCell>{getStatusBadge(user.status)}</TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditUser(user)}
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            <Dialog open={userModalOpen} onOpenChange={setUserModalOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit User</DialogTitle>
                </DialogHeader>
                {editingUser && (
                  <form onSubmit={handleUserSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="plan">Plan</Label>
                      <Select
                        value={editingUser.plan}
                        onValueChange={(value) =>
                          setEditingUser((prev) =>
                            prev ? { ...prev, plan: value } : null
                          )
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="academy">Academy</SelectItem>
                          <SelectItem value="mentorship">Mentorship</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select
                        value={editingUser.status}
                        onValueChange={(value) =>
                          setEditingUser((prev) =>
                            prev ? { ...prev, status: value } : null
                          )
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="expired">Expired</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex gap-2 pt-4">
                      <Button
                        type="submit"
                        variant="cta"
                        disabled={contentLoading}
                      >
                        {contentLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Updating...
                          </>
                        ) : (
                          "Update User"
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setUserModalOpen(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                )}
              </DialogContent>
            </Dialog>
          </TabsContent>

          <TabsContent value="courses">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Course Management</h3>
              <Dialog
                open={contentModalOpen}
                onOpenChange={setContentModalOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="cta"
                    onClick={() => {
                      setEditingContent(null);
                      setContentType("course");
                      setContentForm({
                        title: "",
                        content: "",
                        description: "",
                        date: "",
                        roleAccess: ["community_student"],
                      });
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Course
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>
                      {editingContent
                        ? `Edit ${
                            contentType.charAt(0).toUpperCase() +
                            contentType.slice(1)
                          }`
                        : `Create New ${
                            contentType.charAt(0).toUpperCase() +
                            contentType.slice(1)
                          }`}
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleContentSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="contentType">Content Type</Label>
                      <Select
                        value={contentType}
                        onValueChange={(
                          value: "course" | "session" | "signal"
                        ) => {
                          setContentType(value);
                          setContentForm({
                            ...contentForm,
                            title: "",
                            content: "",
                            description: "",
                            date: "",
                          });
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="course">Course</SelectItem>
                          <SelectItem value="session">Live Session</SelectItem>
                          <SelectItem value="signal">Signal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        value={contentForm.title}
                        onChange={(e) =>
                          setContentForm((prev) => ({
                            ...prev,
                            title: e.target.value,
                          }))
                        }
                        placeholder="Enter title"
                        required
                      />
                    </div>

                    {contentType !== "session" && (
                      <div className="space-y-2">
                        <Label htmlFor="content">Content</Label>
                        <Textarea
                          id="content"
                          value={contentForm.content}
                          onChange={(e) =>
                            setContentForm((prev) => ({
                              ...prev,
                              content: e.target.value,
                            }))
                          }
                          placeholder="Enter content (markdown supported)"
                          rows={8}
                          required
                        />
                      </div>
                    )}

                    {contentType === "session" && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="description">Description</Label>
                          <Textarea
                            id="description"
                            value={contentForm.description}
                            onChange={(e) =>
                              setContentForm((prev) => ({
                                ...prev,
                                description: e.target.value,
                              }))
                            }
                            placeholder="Enter session description"
                            rows={4}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="date">Date</Label>
                          <Input
                            id="date"
                            type="datetime-local"
                            value={contentForm.date}
                            onChange={(e) =>
                              setContentForm((prev) => ({
                                ...prev,
                                date: e.target.value,
                              }))
                            }
                            required
                          />
                        </div>
                      </>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="roleAccess">Access Level</Label>
                      <Select
                        value={contentForm.roleAccess[0] || "community_student"}
                        onValueChange={(value) =>
                          setContentForm((prev) => ({
                            ...prev,
                            roleAccess: [value],
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="community_student">
                            Community (Free)
                          </SelectItem>
                          <SelectItem value="academy_student">
                            Academy (Premium)
                          </SelectItem>
                          <SelectItem value="mentorship_student">
                            Mentorship (Elite)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Button
                        type="submit"
                        variant="cta"
                        disabled={contentLoading}
                        className="flex-1"
                      >
                        {contentLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            {editingContent ? "Updating..." : "Creating..."}
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4 mr-2" />
                            {editingContent
                              ? `Update ${
                                  contentType.charAt(0).toUpperCase() +
                                  contentType.slice(1)
                                }`
                              : `Create ${
                                  contentType.charAt(0).toUpperCase() +
                                  contentType.slice(1)
                                }`}
                          </>
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setContentModalOpen(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Beginner 6-Month Course</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Completion %</TableHead>
                        <TableHead>Access</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {courses
                        .filter((course) =>
                          course.roleAccess.includes("academy_student")
                        )
                        .map((course) => (
                          <TableRow key={course.id}>
                            <TableCell>{course.title}</TableCell>
                            <TableCell>{course.completion || 0}%</TableCell>
                            <TableCell>
                              {getAccessLevelBadge(course.roleAccess)}
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleEditContent(course, "course")
                                }
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleDeleteContent(course.id, "course")
                                }
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Mentorship Subscribers</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users
                        .filter((user) => user.plan === "mentorship")
                        .map((user) => (
                          <TableRow key={user.id}>
                            <TableCell>{user.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{getStatusBadge(user.status)}</TableCell>
                            <TableCell>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleExtendSubscription(user.id)
                                }
                              >
                                Extend
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleCancelSubscription(user.id)
                                }
                              >
                                Cancel
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="sessions" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Live Session Management</h3>
              <Dialog
                open={contentModalOpen}
                onOpenChange={setContentModalOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="cta"
                    onClick={() => {
                      setEditingContent(null);
                      setContentType("session");
                      setContentForm({
                        title: "",
                        content: "",
                        description: "",
                        date: "",
                        roleAccess: ["community_student"],
                      });
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Session
                  </Button>
                </DialogTrigger>
              </Dialog>
            </div>

            <div className="grid gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Live Sessions</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Assigned Plan</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sessions.map((session) => (
                        <TableRow key={session.id}>
                          <TableCell>{session.title}</TableCell>
                          <TableCell>
                            {new Date(session.date).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {getAccessLevelBadge(session.roleAccess)}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleEditContent(session, "session")
                              }
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleDeleteContent(session.id, "session")
                              }
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="signals" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Signal Management</h3>
              <Dialog
                open={contentModalOpen}
                onOpenChange={setContentModalOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="cta"
                    onClick={() => {
                      setEditingContent(null);
                      setContentType("signal");
                      setContentForm({
                        title: "",
                        content: "",
                        description: "",
                        date: "",
                        roleAccess: ["community_student"],
                      });
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Signal
                  </Button>
                </DialogTrigger>
              </Dialog>
            </div>

            <div className="grid gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Trading Signals</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Access</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {signals.map((signal) => (
                        <TableRow key={signal.id}>
                          <TableCell>{signal.title}</TableCell>
                          <TableCell>
                            {new Date(signal.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {getAccessLevelBadge(signal.roleAccess)}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleEditContent(signal, "signal")
                              }
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleDeleteContent(signal.id, "signal")
                              }
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
