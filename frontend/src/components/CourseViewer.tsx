import React, { useState } from "react";
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

export const CourseViewer: React.FC<CourseViewerProps> = ({ course, onBack }) => {
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  const videos = course.videos || [];
  const currentVideo = selectedVideo || videos[currentVideoIndex];

  const handleVideoSelect = (video: any, index: number) => {
    setSelectedVideo(video);
    setCurrentVideoIndex(index);
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
    <div className="min-h-screen bg-gradient-to-br from-green-50/50 via-emerald-50/30 to-green-50/50 dark:from-slate-900/50 dark:via-slate-800/30 dark:to-slate-900/50">
      <div className="container mx-auto p-4 sm:p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={onBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
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
            <Card className="mb-6">
              <CardContent className="p-0">
                {currentVideo ? (
                  <div className="aspect-video bg-black rounded-lg overflow-hidden">
                    <video
                      src={currentVideo.videoUrl || currentVideo.url}
                      width="100%"
                      height="100%"
                      controls
                      onEnded={handleNextVideo}
                      className="w-full h-full"
                    />
                  </div>
                ) : (
                  <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <PlayCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 dark:text-gray-400">
                        Select a video to start watching
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Video Info */}
            {currentVideo && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Play className="w-5 h-5" />
                    {currentVideo.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {currentVideo.description}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    {currentVideo.duration && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {Math.floor(currentVideo.duration / 60)}:
                        {(currentVideo.duration % 60).toString().padStart(2, "0")}
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      Instructor
                    </div>
                  </div>
                  
                  {/* Navigation Buttons */}
                  <div className="flex gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePreviousVideo}
                      disabled={currentVideoIndex === 0}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleNextVideo}
                      disabled={currentVideoIndex === videos.length - 1}
                    >
                      Next
                    </Button>
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
                      <span>{course.progress || 0}%</span>
                    </div>
                    <Progress value={course.progress || 0} className="h-2" />
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <CheckCircle className="w-4 h-4" />
                    {videos.filter((v) => v.completed).length} of {videos.length} videos completed
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
                                  {(video.duration % 60).toString().padStart(2, "0")}
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
    </div>
  );
};