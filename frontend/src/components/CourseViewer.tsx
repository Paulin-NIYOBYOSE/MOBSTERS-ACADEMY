import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  Play,
  Clock,
  BookOpen,
  CheckCircle,
  PlayCircle,
  User,
  Calendar,
} from "lucide-react";
import { courseService } from "@/services/courseService";
import { useToast } from "@/hooks/use-toast";

interface Course {
  id: number;
  title: string;
  description: string;
  progress?: number;
  completed?: boolean;
  videos?: any[];
  thumbnailUrl?: string;
  duration?: number;
  level?: string;
}

interface CourseViewerProps {
  course: Course;
  onBack: () => void;
}

export const CourseViewer: React.FC<CourseViewerProps> = ({
  course,
  onBack,
}) => {
  const { toast } = useToast();
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [videos, setVideos] = useState<any[]>(course.videos || []);
  const [courseProgress, setCourseProgress] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const baseUrl = "http://localhost:3000"; // Backend URL

  const currentVideo = selectedVideo || videos[currentVideoIndex];

  // Get full video URL
  const getVideoUrl = (video: any) => {
    if (!video) return "";
    const url = video.videoUrl || video.url || "";
    // If URL starts with /uploads, prepend backend URL
    if (url.startsWith("/uploads")) {
      const fullUrl = `${baseUrl}${url}`;
      console.log("[CourseViewer] Video URL:", fullUrl);
      return fullUrl;
    }
    console.log("[CourseViewer] Video URL (external):", url);
    return url;
  };

  useEffect(() => {
    loadCourseData();
  }, [course.id]);

  const loadCourseData = async () => {
    try {
      setLoading(true);

      // Use course videos if already loaded
      if (course.videos && course.videos.length > 0) {
        setVideos(course.videos);
        setCourseProgress({
          progress: course.progress || 0,
          completedVideos: course.videos.filter((v: any) => v.completed).length,
          totalVideos: course.videos.length,
        });
      } else {
        // Fetch course videos from backend
        try {
          const videosData = await courseService.getCourseVideos(course.id);
          setVideos(videosData || []);
          setCourseProgress({
            progress: 0,
            completedVideos: 0,
            totalVideos: videosData?.length || 0,
          });
        } catch (error) {
          console.error("Error fetching videos:", error);
          setVideos([]);
          setCourseProgress({
            progress: 0,
            completedVideos: 0,
            totalVideos: 0,
          });
        }
      }
    } catch (error) {
      console.error("Error loading course data:", error);
      toast({
        title: "Error",
        description: "Failed to load course data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVideoSelect = (video: any, index: number) => {
    setSelectedVideo(video);
    setCurrentVideoIndex(index);
  };

  const handleVideoComplete = async () => {
    if (!currentVideo) return;

    // Update local state (backend progress tracking not yet implemented)
    const updatedVideos = videos.map((v) =>
      v.id === currentVideo.id ? { ...v, completed: true } : v
    );
    setVideos(updatedVideos);

    // Update progress
    const completedCount = updatedVideos.filter((v) => v.completed).length;
    const progress = Math.round((completedCount / updatedVideos.length) * 100);

    setCourseProgress({
      progress,
      completedVideos: completedCount,
      totalVideos: updatedVideos.length,
    });

    toast({
      title: "Video Completed",
      description: `Progress: ${progress}%`,
    });
  };

  const handleNextVideo = () => {
    if (currentVideoIndex < videos.length - 1) {
      const nextIndex = currentVideoIndex + 1;
      setCurrentVideoIndex(nextIndex);
      setSelectedVideo(videos[nextIndex]);
    }
  };

  const handlePreviousVideo = () => {
    if (currentVideoIndex > 0) {
      const prevIndex = currentVideoIndex - 1;
      setCurrentVideoIndex(prevIndex);
      setSelectedVideo(videos[prevIndex]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Courses
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            {course.title}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            {course.description}
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Video Player */}
        <div className="lg:col-span-2">
          {/* Modern Video Player Card */}
          <Card className="mb-6 border-0 shadow-lg">
            <CardContent className="p-0">
              {currentVideo ? (
                <div className="relative">
                  {/* Video container with modern styling */}
                  <div className="aspect-video bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-lg overflow-hidden shadow-2xl">
                    <video
                      key={currentVideo.id}
                      src={getVideoUrl(currentVideo)}
                      width="100%"
                      height="100%"
                      controls
                      crossOrigin="anonymous"
                      onEnded={() => {
                        handleVideoComplete();
                        handleNextVideo();
                      }}
                      onError={(e) => {
                        console.error("[CourseViewer] Video error:", e);
                        console.error(
                          "[CourseViewer] Failed URL:",
                          getVideoUrl(currentVideo)
                        );
                        toast({
                          title: "Video Error",
                          description:
                            "Failed to load video. Check console for details.",
                          variant: "destructive",
                        });
                      }}
                      onLoadStart={() => {
                        console.log("[CourseViewer] Video loading started");
                      }}
                      onCanPlay={() => {
                        console.log("[CourseViewer] Video can play");
                      }}
                      className="w-full h-full object-contain"
                      style={{
                        filter: "contrast(1.05) saturate(1.1)",
                      }}
                    />
                  </div>

                  {/* Video quality badge */}
                  <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-full">
                    <span className="text-xs font-medium text-white flex items-center gap-1.5">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      HD
                    </span>
                  </div>
                </div>
              ) : (
                <div className="aspect-video bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 rounded-lg flex items-center justify-center relative overflow-hidden">
                  {/* Animated background */}
                  <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
                  <div className="absolute top-0 left-0 w-full h-full">
                    <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
                    <div
                      className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl animate-pulse"
                      style={{ animationDelay: "1s" }}
                    ></div>
                  </div>

                  <div className="text-center relative z-10">
                    <div className="relative inline-block">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-xl opacity-50"></div>
                      <PlayCircle className="w-20 h-20 text-gray-400 dark:text-gray-500 mx-auto mb-4 relative" />
                    </div>
                    <p className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">
                      Select a video to start watching
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                      Choose from the playlist below
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Video Info - Modern Design */}
          {currentVideo && (
            <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
              <CardHeader className="border-b border-gray-200 dark:border-gray-700">
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg">
                    <Play className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                    {currentVideo.title}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {currentVideo.description && (
                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    {currentVideo.description}
                  </p>
                )}

                {/* Video metadata */}
                <div className="flex items-center gap-6 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                  {currentVideo.duration && (
                    <div className="flex items-center gap-2 text-sm">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                        <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {Math.floor(currentVideo.duration / 60)}:
                          {(currentVideo.duration % 60)
                            .toString()
                            .padStart(2, "0")}
                        </div>
                        <div className="text-xs text-gray-500">Duration</div>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                      <User className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        Instructor
                      </div>
                      <div className="text-xs text-gray-500">Expert Trader</div>
                    </div>
                  </div>
                </div>

                {/* Navigation Buttons - Modern Style */}
                <div className="flex flex-wrap gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePreviousVideo}
                    disabled={currentVideoIndex === 0}
                    className="flex-1 sm:flex-none border-2 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNextVideo}
                    disabled={currentVideoIndex === videos.length - 1}
                    className="flex-1 sm:flex-none border-2 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                    <svg
                      className="w-4 h-4 ml-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Button>
                  {!currentVideo.completed && (
                    <Button
                      size="sm"
                      onClick={handleVideoComplete}
                      className="flex-1 sm:flex-none ml-auto bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white border-0 shadow-lg hover:shadow-xl transition-all"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Mark Complete
                    </Button>
                  )}
                  {currentVideo.completed && (
                    <div className="flex-1 sm:flex-none ml-auto px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg flex items-center gap-2 text-sm font-medium">
                      <CheckCircle className="w-4 h-4" />
                      Completed
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Course Sidebar */}
        <div className="space-y-6">
          {/* Course Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Course Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Overall Progress</span>
                    <span>{courseProgress?.progress || 0}%</span>
                  </div>
                  <Progress
                    value={courseProgress?.progress || 0}
                    className="h-2"
                  />
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <CheckCircle className="w-4 h-4" />
                  {courseProgress?.completedVideos || 0} of{" "}
                  {courseProgress?.totalVideos || videos.length} videos
                  completed
                </div>
                {course.level && (
                  <Badge variant="secondary" className="w-fit">
                    {course.level}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Video List */}
          <Card>
            <CardHeader>
              <CardTitle>Course Videos</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1">
                {videos.map((video, index) => (
                  <button
                    key={video.id || index}
                    onClick={() => handleVideoSelect(video, index)}
                    className={`w-full text-left p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-l-4 ${
                      currentVideoIndex === index
                        ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                        : "border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        {video.completed ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <PlayCircle className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-gray-900 dark:text-white truncate">
                          {video.title}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-1">
                          <span>Video {index + 1}</span>
                          {video.duration && (
                            <>
                              <span>•</span>
                              <span>
                                {Math.floor(video.duration / 60)}:
                                {(video.duration % 60)
                                  .toString()
                                  .padStart(2, "0")}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              {videos.length === 0 && (
                <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                  <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No videos available for this course yet.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
