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
  Eye,
  Download,
} from "lucide-react";
import { authService } from "@/services/authService";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { Navigate, useLocation } from "react-router-dom";

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
  description: string;
  roleAccess: string[];
  createdAt: string;
  updatedAt: string;
  completion?: number;
  category?: string;
  duration?: number;
  level?: "beginner" | "intermediate" | "advanced";
  isPublished?: boolean;
  thumbnailUrl?: string;
}

interface CourseVideo {
  id: number;
  title: string;
  videoUrl: string;
  duration?: number;
  order?: number;
  createdAt: string;
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
    category: "",
    duration: 0,
    level: "beginner" as "beginner" | "intermediate" | "advanced",
    isPublished: true,
    thumbnailFile: null as File | null,
  });
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [roleEditOpen, setRoleEditOpen] = useState(false);
  const [roleEditUserId, setRoleEditUserId] = useState<number | null>(null);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [courseVideoDrafts, setCourseVideoDrafts] = useState<
    { title: string; file?: File | null; order?: number }[]
  >([]);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [currentCourseVideos, setCurrentCourseVideos] = useState<CourseVideo[]>(
    []
  );
  const [currentCourseId, setCurrentCourseId] = useState<number | null>(null);
  const [videoForm, setVideoForm] = useState<{
    title: string;
    file?: File | null;
    order?: number;
  }>({ title: "", file: null, order: 0 });
  const [coursePreviewOpen, setCoursePreviewOpen] = useState(false);
  const [previewCourse, setPreviewCourse] = useState<Course | null>(null);

  const { toast } = useToast();
  const { refreshUser } = useAuth();
  const location = useLocation();

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
        coursesData, // Changed to use getAllCourses for admin to fetch all data
        sessionsData,
        signalsData,
        usersData,
        statsData,
      ] = await Promise.all([
        authService.getPendingRoleRequests(),
        authService.getAllCourses(), // FIX: Use admin-specific fetch to get all courses, bypassing role filters
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
      console.log("Fetched all courses for admin:", coursesData); // Debug log to confirm fetch
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

  // ... (rest of the code remains the same, as delete/update actions are already implemented below)

  const openManageVideos = async (courseId: number) => {
    try {
      const videos = await authService.getCourseVideos(courseId);
      setCurrentCourseId(courseId);
      setCurrentCourseVideos(videos || []);
      setVideoModalOpen(true);
    } catch (e) {
      toast({
        title: "Error",
        description: "Failed to load course videos",
        variant: "destructive",
      });
    }
  };

  const handleAddVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCourseId) return;
    try {
      if (videoForm.file) {
        const fd = new FormData();
        fd.append("title", videoForm.title);
        fd.append("file", videoForm.file);
        if (videoForm.order) {
          fd.append("order", videoForm.order.toString());
        }
        await authService.addCourseVideoFile(currentCourseId, fd);
        const videos = await authService.getCourseVideos(currentCourseId);
        setCurrentCourseVideos(videos || []);
        setVideoForm({
          title: "",
          file: null,
          order: (videoForm.order || 0) + 1,
        });
        toast({ title: "Video Added", description: "Video added to course." });
      } else {
        toast({
          title: "Error",
          description: "Please select a video file",
          variant: "destructive",
        });
      }
    } catch (e) {
      toast({
        title: "Error",
        description: "Failed to add video",
        variant: "destructive",
      });
    }
  };

  const handleDeleteVideo = async (videoId: number) => {
    if (!currentCourseId) return;
    try {
      await authService.deleteCourseVideo(currentCourseId, videoId);
      const videos = await authService.getCourseVideos(currentCourseId);
      setCurrentCourseVideos(videos || []);
      toast({ title: "Video Deleted", description: "Video removed." });
    } catch (e) {
      toast({
        title: "Error",
        description: "Failed to delete video",
        variant: "destructive",
      });
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
      await refreshUser();
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

  const handleRejectRequest = async (requestId: number) => {
    setProcessingIds((prev) => new Set(prev).add(requestId));
    try {
      await authService.rejectRoleRequest(requestId);
      toast({
        title: "Request Rejected",
        description: "The role request has been rejected.",
      });
      await loadData();
      await refreshUser();
    } catch (error) {
      console.error("Failed to reject request:", error);
      toast({
        title: "Error",
        description: "Failed to reject request. Please try again.",
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
        const courseData = {
          title: contentForm.title,
          content: contentForm.content,
          description: contentForm.description,
          roleAccess: contentForm.roleAccess,
          category: contentForm.category,
          duration: contentForm.duration,
          level: contentForm.level,
          isPublished: contentForm.isPublished,
        };

        if (editingContent) {
          // Update existing course
          await authService.updateCourse(
            (editingContent as Course).id,
            courseData
          );
          toast({
            title: "Course Updated",
            description: "The course has been updated successfully.",
          });
        } else {
          // Create new course
          const created = await authService.createCourse(courseData);
          toast({
            title: "Course Created",
            description: "The course has been created successfully.",
          });

          // Upload thumbnail if provided
          if (contentForm.thumbnailFile && (created as any)?.id) {
            try {
              const fd = new FormData();
              fd.append("thumbnail", contentForm.thumbnailFile);
              await authService.uploadCourseThumbnail((created as any).id, fd);
            } catch (e) {
              console.error("Failed to upload thumbnail", e);
            }
          }

          // Upload videos if any
          if ((created as any)?.id && courseVideoDrafts.length > 0) {
            for (const v of courseVideoDrafts) {
              try {
                const fd = new FormData();
                fd.append("title", v.title);
                if (v.file) fd.append("file", v.file);
                if (v.order) fd.append("order", v.order.toString());
                await authService.addCourseVideoFile((created as any).id, fd);
              } catch (e) {
                console.error("Failed to upload course video", e);
              }
            }
          }
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
        category: "",
        duration: 0,
        level: "beginner",
        isPublished: true,
        thumbnailFile: null,
      });
      setCourseVideoDrafts([]);
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

  const handleToggleCoursePublish = async (
    courseId: number,
    currentStatus: boolean
  ) => {
    try {
      await authService.updateCourse(courseId, { isPublished: !currentStatus });
      toast({
        title: "Course Updated",
        description: `Course ${
          !currentStatus ? "published" : "unpublished"
        } successfully.`,
      });
      await loadData();
    } catch (error) {
      console.error("Failed to toggle course publish status:", error);
      toast({
        title: "Error",
        description: "Failed to update course status.",
        variant: "destructive",
      });
    }
  };

  const handleDuplicateCourse = async (courseId: number) => {
    try {
      const courseToDuplicate = courses.find((c) => c.id === courseId);
      if (!courseToDuplicate) return;

      const duplicatedCourse = {
        ...courseToDuplicate,
        title: `${courseToDuplicate.title} (Copy)`,
        id: undefined,
      };

      await authService.createCourse(duplicatedCourse);
      toast({
        title: "Course Duplicated",
        description: "Course duplicated successfully.",
      });
      await loadData();
    } catch (error) {
      console.error("Failed to duplicate course:", error);
      toast({
        title: "Error",
        description: "Failed to duplicate course.",
        variant: "destructive",
      });
    }
  };

  const handleExportCourseData = async (courseId: number) => {
    try {
      const course = courses.find((c) => c.id === courseId);
      if (!course) return;

      const courseData = {
        ...course,
        videos: currentCourseVideos,
      };

      const dataStr = JSON.stringify(courseData, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `course-${course.title}-${
        new Date().toISOString().split("T")[0]
      }.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Data Exported",
        description: "Course data exported successfully.",
      });
    } catch (error) {
      console.error("Failed to export course data:", error);
      toast({
        title: "Error",
        description: "Failed to export course data.",
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

  const handleAssignRoles = async () => {
    if (!roleEditUserId) return;
    try {
      await authService.assignRoles(roleEditUserId, selectedRoles);
      toast({
        title: "Roles Updated",
        description: "User roles updated successfully.",
      });
      setRoleEditOpen(false);
      setRoleEditUserId(null);
      setSelectedRoles([]);
      await loadData();
    } catch (error) {
      console.error("Failed to assign roles:", error);
      toast({
        title: "Error",
        description: "Failed to update roles.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = (userId: number) => {
    toast({
      title: "Are you sure you want to delete this user?",
      description: "This action can't be undone.",
      action: (
        <div className="flex flex-col gap-3 mt-3">
          <Button
            variant="destructive"
            size="sm"
            onClick={async () => {
              try {
                await authService.deleteUser(userId);
                toast({
                  title: "User Deleted",
                  description: "User removed successfully.",
                });
                await loadData();
              } catch (error) {
                console.error("Failed to delete user:", error);
                toast({
                  title: "Error",
                  description: "Failed to delete user.",
                  variant: "destructive",
                });
              }
            }}
          >
            ✅ Yes, Delete
          </Button>
          <Button variant="outline" size="sm">
            ❌ Cancel
          </Button>
        </div>
      ),
    });
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

  const getLevelBadge = (level: string) => {
    switch (level) {
      case "beginner":
        return <Badge variant="secondary">Beginner</Badge>;
      case "intermediate":
        return <Badge variant="default">Intermediate</Badge>;
      case "advanced":
        return <Badge variant="destructive">Advanced</Badge>;
      default:
        return <Badge variant="outline">{level}</Badge>;
    }
  };

  const getPublishStatusBadge = (isPublished: boolean) => {
    return isPublished ? (
      <Badge variant="default">Published</Badge>
    ) : (
      <Badge variant="outline">Draft</Badge>
    );
  };

  const handleEditContent = (
    content: Course | LiveSession | Signal,
    type: "course" | "session" | "signal"
  ) => {
    setEditingContent(content);
    setContentType(type);
    const courseContent = content as Course;
    setContentForm({
      title: content.title,
      content: (content as Course | Signal).content || "",
      description: (content as Course | LiveSession).description || "",
      date: (content as LiveSession).date || "",
      roleAccess: content.roleAccess,
      category: courseContent.category || "",
      duration: courseContent.duration || 0,
      level: courseContent.level || "beginner",
      isPublished: courseContent.isPublished !== false,
      thumbnailFile: null,
    });
    setContentModalOpen(true);
  };

  const handleDeleteContent = async (
    id: number,
    type: "course" | "session" | "signal"
  ) => {
    if (
      !confirm(
        `Are you sure you want to delete this ${type}? This action cannot be undone.`
      )
    )
      return; // Enhanced confirmation
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

  const handlePreviewCourse = (course: Course) => {
    setPreviewCourse(course);
    setCoursePreviewOpen(true);
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

  const pathParts = location.pathname.split("/").filter(Boolean);
  const section =
    pathParts[0] === "dashboard" ? pathParts[1] || "overview" : pathParts[1];
  if (pathParts[0] === "admin" && !section) {
    return <Navigate to="/dashboard" replace />;
  }

  // Enhanced course form with additional fields
  const renderCourseForm = () => (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Input
            id="category"
            value={contentForm.category}
            onChange={(e) =>
              setContentForm((prev) => ({
                ...prev,
                category: e.target.value,
              }))
            }
            placeholder="e.g., Technical Analysis"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="duration">Duration (minutes)</Label>
          <Input
            id="duration"
            type="number"
            value={contentForm.duration}
            onChange={(e) =>
              setContentForm((prev) => ({
                ...prev,
                duration: parseInt(e.target.value) || 0,
              }))
            }
            placeholder="120"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="level">Difficulty Level</Label>
        <Select
          value={contentForm.level}
          onValueChange={(value: "beginner" | "intermediate" | "advanced") =>
            setContentForm((prev) => ({
              ...prev,
              level: value,
            }))
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="beginner">Beginner</SelectItem>
            <SelectItem value="intermediate">Intermediate</SelectItem>
            <SelectItem value="advanced">Advanced</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="thumbnail">Thumbnail Image</Label>
        <Input
          id="thumbnail"
          type="file"
          accept="image/*"
          onChange={(e) =>
            setContentForm((prev) => ({
              ...prev,
              thumbnailFile: e.target.files?.[0] || null,
            }))
          }
        />
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="isPublished"
          checked={contentForm.isPublished}
          onChange={(e) =>
            setContentForm((prev) => ({
              ...prev,
              isPublished: e.target.checked,
            }))
          }
          className="rounded border-gray-300"
        />
        <Label htmlFor="isPublished">Publish immediately</Label>
      </div>
    </>
  );

  const renderOverview = () => (
    <>
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
          <CardTitle>Course Progress Overview</CardTitle>
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
    </>
  );

  const renderUsers = () => (
    <>
      <Dialog open={roleEditOpen} onOpenChange={setRoleEditOpen}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Manage Roles</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Label>Assign Roles</Label>
            <div className="flex flex-wrap gap-2">
              {[
                "community_student",
                "academy_student",
                "mentorship_student",
                "admin",
              ].map((role) => (
                <Button
                  key={role}
                  type="button"
                  variant={selectedRoles.includes(role) ? "cta" : "outline"}
                  size="sm"
                  onClick={() => {
                    setSelectedRoles((prev) =>
                      prev.includes(role)
                        ? prev.filter((r) => r !== role)
                        : [...prev, role]
                    );
                  }}
                >
                  {role}
                </Button>
              ))}
            </div>
            <div className="flex gap-2 pt-2">
              <Button onClick={handleAssignRoles} variant="cta">
                Save
              </Button>
              <Button variant="outline" onClick={() => setRoleEditOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Pending Role Requests</CardTitle>
          <CardDescription>
            Approve or reject user upgrade requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Program</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roleRequests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5}>
                    <span className="text-sm text-muted-foreground">
                      No pending requests
                    </span>
                  </TableCell>
                </TableRow>
              ) : (
                roleRequests.map((req) => (
                  <TableRow key={req.id}>
                    <TableCell>{req.user?.name}</TableCell>
                    <TableCell>{req.user?.email}</TableCell>
                    <TableCell>{req.program}</TableCell>
                    <TableCell>{req.status}</TableCell>
                    <TableCell className="space-x-2">
                      <Button
                        size="sm"
                        variant="cta"
                        disabled={processingIds.has(req.id)}
                        onClick={() => handleApproveRequest(req.id)}
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-destructive border-destructive"
                        disabled={processingIds.has(req.id)}
                        onClick={() => handleRejectRequest(req.id)}
                      >
                        Reject
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

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
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditUser(user)}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive border-destructive"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                      <Button
                        variant="cta"
                        size="sm"
                        onClick={() => {
                          setRoleEditUserId(user.id);
                          const roles =
                            (user as any).roles
                              ?.map((r: any) => r.role?.name)
                              .filter(Boolean) || [];
                          setSelectedRoles(roles);
                          setRoleEditOpen(true);
                        }}
                      >
                        Manage Roles
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Dialog open={userModalOpen} onOpenChange={setUserModalOpen}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
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
                <Button type="submit" variant="cta" disabled={contentLoading}>
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
    </>
  );

  const renderCourses = () => (
    <>
      <Dialog open={coursePreviewOpen} onOpenChange={setCoursePreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Course Preview: {previewCourse?.title}</DialogTitle>
          </DialogHeader>
          {previewCourse && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Description:</strong>
                  <p className="mt-1">{previewCourse.description}</p>
                </div>
                <div>
                  <strong>Content:</strong>
                  <div className="mt-1 prose prose-sm max-w-none">
                    {previewCourse.content}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <strong>Category:</strong> {previewCourse.category}
                </div>
                <div>
                  <strong>Duration:</strong> {previewCourse.duration} min
                </div>
                <div>
                  <strong>Level:</strong> {previewCourse.level}
                </div>
              </div>
              <div className="text-sm">
                <strong>Access Levels:</strong>
                <div className="mt-1 flex gap-1">
                  {getAccessLevelBadge(previewCourse.roleAccess)}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Course Management</h3>
        <Dialog open={contentModalOpen} onOpenChange={setContentModalOpen}>
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
                  category: "",
                  duration: 0,
                  level: "beginner",
                  isPublished: true,
                  thumbnailFile: null,
                });
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Course
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingContent
                  ? `Edit ${
                      contentType.charAt(0).toUpperCase() + contentType.slice(1)
                    }`
                  : `Create New ${
                      contentType.charAt(0).toUpperCase() + contentType.slice(1)
                    }`}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleContentSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="contentType">Content Type</Label>
                <Select
                  value={contentType}
                  onValueChange={(value: "course" | "session" | "signal") => {
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

              {contentType === "course" && (
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
                    placeholder="Enter course description"
                    rows={4}
                    required
                  />
                </div>
              )}

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

              {contentType === "course" && renderCourseForm()}

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

              {contentType === "course" && (
                <div className="space-y-3 border rounded-md p-3">
                  <div className="flex items-center justify-between">
                    <Label className="font-semibold">Course Videos</Label>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        setCourseVideoDrafts((prev) => [
                          ...prev,
                          { title: "", file: null, order: prev.length },
                        ])
                      }
                    >
                      Add Video
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {courseVideoDrafts.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        No videos added yet.
                      </p>
                    ) : (
                      courseVideoDrafts.map((v, idx) => (
                        <div
                          key={idx}
                          className="grid md:grid-cols-3 gap-3 border rounded p-3"
                        >
                          <div className="space-y-2">
                            <Label>Title</Label>
                            <Input
                              value={v.title}
                              onChange={(e) =>
                                setCourseVideoDrafts((prev) => {
                                  const next = [...prev];
                                  next[idx] = {
                                    ...next[idx],
                                    title: e.target.value,
                                  };
                                  return next;
                                })
                              }
                              placeholder="Episode title"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Order</Label>
                            <Input
                              type="number"
                              value={v.order || idx}
                              onChange={(e) =>
                                setCourseVideoDrafts((prev) => {
                                  const next = [...prev];
                                  next[idx] = {
                                    ...next[idx],
                                    order: parseInt(e.target.value) || idx,
                                  };
                                  return next;
                                })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Video File</Label>
                            <Input
                              type="file"
                              accept="video/*"
                              onChange={(e) =>
                                setCourseVideoDrafts((prev) => {
                                  const next = [...prev];
                                  next[idx] = {
                                    ...next[idx],
                                    file: e.target.files?.[0] || null,
                                  };
                                  return next;
                                })
                              }
                            />
                          </div>
                          <div className="md:col-span-3 flex justify-end">
                            <Button
                              type="button"
                              variant="outline"
                              className="text-destructive border-destructive"
                              onClick={() =>
                                setCourseVideoDrafts((prev) =>
                                  prev.filter((_, i) => i !== idx)
                                )
                              }
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

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
            <CardTitle>All Courses</CardTitle>
            <CardDescription>Manage all courses in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Access</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {courses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8}>
                      <span className="text-sm text-muted-foreground">
                        No courses available
                      </span>
                    </TableCell>
                  </TableRow>
                ) : (
                  courses.map((course) => (
                    <TableRow key={course.id}>
                      <TableCell className="font-medium">
                        {course.title}
                      </TableCell>
                      <TableCell>{course.category || "-"}</TableCell>
                      <TableCell>
                        {getLevelBadge(course.level || "beginner")}
                      </TableCell>
                      <TableCell>{course.duration || 0} min</TableCell>
                      <TableCell>
                        {getPublishStatusBadge(course.isPublished !== false)}
                      </TableCell>
                      <TableCell>
                        {getAccessLevelBadge(course.roleAccess)}
                      </TableCell>
                      <TableCell>
                        {new Date(course.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1 flex-wrap">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePreviewCourse(course)}
                          >
                            <Eye className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditContent(course, "course")}
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openManageVideos(course.id)}
                          >
                            <Video className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleToggleCoursePublish(
                                course.id,
                                course.isPublished !== false
                              )
                            }
                          >
                            {course.isPublished !== false
                              ? "Unpublish"
                              : "Publish"}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDuplicateCourse(course.id)}
                          >
                            Duplicate
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleExportCourseData(course.id)}
                          >
                            <Download className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-destructive border-destructive"
                            onClick={() =>
                              handleDeleteContent(course.id, "course")
                            }
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Course Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4 text-center">
              <div className="space-y-2">
                <div className="text-2xl font-bold">{courses.length}</div>
                <div className="text-sm text-muted-foreground">
                  Total Courses
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold">
                  {courses.filter((c) => c.isPublished !== false).length}
                </div>
                <div className="text-sm text-muted-foreground">Published</div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold">
                  {courses.filter((c) => c.level === "beginner").length}
                </div>
                <div className="text-sm text-muted-foreground">Beginner</div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold">
                  {courses.reduce((acc, c) => acc + (c.duration || 0), 0)}
                </div>
                <div className="text-sm text-muted-foreground">
                  Total Minutes
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={videoModalOpen} onOpenChange={setVideoModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Manage Course Videos</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <form onSubmit={handleAddVideo} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="videoTitle">Video Title</Label>
                <Input
                  id="videoTitle"
                  value={videoForm.title}
                  onChange={(e) =>
                    setVideoForm((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="Enter video title"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="videoOrder">Order</Label>
                <Input
                  id="videoOrder"
                  type="number"
                  value={videoForm.order || 0}
                  onChange={(e) =>
                    setVideoForm((prev) => ({
                      ...prev,
                      order: parseInt(e.target.value) || 0,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="videoFile">Video File</Label>
                <Input
                  id="videoFile"
                  type="file"
                  accept="video/*"
                  onChange={(e) =>
                    setVideoForm((prev) => ({
                      ...prev,
                      file: e.target.files?.[0] || null,
                    }))
                  }
                  required
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" variant="cta">
                  <Upload className="w-4 h-4 mr-2" />
                  Add Video
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setVideoModalOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
            <div className="mt-6">
              <h4 className="text-sm font-medium mb-2">Existing Videos</h4>
              {currentCourseVideos.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No videos added yet.
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentCourseVideos
                      .sort((a, b) => (a.order || 0) - (b.order || 0))
                      .map((video) => (
                        <TableRow key={video.id}>
                          <TableCell>{video.order || 0}</TableCell>
                          <TableCell>{video.title}</TableCell>
                          <TableCell>{video.duration || "N/A"}</TableCell>
                          <TableCell>
                            {new Date(video.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-destructive border-destructive"
                              onClick={() => handleDeleteVideo(video.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );

  const renderSessions = () => (
    <>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Live Session Management</h3>
        <Dialog open={contentModalOpen} onOpenChange={setContentModalOpen}>
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
                  category: "",
                  duration: 0,
                  level: "beginner",
                  isPublished: true,
                  thumbnailFile: null,
                });
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Session
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingContent
                  ? `Edit ${
                      contentType.charAt(0).toUpperCase() + contentType.slice(1)
                    }`
                  : `Create New ${
                      contentType.charAt(0).toUpperCase() + contentType.slice(1)
                    }`}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleContentSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="contentType">Content Type</Label>
                <Select
                  value={contentType}
                  onValueChange={(value: "course" | "session" | "signal") => {
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
            <CardTitle>Live Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Access</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sessions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5}>
                      <span className="text-sm text-muted-foreground">
                        No live sessions available
                      </span>
                    </TableCell>
                  </TableRow>
                ) : (
                  sessions.map((session) => (
                    <TableRow key={session.id}>
                      <TableCell>{session.title}</TableCell>
                      <TableCell>{session.description}</TableCell>
                      <TableCell>
                        {new Date(session.date).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {getAccessLevelBadge(session.roleAccess)}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditContent(session, "session")}
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
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );

  const renderSignals = () => (
    <>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Trading Signal Management</h3>
        <Dialog open={contentModalOpen} onOpenChange={setContentModalOpen}>
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
                  category: "",
                  duration: 0,
                  level: "beginner",
                  isPublished: true,
                  thumbnailFile: null,
                });
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Signal
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingContent
                  ? `Edit ${
                      contentType.charAt(0).toUpperCase() + contentType.slice(1)
                    }`
                  : `Create New ${
                      contentType.charAt(0).toUpperCase() + contentType.slice(1)
                    }`}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleContentSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="contentType">Content Type</Label>
                <Select
                  value={contentType}
                  onValueChange={(value: "course" | "session" | "signal") => {
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
                {signals.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4}>
                      <span className="text-sm text-muted-foreground">
                        No signals available
                      </span>
                    </TableCell>
                  </TableRow>
                ) : (
                  signals.map((signal) => (
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
                          onClick={() => handleEditContent(signal, "signal")}
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
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground text-lg">
            Manage role requests and content for Mobsters Forex Academy.
          </p>
        </div>
        <div className="space-y-6">
          {section === "overview" && renderOverview()}
          {section === "users" && renderUsers()}
          {section === "courses" && renderCourses()}
          {section === "sessions" && renderSessions()}
          {section === "signals" && renderSignals()}
        </div>
      </div>
    </div>
  );
};
