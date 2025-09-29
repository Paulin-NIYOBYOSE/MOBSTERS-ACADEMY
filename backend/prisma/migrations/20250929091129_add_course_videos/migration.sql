-- CreateTable
CREATE TABLE "CourseVideo" (
    "id" SERIAL NOT NULL,
    "courseId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "videoUrl" TEXT NOT NULL,
    "durationSec" INTEGER,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CourseVideo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CourseVideo_courseId_idx" ON "CourseVideo"("courseId");

-- CreateIndex
CREATE UNIQUE INDEX "CourseVideo_courseId_orderIndex_key" ON "CourseVideo"("courseId", "orderIndex");

-- AddForeignKey
ALTER TABLE "CourseVideo" ADD CONSTRAINT "CourseVideo_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
